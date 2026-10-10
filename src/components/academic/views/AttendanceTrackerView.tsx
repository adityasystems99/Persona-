import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  AlertTriangle,
  Sparkles,
  Trash2,
  Filter,
} from 'lucide-react';
import { useAcademic } from '../../../context/AcademicContext';

interface AttendanceTrackerViewProps {
  onOpenLogAttendance: (defaultSubjectId?: string) => void;
}

export const AttendanceTrackerView: React.FC<AttendanceTrackerViewProps> = ({
  onOpenLogAttendance,
}) => {
  const {
    subjects,
    attendance,
    subjectAttendanceStats,
    settings,
    deleteAttendance,
  } = useAcademic();

  const [filterSubjectId, setFilterSubjectId] = useState('all');

  const activeSubjects = subjects.filter((s) => !s.isArchived);
  const threshold = settings.minimumAttendanceThreshold || 75;

  const filteredLogs = attendance.filter((a) => {
    if (filterSubjectId === 'all') return true;
    return a.subjectId === filterSubjectId;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Calendar className="text-violet-400" size={24} />
            Academic Attendance Radar
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time percentage analytics, minimum threshold alerts, and bunk calculation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenLogAttendance()}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-semibold shadow-glow-violet transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Log Class Attendance</span>
          </button>
        </div>
      </div>

      {/* Subject Attendance Cards Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {activeSubjects.map((sub) => {
          const stat = subjectAttendanceStats[sub.id];
          const hasClasses = stat && stat.totalClasses > 0;
          const isDanger = stat?.isBelowThreshold;

          return (
            <div
              key={sub.id}
              className={`p-5 rounded-2xl bg-[#0f1128] border transition-all flex flex-col justify-between space-y-4 shadow-xl ${
                isDanger
                  ? 'border-rose-500/50 ring-1 ring-rose-500/20'
                  : 'border-violet-500/20 hover:border-violet-500/40'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="px-2.5 py-0.5 rounded text-xs font-bold font-mono text-white"
                    style={{ backgroundColor: sub.color || '#8b5cf6' }}
                  >
                    {sub.code}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Threshold: {threshold}%
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white truncate">{sub.name}</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span
                      className={`text-3xl font-extrabold font-mono ${
                        isDanger ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {hasClasses ? `${stat.percentage}%` : 'N/A'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {hasClasses
                        ? `(${stat.attendedClasses}/${stat.totalClasses - stat.excusedClasses} classes attended)`
                        : 'No classes recorded'}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                {hasClasses && (
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isDanger ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, stat.percentage)}%` }}
                    />
                  </div>
                )}

                {/* Mathematical Bunk / Attend Recommendation */}
                <div className="p-3 rounded-xl bg-[#090a16] border border-violet-500/10 text-xs font-mono">
                  {!hasClasses ? (
                    <p className="text-slate-500">Record your first lecture or lab to calculate margins.</p>
                  ) : isDanger ? (
                    <div className="flex items-center gap-2 text-rose-300">
                      <AlertTriangle size={15} className="flex-shrink-0 text-rose-400" />
                      <span>
                        Attend next <strong>{stat.needToAttendCount} class{stat.needToAttendCount > 1 ? 'es' : ''}</strong> to restore {threshold}%.
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-300">
                      <CheckCircle size={15} className="flex-shrink-0 text-emerald-400" />
                      <span>
                        Safe to miss <strong>{stat.canBunkCount} class{stat.canBunkCount > 1 ? 'es' : ''}</strong> while staying above {threshold}%.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-violet-900/30 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">
                  Excused / OD: {stat?.excusedClasses || 0}
                </span>
                <button
                  onClick={() => onOpenLogAttendance(sub.id)}
                  className="text-xs text-violet-400 hover:text-violet-300 font-semibold"
                >
                  + Log for {sub.code}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Attendance History Log Table */}
      <div className="p-6 rounded-2xl bg-[#0f1128] border border-violet-500/20 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar size={18} className="text-violet-400" />
              Recorded Class Sessions ({filteredLogs.length})
            </h2>
            <p className="text-xs text-slate-400">
              Audit log of all registered lectures, labs, and leaves
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Filter size={14} className="text-slate-500" />
            <select
              value={filterSubjectId}
              onChange={(e) => setFilterSubjectId(e.target.value)}
              className="px-3 py-1.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
            >
              <option value="all">All Subjects</option>
              {activeSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-violet-900/40 rounded-xl">
            No attendance logs found. Log your class sessions using the button above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-violet-900/30 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Notes</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-violet-900/20 text-slate-300">
                {filteredLogs.map((log) => {
                  const sub = subjects.find((s) => s.id === log.subjectId);

                  return (
                    <tr key={log.id} className="hover:bg-violet-950/20 transition-colors">
                      <td className="py-2.5 px-3 text-white font-bold">{log.classDate}</td>
                      <td className="py-2.5 px-3">
                        {sub && (
                          <span
                            className="px-2 py-0.5 rounded text-[10px] text-white font-bold"
                            style={{ backgroundColor: sub.color || '#8b5cf6' }}
                          >
                            {sub.code}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">{log.classType}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            log.status === 'present'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : log.status === 'absent'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 font-sans max-w-xs truncate">
                        {log.notes || '—'}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => deleteAttendance(log.id)}
                          className="p-1 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
