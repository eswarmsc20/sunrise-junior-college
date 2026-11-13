import React from 'react';
import { ArrowRight, Play, Award, CheckCircle2, ShieldCheck, PhoneCall, Sparkles, CreditCard, Camera, Download } from 'lucide-react';
import { collegeInfo } from '../data/collegeData';

export default function Hero({ onOpenLogin, onPlayVideo, onOpenPayment, onOpenExamPortal, onOpenBiometric }) {
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
              Welcome to <strong>Sunrise Junior College</strong> (BIE Code: <strong>01089</strong>). We deliver premier intermediate coaching for <strong>MPC, BiPC, CEC, MEC, and HEC</strong> with seasoned lecturers, structured study schedules, and safe residential hostel facilities right at Day & Night Junction, Srikakulam.
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
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
              <button
                onClick={() => scrollTo('admissions')}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-amber-500/25 transition flex items-center justify-center gap-2 text-sm sm:text-base group w-full sm:w-auto"
              >
                <span>Apply for Admission 2026–27</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => scrollTo('video-tour')}
                  className="flex-1 sm:flex-initial bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-white font-semibold px-4 py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center">
                    <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                  </div>
                  <span>Watch Video</span>
                </button>

                <button
                  onClick={onOpenLogin}
                  className="flex-1 sm:flex-initial text-center text-amber-300 hover:text-amber-200 text-xs sm:text-sm font-semibold underline underline-offset-4 px-2 py-3"
                >
                  Portal Login →
                </button>
              </div>
            </div>

            {/* Service Quick Access Pills */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 pt-3 border-t border-slate-800/70">
              <span className="col-span-2 sm:col-span-1 text-xs text-slate-400 font-bold uppercase tracking-wider">Quick Services:</span>
              <button
                onClick={onOpenPayment}
                className="bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 transition"
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="truncate">Pay Fee Online</span>
              </button>

              <button
                onClick={onOpenExamPortal}
                className="bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 text-xs font-bold px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 transition"
              >
                <Award className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span className="truncate">CBT Exam Portal</span>
              </button>

              <button
                onClick={onOpenBiometric}
                className="bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-bold px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 transition"
              >
                <Camera className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span className="truncate">50m Face Attendance</span>
              </button>

              <a
                href="./downloads/SunriseJuniorCollege.apk"
                download="SunriseJuniorCollege.apk"
                className="bg-lime-950/80 hover:bg-lime-900 border border-lime-500/40 text-lime-300 text-xs font-bold px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 transition"
                title="Download Official Android Mobile App (.apk)"
              >
                <Download className="w-3.5 h-3.5 text-lime-400 flex-shrink-0" />
                <span className="truncate">Download APK</span>
              </a>
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
                        <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                          Srikakulam, AP
                        </p>
                        <h3 className="text-xl font-black text-white leading-tight">
                          Sunrise Junior College
                        </h3>
                        <p className="text-xs text-slate-300">
                          Day & Night Jn, Beside KR Stadium
                        </p>
                      </div>

                      <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-amber-400 transition flex-shrink-0">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Government BIE Code Card */}
              <div className="mt-4 bg-white text-slate-900 rounded-2xl p-4 shadow-xl border border-slate-200 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Government Approved</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-semibold">RC No. 652995</span>
                  </div>
                  <p className="text-base font-black text-slate-950">
                    BIE AP Code: <span className="text-amber-600">01089</span>
                  </p>
                  <p className="text-[11px] text-slate-500">Board of Intermediate Education, Andhra Pradesh</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}