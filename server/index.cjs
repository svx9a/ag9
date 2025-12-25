const express = require('express');
const axios = require('axios');
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
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');
const { Pool } = require('pg');
const gateway = require('./services/api-gateway.cjs');
const optimizer = require('./optimizer.cjs');
const affiliateService = require('./services/affiliate-service.cjs');
console.log('Starting server initialization...');
require('dotenv').config();
console.log('Environment loaded:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DB_TYPE: process.env.MONGODB_URI ? 'mongodb' : 'sqlite'
});

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
    trackEvent: (e) => {},
    trackException: (e) => console.error('Telemetry Exception:', e),
    trackRequest: (r) => {}
  };
}

// Async Wrapper for Routes
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const isProd = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3001;

// Detect Atlas SQL and treat as sqlite fallback for now since it's read-only/BI
const isAtlasSql = process.env.MONGODB_URI && process.env.MONGODB_URI.includes('atlas-sql');
const hasAzureSql = process.env.SQL_SERVER && process.env.SQL_USER && process.env.SQL_PASSWORD;
const hasPg = process.env.DATABASE_URL;
const hasMongo = process.env.MONGODB_URI && !isAtlasSql;
const dbType = hasMongo ? 'mongodb' : (hasPg ? 'postgres' : (hasAzureSql ? 'mssql' : 'sqlite'));
global.dbType = dbType; // Make it global for services

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

const agentLogSchema = new mongoose.Schema({
  user_id: String,
  action: { type: String, required: true },
  status: { type: String, required: true },
  metadata: Object,
  timestamp: { type: Date, default: Date.now }
});

