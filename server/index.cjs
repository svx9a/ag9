const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const Database = require('better-sqlite3');
const mssql = require('mssql');
const mongoose = require('mongoose');
const appInsights = require('applicationinsights');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const gateway = require('./services/api-gateway.cjs');
const optimizer = require('./optimizer.cjs');
require('dotenv').config();

// Initialize Application Insights
if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
  appInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true, true)
    .setUseDiskRetryCaching(true)
    .setSendLiveMetrics(true)
    .start();
  
  // Set global telemetry client
  global.telemetry = appInsights.defaultClient;
} else {
  // Mock telemetry for local dev
  global.telemetry = {
    trackEvent: (e) => console.log('Telemetry Event:', e),
    trackException: (e) => console.error('Telemetry Exception:', e),
    trackRequest: (r) => console.log('Telemetry Request:', r)
  };
}

// Async Wrapper for Routes
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const isProd = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3001;
const dbType = process.env.MONGODB_URI ? 'mongodb' : (isProd ? 'mssql' : 'sqlite');

// MongoDB Schemas
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  phone: String,
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  created_at: { type: Date, default: Date.now }
});

const taskSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true },
  description: String,
  status: { type: String, default: 'pending' },
  priority: { type: String, default: 'medium' },
  due_date: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

const app = express();
if (isProd) {
  app.set('trust proxy', 1); // Trust first proxy (Vercel/Fly.io)
}
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Database Connection String for Azure SQL with Retry Logic
const sqlConfig = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
  server: process.env.SQL_SERVER,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true,
    trustServerCertificate: false
  },
  connectionTimeout: 30000,
  requestTimeout: 30000
};

let db;
let sqlPool;

