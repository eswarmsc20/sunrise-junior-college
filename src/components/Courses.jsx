import React from 'react';
import { BookOpen, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { coursesData } from '../data/collegeData';

export default function Courses({ onSelectCourse }) {
  const handleSelect = (courseTitle) => {
    if (onSelectCourse) onSelectCourse(courseTitle);
    const el = document.getElementById('admissions');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="courses" className="py-20 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            <span>Academic Offerings</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Intermediate Streams
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Recognised by the Board of Intermediate Education, AP. Offering rigorous two-year curricula in Science and Commerce streams in English Medium.
          </p>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coursesData.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Top Banner */}
              <div className={`p-6 bg-gradient-to-r ${course.color} text-white relative`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full">
                    {course.medium}
                  </span>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300 bg-black/20 px-2 py-0.5 rounded">
                    {course.badge}
                  </span>
                </div>
                <h3 className="text-2xl font-black tracking-tight">{course.code}</h3>
                <p className="text-xs text-white/90 font-medium mt-1">{course.title}</p>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                      Stream Highlights:
                    </h4>
                    <ul className="space-y-2">
                      {course.highlights.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => handleSelect(course.code)}
                  className="w-full mt-4 bg-slate-900 group-hover:bg-amber-500 text-white group-hover:text-slate-950 font-bold text-xs py-3 rounded-xl transition-colors duration-200 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Select & Apply for {course.code}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Academic Value Footnote */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-slate-200 text-center max-w-4xl mx-auto shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-bold text-slate-900 text-sm">Need help choosing the right stream after 10th Class / SSC?</h4>
            <p className="text-xs text-slate-600 mt-0.5">Our senior academic counselors offer free personalized career counseling.</p>
          </div>
          <a
            href="tel:8143217785"
            className="whitespace-nowrap bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow transition"
          >
            Call Career Helpline: 81432 17785
          </a>
        </div>

      </div>
    </section>
  );
}
