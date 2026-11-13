import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, FileText, Award, Clock, ArrowRight, Printer, Sparkles, Building, QrCode, AlertCircle, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { createWhatsAppLink } from '../utils/geoUtils';

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
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [scoreData, setScoreData] = useState(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Stream-specific CBT question sets
  const questionsByStream = {
    MPC: [
      {
        id: 1,
        subject: 'Mathematics',
        q: 'If the matrix A is symmetric, then which of the following is true?',
        options: ['A = -A^T', 'A = A^T', 'A^2 = I', 'det(A) = 0'],
        answer: 1
      },
      {
        id: 2,
        subject: 'Physics',
        q: 'The rate of change of linear momentum of a body is directly proportional to:',
        options: ['Applied external force', 'Velocity of the body', 'Displacement', 'Kinetic Energy'],
        answer: 0
      },
      {
        id: 3,
        subject: 'Chemistry',
        q: 'Which quantum number determines the spatial orientation of an orbital?',
        options: ['Principal Quantum Number (n)', 'Azimuthal Quantum Number (l)', 'Magnetic Quantum Number (m)', 'Spin Quantum Number (s)'],
        answer: 2
      },
      {
        id: 4,
        subject: 'Mathematics',
        q: 'The derivative of sin(2x) with respect to x is:',
        options: ['cos(2x)', '2 cos(2x)', '-2 cos(2x)', '2 sin(x)'],
        answer: 1
      },
      {
        id: 5,
        subject: 'Physics',
        q: 'What is the SI unit of electric potential difference?',
        options: ['Ampere', 'Joule', 'Volt', 'Ohm'],
        answer: 2
      }
    ],
    BiPC: [
      {
        id: 1,
        subject: 'Botany',
        q: 'Which organelle is known as the powerhouse of the cell?',
        options: ['Chloroplast', 'Mitochondria', 'Ribosome', 'Golgi apparatus'],
        answer: 1
      },
      {
        id: 2,
        subject: 'Zoology',
        q: 'Human heart is enclosed in a double-walled membranous bag called:',
        options: ['Pleura', 'Pericardium', 'Peritoneum', 'Meninges'],
        answer: 1
      },
      {
        id: 3,
        subject: 'Chemistry',
        q: 'The pH of pure neutral water at 25 degrees Celsius is:',
        options: ['0', '7', '14', '1'],
        answer: 1
      },
      {
        id: 4,
        subject: 'Botany',
        q: 'Photosynthesis primarily occurs in which plant tissue?',
        options: ['Mesophyll', 'Xylem', 'Phloem', 'Epidermis'],
        answer: 0
      },
      {
        id: 5,
        subject: 'Zoology',
        q: 'Which blood cells play an essential role in blood clotting?',
        options: ['Erythrocytes (RBC)', 'Platelets (Thrombocytes)', 'Lymphocytes', 'Monocytes'],
        answer: 1
      }
    ],
    CEC: [
      {
        id: 1,
        subject: 'Civics',
        q: 'Who was the Chairman of the Drafting Committee of the Indian Constitution?',
        options: ['Dr. B.R. Ambedkar', 'Dr. Rajendra Prasad', 'Jawaharlal Nehru', 'Sardar Vallabhbhai Patel'],
        answer: 0
      },
      {
        id: 2,
        subject: 'Economics',
        q: 'Microeconomics primarily deals with:',
        options: ['National Income', 'Individual economic units and prices', 'Fiscal Policy', 'Inflation in the economy'],
        answer: 1
      },
      {
        id: 3,
        subject: 'Commerce',
        q: 'According to the Dual Aspect concept in accounting, Assets equals:',
        options: ['Liabilities - Capital', 'Capital + Liabilities', 'Expenses + Revenue', 'Cash + Bank'],
        answer: 1
      },
      {
        id: 4,
        subject: 'Economics',
        q: 'When demand for a commodity increases with a decrease in its price, it is called:',
        options: ['Extension of Demand', 'Contraction of Demand', 'Shift in Demand', 'Zero Elasticity'],
        answer: 0
      },
      {
        id: 5,
        subject: 'Commerce',
        q: 'A trial balance is prepared to check:',
        options: ['Arithmetical accuracy of ledger accounts', 'Financial position of company', 'Net profit calculation', 'Cash flow statement'],
        answer: 0
      }
    ],
    MEC: [
      {
        id: 1,
        subject: 'Mathematics',
        q: 'The slope of a horizontal line parallel to the X-axis is:',
        options: ['0', '1', 'Undefined', '-1'],
        answer: 0
      },
      {
        id: 2,
        subject: 'Economics',
        q: 'The law of diminishing marginal utility states that as consumption increases:',
        options: ['Total utility decreases', 'Marginal utility from successive units declines', 'Price of commodity rises', 'Demand stays static'],
        answer: 1
      },
      {
        id: 3,
        subject: 'Commerce',
        q: 'The book in which all commercial transactions are first recorded in chronological order is:',
        options: ['Ledger', 'Journal', 'Balance Sheet', 'Trial Balance'],
        answer: 1
      },
      {
        id: 4,
        subject: 'Mathematics',
        q: 'If A and B are mutually exclusive events, then P(A ∩ B) is equal to:',
        options: ['0', '1', 'P(A) * P(B)', '0.5'],
        answer: 0
      },
      {
        id: 5,
        subject: 'Economics',
        q: 'Gross Domestic Product (GDP) measures:',
        options: ['Total value of final goods & services produced in a country in a year', 'Only agricultural output', 'Bank deposit balances', 'Export earnings only'],
        answer: 0
      }
    ]
  };

  const activeQuestions = questionsByStream[formData.stream] || questionsByStream.MPC;

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
    let score = 0;
    activeQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        score += 20; // 5 questions x 20 = 100 marks
      }
    });

    const marksData = {
      totalMarks: 100,
      scored: score,
      percentage: score,
      grade: score >= 80 ? 'A1 Distinction' : score >= 60 ? 'A First Class' : 'Passed',
      candidate: candidateInfo
    };

    setScoreData(marksData);
    setExamSubmitted(true);
    setStage('result');

    // Confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto print-modal-container cursor-pointer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 my-4 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden from Print) */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-5 flex items-center justify-between no-print">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded uppercase tracking-wider">
                Official Examination Portal
              </span>
              <span className="text-xs text-slate-300">BIE AP Code: 01089</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {stage === 'register' && 'Candidate Registration for Examination'}
              {stage === 'hallticket' && 'Official Examination Hall Ticket Generated'}
              {stage === 'exam' && `Computer Based Online Exam: ${formData.stream}`}
              {stage === 'result' && 'Automated Examination Result & Marks Memo'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {(stage === 'hallticket' || stage === 'result') && (
              <button
                type="button"
                onClick={handlePrint}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow"
              >
                <Printer className="w-4 h-4" />
                <span>Print 1-Page Document</span>
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
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between text-xs font-bold no-print overflow-x-auto">
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

        {/* STAGE 1: Candidate Registration Form */}
        {stage === 'register' && (
          <form onSubmit={handleRegister} className="p-6 space-y-4">
            <p className="text-xs text-slate-600">
              Register below to generate your official BIE AP affiliated Hall Ticket with Exam Venue details, reporting time, and proceed to the online subject examination.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Father / Guardian Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">SSC / 10th Hall Ticket No. *</label>
                <input
                  type="text"
                  required
                  value={formData.sscHallTicket}
                  onChange={(e) => setFormData({ ...formData, sscHallTicket: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (Testing: 7893505185) *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Intermediate Stream *</label>
                <select
                  value={formData.stream}
                  onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white"
                >
                  <option value="MPC">MPC (Maths, Physics, Chemistry)</option>
                  <option value="BiPC">BiPC (Biology, Physics, Chemistry)</option>
                  <option value="MEC">MEC (Maths, Economics, Commerce)</option>
                  <option value="CEC">CEC (Civics, Economics, Commerce)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Medium of Instruction *</label>
                <select
                  value={formData.medium}
                  onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white"
                >
                  <option value="English Medium">English Medium</option>
                  <option value="Telugu Medium">Telugu Medium</option>
                </select>
              </div>
            </div>

            <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <Building className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Assigned Center & Venue:</span> Sunrise Junior College, Day & Night Junction, Srikakulam.
                Exam dates and roll numbers will be imprinted onto the official Hall Ticket.
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition text-sm shadow-md"
              >
                <span>Submit Registration & Generate Hall Ticket</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </form>
        )}

        {/* STAGE 2: Printable 1-Page Official Hall Ticket */}
        {stage === 'hallticket' && candidateInfo && (
          <div className="p-6 space-y-4">
            {/* The printable card itself (fits on exactly 1 page) */}
            <div className="printable-receipt-card p-6 bg-white border border-slate-300 rounded-2xl shadow-sm text-slate-900">
              {/* College Header */}
              <div className="border-b-2 border-slate-900 pb-3 text-center relative">
                <div className="flex items-center justify-center gap-3 mb-1">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white p-0.5 border-2 border-amber-500 flex items-center justify-center shadow-sm flex-shrink-0">
                    <img src="./assets/sunrise_logo.svg" alt="Sunrise Logo" className="w-full h-full object-contain" />
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

            {/* Next Action: Launch Online CBT Exam (Hidden from Print) */}
            <div className="no-print pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setStage('exam')}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md"
              >
                <span>Launch Interactive CBT Online Exam Now ({formData.stream})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STAGE 3: Interactive CBT Subject Examination */}
        {stage === 'exam' && (
          <div className="p-6 space-y-4">
            {/* Exam Header with Live Timer */}
            <div className="bg-slate-900 text-white p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded text-[10px] uppercase font-black">
                  {formData.stream} Stream Paper
                </span>
                <span>Question {currentQuestionIdx + 1} of {activeQuestions.length}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-amber-300">
                <Clock className="w-4 h-4" />
                <span>Time Remaining: 09:42</span>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                  Subject: {activeQuestions[currentQuestionIdx].subject}
                </span>
                <span className="text-xs text-slate-400 font-semibold">20 Marks</span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900">
                Q{currentQuestionIdx + 1}. {activeQuestions[currentQuestionIdx].q}
              </h3>

              {/* Options */}
              <div className="space-y-2 pt-2">
                {activeQuestions[currentQuestionIdx].options.map((option, optIdx) => (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => setSelectedAnswers({ ...selectedAnswers, [currentQuestionIdx]: optIdx })}
                    className={`w-full p-3 rounded-xl border text-left text-xs font-semibold flex items-center gap-3 transition ${
                      selectedAnswers[currentQuestionIdx] === optIdx
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-950 ring-1 ring-indigo-500 font-bold'
                        : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                      selectedAnswers[currentQuestionIdx] === optIdx ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{option}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation & Submit Bar */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx(currentQuestionIdx - 1)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-3.5 rounded-xl transition disabled:opacity-40"
              >
                &larr; Previous Question
              </button>

              <div className="flex items-center gap-1.5">
                {activeQuestions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestionIdx(idx)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold font-mono transition ${
                      currentQuestionIdx === idx
                        ? 'bg-slate-900 text-white'
                        : selectedAnswers[idx] !== undefined
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              {currentQuestionIdx < activeQuestions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIdx(currentQuestionIdx + 1)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition"
                >
                  Next Question &rarr;
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitExam}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-2 px-4 rounded-xl transition shadow-md"
                >
                  Submit CBT Paper &rarr;
                </button>
              )}
            </div>
          </div>
        )}

        {/* STAGE 4: Automated Marks Memo Generation */}
        {stage === 'result' && scoreData && (
          <div className="p-6 space-y-4">
            {/* The printable Marks Memo (Fits strictly on 1 Single Page) */}
            <div className="printable-memo-card p-6 bg-white border border-slate-300 rounded-2xl shadow-sm text-slate-900">
              {/* College Header */}
              <div className="border-b-2 border-slate-900 pb-3 text-center relative">
                <div className="flex items-center justify-center gap-3 mb-1">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white p-0.5 border-2 border-amber-500 flex items-center justify-center shadow-sm flex-shrink-0">
                    <img src="./assets/sunrise_logo.svg" alt="Sunrise Logo" className="w-full h-full object-contain" />
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
                  <span>Assessment: <strong>Entrance & CBT Model Exam</strong></span>
                  <span>•</span>
                  <span>Year: 2026–27</span>
                </div>

                <div className="inline-block bg-indigo-950 text-white text-[11px] font-black px-4 py-0.5 rounded-full uppercase tracking-wider mt-1.5 memo-badge">
                  Memorandum of Marks (CBT Assessment)
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

              {/* Score Breakdown Table */}
              <div className="py-2.5">
                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700 uppercase">
                    <tr>
                      <th className="py-1.5 px-3">Subject / Paper Module</th>
                      <th className="py-1.5 px-3 text-center">Max Marks</th>
                      <th className="py-1.5 px-3 text-center">Marks Secured</th>
                      <th className="py-1.5 px-3 text-right">Performance Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="py-1.5 px-3 font-semibold">{formData.stream} Core Comprehensive Assessment</td>
                      <td className="py-1.5 px-3 text-center">100</td>
                      <td className="py-1.5 px-3 text-center font-black text-indigo-900 text-sm">{scoreData.scored}</td>
                      <td className="py-1.5 px-3 text-right font-bold text-emerald-700">
                        {scoreData.scored >= 80 ? 'Grade A1 (Distinction)' : 'Grade A (First Class)'}
                      </td>
                    </tr>
                    <tr className="bg-slate-50 font-bold border-t-2 border-slate-300">
                      <td className="py-2 px-3 uppercase">Grand Total:</td>
                      <td className="py-2 px-3 text-center">100</td>
                      <td className="py-2 px-3 text-center text-base font-black text-indigo-900">{scoreData.scored}</td>
                      <td className="py-2 px-3 text-right font-black text-emerald-800 text-xs">
                        PASSED ({scoreData.percentage}%)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Signatures & Seal */}
              <div className="pt-2 flex items-end justify-between text-xs">
                <div className="space-y-0.5 text-[11px]">
                  <p><span className="text-slate-500">Overall Result:</span> <strong className="text-emerald-700">QUALIFIED FOR SUNRISE MERIT SCHOLARSHIP</strong></p>
                  <p className="text-[10px] text-slate-400 italic">Valid for admission into Sunrise Junior College Srikakulam 2026-27 session.</p>
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
Exam Result & Marks Memo:
-------------------------
• Candidate: ${candidateInfo.name}
• Roll No: ${candidateInfo.rollNo}
• Stream: ${candidateInfo.stream}
• Marks Scored: ${scoreData.scored}/100 (${scoreData.percentage}%)
• Result: PASSED (${scoreData.grade})
• Venue: Day & Night Jn, Srikakulam
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
  );
}