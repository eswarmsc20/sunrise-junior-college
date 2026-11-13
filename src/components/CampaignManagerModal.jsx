import React, { useState } from 'react';
import { X, Calendar, Send, MessageSquare, Sparkles, Clock, CheckCircle2, UserCheck, Phone, Megaphone, Bell, Plus } from 'lucide-react';
import { INDIAN_FESTIVALS_CALENDAR, UPCOMING_INTER_CAMPAIGN_SCHEDULE, MOCK_INTER_PROSPECTS } from '../data/calendarData';
import { createWhatsAppLink } from '../utils/geoUtils';

export default function CampaignManagerModal({ isOpen, onClose, onSendNotification }) {
  const [activeTab, setActiveTab] = useState('drip'); // 'drip' or 'calendar'
  const [selectedProspect, setSelectedProspect] = useState(MOCK_INTER_PROSPECTS[0]); // Default to 7893505185
  const [prospects, setProspects] = useState(MOCK_INTER_PROSPECTS);
  const [selectedFestival, setSelectedFestival] = useState(INDIAN_FESTIVALS_CALENDAR[0]);
  const [customPhone, setCustomPhone] = useState('7893505185');
  const [sentLogs, setSentLogs] = useState([]);
  const [autoScheduleActive, setAutoScheduleActive] = useState(true);

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSendDripMessage = (scheduleItem, prospect) => {
    const targetPhone = prospect ? prospect.phone : customPhone;
    const targetName = prospect ? prospect.name : 'Student';
    const personalizedMsg = scheduleItem.message.replace('Dear SSC Student/Parent', `Dear ${targetName}`);
    
    // Create WhatsApp Link
    const waLink = createWhatsAppLink(targetPhone, personalizedMsg);
    window.open(waLink, '_blank');

    // Add to audit log
    const logEntry = {
      id: Date.now(),
      target: `${targetName} (${targetPhone})`,
      topic: `${scheduleItem.day}: ${scheduleItem.topic}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      status: 'Sent Successfully'
    };
    setSentLogs([logEntry, ...sentLogs]);

    if (onSendNotification) {
      onSendNotification({
        title: `Drip Campaign: ${scheduleItem.day} Dispatched`,
        message: `Message on "${scheduleItem.topic}" sent to ${targetPhone} via WhatsApp & SMS gateway.`
      });
    }
  };

  const handleBroadcastFestival = (festival) => {
    const waLink = createWhatsAppLink(customPhone, festival.defaultMsg);
    window.open(waLink, '_blank');

    const logEntry = {
      id: Date.now(),
      target: `Broadcast to All Students (${customPhone} Test)`,
      topic: `Festival Greeting: ${festival.name}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      status: 'Broadcast Complete'
    };
    setSentLogs([logEntry, ...sentLogs]);

    if (onSendNotification) {
      onSendNotification({
        title: `Festival Broadcast: ${festival.name}`,
        message: `Occasional Greeting broadcast successfully sent to student database. Test phone: ${customPhone}`
      });
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto cursor-pointer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 my-4 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white p-5 sm:p-6 relative shadow-md">
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
              Automated Notification & Drip Engine
            </span>
            <span className="text-xs text-amber-300 font-mono flex items-center gap-1">
              <Megaphone className="w-3.5 h-3.5" /> Target Test Number: 7893505185
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white">
            Occasional Greetings & Inter Prospective Outreach
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Auto-triggered 2-day drip campaigns for 10th/SSC students & Indian Calendar festival broadcasts.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 bg-slate-100 px-6 pt-3 gap-3">
          <button
            onClick={() => setActiveTab('drip')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'drip'
                ? 'border-amber-600 text-amber-900 bg-white rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-600" />
            <span>2-Day Drip Campaign (Upcoming Inter Students)</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'calendar'
                ? 'border-amber-600 text-amber-900 bg-white rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>Indian Calendar Occasional Greetings</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {activeTab === 'drip' ? (
            <div className="space-y-6">
              {/* Highlight Target Testing Card */}
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-amber-950">Active Testing Target:</span>
                      <span className="bg-amber-200 text-amber-950 text-xs px-2 py-0.5 rounded font-mono font-bold">
                        {customPhone}
                      </span>
                      <span className="text-[11px] text-amber-800 font-semibold">(Chaitanya Varma)</span>
                    </div>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                      Messages are formatted for instant WhatsApp dispatch and simulated SMS broadcast every 2 days.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${autoScheduleActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                    {autoScheduleActive ? 'Auto Cron: Active (Every 48 Hrs)' : 'Cron Paused'}
                  </span>
                  <button
                    onClick={() => setAutoScheduleActive(!autoScheduleActive)}
                    className="text-xs text-amber-900 underline font-bold"
                  >
                    Toggle
                  </button>
                </div>
              </div>

              {/* 2-Day Drip Schedule Cards */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Automated 2-Day Cadence Sequence (Day 1, 3, 5, 7)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {UPCOMING_INTER_CAMPAIGN_SCHEDULE.map((item, index) => (
                    <div 
                      key={item.day}
                      className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:border-amber-400 transition space-y-3 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="bg-slate-900 text-amber-400 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                            {item.day} • {item.interval}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">Cadence Step #{index + 1}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">{item.topic}</h4>
                        <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2 line-clamp-3">
                          "{item.message}"
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-mono text-slate-500">Target: {customPhone}</span>
                        <button
                          onClick={() => handleSendDripMessage(item, selectedProspect)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1.5 px-3 rounded-xl flex items-center gap-1.5 transition shadow-sm"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Test via WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prospective Students Database Section */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Prospective 10th / SSC Student Database (Testing Target Included)
                    </h4>
                    <p className="text-[11px] text-slate-500">Select any candidate to test direct WhatsApp/SMS trigger.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {prospects.map((p) => (
                    <div 
                      key={p.id}
                      onClick={() => {
                        setSelectedProspect(p);
                        setCustomPhone(p.phone);
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition ${
                        selectedProspect.id === p.id 
                          ? 'border-amber-500 bg-white shadow-sm ring-1 ring-amber-400' 
                          : 'border-slate-200 bg-white/70 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-900">{p.name}</p>
                        <span className="text-[9px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">{p.stream}</span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-600 mt-0.5">{p.phone}</p>
                      <p className="text-[10px] text-slate-400 truncate">{p.school}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Indian Calendar Tab */
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Indian National Days & Festival Calendar Broadcast
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Pre-configured festival greetings tailored for students, parents, and alumni of Sunrise Junior College.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {INDIAN_FESTIVALS_CALENDAR.map((festival) => (
                    <div 
                      key={festival.id}
                      className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:border-amber-400 transition flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {festival.category}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500 font-semibold">{festival.date}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mt-1.5">{festival.name}</h4>
                        <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100 mt-2 line-clamp-3">
                          "{festival.defaultMsg}"
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <button
                          onClick={() => handleBroadcastFestival(festival)}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition"
                        >
                          <Send className="w-3.5 h-3.5 text-amber-400" />
                          <span>Broadcast to Students ({customPhone})</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Audit Logs */}
          {sentLogs.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Recent Broadcast & Campaign Dispatch History
              </h4>
              <div className="space-y-1.5 max-h-32 overflow-y-auto font-mono text-[11px]">
                {sentLogs.map((log) => (
                  <div key={log.id} className="bg-slate-50 p-2 rounded-lg flex items-center justify-between border border-slate-200">
                    <span className="text-slate-800 font-semibold">{log.topic} &rarr; {log.target}</span>
                    <span className="text-emerald-700 font-bold">{log.timestamp} • {log.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}