import React, { useState } from 'react';
import { 
  User, KeyRound, ShieldCheck, GraduationCap, School, ArrowRight, 
  Sparkles, Globe, Lock, Eye, EyeOff, PhoneCall
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
        setError('Student Hall Ticket or Phone not found. Try Demo: 2601089001');
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
    <div className="relative min-h-[100dvh] w-full bg-gradient-to-b from-[#020617] via-[#091838] to-[#030816] text-white flex flex-col items-center justify-center p-3 sm:p-6 overflow-y-auto overflow-x-hidden">
      
      {/* Ambient background glows safely confined to viewport */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm sm:max-w-md mx-auto my-auto flex flex-col items-center space-y-4">
        
        {/* Brand Header with Clean Non-Overlapping Logo */}
        <div className="text-center space-y-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-white p-0.5 shadow-2xl border-2 border-amber-400 mx-auto">
            <img 
              src="./assets/sunrise_official_logo.png" 
              alt="Sunrise Junior College Crest" 
              className="w-full h-full object-contain"
            />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase drop-shadow">
              SUNRISE <span className="text-amber-400">JUNIOR COLLEGE</span>
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-300 font-medium">
              Day & Night Junction, Srikakulam • Code: 01089
            </p>
          </div>
        </div>

        {/* Navy Blue Card (Responsive & Clean Fit) */}
        <div className="w-full bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4">
          
          {/* Role Tabs */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 text-center">
              Select Login Role
            </label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950/80 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 ${
                  role === 'student'
                    ? 'bg-amber-500 text-slate-950 shadow font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('teacher')}
                className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 ${
                  role === 'teacher'
                    ? 'bg-blue-600 text-white shadow font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <School className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Faculty</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 ${
                  role === 'admin'
                    ? 'bg-purple-600 text-white shadow font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-3.5">
            {error && (
              <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-semibold text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                {role === 'student' && 'Hall Ticket / Admission No / Mobile'}
                {role === 'teacher' && 'Faculty ID (e.g. TCH101)'}
                {role === 'admin' && 'Admin Username (e.g. admin)'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Password / PIN
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-700 rounded-xl py-2.5 pl-9 pr-9 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Demo Chip */}
            <div className="bg-slate-950/60 py-1.5 px-3 rounded-lg border border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Demo ID: <strong className="text-amber-400 font-mono">{identifier}</strong></span>
              <span>PIN: <strong className="text-slate-300 font-mono">{password}</strong></span>
            </div>

            {/* Login Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3 px-4 rounded-xl text-xs sm:text-sm transition shadow-lg shadow-amber-500/20 active:scale-98 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Sign In to Institutional Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center pt-1">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider absolute">
              Or Explore As Guest
            </span>
          </div>

          {/* Public Home Navigation */}
          <button
            type="button"
            onClick={onContinueToHome}
            className="w-full bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Globe className="w-4 h-4 text-blue-400" />
            <span>Continue to College Website (Home) →</span>
          </button>
        </div>

        {/* Footer Helpline */}
        <div className="text-center text-[10px] sm:text-[11px] text-slate-400 space-y-0.5">
          <p>© 2026 Sunrise Junior College • Srikakulam</p>
          <p className="flex items-center justify-center gap-1.5">
            <PhoneCall className="w-3 h-3 text-amber-400" />
            <span>Admissions Desk:</span>
            <a href="tel:8143217785" className="text-amber-400 font-bold hover:underline">8143217785</a>
            <span>•</span>
            <a href="tel:7893505185" className="text-amber-400 font-bold hover:underline">7893505185</a>
          </p>
        </div>

      </div>
    </div>
  );
}
