import React, { useState, useEffect } from 'react';
import { X, Send, Award, CheckCircle2, AlertCircle, Sparkles, BookOpen } from 'lucide-react';
import { submitMarksApprovalRequest } from '../utils/marksApprovalService';
import sunriseLogo from '../assets/sunrise_official_logo.png';

const EXAM_OPTIONS = [
  { id: 'Unit Test - 1 (25M)', name: 'Unit Test - 1', max: 25, pass: 9 },
  { id: 'Unit Test - 2 (25M)', name: 'Unit Test - 2', max: 25, pass: 9 },
  { id: 'Quarterly Exam (100M)', name: 'Quarterly Examination', max: 100, pass: 35 },
  { id: 'Half-Yearly Exam (100M)', name: 'Half-Yearly Examination', max: 100, pass: 35 }
];

export default function TeacherMarksEntryModal({ 
  isOpen, 
  onClose, 
  student, 
  teacher, 
  onSubmitted, 
  onSendAlert 
}) {
  const [selectedExam, setSelectedExam] = useState('Half-Yearly Exam (100M)');
  const [marksState, setMarksState] = useState({});
  const [teacherRemarks, setTeacherRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Load current marks when student or exam changes
  useEffect(() => {
    if (!student) return;
    const currentExamReports = student.examReports || {};
    const existingMarksForExam = currentExamReports[selectedExam] || student.marks || {};
    
    // Fallback default subjects if none present
    let defaultSubjects = Object.keys(existingMarksForExam);
    if (defaultSubjects.length === 0) {
      if (student.group === 'HEC') {
        defaultSubjects = ['History', 'Economics', 'Civics', 'English', 'Telugu/Sanskrit'];
      } else {
        defaultSubjects = ['Maths/Botany', 'Physics/Zoology', 'Chemistry', 'English', 'Sanskrit'];
      }
    }

    const initialMarks = {};
    defaultSubjects.forEach(sub => {
      initialMarks[sub] = existingMarksForExam[sub] !== undefined ? existingMarksForExam[sub] : '';
    });

    setMarksState(initialMarks);
    setTeacherRemarks('');
    setSuccessMessage(null);
  }, [student, selectedExam, isOpen]);

  if (!isOpen || !student) return null;

  const currentExamConfig = EXAM_OPTIONS.find(e => e.id === selectedExam) || EXAM_OPTIONS[3];
  const maxPerSubject = currentExamConfig.max;
  const passPerSubject = currentExamConfig.pass;

  const handleMarkChange = (subject, value) => {
    if (value === '') {
      setMarksState(prev => ({ ...prev, [subject]: '' }));
      return;
    }
    const num = Number(value);
    if (isNaN(num)) return;
    const clamped = Math.max(0, Math.min(maxPerSubject, num));
    setMarksState(prev => ({ ...prev, [subject]: clamped }));
  };

  const subjectEntries = Object.entries(marksState);
  const totalScored = subjectEntries.reduce((sum, [, val]) => sum + (Number(val) || 0), 0);
  const totalMax = subjectEntries.length * maxPerSubject;
  const percentage = totalMax > 0 ? Math.round((totalScored / totalMax) * 100) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const currentExamReports = student.examReports || {};
      const previousMarks = currentExamReports[selectedExam] || {};

      const req = submitMarksApprovalRequest({
        studentId: student.id,
        studentName: student.name,
        hallTicket: student.hallTicket,
        group: student.groupFull || student.group,
        examName: selectedExam,
        marks: marksState,
        previousMarks: previousMarks,
        teacherName: teacher?.name || 'Staff Faculty',
        teacherId: teacher?.id || 'FAC-001',
        remarks: teacherRemarks
      });

      setSuccessMessage(`Marks for ${student.name} (${selectedExam}) submitted successfully! Awaiting Admin verification.`);

      if (onSendAlert) {
        onSendAlert({
          title: "Marks Submitted for Admin Approval",
          message: `${student.name} (${selectedExam}): ${totalScored}/${totalMax} (${percentage}%) marks forwarded to Principal / Admin.`
        });
      }

      if (onSubmitted) {
        onSubmitted(req);
      }

      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      alert('Failed to submit marks. Please try again.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto cursor-pointer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[92dvh] flex flex-col overflow-hidden shadow-2xl border border-slate-300 my-auto cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                  Enter Student Marks (మార్క్స్ నమోదు)
                </h3>
                <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                  Teacher Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Staff: <span className="text-amber-300 font-bold">{teacher?.name || 'Faculty Member'}</span> • Submitted marks will require Admin Approval
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-red-600 text-white flex items-center justify-center transition shadow border border-white/10"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Info Bar */}
        <div className="flex-shrink-0 bg-indigo-50 border-b border-indigo-100 p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Student Name</span>
            <span className="font-black text-indigo-950 text-sm">{student.name}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Hall Ticket / Roll</span>
            <span className="font-mono font-bold text-slate-900">{student.hallTicket}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Stream / Group</span>
            <span className="font-bold text-amber-700">{student.groupFull || student.group}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Admission No</span>
            <span className="font-mono font-bold text-slate-700">{student.admissionNo || 'SJC-2026-001'}</span>
          </div>
        </div>

        {/* Exam Type Selector Tabs */}
        <div className="flex-shrink-0 bg-slate-100 p-2 border-b border-slate-200">
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5 px-1">
            Select Examination / పరీక్ష ఎంచుకోండి:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {EXAM_OPTIONS.map((ex) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => setSelectedExam(ex.id)}
                className={`py-2 px-2.5 text-xs font-bold rounded-xl transition text-center flex flex-col items-center justify-center ${
                  selectedExam === ex.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>{ex.name}</span>
                <span className={`text-[10px] font-semibold ${selectedExam === ex.id ? 'text-indigo-200' : 'text-slate-500'}`}>
                  Max: {ex.max}M (Pass: {ex.pass})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3.5 rounded-2xl flex items-center gap-3 animate-fadeIn">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div className="text-xs font-bold">{successMessage}</div>
            </div>
          )}

          {/* Marks Input Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-slate-800 text-white px-4 py-2.5 flex items-center justify-between text-xs font-bold">
              <span>Subject Breakdown ({subjectEntries.length} Subjects)</span>
              <span className="text-amber-400">Max Marks per Subject: {maxPerSubject}</span>
            </div>
            
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase">
                <tr>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3 text-center w-24">Max Marks</th>
                  <th className="py-2.5 px-3 text-center w-36">Enter Marks</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjectEntries.map(([subject, val], idx) => {
                  const numVal = Number(val);
                  const isPass = !isNaN(numVal) && numVal >= passPerSubject;
                  return (
                    <tr key={subject} className="hover:bg-slate-50/80 transition">
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        {subject}
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-500 font-medium font-mono">
                        {maxPerSubject}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <div className="relative inline-block w-28">
                          <input
                            type="number"
                            min="0"
                            max={maxPerSubject}
                            value={val}
                            onChange={(e) => handleMarkChange(subject, e.target.value)}
                            placeholder="0"
                            required
                            className="w-full text-center font-black text-sm py-1.5 px-2 bg-white border-2 border-indigo-200 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition shadow-inner font-mono text-indigo-950"
                          />
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {val === '' ? (
                          <span className="text-[10px] text-slate-400 font-medium">Pending Entry</span>
                        ) : isPass ? (
                          <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-full">
                            Pass ({numVal >= maxPerSubject * 0.85 ? 'Distinction' : 'Good'})
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-800 font-bold text-[10px] px-2 py-0.5 rounded-full">
                            Fail (&lt; {passPerSubject})
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Quick Summary Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Total Scored</p>
              <p className="text-2xl font-black text-amber-400">
                {totalScored} <span className="text-xs text-slate-400 font-normal">/ {totalMax}</span>
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Overall Percentage</p>
              <p className="text-2xl font-black text-emerald-400">
                {percentage}%
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Result Projection</p>
              <p className="text-sm font-black text-indigo-300">
                {percentage >= 75 ? 'A1 Grade (Distinction)' : percentage >= 60 ? 'A2 Grade (First Class)' : percentage >= 35 ? 'Passed' : 'Needs Improvement'}
              </p>
            </div>
          </div>

          {/* Teacher Remarks / Justification */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Teacher Remarks / Note for Admin (ఉపాధ్యాయుల రిమార్క్స్):
            </label>
            <textarea
              value={teacherRemarks}
              onChange={(e) => setTeacherRemarks(e.target.value)}
              placeholder="e.g. Verified answer sheet. Strong performance in Theory. Recommended for official publication."
              rows={2}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-none transition"
            />
          </div>

          {/* Approval Workflow Notice */}
          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-xl flex items-start gap-2.5 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Two-Step Verification Process:</span> Once you submit, these marks will be queued in the <strong>Admin Portal</strong> for Principal / Administrative verification. After approval, the official <strong>Marks Memo</strong> will be automatically updated and available for students to print or receive via WhatsApp.
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting to Admin...' : 'Submit for Admin Approval (అడ్మిన్ ఆమోదం కోసం పంపండి)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
