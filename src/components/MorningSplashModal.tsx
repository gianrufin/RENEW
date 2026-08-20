import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Sparkles, 
  X, 
  ArrowRight,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';
import { MaintenanceTask } from '../types';
import { getTaskStatus, getDaysRemaining, formatDateDisplay } from '../utils/dateUtils';
import { DynamicIcon } from './DynamicIcon';

interface MorningSplashModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: MaintenanceTask[];
  onComplete: (task: MaintenanceTask) => void;
  onSnooze: (taskId: string, days: number) => void;
  onViewTask: (task: MaintenanceTask) => void;
}

export function MorningSplashModal({
  isOpen,
  onClose,
  tasks,
  onComplete,
  onSnooze,
  onViewTask
}: MorningSplashModalProps) {
  if (!isOpen) return null;

  const activeTasks = tasks.filter(t => !t.isArchived);
  
  // Categorize for the morning briefing
  const overdueList = activeTasks.filter(t => getTaskStatus(t) === 'overdue');
  const dueTodayList = activeTasks.filter(t => {
    const status = getTaskStatus(t);
    const days = getDaysRemaining(t);
    return status !== 'overdue' && days <= 0;
  });
  const dueThisWeekList = activeTasks.filter(t => {
    const days = getDaysRemaining(t);
    return days > 0 && days <= 7;
  });

  const urgentCount = overdueList.length + dueTodayList.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div 
        id="morning-splash-modal"
        className="w-full max-w-2xl bg-white dark:bg-[#121212] border-2 border-zinc-300 dark:border-[#262626] shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col transition-colors duration-200"
      >
        {/* Top Accent Strip */}
        <div className={`h-2.5 w-full ${urgentCount > 0 ? 'bg-[#FF3E00]' : 'bg-emerald-500'}`} />

        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-200 dark:border-[#262626] flex items-center justify-between bg-zinc-50 dark:bg-[#171717]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-black tracking-[0.2em] uppercase px-2 py-0.5 border ${
                urgentCount > 0 
                  ? 'border-[#FF3E00] bg-[#FF3E00]/10 text-[#FF3E00]' 
                  : 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
              }`}>
                {urgentCount > 0 ? `${urgentCount} URGENT ALERTS` : 'ALL ON SCHEDULE'}
              </span>
              <span className="text-[10px] font-bold text-zinc-500 dark:text-[#737373] tracking-widest uppercase">
                {new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date())}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-900 dark:text-[#F5F5F5] font-display">
              DAILY ALERT BRIEFING
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close splash"
            className="p-2 border border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-zinc-600 dark:text-[#737373] hover:text-zinc-900 dark:hover:text-[#F5F5F5] hover:border-zinc-500 dark:hover:border-[#525252] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Overdue Section */}
          {overdueList.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#FF3E00]">
                <AlertTriangle className="w-4 h-4 stroke-[3]" />
                <span>OVERDUE ITEMS ({overdueList.length})</span>
              </div>
              <div className="space-y-2.5">
                {overdueList.map(task => {
                  const days = Math.abs(getDaysRemaining(task));
                  return (
                    <div 
                      key={task.id}
                      className="p-4 border-2 border-[#FF3E00] bg-[#FF3E00]/5 dark:bg-[#171717] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 border border-[#FF3E00] bg-white dark:bg-[#121212] text-[#FF3E00]">
                          <DynamicIcon name={task.iconName} className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-[#FF3E00] text-black">
                              {days === 0 ? 'DUE TODAY' : `${days}D OVERDUE`}
                            </span>
                            <span className="text-[10px] font-bold text-zinc-500 dark:text-[#737373] uppercase">
                              {task.category}
                            </span>
                          </div>
                          <h4 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-[#F5F5F5] font-display mt-0.5">
                            {task.title}
                          </h4>
                          {task.notes && (
                            <p className="text-xs text-zinc-600 dark:text-[#A3A3A3] line-clamp-1 mt-0.5">
                              {task.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action buttons (Non-overlapping) */}
                      <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => onSnooze(task.id, 3)}
                          className="px-3 py-2 text-xs font-black uppercase tracking-wider border border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-zinc-700 dark:text-[#A3A3A3] hover:text-zinc-900 dark:hover:text-[#F5F5F5] hover:border-zinc-500 cursor-pointer flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          +3D
                        </button>
                        <button
                          type="button"
                          onClick={() => { onClose(); onComplete(task); }}
                          className="px-4 py-2 text-xs font-black uppercase tracking-widest bg-[#FF3E00] hover:bg-[#FF3E00]/90 text-black cursor-pointer flex items-center gap-1.5 shadow-sm"
                        >
                          <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                          DONE
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Due Today Section */}
          {dueTodayList.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                <Clock className="w-4 h-4 stroke-[3]" />
                <span>SCHEDULED FOR TODAY ({dueTodayList.length})</span>
              </div>
              <div className="space-y-2.5">
                {dueTodayList.map(task => (
                  <div 
                    key={task.id}
                    className="p-4 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 border border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-zinc-800 dark:text-[#F5F5F5]">
                        <DynamicIcon name={task.iconName} className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 border border-amber-500 text-amber-600 dark:text-amber-400">
                          TODAY
                        </span>
                        <h4 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-[#F5F5F5] font-display mt-0.5">
                          {task.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => { onClose(); onComplete(task); }}
                        className="px-4 py-2 text-xs font-black uppercase tracking-widest bg-zinc-900 dark:bg-[#F5F5F5] text-white dark:text-[#0A0A0A] hover:opacity-90 cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                        LOG COMPLETE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Due This Week Section */}
          {dueThisWeekList.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-zinc-600 dark:text-[#A3A3A3]">
                <Calendar className="w-4 h-4 stroke-[2.5]" />
                <span>UPCOMING THIS WEEK ({dueThisWeekList.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {dueThisWeekList.map(task => {
                  const days = getDaysRemaining(task);
                  return (
                    <div 
                      key={task.id}
                      className="p-3.5 border border-zinc-200 dark:border-[#262626] bg-white dark:bg-[#171717] flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <DynamicIcon name={task.iconName} className="w-4 h-4 text-zinc-500 dark:text-[#737373] flex-shrink-0" />
                        <div className="truncate">
                          <h5 className="text-xs font-black uppercase text-zinc-900 dark:text-[#F5F5F5] truncate">
                            {task.title}
                          </h5>
                          <span className="text-[10px] text-zinc-500 dark:text-[#737373] font-bold uppercase">
                            Due in {days} {days === 1 ? 'day' : 'days'}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => { onClose(); onComplete(task); }}
                        className="p-1.5 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#121212] text-zinc-700 dark:text-[#F5F5F5] hover:text-[#FF3E00] cursor-pointer flex-shrink-0"
                        title="Mark Complete"
                      >
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* All Good State */}
          {urgentCount === 0 && dueThisWeekList.length === 0 && (
            <div className="p-8 text-center border border-zinc-200 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] space-y-3">
              <div className="w-12 h-12 border-2 border-emerald-500 bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 stroke-[3]" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 dark:text-[#F5F5F5] font-display">
                YOU ARE FULLY UP TO DATE!
              </h3>
              <p className="text-xs text-zinc-500 dark:text-[#737373] font-bold uppercase tracking-wider max-w-sm mx-auto">
                No household items, appliances, or vehicle services are overdue. Your next scheduled routine is in good shape.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] flex items-center justify-between flex-shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-[#737373]">
            {activeTasks.length} TOTAL ACTIVE SCHEDULES
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-zinc-900 dark:bg-[#F5F5F5] hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-[#0A0A0A] font-black text-xs uppercase tracking-widest transition-colors cursor-pointer"
          >
            START MY DAY
          </button>
        </div>
      </div>
    </div>
  );
}
