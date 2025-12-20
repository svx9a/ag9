import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  BookOpen, 
  Zap, 
  HelpCircle, 
  ChevronRight, 
  Globe, 
  Code, 
  AlertTriangle, 
  FileText,
  Terminal,
  Cpu,
  Shield,
  Clock
} from 'lucide-react';

interface DocumentationProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DocItem {
  id: string;
  label: string;
  body: string;
}

interface DocSection {
  title: string;
  icon: React.ReactNode;
  content: DocItem[];
}

interface Docs {
  [key: string]: DocSection;
}

const Documentation: React.FC<DocumentationProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState<'EN' | 'TH'>('EN');
  const [activeSection, setActiveSection] = useState('getting-started');

  const docs = useMemo((): Docs => ({
    'getting-started': {
      title: language === 'EN' ? 'Getting Started' : 'เริ่มต้นใช้งาน',
      icon: <Zap size={18} />,
      content: [
        {
          id: 'quick-start',
          label: language === 'EN' ? 'Quick Start Guide' : 'คู่มือเริ่มต้นฉบับย่อ',
          body: language === 'EN' 
            ? "Welcome to AgriFlight! To start your first mission: 1. Connect your drone fleet via the 'Farm Ops Center'. 2. Draw your field boundaries on the map. 3. Select your spraying parameters. 4. Click 'Launch Mission'."
            : "ยินดีต้อนรับสู่ AgriFlight! วิธีเริ่มภารกิจแรกของคุณ: 1. เชื่อมต่อโดรนของคุณผ่าน 'Farm Ops Center' 2. วาดขอบเขตแปลงของคุณบนแผนที่ 3. เลือกพารามิเตอร์การฉีดพ่น 4. คลิก 'เริ่มภารกิจ'"
        },
        {
          id: 'fleet-sync',
          label: language === 'EN' ? 'Fleet Synchronization' : 'การซิงโครไนซ์ฝูงโดรน',
          body: language === 'EN'
            ? "AgriFlight supports DJI Agras (T40, T30, T10), XAG, and TTA drones. Ensure your drones are powered on and connected to the internet for real-time telemetry."
            : "AgriFlight รองรับโดรน DJI Agras (T40, T30, T10), XAG และ TTA ตรวจสอบให้แน่ใจว่าโดรนของคุณเปิดอยู่และเชื่อมต่ออินเทอร์เน็ตเพื่อรับข้อมูลการบินแบบเรียลไทม์"
        }
      ]
    },
    'troubleshooting': {
      title: language === 'EN' ? 'Troubleshooting' : 'การแก้ไขปัญหา',
      icon: <AlertTriangle size={18} />,
      content: [
        {
          id: 'latency-issues',
          label: language === 'EN' ? 'High Latency' : 'ความหน่วงสูง',
          body: language === 'EN'
            ? "If you experience latency > 500ms, check your field base station connection. AgriFlight's Edge architecture usually maintains < 50ms latency in rural areas."
            : "หากคุณพบความหน่วงเกิน 500ms ให้ตรวจสอบการเชื่อมต่อสถานีฐานของคุณ สถาปัตยกรรม Edge ของ AgriFlight มักจะรักษาความหน่วงให้ต่ำกว่า 50ms ในพื้นที่ห่างไกล"
        },
        {
          id: 'auth-errors',
          label: language === 'EN' ? 'Authentication Failures' : 'ข้อผิดพลาดในการยืนยันตัวตน',
          body: language === 'EN'
            ? "Ensure your API keys are valid in the Settings panel. If using LINE login, verify your account is linked in the Profile section."
            : "ตรวจสอบให้แน่ใจว่า API key ของคุณถูกต้องในแผงการตั้งค่า หากใช้การเข้าสู่ระบบผ่าน LINE ให้ตรวจสอบว่าบัญชีของคุณเชื่อมโยงแล้วในส่วนโปรไฟล์"
        }
      ]
    },
    'api-integration': {
      title: language === 'EN' ? 'API Integration' : 'การเชื่อมต่อ API',
      icon: <Code size={18} />,
      content: [
        {
          id: 'gateway',
          label: language === 'EN' ? 'Unified Agri-API Gateway' : 'เกตเวย์เกษตรอัจฉริยะ',
          body: language === 'EN'
            ? "Our gateway (Ver 4.2.0) integrates with FarmOS and OpenAg. Use the '/api/v1/sync' endpoint to pull geospatial field data directly into your dashboard."
            : "เกตเวย์ของเรา (เวอร์ชัน 4.2.0) เชื่อมต่อกับ FarmOS และ OpenAg ใช้เอนด์พอยต์ '/api/v1/sync' เพื่อดึงข้อมูลแปลงทางภูมิศาสตร์เข้าสู่แดชบอร์ดของคุณโดยตรง"
        }
      ]
    },
    'maker-sdk': {
      title: language === 'EN' ? 'Maker SDK' : 'เครื่องมือสำหรับนักพัฒนา',
      icon: <Terminal size={18} />,
      content: [
        {
          id: 'sdk-init',
          label: language === 'EN' ? 'SDK Initialization' : 'การเริ่มต้นใช้งาน SDK',
          body: language === 'EN'
            ? "Install the AgriFlight Maker SDK via npm or pip. Use `agriflight.connect()` to authorize your automation hub and start listening for telemetry events."
            : "ติดตั้ง AgriFlight Maker SDK ผ่าน npm หรือ pip ใช้ `agriflight.connect()` เพื่อลงทะเบียนฮับอัตโนมัติของคุณและเริ่มรับเหตุการณ์เทเลเมทรี"
        },
        {
          id: 'automation-hub',
          label: language === 'EN' ? 'Building Hubs' : 'การสร้างฮับอัตโนมัติ',
          body: language === 'EN'
            ? "Automation Hubs are local edge instances that coordinate drone missions. Use our pre-built 'AI Maker Hub' docker image for rapid deployment."
            : "Automation Hub คืออินสแตนซ์เอดจ์ท้องถิ่นที่ประสานงานภารกิจโดรน ใช้รูปภาพด็อกเกอร์ 'AI Maker Hub' ที่สร้างไว้ล่วงหน้าของเราเพื่อการปรับใช้ที่รวดเร็ว"
        }
      ]
    }
  }), [language]);

  const filteredDocs = useMemo(() => {
    if (!searchQuery) return docs;
    const query = searchQuery.toLowerCase();
    const result: Docs = {};
    (Object.entries(docs) as [string, DocSection][]).forEach(([key, section]) => {
      const filteredContent = section.content.filter(item => 
        item.label.toLowerCase().includes(query) || item.body.toLowerCase().includes(query)
      );
      if (filteredContent.length > 0) {
        result[key] = { ...section, content: filteredContent };
      }
    });
    return result;
  }, [docs, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Sidebar Panel */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-slideInRight border-l border-slate-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 rounded-lg text-white">
                <BookOpen size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">AgriFlight Documentation</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase tracking-wider">Ver 4.2.0</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Updated: 2025-12-20</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
              aria-label="Close documentation"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'EN' ? "Search topics, errors, or APIs..." : "ค้นหาหัวข้อ ข้อผิดพลาด หรือ API..."}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm shadow-sm"
              />
            </div>
            <button 
              onClick={() => setLanguage(language === 'EN' ? 'TH' : 'EN')}
              className="h-11 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
            >
              <Globe size={16} />
              {language}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Nav Sidebar */}
          <div className="w-20 sm:w-48 border-r border-slate-100 flex flex-col p-3 gap-2 bg-slate-50/30 overflow-y-auto">
            {(Object.entries(docs) as [string, DocSection][]).map(([key, section]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  activeSection === key 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {section.icon}
                <span className="hidden sm:block text-xs font-bold whitespace-nowrap">{section.title}</span>
              </button>
            ))}
          </div>

          {/* Main Body */}
          <div className="flex-1 overflow-y-auto p-8 scroll-smooth custom-scrollbar">
            {(Object.entries(filteredDocs) as [string, DocSection][]).map(([key, section]) => (
              <div 
                key={key} 
                className={`space-y-8 mb-12 ${activeSection !== key && !searchQuery ? 'hidden' : 'block animate-fadeIn'}`}
              >
                <div className="flex items-center gap-3 text-emerald-600 mb-6">
                  {section.icon}
                  <h3 className="text-sm font-black uppercase tracking-[0.2em]">{section.title}</h3>
                </div>
                
                {section.content.map((item: any) => (
                  <div key={item.id} className="group p-6 rounded-2xl border border-slate-100 bg-white hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300">
                    <h4 className="text-lg font-black text-slate-800 mb-3 flex items-center justify-between">
                      {item.label}
                      <ChevronRight size={18} className="text-slate-200 group-hover:text-emerald-500 transition-colors" />
                    </h4>
                    <p className="text-slate-500 leading-relaxed text-sm font-medium">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            ))}
            
            {Object.keys(filteredDocs).length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center space-y-4">
                <div className="p-4 bg-slate-50 rounded-full">
                  <Search size={48} />
                </div>
                <p className="text-lg font-bold">{language === 'EN' ? 'No matches found' : 'ไม่พบข้อมูลที่ค้นหา'}</p>
                <p className="text-sm">{language === 'EN' ? 'Try searching for common terms like "sync" or "lat" ' : 'ลองค้นหาคำทั่วไปเช่น "ซิงค์" หรือ "ความหน่วง"'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="#" className="text-[10px] font-bold text-slate-400 hover:text-emerald-600 transition-colors uppercase tracking-widest flex items-center gap-1.5">
              <Terminal size={12} /> Developer Portal
            </a>
            <a href="#" className="text-[10px] font-bold text-slate-400 hover:text-emerald-600 transition-colors uppercase tracking-widest flex items-center gap-1.5">
              <Shield size={12} /> Privacy Policy
            </a>
          </div>
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">© 2025 AgriFlight Global</p>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
