import React, { useState, useEffect } from 'react';
import { Users, School, BookOpen, ShieldCheck, FileSpreadsheet, Plus, Search, Filter, Phone, CheckCircle, Clock, Trash2, LogOut, Bell, Sparkles, Receipt, Award, MessageSquare, MapPin, Check, Mail, UserPlus } from 'lucide-react';
import initialStudents from '../data/studentsData.json';
import initialTeachers from '../data/teachersData.json';
import { createWhatsAppLink } from '../utils/geoUtils';

export default function AdminPortal({ 
  admin, 
  onLogout, 
  onOpenReceipt, 
  onOpenMarks, 
  onSendAlert, 
  onOpenEnrollment,
  onOpenPayment,
  onOpenCampaign,
  onOpenBiometric,
  onOpenExamPortal
}) {
  const [activeTab, setActiveTab] = useState('students'); // 'students' | 'faculty' | 'attendance' | 'enroll_student' | 'enroll_teacher' | 'inquiries'
  
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('sunrise_enrolled_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem('sunrise_enrolled_teachers');
    return saved ? JSON.parse(saved) : initialTeachers;
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [groupFilter, setGroupFilter] = useState('ALL');
  const [inquiries, setInquiries] = useState([]);

  // Student Form State
  const [newStudent, setNewStudent] = useState({
    name: '',
    admissionNo: `SJC-2026-${(students.length + 1).toString().padStart(3, '0')}`,
    hallTicket: `2601089${(students.length + 1).toString().padStart(3, '0')}`,
    group: 'MPC',
    groupFull: 'M.P.C EM',
    phone: '',
    fatherName: '',
    fatherPhone: '',
    isHostel: false,
    totalFee: 35000,
    paidFee: 20000
  });

  // Teacher Form State
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    id: `TCH${(teachers.length + 101).toString()}`,
    department: 'Physics',
    designation: 'Senior Lecturer',
    qualification: 'M.Sc., B.Ed.',
    phone: '',
    email: '',
    assignedStreams: 'MPC & BiPC',
    experience: '12 Years'
  });

  const [enrollSuccessMessage, setEnrollSuccessMessage] = useState('');

  useEffect(() => {
    const loaded = JSON.parse(localStorage.getItem('sunrise_admissions') || '[]');
    setInquiries(loaded);
  }, []);

  const saveStudents = (newStudentsList) => {
    setStudents(newStudentsList);
    localStorage.setItem('sunrise_enrolled_students', JSON.stringify(newStudentsList));
  };

  const saveTeachers = (newTeachersList) => {
    setTeachers(newTeachersList);
    localStorage.setItem('sunrise_enrolled_teachers', JSON.stringify(newTeachersList));
  };

  const handleStudentEnrollSubmit = (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.phone) return;

    const total = Number(newStudent.totalFee) || (newStudent.isHostel ? 65000 : 35000);
    const paid = Number(newStudent.paidFee) || 0;
    const due = total - paid;

    const studentRecord = {
      id: `STU${(students.length + 1).toString().padStart(3, '0')}`,
      admissionNo: newStudent.admissionNo,
      hallTicket: newStudent.hallTicket,
      name: newStudent.name.trim().toUpperCase(),
      group: newStudent.group,
      groupFull: newStudent.isHostel ? `${newStudent.group} EM H` : `${newStudent.group} EM`,
      phone: newStudent.phone,
      fatherName: newStudent.fatherName || 'Parent',
      fatherPhone: newStudent.fatherPhone || newStudent.phone,
      isHostel: newStudent.isHostel,
      attendance: 95,
      feeStatus: due === 0 ? 'Paid' : 'Partial Due',
      feeDetails: {
        totalFee: total,
        paidFee: paid,
        dueFee: due,
        status: due === 0 ? 'Fully Paid' : 'Partial Due',
        receipts: [
          {
            receiptNo: `REC-2026-${(students.length + 1).toString().padStart(4, '0')}`,
            date: new Date().toLocaleDateString('en-GB'),
            amountPaid: paid,
            paymentMode: 'Cash / Office',
            transactionRef: 'ADM-RECEIPT',
            remarks: 'Enrolment & Admission Initial Fee'
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
        gpsDistanceMeters: 14,
        geofenceVerified: true,
        adminApproved: true
      }
    };

    const updated = [studentRecord, ...students];
    saveStudents(updated);
    setEnrollSuccessMessage(`Student ${newStudent.name} (Adm No: ${newStudent.admissionNo}) enrolled! Welcome SMS & WhatsApp dispatched to Student & Father.`);

    if (onSendAlert) {
      onSendAlert({
        title: "Student Enrollment Successful",
        message: `Student ${newStudent.name} enrolled in database. SMS & WhatsApp dispatched to (${newStudent.phone}) and Father (${newStudent.fatherPhone}).`
      });
    }

    setTimeout(() => {
      setEnrollSuccessMessage('');
      setActiveTab('students');
      setNewStudent({
        name: '',
        admissionNo: `SJC-2026-${(updated.length + 1).toString().padStart(3, '0')}`,
        hallTicket: `2601089${(updated.length + 1).toString().padStart(3, '0')}`,
        group: 'MPC',
        groupFull: 'M.P.C EM',
        phone: '',
        fatherName: '',
        fatherPhone: '',
        isHostel: false,
        totalFee: 35000,
        paidFee: 20000
      });
    }, 1500);
  };

  const handleTeacherEnrollSubmit = (e) => {
    e.preventDefault();
    if (!newTeacher.name || !newTeacher.phone) return;

    const teacherRecord = {
      id: newTeacher.id,
      name: newTeacher.name.trim(),
      department: newTeacher.department,
      designation: newTeacher.designation,
      qualification: newTeacher.qualification,
      phone: newTeacher.phone,
      email: newTeacher.email || `${newTeacher.name.toLowerCase().replace(/[^a-z]/g, '')}@sunrisejc.edu.in`,
      assignedStreams: [newTeacher.assignedStreams],
      experience: newTeacher.experience,
      dateOfJoining: new Date().toISOString().split('T')[0]
    };

    const updated = [teacherRecord, ...teachers];
    saveTeachers(updated);
    setEnrollSuccessMessage(`Teacher ${newTeacher.name} (ID: ${newTeacher.id}) registered in Faculty Directory! Credentials dispatched.`);

    if (onSendAlert) {
      onSendAlert({
        title: "Teacher Registration Successful",
        message: `Teacher ${newTeacher.name} (ID: ${newTeacher.id}) enrolled! Onboarding credentials dispatched to (${newTeacher.phone}).`
      });
    }

    setTimeout(() => {
      setEnrollSuccessMessage('');
      setActiveTab('faculty');
      setNewTeacher({
        name: '',
        id: `TCH${(updated.length + 101).toString()}`,
        department: 'Physics',
        designation: 'Senior Lecturer',
        qualification: 'M.Sc., B.Ed.',
        phone: '',
        email: '',
        assignedStreams: 'MPC & BiPC',
        experience: '12 Years'
      });
    }, 1500);
  };

  const handleApproveAllAttendance = () => {
    if (onSendAlert) {
      onSendAlert({
        title: "All GPS Attendance Approved & Dispatched",
        message: `Admin approved 50m geofence daily attendance. SMS & WhatsApp notifications successfully broadcast to all students and their fathers!`
      });
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesGroup = groupFilter === 'ALL' || s.group === groupFilter;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.hallTicket.includes(searchTerm) ||
                          s.phone.includes(searchTerm) ||
                          (s.admissionNo && s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesGroup && matchesSearch;
  });

  const mpcCount = students.filter(s => s.group === 'MPC').length;
  const bipcCount = students.filter(s => s.group === 'BiPC').length;
  const hostelCount = students.filter(s => s.isHostel).length;

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold text-2xl shadow-md">
              A
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full">
                  Central Administration Portal
                </span>
                <span className="text-xs text-slate-300">Sunrise Educational Society • BIE AP Code: 01089</span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">Management Desk & Control Center</h2>
              <p className="text-xs text-slate-300">
                Principal Sri Andhavarapu Sudarshan Rao • Srikakulam Campus
              </p>
            </div>
          </div>

          {/* Prominent Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
            {onOpenPayment && (
              <button
                onClick={onOpenPayment}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow transition"
              >
                UPI Pay Portal
              </button>
            )}
            {onOpenCampaign && (
              <button
                onClick={onOpenCampaign}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow transition"
              >
                Campaigns (7893505185)
              </button>
            )}
            {onOpenBiometric && (
              <button
                onClick={onOpenBiometric}
                className="bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold px-3 py-2 rounded-xl shadow transition"
              >
                Face Biometrics
              </button>
            )}
            {onOpenExamPortal && (
              <button
                onClick={onOpenExamPortal}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow transition"
              >
                CBT Exam Portal
              </button>
            )}
            <button
              onClick={() => setActiveTab('enroll_student')}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold px-3 py-2 rounded-xl shadow transition flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Student</span>
            </button>
            <button
              onClick={() => setActiveTab('enroll_teacher')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-3 py-2 rounded-xl shadow transition flex items-center gap-1.5"
            >
              <School className="w-3.5 h-3.5" />
              <span>+ Teacher</span>
            </button>
            <button
              onClick={onLogout}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 transition flex items-center gap-1.5 shadow"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Enrolled Students</span>
            <h3 className="text-3xl font-extrabold text-slate-900">{students.length}</h3>
            <p className="text-xs text-slate-500 mt-2">Active in BIE AP Records</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Faculty</span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-blue-700">{teachers.length}</h3>
              <span className="text-xs text-slate-600 font-bold">Lecturers</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">All Subjects Covered</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stream Breakdown</span>
            <div className="flex items-center gap-3 text-sm font-bold text-slate-800 pt-1">
              <span className="text-blue-700">MPC: {mpcCount}</span>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-700">BiPC: {bipcCount}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Hostel: {hostelCount} Inmates</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Web Admissions Inquiries</span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-indigo-700">{inquiries.length}</h3>
              <span className="text-xs text-emerald-600 font-bold">New Leads</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Submitted from Website</p>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('students')}
            className={`text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'students' ? 'bg-slate-900 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>Students Directory ({students.length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('faculty')}
            className={`text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'faculty' ? 'bg-slate-900 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <School className="w-4 h-4 text-blue-400" />
            <span>Faculty Directory ({teachers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('enroll_student')}
            className={`text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'enroll_student' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <UserPlus className="w-4 h-4 text-amber-700" />
            <span>+ Enroll New Student</span>
          </button>

          <button
            onClick={() => setActiveTab('enroll_teacher')}
            className={`text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'enroll_teacher' ? 'bg-blue-600 text-white font-black shadow' : 'bg-blue-50 text-blue-900 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            <School className="w-4 h-4 text-blue-700" />
            <span>+ Enroll New Teacher</span>
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'attendance' ? 'bg-slate-900 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>GPS 50m Attendance</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'inquiries' ? 'bg-slate-900 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Phone className="w-4 h-4 text-indigo-400" />
            <span>Inquiries ({inquiries.length})</span>
          </button>
        </div>

        {/* Global Feedback Banner */}
        {enrollSuccessMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center gap-2 shadow-sm">
            <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{enrollSuccessMessage}</span>
          </div>
        )}

        {/* Tab 1: Students Directory */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-slate-700">Filter Group:</span>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                  {['ALL', 'MPC', 'BiPC'].map((grp) => (
                    <button
                      key={grp}
                      onClick={() => setGroupFilter(grp)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                        groupFilter === grp ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {grp}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by name, adm no, phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <button
                  onClick={() => setActiveTab('enroll_student')}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Enroll Student</span>
                </button>
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3.5 px-3 text-center w-10">#</th>
                      <th className="py-3.5 px-3">Adm No / Roll</th>
                      <th className="py-3.5 px-3">Student Name</th>
                      <th className="py-3.5 px-3">Father Name & Phone</th>
                      <th className="py-3.5 px-3">Group</th>
                      <th className="py-3.5 px-3">Hostel</th>
                      <th className="py-3.5 px-3">Fee Status</th>
                      <th className="py-3.5 px-3 text-center">Receipts & Alerts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((s, idx) => (
                      <tr key={s.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                        <td className="py-3 px-3">
                          <span className="font-mono font-bold text-indigo-700 block">{s.admissionNo}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{s.hallTicket}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 block">{s.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{s.phone}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-slate-800 font-medium block">{s.fatherName}</span>
                          <span className="text-[11px] text-slate-500 font-mono">{s.fatherPhone}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            {s.group}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {s.isHostel ? (
                            <span className="text-amber-700 font-semibold text-[11px]">Hostel</span>
                          ) : (
                            <span className="text-slate-500 text-[11px]">Day Scholar</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            s.feeDetails?.dueFee === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            Paid: ₹{s.feeDetails?.paidFee?.toLocaleString('en-IN') || '25,000'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => onOpenReceipt(s)}
                              className="bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-bold px-2 py-1 rounded-lg transition flex items-center gap-1"
                              title="Generate Official Fee Receipt Only"
                            >
                              <Receipt className="w-3 h-3" />
                              <span>Fee Receipt</span>
                            </button>
                            <button
                              onClick={() => onOpenMarks(s)}
                              className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 text-[11px] font-bold px-2 py-1 rounded-lg transition flex items-center gap-1"
                              title="View & Print Official Marks Memo Only"
                            >
                              <Award className="w-3 h-3" />
                              <span>Marks Memo</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Faculty Directory */}
        {activeTab === 'faculty' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Faculty & Lecturers Directory</h3>
                <p className="text-xs text-slate-500">Experienced teaching staff of Sunrise Junior College</p>
              </div>

              <button
                onClick={() => setActiveTab('enroll_teacher')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Register New Teacher</span>
              </button>
            </div>

            {/* Teachers Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3.5 px-4">Faculty ID</th>
                      <th className="py-3.5 px-4">Lecturer Name</th>
                      <th className="py-3.5 px-4">Department / Subject</th>
                      <th className="py-3.5 px-4">Designation & Qualification</th>
                      <th className="py-3.5 px-4">Phone Number</th>
                      <th className="py-3.5 px-4">Experience</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {teachers.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4 font-mono font-bold text-blue-700">{t.id}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{t.name}</td>
                        <td className="py-3 px-4">
                          <span className="bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded text-[11px]">
                            {t.department}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-800 block">{t.designation}</span>
                          <span className="text-[10px] text-slate-500">{t.qualification}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700">
                          <a href={`tel:${t.phone}`} className="hover:underline text-indigo-700 font-bold flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{t.phone}</span>
                          </a>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-600">{t.experience}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                            Active Faculty
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Enroll Student Form */}
        {activeTab === 'enroll_student' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 max-w-3xl mx-auto">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Student Enrollment (Management Update)
                </h3>
                <p className="text-xs text-slate-500">
                  Generate Admission Number and seed database with student & father contact numbers
                </p>
              </div>
              <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                Batch 2026–27
              </span>
            </div>

            <form onSubmit={handleStudentEnrollSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    placeholder="e.g. S. Lokesh Kumar"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Admission Number (Auto Generated) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newStudent.admissionNo}
                    onChange={(e) => setNewStudent({ ...newStudent, admissionNo: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Intermediate Stream / Group *
                  </label>
                  <select
                    value={newStudent.group}
                    onChange={(e) => setNewStudent({ ...newStudent, group: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="MPC">MPC (Mathematics, Physics, Chemistry)</option>
                    <option value="BiPC">BiPC (Biology, Physics, Chemistry)</option>
                    <option value="CEC">CEC (Civics, Economics, Commerce)</option>
                    <option value="MEC">MEC (Maths, Economics, Commerce)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Accommodation
                  </label>
                  <select
                    value={newStudent.isHostel ? 'Hostel' : 'Day'}
                    onChange={(e) => setNewStudent({ ...newStudent, isHostel: e.target.value === 'Hostel' })}
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
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
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
                    value={newStudent.fatherName}
                    onChange={(e) => setNewStudent({ ...newStudent, fatherName: e.target.value })}
                    placeholder="e.g. S. Venkateswara Rao"
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
                    value={newStudent.fatherPhone}
                    onChange={(e) => setNewStudent({ ...newStudent, fatherPhone: e.target.value })}
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
                    value={newStudent.paidFee}
                    onChange={(e) => setNewStudent({ ...newStudent, paidFee: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Save Student Enrollment & Dispatch Welcome SMS/WhatsApp</span>
              </button>
            </form>
          </div>
        )}

        {/* Tab 4: Enroll Teacher Form */}
        {activeTab === 'enroll_teacher' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 max-w-3xl mx-auto">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Faculty Registration (Teacher Onboarding)
                </h3>
                <p className="text-xs text-slate-500">
                  Register new lecturer, assign subject streams, and dispatch faculty portal login credentials
                </p>
              </div>
              <span className="bg-blue-100 text-blue-900 text-xs font-bold px-3 py-1 rounded-full">
                Faculty Portal
              </span>
            </div>

            <form onSubmit={handleTeacherEnrollSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lecturer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTeacher.name}
                    onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                    placeholder="e.g. Sri V. Sanyasi Rao"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Faculty ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTeacher.id}
                    onChange={(e) => setNewTeacher({ ...newTeacher, id: e.target.value })}
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
                    value={newTeacher.department}
                    onChange={(e) => setNewTeacher({ ...newTeacher, department: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology (Botany & Zoology)</option>
                    <option value="Commerce">Commerce & Economics</option>
                    <option value="Civics">Civics</option>
                    <option value="English">English</option>
                    <option value="Sanskrit">Sanskrit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Designation *
                  </label>
                  <select
                    value={newTeacher.designation}
                    onChange={(e) => setNewTeacher({ ...newTeacher, designation: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Senior Lecturer">Senior Lecturer</option>
                    <option value="HOD & Senior Lecturer">HOD & Senior Lecturer</option>
                    <option value="Lecturer">Lecturer</option>
                    <option value="Junior Lecturer">Junior Lecturer</option>
                    <option value="Dean of Academics">Dean of Academics</option>
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
                    value={newTeacher.qualification}
                    onChange={(e) => setNewTeacher({ ...newTeacher, qualification: e.target.value })}
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
                    value={newTeacher.experience}
                    onChange={(e) => setNewTeacher({ ...newTeacher, experience: e.target.value })}
                    placeholder="e.g. 14 Years"
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
                    value={newTeacher.phone}
                    onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                    placeholder="e.g. 9848123456"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={newTeacher.email}
                    onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                    placeholder="e.g. lecturer@sunrisejc.edu.in"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-sm py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <School className="w-4 h-4 text-amber-400" />
                <span>Register Lecturer & Send Onboarding Credentials</span>
              </button>
            </form>
          </div>
        )}

        {/* Tab 5: GPS Geofence (50m) Attendance */}
        {activeTab === 'attendance' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    GPS Geofencing Active (50m Radius)
                  </span>
                  <span className="text-xs text-slate-500">College: 18.3069° N, 83.8936° E</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">Daily Student Attendance Validation</h3>
                <p className="text-xs text-slate-500">Students must be within 50 meters of campus for attendance detection</p>
              </div>

              <button
                onClick={handleApproveAllAttendance}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition flex items-center gap-2 shadow-lg"
              >
                <Check className="w-4 h-4" />
                <span>Approve All & Dispatch WhatsApp to Student & Father</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3 px-3">Adm No</th>
                    <th className="py-3 px-3">Student Name</th>
                    <th className="py-3 px-3">Father & Contact</th>
                    <th className="py-3 px-3 text-center">GPS Distance</th>
                    <th className="py-3 px-3 text-center">Geofence (≤50m)</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.slice(0, 15).map((s) => {
                    const dist = s.attendanceLog?.gpsDistanceMeters || 18;
                    const isInside = dist <= 50;
                    return (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-mono font-bold text-indigo-700">{s.admissionNo}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{s.name}</td>
                        <td className="py-3 px-3 text-slate-600">{s.fatherName} ({s.fatherPhone})</td>
                        <td className="py-3 px-3 text-center font-mono font-bold">{dist} meters</td>
                        <td className="py-3 px-3 text-center">
                          {isInside ? (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                              Inside 50m Zone
                            </span>
                          ) : (
                            <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded">
                              Outside Zone
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            Present (08:42 AM)
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => {
                              if (onSendAlert) {
                                onSendAlert({
                                  title: "Attendance Alert Dispatched",
                                  message: `Attendance confirmation for ${s.name} dispatched to Student (${s.phone}) and Father (${s.fatherPhone}).`
                                });
                              }
                            }}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg transition inline-flex items-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3 text-amber-400" />
                            <span>Notify Parents</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 6: Web Inquiries */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Online Admission Inquiries & Leads</h3>
                <p className="text-xs text-slate-500">Applications submitted through the official website form</p>
              </div>
            </div>

            {inquiries.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <Clock className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-500">No new admission inquiries submitted yet.</p>
                <p className="text-xs text-slate-400">Inquiries submitted on the website will instantly appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Parent Name</th>
                      <th className="py-3 px-4">Mobile Number</th>
                      <th className="py-3 px-4">Desired Stream</th>
                      <th className="py-3 px-4">Hostel Pref</th>
                      <th className="py-3 px-4">10th GPA/Marks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4 font-mono text-slate-500">{inq.date}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{inq.studentName}</td>
                        <td className="py-3 px-4 text-slate-600">{inq.parentName || '—'}</td>
                        <td className="py-3 px-4 font-mono text-indigo-700 font-bold">
                          <a href={`tel:${inq.phone}`} className="hover:underline flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{inq.phone}</span>
                          </a>
                        </td>
                        <td className="py-3 px-4 font-bold text-amber-700">{inq.stream}</td>
                        <td className="py-3 px-4 text-slate-600">{inq.accommodation}</td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{inq.sscScore || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
