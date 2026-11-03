import React, { useRef } from 'react';
import { X, Printer, Send, MessageSquare, CheckCircle, ShieldCheck, Download } from 'lucide-react';
import { collegeInfo } from '../data/collegeData';
import { createWhatsAppLink } from '../utils/geoUtils';

export default function FeeReceiptModal({ isOpen, onClose, student, onSendAlert }) {
  if (!isOpen || !student) return null;

  const fee = student.feeDetails || {
    totalFee: 35000,
    paidFee: 25000,
    dueFee: 10000,
    receipts: [{ receiptNo: 'REC-2026-0001', date: new Date().toLocaleDateString('en-GB') }]
  };

  const receiptNo = fee.receipts?.[0]?.receiptNo || `SJC-REC-${Date.now().toString().slice(-4)}`;
  const receiptDate = fee.receipts?.[0]?.date || new Date().toLocaleDateString('en-GB');

  const handlePrint = () => {
    window.print();
  };

  const receiptMessage = `*SUNRISE JUNIOR COLLEGE, SRIKAKULAM*
(BIE AP Code: 01089)
Official Fee Receipt Acknowledgement:
------------------------------------
• Receipt No: ${receiptNo}
• Student Name: ${student.name}
• Admission No: ${student.admissionNo || 'SJC-2026-001'}
• Group: ${student.groupFull || student.group}
• Father Name: ${student.fatherName || 'Guardian'}
• Amount Paid: Rs. ${fee.paidFee.toLocaleString('en-IN')}
• Balance Due: Rs. ${fee.dueFee.toLocaleString('en-IN')}
• Date: ${receiptDate}
------------------------------------
Thank you for your payment. Keep this receipt for your records.
Principal Desk: 8143217785`;

  const studentWhatsApp = createWhatsAppLink(student.phone, receiptMessage);
  const fatherWhatsApp = createWhatsAppLink(student.fatherPhone || student.phone, receiptMessage);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto print-modal-container">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-300 my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden from Print) */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
              Official Fee Receipt
            </span>
            <span className="text-xs text-slate-300">Receipt No: {receiptNo}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save 1-Page PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper (Fits EXACTLY on 1 Single A4 Page) */}
        <div className="printable-receipt-card p-6 bg-white text-slate-900">
          
          {/* Institutional Header */}
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
              <span>RC No. 652995/E2-3/2008-09</span>
              <span>•</span>
              <span>Phone: 8143217785 / 7989285425</span>
            </div>

            <div className="inline-block bg-slate-900 text-white text-[11px] font-black px-4 py-0.5 rounded-full uppercase tracking-wider mt-1.5 receipt-badge">
              Fee Collection Receipt (Student & Parent Copy)
            </div>
          </div>

          {/* Student & Parent Metadata (Compact 2-Column Grid) */}
          <div className="grid grid-cols-2 gap-4 py-2.5 text-xs border-b border-slate-200">
            <div className="space-y-1">
              <p><span className="text-slate-500">Receipt No:</span> <strong className="font-mono text-slate-900">{receiptNo}</strong></p>
              <p><span className="text-slate-500">Admission No:</span> <strong className="font-mono text-indigo-700">{student.admissionNo || 'SJC-2026-001'}</strong></p>
              <p><span className="text-slate-500">Hall Ticket / Roll:</span> <strong className="font-mono text-slate-900">{student.hallTicket}</strong></p>
              <p><span className="text-slate-500">Stream / Group:</span> <strong>{student.groupFull || student.group}</strong></p>
            </div>
            <div className="text-right space-y-1">
              <p><span className="text-slate-500">Date:</span> <strong>{receiptDate}</strong></p>
              <p><span className="text-slate-500">Student Name:</span> <strong className="text-slate-950 uppercase">{student.name}</strong></p>
              <p><span className="text-slate-500">Father / Guardian:</span> <strong>{student.fatherName || 'Parent'}</strong></p>
              <p><span className="text-slate-500">Student Mobile:</span> <strong className="font-mono">{student.phone}</strong></p>
            </div>
          </div>

          {/* Compact Fee Particulars Table */}
          <div className="py-2.5">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700 uppercase">
                <tr>
                  <th className="py-1.5 px-3 w-8">#</th>
                  <th className="py-1.5 px-3">Fee Particulars & Description</th>
                  <th className="py-1.5 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-1.5 px-3 text-center">1</td>
                  <td className="py-1.5 px-3 font-medium">Intermediate Academic Tuition & Coaching Fee</td>
                  <td className="py-1.5 px-3 text-right font-medium">₹ {(fee.totalFee * 0.65).toFixed(0)}</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 text-center">2</td>
                  <td className="py-1.5 px-3 font-medium">Science Laboratories & Library Maintenance Fee</td>
                  <td className="py-1.5 px-3 text-right font-medium">₹ {(fee.totalFee * 0.20).toFixed(0)}</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 text-center">3</td>
                  <td className="py-1.5 px-3 font-medium">BIE AP Board Examination & Model Papers Assessment</td>
                  <td className="py-1.5 px-3 text-right font-medium">₹ {(fee.totalFee * 0.15).toFixed(0)}</td>
                </tr>
                {student.isHostel && (
                  <tr>
                    <td className="py-1.5 px-3 text-center">4</td>
                    <td className="py-1.5 px-3 font-medium">Residential Hostel & Food Charges (Term-1)</td>
                    <td className="py-1.5 px-3 text-right font-medium">Included in Hostel Fee</td>
                  </tr>
                )}
                <tr className="bg-slate-50 font-bold border-t border-slate-300">
                  <td colSpan="2" className="py-1.5 px-3 text-right">Total Prescribed Fee:</td>
                  <td className="py-1.5 px-3 text-right text-slate-900">₹ {fee.totalFee.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="bg-emerald-50/70 font-bold border-t border-slate-300">
                  <td colSpan="2" className="py-2 px-3 text-right text-emerald-950 font-black">Total Amount Received (Paid):</td>
                  <td className="py-2 px-3 text-right text-sm font-black text-emerald-800">₹ {fee.paidFee.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td colSpan="2" className="py-1.5 px-3 text-right text-slate-600">Balance Due:</td>
                  <td className="py-1.5 px-3 text-right text-slate-900">₹ {fee.dueFee.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment Mode, Instructions & Signature Seal */}
          <div className="pt-2 flex items-end justify-between text-xs">
            <div className="space-y-0.5 text-[11px]">
              <p className="text-slate-600">Payment Mode: <strong>UPI / Bank Transfer / Cash</strong></p>
              <p className="text-slate-600">Father Mobile: <strong className="font-mono">{student.fatherPhone || student.phone}</strong></p>
              <p className="text-[10px] text-slate-400 italic pt-0.5">Note: Fees once paid is non-refundable. Official system-generated receipt.</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-10 border border-dashed border-slate-400 rounded flex items-center justify-center text-[9px] text-slate-400 font-bold uppercase mx-auto">
                College Seal
              </div>
              <p className="font-black text-slate-900 text-xs mt-1">Authorized Signatory</p>
              <p className="text-[9px] text-slate-500">Sunrise Junior College, Srikakulam</p>
            </div>
          </div>

        </div>

        {/* WhatsApp & SMS Notification Dispatch Buttons (Hidden from Print) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 no-print space-y-3">
          <p className="text-xs font-bold text-slate-700">
            Send Instant Fee Receipt Notification (WhatsApp / Message):
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
                    title: "Fee Receipt Dispatched",
                    message: `Fee Receipt #${receiptNo} for Rs. ${fee.paidFee} successfully dispatched via SMS & WhatsApp to Student (${student.phone}) and Father (${student.fatherPhone || student.phone}).`
                  });
                }
              }}
              className="text-xs font-bold text-slate-700 hover:text-slate-950 underline"
            >
              Simulate Instant SMS Gateways (Send to Both)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
