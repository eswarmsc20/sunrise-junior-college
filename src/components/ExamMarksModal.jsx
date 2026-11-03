import React, { useState } from 'react';
import { X, Send, MessageSquare, Award, CheckCircle2, ChevronRight, Phone } from 'lucide-react';
import { createWhatsAppLink } from '../utils/geoUtils';

export default function ExamMarksModal({ isOpen, onClose, student, onSendAlert }) {
  const [selectedExam, setSelectedExam] = useState('Unit Test - 1 (25M)');
  if (!isOpen || !student) return null;

  const exams = student.examReports || {
    'Unit Test - 1 (25M)': { 'Maths/Botany': 24, 'Physics/Zoology': 23, 'Chemistry': 22, 'English': 23, 'Sanskrit': 24 },
    'Unit Test - 2 (25M)': { 'Maths/Botany': 25, 'Physics/Zoology': 22, 'Chemistry': 24, 'English': 24, 'Sanskrit': 25 },
    'Quarterly Exam (100M)': { 'Maths/Botany': 92, 'Physics/Zoology': 88, 'Chemistry': 85, 'English': 90, 'Sanskrit': 98 },
    'Half-Yearly Exam (100M)': { 'Maths/Botany': 95, 'Physics/Zoology': 90, 'Chemistry': 88, 'English': 92, 'Sanskrit': 99 }
  };

  const currentMarks = exams[selectedExam] || {};
  const currentMarksEntries = Object.entries(currentMarks);

  // Compose WhatsApp / SMS Message
  const marksSummaryText = Object.entries(currentMarks)
    .map(([sub, score]) => `• ${sub}: ${score}`)
    .join('\n');

  const reportMessage = `*SUNRISE JUNIOR COLLEGE, SRIKAKULAM*
(BIE AP Code: 01089)
Official Examination Performance Report:
------------------------------------
• Student Name: ${student.name}
• Admission No: ${student.admissionNo || 'SJC-2026-001'}
• Group: ${student.groupFull || student.group}
• Examination: ${selectedExam}
------------------------------------
*Subject Marks:*
${marksSummaryText}
------------------------------------
• Attendance: ${student.attendance}% (Regular)
• Principal Desk: Sri Andhavarapu Sudarshan Rao (8143217785)
Parents are requested to review and encourage regular study hours.`;

  const studentWhatsApp = createWhatsAppLink(student.phone, reportMessage);
  const fatherWhatsApp = createWhatsAppLink(student.fatherPhone || student.phone, reportMessage);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>

          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/20 px-2 py-0.5 rounded">
            Academic Performance Dispatch
          </span>
          <h3 className="text-xl font-extrabold text-white mt-1">
            Exam Progress Card: {student.name}
          </h3>
          <p className="text-xs text-slate-300">
            Admission No: <strong>{student.admissionNo}</strong> • Father: <strong>{student.fatherName}</strong> ({student.fatherPhone})
          </p>
        </div>

        {/* Exam Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 p-2 bg-slate-100 border-b border-slate-200 gap-1">
          {Object.keys(exams).map((ex) => (
            <button
              key={ex}
              onClick={() => setSelectedExam(ex)}
              className={`py-2 px-2 text-[11px] font-bold rounded-xl transition text-center ${
                selectedExam === ex ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {ex}
            </button>
          ))}
        </div>

        {/* Marks Table */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-900">{selectedExam} Marks Breakdown</h4>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Verified by Faculty
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 font-bold text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Subject</th>
                  <th className="py-2.5 px-4 text-center">Score</th>
                  <th className="py-2.5 px-4 text-right">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentMarksEntries.map(([sub, score], idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-bold text-slate-800">{sub}</td>
                    <td className="py-2.5 px-4 text-center font-extrabold text-slate-900">{score}</td>
                    <td className="py-2.5 px-4 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Excellent
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* WhatsApp & SMS Notification Dispatch Actions */}
          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            <p className="text-xs font-bold text-slate-700">
              Send Exam Marks Direct Message to Student & Father:
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
                      title: "Marks Dispatched",
                      message: `${selectedExam} marks report for ${student.name} dispatched via SMS & WhatsApp to Student (${student.phone}) and Father (${student.fatherPhone || student.phone}).`
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
