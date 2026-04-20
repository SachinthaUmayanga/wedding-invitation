import React, { useState, useEffect } from 'react';
import { Heart, Calendar, MapPin, Clock, ArrowDown } from 'lucide-react';
import Image from './assets/img/couple.jpg';

export default function App() {
  // --- Cookie Helper Functions ---
  const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  };

  const getCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  // --- Name Entry & Caching Logic ---
  const [guestName, setGuestName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  // Check cache on initial load
  useEffect(() => {
    const cachedName = getCookie('weddingGuestName');
    if (cachedName) {
      setGuestName(cachedName);
      setIsInviteOpen(true);
    }
  }, []);

  const handleOpenInvite = (e) => {
    e.preventDefault();
    if (nameInput.trim()) {
      const finalName = nameInput.trim();
      setGuestName(finalName);
      // Cache the name as a cookie for 30 days so it persists across sessions
      setCookie('weddingGuestName', finalName, 30);
      setIsInviteOpen(true);
    }
  };

  // --- Countdown Timer Logic ---
  const calculateTimeLeft = () => {
    const difference = +new Date("2026-07-16T08:30:00") - +new Date();
    let timeLeft = {};
    
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (!isInviteOpen) return; // Don't run timer if invite isn't open
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  // --- Scroll & Parallax Effects ---
  const [offsetY, setOffsetY] = useState(0);
  
  useEffect(() => {
    if (!isInviteOpen) return;

    // Parallax scroll listener
    const handleScroll = () => setOffsetY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Intersection Observer for Blur-Reveals
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [isInviteOpen]);

  // --- UI: Welcome Screen ---
  if (!isInviteOpen) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-stone-800 font-sans selection:bg-[#cba258] selection:text-white flex flex-col items-center justify-center relative overflow-hidden">
        {/* Cinematic Noise Overlay */}
        <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
          .font-script { font-family: 'Great Vibes', cursive; }
          .font-serif { font-family: 'Playfair Display', serif; }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `}</style>

        <div className="z-10 flex flex-col items-center w-full max-w-md px-6 text-center animate-fade-in">
          <Heart className="w-8 h-8 text-[#cba258] mb-8 opacity-80" strokeWidth={1} />
          <h1 className="font-serif text-3xl md:text-4xl text-white/90 mb-4 font-light tracking-wide">Welcome to Our Wedding</h1>
          <p className="font-serif text-[10px] md:text-xs tracking-[0.4em] text-[#cba258] mb-12 uppercase">Please enter your name</p>
          
          <form onSubmit={handleOpenInvite} className="w-full flex flex-col items-center">
            <input 
              type="text" 
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your Name"
              className="w-full bg-transparent border-b border-white/20 text-white font-serif text-xl md:text-2xl text-center px-4 py-3 focus:outline-none focus:border-[#cba258] transition-colors mb-10 placeholder:text-white/20 placeholder:font-light"
              autoFocus
            />
            <button 
              type="submit" 
              disabled={!nameInput.trim()}
              className="border border-[#cba258]/50 text-[#cba258] px-10 py-3 rounded-full font-serif uppercase tracking-[0.2em] text-[10px] hover:bg-[#cba258] hover:text-black transition-all duration-500 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#cba258]"
            >
              Open Invitation
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- UI: Main Invitation ---
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-stone-800 font-sans selection:bg-[#cba258] selection:text-white overflow-x-hidden relative scroll-smooth">
      
      {/* Cinematic Noise Overlay */}
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      {/* Custom Animations & Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
        
        html { scroll-behavior: smooth; }
        
        .font-script { font-family: 'Great Vibes', cursive; }
        .font-serif { font-family: 'Playfair Display', serif; }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes kenBurns {
          0% { transform: scale(1.05); }
          100% { transform: scale(1.15); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-ken-burns {
          animation: kenBurns 30s ease-out forwards;
        }
        
        /* Ultra-Premium Blur Reveal Animations */
        .reveal {
          opacity: 0;
          transform: translateY(50px) scale(0.95);
          filter: blur(12px);
          transition: all 1.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.active {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0);
        }
        .reveal-delay-1 { transition-delay: 0.15s; }
        .reveal-delay-2 { transition-delay: 0.3s; }
        .reveal-delay-3 { transition-delay: 0.45s; }
        
        /* Premium Gold Gradient Text Animation */
        .gold-gradient {
          background: linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          background-size: 200% auto;
          animation: shine 5s linear infinite;
        }
        @keyframes shine {
          to { background-position: 200% center; }
        }

        /* Custom scrollbar for an elegant touch */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #050505; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #cba258; }
      `}</style>

      {/* Hero Section */}
      <header className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-black">
        
        {/* Parallax Background Image with Ken Burns Zoom */}
        <div className="absolute inset-0 z-0 overflow-hidden" style={{ transform: `translateY(${offsetY * 0.4}px)` }}>
          <img 
            src= {Image}
            alt="Couple background" 
            className="w-full h-full object-cover opacity-70 animate-ken-burns origin-center"
          />
          {/* Complex gradient overlay for extreme depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#0a0a0a]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center w-full max-w-5xl mx-auto mt-10">
          
          {/* Personalized Greeting */}
          <div className="reveal active flex flex-col items-center mb-8">
             <p className="font-script text-3xl md:text-4xl text-[#cba258] drop-shadow-md">Warmly Inviting,</p>
             <p className="font-serif text-lg md:text-xl text-white/90 mt-2 tracking-[0.3em] uppercase font-light">{guestName}</p>
          </div>

          {/* Monogram Initials */}
          <div className="reveal active reveal-delay-1 flex items-center justify-center gap-6 md:gap-10 mb-2">
            <h1 className="font-serif text-7xl md:text-8xl lg:text-9xl text-white/95 tracking-widest drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] font-light">D</h1>
            <span className="font-serif text-5xl md:text-6xl lg:text-7xl gold-gradient italic font-light">&</span>
            <h1 className="font-serif text-7xl md:text-8xl lg:text-9xl text-white/95 tracking-widest drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] font-light">S</h1>
          </div>

          {/* Date */}
          <p className="reveal active reveal-delay-2 font-serif text-[11px] md:text-[13px] tracking-[0.6em] text-white/70 mb-16 md:mb-20 uppercase">
            16 . 07 . 2026
          </p>

          {/* Boxed Countdown Timer */}
          <div className="reveal active reveal-delay-3 flex justify-center gap-3 md:gap-6 text-center">
            {Object.keys(timeLeft).length ? (
              <>
                <div className="flex flex-col items-center justify-center border border-white/10 bg-white/[0.02] backdrop-blur-xl w-[80px] h-[96px] md:w-[110px] md:h-[130px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)] rounded-lg group hover:bg-white/[0.05] hover:border-[#cba258]/40 transition-all duration-700">
                  <span className="text-3xl md:text-5xl font-serif text-[#cba258] mb-2 drop-shadow-[0_2px_10px_rgba(203,162,88,0.2)] font-light">{String(timeLeft.days).padStart(2, '0')}</span>
                  <span className="text-[8px] md:text-[10px] uppercase tracking-[0.25em] text-white/50 group-hover:text-[#cba258] transition-colors duration-700">Days</span>
                </div>
                <div className="flex flex-col items-center justify-center border border-white/10 bg-white/[0.02] backdrop-blur-xl w-[80px] h-[96px] md:w-[110px] md:h-[130px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)] rounded-lg group hover:bg-white/[0.05] hover:border-[#cba258]/40 transition-all duration-700">
                  <span className="text-3xl md:text-5xl font-serif text-[#cba258] mb-2 drop-shadow-[0_2px_10px_rgba(203,162,88,0.2)] font-light">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-[8px] md:text-[10px] uppercase tracking-[0.25em] text-white/50 group-hover:text-[#cba258] transition-colors duration-700">Hours</span>
                </div>
                <div className="flex flex-col items-center justify-center border border-white/10 bg-white/[0.02] backdrop-blur-xl w-[80px] h-[96px] md:w-[110px] md:h-[130px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)] rounded-lg group hover:bg-white/[0.05] hover:border-[#cba258]/40 transition-all duration-700">
                  <span className="text-3xl md:text-5xl font-serif text-[#cba258] mb-2 drop-shadow-[0_2px_10px_rgba(203,162,88,0.2)] font-light">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="text-[8px] md:text-[10px] uppercase tracking-[0.25em] text-white/50 group-hover:text-[#cba258] transition-colors duration-700">Mins</span>
                </div>
                <div className="flex flex-col items-center justify-center border border-white/10 bg-white/[0.02] backdrop-blur-xl w-[80px] h-[96px] md:w-[110px] md:h-[130px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)] rounded-lg group hover:bg-white/[0.05] hover:border-[#cba258]/40 transition-all duration-700">
                  <span className="text-3xl md:text-5xl font-serif text-[#cba258] mb-2 drop-shadow-[0_2px_10px_rgba(203,162,88,0.2)] font-light">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="text-[8px] md:text-[10px] uppercase tracking-[0.25em] text-white/50 group-hover:text-[#cba258] transition-colors duration-700">Secs</span>
                </div>
              </>
            ) : (
              <span className="text-xl md:text-2xl font-serif gold-gradient tracking-[0.3em] uppercase border border-white/10 bg-white/[0.02] backdrop-blur-xl px-12 py-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-lg font-light">
                The Day is Here
              </span>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 reveal active reveal-delay-3">
          <span className="text-[8px] uppercase tracking-[0.3em] text-white/30">Scroll</span>
          <ArrowDown className="w-4 h-4 text-white/40 animate-bounce" strokeWidth={1} />
        </div>
      </header>

      {/* Parents Section (Light Theme) */}
      <section className="py-32 px-4 bg-[#fdfbf7] relative z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-4xl mx-auto flex flex-col items-center reveal">
          
          <Heart className="w-5 h-5 text-[#cba258] mb-16 opacity-70 animate-float" strokeWidth={1} />

          <div className="flex flex-col md:flex-row justify-center items-center gap-16 md:gap-32 w-full">
            <div className="text-center relative reveal reveal-delay-1">
              <p className="text-[9px] uppercase tracking-[0.35em] text-[#cba258] mb-5 font-semibold">Loving Daughter of</p>
              <p className="font-serif text-xl md:text-2xl text-[#2a2a2a] leading-loose font-light">
                Mr. H. P. G. Dharmadasa Alwis<br/>
                <span className="text-[#cba258] text-lg italic opacity-80 my-2 block">&</span>
                Mrs. P. K. Chandani
              </p>
            </div>
            
            <div className="hidden md:block w-[1px] h-40 bg-gradient-to-b from-transparent via-[#cba258]/30 to-transparent reveal"></div>
            <div className="md:hidden w-40 h-[1px] bg-gradient-to-r from-transparent via-[#cba258]/30 to-transparent my-6 reveal"></div>

            <div className="text-center reveal reveal-delay-2">
              <p className="text-[9px] uppercase tracking-[0.35em] text-[#cba258] mb-5 font-semibold">Loving Son of</p>
              <p className="font-serif text-xl md:text-2xl text-[#2a2a2a] leading-loose font-light">
                Mr. G. W. Upul Shantha<br/>
                <span className="text-[#cba258] text-lg italic opacity-80 my-2 block">&</span>
                Mrs. G. W. Samanlatha Kumudini
              </p>
            </div>
          </div>

          <div className="mt-28 text-center reveal">
            <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400 mb-6 font-medium">Together with their parents</p>
            <p className="font-script text-4xl md:text-5xl text-[#cba258] mb-4">Warmly inviting {guestName}</p>
            <p className="text-3xl md:text-5xl text-[#1a1a1a] font-serif font-light tracking-wide mt-6">
              To request the pleasure of your company
            </p>
          </div>
        </div>
      </section>

      {/* Event Details Section */}
      <section className="py-32 px-4 bg-[#050505] relative overflow-hidden">
        
        {/* Ambient Glows */}
        <div className="absolute top-1/3 left-1/4 w-[40rem] h-[40rem] bg-[#cba258] rounded-full blur-[150px] opacity-[0.03] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-white rounded-full blur-[150px] opacity-[0.02] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-24 reveal">
            <h2 className="text-5xl md:text-6xl font-script text-white mb-8 font-light tracking-wide drop-shadow-md">When & Where</h2>
            <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-[#cba258]/50 to-transparent mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            
            {/* Poruwa Card */}
            <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl p-10 md:p-14 rounded-t-[100px] rounded-b-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_40px_rgba(0,0,0,0.8)] border border-white/5 text-center relative group hover:border-[#cba258]/20 transition-all duration-700 reveal reveal-delay-1">
              <div className="absolute inset-0 bg-gradient-to-b from-[#cba258]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-t-[100px] rounded-b-2xl"></div>
              
              <div className="w-16 h-16 bg-black/80 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5 group-hover:border-[#cba258]/40 group-hover:shadow-[0_0_20px_rgba(203,162,88,0.2)] transition-all duration-700">
                <Clock className="w-6 h-6 text-[#cba258]" strokeWidth={1} />
              </div>
              
              <h3 className="text-2xl md:text-3xl font-serif text-white/95 mb-4 font-light">Poruwa Ceremony</h3>
              <p className="gold-gradient font-medium tracking-[0.3em] uppercase text-[10px] mb-12">10:00 AM</p>
              
              <div className="space-y-6 text-stone-400 font-light">
                <div>
                  <p className="font-serif text-xl text-white/80 mb-2">Friday, July 16</p>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-stone-500">2026</p>
                </div>
                <div className="w-8 h-[1px] bg-white/10 mx-auto group-hover:bg-[#cba258]/30 transition-colors duration-700"></div>
                <div className="pt-2">
                  <p className="font-medium text-white/80 text-lg tracking-wide mb-1">Owinmo Hotel</p>
                  <p className="text-sm text-stone-400">Bellerose Banquet Hall</p>
                  <p className="text-sm text-stone-500 mt-1">Uluwitike, Galle</p>
                </div>
              </div>
            </div>

            {/* Celebration Card */}
            <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl p-10 md:p-14 rounded-t-[100px] rounded-b-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_40px_rgba(0,0,0,0.8)] border border-white/5 text-center relative group hover:border-[#cba258]/20 transition-all duration-700 reveal reveal-delay-2">
              <div className="absolute inset-0 bg-gradient-to-b from-[#cba258]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-t-[100px] rounded-b-2xl"></div>
              
              <div className="w-16 h-16 bg-black/80 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5 group-hover:border-[#cba258]/40 group-hover:shadow-[0_0_20px_rgba(203,162,88,0.2)] transition-all duration-700">
                <Heart className="w-6 h-6 text-[#cba258]" strokeWidth={1} />
              </div>
              
              <h3 className="text-2xl md:text-3xl font-serif text-white/95 mb-4 font-light">Wedding Celebration</h3>
              <p className="gold-gradient font-medium tracking-[0.3em] uppercase text-[10px] mb-12">8:30 AM to 4:00 PM</p>
              
              <div className="space-y-6 text-stone-400 font-light">
                <div>
                  <p className="font-serif text-xl text-white/80 mb-2">Friday, July 16</p>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-stone-500">2026</p>
                </div>
                <div className="w-8 h-[1px] bg-white/10 mx-auto group-hover:bg-[#cba258]/30 transition-colors duration-700"></div>
                <div className="pt-2">
                  <p className="font-medium text-white/80 text-lg tracking-wide mb-1">Owinmo Hotel</p>
                  <p className="text-sm text-stone-400">Bellerose Banquet Hall</p>
                  <p className="text-sm text-stone-500 mt-1">Uluwitike, Galle</p>
                </div>
              </div>
            </div>

          </div>

          {/* Location Map Section */}
          <div className="mt-24 bg-[#0a0a0a]/80 backdrop-blur-2xl p-6 md:p-10 rounded-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_40px_rgba(0,0,0,0.8)] border border-white/5 reveal transition-all hover:border-white/10 duration-700">
            <h3 className="text-2xl font-serif text-white/80 mb-8 text-center tracking-wide font-light">Getting There</h3>
            <div className="w-full h-[350px] md:h-[500px] rounded-2xl overflow-hidden border border-white/5 relative group bg-[#111]">
              <div className="absolute inset-0 bg-black/40 pointer-events-none group-hover:bg-transparent transition-colors duration-1000 z-10"></div>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1202.4308743263882!2d80.21416431919414!3d6.083373829749665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae1716b4669756b%3A0x3deaf040a7f9bdd8!2sOwinmo%20Hotel%20%26%20Reception%20Hall!5e0!3m2!1sen!2slk!4v1776658626686!5m2!1sen!2slk" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Owinmo Hotel Location Map"
                className="filter grayscale contrast-125 opacity-70 group-hover:grayscale-[50%] group-hover:opacity-100 transition-all duration-[1.5s]"
              ></iframe>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#020202] text-stone-500 py-20 text-center border-t border-white/[0.02] relative z-10">
        <h2 className="font-script text-5xl md:text-6xl gold-gradient mb-6 drop-shadow-sm font-light">Deshani & Sachintha</h2>
        <p className="text-[10px] uppercase tracking-[0.5em] text-stone-600 font-medium">July 16, 2026</p>
      </footer>
    </div>
  );
}