import React, { useState } from 'react';
import { Send, CheckCircle2, Phone, Calendar, User, BookOpen, Sparkles, Building2 } from 'lucide-react';
import { collegeInfo } from '../data/collegeData';

export default function AdmissionForm({ initialCourse }) {
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    phone: '',
    sscScore: '',
    stream: initialCourse || 'M.P.C',
    accommodation: 'Day Scholar',
    remarks: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.studentName || !formData.phone) return;

    // Save to local storage for Admin Portal to view
    const existing = JSON.parse(localStorage.getItem('sunrise_admissions') || '[]');
    const newInquiry = {
      id: 'INQ' + Date.now().toString().slice(-4),
      date: new Date().toLocaleDateString('en-GB'),
      ...formData
    };
    localStorage.setItem('sunrise_admissions', JSON.stringify([newInquiry, ...existing]));

    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      studentName: '',
      parentName: '',
      phone: '',
      sscScore: '',
      stream: 'M.P.C',
      accommodation: 'Day Scholar',
      remarks: ''
    });
  };

  return (
    <section id="admissions" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-16">
            
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Admissions 2026–2027</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Secure Your Seat at Sunrise Junior College
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Take the decisive step towards academic triumph. Fill out the application inquiry form and our admissions desk will call you with counseling details, fee structures, and scholarship options.
              </p>

              <div className="space-y-3 pt-2 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">1</div>
                  <span>Instant seat reservation & document verification</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">2</div>
                  <span>Direct interaction with experienced subject faculty</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">3</div>
                  <span>Hostel room selection & parent visit counseling</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-col gap-1 text-xs text-slate-400">
                <p><strong>Admission Helpline:</strong> 81432 17785 / 79892 85425</p>
                <p><strong>Campus Desk:</strong> Day & Night Junction, Opp. Sindhoora Hospital, Srikakulam</p>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-7 bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900">
                    Admission Inquiry Received!
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Thank you, <strong>{formData.studentName}</strong>. Our admissions officer will contact your phone number (<strong>{formData.phone}</strong>) shortly with complete course and hostel details.
                  </p>
                  <button
                    onClick={handleReset}
                    className="mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Online Admission & Counseling Form
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Student Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.studentName}
                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                        placeholder="e.g. Nakka Rahul"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Parent / Guardian Name
                      </label>
                      <input
                        type="text"
                        value={formData.parentName}
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        placeholder="e.g. N. Rama Rao"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Contact Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 9493044571"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        10th / SSC GPA or Marks
                      </label>
                      <input
                        type="text"
                        value={formData.sscScore}
                        onChange={(e) => setFormData({ ...formData, sscScore: e.target.value })}
                        placeholder="e.g. 9.5 GPA or 520 Marks"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Desired Intermediate Stream *
                      </label>
                      <select
                        value={formData.stream}
                        onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      >
                        <option value="M.P.C">M.P.C (Maths, Physics, Chemistry)</option>
                        <option value="Bi.P.C">Bi.P.C (Biology, Physics, Chemistry)</option>
                        <option value="C.E.C">C.E.C (Civics, Economics, Commerce)</option>
                        <option value="M.E.C">M.E.C (Maths, Economics, Commerce)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Hostel / Accommodation Preference
                      </label>
                      <select
                        value={formData.accommodation}
                        onChange={(e) => setFormData({ ...formData, accommodation: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      >
                        <option value="Day Scholar">Day Scholar (Local Transport)</option>
                        <option value="Boys Hostel">Boys Hostel (Residential)</option>
                        <option value="Girls Hostel">Girls Hostel (Residential)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Any Questions or Specific Requests?
                    </label>
                    <textarea
                      rows="2"
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      placeholder="e.g. Inquiring about defense coaching or fee concessions..."
                      className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-sm py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Admission Inquiry</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
