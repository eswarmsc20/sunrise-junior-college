import React, { useState, useEffect } from 'react';
import { 
  Award, CheckCircle2, XCircle, Clock, Search, Filter, AlertTriangle, 
  Check, X, Eye, User, FileText, ArrowRight, MessageSquare, ShieldCheck
} from 'lucide-react';
import { 
  getMarksApprovalRequests, 
  approveMarksRequest, 
  rejectMarksRequest,
  getEnrolledStudents
} from '../utils/marksApprovalService';

export default function AdminMarksApprovalSection({ 
  admin, 
  onOpenMarks, 
  onSendAlert, 
  onStudentsUpdated 
}) {
  const [requests, setRequests] = useState(() => getMarksApprovalRequests());
  const [filterStatus, setFilterStatus] = useState('pending'); // 'pending' | 'approved' | 'rejected' | 'all'
  const [searchTerm, setSearchTerm] = useState('');
  const [rejectionNotes, setRejectionNotes] = useState({});
  const [activeRejectId, setActiveRejectId] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const reloadData = () => {
    const updated = getMarksApprovalRequests();
    setRequests(updated);
  };

  useEffect(() => {
    reloadData();
    const handleApprovalUpdate = () => reloadData();
    window.addEventListener('sunrise_marks_approvals_updated', handleApprovalUpdate);
    return () => window.removeEventListener('sunrise_marks_approvals_updated', handleApprovalUpdate);
  }, []);

  const pendingList = requests.filter(r => r.status === 'pending');
  const approvedList = requests.filter(r => r.status === 'approved');
  const rejectedList = requests.filter(r => r.status === 'rejected');

  const filteredRequests = requests.filter(r => {
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      r.studentName?.toLowerCase().includes(term) ||
      r.hallTicket?.toLowerCase().includes(term) ||
      r.teacherName?.toLowerCase().includes(term) ||
      r.examName?.toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  const handleApprove = (req) => {
    setProcessingId(req.id);
    const result = approveMarksRequest(
      req.id, 
      'Approved by Principal & Verified for Official Memo Publication',
      admin?.name || 'Principal Sri Sudarshan Rao'
    );

    if (result.success) {
      reloadData();
      if (onStudentsUpdated) {
        onStudentsUpdated();
      }
      if (onSendAlert) {
        onSendAlert({
          title: "Marks Approved & Published",
          message: `${req.studentName} (${req.examName}) marks approved by Admin. Official Marks Memo updated.`
        });
      }
    } else {
      alert(result.error || 'Failed to approve marks.');
    }
    setProcessingId(null);
  };

  const handleReject = (req) => {
    const note = rejectionNotes[req.id] || 'Please re-verify the marks and resubmit.';
    setProcessingId(req.id);
    const result = rejectMarksRequest(
      req.id,
      note,
      admin?.name || 'Principal Sri Sudarshan Rao'
    );

    if (result.success) {
      setActiveRejectId(null);
      reloadData();
      if (onSendAlert) {
        onSendAlert({
          title: "Marks Request Returned",
          message: `Marks request for ${req.studentName} returned to teacher with note: "${note}"`
        });
      }
    } else {
      alert(result.error || 'Failed to reject marks.');
    }
    setProcessingId(null);
  };

  const handleViewStudentMemo = (studentId, hallTicket) => {
    const students = getEnrolledStudents();
    const found = students.find(s => s.id === studentId || s.hallTicket === hallTicket);
    if (found && onOpenMarks) {
      onOpenMarks(found);
    } else {
      alert('Student record not found in database.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Verification Workflow
            </span>
            <span className="text-xs text-slate-500 font-semibold">Teacher Submissions → Admin Approval</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-indigo-600" />
            <span>Marks Approval & Verification Suite (మార్క్స్ ఆమోదం)</span>
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Review marks entered by teachers for Unit Tests, Quarterly, and Half-Yearly exams before publishing them to the official Marks Memo.
          </p>
        </div>

        {/* Quick Counts Badges */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex-1 md:flex-none text-center min-w-[100px]">
            <span className="block text-2xl font-black text-amber-600 leading-none">{pendingList.length}</span>
            <span className="text-[10px] font-bold text-amber-900 uppercase">Pending Review</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex-1 md:flex-none text-center min-w-[100px]">
            <span className="block text-2xl font-black text-emerald-600 leading-none">{approvedList.length}</span>
            <span className="text-[10px] font-bold text-emerald-900 uppercase">Approved</span>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3 flex-1 md:flex-none text-center min-w-[100px]">
            <span className="block text-2xl font-black text-red-600 leading-none">{rejectedList.length}</span>
            <span className="text-[10px] font-bold text-red-900 uppercase">Returned</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: 'pending', label: 'Pending Approvals', count: pendingList.length, color: 'amber' },
            { id: 'approved', label: 'Approved History', count: approvedList.length, color: 'emerald' },
            { id: 'rejected', label: 'Returned', count: rejectedList.length, color: 'red' },
            { id: 'all', label: 'All Requests', count: requests.length, color: 'indigo' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${
                filterStatus === tab.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                filterStatus === tab.id ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-800'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by student, hall ticket, teacher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 transition"
          />
        </div>
      </div>

      {/* List of Requests */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No {filterStatus} marks approval requests found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {filterStatus === 'pending'
              ? 'Great news! All marks entered by teachers have been reviewed and processed.'
              : 'Try changing the filter or search keyword to view other submissions.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const marksEntries = Object.entries(req.marks || {});
            const isUT = req.examName?.includes('25M');
            const maxPerSub = isUT ? 25 : 100;
            const totalScored = marksEntries.reduce((sum, [, val]) => sum + (Number(val) || 0), 0);
            const totalMax = marksEntries.length * maxPerSub;
            const percentage = totalMax > 0 ? Math.round((totalScored / totalMax) * 100) : 0;

            const isPending = req.status === 'pending';
            const isApproved = req.status === 'approved';
            const isRejected = req.status === 'rejected';

            return (
              <div 
                key={req.id} 
                className={`bg-white rounded-3xl border shadow-sm overflow-hidden transition ${
                  isPending ? 'border-amber-300 ring-2 ring-amber-100' : isApproved ? 'border-emerald-200' : 'border-red-200'
                }`}
              >
                {/* Request Header Banner */}
                <div className={`p-4 flex flex-wrap items-center justify-between gap-3 text-xs ${
                  isPending ? 'bg-amber-50/70 border-b border-amber-200' : isApproved ? 'bg-emerald-50/60 border-b border-emerald-100' : 'bg-red-50/60 border-b border-red-100'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${
                      isPending ? 'bg-amber-500 text-slate-950' : isApproved ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      {isPending ? <Clock className="w-5 h-5" /> : isApproved ? <Check className="w-5 h-5 stroke-[3]" /> : <X className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-700">{req.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isPending ? 'bg-amber-200 text-amber-900' : isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {isPending ? 'Pending Verification' : isApproved ? 'Approved & Published' : 'Returned to Faculty'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Submitted by: <strong className="text-slate-800">{req.teacherName}</strong> on {req.submittedAt}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Examination</span>
                    <span className="font-black text-indigo-950 text-sm">{req.examName}</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-4">
                  {/* Student Details Grid */}
                  <div className="bg-slate-50 rounded-2xl p-3.5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border border-slate-200">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Student Name</span>
                      <strong className="text-slate-950 text-sm">{req.studentName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Hall Ticket</span>
                      <strong className="font-mono text-indigo-900">{req.hallTicket}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Stream</span>
                      <strong className="text-amber-800">{req.group}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Score</span>
                      <strong className="text-emerald-700 text-sm font-black">
                        {totalScored} / {totalMax} ({percentage}%)
                      </strong>
                    </div>
                  </div>

                  {/* Marks Comparison Table */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700 uppercase">
                        <tr>
                          <th className="py-2 px-3">Subject</th>
                          <th className="py-2 px-3 text-center w-28">Max Marks</th>
                          <th className="py-2 px-3 text-center w-32">Previous Mark</th>
                          <th className="py-2 px-3 text-center w-36">Teacher Submitted Mark</th>
                          <th className="py-2 px-3 text-right">Difference</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {marksEntries.map(([subject, newMark]) => {
                          const prevMark = req.previousMarks?.[subject] !== undefined ? req.previousMarks[subject] : '—';
                          const diff = prevMark !== '—' ? Number(newMark) - Number(prevMark) : null;
                          return (
                            <tr key={subject} className="hover:bg-slate-50/50">
                              <td className="py-2 px-3 font-bold text-slate-900">{subject}</td>
                              <td className="py-2 px-3 text-center text-slate-500 font-mono">{maxPerSub}</td>
                              <td className="py-2 px-3 text-center font-mono text-slate-600">{prevMark}</td>
                              <td className="py-2 px-3 text-center font-mono font-black text-indigo-900 bg-indigo-50/40 text-sm">
                                {newMark}
                              </td>
                              <td className="py-2 px-3 text-right font-mono font-bold">
                                {diff === null ? (
                                  <span className="text-slate-400">New Entry</span>
                                ) : diff > 0 ? (
                                  <span className="text-emerald-600">+{diff}</span>
                                ) : diff < 0 ? (
                                  <span className="text-red-600">{diff}</span>
                                ) : (
                                  <span className="text-slate-400">0 (Unchanged)</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Teacher Remarks & Admin Audit Trail */}
                  <div className="flex flex-col sm:flex-row gap-3 text-xs">
                    {req.teacherRemarks && (
                      <div className="flex-1 bg-indigo-50/60 border border-indigo-100 rounded-xl p-3">
                        <span className="text-indigo-900 font-bold block mb-0.5">Faculty Remarks:</span>
                        <p className="text-slate-700 italic">"{req.teacherRemarks}"</p>
                      </div>
                    )}
                    {req.adminRemarks && (
                      <div className={`flex-1 rounded-xl p-3 border ${
                        isApproved ? 'bg-emerald-50/60 border-emerald-100 text-emerald-950' : 'bg-red-50/60 border-red-100 text-red-950'
                      }`}>
                        <span className="font-bold block mb-0.5">
                          {isApproved ? 'Admin Approval Note:' : 'Rejection Reason:'}
                        </span>
                        <p className="italic">"{req.adminRemarks}"</p>
                        <span className="block text-[10px] text-slate-500 mt-1">
                          By {req.actionBy} on {req.actionTakenAt}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Inline Rejection Box */}
                  {activeRejectId === req.id && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-2 animate-fadeIn">
                      <label className="block text-xs font-bold text-red-900">
                        Specify Reason for Returning to Teacher (తిరస్కరణ కారణం):
                      </label>
                      <textarea
                        value={rejectionNotes[req.id] || ''}
                        onChange={(e) => setRejectionNotes({ ...rejectionNotes, [req.id]: e.target.value })}
                        placeholder="e.g. Please re-check Botany theory marks as per answer script."
                        rows={2}
                        className="w-full text-xs p-2 bg-white border border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200"
                      />
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => setActiveRejectId(null)}
                          className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleReject(req)}
                          disabled={processingId === req.id}
                          className="px-4 py-1.5 text-xs font-black bg-red-600 hover:bg-red-700 text-white rounded-lg shadow"
                        >
                          Confirm Return to Teacher
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Controls */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                    <button
                      onClick={() => handleViewStudentMemo(req.studentId, req.hallTicket)}
                      className="bg-slate-100 hover:bg-indigo-50 text-indigo-900 font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Preview Official Marks Memo</span>
                    </button>

                    {isPending && activeRejectId !== req.id && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveRejectId(req.id)}
                          disabled={processingId === req.id}
                          className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Return / Reject</span>
                        </button>

                        <button
                          onClick={() => handleApprove(req)}
                          disabled={processingId === req.id}
                          className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs px-5 py-2 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{processingId === req.id ? 'Approving...' : 'Approve & Publish to Marks Memo (ఆమోదించు)'}</span>
                        </button>
                      </div>
                    )}

                    {isApproved && (
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Live on Student Memo • Ready for WhatsApp & Print</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
