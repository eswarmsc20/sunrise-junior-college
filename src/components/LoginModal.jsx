import React, { useState } from 'react';
import { X, User, KeyRound, ShieldCheck, GraduationCap, School, ArrowRight, Sparkles } from 'lucide-react';
import studentsData from '../data/studentsData.json';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, onOpenEnrollment }) {
  const [role, setRole] = useState('student'); // 'student' | 'teacher' | 'admin'
  const [identifier, setIdentifier] = useState('2601089001');
  const [password, setPassword] = useState('pass123');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError('');
    if (newRole === 'student') {
      setIdentifier('2601089001'); // Nakka Reshma
      setPassword('student123');
    } else if (newRole === 'teacher') {
      setIdentifier('TCH101');
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
      // Find student in data
      const student = studentsData.find(s => s.hallTicket === identifier || s.phone === identifier);
      if (student || identifier === '2601089001') {
        const found = student || studentsData[0];
        onLoginSuccess({
          role: 'student',
          data: found
        });
      } else {
        setError('Student Hall Ticket or Phone not found. Try demo ID: 2601089001');
      }
    } else if (role === 'teacher') {
      if (identifier) {
        onLoginSuccess({
          role: 'teacher',
          data: {
            name: 'Senior Lecturer Sri K. Ramanjaneyulu',
            department: 'Senior Physics & Dean',
            id: identifier
          }
        });
      }
    } else if (role === 'admin') {
      if (identifier) {
        onLoginSuccess({
          role: 'admin',
          data: {
            name: 'Principal / Admin Office',
            role: 'Campus Administrator',
            id: identifier
          }
        });
      }
    }
  };

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 cursor-default my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white relative shadow-md">
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

          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/20 px-2 py-0.5 rounded">
              BIE Code: 01089
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-white">Sunrise College Portal</h3>
          <p className="text-xs text-slate-300 mt-1">Sign in to your dedicated institutional portal</p>
        </div>

        {/* Role Tabs */}
        <div className="grid grid-cols-3 p-2 bg-slate-100 border-b border-slate-200">
          <button
            type="button"
            onClick={() => handleRoleChange('student')}
            className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              role === 'student' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-amber-600" />
            <span>Student</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('teacher')}
            className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              role === 'teacher' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <School className="w-4 h-4 text-blue-600" />
            <span>Teacher</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              role === 'admin' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Admin</span>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {role === 'student' ? 'Student Hall Ticket / Roll Number' : (role === 'teacher' ? 'Faculty ID' : 'Administrator ID')}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Security Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Quick Demo Pre-Fill Helper */}
          <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-[11px] text-amber-900 flex items-center justify-between">
            <span><strong>Demo One-Click Login</strong> is enabled.</span>
            <button
              type="button"
              onClick={() => handleRoleChange(role)}
              className="text-amber-800 font-bold underline hover:text-amber-950"
            >
              Reset Credentials
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl shadow transition flex items-center justify-center gap-1.5"
          >
            <span>Sign In to {role.toUpperCase()} Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="pt-2 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 mb-1.5">New to Sunrise Junior College?</p>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenEnrollment) onOpenEnrollment();
              }}
              className="text-xs font-black text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-4 py-2 rounded-xl transition inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Enroll New Student or Register Teacher →</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
