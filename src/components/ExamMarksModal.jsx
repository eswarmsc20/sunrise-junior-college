import React, { useState } from 'react';
import { X, Printer, Send, MessageSquare, Award, CheckCircle2, ChevronRight, Phone } from 'lucide-react';
import { createWhatsAppLink } from '../utils/geoUtils';
import sunriseLogo from '../assets/sunrise_official_logo.png';

export default function ExamMarksModal({ isOpen, onClose, student, onSendAlert }) {
  const [selectedExam, setSelectedExam] = useState('Half-Yearly Exam (100M)');

  // Close on Escape key & manage print body class (ALWAYS at top level before early returns)
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.classList.add('modal-memo-open');
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('modal-memo-open');
    };
  }, [isOpen, onClose]);

  if (!isOpen || !student) return null;

  const exams = student.examReports || {
    'Unit Test - 1 (25M)': { 'Maths/Botany': 24, 'Physics/Zoology': 23, 'Chemistry': 22, 'English': 23, 'Sanskrit': 24 },
    'Unit Test - 2 (25M)': { 'Maths/Botany': 25, 'Physics/Zoology': 22, 'Chemistry': 24, 'English': 24, 'Sanskrit': 25 },
    'Quarterly Exam (100M)': { 'Maths/Botany': 92, 'Physics/Zoology': 88, 'Chemistry': 85, 'English': 90, 'Sanskrit': 98 },
    'Half-Yearly Exam (100M)': { 'Maths/Botany': 95, 'Physics/Zoology': 90, 'Chemistry': 88, 'English': 92, 'Sanskrit': 99 }
  };

  const isUnitTest = selectedExam.includes('25M');
  const maxPerSubject = isUnitTest ? 25 : 100;
  const passPerSubject = isUnitTest ? 9 : 35;

  const currentMarks = exams[selectedExam] || {};
  const currentMarksEntries = Object.entries(currentMarks);

  const totalScored = currentMarksEntries.reduce((sum, [, score]) => sum + Number(score), 0);
  const totalMax = currentMarksEntries.length * maxPerSubject;
  const percentage = totalMax > 0 ? Math.round((totalScored / totalMax) * 100) : 0;

  const memoNo = `SJC-MEMO-${student.hallTicket?.slice(-4) || '1089'}`;

  const handlePrint = () => {
    window.print();
  };

  const marksSummaryText = currentMarksEntries
    .map(([sub, score]) => `• ${sub}: ${score}/${maxPerSubject}`)
    .join('\n');

  const reportMessage = `*SUNRISE JUNIOR COLLEGE, SRIKAKULAM*
(BIE AP Code: 01089)
Official Marks Memo / Progress Card:
------------------------------------
• Student Name: ${student.name}
• Admission No: ${student.admissionNo || 'SJC-2026-001'}
• Hall Ticket: ${student.hallTicket}
• Stream: ${student.groupFull || student.group}
• Examination: ${selectedExam}
------------------------------------
*Marks Breakdown:*
${marksSummaryText}
------------------------------------
• Total Scored: ${totalScored}/${totalMax} (${percentage}%)
• Result: PASSED (Grade A1 Distinction)
• Attendance: ${student.attendance}% (Regular)
Principal: Sri Andhavarapu Sudarshan Rao (8143217785)`;

  const studentWhatsApp = createWhatsAppLink(student.phone, reportMessage);
  const fatherWhatsApp = createWhatsAppLink(student.fatherPhone || student.phone, reportMessage);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 print-modal-container cursor-pointer overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[92dvh] flex flex-col overflow-hidden shadow-2xl border border-slate-300 my-auto cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Pinned Header - Hidden from Print) */}
        <div className="flex-shrink-0 bg-slate-900 text-white p-3.5 sm:p-4 flex items-center justify-between no-print shadow-md z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/20 px-2.5 py-0.5 rounded">
              Official Marks Memo
            </span>
            <span className="text-xs text-slate-300">Memo No: {memoNo}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-3 sm:px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print / Save 1-Page Marks Memo</span>
              <span className="sm:hidden">Print</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="w-9 h-9 rounded-full bg-slate-800/90 hover:bg-red-600 active:scale-95 text-white flex items-center justify-center transition shadow-lg border border-white/20 cursor-pointer"
              title="Close (Esc)"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-white stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Exam Selector Tabs (Pinned - Hidden from Print) */}
        <div className="flex-shrink-0 grid grid-cols-2 sm:grid-cols-4 p-2 bg-slate-100 border-b border-slate-200 gap-1 no-print z-10">
          {Object.keys(exams).map((ex) => (
            <button
              key={ex}
              onClick={() => setSelectedExam(ex)}
              className={`py-2 px-2 text-[11px] font-bold rounded-xl transition text-center ${
                selectedExam === ex ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-700 hover:text-slate-950 hover:bg-white'
              }`}
            >
              {ex}
            </button>
          ))}
        </div>

        {/* Scrollable Body Container (Contains Printable Card and WhatsApp Actions) */}
        <div className="flex-1 overflow-y-auto modal-scroll-body divide-y divide-slate-100">
          {/* Printable Official Marks Memo Card (Fits on EXACTLY 1 A4 Page) */}
          <div className="printable-memo-card p-5 sm:p-6 bg-white text-slate-900">
          
          {/* Official College Header */}
          <div className="border-b-2 border-slate-900 pb-3 text-center relative">
            <div className="flex items-center justify-center gap-3 mb-1">
              <div className="w-12 h-12 bg-transparent flex items-center justify-center flex-shrink-0">
                <img src={sunriseLogo} alt="Sunrise Official Crest" className="w-full h-full object-contain filter drop-shadow" />
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
              <span>RC No. 652995/E2-3/2008-09</span>
              <span>•</span>
              <span>Academic Year: 2026–27</span>
            </div>

            <div className="inline-block bg-indigo-950 text-white text-[11px] font-black px-4 py-0.5 rounded-full uppercase tracking-wider mt-1.5 memo-badge">
              Memorandum of Marks (Official Progress Card)
            </div>
          </div>

          {/* Student & Examination Details (2-Column Compact Grid) */}
          <div className="grid grid-cols-2 gap-4 py-2.5 text-xs border-b border-slate-200">
            <div className="space-y-1">
              <p><span className="text-slate-500">Student Name:</span> <strong className="text-slate-950 uppercase">{student.name}</strong></p>
              <p><span className="text-slate-500">Admission No:</span> <strong className="font-mono text-indigo-700">{student.admissionNo || 'SJC-2026-001'}</strong></p>
              <p><span className="text-slate-500">Hall Ticket / Roll:</span> <strong className="font-mono text-slate-900">{student.hallTicket}</strong></p>
              <p><span className="text-slate-500">Intermediate Stream:</span> <strong>{student.groupFull || student.group}</strong></p>
            </div>
            <div className="text-right space-y-1">
              <p><span className="text-slate-500">Memo Serial No:</span> <strong className="font-mono">{memoNo}</strong></p>
              <p><span className="text-slate-500">Father / Guardian:</span> <strong>{student.fatherName || 'Parent'}</strong></p>
              <p><span className="text-slate-500">Examination:</span> <strong className="text-indigo-800">{selectedExam}</strong></p>
              <p><span className="text-slate-500">Attendance:</span> <strong className="text-emerald-700">{student.attendance}% (Regular)</strong></p>
            </div>
          </div>

          {/* Official Marks Table */}
          <div className="py-2.5">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700 uppercase">
                <tr>
                  <th className="py-1.5 px-3 w-8">#</th>
                  <th className="py-1.5 px-3">Subject Name</th>
                  <th className="py-1.5 px-3 text-center">Max Marks</th>
                  <th className="py-1.5 px-3 text-center">Pass Marks</th>
                  <th className="py-1.5 px-3 text-center">Marks Secured</th>
                  <th className="py-1.5 px-3 text-right">Grade / Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentMarksEntries.map(([subject, marks], idx) => {
                  const numMarks = Number(marks);
                  const isPass = numMarks >= passPerSubject;
                  return (
                    <tr key={idx}>
                      <td className="py-1.5 px-3 text-center font-mono">{idx + 1}</td>
                      <td className="py-1.5 px-3 font-bold text-slate-900">{subject}</td>
                      <td className="py-1.5 px-3 text-center text-slate-600">{maxPerSubject}</td>
                      <td className="py-1.5 px-3 text-center text-slate-600">{passPerSubject}</td>
                      <td className="py-1.5 px-3 text-center font-black text-slate-950 text-sm">{marks}</td>
                      <td className="py-1.5 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          numMarks >= maxPerSubject * 0.85 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {numMarks >= maxPerSubject * 0.85 ? 'Distinction' : (isPass ? 'First Class' : 'Pass')}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {/* Grand Total Row */}
                <tr className="bg-slate-50 font-bold border-t-2 border-slate-300">
                  <td colSpan="2" className="py-2 px-3 text-right font-black uppercase text-slate-800">Grand Total:</td>
                  <td className="py-2 px-3 text-center text-slate-700 font-black">{totalMax}</td>
                  <td className="py-2 px-3 text-center text-slate-500">—</td>
                  <td className="py-2 px-3 text-center text-base font-black text-indigo-900">{totalScored}</td>
                  <td className="py-2 px-3 text-right text-xs font-black text-emerald-700">
                    {percentage}% • Grade A1
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Academic Result & Signatures */}
          <div className="pt-2 flex items-end justify-between text-xs">
            <div className="space-y-0.5 text-[11px]">
              <p><span className="text-slate-500">Overall Result:</span> <strong className="text-emerald-700">PASSED - FIRST CLASS WITH DISTINCTION</strong></p>
              <p><span className="text-slate-500">Student Phone:</span> <strong className="font-mono">{student.phone}</strong></p>
              <p><span className="text-slate-500">Father Mobile:</span> <strong className="font-mono">{student.fatherPhone || student.phone}</strong></p>
              <p className="text-[10px] text-slate-400 italic pt-0.5">Note: Keep this Memorandum of Marks for academic records and board verification.</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-10 border border-dashed border-slate-400 rounded flex items-center justify-center text-[9px] text-slate-400 font-bold uppercase mx-auto">
                College Seal
              </div>
              <p className="font-black text-slate-900 text-xs mt-1">Principal & Correspondent</p>
              <p className="text-[9px] text-slate-500">Sri Andhavarapu Sudarshan Rao</p>
            </div>
          </div>

        </div>

        {/* WhatsApp & SMS Dispatch Buttons (Hidden from Print) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 no-print space-y-3">
          <p className="text-xs font-bold text-slate-700">
            Send Marks Memo Direct Message (WhatsApp / SMS):
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href={studentWhatsApp}
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send WhatsApp to Student ({student.phone})</span>
            </a>

            <a
              href={fatherWhatsApp}
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send WhatsApp to Father ({student.fatherPhone || student.phone})</span>
            </a>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={() => {
                if (onSendAlert) {
                  onSendAlert({
                    title: "Marks Memo Dispatched",
                    message: `${selectedExam} Marks Memo for ${student.name} (${totalScored}/${totalMax}) dispatched via SMS & WhatsApp to Student (${student.phone}) and Father (${student.fatherPhone || student.phone}).`
                  });
                }
              }}
              className="text-xs font-bold text-slate-700 hover:text-slate-950 underline"
            >
              Simulate Direct SMS Gateways (Send to Both)
            </button>
          </div>
        </div>
        </div>

      </div>
    </div>
  );
}
