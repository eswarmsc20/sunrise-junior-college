import React from 'react';
import { Home, Award, Camera, CreditCard, LogIn, UserCircle } from 'lucide-react';

export default function MobileBottomNav({ 
  currentPortal, 
  onGoHome, 
  onOpenExamPortal, 
  onOpenBiometric, 
  onOpenPayment, 
  onOpenLogin,
  onLogout 
}) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 text-white md:hidden shadow-2xl safe-area-pb">
      <div className="grid grid-cols-5 items-center justify-around h-16 px-1">
        
        {/* 1. Home */}
        <button
          onClick={onGoHome}
          className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-amber-400 active:scale-95 transition"
        >
          <Home className="w-5 h-5 text-amber-400" />
          <span className="text-[10px] font-bold">Home</span>
        </button>

        {/* 2. Exam Portal */}
        <button
          onClick={onOpenExamPortal}
          className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-indigo-400 active:scale-95 transition"
        >
          <Award className="w-5 h-5 text-indigo-400" />
          <span className="text-[10px] font-bold">Exam</span>
        </button>

        {/* 3. Face Biometric (Center Highlighted) */}
        <button
          onClick={onOpenBiometric}
          className="flex flex-col items-center justify-center -mt-5"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 text-white flex items-center justify-center shadow-lg border-2 border-slate-950 active:scale-95 transition">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <span className="text-[9px] font-extrabold text-cyan-300 mt-1">Biometric</span>
        </button>

        {/* 4. Pay Fee */}
        <button
          onClick={onOpenPayment}
          className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-emerald-400 active:scale-95 transition"
        >
          <CreditCard className="w-5 h-5 text-emerald-400" />
          <span className="text-[10px] font-bold">Fee Pay</span>
        </button>

        {/* 5. Login or User Portal */}
        {currentPortal ? (
          <button
            onClick={onLogout}
            className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-red-400 active:scale-95 transition"
          >
            <UserCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-300">Exit</span>
          </button>
        ) : (
          <button
            onClick={onOpenLogin}
            className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-amber-400 active:scale-95 transition"
          >
            <LogIn className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] font-bold">Login</span>
          </button>
        )}

      </div>
    </nav>
  );
}
