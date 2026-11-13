import React, { useState } from 'react';
import { X, UserPlus, GraduationCap, School, Check, Send, Sparkles, Phone, Mail, Award, BookOpen } from 'lucide-react';
import { createWhatsAppLink } from '../utils/geoUtils';

export default function EnrollmentModal({ isOpen, onClose, onEnrollStudent, onEnrollTeacher, onSendAlert }) {
  const [enrollType, setEnrollType] = useState('student'); // 'student' | 'teacher'

  // Student Form State
  const [studentForm, setStudentForm] = useState({
    name: '',
    admissionNo: `SJC-2026-${Math.floor(60 + Math.random() * 40)}`,
    hallTicket: `2601089${Math.floor(60 + Math.random() * 40)}`,
    group: 'MPC',
    phone: '',
    fatherName: '',
    fatherPhone: '',
    isHostel: false,
    totalFee: 35000,
    paidFee: 20000
  });

  // Teacher Form State
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    id: `TCH${Math.floor(107 + Math.random() * 30)}`,
    department: 'Physics',
    designation: 'Senior Lecturer',
    qualification: 'M.Sc., B.Ed.',
    phone: '',
    email: '',
    assignedStreams: 'MPC & BiPC',
    experience: '10+ Years'
  });

  const [submittedMessage, setSubmittedMessage] = useState('');

  if (!isOpen) return null;

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    if (!studentForm.name || !studentForm.phone) return;

    const total = Number(studentForm.totalFee) || (studentForm.isHostel ? 65000 : 35000);
    const paid = Number(studentForm.paidFee) || 0;
    const due = total - paid;

    const newRecord = {
      id: `STU${Date.now().toString().slice(-4)}`,
      admissionNo: studentForm.admissionNo,
      hallTicket: studentForm.hallTicket,
      name: studentForm.name.trim().toUpperCase(),
      group: studentForm.group,
      groupFull: studentForm.isHostel ? `${studentForm.group} EM H` : `${studentForm.group} EM`,
      phone: studentForm.phone,
      fatherName: studentForm.fatherName || 'Parent',
      fatherPhone: studentForm.fatherPhone || studentForm.phone,
      isHostel: studentForm.isHostel,
      attendance: 95,
      feeStatus: due === 0 ? 'Paid' : 'Partial Due',
      feeDetails: {
        totalFee: total,
        paidFee: paid,
        dueFee: due,
        status: due === 0 ? 'Fully Paid' : 'Partial Due',
        receipts: [
          {
            receiptNo: `REC-2026-${Date.now().toString().slice(-4)}`,
            date: new Date().toLocaleDateString('en-GB'),
            amountPaid: paid,
            paymentMode: 'Cash / Bank',
            transactionRef: 'NEW-ADM',
            remarks: 'Admission & Initial Tuition Fee'
          }
        ]
      },
      examReports: {
        'Unit Test - 1 (25M)': { 'Maths/Botany': 23, 'Physics/Zoology': 22, 'Chemistry': 24, 'English': 23, 'Sanskrit': 24 },
        'Unit Test - 2 (25M)': { 'Maths/Botany': 24, 'Physics/Zoology': 23, 'Chemistry': 23, 'English': 24, 'Sanskrit': 25 },
        'Quarterly Exam (100M)': { 'Maths/Botany': 88, 'Physics/Zoology': 85, 'Chemistry': 87, 'English': 89, 'Sanskrit': 95 },
        'Half-Yearly Exam (100M)': { 'Maths/Botany': 92, 'Physics/Zoology': 89, 'Chemistry': 90, 'English': 91, 'Sanskrit': 97 }
      },
      attendanceLog: {
        todayStatus: 'Present',
        checkInTime: '08:45 AM',
        gpsDistanceMeters: 15,
        geofenceVerified: true,
        adminApproved: true
      }
    };

    if (onEnrollStudent) onEnrollStudent(newRecord);

    const alertMsg = `Student ${studentForm.name} (Adm No: ${studentForm.admissionNo}) enrolled! Welcome SMS & WhatsApp dispatched to Student (${studentForm.phone}) and Father (${studentForm.fatherPhone}).`;
    setSubmittedMessage(alertMsg);

    if (onSendAlert) {
      onSendAlert({
        title: "Student Enrollment Successful",
        message: alertMsg
      });
    }

    setTimeout(() => {
      setSubmittedMessage('');
      onClose();
    }, 2000);
  };

  const handleTeacherSubmit = (e) => {
    e.preventDefault();
    if (!teacherForm.name || !teacherForm.phone) return;

    const newFaculty = {
      id: teacherForm.id,
      name: teacherForm.name.trim(),
      department: teacherForm.department,
      designation: teacherForm.designation,
      qualification: teacherForm.qualification,
      phone: teacherForm.phone,
      email: teacherForm.email || `${teacherForm.name.toLowerCase().replace(/[^a-z]/g, '')}@sunrisejc.edu.in`,
      assignedStreams: [teacherForm.assignedStreams],
      experience: teacherForm.experience,
      dateOfJoining: new Date().toISOString().split('T')[0]
    };

    if (onEnrollTeacher) onEnrollTeacher(newFaculty);

    const alertMsg = `Teacher ${teacherForm.name} (ID: ${teacherForm.id}) registered in Faculty Directory! Onboarding SMS & WhatsApp credentials sent to (${teacherForm.phone}).`;
    setSubmittedMessage(alertMsg);

    if (onSendAlert) {
      onSendAlert({
        title: "Teacher Registration Successful",
        message: alertMsg
      });
    }

    setTimeout(() => {
      setSubmittedMessage('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/20 px-2 py-0.5 rounded">
              Institutional Enrollment Desk
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-white">
            Official Enrollment & Registration
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Sunrise Junior College, Srikakulam (BIE Code: 01089)
          </p>
        </div>

        {/* Enrollment Type Switcher Tabs */}
        <div className="grid grid-cols-2 p-2 bg-slate-100 border-b border-slate-200 gap-1">
          <button
            type="button"
            onClick={() => { setEnrollType('student'); setSubmittedMessage(''); }}
            className={`py-3 text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 ${
              enrollType === 'student' ? 'bg-white text-slate-950 shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-5 h-5 text-amber-600" />
            <span>Student Enrollment</span>
          </button>

          <button
            type="button"
            onClick={() => { setEnrollType('teacher'); setSubmittedMessage(''); }}
            className={`py-3 text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 ${
              enrollType === 'teacher' ? 'bg-white text-slate-950 shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <School className="w-5 h-5 text-blue-600" />
            <span>Teacher / Faculty Registration</span>
          </button>
        </div>

        {/* Success Alert */}
        {submittedMessage && (
          <div className="m-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{submittedMessage}</span>
          </div>
        )}

        {/* 1. Student Enrollment Form */}
        {enrollType === 'student' && !submittedMessage && (
          <form onSubmit={handleStudentSubmit} className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-bold text-slate-900 text-sm">Enroll New Intermediate Student</h4>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                Academic Year 2026–27
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Student Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  placeholder="e.g. Nakka Suresh"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Admission Number *
                </label>
                <input
                  type="text"
                  required
                  value={studentForm.admissionNo}
                  onChange={(e) => setStudentForm({ ...studentForm, admissionNo: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold bg-slate-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Intermediate Stream *
                </label>
                <select
                  value={studentForm.group}
                  onChange={(e) => setStudentForm({ ...studentForm, group: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="MPC">MPC (Mathematics, Physics, Chemistry)</option>
                  <option value="BiPC">BiPC (Biology, Physics, Chemistry)</option>
                  <option value="CEC">CEC (Civics, Economics, Commerce)</option>
                  <option value="MEC">MEC (Maths, Economics, Commerce)</option>
                  <option value="HEC">HEC (History, Economics, Civics)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hostel / Accommodation
                </label>
                <select
                  value={studentForm.isHostel ? 'Hostel' : 'Day'}
                  onChange={(e) => setStudentForm({ ...studentForm, isHostel: e.target.value === 'Hostel' })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Day">Day Scholar (Local Transport)</option>
                  <option value="Hostel">Residential Hostel (Boys / Girls)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Student Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={studentForm.phone}
                  onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                  placeholder="e.g. 9848012345"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Father / Guardian Name *
                </label>
                <input
                  type="text"
                  required
                  value={studentForm.fatherName}
                  onChange={(e) => setStudentForm({ ...studentForm, fatherName: e.target.value })}
                  placeholder="e.g. N. Prasad Rao"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Father Mobile Number (For SMS & WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  value={studentForm.fatherPhone}
                  onChange={(e) => setStudentForm({ ...studentForm, fatherPhone: e.target.value })}
                  placeholder="e.g. 9440123456"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Initial Fee Received (₹)
                </label>
                <input
                  type="number"
                  value={studentForm.paidFee}
                  onChange={(e) => setStudentForm({ ...studentForm, paidFee: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Complete Student Enrollment & Dispatch Welcome SMS/WhatsApp</span>
            </button>
          </form>
        )}

        {/* 2. Teacher Enrollment Form */}
        {enrollType === 'teacher' && !submittedMessage && (
          <form onSubmit={handleTeacherSubmit} className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-bold text-slate-900 text-sm">Register New Faculty / Lecturer</h4>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                Faculty Portal Onboarding
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Faculty Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={teacherForm.name}
                  onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                  placeholder="e.g. Sri K. Ramanjaneyulu"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Faculty ID (Auto Generated) *
                </label>
                <input
                  type="text"
                  required
                  value={teacherForm.id}
                  onChange={(e) => setTeacherForm({ ...teacherForm, id: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold bg-slate-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Department / Subject *
                </label>
                <select
                  value={teacherForm.department}
                  onChange={(e) => setTeacherForm({ ...teacherForm, department: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Physics">Physics</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology (Botany & Zoology)</option>
                  <option value="Commerce">Commerce & Economics</option>
                  <option value="Civics">Civics</option>
                  <option value="English">English & Communication</option>
                  <option value="Sanskrit">Sanskrit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Designation *
                </label>
                <select
                  value={teacherForm.designation}
                  onChange={(e) => setTeacherForm({ ...teacherForm, designation: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Senior Lecturer">Senior Lecturer</option>
                  <option value="HOD & Senior Lecturer">HOD & Senior Lecturer</option>
                  <option value="Dean of Academics">Dean of Academics</option>
                  <option value="Lecturer">Lecturer</option>
                  <option value="Junior Lecturer">Junior Lecturer</option>
                  <option value="Lab In-Charge">Lab In-Charge</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Educational Qualification *
                </label>
                <input
                  type="text"
                  required
                  value={teacherForm.qualification}
                  onChange={(e) => setTeacherForm({ ...teacherForm, qualification: e.target.value })}
                  placeholder="e.g. M.Sc. (Physics), B.Ed."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Teaching Experience
                </label>
                <input
                  type="text"
                  value={teacherForm.experience}
                  onChange={(e) => setTeacherForm({ ...teacherForm, experience: e.target.value })}
                  placeholder="e.g. 15 Years"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number (For Login & WhatsApp Alerts) *
                </label>
                <input
                  type="tel"
                  required
                  value={teacherForm.phone}
                  onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                  placeholder="e.g. 9848123456"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Email Address
                </label>
                <input
                  type="email"
                  value={teacherForm.email}
                  onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                  placeholder="e.g. faculty@sunrisejc.edu.in"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-sm py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <School className="w-4 h-4 text-amber-400" />
              <span>Register Faculty & Send Onboarding Credentials</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
