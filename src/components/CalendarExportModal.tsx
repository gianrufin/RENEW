import React, { useState } from 'react';
import { X, Calendar, Download, Check, Sparkles, AlertCircle } from 'lucide-react';
import { MaintenanceTask } from '../types';
import { calculateNextDueDate, downloadIcs, formatInterval, formatDateDisplay } from '../utils/dateUtils';

interface CalendarExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: MaintenanceTask[];
}

export const CalendarExportModal: React.FC<CalendarExportModalProps> = ({
  isOpen,
  onClose,
  tasks
}) => {
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleExportAll = () => {
    const activeTasks = tasks.filter(t => !t.isArchived);
    if (activeTasks.length === 0) return;

    let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//RemindMe Household Maintenance Alert Scheduler//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Household Maintenance Alerts
`;

    activeTasks.forEach((task) => {
      const nextDue = calculateNextDueDate(task.lastCompletedDate, task.intervalValue, task.intervalUnit);
      const year = nextDue.getFullYear();
      const month = String(nextDue.getMonth() + 1).padStart(2, '0');
      const day = String(nextDue.getDate()).padStart(2, '0');
      
      const [hours, mins] = (task.preferredTime || '09:00').split(':');
      const dtStart = `${year}${month}${day}T${hours || '09'}${mins || '00'}00`;
      
      let freq = 'DAILY';
      let interval = task.intervalValue;
      if (task.intervalUnit === 'weeks') {
        freq = 'WEEKLY';
      } else if (task.intervalUnit === 'months') {
        freq = 'MONTHLY';
      } else if (task.intervalUnit === 'years') {
        freq = 'YEARLY';
      }

      icsContent += `BEGIN:VEVENT
UID:${task.id}-${Date.now()}@remindme.local
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${dtStart}
SUMMARY:🔧 Maintenance: ${task.title}
DESCRIPTION:${task.notes || 'Household recurring maintenance reminder'} (Frequency: ${formatInterval(task.intervalValue, task.intervalUnit)})
RRULE:FREQ=${freq};INTERVAL=${interval}
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:Reminder: ${task.title}
TRIGGER:-P${task.leadAlertDays || 0}D
END:VALARM
END:VEVENT
`;
    });

    icsContent += `END:VCALENDAR`;

    downloadIcs('household_maintenance_schedule.ics', icsContent);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div 
        id="calendar-export-modal"
        className="w-full max-w-xl bg-[#121212] border border-[#262626] shadow-2xl overflow-hidden my-8"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#262626] flex items-center justify-between bg-[#171717]">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-[#262626] bg-[#121212] text-[#FF3E00]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight text-[#F5F5F5] font-display">
                SYNC WITH CALENDARS (.ICS)
              </h2>
              <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mt-0.5">
                GOOGLE CALENDAR, APPLE ICAL, OUTLOOK, AND MOBILE ALARMS
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

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-sm">
          <div className="p-4 border border-[#FF3E00] bg-[#171717] text-xs leading-relaxed text-[#F5F5F5]">
            <strong className="block mb-1 font-black text-[10px] uppercase tracking-[0.2em] text-[#FF3E00]">
              STANDARD ICALENDAR (.ICS) WITH RECURRING NOTIFICATIONS:
            </strong>
            Generates standardized .ICS calendar items with advance alert triggers for all <strong>{tasks.length} tracked items</strong>, ensuring your native phone and desktop calendars ping you before deadlines.
          </div>

          {/* Quick List preview */}
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#737373] block mb-2">
              SCHEDULE EXPORT PREVIEW:
            </span>
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 border border-[#262626] p-3 bg-[#171717] text-xs">
              {tasks.map(task => {
                const nextDue = calculateNextDueDate(task.lastCompletedDate, task.intervalValue, task.intervalUnit);
                return (
                  <div key={task.id} className="flex items-center justify-between py-1.5 px-2.5 border border-[#262626] bg-[#121212]">
                    <span className="font-bold text-[#F5F5F5] uppercase text-xs truncate">{task.title}</span>
                    <span className="text-[#FF3E00] font-black uppercase text-xs whitespace-nowrap pl-2">{formatDateDisplay(nextDue.toISOString().split('T')[0])}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* How to import guide */}
          <div className="space-y-2 text-xs text-[#A3A3A3]">
            <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-[#F5F5F5]">HOW TO IMPORT YOUR SCHEDULE:</h4>
            <ol className="list-decimal list-inside space-y-1 pl-1">
              <li>Click <strong>DOWNLOAD .ICS FILE</strong> below.</li>
              <li><strong>Apple / iOS:</strong> Tap the downloaded file to auto-import into Apple Calendar.</li>
              <li><strong>Google Calendar:</strong> Settings → Import & Export → Upload this file.</li>
            </ol>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-[#262626] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-[#262626] bg-[#171717] text-[#A3A3A3] hover:text-[#F5F5F5] hover:border-[#525252] font-black text-xs uppercase tracking-widest transition-colors cursor-pointer"
            >
              CANCEL
            </button>
            <button
              onClick={handleExportAll}
              className={`px-5 py-2.5 font-black text-xs uppercase tracking-widest flex items-center gap-1.5 transition-all cursor-pointer ${
                downloaded
                  ? 'bg-[#121212] border border-[#262626] text-[#F5F5F5]'
                  : 'bg-[#FF3E00] hover:bg-[#FF3E00]/90 text-[#0A0A0A]'
              }`}
            >
              {downloaded ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" /> EXPORTED (.ICS)
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 stroke-[3]" /> DOWNLOAD .ICS FILE
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
