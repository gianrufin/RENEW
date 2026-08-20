import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar, Bell, HelpCircle, Sparkles, Tag, DollarSign } from 'lucide-react';
import { MaintenanceTask, CategoryType, IntervalUnit, ScheduleType } from '../types';
import { CATEGORY_INFO } from '../data/presets';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Partial<MaintenanceTask>) => void;
  initialTask?: MaintenanceTask | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryType>('appliances');
  const [scheduleType, setScheduleType] = useState<ScheduleType>('exact_date');
  const [intervalValue, setIntervalValue] = useState<number>(30);
  const [intervalUnit, setIntervalUnit] = useState<IntervalUnit>('days');
  const [lastCompletedDate, setLastCompletedDate] = useState(todayStr);
  const [leadAlertDays, setLeadAlertDays] = useState<number>(3);
  const [preferredTime, setPreferredTime] = useState('09:00');
  const [notes, setNotes] = useState('');
  const [modelOrPartNumber, setModelOrPartNumber] = useState('');
  const [productLink, setProductLink] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setCategory(initialTask.category);
      setScheduleType(initialTask.scheduleType || 'exact_date');
      setIntervalValue(initialTask.intervalValue);
      setIntervalUnit(initialTask.intervalUnit);
      setLastCompletedDate(initialTask.lastCompletedDate);
      setLeadAlertDays(initialTask.leadAlertDays ?? 3);
      setPreferredTime(initialTask.preferredTime || '09:00');
      setNotes(initialTask.notes || '');
      setModelOrPartNumber(initialTask.modelOrPartNumber || '');
      setProductLink(initialTask.productLink || '');
      setEstimatedCost(initialTask.estimatedCost || '');
    } else {
      // Default new task
      setTitle('');
      setCategory('appliances');
      setScheduleType('exact_date');
      setIntervalValue(30);
      setIntervalUnit('days');
      setLastCompletedDate(todayStr);
      setLeadAlertDays(3);
      setPreferredTime('09:00');
      setNotes('');
      setModelOrPartNumber('');
      setProductLink('');
      setEstimatedCost('');
    }
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      ...(initialTask ? { id: initialTask.id, history: initialTask.history } : {}),
      title: title.trim(),
      category,
      scheduleType,
      intervalValue: Number(intervalValue) || 30,
      intervalUnit,
      lastCompletedDate,
      leadAlertDays: Number(leadAlertDays) || 0,
      preferredTime,
      notes: notes.trim(),
      modelOrPartNumber: modelOrPartNumber.trim(),
      productLink: productLink.trim(),
      estimatedCost: estimatedCost.trim(),
      iconName: CATEGORY_INFO[category]?.icon || 'CheckCircle2'
    });
    onClose();
  };

  // Quick preset interval shortcuts
  const handleQuickInterval = (val: number, unit: IntervalUnit) => {
    setIntervalValue(val);
    setIntervalUnit(unit);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs overflow-y-auto">
      <div 
        id="task-modal-container"
        className="w-full max-w-xl bg-white dark:bg-[#121212] border-2 border-zinc-300 dark:border-[#262626] shadow-2xl overflow-hidden my-6"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-zinc-200 dark:border-[#262626] flex items-center justify-between bg-zinc-50 dark:bg-[#171717]">
          <div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-zinc-900 dark:text-[#F5F5F5] font-display">
              {initialTask ? 'EDIT ALERT & SCHEDULE' : 'NEW MAINTENANCE ALERT'}
            </h2>
            <p className="text-[10px] font-bold tracking-widest text-zinc-500 dark:text-[#737373] uppercase mt-1">
              CUSTOM RECURRING TIMELINES & NOTIFICATIONS
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 border border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-zinc-600 dark:text-[#737373] hover:text-zinc-900 dark:hover:text-[#F5F5F5] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-sm max-h-[80vh] overflow-y-auto">
          {/* Task Name */}
          <div>
            <label className="block text-[10px] font-black text-zinc-600 dark:text-[#737373] uppercase tracking-[0.2em] mb-2">
              TASK OR ITEM NAME *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. CLEAN AC FILTER, REPLACE TOOTHBRUSH..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] text-zinc-900 dark:text-[#F5F5F5] placeholder-zinc-400 dark:placeholder-[#525252] font-bold text-sm focus:outline-hidden focus:border-[#FF3E00]"
            />
          </div>

          {/* Schedule Mode (Exact vs Flexible This Week) */}
          <div>
            <label className="block text-[10px] font-black text-zinc-600 dark:text-[#737373] uppercase tracking-[0.2em] mb-2">
              SCHEDULE DISCIPLINE
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setScheduleType('exact_date')}
                className={`p-3 border text-left cursor-pointer transition-all ${
                  scheduleType === 'exact_date'
                    ? 'border-[#FF3E00] bg-[#FF3E00]/10 text-zinc-900 dark:text-[#F5F5F5]'
                    : 'border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] text-zinc-600 dark:text-[#A3A3A3]'
                }`}
              >
                <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 text-[#FF3E00]" />
                  EXACT DATE
                </div>
                <span className="text-[10px] font-bold text-zinc-500 dark:text-[#737373] block mt-1">
                  Fixed target due date
                </span>
              </button>

              <button
                type="button"
                onClick={() => setScheduleType('flexible_week')}
                className={`p-3 border text-left cursor-pointer transition-all ${
                  scheduleType === 'flexible_week'
                    ? 'border-[#FF3E00] bg-[#FF3E00]/10 text-zinc-900 dark:text-[#F5F5F5]'
                    : 'border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] text-zinc-600 dark:text-[#A3A3A3]'
                }`}
              >
                <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wider text-[#FF3E00]">
                  <Sparkles className="w-3.5 h-3.5" />
                  ON THIS WEEK
                </div>
                <span className="text-[10px] font-bold text-zinc-500 dark:text-[#737373] block mt-1">
                  Flexible anytime during week
                </span>
              </button>
            </div>
          </div>

          {/* Category Picker */}
          <div>
            <label className="block text-[10px] font-black text-zinc-600 dark:text-[#737373] uppercase tracking-[0.2em] mb-2">
              CATEGORY
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(CATEGORY_INFO).map(([key, info]) => {
                const isSelected = category === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCategory(key as CategoryType)}
                    className={`flex items-center gap-2 p-3 border text-xs font-bold uppercase tracking-wider text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#FF3E00] bg-[#FF3E00]/10 text-[#FF3E00]'
                        : 'border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] hover:border-zinc-500 text-zinc-700 dark:text-[#A3A3A3]'
                    }`}
                  >
                    <span className="truncate">{info.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recurrence Interval Builder */}
          <div className="p-5 bg-zinc-50 dark:bg-[#171717] border border-zinc-300 dark:border-[#262626] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-[#FF3E00] uppercase tracking-[0.2em] flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                ALERT FREQUENCY (RECURRING INTERVAL) *
              </label>
            </div>

            {/* Interval Inputs */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-[#737373]">REPEAT EVERY</span>
              <input
                type="number"
                min="1"
                max="999"
                required
                value={intervalValue}
                onChange={(e) => setIntervalValue(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 px-3 py-2.5 border border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-zinc-900 dark:text-[#F5F5F5] font-black text-center focus:outline-hidden focus:border-[#FF3E00]"
              />
              <select
                value={intervalUnit}
                onChange={(e) => setIntervalUnit(e.target.value as IntervalUnit)}
                className="flex-1 px-3 py-2.5 border border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-zinc-900 dark:text-[#F5F5F5] font-bold uppercase tracking-wider focus:outline-hidden focus:border-[#FF3E00]"
              >
                <option value="days">DAYS</option>
                <option value="weeks">WEEKS</option>
                <option value="months">MONTHS</option>
                <option value="years">YEARS</option>
              </select>
            </div>

            {/* Quick Interval Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-[#525252]">QUICK:</span>
              <button
                type="button"
                onClick={() => handleQuickInterval(7, 'days')}
                className="px-2.5 py-1 bg-white dark:bg-[#121212] border border-zinc-300 dark:border-[#262626] hover:border-[#FF3E00] text-[10px] font-bold uppercase tracking-wider text-zinc-700 dark:text-[#A3A3A3] cursor-pointer"
              >
                1 WEEK
              </button>
              <button
                type="button"
                onClick={() => handleQuickInterval(14, 'days')}
                className="px-2.5 py-1 bg-white dark:bg-[#121212] border border-zinc-300 dark:border-[#262626] hover:border-[#FF3E00] text-[10px] font-bold uppercase tracking-wider text-zinc-700 dark:text-[#A3A3A3] cursor-pointer"
              >
                2 WEEKS
              </button>
              <button
                type="button"
                onClick={() => handleQuickInterval(30, 'days')}
                className="px-2.5 py-1 bg-white dark:bg-[#121212] border border-zinc-300 dark:border-[#262626] hover:border-[#FF3E00] text-[10px] font-bold uppercase tracking-wider text-zinc-700 dark:text-[#A3A3A3] cursor-pointer"
              >
                1 MONTH
              </button>
              <button
                type="button"
                onClick={() => handleQuickInterval(90, 'days')}
                className="px-2.5 py-1 bg-white dark:bg-[#121212] border border-zinc-300 dark:border-[#262626] hover:border-[#FF3E00] text-[10px] font-bold uppercase tracking-wider text-zinc-700 dark:text-[#A3A3A3] cursor-pointer"
              >
                3 MONTHS
              </button>
              <button
                type="button"
                onClick={() => handleQuickInterval(180, 'days')}
                className="px-2.5 py-1 bg-white dark:bg-[#121212] border border-zinc-300 dark:border-[#262626] hover:border-[#FF3E00] text-[10px] font-bold uppercase tracking-wider text-zinc-700 dark:text-[#A3A3A3] cursor-pointer"
              >
                6 MONTHS
              </button>
              <button
                type="button"
                onClick={() => handleQuickInterval(365, 'days')}
                className="px-2.5 py-1 bg-white dark:bg-[#121212] border border-zinc-300 dark:border-[#262626] hover:border-[#FF3E00] text-[10px] font-bold uppercase tracking-wider text-zinc-700 dark:text-[#A3A3A3] cursor-pointer"
              >
                1 YEAR
              </button>
            </div>
          </div>

          {/* Last Completed Date & Early Reminder Warning */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-zinc-600 dark:text-[#737373] uppercase tracking-[0.2em] mb-2 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#FF3E00]" />
                LAST COMPLETED DATE *
              </label>
              <input
                type="date"
                required
                value={lastCompletedDate}
                onChange={(e) => setLastCompletedDate(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] text-zinc-900 dark:text-[#F5F5F5] font-bold focus:outline-hidden focus:border-[#FF3E00]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-zinc-600 dark:text-[#737373] uppercase tracking-[0.2em] mb-2 flex items-center gap-1">
                <Bell className="w-3.5 h-3.5 text-[#FF3E00]" />
                ADVANCE ALERT WARNING
              </label>
              <select
                value={leadAlertDays}
                onChange={(e) => setLeadAlertDays(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] text-zinc-900 dark:text-[#F5F5F5] font-bold uppercase tracking-wider focus:outline-hidden focus:border-[#FF3E00]"
              >
                <option value={0}>ON THE EXACT DUE DATE</option>
                <option value={1}>1 DAY IN ADVANCE</option>
                <option value={2}>2 DAYS IN ADVANCE</option>
                <option value={3}>3 DAYS IN ADVANCE</option>
                <option value={7}>1 WEEK IN ADVANCE</option>
                <option value={14}>2 WEEKS IN ADVANCE</option>
                <option value={30}>1 MONTH IN ADVANCE</option>
              </select>
            </div>
          </div>

          {/* Model / Part Number & Optional Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-zinc-600 dark:text-[#737373] uppercase tracking-[0.2em] mb-2 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-[#FF3E00]" />
                MODEL / PART / FILTER #
              </label>
              <input
                type="text"
                placeholder="e.g. FILTER #RPWFE, 5W-30"
                value={modelOrPartNumber}
                onChange={(e) => setModelOrPartNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] text-zinc-900 dark:text-[#F5F5F5] placeholder-zinc-400 dark:placeholder-[#525252] font-bold focus:outline-hidden focus:border-[#FF3E00]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-zinc-600 dark:text-[#737373] uppercase tracking-[0.2em] mb-2 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-[#FF3E00]" />
                ESTIMATED COST
              </label>
              <input
                type="text"
                placeholder="e.g. $25 OR FREE / DIY"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] text-zinc-900 dark:text-[#F5F5F5] placeholder-zinc-400 dark:placeholder-[#525252] font-bold focus:outline-hidden focus:border-[#FF3E00]"
              />
            </div>
          </div>

          {/* Custom Notes */}
          <div>
            <label className="block text-[10px] font-black text-zinc-600 dark:text-[#737373] uppercase tracking-[0.2em] mb-2">
              SPECIFIC INSTRUCTIONS OR NOTES
            </label>
            <textarea
              rows={2}
              placeholder="e.g., Hold reset button on fridge for 3 seconds; check pressure levels..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] text-zinc-900 dark:text-[#F5F5F5] placeholder-zinc-400 dark:placeholder-[#525252] font-bold focus:outline-hidden focus:border-[#FF3E00]"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-zinc-200 dark:border-[#262626] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] text-xs font-bold uppercase tracking-widest text-zinc-700 dark:text-[#A3A3A3] hover:text-zinc-900 dark:hover:text-[#F5F5F5] transition-colors cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              id="save-task-button"
              className="px-6 py-3 bg-[#FF3E00] hover:bg-[#FF3E00]/90 text-black font-black text-xs uppercase tracking-widest transition-colors cursor-pointer shadow-xs"
            >
              {initialTask ? 'UPDATE SCHEDULE' : 'SAVE ALERT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

