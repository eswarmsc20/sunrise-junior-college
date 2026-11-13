import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, ExternalLink, ShieldCheck, Send, CheckCircle2, MessageSquare, CreditCard, Sparkles } from 'lucide-react';
import { collegeInfo } from '../data/collegeData';
import { createWhatsAppLink } from '../utils/geoUtils';

export default function Contact({ onOpenPayment, onOpenCampaign, onOpenExamPortal }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    stream: 'MPC',
    school: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const enquiryMessage = `*NEW ADMISSION ENQUIRY - SUNRISE JUNIOR COLLEGE*
----------------------------------------
• Student Name: ${formData.name}
• Contact Phone: ${formData.phone}
• Interested Stream: ${formData.stream}
• School / Location: ${formData.school || 'Not specified'}
• Query: ${formData.message || 'Interested in Intermediate 2026-27 admission and hostel guidance.'}
----------------------------------------
BIE AP Code: 01089 • Srikakulam`;

  const waPrincipalLink = createWhatsAppLink('8143217785', enquiryMessage);

  return (
    <section id="contact" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5 text-amber-700" />
            <span>Campus Visit & Admissions Desk</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Connect with Sunrise Junior College
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            We are located in the heart of Srikakulam at Day & Night Junction. Send an enquiry, visit during counseling hours, or pay fees online.
          </p>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6">
            {onOpenPayment && (
              <button
                onClick={onOpenPayment}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow-sm"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Online Fee Payment (UPI QR)</span>
              </button>
            )}

            {onOpenExamPortal && (
              <button
                onClick={onOpenExamPortal}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Exam Portal & Hall Ticket</span>
              </button>
            )}

            {onOpenCampaign && (
              <button
                onClick={onOpenCampaign}
                className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow-sm"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>2-Day Drip Campaigns & Festival Broadcasts</span>
              </button>
            )}
          </div>
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

          {/* Interactive Admission Enquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-extrabold text-slate-900">
                Student Admission & Course Enquiry
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Have questions regarding MPC, BiPC, CEC, MEC, or Hostel facilities? Submit your details below for instant guidance.
              </p>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Student Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. K. Sai Teja"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 7893505185"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500 font-mono font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Intermediate Stream
                    </label>
                    <select
                      value={formData.stream}
                      onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500 font-medium bg-white"
                    >
                      <option value="MPC">MPC (Maths, Physics, Chemistry)</option>
                      <option value="BiPC">BiPC (Biology, Physics, Chemistry)</option>
                      <option value="MEC">MEC (Maths, Economics, Commerce)</option>
                      <option value="CEC">CEC (Civics, Economics, Commerce)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      School / Native Place
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Srikakulam / Amadalavalasa"
                      value={formData.school}
                      onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Question or Hostel Requirement
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ask about coaching timings, hostel rooms, scholarship eligibility, etc."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500 font-medium resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition shadow-lg text-sm"
                  >
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>Submit Enquiry to Sunrise Admissions Desk</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-emerald-950">
                    Enquiry Received Successfully!
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1">
                    Thank you <strong>{formData.name}</strong>. Our academic counselors will contact you at <strong>{formData.phone}</strong> shortly.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                  <a
                    href={waPrincipalLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat Directly with Principal on WhatsApp</span>
                  </a>

                  <button
                    onClick={() => setSubmitted(false)}
                    className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl border border-slate-300 transition"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              </div>
            )}

            {/* Map Preview Link */}
            <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
              <span>📍 Campus Landmark: Day & Night Junction, Opp. Sindhoora Hospital, Srikakulam</span>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=18.306922,83.893685"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-amber-600 hover:text-amber-700"
              >
                Driving Directions &rarr;
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}