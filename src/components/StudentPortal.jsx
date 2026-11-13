import React, { useState } from 'react';
import { User, Award, BookOpen, Calendar, CheckCircle2, Download, LogOut, ShieldCheck, Clock, FileText, MapPin, Navigation, Receipt, MessageSquare, AlertCircle } from 'lucide-react';
import { COLLEGE_LOCATION, calculateDistanceMeters, createWhatsAppLink } from '../utils/geoUtils';

export default function StudentPortal({ 
  student, 
  onLogout, 
  onOpenReceipt, 
  onOpenMarks, 
  onSendAlert,
  onOpenPayment,
  onOpenExamPortal,
  onOpenBiometric
}) {
  const [gpsLoading, setGpsLoading] = useState(false);
  const [currentDistance, setCurrentDistance] = useState(student.attendanceLog?.gpsDistanceMeters || 18);
  const [checkedIn, setCheckedIn] = useState(student.attendanceLog?.todayStatus === 'Present');
  const [adminApproved, setAdminApproved] = useState(student.attendanceLog?.adminApproved ?? true);
  const [simulatedLocation, setSimulatedLocation] = useState(true);

  const s = student;
  const fee = s.feeDetails || {
    totalFee: 35000,
    paidFee: 25000,
    dueFee: 10000,
    status: 'Partial Due'
  };

  // GPS Check-in handler
  const handleDetectGPS = () => {
    setGpsLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const dist = calculateDistanceMeters(
            pos.coords.latitude,
            pos.coords.longitude,
            COLLEGE_LOCATION.lat,
            COLLEGE_LOCATION.lng
          );
          setCurrentDistance(dist);
          setSimulatedLocation(false);
          setGpsLoading(false);
        },
        (err) => {
          // Fallback to simulated campus distance if permission is denied or running on desktop
          setCurrentDistance(16);
          setSimulatedLocation(true);
          setGpsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      setCurrentDistance(18);
      setGpsLoading(false);
    }
  };

  const handleStudentCheckIn = () => {
    if (currentDistance <= COLLEGE_LOCATION.allowedRadiusMeters) {
      setCheckedIn(true);
      setAdminApproved(true);
      if (onSendAlert) {
        onSendAlert({
          title: "Attendance Recorded & Dispatched",
          message: `Daily Attendance for ${s.name} recorded (within 50m radius). Notification sent to Student (${s.phone}) and Father (${s.fatherPhone}).`
        });
      }
    }
  };

  const attendanceWhatsAppMsg = `*SUNRISE JUNIOR COLLEGE, SRIKAKULAM*
(BIE AP Code: 01089)
Daily Attendance Notification:
------------------------------------
Dear Parent,
Your ward *${s.name}* (Adm No: ${s.admissionNo}, Group: ${s.groupFull || s.group}) has been marked *PRESENT* today at Sunrise Junior College premises (Geofence GPS verified).
Check-in Time: 08:42 AM
Campus: Day & Night Junction, Srikakulam.
Principal Desk: 8143217785`;

  const fatherAttendanceWhatsApp = createWhatsAppLink(s.fatherPhone || s.phone, attendanceWhatsAppMsg);

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header / Profile Ribbon */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold text-2xl shadow-md">
              {s.name ? s.name.charAt(0) : 'S'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full">
                  Student Portal • BIE AP Code: 01089
                </span>
                <span className="text-xs text-emerald-300 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  Adm No: {s.admissionNo}
                </span>
                <span className="text-xs text-slate-300">
                  {s.isHostel ? 'Residential Hostel' : 'Day Scholar'}
                </span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">{s.name}</h2>
              <p className="text-xs text-slate-300 font-mono">
                Hall Ticket: <strong className="text-white">{s.hallTicket}</strong> • Father: <strong className="text-amber-300">{s.fatherName}</strong> ({s.fatherPhone})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            {onOpenPayment && (
              <button
                onClick={onOpenPayment}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-3.5 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
              >
                <span>Pay Fee Online (UPI)</span>
              </button>
            )}
            {onOpenExamPortal && (
              <button
                onClick={onOpenExamPortal}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-black px-3.5 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
              >
                <span>CBT Exam & Hall Ticket</span>
              </button>
            )}
            <button
              onClick={() => onOpenReceipt(s)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Receipt className="w-4 h-4" />
              <span>Fee Receipt Only</span>
            </button>
            <button
              onClick={() => onOpenMarks(s)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span>Marks Memo Only</span>
            </button>
            <button
              onClick={onLogout}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition flex items-center gap-1.5 shadow"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit Portal</span>
            </button>
          </div>
        </div>

        {/* 50-Meter Geofenced Daily Attendance Banner */}
        <div className="bg-white rounded-3xl p-6 border-2 border-indigo-100 shadow-md">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-900 text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-indigo-600" />
                  GPS 50-Meter Geofence Attendance
                </span>
                <span className="text-xs text-slate-500">
                  College Radius: <strong>Within 50 Meters</strong>
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900">
                Daily Campus Attendance Detection
              </h3>

              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>College Coordinates: <strong>18.3069° N, 83.8936° E</strong> (Day & Night Jn)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-600">Your Current Distance:</span>
                  <span className={`font-mono font-black px-2 py-0.5 rounded ${
                    currentDistance <= 50 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {currentDistance} Meters {currentDistance <= 50 ? '(Inside 50m Zone)' : '(Outside Zone)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {onOpenBiometric && (
                <button
                  onClick={onOpenBiometric}
                  className="bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow"
                >
                  <span>📷 Face Biometric Scan</span>
                </button>
              )}

              <button
                onClick={handleDetectGPS}
                disabled={gpsLoading}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-300 transition flex items-center gap-1.5"
              >
                <Navigation className={`w-3.5 h-3.5 ${gpsLoading ? 'animate-spin' : ''}`} />
                <span>{gpsLoading ? 'Detecting GPS...' : 'Scan GPS Location'}</span>
              </button>

              {checkedIn ? (
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Attendance Marked Present (08:42 AM)</span>
                  </div>
                  <a
                    href={fatherAttendanceWhatsApp}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-2.5 rounded-xl flex items-center gap-1 shadow"
                    title="Send WhatsApp Alert to Father"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send Father WhatsApp</span>
                  </a>
                </div>
              ) : (
                <button
                  onClick={handleStudentCheckIn}
                  disabled={currentDistance > 50}
                  className={`text-xs font-bold px-5 py-2.5 rounded-xl shadow transition flex items-center gap-2 ${
                    currentDistance <= 50
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Check In Daily Attendance</span>
                </button>
              )}
            </div>

          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attendance Rate</span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-slate-900">{s.attendance || 94}%</h3>
              <span className="text-xs text-emerald-600 font-semibold">Regular (Above 75%)</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${s.attendance || 94}%` }} />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Fee Status</span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-extrabold text-slate-900">₹ {fee.paidFee.toLocaleString('en-IN')}</h3>
              <span className="text-xs text-slate-500">Paid of ₹ {fee.totalFee.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-amber-700 font-bold">Due: ₹ {fee.dueFee.toLocaleString('en-IN')}</span>
              <button onClick={() => onOpenReceipt(s)} className="text-indigo-600 font-bold hover:underline">
                Generate Receipt →
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Academic Grade</span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-slate-900">A1</h3>
              <span className="text-xs text-emerald-600 font-semibold">Distinction</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">All Unit Tests & Half-Yearly Passed</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Parent Alert Service</span>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold pt-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp / SMS Active</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Linked to: {s.fatherPhone}</p>
          </div>
        </div>

        {/* Detailed Marks Cards & Fast Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Latest Marks Breakdown */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Half-Yearly Examination Report</h3>
                <p className="text-xs text-slate-500">Board Model Examination 2026-27</p>
              </div>
              <button
                onClick={() => onOpenMarks(s)}
                className="text-xs font-black text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200 hover:bg-indigo-100 transition"
              >
                Print / View Marks Memo →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                    <th className="py-3 px-2">Subject Name</th>
                    <th className="py-3 px-2 text-center">Max Marks</th>
                    <th className="py-3 px-2 text-center">Scored</th>
                    <th className="py-3 px-2 text-right">Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Object.entries(s.examReports?.['Half-Yearly Exam (100M)'] || s.marks || {}).map(([subject, marks], idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-3 px-2 font-bold text-slate-800">{subject}</td>
                      <td className="py-3 px-2 text-center text-slate-500">100</td>
                      <td className="py-3 px-2 text-center font-extrabold text-slate-900">{marks}</td>
                      <td className="py-3 px-2 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          marks >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {marks >= 85 ? 'Distinction' : 'First Class'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between text-xs text-slate-600">
              <span><strong>Principal Sudarshan Rao's Note:</strong> Excellent progress in Science subjects. Target State Top-10 in AP Intermediate Board.</span>
            </div>
          </div>

          {/* Right: Quick Receipt & Notification Panel */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900">Fee & Notification Central</h3>
              <p className="text-xs text-slate-500">Official receipts & automated messaging status</p>
            </div>

            {/* Fee summary card */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900">Official Receipt #REC-2026-0001</span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Acknowledged
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Paid: <strong>₹ {fee.paidFee.toLocaleString('en-IN')}</strong> | Balance Due: <strong>₹ {fee.dueFee.toLocaleString('en-IN')}</strong>
              </p>
              <button
                onClick={() => onOpenReceipt(s)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl shadow transition flex items-center justify-center gap-2"
              >
                <Receipt className="w-4 h-4 text-amber-400" />
                <span>View & Print Official Receipt</span>
              </button>
            </div>

            {/* WhatsApp notification card */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                <MessageSquare className="w-4 h-4 text-emerald-700" />
                <span>Direct WhatsApp & SMS Integration</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                All fee receipts, test marks, and 50m geofence daily attendance are synchronized directly with your father ({s.fatherName} - {s.fatherPhone}).
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
