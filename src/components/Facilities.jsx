import React from 'react';
import { Building2, GraduationCap, BookOpenCheck, FileSpreadsheet, FlaskConical, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import { facilitiesData } from '../data/collegeData';

const iconMap = {
  Building2,
  GraduationCap,
  BookOpenCheck,
  FileSpreadsheet,
  FlaskConical,
  MapPin
};

export default function Facilities() {
  return (
    <section id="facilities" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Infrastructure & Student Life</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            World-Class Amenities for Uninterrupted Learning
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            We provide an atmosphere where learning flourishes with safety, discipline, and full support for both day scholars and residential hostel students.
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilitiesData.map((f, idx) => {
            const Icon = iconMap[f.icon] || Building2;
            return (
              <div
                key={idx}
                className="bg-slate-50 hover:bg-white rounded-3xl p-8 border border-slate-200/80 hover:border-amber-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 group-hover:bg-amber-500 text-amber-700 group-hover:text-slate-950 flex items-center justify-center transition-colors duration-300 mb-6">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2.5">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {f.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-amber-700">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Assured Standard Quality</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Special Hostel Highlight Banner */}
        <div className="mt-16 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 rounded-3xl p-8 shadow-xl text-slate-950 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-slate-950 text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full inline-block">
              Residential Care
            </span>
            <h3 className="text-2xl font-black">
              Separate Hostels for Boys & Girls with Homely Care
            </h3>
            <p className="text-sm font-medium text-slate-900 max-w-2xl">
              Equipped with 24/7 security, nutritious wholesome meals, dedicated study desks, and round-the-clock resident faculty support.
            </p>
          </div>

          <a
            href="tel:7989285425"
            className="whitespace-nowrap bg-slate-950 hover:bg-slate-900 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg transition"
          >
            Hostel Inquiries: 79892 85425
          </a>
        </div>

      </div>
    </section>
  );
}
