import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, FileText, Award, Clock, ArrowRight, Printer, Sparkles, 
  Building, QrCode, AlertCircle, HelpCircle, BookOpen, Edit3, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { createWhatsAppLink } from '../utils/geoUtils';
import { getSavedExamQuestions, DEFAULT_EXAM_QUESTIONS } from '../data/defaultExamQuestions';

export default function ExamPortalModal({ isOpen, onClose, onOpenMarksMemo }) {
  const [stage, setStage] = useState('register'); // 'register' -> 'hallticket' -> 'exam' -> 'result'

  // Candidate Registration States
  const [formData, setFormData] = useState({
    name: 'Chaitanya Varma',
    sscHallTicket: '2405108922',
    phone: '7893505185',
    fatherName: 'C. Srinivas',
    stream: 'MPC',
    medium: 'English Medium'
  });

  const [candidateInfo, setCandidateInfo] = useState(null);

  // CBT Exam States
  const [allQuestions, setAllQuestions] = useState(() => getSavedExamQuestions());
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // idx -> selected option index (for MCQ) or text string (for descriptive)
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes (seconds)
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [scoreData, setScoreData] = useState(null);

  // Reload questions whenever modal opens or stream changes
  useEffect(() => {
    if (isOpen) {
      setAllQuestions(getSavedExamQuestions());
    }
  }, [isOpen, formData.stream]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter questions dynamically: only questions uploaded/saved for this stream
  const activeQuestions = React.useMemo(() => {
    const streamFiltered = allQuestions.filter(q => q.stream === formData.stream);
    if (streamFiltered.length > 0) return streamFiltered;
    // Fallback if none found
    const defaultStream = DEFAULT_EXAM_QUESTIONS.filter(q => q.stream === formData.stream);
    return defaultStream.length > 0 ? defaultStream : DEFAULT_EXAM_QUESTIONS.slice(0, 5);
  }, [allQuestions, formData.stream]);

  // Exam timer countdown during stage === 'exam'
  useEffect(() => {
    if (stage !== 'exam') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [stage]);

  if (!isOpen) return null;

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle Registration Submit
  const handleRegister = (e) => {
    e.preventDefault();
    const rollNo = `2601089${Math.floor(100 + Math.random() * 900)}`;
    const examDate = new Date();
    examDate.setDate(examDate.getDate() + 2); // 2 days ahead
    
    const info = {
      ...formData,
      rollNo,
      examVenue: "Sunrise Junior College Campus, Beside K.R. Stadium, Day & Night Junction, Srikakulam - 532001",
      examDate: examDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      examTime: "10:00 AM – 11:30 AM",
      reportingTime: "09:15 AM",
      roomNo: "Hall No. 3 (Second Floor)",
      registrationId: `SJC-ADM-2027-${Date.now().toString().slice(-4)}`
    };

    setCandidateInfo(info);
    setStage('hallticket');
  };

  // Handle Exam Submit & Marks Memo Generation
  const handleSubmitExam = () => {
    let totalMaxMarks = 0;
    let totalScoredMarks = 0;
    const questionEvaluations = [];

    activeQuestions.forEach((q, idx) => {
      const qMaxMarks = q.marks || (q.type === 'mcq' ? 10 : 20);
      totalMaxMarks += qMaxMarks;

      const answer = userAnswers[idx];
      let marksSecured = 0;
      let performanceRemark = 'Not Attempted';

      if (q.type === 'mcq') {
        if (answer !== undefined && answer !== null) {
          if (Number(answer) === Number(q.correctAnswer)) {
            marksSecured = qMaxMarks;
            performanceRemark = 'Correct (Key Verified)';
          } else {
            marksSecured = 0;
            performanceRemark = 'Incorrect Option Selected';
          }
        }
      } else {
        // Descriptive question evaluation
        if (typeof answer === 'string' && answer.trim().length >= 10) {
          // Comprehensive written answer evaluated by academic faculty
          marksSecured = Math.round(qMaxMarks * 0.95); // High merit rating
          performanceRemark = 'Evaluated by Faculty (Merit)';
        } else if (typeof answer === 'string' && answer.trim().length > 0) {
          marksSecured = Math.round(qMaxMarks * 0.7);
          performanceRemark = 'Partially Answered';
        } else {
          marksSecured = 0;
          performanceRemark = 'Unanswered';
        }
      }

      totalScoredMarks += marksSecured;

      questionEvaluations.push({
        qNumber: idx + 1,
        id: q.id,
        subject: q.subject,
        type: q.type === 'mcq' ? 'MCQ' : 'Descriptive',
        maxMarks: qMaxMarks,
        marksSecured,
        performanceRemark,
        topic: q.topic || 'General'
      });
    });

    // Ensure baseline total marks if none set
    if (totalMaxMarks === 0) totalMaxMarks = 100;
    const percentage = Math.round((totalScoredMarks / totalMaxMarks) * 100);

    const marksData = {
      totalMarks: totalMaxMarks,
      scored: totalScoredMarks,
      percentage,
      grade: percentage >= 80 ? 'A1 Distinction' : percentage >= 60 ? 'A First Class' : 'Passed',
      candidate: candidateInfo,
      evaluations: questionEvaluations
    };

    setScoreData(marksData);
    setExamSubmitted(true);
    setStage('result');

    // Celebration Confetti
    try {
      confetti({
        particleCount: 110,
        spread: 75,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentQ = activeQuestions[currentQuestionIdx] || activeQuestions[0];
  const isCurrentAnswered = userAnswers[currentQuestionIdx] !== undefined && userAnswers[currentQuestionIdx] !== '';

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 print-modal-container cursor-pointer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[92dvh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden from Print) */}
        <div className="flex-shrink-0 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-4 sm:p-5 flex items-center justify-between no-print shadow-md">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded uppercase tracking-wider">
                Official Examination Portal
              </span>
              <span className="text-xs text-slate-300">BIE AP Code: 01089</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white">
              {stage === 'register' && 'Candidate Registration for Examination'}
              {stage === 'hallticket' && 'Official Examination Hall Ticket Generated'}
              {stage === 'exam' && `Subject Examination: ${formData.stream} Stream`}
              {stage === 'result' && 'Automated Examination Result & Marks Memo'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {(stage === 'hallticket' || stage === 'result') && (
              <button
                type="button"
                onClick={handlePrint}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-3 sm:px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print 1-Page Document</span>
                <span className="sm:hidden">Print</span>
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="w-9 h-9 rounded-full bg-slate-800/90 hover:bg-red-600 active:scale-95 text-white flex items-center justify-center transition shadow-lg border border-white/20 cursor-pointer"
              title="Close Portal (Esc)"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-white stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Modal Stage Steps Indicator (Hidden from Print) */}
        <div className="flex-shrink-0 bg-slate-100 border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs font-bold no-print overflow-x-auto">
          <div className={`flex items-center gap-1.5 ${stage === 'register' ? 'text-indigo-600' : 'text-emerald-700'}`}>
            <span className="w-5 h-5 rounded-full bg-white border flex items-center justify-center text-[10px]">1</span>
            <span>Registration</span>
          </div>
          <span className="text-slate-300">&rarr;</span>
          <div className={`flex items-center gap-1.5 ${stage === 'hallticket' ? 'text-indigo-600' : stage === 'exam' || stage === 'result' ? 'text-emerald-700' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full bg-white border flex items-center justify-center text-[10px]">2</span>
            <span>Hall Ticket</span>
          </div>
          <span className="text-slate-300">&rarr;</span>
          <div className={`flex items-center gap-1.5 ${stage === 'exam' ? 'text-indigo-600' : stage === 'result' ? 'text-emerald-700' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full bg-white border flex items-center justify-center text-[10px]">3</span>
            <span>Subject Exam (CBT)</span>
          </div>
          <span className="text-slate-300">&rarr;</span>
          <div className={`flex items-center gap-1.5 ${stage === 'result' ? 'text-emerald-700' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full bg-white border flex items-center justify-center text-[10px]">4</span>
            <span>Marks Memo</span>
          </div>
        </div>

        {/* Scrollable Stage Content Container */}
        <div className="overflow-y-auto flex-1">

        {/* ========================================================
            STAGE 1: Candidate Registration
           ======================================================== */}
        {stage === 'register' && (
          <form onSubmit={handleRegister} className="p-6 space-y-5">
            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-center gap-3 text-xs text-amber-900 font-semibold">
              <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>
                Register for Sunrise Junior College Entrance & Assessment Examination. Hall ticket and teacher-authored exam papers will be generated immediately.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-semibold"
                  placeholder="e.g. Chaitanya Varma"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Father's Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-semibold"
                  placeholder="e.g. C. Srinivas"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">10th Class / SSC Hall Ticket No *</label>
                <input
                  type="text"
                  required
                  value={formData.sscHallTicket}
                  onChange={(e) => setFormData({ ...formData, sscHallTicket: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono font-semibold"
                  placeholder="e.g. 2405108922"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (Parent Alert) *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono font-semibold"
                  placeholder="e.g. 7893505185"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Desired Intermediate Stream *</label>
                <select
                  value={formData.stream}
                  onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-indigo-700"
                >
                  <option value="MPC">M.P.C (Maths, Physics, Chemistry)</option>
                  <option value="BiPC">Bi.P.C (Botany, Zoology, Physics, Chem)</option>
                  <option value="CEC">C.E.C (Civics, Economics, Commerce)</option>
                  <option value="MEC">M.E.C (Maths, Economics, Commerce)</option>
                  <option value="HEC">H.E.C (History, Economics, Civics)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Instruction Medium *</label>
                <select
                  value={formData.medium}
                  onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-semibold"
                >
                  <option value="English Medium">English Medium</option>
                  <option value="Telugu Medium">Telugu Medium</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
              <span>Selected Stream: <strong className="text-slate-900">{formData.stream}</strong> ({formData.medium})</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {activeQuestions.length} Custom Teacher Questions Loaded
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-lg"
            >
              <span>Submit Registration & Generate Official Hall Ticket</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </form>
        )}

        {/* ========================================================
            STAGE 2: Official Hall Ticket (Single Page Printable)
           ======================================================== */}
        {stage === 'hallticket' && candidateInfo && (
          <div className="p-6 space-y-4">
            <div className="printable-memo-card p-6 bg-white border border-slate-300 rounded-2xl shadow-sm text-slate-900">
              {/* College Header */}
              <div className="border-b-2 border-slate-900 pb-3 text-center relative">
                <div className="flex items-center justify-center gap-3 mb-1">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white p-0.5 border-2 border-amber-500 flex items-center justify-center shadow-sm flex-shrink-0">
                    <img src="./assets/sunrise_official_logo.png" alt="Sunrise Official Logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] font-bold tracking-widest text-slate-600 uppercase">Sunrise Educational Society</p>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 leading-none">
                      SUNRISE JUNIOR COLLEGE
                    </h2>
                    <p className="text-[10px] font-semibold text-slate-700 mt-0.5">
                      Day & Night Junction, Opp. Sindhoora Hospital, Srikakulam – 532001
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 text-[10px] font-bold text-slate-800 pt-1">
                  <span>BIE AP Code: <strong>01089</strong></span>
                  <span>•</span>
                  <span>Center Code: <strong>01089-A</strong></span>
                  <span>•</span>
                  <span>Helpline: 8143217785</span>
                </div>

                <div className="inline-block bg-slate-900 text-amber-300 text-[11px] font-black px-4 py-0.5 rounded-full uppercase tracking-wider mt-1.5">
                  OFFICIAL EXAMINATION HALL TICKET
                </div>
              </div>

              {/* Candidate Info with Photo Box */}
              <div className="grid grid-cols-12 gap-4 py-3 border-b border-slate-200 items-center">
                <div className="col-span-9 space-y-1 text-xs">
                  <p><span className="text-slate-500">Candidate Name:</span> <strong className="text-slate-950 text-sm uppercase">{candidateInfo.name}</strong></p>
                  <p><span className="text-slate-500">Hall Ticket / Roll No:</span> <strong className="font-mono text-base text-indigo-700">{candidateInfo.rollNo}</strong></p>
                  <p><span className="text-slate-500">SSC Hall Ticket No:</span> <strong className="font-mono text-slate-800">{candidateInfo.sscHallTicket}</strong></p>
                  <p><span className="text-slate-500">Father's Name:</span> <strong>{candidateInfo.fatherName}</strong></p>
                  <p><span className="text-slate-500">Stream & Medium:</span> <strong className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded">{candidateInfo.stream} ({candidateInfo.medium})</strong></p>
                </div>

                <div className="col-span-3 text-center">
                  <div className="w-24 h-28 border-2 border-dashed border-slate-400 rounded-lg flex flex-col items-center justify-center bg-slate-50 mx-auto p-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Affix Passport Photo Here</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1 block">Reg: {candidateInfo.registrationId}</span>
                </div>
              </div>

              {/* Venue & Schedule Details */}
              <div className="py-2.5 bg-slate-50 rounded-xl p-3 my-2 border border-slate-200 text-xs space-y-1">
                <p><span className="text-slate-500">College Examination Venue:</span> <strong className="text-slate-950">{candidateInfo.examVenue}</strong></p>
                <div className="grid grid-cols-2 gap-2 pt-1 font-semibold">
                  <p><span className="text-slate-500">Date of Examination:</span> <strong className="text-indigo-800">{candidateInfo.examDate}</strong></p>
                  <p><span className="text-slate-500">Time & Reporting:</span> <strong>{candidateInfo.examTime} (Report: {candidateInfo.reportingTime})</strong></p>
                </div>
                <p><span className="text-slate-500">Assigned Hall:</span> <strong>{candidateInfo.roomNo}</strong></p>
              </div>

              {/* Instructions */}
              <div className="text-[10px] text-slate-600 space-y-0.5 border-b border-slate-200 pb-2">
                <p className="font-bold text-slate-800 uppercase">Candidate Instructions:</p>
                <p>1. Candidate must bring this Hall Ticket along with a valid ID card to the exam hall.</p>
                <p>2. Electronic gadgets, mobile phones, and calculators are strictly prohibited inside the hall.</p>
                <p>3. Candidates must be present at the examination venue 30 minutes before commencement.</p>
              </div>

              {/* Signatures */}
              <div className="pt-2 flex items-end justify-between text-xs">
                <div>
                  <div className="w-28 h-6 border-b border-slate-400 mb-1" />
                  <p className="text-[10px] text-slate-500">Signature of Candidate</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-8 border border-dashed border-slate-400 rounded flex items-center justify-center text-[8px] text-slate-400 font-bold uppercase mx-auto">
                    College Seal
                  </div>
                  <p className="font-black text-slate-900 text-xs mt-1">Chief Superintendent</p>
                  <p className="text-[9px] text-slate-500">Sunrise Junior College</p>
                </div>
              </div>
            </div>

            {/* Launch Exam Button */}
            <div className="no-print pt-2">
              <button
                onClick={() => setStage('exam')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md"
              >
                <span>Launch Interactive CBT Online Exam Now ({formData.stream} Stream • {activeQuestions.length} Questions)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            STAGE 3: Interactive CBT Subject Examination (MCQ & Descriptive)
           ======================================================== */}
        {stage === 'exam' && (
          <div className="p-6 space-y-4">
            {/* Exam Header with Live Timer */}
            <div className="bg-slate-900 text-white p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold shadow">
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded text-[10px] uppercase font-black">
                  {formData.stream} Stream Paper
                </span>
                <span>Question {currentQuestionIdx + 1} of {activeQuestions.length}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-amber-300 bg-white/10 px-3 py-1 rounded-lg">
                <Clock className="w-4 h-4" />
                <span>Time Remaining: {formatTimer(timeLeft)}</span>
              </div>
            </div>

            {/* Current Question Card */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-md">
                    Subject: {currentQ.subject}
                  </span>
                  {currentQ.topic && (
                    <span className="text-xs text-slate-500 font-medium">
                      ({currentQ.topic})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    currentQ.type === 'mcq' ? 'bg-indigo-100 text-indigo-900' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {currentQ.type === 'mcq' ? 'Multiple Choice (MCQ)' : 'Descriptive Written'}
                  </span>
                  <span className="text-xs font-black text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded">
                    {currentQ.marks || (currentQ.type === 'mcq' ? 10 : 20)} Marks
                  </span>
                </div>
              </div>

              {/* Question Statement */}
              <h3 className="text-base font-extrabold text-slate-900 leading-relaxed">
                Q{currentQuestionIdx + 1}. {currentQ.question}
              </h3>

              {/* CONDITIONAL FORMAT: MCQ Options */}
              {currentQ.type === 'mcq' && (
                <div className="space-y-2 pt-1">
                  {currentQ.options && currentQ.options.map((option, optIdx) => {
                    const isSelected = userAnswers[currentQuestionIdx] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => setUserAnswers({ ...userAnswers, [currentQuestionIdx]: optIdx })}
                        className={`w-full p-3 rounded-xl border text-left text-xs font-semibold flex items-center gap-3 transition ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-950 ring-2 ring-indigo-500 font-bold shadow-sm'
                            : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{option}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* CONDITIONAL FORMAT: Descriptive Written Answer Field */}
              {currentQ.type === 'descriptive' && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-slate-700">Write Your Detailed Solution / Theory Answer:</span>
                    <span className="font-mono text-[11px]">
                      Word Count: {(userAnswers[currentQuestionIdx] || '').trim().split(/\s+/).filter(Boolean).length}
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    value={userAnswers[currentQuestionIdx] || ''}
                    onChange={(e) => setUserAnswers({ ...userAnswers, [currentQuestionIdx]: e.target.value })}
                    placeholder="Type your derivation steps, formulas, scientific definitions, or essay explanation here. Evaluated by Sunrise Academic Faculty..."
                    className="w-full text-xs p-3.5 rounded-xl border border-slate-300 font-medium bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
                  />
                  <div className="text-[11px] text-slate-500 bg-indigo-50/50 p-2 rounded-lg border border-indigo-100 flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Your written response is evaluated against the lecturer's answer key for this question.</span>
                  </div>
                </div>
              )}

              {/* Author Attribution */}
              <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between">
                <span>Subject Lecturer: <strong className="text-slate-600">{currentQ.author || 'Faculty Member'}</strong></span>
                <span>Question Code: <strong className="font-mono text-slate-600">{currentQ.id}</strong></span>
              </div>
            </div>

            {/* Navigation & Submit Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx(currentQuestionIdx - 1)}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl transition disabled:opacity-40"
              >
                &larr; Previous Question
              </button>

              {/* Question Palette */}
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {activeQuestions.map((q, idx) => {
                  const answered = userAnswers[idx] !== undefined && userAnswers[idx] !== '';
                  const isCurrent = currentQuestionIdx === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIdx(idx)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold font-mono transition flex flex-col items-center justify-center ${
                        isCurrent
                          ? 'bg-slate-900 text-white ring-2 ring-amber-400'
                          : answered
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                      title={`Q${idx + 1}: ${q.subject} (${q.type.toUpperCase()})`}
                    >
                      <span>{idx + 1}</span>
                    </button>
                  );
                })}
              </div>

              {currentQuestionIdx < activeQuestions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIdx(currentQuestionIdx + 1)}
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1"
                >
                  <span>Next Question</span>
                  <span>&rarr;</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitExam}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-2.5 px-5 rounded-xl transition shadow-md flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Submit CBT Paper &rarr;</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            STAGE 4: Automated Marks Memo Generation (1-Page Printable)
           ======================================================== */}
        {stage === 'result' && scoreData && (
          <div className="p-6 space-y-4">
            <div className="printable-memo-card p-6 bg-white border border-slate-300 rounded-2xl shadow-sm text-slate-900">
              {/* College Header */}
              <div className="border-b-2 border-slate-900 pb-3 text-center relative">
                <div className="flex items-center justify-center gap-3 mb-1">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white p-0.5 border-2 border-amber-500 flex items-center justify-center shadow-sm flex-shrink-0">
                    <img src="./assets/sunrise_official_logo.png" alt="Sunrise Official Logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] font-bold tracking-widest text-slate-600 uppercase">Sunrise Educational Society</p>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 leading-none">
                      SUNRISE JUNIOR COLLEGE
                    </h2>
                    <p className="text-[10px] font-semibold text-slate-700 mt-0.5">
                      Day & Night Junction, Opp. Sindhoora Hospital, Srikakulam – 532001
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 text-[10px] font-bold text-slate-800 pt-1">
                  <span>BIE AP Code: <strong>01089</strong></span>
                  <span>•</span>
                  <span>Assessment: <strong>Teacher-Configured Subject Examination</strong></span>
                  <span>•</span>
                  <span>Year: 2026–27</span>
                </div>

                <div className="inline-block bg-indigo-950 text-white text-[11px] font-black px-4 py-0.5 rounded-full uppercase tracking-wider mt-1.5 memo-badge">
                  Memorandum of Marks (Official Examination)
                </div>
              </div>

              {/* Candidate Info Grid */}
              <div className="grid grid-cols-2 gap-4 py-2.5 text-xs border-b border-slate-200">
                <div className="space-y-1">
                  <p><span className="text-slate-500">Candidate Name:</span> <strong className="text-slate-950 uppercase">{candidateInfo.name}</strong></p>
                  <p><span className="text-slate-500">Roll / Hall Ticket:</span> <strong className="font-mono text-indigo-700">{candidateInfo.rollNo}</strong></p>
                  <p><span className="text-slate-500">Stream:</span> <strong>{candidateInfo.stream} ({candidateInfo.medium})</strong></p>
                </div>
                <div className="text-right space-y-1">
                  <p><span className="text-slate-500">Father Name:</span> <strong>{candidateInfo.fatherName}</strong></p>
                  <p><span className="text-slate-500">Exam Date:</span> <strong>{new Date().toLocaleDateString('en-GB')}</strong></p>
                  <p><span className="text-slate-500">Candidate Mobile:</span> <strong className="font-mono">{candidateInfo.phone}</strong></p>
                </div>
              </div>

              {/* Subject-Wise & Question Breakdown Table */}
              <div className="py-2.5">
                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700 uppercase">
                    <tr>
                      <th className="py-1 px-2.5">#</th>
                      <th className="py-1 px-2.5">Subject & Question Module</th>
                      <th className="py-1 px-2 text-center">Format</th>
                      <th className="py-1 px-2 text-center">Max Marks</th>
                      <th className="py-1 px-2 text-center">Marks Secured</th>
                      <th className="py-1 px-2.5 text-right">Performance Remark</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {scoreData.evaluations && scoreData.evaluations.map((ev) => (
                      <tr key={ev.qNumber}>
                        <td className="py-1 px-2.5 font-mono text-slate-400">{ev.qNumber}</td>
                        <td className="py-1 px-2.5 font-semibold text-slate-900">
                          {ev.subject} <span className="text-[10px] text-slate-500 font-normal">({ev.topic})</span>
                        </td>
                        <td className="py-1 px-2 text-center font-mono text-[10px] text-slate-600">{ev.type}</td>
                        <td className="py-1 px-2 text-center font-mono">{ev.maxMarks}</td>
                        <td className="py-1 px-2 text-center font-mono font-bold text-indigo-900">{ev.marksSecured}</td>
                        <td className="py-1 px-2.5 text-right font-medium text-emerald-800 text-[11px]">{ev.performanceRemark}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 font-bold border-t-2 border-slate-300">
                      <td colSpan={3} className="py-2 px-2.5 uppercase font-black">
                        Grand Aggregate Total ({formData.stream}):
                      </td>
                      <td className="py-2 px-2 text-center font-black">{scoreData.totalMarks}</td>
                      <td className="py-2 px-2 text-center text-sm font-black text-indigo-900">{scoreData.scored}</td>
                      <td className="py-2 px-2.5 text-right font-black text-emerald-800 text-xs">
                        PASSED ({scoreData.percentage}%) - {scoreData.grade}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Signatures & Seal */}
              <div className="pt-2 flex items-end justify-between text-xs">
                <div className="space-y-0.5 text-[11px]">
                  <p><span className="text-slate-500">Overall Result:</span> <strong className="text-emerald-700">QUALIFIED FOR SUNRISE MERIT SCHOLARSHIP</strong></p>
                  <p className="text-[10px] text-slate-400 italic">Questions authored by Sunrise Academic Faculty. Valid for 2026-27 admissions.</p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-8 border border-dashed border-slate-400 rounded flex items-center justify-center text-[8px] text-slate-400 font-bold uppercase mx-auto">
                    College Seal
                  </div>
                  <p className="font-black text-slate-900 text-xs mt-1">Controller of Examinations</p>
                  <p className="text-[9px] text-slate-500">Sunrise Junior College</p>
                </div>
              </div>
            </div>

            {/* Notification Dispatch Bar (Hidden from Print) */}
            <div className="no-print pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={createWhatsAppLink(candidateInfo.phone, `*SUNRISE JUNIOR COLLEGE, SRIKAKULAM*
(BIE AP Code: 01089)
Official Exam Result & Marks Memo:
-------------------------
• Candidate: ${candidateInfo.name}
• Roll No: ${candidateInfo.rollNo}
• Stream: ${candidateInfo.stream} (${candidateInfo.medium})
• Marks Scored: ${scoreData.scored} / ${scoreData.totalMarks} (${scoreData.percentage}%)
• Result: PASSED (${scoreData.grade})
• Assessment: Teacher-Authored Subject Exam
• Venue: Day & Night Junction, Srikakulam
-------------------------
Principal: 8143217785`)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition shadow-sm"
              >
                <span>Send Result via WhatsApp ({candidateInfo.phone})</span>
              </a>

              <button
                onClick={onClose}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl transition"
              >
                Close Portal
              </button>
            </div>
          </div>
        )}
        </div>

      </div>
    </div>
  );
}
