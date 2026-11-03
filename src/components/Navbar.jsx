import React, { useState } from 'react';
import { Menu, X, Phone, ShieldCheck, UserCircle, LogIn, Sparkles, MapPin, UserPlus } from 'lucide-react';
import { collegeInfo } from '../data/collegeData';

export default function Navbar({ onOpenLogin, onOpenEnrollment, currentPortal, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const scrollTo = (id) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white text-xs py-2 px-4 border-b border-indigo-900/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" /> Admissions Open 2026–27
            </span>
            <span className="hidden md:inline text-slate-300">
              Recognised by BIE AP • <strong className="text-amber-400">Code: {collegeInfo.bieCode}</strong>
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
            <a href={`tel:${collegeInfo.phones[0]}`} className="hover:text-amber-400 transition flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-amber-400" /> {collegeInfo.phones[0]}
            </a>
            <span className="hidden sm:inline opacity-40">|</span>
            <span className="hidden sm:flex items-center gap-1 text-slate-400">
              <MapPin className="w-3 h-3 text-red-400" /> Srikakulam, AP
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-3">
            
            {/* Logo & College Identity */}
            <div 
              className="flex items-center gap-2.5 cursor-pointer flex-shrink-0" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-md border-2 border-amber-400 bg-white flex items-center justify-center p-0.5 flex-shrink-0">
                <img 
                  src="./assets/sunrise_logo.svg" 
                  alt="Sunrise Junior College Crest" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-shrink-0">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-none">
                  SUNRISE <span className="text-amber-600">JUNIOR COLLEGE</span>
                </h1>
                <p className="text-[10px] font-bold text-slate-500 tracking-wider mt-1">
                  SRIKAKULAM • BIE AP CODE: {collegeInfo.bieCode}
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links (Visible on XL screens to guarantee zero overlap) */}
            <div className="hidden xl:flex items-center gap-4 2xl:gap-6 text-[13px] font-bold text-slate-700 whitespace-nowrap">
              <button onClick={() => scrollTo('hero')} className="hover:text-amber-600 transition">Home</button>
              <button onClick={() => scrollTo('about')} className="hover:text-amber-600 transition">About</button>
              <button onClick={() => scrollTo('courses')} className="hover:text-amber-600 transition">Academics</button>
              <button onClick={() => scrollTo('video-tour')} className="hover:text-amber-600 transition">Video Tour</button>
              <button onClick={() => scrollTo('facilities')} className="hover:text-amber-600 transition">Facilities</button>
              <button onClick={() => scrollTo('gallery')} className="hover:text-amber-600 transition">Gallery</button>
              <button onClick={() => scrollTo('contact')} className="hover:text-amber-600 transition">Contact</button>
            </div>

            {/* Action Buttons Right Side */}
            <div className="hidden md:flex items-center gap-2.5 flex-shrink-0">
              <button
                onClick={onOpenEnrollment}
                className="bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 font-extrabold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm whitespace-nowrap flex-shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5 text-amber-700" />
                <span>+ Enroll</span>
              </button>

              {currentPortal ? (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm whitespace-nowrap">
                    <UserCircle className="w-4 h-4 text-emerald-600" />
                    <span>{currentPortal.role.toUpperCase()} PORTAL</span>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1.5 rounded-lg transition whitespace-nowrap"
                  >
                    Exit
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenLogin}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5 whitespace-nowrap flex-shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Portal Login</span>
                </button>
              )}
            </div>

            {/* Mobile / Tablet Hamburger & Quick Action */}
            <div className="flex xl:hidden items-center gap-2">
              <button
                onClick={onOpenEnrollment}
                className="bg-amber-100 text-amber-950 border border-amber-300 text-[11px] font-black px-2.5 py-1.5 rounded-lg shadow-sm md:hidden"
              >
                + Enroll
              </button>
              <button
                onClick={onOpenLogin}
                className="bg-amber-500 text-slate-950 text-[11px] font-black px-2.5 py-1.5 rounded-lg shadow sm:hidden"
              >
                Login
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="xl:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-5 space-y-2 shadow-2xl">
            <button onClick={() => scrollTo('hero')} className="block w-full text-left py-2 font-semibold text-slate-800 hover:text-amber-600">Home</button>
            <button onClick={() => scrollTo('about')} className="block w-full text-left py-2 font-semibold text-slate-800 hover:text-amber-600">About College</button>
            <button onClick={() => scrollTo('courses')} className="block w-full text-left py-2 font-semibold text-slate-800 hover:text-amber-600">Academic Courses (MPC, BiPC, CEC, MEC)</button>
            <button onClick={() => scrollTo('video-tour')} className="block w-full text-left py-2 font-semibold text-slate-800 hover:text-amber-600">Video Tour</button>
            <button onClick={() => scrollTo('facilities')} className="block w-full text-left py-2 font-semibold text-slate-800 hover:text-amber-600">Hostel & Facilities</button>
            <button onClick={() => scrollTo('gallery')} className="block w-full text-left py-2 font-semibold text-slate-800 hover:text-amber-600">Campus Photo Gallery</button>
            <button onClick={() => scrollTo('contact')} className="block w-full text-left py-2 font-semibold text-slate-800 hover:text-amber-600">Contact College</button>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={() => { setIsOpen(false); onOpenEnrollment(); }}
                className="w-full bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 font-extrabold py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-2 text-xs"
              >
                <UserPlus className="w-4 h-4 text-amber-700" />
                <span>+ Enroll New Student or Teacher</span>
              </button>
              <button
                onClick={() => { setIsOpen(false); onOpenLogin(); }}
                className="w-full bg-amber-500 text-slate-950 font-black py-2.5 rounded-xl shadow flex items-center justify-center gap-2 text-xs"
              >
                <LogIn className="w-4 h-4" />
                <span>Portal Login (Student / Teacher / Admin)</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
