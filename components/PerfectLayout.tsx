import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sprout, 
  CheckCircle, 
  Users, 
  Zap, 
  Shield, 
  BarChart3, 
  Smartphone, 
  Globe,
  Star,
  Plus,
  Minus,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Play,
  X,
  Lock,
  UserCircle
} from 'lucide-react';
import { api } from '../services/api';
import MatrixVisualization from './MatrixVisualization';

import Documentation from './Documentation';

interface PerfectLayoutProps {
  onEnterApp: (user: any) => void;
}

const PerfectLayout: React.FC<PerfectLayoutProps> = ({ onEnterApp }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
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

  const partners = [
    { name: 'DJI', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/DJI_Logo.svg/1280px-DJI_Logo.svg.png' },
    { name: 'XAG', logo: 'https://mma.prnewswire.com/media/1325350/XAG_Logo.jpg?p=facebook' },
    { name: 'TTA', logo: 'https://ttadrone.com/wp-content/uploads/2021/04/TTA-Logo.png' },
    { name: 'Hetzner', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Hetzner_Online_Logo.svg/2560px-Hetzner_Online_Logo.svg.png' },
  ];

  const benefits = [
    {
      title: "Autonomous Pipelines",
      description: "Chain drone missions with AI analysis and IoT triggers in real-time.",
      icon: <Zap className="text-emerald-500" />,
      size: "col-span-2 row-span-2",
      image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Maker SDK",
      description: "Python & Node.js libraries for custom fleet orchestration.",
      icon: <Code className="text-blue-500" />,
      size: "col-span-1 row-span-1",
    },
    {
      title: "Edge AI Hub",
      description: "Deploy custom models directly to the edge for low-latency inference.",
      icon: <Cpu className="text-purple-500" />,
      size: "col-span-1 row-span-1",
    },
    {
      title: "Unified API",
      description: "One interface for DJI, XAG, and TTA telemetry and control.",
      icon: <Database className="text-orange-500" />,
      size: "col-span-2 row-span-1",
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Initialize SDK",
      description: "Import the AgriFlight Maker library into your Python or Node.js environment."
    },
    {
      number: "02",
      title: "Define Pipelines",
      description: "Create automated workflows linking telemetry events to mission triggers."
    },
    {
      number: "03",
      title: "Scale Globally",
      description: "Deploy your automation hub to the edge and manage massive drone fleets."
    }
  ];

  const pricing = [
    {
      name: "Maker (Solo)",
      price: "฿4,999",
      features: ["Up to 3 drones", "Maker SDK Access", "Community Support", "Mobile access"],
      highlight: false
    },
    {
      name: "Team Hub",
      price: "฿12,999",
      features: ["Up to 15 drones", "Custom AI Pipelines", "Priority 24/7 support", "API Integration", "Advanced AI pathing"],
      highlight: true
    },
    {
      name: "Scale (Enterprise)",
      price: "Custom",
      features: ["Unlimited drones", "Dedicated Edge Hub", "Custom development", "On-site training"],
      highlight: false
    }
  ];

  const testimonials = [
    {
      name: "Somchai P.",
      role: "Farm Owner",
      content: "AgriFlight changed how we manage our 500-rai rice farm. The efficiency is incredible.",
      avatar: "https://i.pravatar.cc/150?u=somchai"
    },
    {
      name: "Ananya K.",
      role: "Operations Manager",
      content: "The best multi-drone platform I've ever used. Simple, powerful, and reliable.",
      avatar: "https://i.pravatar.cc/150?u=ananya"
    },
    {
      name: "David Miller",
      role: "AgTech Consultant",
      content: "Finally, a unified dashboard that actually works with different drone brands.",
      avatar: "https://i.pravatar.cc/150?u=david"
    }
  ];

  const faqs = [
    {
      q: "Does it support DJI Agras T40?",
      a: "Yes, AgriFlight fully supports the DJI Agras series, including T40, T30, and T10 models with real-time telemetry."
    },
    {
      q: "Can I manage multiple pilots?",
      a: "Absolutely. Our Professional and Enterprise plans allow you to manage multiple pilot accounts with different permission levels."
    },
    {
      q: "What about data privacy?",
      a: "We take security seriously. All data is encrypted at rest and in transit, and we never share your farm data with third parties."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Auth Modal */}
      {showAuthModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowAuthModal(false)}></div>
          
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[420px] overflow-hidden relative z-10 animate-fadeInUp">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 z-20 bg-black/20 hover:bg-black/40 text-white p-1 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="h-40 bg-[url('https://images.unsplash.com/photo-1625246333195-58197bd47d26?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center relative">
              <div className="absolute inset-0 bg-emerald-900/70 flex flex-col items-center justify-center text-white p-6 text-center">
                <div className="bg-white/10 p-3 rounded-full mb-3 backdrop-blur-md">
                   <Sprout size={32} className="text-emerald-400" />
                </div>
                <h2 id="modal-title" className="text-2xl font-bold tracking-wide">{isLoginView ? 'AgriFlight Member' : 'Join AgriFlight'}</h2>
                <p className="text-emerald-100 text-sm">{isLoginView ? 'เข้าสู่ระบบเพื่อจัดการฟาร์มของคุณ' : 'ลงทะเบียนเพื่อเริ่มต้นใช้งาน'}</p>
              </div>
            </div>

            <form onSubmit={handleAuthSubmit} className="p-8 space-y-5">
               {error && (
                 <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 animate-shake" role="alert">
                   {error}
                 </div>
               )}
               <div className="space-y-4">
                 <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1.5" htmlFor="email">
                       <Mail size={16} className="text-emerald-600"/> อีเมล (Email)
                    </label>
                    <input 
                      id="email"
                      type="email" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-lg font-mono text-slate-800 placeholder:text-gray-400"
                      placeholder="your@email.com"
                      required
                      autoComplete="email"
                    />
                 </div>
                 {!isLoginView && (
                   <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1.5" htmlFor="phone">
                         <Smartphone size={16} className="text-emerald-600"/> เบอร์โทรศัพท์ (Phone)
                      </label>
                      <input 
                        id="phone"
                        type="tel" 
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-lg font-mono text-slate-800 placeholder:text-gray-400"
                        placeholder="08X-XXX-XXXX"
                        autoComplete="tel"
                      />
                   </div>
                 )}
                 <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1.5" htmlFor="password">
                       <Lock size={16} className="text-emerald-600"/> รหัสผ่าน (Password)
                    </label>
                    <input 
                      id="password"
                      type="password" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-lg font-mono text-slate-800 placeholder:text-gray-400"
                      placeholder="••••••••"
                      required
                      autoComplete={isLoginView ? "current-password" : "new-password"}
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
                   className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                 >
                    {isLoading ? 'Processing...' : isLoginView ? 'เข้าสู่ระบบ' : 'สร้างบัญชี'} <ArrowRight size={20} />
                 </button>
                 
                 <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-gray-100"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-300 text-xs font-light">หรือเชื่อมต่อผ่าน</span>
                    <div className="flex-grow border-t border-gray-100"></div>
                 </div>

                 <button 
                   type="button" 
                   onClick={() => onEnterApp({ role: 'guest' })} 
                   className="w-full bg-[#06C755] hover:bg-[#05b54d] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                   aria-label="Login with LINE"
                 >
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
                 aria-label={isLoginView ? "Switch to signup" : "Switch to login"}
               >
                 {isLoginView ? 'ลงทะเบียนเกษตรกร' : 'เข้าสู่ระบบ'}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200" role="navigation">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
              <Cpu size={24} />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">AgriFlight <span className="text-emerald-600">MAKER</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {['Services', 'How it works', 'Calculator', 'Pricing', 'FAQ'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowDocs(true)}
              className="px-4 h-12 flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-600 transition-all border border-transparent hover:border-emerald-100 hover:bg-emerald-50 rounded-full"
            >
              <BookOpen size={18} />
              <span>Docs</span>
            </button>
            <button 
              onClick={() => setShowAuthModal(true)}
              className="px-6 h-12 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/20"
              aria-label="Open application launch modal"
            >
              Launch App
            </button>
          </div>
        </div>
      </nav>

      <main role="main">
        {/* 2. Hero Area */}
        <header className="relative pt-40 pb-20">
          <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold tracking-wide uppercase">
                <Users size={14} /> 1,200+ Active Fleets Worldwide
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight text-slate-900">
                The Automation Hub <br/>
                <span className="text-emerald-600">for AI MAKERS</span>
              </h1>
              
              <p className="text-xl text-slate-600 max-w-xl leading-relaxed">
                Connect your drone fleets, IoT sensors, and AI models into a single autonomous pipeline. 
                Build, deploy, and scale agricultural automation with our Maker SDK.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="h-14 px-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-3 active:scale-95"
                  aria-label="Start mission and launch app"
                >
                  Start Mission <ArrowRight size={24} />
                </button>
                <button className="h-14 px-8 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-sm" aria-label="Watch demo video">
                  <Play size={20} fill="currentColor" /> Watch Demo
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1200&auto=format&fit=crop" 
                  alt="AgriFlight Dashboard Visualization" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* 3. Partners Section */}
        <section className="py-12 bg-white border-y border-slate-100">
          <div className="container mx-auto px-6">
            <p className="text-center text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Trusted by global industry leaders</p>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              {partners.map((p) => (
                <img key={p.name} src={p.logo} alt={`${p.name} logo`} className="h-8 md:h-10 object-contain" />
              ))}
            </div>
          </div>
        </section>

        {/* 4. Benefits Section (Bento Box) */}
        <section id="services" className="py-24 md:py-32">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
              <h2 className="text-emerald-600 font-black tracking-widest uppercase text-sm">Our Benefits</h2>
              <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Focus on yield, not management</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
              {benefits.map((b, i) => (
                <div 
                  key={i} 
                  className={`${b.size} group relative overflow-hidden bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between`}
                >
                  {b.image && (
                    <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity">
                      <img src={b.image} className="w-full h-full object-cover" alt="" />
                    </div>
                  )}
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                      {b.icon}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-3">{b.title}</h3>
                    <p className="text-slate-500 leading-relaxed font-medium">{b.description}</p>
                  </div>
                  <div className="relative z-10 flex justify-end">
                    <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all duration-500">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. How it works Section */}
        <section id="how-it-works" className="py-24 bg-slate-900 text-white rounded-[4rem] mx-6 animate-fadeInUp">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
              <h2 className="text-emerald-400 font-black tracking-widest uppercase text-sm">The Process</h2>
              <p className="text-4xl md:text-5xl font-black tracking-tight">Three steps to precision</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent -translate-y-1/2"></div>
              {steps.map((s, i) => (
                <div key={i} className="relative group text-center space-y-6 animate-fadeInUp" style={{ animationDelay: `${i * 0.2}s` }}>
                  <div className="w-20 h-20 bg-emerald-500 text-white rounded-3xl mx-auto flex items-center justify-center text-3xl font-black shadow-2xl shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                    {s.number}
                  </div>
                  <h3 className="text-2xl font-bold">{s.title}</h3>
                  <p className="text-slate-400 leading-relaxed max-w-xs mx-auto">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <MatrixVisualization />
      
      <Documentation isOpen={showDocs} onClose={() => setShowDocs(false)} />

      {/* 6. Pricing Section */}
        <section id="pricing" className="py-24 md:py-32">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4 animate-fadeInUp">
              <h2 className="text-emerald-600 font-black tracking-widest uppercase text-sm">Pricing Plans</h2>
              <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Simple plans for every farm</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 items-end">
              {pricing.map((p, i) => (
                <div 
                  key={i} 
                  className={`p-10 rounded-[2.5rem] border transition-all duration-500 animate-fadeInUp ${
                    p.highlight 
                      ? 'bg-white border-emerald-500 shadow-2xl shadow-emerald-600/10 scale-105 z-10 relative' 
                      : 'bg-white border-slate-200 shadow-sm hover:shadow-xl'
                  }`}
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  {p.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                      Most Popular
                    </div>
                  )}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-slate-500 mb-2">{p.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-slate-900">{p.price}</span>
                      {p.price !== 'Custom' && <span className="text-slate-400 font-medium">/month</span>}
                    </div>
                  </div>
                  <ul className="space-y-4 mb-10">
                    {p.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-3 text-slate-600 font-medium">
                        <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button 
                    className={`w-full py-4 rounded-2xl font-black transition-all active:scale-[0.98] ${
                      p.highlight 
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/30' 
                        : 'bg-slate-50 text-slate-900 hover:bg-slate-100 border border-slate-200'
                    }`}
                    aria-label={`Get started with ${p.name} plan`}
                  >
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Testimonials Section */}
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-emerald-600 font-black tracking-widest uppercase text-sm mb-4">Social Proof</h2>
            <p className="text-4xl md:text-5xl font-black text-slate-900 mb-20 animate-fadeInUp">Loved by people worldwide</p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <div key={i} className="p-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm text-left space-y-6 animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="flex gap-1 text-orange-400">
                    {[...Array(5)].map((_, star) => <Star key={star} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-slate-600 italic leading-relaxed font-medium">"{t.content}"</p>
                  <div className="flex items-center gap-4">
                    <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full ring-2 ring-emerald-500/20" />
                    <div>
                      <p className="font-black text-slate-900">{t.name}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. FAQ Section */}
        <section id="faq" className="py-24 md:py-32">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4 animate-fadeInUp">
              <h2 className="text-emerald-600 font-black tracking-widest uppercase text-sm">FAQ</h2>
              <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden bg-white animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
                  <button 
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full p-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                    aria-expanded={activeFaq === i}
                  >
                    <span className="font-black text-slate-900">{faq.q}</span>
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      {activeFaq === i ? <Minus size={18} /> : <Plus size={18} />}
                    </div>
                  </button>
                  {activeFaq === i && (
                    <div className="p-6 pt-0 text-slate-600 leading-relaxed font-medium animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Final CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="relative rounded-[4rem] bg-emerald-600 p-12 md:p-24 overflow-hidden text-center text-white animate-fadeInUp">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">Ready to scale your farm operations?</h2>
                <p className="text-xl text-emerald-100 font-medium">Join 1,200+ farmers already optimizing their yield with AgriFlight.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <button 
                    onClick={() => onEnterApp({ role: 'guest' })}
                    className="h-16 px-10 bg-white text-emerald-600 hover:bg-slate-50 rounded-2xl font-black text-xl transition-all shadow-2xl shadow-black/20 flex items-center justify-center gap-3 active:scale-95"
                    aria-label="Get started for free"
                  >
                    Get Started Now <ArrowRight size={24} />
                  </button>
                  <button className="h-16 px-10 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-xl transition-all flex items-center justify-center" aria-label="Contact sales team">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 10. Footer */}
      <footer className="bg-white border-t border-slate-200 pt-24 pb-12" role="contentinfo">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2 lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                  <Sprout size={24} />
                </div>
                <span className="text-2xl font-black tracking-tight text-slate-900">AgriFlight</span>
              </div>
              <p className="text-slate-500 leading-relaxed max-w-xs font-medium">
                The unified ecosystem for next-generation agricultural drone management and fleet optimization.
              </p>
              <div className="flex gap-4">
                {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-600 transition-all" aria-label={`Social link ${i}`}>
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs">Product</h4>
              <ul className="space-y-4 text-slate-500 font-bold text-sm">
                {['Features', 'Integrations', 'Pricing', 'API Docs'].map(item => (
                  <li key={item}><a href="#" className="hover:text-emerald-600 transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs">Company</h4>
              <ul className="space-y-4 text-slate-500 font-bold text-sm">
                {['About Us', 'Careers', 'Privacy Policy', 'Terms'].map(item => (
                  <li key={item}><a href="#" className="hover:text-emerald-600 transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs">Newsletter</h4>
              <div className="space-y-4">
                <p className="text-xs text-slate-400 font-bold">Get the latest AgTech news.</p>
                <div className="flex gap-2">
                  <input type="email" placeholder="Email" className="w-full px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" aria-label="Newsletter email" />
                  <button className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors" aria-label="Subscribe to newsletter">
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-400 text-sm font-bold">
            <p>© 2025 AgriFlight Global. Built with precision.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-slate-600 transition-colors">Security</a>
              <a href="#" className="hover:text-slate-600 transition-colors">Sitemap</a>
              <a href="#" className="hover:text-slate-600 transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PerfectLayout;
