import React from 'react';
import { X, History, Calendar, DollarSign, CheckCircle2 } from 'lucide-react';
import { MaintenanceTask } from '../types';
import { formatDateDisplay } from '../utils/dateUtils';

interface TaskHistoryModalProps {
  task: MaintenanceTask | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskHistoryModal: React.FC<TaskHistoryModalProps> = ({
  task,
  isOpen,
  onClose
}) => {
  if (!isOpen || !task) return null;

  const totalSpent = task.history.reduce((sum, entry) => sum + (entry.cost || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div 
        id="task-history-modal"
        className="w-full max-w-lg bg-[#121212] border border-[#262626] shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#262626] flex items-center justify-between bg-[#171717] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-[#262626] bg-[#121212] text-[#FF3E00]">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight text-[#F5F5F5] font-display">
                SERVICE & REPLACEMENT LOGS
              </h2>
              <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest truncate max-w-xs mt-0.5">
                {task.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 border border-[#262626] bg-[#121212] text-[#737373] hover:text-[#F5F5F5] hover:border-[#525252] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview Bar */}
        <div className="px-6 py-3 bg-[#171717] border-b border-[#262626] flex items-center justify-between text-xs flex-shrink-0">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#737373]">SERVICES LOGGED: </span>
            <strong className="text-[#F5F5F5] font-black ml-1">{task.history.length + 1} CYCLES</strong>
          </div>
          {totalSpent > 0 && (
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#737373]">RECORDED COST: </span>
              <strong className="text-[#FF3E00] font-black ml-1">${totalSpent.toFixed(2)}</strong>
            </div>
          )}
        </div>

        {/* History Log Timeline */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {/* Current / Last Completed Entry */}
          <div className="p-4 border border-[#FF3E00] bg-[#171717]">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-[#FF3E00]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#FF3E00]" />
                LATEST SERVICE RECORD
              </span>
              <span>{formatDateDisplay(task.lastCompletedDate)}</span>
            </div>
            {task.notes && (
              <p className="text-xs text-[#A3A3A3] mt-2 pl-5.5 leading-relaxed font-medium">
                {task.notes}
              </p>
            )}
          </div>

          {/* Past History Logs */}
          {task.history && task.history.length > 0 ? (
            task.history.map((entry, idx) => (
              <div
                key={entry.id || idx}
                className="p-4 border border-[#262626] bg-[#171717] text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between text-[#F5F5F5] font-bold">
                  <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-[#525252]" />
                    {formatDateDisplay(entry.completedDate)}
                  </span>
                  {entry.cost !== undefined && entry.cost > 0 && (
                    <span className="font-black text-[#FF3E00] flex items-center">
                      ${entry.cost.toFixed(2)}
                    </span>
                  )}
                </div>
                {entry.notes && (
                  <p className="text-[#A3A3A3] pl-5 leading-relaxed text-xs">
                    {entry.notes}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-xs text-[#525252] uppercase font-bold tracking-widest py-8">
              NO PREVIOUS SERVICE CYCLES LOGGED YET. CLICKING "MARK DONE" CREATES PERMANENT RECORDS.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#262626] bg-[#171717] flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#F5F5F5] hover:bg-white text-[#0A0A0A] font-black text-xs uppercase tracking-widest transition-colors cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
