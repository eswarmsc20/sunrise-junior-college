import React from 'react';
import { Sparkles, Shield, Heart, ArrowUp } from 'lucide-react';
import { collegeInfo } from '../data/collegeData';
import sunriseLogo from '../assets/sunrise_official_logo.png';

export default function Footer({ onOpenLogin }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-12 border-t border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Identity */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-transparent flex items-center justify-center flex-shrink-0">
                <img src={sunriseLogo} alt="Sunrise Junior College Official Crest" className="w-full h-full object-contain filter drop-shadow" />
              </div>
              <div>
                <h3 className="font-extrabold text-base tracking-tight text-white leading-tight">
                  SUNRISE JUNIOR COLLEGE
                </h3>
                <p className="text-[11px] text-amber-400 font-semibold">
                  SRIKAKULAM • BIE AP CODE: {collegeInfo.bieCode}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering intermediate students through disciplined education, experienced faculties, and homelike residential hostels in Srikakulam.
            </p>

            <div className="text-xs text-slate-400 space-y-1">
              <p><strong>Affiliated:</strong> Board of Intermediate Education, AP</p>
              <p><strong>Society:</strong> Sunrise Educational Society</p>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={() => scrollTo('hero')} className="hover:text-white transition">Home</button></li>
              <li><button onClick={() => scrollTo('about')} className="hover:text-white transition">About Us</button></li>
              <li><button onClick={() => scrollTo('courses')} className="hover:text-white transition">Courses Offered</button></li>
              <li><button onClick={() => scrollTo('video-tour')} className="hover:text-white transition">Video Tour</button></li>
              <li><button onClick={() => scrollTo('facilities')} className="hover:text-white transition">Campus & Hostels</button></li>
              <li><button onClick={() => scrollTo('gallery')} className="hover:text-white transition">Photo Gallery</button></li>
            </ul>
          </div>

          {/* Col 3: Academic Programs */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Academic Streams</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><span className="text-white font-medium">M.P.C:</span> Maths, Physics, Chemistry</li>
              <li><span className="text-white font-medium">Bi.P.C:</span> Biology, Physics, Chemistry</li>
              <li><span className="text-white font-medium">C.E.C:</span> Civics, Economics, Commerce</li>
              <li><span className="text-white font-medium">M.E.C:</span> Maths, Economics, Commerce</li>
              <li><span className="text-white font-medium">H.E.C:</span> History, Economics, Civics</li>
              <li className="pt-2">
                <button
                  onClick={onOpenLogin}
                  className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold px-3 py-1.5 rounded-lg border border-amber-500/40 transition inline-block"
                >
                  Student & Staff Login Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Office */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Campus Contact</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Day & Night Junction, Opp. Sindhoora Hospital, Beside K.R. Stadium, Srikakulam – 532001, AP.
            </p>
            <div className="space-y-1 text-xs text-slate-300">
              <p><strong>Cell:</strong> 8143217785, 7989285425</p>
              <p><strong>Admin:</strong> 9618342843</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Sunrise Junior College, Srikakulam. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Website designed in English</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Top</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
