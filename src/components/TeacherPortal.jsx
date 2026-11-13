import React, { useState } from 'react';
import { 
  UserCheck, Calendar, BookOpen, Upload, LogOut, Check, X, Search, Filter, 
  Save, Sparkles, Receipt, Award, MessageSquare, MapPin, Plus, Trash2, Edit3, 
  HelpCircle, CheckCircle2, FileText, ArrowRight
} from 'lucide-react';
import initialStudentsData from '../data/studentsData.json';
import { createWhatsAppLink } from '../utils/geoUtils';
import { getSavedExamQuestions, saveExamQuestions } from '../data/defaultExamQuestions';
import sunriseLogo from '../assets/sunrise_official_logo.png';

export default function TeacherPortal({ teacher, onLogout, onOpenReceipt, onOpenMarks, onSendAlert, onOpenBiometric }) {
  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' | 'exam_management'

  // --- ATTENDANCE STATE ---
  const [students, setStudents] = useState(initialStudentsData);
  const [selectedGroup, setSelectedGroup] = useState('MPC');
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [attendanceState, setAttendanceState] = useState(() => {
    const initial = {};
    initialStudentsData.forEach(s => {
      initial[s.id] = true;
    });
    return initial;
  });

  const [savedNotification, setSavedNotification] = useState(false);

  // --- EXAM QUESTIONS STATE ---
  const [examQuestions, setExamQuestions] = useState(() => getSavedExamQuestions());
  const [examStreamFilter, setExamStreamFilter] = useState('ALL');
  const [examTypeFilter, setExamTypeFilter] = useState('ALL');
  const [questionSearch, setQuestionSearch] = useState('');
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  // Question Form State
  const [questionForm, setQuestionForm] = useState({
    stream: 'MPC',
    subject: 'Physics',
    type: 'mcq', // 'mcq' or 'descriptive'
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    marks: 10,
    topic: '',
    gradingNotes: ''
  });

  // --- ATTENDANCE HANDLERS ---
  const toggleAttendance = (id) => {
    setAttendanceState(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const markAll = (status) => {
    const updated = {};
    students.forEach(s => {
      if (s.group === selectedGroup || selectedGroup === 'ALL') {
        updated[s.id] = status;
      } else {
        updated[s.id] = attendanceState[s.id];
      }
    });
    setAttendanceState(updated);
  };

  const handleSaveAttendance = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
    if (onSendAlert) {
      onSendAlert({
        title: "Daily Attendance Saved",
        message: `Attendance for ${attendanceDate} saved. All Present & Absent alerts prepared for dispatch.`
      });
    }
  };

  const handleBulkDispatch = () => {
    if (onSendAlert) {
      onSendAlert({
        title: "Bulk SMS & WhatsApp Dispatched",
        message: `Daily attendance report for ${filteredStudents.length} students dispatched to students & their fathers successfully!`
      });
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesGroup = selectedGroup === 'ALL' || s.group === selectedGroup;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.hallTicket.includes(searchTerm) ||
                          s.phone.includes(searchTerm) ||
                          (s.admissionNo && s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesGroup && matchesSearch;
  });

  const presentCount = filteredStudents.filter(s => attendanceState[s.id]).length;
  const absentCount = filteredStudents.length - presentCount;

  // --- EXAM QUESTION HANDLERS ---
  const handleOpenAddQuestion = () => {
    setQuestionForm({
      stream: 'MPC',
      subject: 'Physics',
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
    if (window.confirm("Are you sure you want to remove this question from the official Exam Portal? Enrolled students will no longer see this question.")) {
      const updated = examQuestions.filter(q => q.id !== id);
      setExamQuestions(updated);
      saveExamQuestions(updated);
      if (onSendAlert) {
        onSendAlert({
          title: "Exam Question Removed",
          message: `Question ${id} has been permanently removed from the live exam question bank.`
        });
      }
    }
  };

  const handleSaveQuestionSubmit = (e) => {
    e.preventDefault();
    if (!questionForm.question.trim()) {
      alert("Please provide the question text.");
      return;
    }

    if (questionForm.type === 'mcq') {
      const filledOptions = questionForm.options.filter(o => o.trim() !== '');
      if (filledOptions.length < 4) {
        alert("Please provide all 4 options (A, B, C, D) for Multiple Choice Question.");
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
            author: teacher?.name || 'Faculty Member',
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
        author: teacher?.name || 'Faculty Member',
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
        title: editingQuestionId ? "Exam Question Updated" : "New Question Uploaded to Exam Portal",
        message: `${questionForm.stream} - ${questionForm.subject} (${questionForm.type.toUpperCase()}): Question saved and live for all enrolled students in the exam portal.`
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
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
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full">
                  Faculty Management Portal
                </span>
                <span className="text-xs text-slate-300">Sunrise Junior College • BIE AP Code: 01089</span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">
                {teacher?.name || 'Senior Lecturer Sri K. Ramanjaneyulu'}
              </h2>
              <p className="text-xs text-slate-300">
                Department of Physics • Faculty ID: <strong>{teacher?.id || 'TCH101'}</strong> • Streams: MPC, BiPC, CEC, MEC, HEC
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            {onOpenBiometric && (
              <button
                onClick={onOpenBiometric}
                className="bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
              >
                <span>Face Biometric Scan</span>
              </button>
            )}
            <button
              onClick={handleBulkDispatch}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send Attendance SMS to All Parents</span>
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

        {/* Top Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl transition flex items-center gap-2 ${
              activeTab === 'attendance'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Daily Attendance & 50m GPS Geofence</span>
          </button>

          <button
            onClick={() => setActiveTab('exam_management')}
            className={`text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl transition flex items-center gap-2 ${
              activeTab === 'exam_management'
                ? 'bg-indigo-950 text-white shadow-md ring-2 ring-amber-400/50'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Manage Exam Papers & Questions (MCQ & Descriptive)</span>
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full ml-1">
              {examQuestions.length} Live
            </span>
          </button>
        </div>

        {/* ========================================================
            TAB 1: ATTENDANCE MANAGEMENT
           ======================================================== */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            {/* Action & Filter Bar */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Select Stream:</span>
                  <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl">
                    {['MPC', 'BiPC', 'CEC', 'MEC', 'HEC', 'ALL'].map((grp) => (
                      <button
                        key={grp}
                        onClick={() => setSelectedGroup(grp)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                          selectedGroup === grp ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {grp === 'ALL' ? 'All Streams' : `${grp}`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Date:</span>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by name, adm no..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <button
                  onClick={handleSaveAttendance}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow"
                >
                  <Save className="w-3.5 h-3.5 text-amber-400" />
                  <span>Save & Sync</span>
                </button>
              </div>
            </div>

            {/* Saved Alert Banner */}
            {savedNotification && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-bold shadow-sm">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Attendance recorded for {attendanceDate}. Student & parent records updated!</span>
                </div>
                <span>Status: Verified</span>
              </div>
            )}

            {/* Live Attendance Stats Header */}
            <div className="flex flex-wrap items-center justify-between text-xs font-semibold px-2 gap-2">
              <div className="flex items-center gap-3">
                <span className="text-slate-600">Students: <strong>{filteredStudents.length}</strong></span>
                <span className="text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md font-bold">Present: {presentCount}</span>
                <span className="text-red-700 bg-red-100 px-2.5 py-0.5 rounded-md font-bold">Absent: {absentCount}</span>
                <span className="text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md hidden sm:inline">
                  GPS Geofence (50m Limit): Active
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => markAll(true)}
                  className="text-[11px] font-bold text-emerald-700 hover:underline"
                >
                  Mark All Present
                </button>
                <span className="text-slate-300">•</span>
                <button
                  onClick={() => markAll(false)}
                  className="text-[11px] font-bold text-red-700 hover:underline"
                >
                  Mark All Absent
                </button>
              </div>
            </div>

            {/* Attendance & Management Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3.5 px-3 text-center w-10">#</th>
                      <th className="py-3.5 px-3">Adm No / Hall Ticket</th>
                      <th className="py-3.5 px-3">Student Name</th>
                      <th className="py-3.5 px-3">Father & Phone</th>
                      <th className="py-3.5 px-3 text-center">GPS Geofence (50m)</th>
                      <th className="py-3.5 px-3 text-center">Today's Status</th>
                      <th className="py-3.5 px-3 text-center">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((s, idx) => {
                      const isPresent = attendanceState[s.id] !== false;
                      const dist = s.attendanceLog?.gpsDistanceMeters || 18;
                      return (
                        <tr key={s.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                          <td className="py-3 px-3">
                            <span className="font-mono font-bold text-indigo-700 block">{s.admissionNo}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{s.hallTicket}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-slate-900 block">{s.name}</span>
                            <span className="text-[10px] font-bold text-amber-700">{s.groupFull || s.group}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-slate-800 font-medium block">{s.fatherName}</span>
                            <span className="text-[11px] text-slate-500 font-mono">{s.fatherPhone}</span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                              <MapPin className="w-3 h-3 text-emerald-600" />
                              <span>{dist}m (Inside 50m)</span>
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => toggleAttendance(s.id)}
                              className={`px-3 py-1 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 mx-auto transition ${
                                isPresent
                                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm'
                                  : 'bg-red-500 hover:bg-red-600 text-white shadow-sm'
                              }`}
                            >
                              {isPresent ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Present</span>
                                </>
                              ) : (
                                <>
                                  <X className="w-3.5 h-3.5" />
                                  <span>Absent</span>
                                </>
                              )}
                            </button>
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: EXAM PAPERS & QUESTION BANK MANAGEMENT (MCQ & DESCRIPTIVE)
           ======================================================== */}
        {activeTab === 'exam_management' && (
          <div className="space-y-6">
            
            {/* Top Info Banner */}
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-6 border border-indigo-700/50 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Teacher Exam Paper Authoring Suite
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  Custom Subject Questions for Enrolled Students
                </h3>
                <p className="text-xs text-indigo-200 mt-1 max-w-2xl">
                  Only the questions submitted and uploaded by teachers and admin below will be presented to candidates in the Online Examination Portal. Supports both Multiple Choice Questions (MCQ) and Descriptive Theory / Long Answer Questions.
                </p>
              </div>

              <button
                onClick={handleOpenAddQuestion}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-lg transition flex items-center gap-2 active:scale-95 flex-shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Upload / Add New Question</span>
              </button>
            </div>

            {/* Add / Edit Question Form Modal */}
            {isAddingQuestion && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-500 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {editingQuestionId ? `Edit Question: ${editingQuestionId}` : 'Upload New Exam Question'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Configure subject, stream, question type, and evaluation criteria.
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
                        placeholder="e.g. Mathematics, Physics, Civics..."
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
                      <label className="block text-xs font-bold text-slate-700 mb-1">Topic / Chapter Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Matrices & Determinants, Thermodynamics, Constitutional Rights"
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
                      Question Statement / Problem *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Type the exact question here for students to solve..."
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
                          Options & Answer Key (Select Radio for Correct Answer)
                        </span>
                        <span className="text-[11px] text-slate-500 font-semibold">
                          Correct Option: <strong>Option {String.fromCharCode(65 + Number(questionForm.correctAnswer))}</strong>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {questionForm.options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                            <input
                              type="radio"
                              name="correctAnswerRadio"
                              id={`radio-${oIdx}`}
                              checked={Number(questionForm.correctAnswer) === oIdx}
                              onChange={() => setQuestionForm({ ...questionForm, correctAnswer: oIdx })}
                              className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <label htmlFor={`radio-${oIdx}`} className="text-xs font-bold text-slate-600 font-mono">
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
                        Descriptive Evaluation Notes & Key Points (For Lecturer Grading):
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
                      <span>{editingQuestionId ? 'Update Question' : 'Upload to Exam Portal'}</span>
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
                      { id: 'ALL', label: 'All Types' },
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
                  placeholder="Search questions, topics..."
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-2">
                <span>Showing {filteredExamQuestions.length} Questions</span>
                <span className="text-indigo-700">Live in Student Examination Portal</span>
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
                                    Key
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
                            Format: Detailed step-by-step written response required by student.
                          </p>
                          {q.gradingNotes && (
                            <p className="text-slate-500">Grading Key: {q.gradingNotes}</p>
                          )}
                        </div>
                      )}

                      {/* Footer Info */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>Uploaded by: <strong className="text-slate-600">{q.author || 'Faculty Member'}</strong></span>
                        <span>Date: {q.date || 'Recent'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