async function initDb(retries = 5) {
  if (dbType === 'mongodb') {
    while (retries > 0) {
      try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB Atlas');
        return;
      } catch (err) {
        console.error(`MongoDB Connection Failed (${retries} retries left):`, err);
        retries -= 1;
        if (retries === 0) throw err;
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  } else if (dbType === 'mssql') {
    while (retries > 0) {
      try {
        sqlPool = await mssql.connect(sqlConfig);
        console.log('Connected to Azure SQL');
        
        // Initialize Azure SQL Schema
        await sqlPool.request().query(`
          IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
          CREATE TABLE users (
            id INT IDENTITY(1,1) PRIMARY KEY,
            email NVARCHAR(255) UNIQUE NOT NULL,
            phone NVARCHAR(50),
            password NVARCHAR(255) NOT NULL,
            role NVARCHAR(50) DEFAULT 'user',
            created_at DATETIME DEFAULT GETDATE()
          );

          IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'daily_tasks')
          CREATE TABLE daily_tasks (
            id INT IDENTITY(1,1) PRIMARY KEY,
            user_id INT,
            title NVARCHAR(255) NOT NULL,
            description NVARCHAR(MAX),
            status NVARCHAR(50) DEFAULT 'pending',
            priority NVARCHAR(50) DEFAULT 'medium',
            due_date DATE DEFAULT CAST(GETDATE() AS DATE),
            created_at DATETIME DEFAULT GETDATE(),
            FOREIGN KEY(user_id) REFERENCES users(id)
          );
        `);
        return;
      } catch (err) {
        console.error(`Azure SQL Connection Failed (${retries} retries left):`, err);
        retries -= 1;
        if (retries === 0) throw err;
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  } else {
    try {
      db = new Database('database.db');
      db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          phone TEXT,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS daily_tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          title TEXT NOT NULL,
          description TEXT,
          status TEXT DEFAULT 'pending',
          priority TEXT DEFAULT 'medium',
          due_date DATE DEFAULT (date('now')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(user_id) REFERENCES users(id)
        );
      `);
      console.log('Connected to SQLite');
    } catch (err) {
      console.error('SQLite Initialization Failed:', err);
    }
  }
}

initDb().catch(err => {
  console.error('Final Database Initialization Error:', err);
  if (isProd) process.exit(1); // Fail fast in production
});

// Helper for unified DB access (SQL shim for Mongo if needed, or use models)
const query = {
  get: async (sql, params = []) => {
    if (dbType === 'mongodb') {
      // Very basic shim for existing SQL calls
      if (sql.includes('users WHERE email = ?')) return await User.findOne({ email: params[0] });
      if (sql.includes('users WHERE id = ?')) return await User.findById(params[0]);
      if (sql.includes('daily_tasks WHERE id = ?')) return await Task.findById(params[0]);
      return null;
    } else if (dbType === 'mssql') {
      const request = sqlPool.request();
      params.forEach((p, i) => request.input(`p${i}`, p));
      const result = await request.query(sql.replace(/\?/g, (match, i) => `@p${params.indexOf(params[i])}`));
      return result.recordset[0];
    } else {
      return db.prepare(sql).get(...params);
    }
  },
  all: async (sql, params = []) => {
    if (dbType === 'mongodb') {
      if (sql.includes('daily_tasks WHERE user_id = ?')) return await Task.find({ user_id: params[0] }).sort({ created_at: -1 });
      if (sql.includes('daily_tasks WHERE user_id = ? AND status = "pending"')) return await Task.find({ user_id: params[0], status: 'pending' });
      return [];
    } else if (dbType === 'mssql') {
      const request = sqlPool.request();
      params.forEach((p, i) => request.input(`p${i}`, p));
      const result = await request.query(sql.replace(/\?/g, (match, i) => `@p${params.indexOf(params[i])}`));
      return result.recordset;
    } else {
      return db.prepare(sql).all(...params);
    }
  },
  run: async (sql, params = []) => {
    if (dbType === 'mongodb') {
      if (sql.includes('INSERT INTO users')) {
        const user = new User({ email: params[0], password: params[1], phone: params[2] });
        await user.save();
        return { lastInsertRowid: user._id };
      }
      if (sql.includes('INSERT INTO daily_tasks')) {
        const task = new Task({ user_id: params[0], title: params[1], description: params[2], priority: params[3], due_date: params[4] });
        await task.save();
        return { lastInsertRowid: task._id };
      }
      if (sql.includes('UPDATE daily_tasks')) {
        // Simple update shim
        const taskId = params[4]; // Based on the existing PUT route
        await Task.findByIdAndUpdate(taskId, { status: params[0], title: params[1], description: params[2], priority: params[3] });
        return { changes: 1 };
      }
      if (sql.includes('DELETE FROM daily_tasks')) {
        await Task.findByIdAndDelete(params[0]);
        return { changes: 1 };
      }
      return { changes: 0 };
    } else if (dbType === 'mssql') {
      const request = sqlPool.request();
      params.forEach((p, i) => request.input(`p${i}`, p));
      const result = await request.query(sql.replace(/\?/g, (match, i) => `@p${params.indexOf(params[i])}`));
      return { lastInsertRowid: result.recordset ? result.recordset[0]?.id : null };
    } else {
      const result = db.prepare(sql).run(...params);
      return { lastInsertRowid: result.lastInsertRowid };
    }
  }
};

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString(), env: process.env.NODE_ENV });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString(), env: process.env.NODE_ENV });
});

app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    global.telemetry.trackRequest({
      name: `${req.method} ${req.path}`,
      url: req.url,
      duration: duration,
      resultCode: res.statusCode,
      success: res.statusCode < 400
    });
  });
  next();
});

// Session Store configuration based on database type
 let sessionStore;
  if (dbType === 'mongodb') {
    const mongoOptions = {
      mongoUrl: process.env.MONGODB_URI,
      ttl: 24 * 60 * 60,
      autoRemove: 'native'
    };
    // Handle different connect-mongo export styles
     try {
       // If it's Atlas SQL, don't even try MongoStore as it will fail later with CommandNotFound
       if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('atlas-sql')) {
         console.log('Atlas SQL detected, skipping MongoStore and using SQLite');
         const SQLiteStore = require('connect-sqlite3')(session);
         sessionStore = new SQLiteStore({ db: 'sessions.db', dir: './' });
       } else if (typeof MongoStore.create === 'function') {
         console.log('Using MongoStore.create');
         sessionStore = MongoStore.create(mongoOptions);
       } else if (MongoStore.default && typeof MongoStore.default.create === 'function') {
         console.log('Using MongoStore.default.create');
         sessionStore = MongoStore.default.create(mongoOptions);
       } else {
         throw new Error('MongoStore.create not found');
       }
     } catch (err) {
       console.log('Error initializing MongoStore, falling back to SQLite:', err.message);
       const SQLiteStore = require('connect-sqlite3')(session);
       sessionStore = new SQLiteStore({ db: 'sessions.db', dir: './' });
     }
  } else if (dbType === 'mssql') {
   const MSSQLStore = require('connect-mssql-v2')(session);
   sessionStore = new MSSQLStore(sqlConfig);
 } else {
   const SQLiteStore = require('connect-sqlite3')(session);
   sessionStore = new SQLiteStore({
     db: 'sessions.db',
     dir: './'
   });
 }

app.use(session({
  secret: process.env.SESSION_SECRET || 'agriflight-secret-key',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: isProd,
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Middleware to check auth
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('join-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Mock Drone Status Service
const drones = [
  { id: 'DF-01', model: 'AgriFlight T20L', battery: 85, status: 'idle', location: { lat: 13.7367, lng: 100.5231 } },
  { id: 'DF-02', model: 'AgriFlight T6L', battery: 42, status: 'flying', location: { lat: 13.7370, lng: 100.5240 } },
  { id: 'DF-03', model: 'AgriFlight T6Ls', battery: 15, status: 'low_battery', location: { lat: 13.7360, lng: 100.5220 } },
];

setInterval(() => {
  drones.forEach(drone => {
    if (drone.status === 'flying') {
      drone.battery -= 0.5;
      drone.location.lat += (Math.random() - 0.5) * 0.001;
      drone.location.lng += (Math.random() - 0.5) * 0.001;
      if (drone.battery < 20) drone.status = 'low_battery';
    } else if (drone.status === 'low_battery' && drone.battery < 5) {
      drone.status = 'charging';
    } else if (drone.status === 'charging') {
      drone.battery += 2;
      if (drone.battery >= 100) {
        drone.battery = 100;
        drone.status = 'idle';
      }
    }
  });
  io.emit('drone-status-update', drones);
}, 5000);

// Auth Routes
app.post('/api/signup', async (req, res) => {
  const { email, password, phone } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query.run('INSERT INTO users (email, password, phone) VALUES (?, ?, ?)', [email, hashedPassword, phone]);
    
    req.session.userId = result.lastInsertRowid;
    res.status(201).json({ message: 'User created successfully', userId: result.lastInsertRowid });
  } catch (error) {
    console.error('Signup Error:', error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE' || error.number === 2627) {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await query.get('SELECT * FROM users WHERE email = ?', [email]);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    req.session.userId = user.id;
    req.session.role = user.role;
    
    res.json({ 
      message: 'Login successful', 
      user: { id: user.id, email: user.email, role: user.role } 
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/me', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  try {
    const user = await query.get('SELECT id, email, phone, role FROM users WHERE id = ?', [req.session.userId]);
    res.json({ user });
  } catch (error) {
    console.error('Me Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
});

// Daily Tasks API
app.get('/api/tasks', isAuthenticated, async (req, res) => {
  const userId = req.session.userId;
  try {
    const tasks = await query.all('SELECT * FROM daily_tasks WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    res.json({ tasks });
  } catch (error) {
    console.error('Tasks Get Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/tasks', isAuthenticated, async (req, res) => {
  const userId = req.session.userId;
  const { title, description, priority, due_date } = req.body;
  
  try {
    const result = await query.run(`
      INSERT INTO daily_tasks (user_id, title, description, priority, due_date)
      VALUES (?, ?, ?, ?, ?)
    `, [userId, title, description, priority || 'medium', due_date || new Date().toISOString().split('T')[0]]);
    
    const newTask = await query.get('SELECT * FROM daily_tasks WHERE id = ?', [result.lastInsertRowid]);
    io.to(`user-${userId}`).emit('task-added', newTask);
    res.status(201).json({ task: newTask });
  } catch (error) {
    console.error('Tasks Post Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/tasks/:id', isAuthenticated, async (req, res) => {
  const userId = req.session.userId;
  const taskId = req.params.id;
  const { status, title, description, priority } = req.body;
  
  try {
    await query.run(`
      UPDATE daily_tasks 
      SET status = COALESCE(?, status), 
          title = COALESCE(?, title),
          description = COALESCE(?, description),
          priority = COALESCE(?, priority)
      WHERE id = ? AND user_id = ?
    `, [status, title, description, priority, taskId, userId]);
    
    const updatedTask = await query.get('SELECT * FROM daily_tasks WHERE id = ?', [taskId]);
    io.to(`user-${userId}`).emit('task-updated', updatedTask);
    res.json({ task: updatedTask });
  } catch (error) {
    console.error('Tasks Put Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/tasks/:id', isAuthenticated, async (req, res) => {
  const userId = req.session.userId;
  const taskId = req.params.id;
  
  try {
    await query.run('DELETE FROM daily_tasks WHERE id = ? AND user_id = ?', [taskId, userId]);
    io.to(`user-${userId}`).emit('task-deleted', taskId);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Tasks Delete Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Dashboard Data API (Ultra Optimized)
app.get('/api/dashboard/summary', isAuthenticated, async (req, res) => {
  const getStats = () => {
    // Simulate complex calculation that we want to cache
    return {
      totalDrones: 12,
      activeMissions: 3,
      areaCovered: '1,240 Rai',
      healthIndex: 0.92,
      lastUpdated: new Date().toISOString()
    };
  };

  const optimizedGetStats = optimizer.predictiveCache(getStats);
  res.json({ stats: optimizedGetStats() });
});

// AI Agent Chat API (LLM Integrated via Cloudflare AI Gateway)
app.post('/api/chat', isAuthenticated, async (req, res) => {
  const { message } = req.body;
  const msg = message.toLowerCase();
  const userId = req.session.userId;
  let reply = "";

  try {
    // Attempt LLM-based response first if configured
    if (process.env.CF_AIG_TOKEN && process.env.CF_AIG_GATEWAY_URL) {
      const systemPrompt = `You are the AgriFlight AI Assistant. You help farmers manage drones, tasks, and farm data.
      Current context:
      - You can manage drones (DJI, XAG).
      - You can schedule tasks and plan spray missions.
      - You have access to weather, farm assets (FarmOS), and research (OpenAg).
      - If the user asks about their tasks, mentioned you can see them.
      - Keep responses helpful, professional, and concise in Thai language.`;

      reply = await gateway.request('ai', 'chat', [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ]);
    } else {
      // Fallback to Rule-based logic
      if (msg.includes('งาน') || msg.includes('task') || msg.includes('ทำอะไร')) {
        const tasks = await query.all('SELECT title FROM daily_tasks WHERE user_id = ? AND status = "pending"', [userId]);
        if (tasks.length > 0) {
          reply = `วันนี้คุณมีงานที่ต้องทำ ${tasks.length} อย่างครับ: ${tasks.map(t => t.title).join(', ')} คุณต้องการให้ผมช่วยจัดการส่วนไหนก่อนดีครับ?`;
        } else {
          reply = "วันนี้ยังไม่มีงานที่ค้างอยู่ครับ คุณต้องการให้ผมช่วยสร้างงานใหม่ หรือวางแผนการบินสำหรับวันนี้ไหมครับ?";
        }
      } else if (msg.includes('เพิ่มงาน') || msg.includes('add task')) {
        const title = message.replace(/เพิ่มงาน|add task/gi, '').trim() || 'งานใหม่';
        const info = await query.run('INSERT INTO daily_tasks (user_id, title) VALUES (?, ?)', [userId, title]);
        const newTask = await query.get('SELECT * FROM daily_tasks WHERE id = ?', [info.lastInsertRowid]);
        io.to(`user-${userId}`).emit('task-added', newTask);
        reply = `รับทราบครับ! ผมได้เพิ่มงาน "${title}" ลงในรายการงานประจำวันของคุณแล้วครับ`;
      } else {
        reply = "สวัสดีครับ! ผมคือ AgriFlight AI ยินดีที่ได้ช่วยเหลือครับ (ระบบกำลังใช้โหมดพื้นฐานเนื่องจากไม่ได้ตั้งค่า LLM)";
      }
    }
  } catch (error) {
    console.error('Chat API Error:', error);
    reply = "ขออภัยครับ เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่อีกครั้งในภายหลังครับ";
  }

  res.json({ reply });
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  
  // Track in App Insights
  global.telemetry.trackException({ exception: err });
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: isProd ? 'Internal Server Error' : err.message,
    correlationId: req.headers['x-correlation-id'] || 'N/A'
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
