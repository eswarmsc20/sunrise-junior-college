import React from 'react';
import { ArrowRight, Play, Award, CheckCircle2, ShieldCheck, PhoneCall, Sparkles } from 'lucide-react';
import { collegeInfo } from '../data/collegeData';

export default function Hero({ onOpenLogin, onPlayVideo }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white pt-12 pb-20 lg:pt-16 lg:pb-28">
      {/* Background Glows & Patterns */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-amber-500/10 border border-amber-400/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Sunrise Educational Society • Affiliated to BIE AP</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
              Empowering Minds, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200">
                Inspiring Futures
              </span> in Srikakulam.
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              Welcome to <strong>Sunrise Junior College</strong> (BIE Code: <strong>01089</strong>). We deliver premier intermediate coaching for <strong>MPC, BiPC, CEC, and MEC</strong> with seasoned lecturers, structured study schedules, and safe residential hostel facilities right at Day & Night Junction, Srikakulam.
            </p>

            {/* Quick Benefits Bullet List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-sm text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Teaching by 20+ Years Experienced Faculty</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Separate Hostels for Boys & Girls</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Regular Weekly & Monthly Exam Assessments</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Guidance for Defense, NDA, JEE & NEET</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => scrollTo('admissions')}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-amber-500/25 transition flex items-center gap-2 text-sm sm:text-base group"
              >
                <span>Apply for Admission 2026–27</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>

              <button
                onClick={() => scrollTo('video-tour')}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-white font-semibold px-5 py-3.5 rounded-xl transition flex items-center gap-2 text-sm sm:text-base"
              >
                <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                <span>Watch Campus Video</span>
              </button>

              <button
                onClick={onOpenLogin}
                className="text-amber-300 hover:text-amber-200 text-sm font-semibold underline underline-offset-4 px-2"
              >
                Student / Staff Login →
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Card (Clean & Zero Overlaps) */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Decorative Gradient Border */}
              <div className="p-2 rounded-3xl bg-gradient-to-tr from-amber-500/40 via-indigo-500/30 to-amber-300/40 shadow-2xl">
                <div 
                  className="relative bg-slate-900 rounded-2xl overflow-hidden aspect-[4/3] group cursor-pointer" 
                  onClick={() => scrollTo('video-tour')}
                >
                  <img
                    src="./assets/campus_building_1.jpg"
                    alt="Sunrise Junior College Building Srikakulam"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-95"
                  />
                  
                  {/* Clean Non-Overlapping Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-between p-5">
                    <div className="flex items-center justify-between">
                      <span className="bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-400/40 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                        Featured Campus
                      </span>
                      <div className="flex items-center gap-1.5 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[11px] font-bold px-3 py-1 rounded-full shadow">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>Admissions Active</span>
                      </div>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <h4 className="text-white font-extrabold text-base sm:text-lg leading-tight">
                          Sunrise Junior College
                        </h4>
                        <p className="text-slate-300 text-xs mt-0.5">Day & Night Junction, Srikakulam</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition flex-shrink-0">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Recognition Strip Below Image (Separated) */}
              <div className="mt-4 bg-slate-800/90 backdrop-blur-md text-white rounded-2xl p-3.5 shadow-xl border border-slate-700/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 font-semibold">Government Approved Intermediate</p>
                    <p className="text-xs font-black text-white">BIE AP Recognition Code: <span className="text-amber-400">01089</span></p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold text-slate-300 bg-slate-700/60 px-2.5 py-1 rounded-lg">
                  ESTD. 2008
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Metrics Bar */}
        <div className="mt-16 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-400">2008–09</h3>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">Established Year</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-400">01089</h3>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">BIE AP Recognition Code</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-400">4 Key Streams</h3>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">MPC • BiPC • CEC • MEC</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-400">100% In-House</h3>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">Hostels & Labs on Campus</p>
          </div>
        </div>

      </div>
    </section>
  );
}
