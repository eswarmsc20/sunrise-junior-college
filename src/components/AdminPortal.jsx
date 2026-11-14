import React, { useState, useEffect } from 'react';
import { Users, School, BookOpen, ShieldCheck, FileSpreadsheet, Plus, Search, Filter, Phone, CheckCircle, Clock, Trash2, LogOut, Bell, Sparkles, Receipt, Award, MessageSquare, MapPin, Check, Mail, UserPlus, Edit3, RotateCcw, AlertTriangle } from 'lucide-react';
import initialStudents from '../data/studentsData.json';
import initialTeachers from '../data/teachersData.json';
import { createWhatsAppLink } from '../utils/geoUtils';
import { getSavedExamQuestions, saveExamQuestions, DEFAULT_EXAM_QUESTIONS } from '../data/defaultExamQuestions';
import { getMarksApprovalRequests, getEnrolledStudents } from '../utils/marksApprovalService';
import AdminMarksApprovalSection from './AdminMarksApprovalSection';
import sunriseLogo from '../assets/sunrise_official_logo.png';

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
  const [activeTab, setActiveTab] = useState('students'); // 'students' | 'faculty' | 'attendance' | 'enroll_student' | 'enroll_teacher' | 'inquiries' | 'exam_questions' | 'marks_approvals'
  
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('sunrise_enrolled_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem('sunrise_enrolled_teachers');
    return saved ? JSON.parse(saved) : initialTeachers;
  });

  const [marksApprovals, setMarksApprovals] = useState(() => getMarksApprovalRequests());
  
  useEffect(() => {
    const handleApprovals = () => {
      setMarksApprovals(getMarksApprovalRequests());
    };
    const handleStudents = () => {
      setStudents(getEnrolledStudents());
    };
    window.addEventListener('sunrise_marks_approvals_updated', handleApprovals);
    window.addEventListener('sunrise_students_updated', handleStudents);
    return () => {
      window.removeEventListener('sunrise_marks_approvals_updated', handleApprovals);
      window.removeEventListener('sunrise_students_updated', handleStudents);
    };
  }, []);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [groupFilter, setGroupFilter] = useState('ALL');
  const [inquiries, setInquiries] = useState([]);

  // Exam Question Bank State
  const [examQuestions, setExamQuestions] = useState(() => getSavedExamQuestions());
  const [examStreamFilter, setExamStreamFilter] = useState('ALL');
  const [examTypeFilter, setExamTypeFilter] = useState('ALL');
  const [questionSearch, setQuestionSearch] = useState('');
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [questionForm, setQuestionForm] = useState({
    stream: 'MPC',
    subject: 'Mathematics',
    type: 'mcq',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    marks: 10,
    topic: '',
    gradingNotes: ''
  });

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

  // --- EXAM QUESTION MASTER HANDLERS ---
  const handleOpenAddQuestion = () => {
    setQuestionForm({
      stream: 'MPC',
      subject: 'Mathematics',
      type: 'mcq',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      marks: 10,
      topic: '',
      gradingNotes: ''
    });
    setEditingQuestionId(null);
    setIsAddingQuestion(true);
  };

  const handleEditQuestion = (q) => {
    setQuestionForm({
      stream: q.stream,
      subject: q.subject,
      type: q.type || 'mcq',
      question: q.question,
      options: q.options && q.options.length === 4 ? [...q.options] : ['', '', '', ''],
      correctAnswer: q.correctAnswer !== null && q.correctAnswer !== undefined ? q.correctAnswer : 0,
      marks: q.marks || (q.type === 'mcq' ? 10 : 20),
      topic: q.topic || '',
      gradingNotes: q.gradingNotes || ''
    });
    setEditingQuestionId(q.id);
    setIsAddingQuestion(true);
  };

  const handleDeleteQuestion = (id) => {
    if (window.confirm(`Delete question ${id} from Master Exam Bank? Students will no longer see this question.`)) {
      const updated = examQuestions.filter(q => q.id !== id);
      setExamQuestions(updated);
      saveExamQuestions(updated);
      if (onSendAlert) {
        onSendAlert({
          title: "Exam Question Removed",
          message: `Question ${id} has been permanently deleted by Admin from the examination portal.`
        });
      }
    }
  };

  const handleResetQuestions = () => {
    if (window.confirm("Reset all exam papers back to the official Sunrise Master seed question bank (MPC, BiPC, CEC, MEC, HEC)?")) {
      setExamQuestions(DEFAULT_EXAM_QUESTIONS);
      saveExamQuestions(DEFAULT_EXAM_QUESTIONS);
      if (onSendAlert) {
        onSendAlert({
          title: "Master Exam Bank Reset",
          message: "All 5 stream examination papers restored to default verified state."
        });
      }
    }
  };

  const handleSaveQuestionSubmit = (e) => {
    e.preventDefault();
    if (!questionForm.question.trim()) return;

    if (questionForm.type === 'mcq') {
      const filled = questionForm.options.filter(o => o.trim() !== '');
      if (filled.length < 4) {
        alert("Please provide all 4 options (A, B, C, D) for the MCQ.");
        return;
      }
    }

    let updatedList;
    if (editingQuestionId) {
      updatedList = examQuestions.map(q => {
        if (q.id === editingQuestionId) {
          return {
            ...q,
            stream: questionForm.stream,
            subject: questionForm.subject,
            type: questionForm.type,
            question: questionForm.question.trim(),
            options: questionForm.type === 'mcq' ? questionForm.options.map(o => o.trim()) : [],
            correctAnswer: questionForm.type === 'mcq' ? Number(questionForm.correctAnswer) : null,
            marks: Number(questionForm.marks) || (questionForm.type === 'mcq' ? 10 : 20),
            topic: questionForm.topic.trim() || 'General Curriculum',
            gradingNotes: questionForm.gradingNotes.trim() || '',
            author: 'Admin / Examination Board',
            date: new Date().toLocaleDateString('en-GB')
          };
        }
        return q;
      });
    } else {
      const newId = `Q-${questionForm.stream}-${Date.now().toString().slice(-4)}`;
      const newEntry = {
        id: newId,
        stream: questionForm.stream,
        subject: questionForm.subject,
        type: questionForm.type,
        question: questionForm.question.trim(),
        options: questionForm.type === 'mcq' ? questionForm.options.map(o => o.trim()) : [],
        correctAnswer: questionForm.type === 'mcq' ? Number(questionForm.correctAnswer) : null,
        marks: Number(questionForm.marks) || (questionForm.type === 'mcq' ? 10 : 20),
        topic: questionForm.topic.trim() || 'General Curriculum',
        gradingNotes: questionForm.gradingNotes.trim() || '',
        author: 'Admin / Examination Board',
        date: new Date().toLocaleDateString('en-GB')
      };
      updatedList = [newEntry, ...examQuestions];
    }

    setExamQuestions(updatedList);
    saveExamQuestions(updatedList);
    setIsAddingQuestion(false);
    setEditingQuestionId(null);

    if (onSendAlert) {
      onSendAlert({
        title: editingQuestionId ? "Exam Paper Updated" : "New Question Published by Admin",
        message: `${questionForm.stream} - ${questionForm.subject} (${questionForm.type.toUpperCase()}): Question saved and live for student exams.`
      });
    }
  };

  const filteredExamQuestions = examQuestions.filter(q => {
    const matchesStream = examStreamFilter === 'ALL' || q.stream === examStreamFilter;
    const matchesType = examTypeFilter === 'ALL' || q.type === examTypeFilter;
    const matchesSearch = q.question.toLowerCase().includes(questionSearch.toLowerCase()) ||
                          q.subject.toLowerCase().includes(questionSearch.toLowerCase()) ||
                          (q.topic && q.topic.toLowerCase().includes(questionSearch.toLowerCase())) ||
                          q.id.toLowerCase().includes(questionSearch.toLowerCase());
    return matchesStream && matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-transparent flex items-center justify-center flex-shrink-0">
              <img 
                src={sunriseLogo} 
                alt="Sunrise Junior College Crest" 
                className="w-full h-full object-contain filter drop-shadow-lg" 
              />
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

          <button
            onClick={() => setActiveTab('exam_questions')}
            className={`text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'exam_questions' ? 'bg-indigo-950 text-white shadow ring-2 ring-amber-400' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Master Exam Bank ({examQuestions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('marks_approvals')}
            className={`text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'marks_approvals' ? 'bg-indigo-900 text-white shadow ring-2 ring-emerald-400' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Marks Approvals (మార్క్స్ ఆమోదం)</span>
            {marksApprovals.filter(r => r.status === 'pending').length > 0 && (
              <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black animate-pulse">
                {marksApprovals.filter(r => r.status === 'pending').length} Pending
              </span>
            )}
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
                  {['ALL', 'MPC', 'BiPC', 'CEC', 'MEC', 'HEC'].map((grp) => (
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
                    <option value="HEC">HEC (History, Economics, Civics)</option>
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


        {/* Tab 7: Master Exam Bank & Question Management */}
        {activeTab === 'exam_questions' && (
          <div className="space-y-6">
            
            {/* Top Info Banner */}
            <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-indigo-700/50 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Central Examination Control Board
                  </span>
                  <span className="text-xs text-indigo-300">Live Synchronized Bank</span>
                </div>
                <h3 className="text-2xl font-black text-white">
                  Master Exam Paper & Question Repository
                </h3>
                <p className="text-xs text-indigo-200 mt-1 max-w-2xl leading-relaxed">
                  Only the subject-wise questions uploaded and approved by Lecturers or Admin below are served to students in the online examination portal. Configure Multiple Choice (MCQ) and Descriptive Theory questions across all 5 Academic Streams.
                </p>

                {/* Stream badges counter */}
                <div className="flex flex-wrap items-center gap-2 pt-3">
                  {['MPC', 'BiPC', 'CEC', 'MEC', 'HEC'].map(s => {
                    const count = examQuestions.filter(q => q.stream === s).length;
                    return (
                      <span key={s} className="text-xs font-bold bg-white/10 px-2.5 py-1 rounded-xl border border-white/10 text-white">
                        {s}: <strong className="text-amber-400">{count}</strong> Qs
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleResetQuestions}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition flex items-center justify-center gap-1.5"
                  title="Reset to default seed questions"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reset Seed Bank</span>
                </button>

                <button
                  onClick={handleOpenAddQuestion}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2 active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ Add New Question</span>
                </button>
              </div>
            </div>

            {/* Add / Edit Question Form Modal */}
            {isAddingQuestion && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-600 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {editingQuestionId ? `Edit Question: ${editingQuestionId}` : 'Publish New Question to Exam Portal'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Configure question metadata, scoring weightage, and evaluation keys.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsAddingQuestion(false);
                      setEditingQuestionId(null);
                    }}
                    className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveQuestionSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Stream Selection */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Academic Stream *</label>
                      <select
                        value={questionForm.stream}
                        onChange={(e) => setQuestionForm({ ...questionForm, stream: e.target.value })}
                        className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 bg-white"
                        required
                      >
                        <option value="MPC">M.P.C (Maths, Physics, Chem)</option>
                        <option value="BiPC">Bi.P.C (Botany, Zoology, Physics, Chem)</option>
                        <option value="CEC">C.E.C (Civics, Economics, Commerce)</option>
                        <option value="MEC">M.E.C (Maths, Economics, Commerce)</option>
                        <option value="HEC">H.E.C (History, Economics, Civics)</option>
                      </select>
                    </div>

                    {/* Subject Input */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Subject Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Mathematics, History, Physics..."
                        value={questionForm.subject}
                        onChange={(e) => setQuestionForm({ ...questionForm, subject: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-semibold"
                        required
                      />
                    </div>

                    {/* Question Type Toggle */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Question Format *</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setQuestionForm({ ...questionForm, type: 'mcq', marks: 10 })}
                          className={`text-xs font-bold p-2.5 rounded-xl border transition text-center ${
                            questionForm.type === 'mcq'
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                              : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          Multiple Choice (MCQ)
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuestionForm({ ...questionForm, type: 'descriptive', marks: 20 })}
                          className={`text-xs font-bold p-2.5 rounded-xl border transition text-center ${
                            questionForm.type === 'descriptive'
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                              : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          Descriptive (Theory)
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Topic / Lesson Unit</label>
                      <input
                        type="text"
                        placeholder="e.g. Matrices & Determinants, Thermodynamics, Indus Valley"
                        value={questionForm.topic}
                        onChange={(e) => setQuestionForm({ ...questionForm, topic: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Marks Weightage</label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={questionForm.marks}
                        onChange={(e) => setQuestionForm({ ...questionForm, marks: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* Question Text */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Question Statement / Formulation *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Type the full question statement as it should appear in the student exam paper..."
                      value={questionForm.question}
                      onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  {/* Conditional MCQ Options */}
                  {questionForm.type === 'mcq' && (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Options & Correct Answer (Click radio to set official key)
                        </span>
                        <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Official Key: Option {String.fromCharCode(65 + Number(questionForm.correctAnswer))}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {questionForm.options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                            <input
                              type="radio"
                              name="adminCorrectAnswerRadio"
                              id={`admin-radio-${oIdx}`}
                              checked={Number(questionForm.correctAnswer) === oIdx}
                              onChange={() => setQuestionForm({ ...questionForm, correctAnswer: oIdx })}
                              className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <label htmlFor={`admin-radio-${oIdx}`} className="text-xs font-bold text-slate-600 font-mono">
                              {String.fromCharCode(65 + oIdx)}:
                            </label>
                            <input
                              type="text"
                              placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                              value={opt}
                              onChange={(e) => {
                                const newOpts = [...questionForm.options];
                                newOpts[oIdx] = e.target.value;
                                setQuestionForm({ ...questionForm, options: newOpts });
                              }}
                              className="w-full text-xs p-1.5 rounded-lg border border-slate-200 font-medium"
                              required={questionForm.type === 'mcq'}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Conditional Descriptive Hints / Notes */}
                  {questionForm.type === 'descriptive' && (
                    <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
                      <span className="text-xs font-bold text-amber-900 block">
                        Evaluation Rubric & Key Solution Points:
                      </span>
                      <textarea
                        rows={2}
                        placeholder="Expected derivation steps, key formulas, core definitions, or essay headings..."
                        value={questionForm.gradingNotes}
                        onChange={(e) => setQuestionForm({ ...questionForm, gradingNotes: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border border-amber-200 bg-white font-medium"
                      />
                    </div>
                  )}

                  {/* Submit Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingQuestion(false);
                        setEditingQuestionId(null);
                      }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingQuestionId ? 'Save Changes' : 'Publish to Exam Portal'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Filter and Search Bar for Questions */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Filter Stream:</span>
                  <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl">
                    {['ALL', 'MPC', 'BiPC', 'CEC', 'MEC', 'HEC'].map((grp) => (
                      <button
                        key={grp}
                        onClick={() => setExamStreamFilter(grp)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                          examStreamFilter === grp ? 'bg-indigo-900 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {grp}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Type:</span>
                  <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                    {[
                      { id: 'ALL', label: 'All Formats' },
                      { id: 'mcq', label: 'MCQs' },
                      { id: 'descriptive', label: 'Descriptive' }
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setExamTypeFilter(t.id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                          examTypeFilter === t.id ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search questions, subjects..."
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-2">
                <span>Showing {filteredExamQuestions.length} of {examQuestions.length} Total Master Questions</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Enrolled Students Live Access: Active
                </span>
              </div>

              {filteredExamQuestions.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
                  <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-600 font-bold text-sm">No exam questions found matching the filter.</p>
                  <button
                    onClick={handleOpenAddQuestion}
                    className="mt-3 bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-xl"
                  >
                    + Add New Question
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredExamQuestions.map((q, idx) => (
                    <div
                      key={q.id || idx}
                      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-indigo-300 transition space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {q.id}
                          </span>
                          <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${
                            q.stream === 'MPC' ? 'bg-blue-100 text-blue-800' :
                            q.stream === 'BiPC' ? 'bg-emerald-100 text-emerald-800' :
                            q.stream === 'CEC' ? 'bg-amber-100 text-amber-800' :
                            q.stream === 'MEC' ? 'bg-purple-100 text-purple-800' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            {q.stream} Stream
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            {q.subject}
                          </span>
                          {q.topic && (
                            <span className="text-[11px] text-slate-500 font-medium">
                              • {q.topic}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                            q.type === 'mcq' ? 'bg-indigo-100 text-indigo-900 border border-indigo-200' : 'bg-amber-100 text-amber-900 border border-amber-200'
                          }`}>
                            {q.type === 'mcq' ? 'Multiple Choice (MCQ)' : 'Descriptive'}
                          </span>
                          <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                            {q.marks || (q.type === 'mcq' ? 10 : 20)} Marks
                          </span>
                          <button
                            onClick={() => handleEditQuestion(q)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Edit Question"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete Question"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Question Text */}
                      <p className="text-sm font-bold text-slate-900 leading-snug">
                        {q.question}
                      </p>

                      {/* MCQ Options Display */}
                      {q.type === 'mcq' && q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {q.options.map((opt, oIdx) => {
                            const isCorrect = q.correctAnswer === oIdx;
                            return (
                              <div
                                key={oIdx}
                                className={`text-xs p-2 rounded-xl flex items-center gap-2 ${
                                  isCorrect
                                    ? 'bg-emerald-50 text-emerald-950 border border-emerald-300 font-bold'
                                    : 'bg-slate-50 text-slate-700 border border-slate-200'
                                }`}
                              >
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] ${
                                  isCorrect ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-200 text-slate-600'
                                }`}>
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                <span>{opt}</span>
                                {isCorrect && (
                                  <span className="ml-auto text-[10px] font-black text-emerald-700 uppercase">
                                    Official Key
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Descriptive Guidance */}
                      {q.type === 'descriptive' && (
                        <div className="text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-600 space-y-1">
                          <p className="font-bold text-slate-800">
                            Format: Student answers in full theory/derivation mode in Exam Portal.
                          </p>
                          {q.gradingNotes && (
                            <p className="text-slate-500">Grading Key: {q.gradingNotes}</p>
                          )}
                        </div>
                      )}

                      {/* Footer Info */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>Published by: <strong className="text-slate-600">{q.author || 'Admin / Board'}</strong></span>
                        <span>Date: {q.date || 'Active'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Tab 8: Marks Approval & Verification Suite */}
        {activeTab === 'marks_approvals' && (
          <AdminMarksApprovalSection
            admin={admin}
            onOpenMarks={onOpenMarks}
            onSendAlert={onSendAlert}
            onStudentsUpdated={() => {
              setStudents(getEnrolledStudents());
            }}
          />
        )}


      </div>
    </div>
  );
}
