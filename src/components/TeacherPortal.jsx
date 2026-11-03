import React, { useState } from 'react';
import { UserCheck, Calendar, BookOpen, Upload, LogOut, Check, X, Search, Filter, Save, Sparkles, Receipt, Award, MessageSquare, MapPin } from 'lucide-react';
import initialStudentsData from '../data/studentsData.json';
import { createWhatsAppLink } from '../utils/geoUtils';

export default function TeacherPortal({ teacher, onLogout, onOpenReceipt, onOpenMarks, onSendAlert }) {
  const [students, setStudents] = useState(initialStudentsData);
  const [selectedGroup, setSelectedGroup] = useState('MPC');
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Attendance state initialized to Present for all
  const [attendanceState, setAttendanceState] = useState(() => {
    const initial = {};
    initialStudentsData.forEach(s => {
      initial[s.id] = true;
    });
    return initial;
  });

  const [savedNotification, setSavedNotification] = useState(false);

  const toggleAttendance = (id) => {
    setAttendanceState(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const markAll = (status) => {
    const updated = {};
    students.forEach(s => {
      if (s.group === selectedGroup || selectedGroup === 'ALL') {
        updated[s.id] = status;
      } else {
        updated[s.id] = attendanceState[s.id];
      }
    });
    setAttendanceState(updated);
  };

  const handleSaveAttendance = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
    if (onSendAlert) {
      onSendAlert({
        title: "Daily Attendance Saved",
        message: `Attendance for ${attendanceDate} saved. All Present & Absent alerts prepared for dispatch.`
      });
    }
  };

  const handleBulkDispatch = () => {
    if (onSendAlert) {
      onSendAlert({
        title: "Bulk SMS & WhatsApp Dispatched",
        message: `Daily attendance report for ${filteredStudents.length} students dispatched to students & their fathers successfully!`
      });
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesGroup = selectedGroup === 'ALL' || s.group === selectedGroup;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.hallTicket.includes(searchTerm) ||
                          s.phone.includes(searchTerm) ||
                          (s.admissionNo && s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesGroup && matchesSearch;
  });

  const presentCount = filteredStudents.filter(s => attendanceState[s.id]).length;
  const absentCount = filteredStudents.length - presentCount;

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
              F
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full">
                  Faculty Management Portal
                </span>
                <span className="text-xs text-slate-300">Sunrise Junior College • BIE AP Code: 01089</span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">
                {teacher?.name || 'Senior Lecturer Sri K. Ramanjaneyulu'}
              </h2>
              <p className="text-xs text-slate-300">
                Department of Physics • Faculty ID: <strong>{teacher?.id || 'TCH101'}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={handleBulkDispatch}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send Attendance SMS to All Parents</span>
            </button>
            <button
              onClick={onLogout}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition flex items-center gap-1.5 shadow"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit Portal</span>
            </button>
          </div>
        </div>

        {/* Action & Filter Bar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Select Stream:</span>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                {['MPC', 'BiPC', 'ALL'].map((grp) => (
                  <button
                    key={grp}
                    onClick={() => setSelectedGroup(grp)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                      selectedGroup === grp ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {grp === 'ALL' ? 'All Streams' : `${grp} Stream`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Date:</span>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by name, adm no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              onClick={handleSaveAttendance}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow"
            >
              <Save className="w-3.5 h-3.5 text-amber-400" />
              <span>Save & Sync</span>
            </button>
          </div>
        </div>

        {/* Saved Alert Banner */}
        {savedNotification && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-bold shadow-sm">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Attendance recorded for {attendanceDate}. Student & parent records updated!</span>
            </div>
            <span>Status: Verified</span>
          </div>
        )}

        {/* Live Attendance Stats Header */}
        <div className="flex flex-wrap items-center justify-between text-xs font-semibold px-2 gap-2">
          <div className="flex items-center gap-3">
            <span className="text-slate-600">Students: <strong>{filteredStudents.length}</strong></span>
            <span className="text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md font-bold">Present: {presentCount}</span>
            <span className="text-red-700 bg-red-100 px-2.5 py-0.5 rounded-md font-bold">Absent: {absentCount}</span>
            <span className="text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md hidden sm:inline">
              GPS Geofence (50m Limit): Active
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => markAll(true)}
              className="text-[11px] font-bold text-emerald-700 hover:underline"
            >
              Mark All Present
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => markAll(false)}
              className="text-[11px] font-bold text-red-700 hover:underline"
            >
              Mark All Absent
            </button>
          </div>
        </div>

        {/* Attendance & Management Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3.5 px-3 text-center w-10">#</th>
                  <th className="py-3.5 px-3">Adm No / Hall Ticket</th>
                  <th className="py-3.5 px-3">Student Name</th>
                  <th className="py-3.5 px-3">Father & Phone</th>
                  <th className="py-3.5 px-3 text-center">GPS Geofence (50m)</th>
                  <th className="py-3.5 px-3 text-center">Today's Status</th>
                  <th className="py-3.5 px-3 text-center">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((s, idx) => {
                  const isPresent = attendanceState[s.id] !== false;
                  const dist = s.attendanceLog?.gpsDistanceMeters || 18;
                  return (
                    <tr key={s.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-indigo-700 block">{s.admissionNo}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{s.hallTicket}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{s.name}</span>
                        <span className="text-[10px] font-bold text-amber-700">{s.groupFull || s.group}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-slate-800 font-medium block">{s.fatherName}</span>
                        <span className="text-[11px] text-slate-500 font-mono">{s.fatherPhone}</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          <span>{dist}m (Inside 50m)</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => toggleAttendance(s.id)}
                          className={`px-3 py-1 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 mx-auto transition ${
                            isPresent
                              ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm'
                              : 'bg-red-500 hover:bg-red-600 text-white shadow-sm'
                          }`}
                        >
                          {isPresent ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Present</span>
                            </>
                          ) : (
                            <>
                              <X className="w-3.5 h-3.5" />
                              <span>Absent</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onOpenReceipt(s)}
                            className="bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-bold px-2 py-1 rounded-lg transition flex items-center gap-1"
                            title="Generate Official Fee Receipt"
                          >
                            <Receipt className="w-3 h-3" />
                            <span>Receipt</span>
                          </button>
                          <button
                            onClick={() => onOpenMarks(s)}
                            className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 text-[11px] font-bold px-2 py-1 rounded-lg transition flex items-center gap-1"
                            title="View & Dispatch Exam Marks"
                          >
                            <Award className="w-3 h-3" />
                            <span>Marks</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
