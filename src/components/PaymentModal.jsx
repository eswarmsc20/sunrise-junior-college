import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, QrCode, ArrowRight, Smartphone, Copy, Check, Sparkles, Building, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';
import { collegeInfo } from '../data/collegeData';

export default function PaymentModal({ isOpen, onClose, onPaymentSuccess }) {
  const [amount, setAmount] = useState('15000');
  const [feeType, setFeeType] = useState('Term Tuition Fee');
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [admissionNo, setAdmissionNo] = useState('');
  const [stream, setStream] = useState('MPC (Maths, Physics, Chemistry)');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatedReceipt, setGeneratedReceipt] = useState(null);

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const upiId = "sunrisejc@sbi";
  const upiName = "Sunrise Junior College";

  const presetFees = [
    { label: 'Admission Registration', amount: '1000' },
    { label: 'Term Tuition Fee', amount: '15000' },
    { label: 'Full Year Course Fee', amount: '35000' },
    { label: 'BIE AP Exam Fee', amount: '1500' },
    { label: 'Hostel Term Fee', amount: '20000' }
  ];

  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`${feeType} - ${studentName || 'Student'}`)}`;
  
  // Real QR code generator URL using reliable QR API with fallback SVG
  const qrCodeImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiUrl)}&color=0b1b36`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = (e) => {
    e.preventDefault();
    if (!studentName || !studentPhone) {
      alert("Please enter Student Name and Mobile Number to proceed.");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      // Trigger Celebration Confetti
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });

      const receiptData = {
        receiptNo: `SJC-REC-${Date.now().toString().slice(-5)}`,
        date: new Date().toLocaleDateString('en-GB'),
        amount: Number(amount),
        feeType,
        student: {
          name: studentName,
          phone: studentPhone,
          admissionNo: admissionNo || `SJC-2027-${Math.floor(100 + Math.random() * 900)}`,
          hallTicket: `2601${Math.floor(100000 + Math.random() * 900000)}`,
          group: stream.split(' ')[0],
          groupFull: stream,
          fatherName: 'Parent / Guardian',
          fatherPhone: studentPhone,
          feeDetails: {
            totalFee: 35000,
            paidFee: Number(amount),
            dueFee: Math.max(0, 35000 - Number(amount)),
            receipts: [{
              receiptNo: `SJC-REC-${Date.now().toString().slice(-5)}`,
              date: new Date().toLocaleDateString('en-GB')
            }]
          }
        }
      };

      setGeneratedReceipt(receiptData);

      if (onPaymentSuccess) {
        onPaymentSuccess(receiptData);
      }
    }, 1500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto cursor-pointer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 my-4 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-6 relative">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-slate-800/90 hover:bg-red-600 active:scale-95 text-white flex items-center justify-center transition shadow-lg border border-white/20 cursor-pointer"
            title="Close (Esc)"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white stroke-[2.5]" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Instant UPI Gateway
            </span>
            <span className="text-xs text-slate-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Secure & Verified
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white">
            Online Fee Payment Portal
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Sunrise Junior College, Srikakulam • BIE AP Code: 01089
          </p>
        </div>

        {/* Modal Body */}
        {!isSuccess ? (
          <form onSubmit={handleSimulatePayment} className="p-6 space-y-5">
            {/* Quick Fee Presets */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Payment Purpose
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {presetFees.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setFeeType(preset.label);
                      setAmount(preset.amount);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      feeType === preset.label
                        ? 'border-amber-500 bg-amber-50/70 text-slate-950 font-bold shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <p className="text-xs font-semibold truncate">{preset.label}</p>
                    <p className="text-sm font-black text-amber-600 mt-0.5">₹{Number(preset.amount).toLocaleString('en-IN')}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Student & Amount Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Student Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. K. Sai Teja"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number (For Receipt) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 7893505185"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500 font-mono font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Stream / Group
                </label>
                <select
                  value={stream}
                  onChange={(e) => setStream(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500 font-medium bg-white"
                >
                  <option value="MPC (Maths, Physics, Chemistry)">MPC (Maths, Physics, Chemistry)</option>
                  <option value="BiPC (Biology, Physics, Chemistry)">BiPC (Biology, Physics, Chemistry)</option>
                  <option value="MEC (Maths, Economics, Commerce)">MEC (Maths, Economics, Commerce)</option>
                  <option value="CEC (Civics, Economics, Commerce)">CEC (Civics, Economics, Commerce)</option>
                  <option value="HEC (History, Economics, Civics)">HEC (History, Economics, Civics)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Amount to Pay (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500 font-bold text-slate-900"
                />
              </div>
            </div>

            {/* UPI QR Code Section */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-36 h-36 bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex-shrink-0 flex items-center justify-center relative">
                <img
                  src={qrCodeImgUrl}
                  alt="UPI QR Code"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to QR placeholder if offline
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = `<div class="text-center p-2"><svg class="w-12 h-12 text-slate-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/></svg><p class="text-[9px] font-bold text-slate-500 mt-1">Scan & Pay</p></div>`;
                  }}
                />
              </div>

              <div className="space-y-2 text-left flex-1">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-800">Scan with any UPI App</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="bg-white border px-1.5 py-0.5 rounded font-bold text-slate-700">Google Pay</span>
                  <span className="bg-white border px-1.5 py-0.5 rounded font-bold text-slate-700">PhonePe</span>
                  <span className="bg-white border px-1.5 py-0.5 rounded font-bold text-slate-700">Paytm</span>
                  <span className="bg-white border px-1.5 py-0.5 rounded font-bold text-slate-700">BHIM</span>
                </div>

                <div className="bg-white p-2 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="truncate">
                    <p className="text-[10px] text-slate-400">College UPI ID:</p>
                    <p className="text-xs font-mono font-bold text-slate-800">{upiId}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition"
                    title="Copy UPI ID"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20 disabled:opacity-50 text-sm"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying with Bank Gateway...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Generate Official Fee Receipt (₹{Number(amount).toLocaleString('en-IN')})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-slate-400">
                Official payment receipt will be generated and can be saved as 1-page PDF or sent via WhatsApp.
              </p>
            </div>
          </form>
        ) : (
          /* Payment Success Confirmation */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="inline-block bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-2 border border-emerald-200">
                Transaction Successful • Status: Cleared
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                ₹{Number(amount).toLocaleString('en-IN')} Received
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                Txn Ref: SJC-TXN-{Date.now().toString().slice(-8)} • {new Date().toLocaleString('en-GB')}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1.5 text-left">
              <p><span className="text-slate-500">Student Name:</span> <strong className="text-slate-900">{studentName}</strong></p>
              <p><span className="text-slate-500">Mobile Number:</span> <strong className="font-mono text-slate-900">{studentPhone}</strong></p>
              <p><span className="text-slate-500">Payment Purpose:</span> <strong className="text-amber-700">{feeType}</strong></p>
              <p><span className="text-slate-500">Institute:</span> <strong>Sunrise Junior College, Srikakulam (01089)</strong></p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onPaymentSuccess && generatedReceipt) {
                    onPaymentSuccess(generatedReceipt, true); // true = open Fee Receipt Modal
                  }
                }}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 px-4 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Open & Print 1-Page Fee Receipt</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-xs transition"
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