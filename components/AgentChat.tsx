import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  X, 
  Minimize2, 
  Maximize2, 
  Sparkles,
  Zap,
  MessageSquare,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Navigation,
  Battery,
  Activity,
  Calendar,
  ClipboardList,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { socketService } from '../services/socket';

interface Message {
  role: 'agent' | 'user';
  content: string;
  timestamp: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: string;
}

interface Drone {
  id: string;
  model: string;
  battery: number;
  status: 'idle' | 'flying' | 'low_battery' | 'charging';
  location: { lat: number, lng: number };
}

export const AgentChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'tasks' | 'drones'>('chat');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'agent',
      content: 'สวัสดีครับ! ผมคือ AI Agent ผู้ช่วยจัดการฟาร์ม AgriFlight ของคุณ วันนี้มีอะไรให้ช่วยไหมครับ?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [drones, setDrones] = useState<Drone[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const { user } = await api.get('/me');
        if (user) {
          setUser(user);
          socketService.connect(user.id);
          fetchTasks();
        }
      } catch (err) {
        console.error('Failed to fetch user info', err);
      }
    };
    init();

    socketService.on('drone-status-update', (updatedDrones: Drone[]) => {
      setDrones(updatedDrones);
    });

    socketService.on('task-added', (newTask: Task) => {
      setTasks(prev => [newTask, ...prev]);
    });

    socketService.on('task-updated', (updatedTask: Task) => {
      setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    });

    socketService.on('task-deleted', (taskId: number) => {
      setTasks(prev => prev.filter(t => t.id !== taskId));
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const fetchTasks = async () => {
    try {
      const { tasks } = await api.get('/api/tasks');
      setTasks(tasks);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  };

  const toggleTask = async (task: Task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await api.put(`/api/tasks/${task.id}`, { status: newStatus });
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await api.delete(`/api/tasks/${id}`);
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // AI Maker Automation Hub Logic
    setTimeout(async () => {
      try {
        let botResponse = '';
        const lowerInput = userMessage.content.toLowerCase();

        if (lowerInput.includes('sdk') || lowerInput.includes('maker')) {
          botResponse = "I see you're interested in the Maker SDK. You can initialize it using `agriflight.connect({ hubId: 'AUTO_HUB_01' })`. Would you like to see a Python automation script example?";
        } else if (lowerInput.includes('automation') || lowerInput.includes('hub')) {
          botResponse = "The Automation Hub is currently monitoring 3 edge nodes. All systems are operational. You can deploy new AI models to the hub via the 'Data Logs' section.";
        } else {
          const response = await api.post('/chat', { message: userMessage.content });
          botResponse = response.reply;
        }

        const agentMessage: Message = {
          role: 'agent',
          content: botResponse,
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, agentMessage]);
      } catch (err) {
        const errorMessage: Message = {
          role: 'agent',
          content: 'ขออภัยครับ เกิดข้อผิดพลาดในการเชื่อมต่อระบบ AI กรุณาลองใหม่อีกครั้ง',
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-emerald-500 transition-all z-[100] group"
        aria-label="Open AI Agent Chat"
      >
        <Bot size={32} className="group-hover:scale-110 transition-transform" />
      </button>
    );
  }

  return (
    <div 
      className={`fixed bottom-6 right-6 z-[100] flex flex-col bg-white border border-slate-200 shadow-2xl transition-all duration-300 ease-in-out ${
        isMinimized ? 'h-16 w-72' : 'h-[500px] w-[380px]'
      } rounded-2xl overflow-hidden`}
    >
      {/* Header */}
      <div className="bg-emerald-900 p-4 flex flex-col text-white shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <Bot size={24} />
            </div>
            <div>
              <h3 className="font-bold text-sm">AgriFlight AI Assistant</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-medium text-emerald-300">Unified & Active</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <div className="flex bg-emerald-950/50 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('chat')}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                activeTab === 'chat' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-400 hover:text-white'
              }`}
            >
              <MessageSquare size={14} />
              CHAT
            </button>
            <button 
              onClick={() => setActiveTab('tasks')}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                activeTab === 'tasks' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-400 hover:text-white'
              }`}
            >
              <ClipboardList size={14} />
              TASKS
              {tasks.filter(t => t.status === 'pending').length > 0 && (
                <span className="bg-amber-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px]">
                  {tasks.filter(t => t.status === 'pending').length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('drones')}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                activeTab === 'drones' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-400 hover:text-white'
              }`}
            >
              <Navigation size={14} />
              DRONES
            </button>
          </div>
        )}
      </div>

      {!isMinimized && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'chat' && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white custom-scrollbar">
                {messages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        msg.role === 'user' ? 'bg-emerald-100 text-emerald-700' : 'bg-white border border-slate-200 text-slate-400'
                      }`}>
                        {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                      </div>
                      <div className={`p-3 rounded-2xl text-sm ${
                        msg.role === 'user' 
                          ? 'bg-emerald-600 text-white rounded-tr-none' 
                          : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tl-none'
                      }`}>
                        <p className="leading-relaxed">{msg.content}</p>
                        <p className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-emerald-100' : 'text-slate-400'}`}>
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start animate-pulse">
                    <div className="flex gap-3 max-w-[85%]">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                        <Bot size={18} />
                      </div>
                      <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm">
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-slate-100">
                <form onSubmit={handleSend} className="relative">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="ถาม AI เกี่ยวกับงานหรือโดรน..." 
                    className="w-full h-12 pl-4 pr-12 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm"
                  />
                  <button 
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </>
          )}

          {activeTab === 'tasks' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white custom-scrollbar">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Schedule</h4>
                <button 
                  onClick={() => setInput('เพิ่มงานใหม่')}
                  className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
              {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center">
                  <ClipboardList size={48} className="mb-3 opacity-20" />
                  <p className="text-sm">ไม่มีงานค้างอยู่<br/>ถาม AI เพื่อสร้างแผนงานวันนี้</p>
                </div>
              ) : (
                tasks.map(task => (
                  <div key={task.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 group">
                    <button 
                      onClick={() => toggleTask(task)}
                      className={`shrink-0 transition-colors ${task.status === 'completed' ? 'text-emerald-500' : 'text-slate-300 hover:text-emerald-500'}`}
                    >
                      {task.status === 'completed' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          task.priority === 'high' ? 'bg-red-100 text-red-600' : 
                          task.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 
                          'bg-emerald-100 text-emerald-600'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Calendar size={10} />
                          {task.due_date}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'drones' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white custom-scrollbar">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Active Drones</p>
                  <p className="text-2xl font-bold text-emerald-600">{drones.length}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Flying Now</p>
                  <p className="text-2xl font-bold text-blue-600">{drones.filter(d => d.status === 'flying').length}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fleet Status</h4>
                {drones.map(drone => (
                  <div key={drone.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          drone.status === 'flying' ? 'bg-blue-500 animate-pulse' :
                          drone.status === 'idle' ? 'bg-emerald-500' :
                          drone.status === 'low_battery' ? 'bg-red-500 animate-bounce' :
                          'bg-amber-500'
                        }`} />
                        <span className="text-xs font-bold text-slate-700">{drone.id}</span>
                        <span className="text-[10px] text-slate-400">{drone.model}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Battery size={12} className={drone.battery < 20 ? 'text-red-500' : 'text-emerald-500'} />
                        <span className={`text-[11px] font-bold ${drone.battery < 20 ? 'text-red-500' : 'text-slate-600'}`}>
                          {Math.round(drone.battery)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                          <Navigation size={10} />
                          {drone.status.toUpperCase()}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                          <Activity size={10} />
                          LAT: {drone.location.lat.toFixed(4)}
                        </div>
                      </div>
                      <button className="text-emerald-600 hover:text-emerald-700 transition-colors">
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Info */}
          <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              <Sparkles size={12} className="text-emerald-500"/>
              AgriAI v2.5
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              <Zap size={12} className="text-amber-500"/>
              Real-time Sync
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out forwards;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default AgentChat;
