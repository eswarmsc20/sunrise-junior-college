import React, { useEffect } from 'react';
import { MessageSquare, CheckCircle, Bell, X } from 'lucide-react';

export default function NotificationToast({ alert, onClose }) {
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert, onClose]);

  if (!alert) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-amber-500/50 animate-bounce-short no-print">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center flex-shrink-0 mt-0.5">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {alert.title || "SMS & WhatsApp Dispatch"}
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                Sent
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {alert.message}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
