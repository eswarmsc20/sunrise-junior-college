import React from 'react';
import { Award, BookOpen, UserCheck, Shield, Check, HeartHandshake } from 'lucide-react';
import { collegeInfo } from '../data/collegeData';

export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5 text-amber-700" />
            <span>Institutional Background</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            About Sunrise Junior College
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Managed under the esteemed <strong>Sunrise Educational Society</strong>, we have been shaping young academic aspirations in Srikakulam with dedicated mentorship and disciplined educational standards.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Principal's Profile & Message Card */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md flex-shrink-0">
                  <img
                    src="./assets/frame_15s.jpg"
                    alt="Principal Sri Andhavarapu Sudarshan Rao"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full inline-block">
                    Principal & Correspondent
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {collegeInfo.principal}
                  </h3>
                  <p className="text-xs text-slate-300">Sunrise Junior College, Srikakulam</p>
                </div>
              </div>

              <blockquote className="text-slate-300 text-sm leading-relaxed italic border-l-2 border-amber-400 pl-4 py-1">
                "Our single-minded mission is to provide an encouraging, high-discipline academic environment where every student, whether in Science, Commerce, or Humanities (HEC), realizes their fullest potential with confidence."
              </blockquote>

              <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Board Affiliation:</span>
                  <span className="font-semibold text-amber-300">Board of Intermediate Education, AP</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Recognition Code:</span>
                  <span className="font-bold text-white">BIE AP Code: 01089</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Govt Order:</span>
                  <span className="font-medium text-slate-200">RC No. 652995/E2-3/2008-09</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Key Institutional Pillars */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl font-bold text-slate-900">
              Why Parents & Students Choose Sunrise
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Sunrise Junior College provides a balanced, student-centric intermediate program. With strategically planned classes, intensive doubt-clearing sessions, and regular examinations, our students master fundamental subject concepts necessary for both Intermediate Board Exams and competitive assessments.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 hover:border-amber-200 transition">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">20+ Years Faculty Experience</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Lecturers with decades of proven expertise deliver concept-first teaching across all core subjects.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 hover:border-amber-200 transition">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                  <Shield className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Safe & Disciplined Campus</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Strict academic discipline, biometric/supervised attendance, and CCTV monitored premises.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 hover:border-amber-200 transition">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Individual Mentoring</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Regular progress card dispatches to parents and personalized academic counseling for each student.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 hover:border-amber-200 transition">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Hostel Care for Outstation Students</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Separate, homelike residential hostel accommodations for boys and girls with hygienic meals.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
