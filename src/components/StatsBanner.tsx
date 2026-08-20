import React from 'react';
import { AlertCircle, Clock, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { MaintenanceTask } from '../types';
import { getTaskStatus } from '../utils/dateUtils';

interface StatsBannerProps {
  tasks: MaintenanceTask[];
  onFilterChange: (status: string) => void;
  currentFilter: string;
  onOpenPresets: () => void;
  onOpenAI: () => void;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({
  tasks,
  onFilterChange,
  currentFilter,
  onOpenPresets,
  onOpenAI
}) => {
  const activeTasks = tasks.filter(t => !t.isArchived);
  
  const overdueCount = activeTasks.filter(t => getTaskStatus(t) === 'overdue').length;
  const dueSoonCount = activeTasks.filter(t => getTaskStatus(t) === 'due_soon').length;
  const onTrackCount = activeTasks.filter(t => getTaskStatus(t) === 'on_track' || getTaskStatus(t) === 'completed_today').length;

  const total = activeTasks.length;
  const healthScore = total > 0 
    ? Math.max(0, Math.round(((onTrackCount + (dueSoonCount * 0.5)) / total) * 100))
    : 100;

  return (
    <div className="w-full mb-8">
      {/* Header Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overdue Card */}
        <button
          onClick={() => onFilterChange(currentFilter === 'overdue' ? 'all' : 'overdue')}
          id="stat-card-overdue"
          className={`flex items-center justify-between p-5 border-2 text-left transition-all cursor-pointer ${
            currentFilter === 'overdue'
              ? 'bg-[#FF3E00]/10 border-[#FF3E00] text-zinc-900 dark:text-[#F5F5F5]'
              : 'bg-white dark:bg-[#121212] border-zinc-300 dark:border-[#262626] hover:border-[#FF3E00] text-zinc-900 dark:text-[#F5F5F5]'
          }`}
        >
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF3E00] block mb-1">
              ATTENTION REQUIRED
            </span>
            <div className="text-4xl font-black tracking-tighter leading-none text-[#FF3E00] font-display">
              {overdueCount}
            </div>
            <span className="text-[11px] font-bold text-zinc-500 dark:text-[#737373] tracking-wider uppercase mt-1 block">
              Overdue Alerts
            </span>
          </div>
          <div className="p-3 border border-[#FF3E00]/40 bg-[#FF3E00]/10 text-[#FF3E00]">
            <AlertCircle className="w-5 h-5 stroke-[2.5]" />
          </div>
        </button>

        {/* Due Soon Card */}
        <button
          onClick={() => onFilterChange(currentFilter === 'due_soon' ? 'all' : 'due_soon')}
          id="stat-card-due-soon"
          className={`flex items-center justify-between p-5 border-2 text-left transition-all cursor-pointer ${
            currentFilter === 'due_soon'
              ? 'bg-zinc-100 dark:bg-[#171717] border-zinc-900 dark:border-[#F5F5F5] text-zinc-900 dark:text-[#F5F5F5]'
              : 'bg-white dark:bg-[#121212] border-zinc-300 dark:border-[#262626] hover:border-zinc-500 text-zinc-900 dark:text-[#F5F5F5]'
          }`}
        >
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-[#737373] block mb-1">
              UPCOMING ALERTS
            </span>
            <div className="text-4xl font-black tracking-tighter leading-none text-zinc-900 dark:text-[#F5F5F5] font-display">
              {dueSoonCount}
            </div>
            <span className="text-[11px] font-bold text-zinc-500 dark:text-[#737373] tracking-wider uppercase mt-1 block">
              Due In &lt; 7 Days
            </span>
          </div>
          <div className="p-3 border border-zinc-200 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] text-zinc-700 dark:text-[#A3A3A3]">
            <Clock className="w-5 h-5 stroke-[2.5]" />
          </div>
        </button>

        {/* On Track Card */}
        <button
          onClick={() => onFilterChange(currentFilter === 'on_track' ? 'all' : 'on_track')}
          id="stat-card-on-track"
          className={`flex items-center justify-between p-5 border-2 text-left transition-all cursor-pointer ${
            currentFilter === 'on_track'
              ? 'bg-zinc-100 dark:bg-[#171717] border-zinc-900 dark:border-[#F5F5F5] text-zinc-900 dark:text-[#F5F5F5]'
              : 'bg-white dark:bg-[#121212] border-zinc-300 dark:border-[#262626] hover:border-zinc-500 text-zinc-900 dark:text-[#F5F5F5]'
          }`}
        >
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-[#737373] block mb-1">
              CYCLE HEALTHY
            </span>
            <div className="text-4xl font-black tracking-tighter leading-none text-zinc-900 dark:text-[#F5F5F5] font-display">
              {onTrackCount}
            </div>
            <span className="text-[11px] font-bold text-zinc-500 dark:text-[#737373] tracking-wider uppercase mt-1 block">
              Up To Date
            </span>
          </div>
          <div className="p-3 border border-zinc-200 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          </div>
        </button>

        {/* Household Health Score */}
        <div 
          id="stat-card-health"
          className="flex items-center justify-between p-5 border-2 border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-zinc-900 dark:text-[#F5F5F5]"
        >
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-[#737373] block mb-1">
              MAINTENANCE INDEX
            </span>
            <div className="text-4xl font-black tracking-tighter leading-none text-zinc-900 dark:text-[#F5F5F5] font-display">
              {healthScore}%
            </div>
            <span className="text-[11px] font-bold text-zinc-500 dark:text-[#737373] tracking-wider uppercase mt-1 block">
              {total} Tracked Items
            </span>
          </div>
          <div className="p-3 border border-zinc-200 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] text-zinc-900 dark:text-[#F5F5F5]">
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* Quick Setup prompt when empty or few tasks */}
      {total < 3 && (
        <div className="mt-6 p-6 border-2 border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#121212] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#FF3E00] text-black font-black flex-shrink-0">
              <Sparkles className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-[#F5F5F5] font-display">
                CURATED MAINTENANCE STARTER PACKS
              </h4>
              <p className="text-xs text-zinc-600 dark:text-[#737373] mt-1 font-medium tracking-wide">
                Instantly schedule toothbrush replacement, AC filters, bedding sanitization, oil changes, or pet vaccines with 1 click.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenPresets}
              className="px-5 py-2.5 bg-zinc-900 dark:bg-[#F5F5F5] hover:opacity-90 text-white dark:text-[#0A0A0A] font-black text-xs tracking-widest uppercase transition-colors cursor-pointer"
            >
              Browse Packs
            </button>
            <button
              onClick={onOpenAI}
              className="px-5 py-2.5 border border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#171717] hover:border-[#FF3E00] text-zinc-900 dark:text-[#F5F5F5] font-bold text-xs tracking-widest uppercase transition-colors cursor-pointer"
            >
              AI Assistant
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