const agentTokenSchema = new mongoose.Schema({
  user_id: { type: String, unique: true },
  token: { type: String, required: true },
  expires_at: Date,
  created_at: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
const AgentLog = mongoose.models.AgentLog || mongoose.model('AgentLog', agentLogSchema);
const AgentToken = mongoose.models.AgentToken || mongoose.model('AgentToken', agentTokenSchema);

const app = express();

// Performance & Security Middlewares
app.use(compression()); // Enable Gzip
app.use(express.json({ limit: '10mb' })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply rate limiter to /api routes only
app.use('/api/', limiter);

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
let pgPool;

async function initDb(retries = 5) {
  if (dbType === 'postgres') {
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    // Test connection and initialize schema
    try {
      await pgPool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          phone TEXT,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS daily_tasks (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          title TEXT NOT NULL,
          description TEXT,
          status TEXT DEFAULT 'pending',
          priority TEXT DEFAULT 'medium',
          due_date DATE DEFAULT CURRENT_DATE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS agent_logs (
          id SERIAL PRIMARY KEY,
          user_id TEXT,
          action TEXT NOT NULL,
          status TEXT NOT NULL,
          metadata JSONB,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS agent_tokens (
          id SERIAL PRIMARY KEY,
          user_id TEXT UNIQUE,
          token TEXT NOT NULL,
          expires_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('PostgreSQL Initialized Successfully');
      return;
    } catch (err) {
      console.error('PostgreSQL Initialization Failed:', err);
      throw err;
    }
  } else if (dbType === 'mongodb') {
    while (retries > 0) {
      try {
        await mongoose.connect(process.env.MONGODB_URI);
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

          IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'agent_logs')
          CREATE TABLE agent_logs (
            id INT IDENTITY(1,1) PRIMARY KEY,
            user_id NVARCHAR(255),
            action NVARCHAR(255) NOT NULL,
            status NVARCHAR(50) NOT NULL,
            metadata NVARCHAR(MAX),
            timestamp DATETIME DEFAULT GETDATE()
          );

          IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'agent_tokens')
          CREATE TABLE agent_tokens (
            id INT IDENTITY(1,1) PRIMARY KEY,
            user_id NVARCHAR(255) UNIQUE,
            token NVARCHAR(MAX) NOT NULL,
            expires_at DATETIME,
            created_at DATETIME DEFAULT GETDATE()
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
      const sqlitePath = process.env.DATABASE_URL || 'database.db';
      db = new Database(sqlitePath);
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

        CREATE TABLE IF NOT EXISTS agent_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT,
          action TEXT NOT NULL,
          status TEXT NOT NULL,
          metadata TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS agent_tokens (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT UNIQUE,
          token TEXT NOT NULL,
          expires_at DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } catch (err) {
      console.error('SQLite Initialization Failed:', err);
    }
  }
}

initDb().catch(err => {
  console.error('Final Database Initialization Error:', err);
  if (isProd) process.exit(1); // Fail fast in production
});

const MistralLogger = require('./services/mistral-logger.cjs');
const cloudflareAI = require('./services/external-apis/cloudflare-ai.cjs');
let mistralLogger;

// Initialize Mistral Logger once query is ready
const initializeLogger = () => {
  mistralLogger = new MistralLogger(query);
};

// Helper for unified DB access (SQL shim for Mongo if needed, or use models)
const query = {
  get: async (sql, params = []) => {
    if (dbType === 'postgres') {
      const result = await pgPool.query(sql.replace(/\?/g, (match, i) => `$${params.indexOf(params[i]) + 1}`), params);
      return result.rows[0];
    } else if (dbType === 'mongodb') {
      let result = null;
      if (sql.includes('users WHERE email = ?')) result = await User.findOne({ email: params[0] }).lean();
      else if (sql.includes('users WHERE id = ?')) result = await User.findById(params[0]).lean();
      else if (sql.includes('daily_tasks WHERE id = ?')) result = await Task.findById(params[0]).lean();

      if (result) return { ...result, id: (result._id || result.id).toString() };
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
    if (dbType === 'postgres') {
      const result = await pgPool.query(sql.replace(/\?/g, (match, i) => `$${params.indexOf(params[i]) + 1}`), params);
      return result.rows;
    } else if (dbType === 'mongodb') {
      let results = [];
      if (sql.includes('daily_tasks WHERE user_id = ?')) {
        results = await Task.find({ user_id: params[0] }).sort({ created_at: -1 }).lean();
      } else if (sql.includes('daily_tasks WHERE user_id = ? AND status = "pending"')) {
        results = await Task.find({ user_id: params[0], status: 'pending' }).lean();
      }
      return results.map(r => ({ ...r, id: (r._id || r.id).toString() }));
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
    if (dbType === 'postgres') {
      const result = await pgPool.query(sql.replace(/\?/g, (match, i) => `$${params.indexOf(params[i]) + 1}`), params);
      return { lastInsertRowid: result.rows[0]?.id, changes: result.rowCount };
    } else if (dbType === 'mongodb') {
      if (sql.includes('INSERT INTO users')) {
        const user = new User({ email: params[0], password: params[1], phone: params[2] });
        await user.save();
        return { lastInsertRowid: user._id.toString() };
      }
      if (sql.includes('INSERT INTO daily_tasks')) {
        const task = new Task({ user_id: params[0], title: params[1], description: params[2], priority: params[3], due_date: params[4] });
        await task.save();
        return { lastInsertRowid: task._id.toString() };
      }
      if (sql.includes('UPDATE daily_tasks')) {
        const taskId = params[4];
        const userId = params[5];
        const updateData = {};
        if (params[0] !== undefined && params[0] !== null) updateData.status = params[0];
        if (params[1] !== undefined && params[1] !== null) updateData.title = params[1];
        if (params[2] !== undefined && params[2] !== null) updateData.description = params[2];
        if (params[3] !== undefined && params[3] !== null) updateData.priority = params[3];

        await Task.findOneAndUpdate({ _id: taskId, user_id: userId }, updateData);
        return { changes: 1 };
      }
      if (sql.includes('DELETE FROM daily_tasks')) {
        await Task.findOneAndDelete({ _id: params[0], user_id: params[1] });
        return { changes: 1 };
      }
      if (sql.includes('INSERT INTO agent_logs')) {
        const log = new AgentLog({ user_id: params[0], action: params[1], status: params[2], metadata: JSON.parse(params[3] || '{}') });
        await log.save();
        return { lastInsertRowid: log._id.toString() };
      }
      if (sql.includes('INSERT INTO agent_tokens')) {
        const token = new AgentToken({ user_id: params[0], token: params[1], expires_at: params[2] });
        await token.save();
        return { lastInsertRowid: token._id.toString() };
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

initializeLogger();

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
const distPath = path.join(__dirname, '../dist');
const hasDist = require('fs').existsSync(distPath);

if (isProd || hasDist) {
  app.use(express.static(distPath));
}

// Request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9).toUpperCase();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    };

    if (res.statusCode >= 400) {
      console.error(`[ERROR LOG] ${JSON.stringify(logData)}`);
    }

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
    if (typeof MongoStore.create === 'function') {
      sessionStore = MongoStore.create(mongoOptions);
    } else if (MongoStore.default && typeof MongoStore.default.create === 'function') {
      sessionStore = MongoStore.default.create(mongoOptions);
    } else {
      throw new Error('MongoStore.create not found');
    }
  } catch (err) {
    const SQLiteStore = require('connect-sqlite3')(session);
    sessionStore = new SQLiteStore({ db: 'sessions.db', dir: './' });
  }
} else if (dbType === 'mssql' && !isAtlasSql) {
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
  secret: process.env.SESSION_SECRET || 'smartfarming-secret-key',
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
  const userId = socket.handshake.query.userId;
  if (userId) {
    socket.join(`user-${userId}`);
  }

  socket.on('join-room', (userId) => {
    socket.join(`user-${userId}`);
  });

  socket.on('disconnect', () => {
  });
});

// Mock Drone Status Service
const drones = [
  { id: 'SF-01', model: 'SmartFarming T20-Pro', battery: 85, status: 'idle', location: { lat: 13.7367, lng: 100.5231 } },
  { id: 'SF-02', model: 'SmartFarming T6-Standard', battery: 42, status: 'flying', location: { lat: 13.7370, lng: 100.5240 } },
  { id: 'SF-03', model: 'SmartFarming T6-Light', battery: 15, status: 'low_battery', location: { lat: 13.7360, lng: 100.5220 } },
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

const { Client } = require('@line/bot-sdk');

// LINE Bot Config
const lineConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || 'MOCK_TOKEN',
  channelSecret: process.env.LINE_CHANNEL_SECRET || 'MOCK_SECRET'
};
const lineClient = new Client(lineConfig);

// LINE Notification Endpoint
app.post('/api/line/notify', async (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: 'userId and message required' });
  }

  try {
    // Check if we have real tokens, otherwise mock success
    if (process.env.LINE_CHANNEL_ACCESS_TOKEN) {
      await lineClient.pushMessage(userId, { type: 'text', text: message });
    } else {
      console.log(`[MOCK LINE NOTIFY] To: ${userId}, Message: ${message}`);
    }

    res.json({ success: true, message: 'Notification sent' });
  } catch (error) {
    console.error('LINE Notify Error:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

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

// Affiliate Program APIs
app.get('/api/affiliate/stats', isAuthenticated, asyncHandler(async (req, res) => {
  const stats = await affiliateService.getStats(req.session.userId);
  res.json(stats);
}));

app.post('/api/affiliate/withdraw', isAuthenticated, asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const result = await affiliateService.requestWithdrawal(req.session.userId, amount);
  res.json(result);
}));

// Job Completion Webhook (Mock for integration)
app.post('/api/webhooks/job-completion', async (req, res) => {
  const { jobId, userId, amount, secret } = req.body;

  // Basic security check
  if (secret !== process.env.WEBHOOK_SECRET && process.env.NODE_ENV === 'production') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await affiliateService.processJobCompletion(jobId, userId, amount);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dashboard Data API (Ultra Optimized)
app.get('/api/dashboard/summary', isAuthenticated, async (req, res) => {
  try {
    const weather = await gateway.request('local', 'getLocalWeather', 'Nakhon Nayok');
    const farmAssets = await gateway.request('partners', 'getFarmAssets');
    const research = await gateway.request('partners', 'getResearchData', 'Rice');
    const affiliateStats = await affiliateService.getStats(req.session.userId);

    res.json({
      weather,
      farmAssets,
      research,
      affiliateStats,
      stats: {
        totalDrones: 12,
        activeMissions: 3,
        areaCovered: '1,240 Rai',
        healthIndex: 0.92,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Dashboard Summary Error:', error);
    res.status(500).json({ error: 'Failed to fetch unified data' });
  }
});

// AI Agent Chat API (Mistral Integrated)
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const msg = message.toLowerCase();
  const userId = req.session?.userId || 'anonymous';
  let reply = "";
  const startTime = Date.now();

  try {
    // Mistral AI Agent Implementation
    if (process.env.MISTRAL_API_KEY) {
      const agentId = process.env.AGENT_ID;
      const mistralModel = process.env.MISTRAL_MODEL || agentId || 'mistral-large-latest';

      const systemPrompt = `You are the GreenDay AI Pilot, an elite agricultural intelligence developed by GreenDay by O2Odesign.

              CORE MISSION:
              - Monitoring Nakhon Ratchasima (นครราชสีมา) Central Hub.
              - Coordinating "Drone Kraset Gen Y" missions for rice paddy spraying and health analysis.
              - Providing hyper-local technical advice for Thailand's climate.

              CAPABILITIES:
              1. Route planning for precise spraying/fertilizing.
              2. Multispectral crop health analysis (detecting disease/deficiency).
              3. Drone Kraset Gen Y fleet management and swarm control.
              4. Automated alerts for anomalies (pests, flooding).

              CRITICAL CONSTRAINTS:
              - NEVER mention "DJI" or "XAG". Use ONLY "Drone Kraset Gen Y".
              - Always identify yourself as "GreenDay AI Pilot by O2Odesign".
              - Be professional, heroic, and concise. Avoid walls of text unless requested.
              - Current User ID: ${userId}`;

      try {
        // Use cloudflareAI service which handles gateway and fallbacks
        const aiResponse = await cloudflareAI.chat(
          [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          'mistral',
          mistralModel
        );

        reply = aiResponse;

        await mistralLogger.logActivity(userId, 'mistral_chat', 'success', {
          model: mistralModel,
          agentUsed: !!agentId,
          duration: Date.now() - startTime
        });
      } catch (aiError) {
        await mistralLogger.logActivity(userId, 'mistral_chat', 'failure', {
          error: aiError.message,
          duration: Date.now() - startTime
        });
        throw aiError;
      }
    } else {
      reply = "สวัสดีครับ! ผมคือ GreenDay AI Copilot พัฒนาโดย O2Odesign ยินดีที่ได้ช่วยเหลือครับ (ระบบกำลังใช้โหมดพื้นฐานเนื่องจากไม่ได้ตั้งค่า LLM)";
      await mistralLogger.logActivity(userId, 'basic_chat', 'success', { duration: Date.now() - startTime });
    }
  } catch (error) {
    console.error('Chat API Error:', error.response?.data || error.message);
    reply = "ขออภัยครับ เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่อีกครั้งในภายหลังครับ";

    if (mistralLogger) {
      await mistralLogger.logActivity(userId, 'chat_error', 'failure', { error: error.message });
    }
  }

  res.json({ reply });
});

// Agent Log Query API
app.get('/api/agent/logs', async (req, res) => {
  const { userId, action, status, limit, offset } = req.query;
  try {
    const logs = await mistralLogger.queryLogs({ userId, action, status, limit, offset });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// Agent Daily Summary API
app.get('/api/agent/summary', async (req, res) => {
  const { date } = req.query;
  try {
    const summary = await mistralLogger.getDailySummary(date);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// Token Management API
app.post('/api/agent/tokens', async (req, res) => {
  const { userId, token, expiresAt } = req.body;
  try {
    await mistralLogger.saveToken(userId, token, expiresAt);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save token' });
  }
});

if (isProd || hasDist) {
  app.use((req, res, next) => {
    // If it's an API request that didn't match any route, return 404
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API route not found' });
    }
    // Otherwise serve index.html for client-side routing
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // In development, provide a simple message for the root path
  app.get('/', (req, res) => {
    res.json({
      message: 'Smart Farming API is running!',
      frontend: 'http://localhost:3005',
      health: '/api/health'
    });
  });
}

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
  console.log(`Server successfully started and listening on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Serving static files from: ${path.join(__dirname, '../dist')}`);
});
