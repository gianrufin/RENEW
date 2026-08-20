import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Calendar, DollarSign, FileText, ArrowRight, X } from 'lucide-react';
import { MaintenanceTask, IntervalUnit } from '../types';
import { calculateNextDueDate, formatDateDisplay, formatInterval } from '../utils/dateUtils';

interface CompleteTaskModalProps {
  task: MaintenanceTask | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (taskId: string, logData: { completedDate: string; cost?: number; notes?: string }) => void;
}

export const CompleteTaskModal: React.FC<CompleteTaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onConfirm
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [completedDate, setCompletedDate] = useState(todayStr);
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCompletedDate(todayStr);
      setCost('');
      setNotes('');

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b']
        });
      } catch {
        // Safe catch
      }
    }
  }, [isOpen]);

  if (!isOpen || !task) return null;

  const nextDueDate = calculateNextDueDate(
    completedDate,
    task.intervalValue,
    task.intervalUnit
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(task.id, {
      completedDate,
      cost: cost ? parseFloat(cost) : undefined,
      notes: notes.trim() || undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div 
        id="complete-modal-container"
        className="w-full max-w-md bg-[#121212] border border-[#262626] shadow-2xl overflow-hidden"
      >
        {/* Header with Celebration Banner */}
        <div className="p-6 bg-[#171717] border-b border-[#262626] text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 border border-[#262626] bg-[#121212] text-[#737373] hover:text-[#F5F5F5] hover:border-[#525252] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 border border-[#FF3E00] bg-[#FF3E00]/10 text-[#FF3E00] mx-auto flex items-center justify-center mb-3">
            <CheckCircle2 className="w-6 h-6 stroke-[3]" />
          </div>

          <h3 className="text-xl font-black uppercase tracking-tight text-[#F5F5F5] font-display">
            LOG COMPLETION
          </h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#FF3E00] mt-1">
            {task.title}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          {/* New Cycle Preview Box */}
          <div className="p-4 border border-[#262626] bg-[#171717] flex items-center justify-between text-xs">
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#737373] block">INTERVAL</span>
              <span className="font-black text-[#F5F5F5] uppercase text-xs">
                {formatInterval(task.intervalValue, task.intervalUnit)}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#FF3E00]" />
            <div className="text-right">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#737373] block">NEXT DUE</span>
              <span className="font-black text-[#FF3E00] uppercase text-xs">
                {formatDateDisplay(nextDueDate.toISOString().split('T')[0])}
              </span>
            </div>
          </div>

          {/* Date performed */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#737373] mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#525252]" />
              COMPLETED ON
            </label>
            <input
              type="date"
              required
              value={completedDate}
              onChange={(e) => setCompletedDate(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-[#262626] bg-[#171717] text-[#F5F5F5] font-bold text-xs focus:outline-hidden focus:border-[#FF3E00]"
            />
          </div>

          {/* Cost Spent */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#737373] mb-1.5 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-[#525252]" />
              EXPENSE / REPLACEMENT COST (OPTIONAL)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-[#737373] text-xs font-bold">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full pl-8 pr-3.5 py-2.5 border border-[#262626] bg-[#171717] text-[#F5F5F5] placeholder-[#525252] font-bold text-xs focus:outline-hidden focus:border-[#FF3E00]"
              />
            </div>
          </div>

          {/* Maintenance Log Note */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#737373] mb-1.5 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-[#525252]" />
              SERVICE NOTES / PART NUMBERS (OPTIONAL)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Swapped to new filter; OEM part #..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-[#262626] bg-[#171717] text-[#F5F5F5] placeholder-[#525252] text-xs focus:outline-hidden focus:border-[#FF3E00]"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#262626]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-[#262626] bg-[#171717] text-[#A3A3A3] hover:text-[#F5F5F5] hover:border-[#525252] font-black text-xs uppercase tracking-widest transition-colors cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              id="confirm-complete-button"
              className="px-5 py-2.5 bg-[#FF3E00] hover:bg-[#FF3E00]/90 text-[#0A0A0A] font-black text-xs uppercase tracking-widest transition-colors cursor-pointer"
            >
              CONFIRM & RESET TIMER
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
