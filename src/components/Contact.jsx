import React from 'react';
import { MapPin, Phone, Mail, Clock, ExternalLink, ShieldCheck } from 'lucide-react';
import { collegeInfo } from '../data/collegeData';

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5 text-amber-700" />
            <span>Campus Visit & Contact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Connect with Sunrise Junior College
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            We are located in the heart of Srikakulam at Day & Night Junction. Visit us during office hours or call our helpline.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Campus Address Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-base">Campus Address</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {collegeInfo.address}
                </p>
                <div className="pt-2">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=18.306922,83.893685"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Direct Phone Lines Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-base">Helpline Numbers</h3>
                <p className="text-xs text-slate-500">Principal & Admission Desk Direct Lines:</p>
                <div className="space-y-1 pt-1 font-semibold text-slate-800 text-sm">
                  {collegeInfo.phones.map((p, idx) => (
                    <div key={idx}>
                      <a href={`tel:${p}`} className="hover:text-amber-600 transition flex items-center gap-1.5">
                        <span>{p}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Working Hours Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-base">Office & Counseling Hours</h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Monday to Saturday: <strong>8:30 AM – 6:00 PM</strong><br />
                  Sunday (Admission Season): <strong>9:00 AM – 2:00 PM</strong>
                </p>
              </div>
            </div>

          </div>

          {/* Map & Landmark Visual */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Srikakulam Campus Location</h3>
                <p className="text-xs text-slate-500">Opposite Sindhoora Hospital, Beside K.R. Stadium</p>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                Easy Bus & Auto Access
              </span>
            </div>

            {/* Embedded Visual Map Preview */}
            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-slate-200 bg-slate-100">
              <iframe
                title="College Location Map"
                src="https://maps.google.com/maps?q=18.306922,83.893685&z=16&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl">
              <span><strong>Landmark:</strong> Day & Night Junction, Srikakulam</span>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=18.306922,83.893685"
                target="_blank"
                rel="noreferrer"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg transition"
              >
                Get Driving Directions
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
