import React, { useState } from 'react';
import { 
  Check, 
  Clock, 
  Calendar, 
  MoreVertical, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  ExternalLink, 
  Info, 
  Edit3, 
  Trash2, 
  History, 
  CalendarPlus,
  AlertTriangle,
  Sparkles,
  QrCode
} from 'lucide-react';
import { MaintenanceTask } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { CATEGORY_INFO } from '../data/presets';
import { 
  getDaysRemaining, 
  getTaskStatus, 
  getProgressPercentage, 
  formatInterval, 
  formatDateDisplay, 
  calculateNextDueDate,
  generateTaskIcs,
  downloadIcs
} from '../utils/dateUtils';
import { sound } from '../utils/sound';

interface TaskCardProps {
  task: MaintenanceTask;
  onComplete: (task: MaintenanceTask) => void;
  onEdit: (task: MaintenanceTask) => void;
  onDelete: (taskId: string) => void;
  onSnooze: (taskId: string, days: number) => void;
  onViewHistory: (task: MaintenanceTask) => void;
  onOpenQRTag?: (task: MaintenanceTask) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onComplete,
  onEdit,
  onDelete,
  onSnooze,
  onViewHistory,
  onOpenQRTag
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSnoozeMenu, setShowSnoozeMenu] = useState(false);

  const status = getTaskStatus(task);
  const daysRemaining = getDaysRemaining(task);
  const progress = getProgressPercentage(task);
  const categoryInfo = CATEGORY_INFO[task.category] || CATEGORY_INFO.other;
  const nextDueDate = calculateNextDueDate(task.lastCompletedDate, task.intervalValue, task.intervalUnit, task.snoozeUntil);

  const handleQuickComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playSuccess();
    onComplete(task);
  };

  const handleCalendarExport = (e: React.MouseEvent) => {
    e.stopPropagation();
    const icsContent = generateTaskIcs(task);
    const filename = `${task.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_reminder.ics`;
    downloadIcs(filename, icsContent);
  };

  return (
    <div 
      id={`task-card-${task.id}`}
      className={`group relative border-2 transition-all duration-200 bg-white dark:bg-[#121212] ${
        status === 'overdue'
          ? 'border-[#FF3E00] shadow-xs'
          : 'border-zinc-300 dark:border-[#262626] hover:border-zinc-500 dark:hover:border-[#525252]'
      }`}
    >
      {/* Top Header Card Container */}
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          {/* Category tag & Status */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 dark:text-[#A3A3A3] px-2 py-0.5 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717]">
                {categoryInfo.label}
              </span>

              {/* Flexible Routine Badge */}
              {task.scheduleType === 'flexible_week' && (
                <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 border border-[#FF3E00] bg-[#FF3E00]/10 text-[#FF3E00]">
                  FLEXIBLE THIS WEEK
                </span>
              )}

              {/* Status Badges */}
              {status === 'overdue' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 bg-[#FF3E00] text-black">
                  <AlertTriangle className="w-3 h-3 stroke-[3]" />
                  OVERDUE {Math.abs(daysRemaining)} {Math.abs(daysRemaining) === 1 ? 'DAY' : 'DAYS'}
                </span>
              )}

              {status === 'due_soon' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 border border-zinc-900 dark:border-[#F5F5F5] bg-zinc-900 dark:bg-[#F5F5F5] text-white dark:text-[#0A0A0A]">
                  <Clock className="w-3 h-3 stroke-[3]" />
                  {daysRemaining === 0 ? 'DUE TODAY' : daysRemaining === 1 ? 'DUE TOMORROW' : `DUE IN ${daysRemaining} DAYS`}
                </span>
              )}

              {status === 'completed_today' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 border border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Check className="w-3 h-3 stroke-[3]" />
                  COMPLETED TODAY
                </span>
              )}

              {task.snoozeUntil && (
                <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] text-zinc-600 dark:text-[#A3A3A3] flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" /> SNOOZED
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-zinc-900 dark:text-[#F5F5F5] font-display leading-snug">
              {task.title}
            </h3>

            {/* Interval & Date Info */}
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 dark:text-[#525252] uppercase tracking-wider mt-1.5 flex-wrap">
              <span className="text-zinc-700 dark:text-[#A3A3A3]">{formatInterval(task.intervalValue, task.intervalUnit)}</span>
              <span>/</span>
              <span>LAST: {formatDateDisplay(task.lastCompletedDate)}</span>
              <span>/</span>
              <span>NEXT: {formatDateDisplay(nextDueDate.toISOString().split('T')[0])}</span>
            </div>
          </div>

          {/* Action Menu button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] text-zinc-600 dark:text-[#A3A3A3] hover:text-zinc-900 dark:hover:text-[#F5F5F5] hover:border-zinc-500 transition-colors cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowMenu(false)} 
                />
                <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-[#171717] border border-zinc-300 dark:border-[#262626] shadow-2xl py-1 z-20 text-xs font-bold uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => { setShowMenu(false); onEdit(task); }}
                    className="w-full px-4 py-2.5 text-left flex items-center gap-2 text-zinc-800 dark:text-[#F5F5F5] hover:bg-zinc-100 dark:hover:bg-[#262626] cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Alert Settings
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowMenu(false); onViewHistory(task); }}
                    className="w-full px-4 py-2.5 text-left flex items-center gap-2 text-zinc-800 dark:text-[#F5F5F5] hover:bg-zinc-100 dark:hover:bg-[#262626] cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5" /> Maintenance History
                  </button>
                  {onOpenQRTag && (
                    <button
                      type="button"
                      onClick={() => { setShowMenu(false); onOpenQRTag(task); }}
                      className="w-full px-4 py-2.5 text-left flex items-center gap-2 text-zinc-800 dark:text-[#F5F5F5] hover:bg-zinc-100 dark:hover:bg-[#262626] cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5 text-[#FF3E00]" /> Print Appliance QR Tag
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => { setShowMenu(false); handleCalendarExport(e); }}
                    className="w-full px-4 py-2.5 text-left flex items-center gap-2 text-zinc-800 dark:text-[#F5F5F5] hover:bg-zinc-100 dark:hover:bg-[#262626] cursor-pointer"
                  >
                    <CalendarPlus className="w-3.5 h-3.5" /> Download .ICS Event
                  </button>
                  <div className="h-px bg-zinc-200 dark:bg-[#262626] my-1" />
                  <button
                    type="button"
                    onClick={() => { setShowMenu(false); onDelete(task.id); }}
                    className="w-full px-4 py-2.5 text-left flex items-center gap-2 text-[#FF3E00] hover:bg-zinc-100 dark:hover:bg-[#262626] cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Alert
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Big Bold Countdown Display */}
        <div className="mt-5 pt-4 border-t border-zinc-200 dark:border-[#262626] flex items-end justify-between">
          <div>
            <div className={`text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none font-display ${
              status === 'overdue' ? 'text-[#FF3E00]' : 'text-zinc-900 dark:text-[#F5F5F5]'
            }`}>
              {status === 'overdue' 
                ? `-${Math.abs(daysRemaining)}` 
                : daysRemaining === 0 
                ? '0' 
                : `${daysRemaining}`}
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 dark:text-[#525252] uppercase block mt-1">
              {status === 'overdue' ? 'DAYS OVERDUE' : daysRemaining === 0 ? 'DUE TODAY' : 'DAYS REMAINING'}
            </span>
          </div>

          <div className="text-right">
            <span className="text-sm font-black text-zinc-700 dark:text-[#A3A3A3] font-display">{progress}%</span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 dark:text-[#525252] uppercase block">
              CYCLE USAGE
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 w-full h-1 bg-zinc-200 dark:bg-[#262626] overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              status === 'overdue'
                ? 'bg-[#FF3E00]'
                : status === 'due_soon'
                ? 'bg-zinc-900 dark:bg-[#F5F5F5]'
                : 'bg-zinc-400 dark:bg-[#525252]'
            }`}
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>

        {/* Card Action Strip (Non-overlapping) */}
        <div className="mt-5 flex items-center justify-between gap-2 flex-wrap pt-2">
          {/* Left Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Mark Done / Replace Button */}
            <button
              type="button"
              onClick={handleQuickComplete}
              id={`btn-complete-${task.id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 dark:bg-[#F5F5F5] hover:opacity-90 text-white dark:text-[#0A0A0A] font-black text-xs tracking-widest uppercase transition-all cursor-pointer shadow-xs"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              MARK DONE
            </button>

            {/* Snooze Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSnoozeMenu(!showSnoozeMenu)}
                id={`btn-snooze-${task.id}`}
                className="inline-flex items-center gap-1 px-3 py-2 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] hover:border-zinc-500 text-zinc-800 dark:text-[#F5F5F5] font-bold text-xs tracking-widest uppercase transition-colors cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-zinc-500 dark:text-[#737373]" />
                Snooze
                <ChevronDown className="w-3 h-3 ml-0.5 opacity-60" />
              </button>

              {showSnoozeMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowSnoozeMenu(false)} 
                  />
                  <div className="absolute left-0 bottom-full mb-1 w-40 bg-white dark:bg-[#171717] border border-zinc-300 dark:border-[#262626] shadow-2xl py-1 z-20 text-xs font-bold uppercase tracking-wider">
                    <button
                      type="button"
                      onClick={() => { setShowSnoozeMenu(false); onSnooze(task.id, 1); }}
                      className="w-full px-4 py-2 text-left hover:bg-zinc-100 dark:hover:bg-[#262626] text-zinc-900 dark:text-[#F5F5F5] cursor-pointer"
                    >
                      + 1 DAY
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowSnoozeMenu(false); onSnooze(task.id, 3); }}
                      className="w-full px-4 py-2 text-left hover:bg-zinc-100 dark:hover:bg-[#262626] text-zinc-900 dark:text-[#F5F5F5] cursor-pointer"
                    >
                      + 3 DAYS
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowSnoozeMenu(false); onSnooze(task.id, 7); }}
                      className="w-full px-4 py-2 text-left hover:bg-zinc-100 dark:hover:bg-[#262626] text-zinc-900 dark:text-[#F5F5F5] cursor-pointer"
                    >
                      + 1 WEEK
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Quick ICS download button */}
            <button
              type="button"
              onClick={handleCalendarExport}
              title="Add to Google/Apple Calendar (.ICS)"
              className="p-2 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] hover:border-zinc-500 text-zinc-600 dark:text-[#A3A3A3] hover:text-zinc-900 dark:hover:text-[#F5F5F5] transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Expand Details Trigger */}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1 text-[11px] font-bold tracking-widest uppercase text-zinc-500 dark:text-[#737373] hover:text-zinc-900 dark:hover:text-[#F5F5F5] transition-colors cursor-pointer"
          >
            {expanded ? (
              <>LESS <ChevronUp className="w-3.5 h-3.5" /></>
            ) : (
              <>DETAILS <ChevronDown className="w-3.5 h-3.5" /></>
            )}
          </button>
        </div>
      </div>

      {/* Expanded Accordion Panel */}
      {expanded && (
        <div className="px-6 pb-6 pt-4 bg-zinc-50 dark:bg-[#171717] border-t border-zinc-200 dark:border-[#262626] text-xs space-y-4">
          {/* Notes or Part Number */}
          {(task.notes || task.modelOrPartNumber || task.estimatedCost || task.difficulty) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {task.notes && (
                <div className="p-3 border border-zinc-200 dark:border-[#262626] bg-white dark:bg-[#121212]">
                  <span className="font-black text-[10px] tracking-[0.2em] uppercase text-zinc-500 dark:text-[#737373] block mb-1">NOTES</span>
                  <p className="text-zinc-700 dark:text-[#D4D4D4] leading-relaxed">{task.notes}</p>
                </div>
              )}

              {task.modelOrPartNumber && (
                <div className="p-3 border border-zinc-200 dark:border-[#262626] bg-white dark:bg-[#121212]">
                  <span className="font-black text-[10px] tracking-[0.2em] uppercase text-zinc-500 dark:text-[#737373] block mb-1">MODEL / PART #</span>
                  <p className="font-mono text-zinc-900 dark:text-[#F5F5F5] font-bold">{task.modelOrPartNumber}</p>
                </div>
              )}

              {task.estimatedCost && (
                <div className="p-3 border border-zinc-200 dark:border-[#262626] bg-white dark:bg-[#121212] flex items-center justify-between">
                  <span className="font-black text-[10px] tracking-[0.2em] uppercase text-zinc-500 dark:text-[#737373]">EST. COST</span>
                  <span className="font-black text-zinc-900 dark:text-[#F5F5F5]">{task.estimatedCost}</span>
                </div>
              )}

              {task.difficulty && (
                <div className="p-3 border border-zinc-200 dark:border-[#262626] bg-white dark:bg-[#121212] flex items-center justify-between">
                  <span className="font-black text-[10px] tracking-[0.2em] uppercase text-zinc-500 dark:text-[#737373]">EFFORT LEVEL</span>
                  <span className="font-bold text-zinc-900 dark:text-[#F5F5F5]">{task.difficulty}</span>
                </div>
              )}
            </div>
          )}

          {/* Maintenance Tips */}
          {task.tips && task.tips.length > 0 && (
            <div className="p-4 border border-zinc-200 dark:border-[#262626] bg-white dark:bg-[#121212]">
              <div className="flex items-center gap-2 text-[#FF3E00] font-black text-xs uppercase tracking-widest mb-2">
                <Sparkles className="w-3.5 h-3.5" /> PRO CARE TIPS
              </div>
              <ul className="space-y-1.5 text-zinc-600 dark:text-[#A3A3A3]">
                {task.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-zinc-400 dark:text-[#525252] font-black">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Signs Due */}
          {task.signsDue && task.signsDue.length > 0 && (
            <div className="p-4 border border-zinc-200 dark:border-[#262626] bg-white dark:bg-[#121212]">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-[#F5F5F5] font-black text-xs uppercase tracking-widest mb-2">
                <Info className="w-3.5 h-3.5 text-[#FF3E00]" /> REPLACEMENT WARNING SIGNS
              </div>
              <ul className="space-y-1.5 text-zinc-600 dark:text-[#A3A3A3]">
                {task.signsDue.map((sign, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#FF3E00] font-black">•</span>
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Product link */}
          {task.productLink && (
            <a 
              href={task.productLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#FF3E00] hover:underline font-black uppercase tracking-widest pt-1"
            >
              ORDER REPLACEMENT PART / ITEM <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}
    </div>
  );
};
