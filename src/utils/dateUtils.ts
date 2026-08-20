import { MaintenanceTask, IntervalUnit, TaskStatus } from '../types';

export function calculateNextDueDate(
  lastCompletedDateStr: string,
  intervalValue: number,
  intervalUnit: IntervalUnit,
  snoozeUntilStr?: string | null
): Date {
  if (snoozeUntilStr) {
    const snoozeDate = new Date(snoozeUntilStr);
    if (!isNaN(snoozeDate.getTime())) {
      return snoozeDate;
    }
  }

  const baseDate = new Date(lastCompletedDateStr + 'T00:00:00');
  const result = new Date(baseDate);

  switch (intervalUnit) {
    case 'days':
      result.setDate(result.getDate() + intervalValue);
      break;
    case 'weeks':
      result.setDate(result.getDate() + intervalValue * 7);
      break;
    case 'months':
      result.setMonth(result.getMonth() + intervalValue);
      break;
    case 'years':
      result.setFullYear(result.getFullYear() + intervalValue);
      break;
  }

  return result;
}

export function getDaysRemaining(task: MaintenanceTask): number {
  const nextDueDate = calculateNextDueDate(
    task.lastCompletedDate,
    task.intervalValue,
    task.intervalUnit,
    task.snoozeUntil
  );
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(nextDueDate);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function getTaskStatus(task: MaintenanceTask): TaskStatus {
  const todayStr = new Date().toISOString().split('T')[0];
  if (task.lastCompletedDate === todayStr) {
    return 'completed_today';
  }

  const daysRemaining = getDaysRemaining(task);
  if (daysRemaining < 0) {
    return 'overdue';
  }
  
  const leadAlertDays = task.leadAlertDays ?? 3;
  if (daysRemaining <= leadAlertDays) {
    return 'due_soon';
  }

  return 'on_track';
}

export function getProgressPercentage(task: MaintenanceTask): number {
  const last = new Date(task.lastCompletedDate + 'T00:00:00').getTime();
  const next = calculateNextDueDate(task.lastCompletedDate, task.intervalValue, task.intervalUnit).getTime();
  const now = new Date().getTime();

  const totalDuration = next - last;
  if (totalDuration <= 0) return 100;

  const elapsed = now - last;
  const percentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  return Math.round(percentage);
}

export function formatInterval(value: number, unit: IntervalUnit): string {
  if (value === 1) {
    switch (unit) {
      case 'days': return 'Every Day';
      case 'weeks': return 'Every Week';
      case 'months': return 'Every Month';
      case 'years': return 'Every Year';
    }
  }
  return `Every ${value} ${unit}`;
}

export function formatDateDisplay(dateStr: string): string {
  try {
    const d = new Date(dateStr + (dateStr.length <= 10 ? 'T00:00:00' : ''));
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

// Generate an ICS calendar event for an individual task
export function generateTaskIcs(task: MaintenanceTask): string {
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

  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//RemindMe Household Alerts//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${task.id}-${Date.now()}@remindme.local
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${dtStart}
SUMMARY:🔧 Maintenance: ${task.title}
DESCRIPTION:${task.notes || 'Household recurring maintenance reminder'} (Frequency: ${formatInterval(task.intervalValue, task.intervalUnit)})
RRULE:FREQ=${freq};INTERVAL=${interval}
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:Reminder for ${task.title}
TRIGGER:-P${task.leadAlertDays || 0}D
END:VALARM
END:VEVENT
END:VCALENDAR`;

  return ics;
}

// Download .ICS helper
export function downloadIcs(filename: string, icsContent: string) {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
