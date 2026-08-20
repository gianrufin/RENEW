import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  RotateCcw, 
  Plus, 
  Sparkles,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { MaintenanceTask } from '../types';
import { getTaskStatus, getDaysRemaining, calculateNextDueDate, formatDateDisplay, formatInterval } from '../utils/dateUtils';
import { DynamicIcon } from './DynamicIcon';

interface ThisWeekViewProps {
  tasks: MaintenanceTask[];
  onComplete: (task: MaintenanceTask) => void;
  onEdit: (task: MaintenanceTask) => void;
  onSnooze: (taskId: string, days: number) => void;
  onNewTask: () => void;
}

export function ThisWeekView({
  tasks,
  onComplete,
  onEdit,
  onSnooze,
  onNewTask
}: ThisWeekViewProps) {
  const [activeSegment, setActiveSegment] = useState<'all' | 'due' | 'flexible'>('all');

  const activeTasks = tasks.filter(t => !t.isArchived);

  // Groupings for This Week
  const overdueTasks = activeTasks.filter(t => getTaskStatus(t) === 'overdue');
  
  // Tasks due within the next 7 days (or currently due today/tomorrow)
  const scheduledThisWeek = activeTasks.filter(t => {
    const days = getDaysRemaining(t);
    const status = getTaskStatus(t);
    return status !== 'overdue' && days <= 7 && t.scheduleType !== 'flexible_week';
  });

  // Flexible tasks (scheduled for "anytime this week")
  const flexibleThisWeek = activeTasks.filter(t => {
    const days = getDaysRemaining(t);
    return t.scheduleType === 'flexible_week' || (days <= 7 && ['bedding', 'personal'].includes(t.category));
  });

  const totalThisWeekCount = overdueTasks.length + scheduledThisWeek.length + flexibleThisWeek.length;
  const completedTodayCount = activeTasks.filter(t => getTaskStatus(t) === 'completed_today').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#121212]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black tracking-[0.2em] uppercase px-2 py-0.5 border border-[#FF3E00] bg-[#FF3E00]/10 text-[#FF3E00]">
                WEEKLY PLANNER
              </span>
              <span className="text-[10px] font-bold text-zinc-500 dark:text-[#737373] tracking-widest uppercase">
                CURRENT CALENDAR CYCLE
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-900 dark:text-[#F5F5F5] font-display">
              ON THIS WEEK<span className="text-[#FF3E00]">.</span>
            </h2>
            <p className="text-xs text-zinc-600 dark:text-[#A3A3A3] uppercase font-bold tracking-wider mt-1 max-w-lg">
              Tasks requiring action over the next 7 days, plus flexible routines you can tackle anytime before Sunday.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 border border-zinc-200 dark:border-[#262626] bg-white dark:bg-[#171717] text-center min-w-[90px]">
              <span className="text-2xl font-black text-zinc-900 dark:text-[#F5F5F5] font-display leading-none block">
                {totalThisWeekCount}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-[#737373] mt-1 block">
                TOTAL DUE
              </span>
            </div>
            <div className="p-3 border border-emerald-500/30 bg-emerald-500/5 text-center min-w-[90px]">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-display leading-none block">
                {completedTodayCount}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mt-1 block">
                DONE TODAY
              </span>
            </div>
          </div>
        </div>

        {/* Segment selector */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-zinc-200 dark:border-[#262626] overflow-x-auto">
          <button
            onClick={() => setActiveSegment('all')}
            className={`px-3.5 py-2 text-xs font-black uppercase tracking-widest cursor-pointer border transition-colors ${
              activeSegment === 'all'
                ? 'border-zinc-900 dark:border-[#F5F5F5] bg-zinc-900 dark:bg-[#F5F5F5] text-white dark:text-[#0A0A0A]'
                : 'border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#171717] text-zinc-600 dark:text-[#A3A3A3] hover:border-zinc-500'
            }`}
          >
            ALL THIS WEEK ({totalThisWeekCount})
          </button>
          <button
            onClick={() => setActiveSegment('due')}
            className={`px-3.5 py-2 text-xs font-black uppercase tracking-widest cursor-pointer border transition-colors ${
              activeSegment === 'due'
                ? 'border-[#FF3E00] bg-[#FF3E00] text-black'
                : 'border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#171717] text-zinc-600 dark:text-[#A3A3A3] hover:border-zinc-500'
            }`}
          >
            DATE SPECIFIC ({overdueTasks.length + scheduledThisWeek.length})
          </button>
          <button
            onClick={() => setActiveSegment('flexible')}
            className={`px-3.5 py-2 text-xs font-black uppercase tracking-widest cursor-pointer border transition-colors ${
              activeSegment === 'flexible'
                ? 'border-[#FF3E00] bg-[#FF3E00] text-black'
                : 'border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#171717] text-zinc-600 dark:text-[#A3A3A3] hover:border-zinc-500'
            }`}
          >
            FLEXIBLE ROUTINES ({flexibleThisWeek.length})
          </button>
        </div>
      </div>

      {/* 1. Overdue section */}
      {(activeSegment === 'all' || activeSegment === 'due') && overdueTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#FF3E00] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 stroke-[3]" />
              OVERDUE TASKS ({overdueTasks.length})
            </h3>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">NEEDS IMMEDIATE LOG</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {overdueTasks.map(task => {
              const days = Math.abs(getDaysRemaining(task));
              return (
                <div 
                  key={task.id}
                  className="p-4 border-2 border-[#FF3E00] bg-white dark:bg-[#171717] flex flex-col justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div className="p-2 border border-[#FF3E00] bg-[#FF3E00]/10 text-[#FF3E00] flex-shrink-0">
                        <DynamicIcon name={task.iconName} className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-[#FF3E00] text-black">
                          {days === 0 ? 'DUE TODAY' : `${days}D OVERDUE`}
                        </span>
                        <h4 className="text-sm font-black uppercase tracking-tight text-zinc-900 dark:text-[#F5F5F5] font-display mt-1">
                          {task.title}
                        </h4>
                        <p className="text-xs text-zinc-500 dark:text-[#737373] mt-0.5">
                          {formatInterval(task.intervalValue, task.intervalUnit)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-[#262626]">
                    <button
                      type="button"
                      onClick={() => onSnooze(task.id, 3)}
                      className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#121212] text-zinc-700 dark:text-[#A3A3A3] hover:text-zinc-900 dark:hover:text-[#F5F5F5] cursor-pointer flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      SNOOZE 3D
                    </button>
                    <button
                      type="button"
                      onClick={() => onComplete(task)}
                      className="px-4 py-1.5 text-xs font-black uppercase tracking-widest bg-[#FF3E00] hover:bg-[#FF3E00]/90 text-black cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                      MARK DONE
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Scheduled for this week */}
      {(activeSegment === 'all' || activeSegment === 'due') && (
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-700 dark:text-[#A3A3A3] flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            SCHEDULED THIS WEEK ({scheduledThisWeek.length})
          </h3>

          {scheduledThisWeek.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {scheduledThisWeek.map(task => {
                const days = getDaysRemaining(task);
                const nextDueDate = calculateNextDueDate(task.lastCompletedDate, task.intervalValue, task.intervalUnit, task.snoozeUntil);
                return (
                  <div 
                    key={task.id}
                    className="p-4 border border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#171717] flex flex-col justify-between gap-3 hover:border-zinc-400 dark:hover:border-[#525252] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <div className="p-2 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#121212] text-zinc-800 dark:text-[#F5F5F5] flex-shrink-0">
                          <DynamicIcon name={task.iconName} className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 border border-zinc-300 dark:border-[#262626] bg-zinc-100 dark:bg-[#121212] text-zinc-700 dark:text-[#A3A3A3]">
                            {days === 0 ? 'DUE TODAY' : days === 1 ? 'DUE TOMORROW' : `IN ${days} DAYS (${formatDateDisplay(nextDueDate.toISOString().split('T')[0])})`}
                          </span>
                          <h4 className="text-sm font-black uppercase tracking-tight text-zinc-900 dark:text-[#F5F5F5] font-display mt-1">
                            {task.title}
                          </h4>
                          {task.notes && (
                            <p className="text-xs text-zinc-500 dark:text-[#737373] line-clamp-1 mt-0.5">
                              {task.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-[#262626]">
                      <button
                        type="button"
                        onClick={() => onEdit(task)}
                        className="text-[11px] font-bold text-zinc-500 dark:text-[#737373] hover:text-zinc-900 dark:hover:text-[#F5F5F5] uppercase tracking-wider cursor-pointer"
                      >
                        Edit Details
                      </button>
                      <button
                        type="button"
                        onClick={() => onComplete(task)}
                        className="px-4 py-1.5 text-xs font-black uppercase tracking-widest bg-zinc-900 dark:bg-[#F5F5F5] text-white dark:text-[#0A0A0A] hover:opacity-90 cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                        COMPLETE
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-zinc-400 dark:text-[#525252] uppercase font-bold tracking-wider p-4 border border-dashed border-zinc-300 dark:border-[#262626] text-center">
              No date-specific alerts scheduled for the next 7 days.
            </p>
          )}
        </div>
      )}

      {/* 3. Flexible Routines (Anytime this week) */}
      {(activeSegment === 'all' || activeSegment === 'flexible') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#FF3E00] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 stroke-[3]" />
              FLEXIBLE ROUTINES (ANYTIME THIS WEEK) ({flexibleThisWeek.length})
            </h3>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">DO BY WEEKEND</span>
          </div>

          {flexibleThisWeek.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {flexibleThisWeek.map(task => (
                <div 
                  key={task.id}
                  className="p-4 border border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#171717] flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#121212] text-[#FF3E00] flex-shrink-0">
                      <DynamicIcon name={task.iconName} className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 border border-[#FF3E00] text-[#FF3E00]">
                        FLEXIBLE WEEKLY
                      </span>
                      <h4 className="text-sm font-black uppercase tracking-tight text-zinc-900 dark:text-[#F5F5F5] font-display mt-1">
                        {task.title}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-[#737373] mt-0.5">
                        Cycle: {formatInterval(task.intervalValue, task.intervalUnit)} • {task.difficulty || 'Easy'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-2 border-t border-zinc-200 dark:border-[#262626]">
                    <button
                      type="button"
                      onClick={() => onComplete(task)}
                      className="px-4 py-1.5 text-xs font-black uppercase tracking-widest bg-[#FF3E00] hover:bg-[#FF3E00]/90 text-black cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                      LOG COMPLETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-400 dark:text-[#525252] uppercase font-bold tracking-wider p-4 border border-dashed border-zinc-300 dark:border-[#262626] text-center">
              No flexible weekly chores active. You can set any routine as "Flexible This Week" in task settings.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
