import React, { useState } from 'react';
import {
  CalendarCheck2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Circle,
  MoreVertical,
  Calendar,
  ArrowRight,
  Edit2,
  Trash2,
  SkipForward,
} from 'lucide-react';
import { AcademicTask, AcademicTaskStatus } from '../../../types/academic';
import { useAcademic, getTodayDateStr } from '../../../context/AcademicContext';

interface AcademicPlannerViewProps {
  onOpenAddTask: (defaultDate?: string) => void;
  onOpenEditTask: (task: AcademicTask) => void;
}

export const AcademicPlannerView: React.FC<AcademicPlannerViewProps> = ({
  onOpenAddTask,
  onOpenEditTask,
}) => {
  const {
    tasks,
    subjects,
    toggleTaskComplete,
    updateTask,
    rescheduleTask,
    skipTask,
    deleteTask,
    overdueTasks,
  } = useAcademic();

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateStr());
  const [rescheduleModalTask, setRescheduleModalTask] = useState<AcademicTask | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState<string>(getTodayDateStr());
  const [filterSubjectId, setFilterSubjectId] = useState<string>('all');

  const todayStr = getTodayDateStr();

  // Navigate dates
  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const dayTasks = tasks.filter((t) => {
    const matchesDate = t.scheduledDate === selectedDate;
    const matchesSub = filterSubjectId === 'all' || t.subjectId === filterSubjectId;
    return matchesDate && matchesSub;
  });

  const completedCount = dayTasks.filter((t) => t.status === 'completed').length;
  const totalPlannedMinutes = dayTasks.reduce(
    (acc, curr) => acc + curr.plannedDurationMinutes,
    0
  );

  const handleExecuteReschedule = async () => {
    if (!rescheduleModalTask || !newRescheduleDate) return;
    await rescheduleTask(rescheduleModalTask.id, newRescheduleDate);
    setRescheduleModalTask(null);
  };

  const handleCarryForwardAllOverdue = async () => {
    for (const t of overdueTasks) {
      await rescheduleTask(t.id, selectedDate);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <CalendarCheck2 className="text-emerald-400" size={24} />
            Academic Daily Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Define daily syllabus sessions, numerical exercises, and track completion
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenAddTask(selectedDate)}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-semibold shadow-glow-violet transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Add Study Task</span>
          </button>
        </div>
      </div>

      {/* Overdue Callout Banner */}
      {overdueTasks.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-300 text-sm">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-rose-400 flex-shrink-0" />
            <div>
              <p className="font-bold">
                {overdueTasks.length} Incomplete Task{overdueTasks.length > 1 ? 's' : ''} from Previous Days
              </p>
              <p className="text-xs text-rose-300/80">
                Tasks never auto-complete. Decide whether to reschedule or carry into today.
              </p>
            </div>
          </div>
          <button
            onClick={handleCarryForwardAllOverdue}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold self-start sm:self-auto transition-colors whitespace-nowrap"
          >
            Carry All Overdue to {selectedDate === todayStr ? 'Today' : selectedDate}
          </button>
        </div>
      )}

      {/* Date Bar & Subject Filter */}
      <div className="p-4 rounded-2xl bg-[#0f1128] border border-violet-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        {/* Date Navigator */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrevDay}
            className="p-2 rounded-xl bg-[#090a16] border border-violet-500/20 text-slate-400 hover:text-white hover:bg-violet-950/40"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-2 font-mono">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
            />
            {selectedDate === todayStr && (
              <span className="px-2 py-0.5 rounded-md text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase font-bold">
                Today
              </span>
            )}
          </div>

          <button
            onClick={handleNextDay}
            className="p-2 rounded-xl bg-[#090a16] border border-violet-500/20 text-slate-400 hover:text-white hover:bg-violet-950/40"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Filter and Metrics */}
        <div className="flex items-center gap-4">
          <div className="text-xs font-mono text-slate-400">
            <span>
              {completedCount}/{dayTasks.length} Done ({totalPlannedMinutes} mins planned)
            </span>
          </div>

          <select
            value={filterSubjectId}
            onChange={(e) => setFilterSubjectId(e.target.value)}
            className="px-3 py-1.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
          >
            <option value="all">All Subjects</option>
            {subjects
              .filter((s) => !s.isArchived)
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Task Queue List */}
      {dayTasks.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0f1128] border border-dashed border-violet-500/20 space-y-3">
          <CalendarCheck2 size={36} className="mx-auto text-emerald-400 opacity-40" />
          <h3 className="text-base font-bold text-white">No tasks scheduled for this date</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Plan your study sessions, derivations, or problem-solving sets for {selectedDate}.
          </p>
          <button
            onClick={() => onOpenAddTask(selectedDate)}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-xl"
          >
            Schedule a Task
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {dayTasks.map((t) => {
            const sub = subjects.find((s) => s.id === t.subjectId);
            const isDone = t.status === 'completed';
            const isSkipped = t.status === 'skipped';

            return (
              <div
                key={t.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDone
                    ? 'bg-slate-900/40 border-slate-800/80 opacity-70'
                    : isSkipped
                    ? 'bg-slate-900/20 border-slate-800/40 opacity-50'
                    : 'bg-[#0f1128] border-violet-500/20 hover:border-violet-500/50 shadow-lg'
                }`}
              >
                {/* Checkbox and Info */}
                <div className="flex items-start sm:items-center space-x-3.5 min-w-0">
                  <button
                    onClick={() => toggleTaskComplete(t.id)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all flex-shrink-0 mt-0.5 sm:mt-0 ${
                      isDone
                        ? 'bg-emerald-500 border-emerald-500 text-black font-bold'
                        : 'border-slate-600 hover:border-emerald-400 text-transparent'
                    }`}
                  >
                    <CheckCircle2 size={16} />
                  </button>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {sub && (
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold font-mono text-white"
                          style={{ backgroundColor: sub.color || '#8b5cf6' }}
                        >
                          {sub.code}
                        </span>
                      )}
                      <h3
                        className={`text-sm font-semibold truncate ${
                          isDone
                            ? 'line-through text-slate-400'
                            : isSkipped
                            ? 'line-through text-slate-500'
                            : 'text-white'
                        }`}
                      >
                        {t.title}
                      </h3>
                      {t.rescheduleCount > 0 && (
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                          Rescheduled ×{t.rescheduleCount}
                        </span>
                      )}
                    </div>

                    {t.notes && <p className="text-xs text-slate-400">{t.notes}</p>}

                    <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                      <span>{t.plannedDurationMinutes} mins</span>
                      <span>•</span>
                      <span
                        className={
                          t.priority === 'Urgent'
                            ? 'text-rose-400 font-bold'
                            : t.priority === 'High'
                            ? 'text-amber-400'
                            : 'text-slate-400'
                        }
                      >
                        {t.priority}
                      </span>
                      {isSkipped && t.skipReason && (
                        <>
                          <span>•</span>
                          <span className="text-slate-500 italic">Skipped: {t.skipReason}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 self-end sm:self-center flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-violet-900/20 w-full sm:w-auto justify-end">
                  {!isDone && !isSkipped && (
                    <button
                      onClick={() => {
                        setRescheduleModalTask(t);
                        setNewRescheduleDate(todayStr);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#090a16] border border-violet-500/20 hover:border-violet-500/40 text-xs text-violet-300 flex items-center gap-1"
                    >
                      <RotateCcw size={12} />
                      <span>Reschedule</span>
                    </button>
                  )}

                  {!isDone && !isSkipped && (
                    <button
                      onClick={() => skipTask(t.id, 'Deferred')}
                      className="p-1.5 text-slate-400 hover:text-amber-400"
                      title="Skip Task"
                    >
                      <SkipForward size={14} />
                    </button>
                  )}

                  <button
                    onClick={() => onOpenEditTask(t)}
                    className="p-1.5 text-slate-400 hover:text-white"
                  >
                    <Edit2 size={14} />
                  </button>

                  <button
                    onClick={() => deleteTask(t.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModalTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0f1128] border border-violet-500/30 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <RotateCcw size={18} className="text-violet-400" />
              Reschedule Academic Task
            </h3>
            <p className="text-xs text-slate-300">
              Move <strong>"{rescheduleModalTask.title}"</strong> to a new study date. The reschedule event will be preserved in telemetry.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                New Target Date
              </label>
              <input
                type="date"
                value={newRescheduleDate}
                onChange={(e) => setNewRescheduleDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#090a16] border border-violet-500/20 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setRescheduleModalTask(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white border border-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteReschedule}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
