import React, { useState } from 'react';
import { 
  CheckCircle, 
  ArrowRight, 
  Map, 
  DollarSign, 
  History, 
  Search, 
  Satellite, 
  Wifi, 
  Layers, 
  Globe, 
  Sprout, 
  Lock, 
  Smartphone, 
  X, 
  Mail,
  LayoutDashboard,
  ShoppingCart,
  Calendar,
  CreditCard,
  MapPin,
  UserCircle
} from 'lucide-react';
import { api } from '../services/api';

interface LandingPageProps {
  onEnterApp: (user: any) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLoginView) {
        const data = await api.post('/login', { email, password });
        onEnterApp(data.user);
      } else {
        await api.post('/signup', { email, password, phone });
        const data = await api.post('/login', { email, password });
        onEnterApp(data.user);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const services = [
    { icon: <LayoutDashboard size={32} />, title: "Customer Portal", desc: "Access your personalized dashboard to manage all drone services." },
    { icon: <ShoppingCart size={32} />, title: "Marketplace", desc: "Browse and select from a variety of drone services tailored to your needs." },
    { icon: <Calendar size={32} />, title: "Booking", desc: "Schedule your drone service with ease and receive instant confirmations." },
    { icon: <CreditCard size={32} />, title: "Payment", desc: "Secure and flexible payment options to suit your preferences." },
    { icon: <MapPin size={32} />, title: "Tracking", desc: "Real-time tracking of your drone service progress on live maps." },
    { icon: <UserCircle size={32} />, title: "History/Profile", desc: "Access your booking history and manage your profile information." }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden selection:bg-emerald-100">
      
      {/* Header/Nav with Branding */}
      <nav className="fixed top-0 left-0 right-0 z-[50] bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="container mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
              <Sprout size={20} />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-900">O2O DESIGN</span>
              <span className="text-[10px] font-bold text-emerald-600 tracking-[0.2em] uppercase">Global Agritech</span>
            </div>
          </div>
          <button 
            onClick={() => setShowLogin(true)}
            className="px-4 md:px-6 h-12 bg-slate-900 text-white rounded-full font-bold text-sm md:text-base hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2"
          >
            Login <UserCircle size={18} />
          </button>
        </div>
      </nav>
      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowLogin(false)}></div>
          
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[420px] overflow-hidden relative z-10 animate-[fadeIn_0.3s_ease-out]">
            <button 
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 z-20 bg-black/20 hover:bg-black/40 text-white p-1 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <div className="h-40 bg-[url('https://images.unsplash.com/photo-1625246333195-58197bd47d26?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center relative">
              <div className="absolute inset-0 bg-emerald-900/70 flex flex-col items-center justify-center text-white p-6 text-center">
                <div className="bg-white/10 p-3 rounded-full mb-3 backdrop-blur-md">
                   <Sprout size={32} className="text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold tracking-wide">{isLoginView ? 'AgriFlight Member' : 'Join AgriFlight'}</h2>
                <p className="text-emerald-100 text-sm">{isLoginView ? 'เข้าสู่ระบบเพื่อจัดการฟาร์มของคุณ' : 'ลงทะเบียนเพื่อเริ่มต้นใช้งาน'}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
               {error && (
                 <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 animate-shake">
                   {error}
                 </div>
               )}
               <div className="space-y-4">
                 <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1.5">
                       <Mail size={16} className="text-emerald-600"/> อีเมล (Email)
                    </label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-lg font-mono text-slate-800 placeholder:text-gray-400"
                      placeholder="your@email.com"
                      required
                    />
                 </div>
                 {!isLoginView && (
                   <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1.5">
                         <Smartphone size={16} className="text-emerald-600"/> เบอร์โทรศัพท์ (Phone)
                      </label>
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-lg font-mono text-slate-800 placeholder:text-gray-400"
                        placeholder="08X-XXX-XXXX"
                      />
                   </div>
                 )}
                 <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1.5">
                       <Lock size={16} className="text-emerald-600"/> รหัสผ่าน (Password)
                    </label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-lg font-mono text-slate-800 placeholder:text-gray-400"
                      placeholder="••••••••"
                      required
                    />
                    {isLoginView && (
                      <div className="text-right mt-1">
                        <a href="#" className="text-xs text-gray-400 hover:text-emerald-600 transition-colors">ลืมรหัสผ่าน?</a>
                      </div>
                    )}
                 </div>
               </div>

               <div className="space-y-3 pt-2">
                 <button 
                   type="submit" 
                   disabled={isLoading}
                   className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    {isLoading ? 'Processing...' : isLoginView ? 'เข้าสู่ระบบ' : 'สร้างบัญชี'} <ArrowRight size={20} />
                 </button>
                 
                 <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-gray-100"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-300 text-xs font-light">หรือเชื่อมต่อผ่าน</span>
                    <div className="flex-grow border-t border-gray-100"></div>
                 </div>

                 <button type="button" onClick={() => onEnterApp({ role: 'guest' })} className="w-full bg-[#06C755] hover:bg-[#05b54d] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-3">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M22.288 10.666c-.14-4.885-3.86-9.02-9.228-9.02-5.753 0-10.15 4.316-10.15 9.473 0 4.672 3.568 8.625 8.163 9.35l-.568 2.055c-.172.636.5.992.89.544l4.96-5.466c3.96-.86 6.185-3.6 6.033-6.936z"/></svg>
                    เข้าสู่ระบบด้วย LINE
                 </button>
               </div>
            </form>
            <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
               <span className="text-sm text-gray-500">{isLoginView ? 'ยังไม่มีบัญชี?' : 'มีบัญชีอยู่แล้ว?'} </span>
               <button 
                 onClick={() => setIsLoginView(!isLoginView)}
                 className="text-sm font-bold text-emerald-600 hover:underline"
               >
                 {isLoginView ? 'ลงทะเบียนเกษตรกร' : 'เข้าสู่ระบบ'}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 z-0">
           <img 
             src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1200&auto=format&fit=crop" 
             className="w-full h-full object-cover"
             alt="AgriFlight Drone Mission over Rice Field"
             loading="eager"
           />
           <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl space-y-6 md:space-y-10 animate-[fadeInUp_0.8s_ease-out]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] md:text-xs font-bold tracking-widest uppercase backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Next-Gen Agriculture Platform
            </div>
            
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-black leading-[1.1] text-white tracking-tight">
              Modernizing <br className="hidden md:block"/>
              <span className="text-emerald-500">Farming </span>
              Through Data
            </h1>
            
            <p className="text-lg md:text-2xl text-slate-200 max-w-2xl leading-relaxed font-medium">
              AgriFlight connects DJI, XAG, and TTA fleets into a single command center. 
              Precision spraying, real-time mapping, and automated field analysis.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => setShowLogin(true)}
                className="h-14 md:h-16 px-8 md:px-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-lg transition-all shadow-2xl shadow-emerald-600/30 flex items-center justify-center gap-3 active:scale-95"
              >
                Start Mission <ArrowRight size={24} />
              </button>
              <button className="h-14 md:h-16 px-8 md:px-10 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold text-lg backdrop-blur-md transition-all flex items-center justify-center">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid Section */}
      <section className="py-20 md:py-32 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24 space-y-4">
            <h2 className="text-sm font-black text-emerald-600 tracking-[0.3em] uppercase">Unified Ecosystem</h2>
            <p className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Everything you need to scale your farm operations</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((s, i) => (
              <div key={i} className="group p-8 md:p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-emerald-600/10 transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 text-slate-900 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-500 shadow-inner">
                  {s.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4">{s.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm md:text-base">
                  {s.desc}
                </p>
                <div className="mt-8 flex items-center gap-2 text-emerald-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-500">
                  Learn more <ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Focus Section */}
      <section className="py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-24">
            <div className="flex-1 relative">
               <div className="absolute -inset-4 bg-emerald-600 rounded-[3rem] rotate-3 opacity-10"></div>
               <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/5] md:aspect-square">
                  <img 
                    src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=800&auto=format&fit=crop" 
                    className="w-full h-full object-cover"
                    alt="Precision Agriculture Drone DJI Agras T40"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-10 left-10">
                     <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-white">
                        <p className="font-black text-xl">DJI Agras T40</p>
                        <p className="text-emerald-400 text-sm font-bold">Industrial Grade Precision</p>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="flex-1 space-y-8 md:space-y-12">
              <div className="space-y-6">
                <h2 className="text-sm font-black text-emerald-600 tracking-[0.3em] uppercase">Built for Performance</h2>
                <p className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">High-precision spraying, zero waste.</p>
                <p className="text-lg md:text-xl text-slate-500 leading-relaxed">
                  Our algorithm calculates the optimal pathing and spray rate based on real-time weather data and crop health indices, ensuring every drop counts.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-4xl md:text-5xl font-black text-emerald-600 mb-2">100%</p>
                  <p className="text-sm md:text-base font-bold text-slate-900 uppercase tracking-widest">Data Integrity</p>
                </div>
                <div>
                  <p className="text-4xl md:text-5xl font-black text-blue-600 mb-2">24ms</p>
                  <p className="text-sm md:text-base font-bold text-slate-900 uppercase tracking-widest">API Latency</p>
                </div>
              </div>

              <button className="h-14 md:h-16 px-10 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl flex items-center gap-3">
                Download Specs <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 py-20 md:py-32 relative overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none" 
              style={{backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '40px 40px'}}>
         </div>
         
         <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
               <div className="space-y-2">
                  <div className="text-5xl md:text-7xl font-black text-white">1.2M+</div>
                  <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-sm">Rai Covered</p>
               </div>
               <div className="space-y-2">
                  <div className="text-5xl md:text-7xl font-black text-white">500+</div>
                  <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-sm">Active Pilots</p>
               </div>
               <div className="space-y-2">
                  <div className="text-5xl md:text-7xl font-black text-white">99.9%</div>
                  <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-sm">Uptime</p>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 md:py-20 border-t border-slate-100">
         <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                    <Sprout size={16} />
                  </div>
                  <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">O2O DESIGN</span>
               </div>
               
               <div className="flex gap-8 text-sm font-bold text-slate-500">
                  <a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a>
                  <a href="#" className="hover:text-emerald-600 transition-colors">Contact</a>
               </div>
               
               <p className="text-sm text-slate-400 font-medium">© 2025 AgriFlight Global. Built with precision.</p>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;