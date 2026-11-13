import React, { useState } from 'react';
import { 
  User, KeyRound, ShieldCheck, GraduationCap, School, ArrowRight, 
  Sparkles, Globe, CreditCard, Award, Camera, Phone, Lock, Eye, EyeOff
} from 'lucide-react';
import studentsData from '../data/studentsData.json';
import teachersData from '../data/teachersData.json';

export default function LoginPage({ 
  onLoginSuccess, 
  onContinueToHome, 
  onOpenExamPortal, 
  onOpenBiometric, 
  onOpenPayment 
}) {
  const [role, setRole] = useState('student'); // 'student' | 'teacher' | 'admin'
  const [identifier, setIdentifier] = useState('2601089001');
  const [password, setPassword] = useState('student123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError('');
    if (newRole === 'student') {
      setIdentifier('2601089001'); // Nakka Reshma
      setPassword('student123');
    } else if (newRole === 'teacher') {
      setIdentifier('TCH101'); // Sri K. Ramanjaneyulu
      setPassword('teacher123');
    } else {
      setIdentifier('admin');
      setPassword('admin123');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (role === 'student') {
      const student = studentsData.find(s => s.hallTicket === identifier || s.phone === identifier || s.admissionNo === identifier);
      if (student || identifier === '2601089001') {
        const found = student || studentsData[0];
        onLoginSuccess({
          role: 'student',
          data: found
        });
      } else {
        setError('Student Hall Ticket or Phone not found. Try Demo ID: 2601089001');
      }
    } else if (role === 'teacher') {
      const teacher = teachersData.find(t => t.id === identifier || t.phone === identifier);
      onLoginSuccess({
        role: 'teacher',
        data: teacher || {
          name: 'Senior Lecturer Sri K. Ramanjaneyulu',
          department: 'Senior Physics & HOD',
          id: identifier || 'TCH101'
        }
      });
    } else if (role === 'admin') {
      if (identifier) {
        onLoginSuccess({
          role: 'admin',
          data: {
            name: 'Principal Sri Andhavarapu Sudarshan Rao',
            role: 'Campus Administrator',
            id: identifier || 'ADMIN'
          }
        });
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#030712] via-[#091738] to-[#020510] text-white flex flex-col justify-between px-4 py-8 relative overflow-x-hidden selection:bg-amber-400 selection:text-slate-950">
      
      {/* Ambient background glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Official Crest */}
      <div className="relative z-10 max-w-md mx-auto w-full text-center space-y-3 pt-2">
        <div className="relative inline-block mx-auto group">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-white p-1 shadow-2xl border-2 border-amber-400 mx-auto transition-transform group-hover:scale-105 duration-300">
            <img 
              src="./assets/sunrise_official_logo.png" 
              alt="Sunrise Junior College Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
            BIE AP: 01089
          </span>
        </div>

        <div className="pt-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase drop-shadow-md">
            SUNRISE <span className="text-amber-400">JUNIOR COLLEGE</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Day & Night Junction, Srikakulam – 532001
          </p>
          <p className="text-[11px] text-amber-300/80 font-bold tracking-wider uppercase mt-0.5">
            Institutional Mobile & Web ERP Portal
          </p>
        </div>
      </div>

      {/* Main Login Card in Gradient Navy Blue */}
      <div className="relative z-10 max-w-md mx-auto w-full my-6 bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
        
        {/* Role Selector Tabs */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
            Select Your Account Type
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/70 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`py-2 px-1 text-xs font-bold rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
                role === 'student'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('teacher')}
              className={`py-2 px-1 text-xs font-bold rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
                role === 'teacher'
                  ? 'bg-blue-600 text-white shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              <span>Faculty</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`py-2 px-1 text-xs font-bold rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
                role === 'admin'
                  ? 'bg-purple-600 text-white shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {role === 'student' && 'Hall Ticket No / Admission No / Mobile'}
              {role === 'teacher' && 'Faculty ID (e.g., TCH101)'}
              {role === 'admin' && 'Admin Username (e.g., admin)'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  role === 'student' ? '2601089001' : role === 'teacher' ? 'TCH101' : 'admin'
                }
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl py-3 pl-10 pr-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Secret Password / PIN
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl py-3 pl-10 pr-10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Demo Credentials Info */}
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Demo: <strong className="text-amber-400 font-mono">{identifier}</strong></span>
            <span>Pass: <strong className="text-slate-300 font-mono">{password}</strong></span>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3.5 px-4 rounded-xl text-sm transition shadow-lg shadow-amber-500/20 active:scale-98 flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>Sign In to Institutional Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider with or explore */}
        <div className="relative flex items-center justify-center py-1">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider absolute">
            Or Explore College
          </span>
        </div>

        {/* Prominent Action to Continue to Home Page */}
        <button
          type="button"
          onClick={onContinueToHome}
          className="w-full bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm"
        >
          <Globe className="w-4 h-4 text-blue-400" />
          <span>Continue to Public College Website →</span>
        </button>

        {/* Quick Utility Feature Shortcuts */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            onClick={onOpenExamPortal}
            className="bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-700/50 p-2 rounded-xl text-center transition flex flex-col items-center justify-center gap-1"
          >
            <Award className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] font-bold text-indigo-200">Exam Portal</span>
          </button>

          <button
            type="button"
            onClick={onOpenBiometric}
            className="bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-700/50 p-2 rounded-xl text-center transition flex flex-col items-center justify-center gap-1"
          >
            <Camera className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] font-bold text-cyan-200">Face Scan</span>
          </button>

          <button
            type="button"
            onClick={onOpenPayment}
            className="bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700/50 p-2 rounded-xl text-center transition flex flex-col items-center justify-center gap-1"
          >
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-200">Fee Pay</span>
          </button>
        </div>

      </div>

      {/* Footer Info */}
      <div className="relative z-10 text-center text-[11px] text-slate-400 space-y-1">
        <p>© 2026 Sunrise Educational Society • BIE AP Code: 01089</p>
        <p className="flex items-center justify-center gap-2">
          <span>Principal Helpline:</span>
          <a href="tel:8143217785" className="text-amber-400 font-bold hover:underline">
            8143217785
          </a>
          <span>•</span>
          <a href="tel:7893505185" className="text-amber-400 font-bold hover:underline">
            7893505185
          </a>
        </p>
      </div>

    </div>
  );
}
