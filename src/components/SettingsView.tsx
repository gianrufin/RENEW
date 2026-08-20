import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Laptop, 
  Bell, 
  Volume2, 
  VolumeX, 
  Download, 
  Upload, 
  Check, 
  AlertTriangle, 
  HardDrive,
  Database,
  Trash2,
  RefreshCw,
  Info,
  ShieldCheck
} from 'lucide-react';
import { ThemePreference, MaintenanceTask } from '../types';
import { sound } from '../utils/sound';

interface SettingsViewProps {
  theme: ThemePreference;
  onThemeChange: (theme: ThemePreference) => void;
  tasks: MaintenanceTask[];
  onRestoreTasks: (newTasks: MaintenanceTask[]) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  notificationPermission: NotificationPermission | 'default';
  onRequestNotificationPermission: () => void;
  showMorningSplash: boolean;
  onToggleMorningSplash: (val: boolean) => void;
  onOpenMorningSplash: () => void;
}

export function SettingsView({
  theme,
  onThemeChange,
  tasks,
  onRestoreTasks,
  soundEnabled,
  onToggleSound,
  notificationPermission,
  onRequestNotificationPermission,
  showMorningSplash,
  onToggleMorningSplash,
  onOpenMorningSplash
}: SettingsViewProps) {
  const [localExported, setLocalExported] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Local JSON file export
  const handleExportLocalJson = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `remindme_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setLocalExported(true);
      setStatusMessage({ type: 'success', text: `Successfully exported ${tasks.length} tasks to JSON backup file.` });
      sound.playSuccess();
      setTimeout(() => setLocalExported(false), 3000);
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to export backup JSON.' });
    }
  };

  // Local JSON file import
  const handleImportLocalJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            onRestoreTasks(parsed);
            sound.playSuccess();
            setStatusMessage({ type: 'success', text: `Imported ${parsed.length} tasks successfully!` });
          } else if (parsed && Array.isArray(parsed.tasks)) {
            onRestoreTasks(parsed.tasks);
            sound.playSuccess();
            setStatusMessage({ type: 'success', text: `Imported ${parsed.tasks.length} tasks successfully!` });
          } else {
            setStatusMessage({ type: 'error', text: 'Invalid JSON backup format.' });
          }
        } catch {
          setStatusMessage({ type: 'error', text: 'Could not parse JSON backup file.' });
        }
      };
    }
  };

  // Total history logs count
  const totalHistoryCount = tasks.reduce((sum, t) => sum + (t.history?.length || 0), 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="p-6 sm:p-8 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#121212]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black tracking-[0.2em] uppercase px-2 py-0.5 border border-[#FF3E00] bg-[#FF3E00]/10 text-[#FF3E00]">
            CONTROL CENTER
          </span>
          <span className="text-[10px] font-bold text-zinc-500 dark:text-[#737373] tracking-widest uppercase">
            LOCAL SETTINGS & STORAGE
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-900 dark:text-[#F5F5F5] font-display">
          APPLICATION SETTINGS<span className="text-[#FF3E00]">.</span>
        </h2>
        <p className="text-xs text-zinc-600 dark:text-[#A3A3A3] uppercase font-bold tracking-wider mt-1">
          Manage appearance themes, notification preferences, sound feedback, and local offline backups.
        </p>
      </div>

      {/* Status Feedback Message */}
      {statusMessage && (
        <div className={`p-4 border text-xs font-bold flex items-center justify-between gap-2.5 ${
          statusMessage.type === 'success'
            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
            : 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-400'
        }`}>
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{statusMessage.text}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setStatusMessage(null)}
            className="text-[10px] uppercase underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1. Theme Selector Section */}
      <div className="p-6 border border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#121212] space-y-4">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-[#F5F5F5] flex items-center gap-2">
            <Sun className="w-4 h-4 text-[#FF3E00]" />
            APPEARANCE & THEME
          </h3>
          <p className="text-xs text-zinc-500 dark:text-[#737373] uppercase font-bold tracking-wider mt-0.5">
            Select between Dark brutalist OLED mode, clean Light mode, or System OS match.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Dark Mode */}
          <button
            type="button"
            onClick={() => onThemeChange('dark')}
            className={`p-4 border-2 flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer ${
              theme === 'dark'
                ? 'border-[#FF3E00] bg-[#FF3E00]/10 text-[#FF3E00]'
                : 'border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] text-zinc-700 dark:text-[#A3A3A3] hover:border-zinc-400'
            }`}
          >
            <Moon className="w-6 h-6 stroke-[2.5]" />
            <span className="text-xs font-black uppercase tracking-widest">DARK</span>
            <span className="text-[9px] uppercase tracking-wider font-bold opacity-75">Brutalist OLED</span>
          </button>

          {/* Light Mode */}
          <button
            type="button"
            onClick={() => onThemeChange('light')}
            className={`p-4 border-2 flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer ${
              theme === 'light'
                ? 'border-[#FF3E00] bg-[#FF3E00]/10 text-[#FF3E00]'
                : 'border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] text-zinc-700 dark:text-[#A3A3A3] hover:border-zinc-400'
            }`}
          >
            <Sun className="w-6 h-6 stroke-[2.5]" />
            <span className="text-xs font-black uppercase tracking-widest">LIGHT</span>
            <span className="text-[9px] uppercase tracking-wider font-bold opacity-75">Clean Neutral</span>
          </button>

          {/* System Mode */}
          <button
            type="button"
            onClick={() => onThemeChange('system')}
            className={`p-4 border-2 flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer ${
              theme === 'system'
                ? 'border-[#FF3E00] bg-[#FF3E00]/10 text-[#FF3E00]'
                : 'border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] text-zinc-700 dark:text-[#A3A3A3] hover:border-zinc-400'
            }`}
          >
            <Laptop className="w-6 h-6 stroke-[2.5]" />
            <span className="text-xs font-black uppercase tracking-widest">SYSTEM</span>
            <span className="text-[9px] uppercase tracking-wider font-bold opacity-75">Auto Match OS</span>
          </button>
        </div>
      </div>

      {/* 2. Notifications & Daily Splash Briefing */}
      <div className="p-6 border border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#121212] space-y-4">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-[#F5F5F5] flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#FF3E00]" />
            NOTIFICATIONS & SPLASH REMINDERS
          </h3>
          <p className="text-xs text-zinc-500 dark:text-[#737373] uppercase font-bold tracking-wider mt-0.5">
            Configure full-screen splash alerts, browser push alerts, and audio chimes.
          </p>
        </div>

        <div className="space-y-3 divide-y divide-zinc-200 dark:divide-[#262626]">
          {/* Daily Alert Splash */}
          <div className="flex items-center justify-between pt-3 first:pt-0">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-[#F5F5F5] block">
                Daily Morning Alert Splash
              </span>
              <span className="text-[10px] text-zinc-500 dark:text-[#737373] uppercase font-bold tracking-wider">
                Displays high-priority summary briefing with quick actions on app launch
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onOpenMorningSplash}
                className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] text-zinc-700 dark:text-[#A3A3A3] hover:text-zinc-900 dark:hover:text-[#F5F5F5] cursor-pointer"
              >
                PREVIEW SPLASH
              </button>
              <button
                type="button"
                onClick={() => onToggleMorningSplash(!showMorningSplash)}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  showMorningSplash ? 'bg-[#FF3E00]' : 'bg-zinc-300 dark:bg-[#262626]'
                }`}
              >
                <div className={`bg-black dark:bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  showMorningSplash ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          {/* Browser Notifications */}
          <div className="flex items-center justify-between pt-3">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-[#F5F5F5] block">
                Web & Mobile Push Notifications
              </span>
              <span className="text-[10px] text-zinc-500 dark:text-[#737373] uppercase font-bold tracking-wider">
                Status: {notificationPermission === 'granted' ? 'Enabled' : notificationPermission === 'denied' ? 'Blocked' : 'Not Requested'}
              </span>
            </div>
            {notificationPermission !== 'granted' ? (
              <button
                type="button"
                onClick={onRequestNotificationPermission}
                className="px-3 py-1.5 bg-[#FF3E00] text-black font-black text-xs uppercase tracking-widest cursor-pointer"
              >
                ENABLE ALERTS
              </button>
            ) : (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 uppercase">
                <Check className="w-4 h-4 stroke-[3]" /> ACTIVE
              </span>
            )}
          </div>

          {/* Audio Chimes */}
          <div className="flex items-center justify-between pt-3">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-[#F5F5F5] block">
                Sound Effects & Chimes
              </span>
              <span className="text-[10px] text-zinc-500 dark:text-[#737373] uppercase font-bold tracking-wider">
                Audio feedback upon completing routines or clicking alarms
              </span>
            </div>
            <button
              type="button"
              onClick={onToggleSound}
              className={`p-2 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] cursor-pointer ${
                soundEnabled ? 'text-[#FF3E00] border-[#FF3E00]' : 'text-zinc-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Offline JSON Backup & Restore Section */}
      <div className="p-6 border border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#121212] space-y-4">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-[#F5F5F5] flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-[#FF3E00]" />
            LOCAL OFFLINE BACKUP & RESTORE
          </h3>
          <p className="text-xs text-zinc-500 dark:text-[#737373] uppercase font-bold tracking-wider mt-0.5">
            Export a full JSON backup of all your schedules and maintenance history, or import from a previous file.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleExportLocalJson}
            className="px-4 py-2.5 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] text-zinc-800 dark:text-[#F5F5F5] font-black text-xs uppercase tracking-widest hover:border-zinc-500 cursor-pointer flex items-center gap-2"
          >
            {localExported ? <Check className="w-4 h-4 text-emerald-500" /> : <Download className="w-4 h-4" />}
            {localExported ? 'EXPORTED JSON' : 'EXPORT BACKUP (.JSON)'}
          </button>

          <label className="px-4 py-2.5 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] text-zinc-800 dark:text-[#F5F5F5] font-black text-xs uppercase tracking-widest hover:border-zinc-500 cursor-pointer flex items-center gap-2">
            <Upload className="w-4 h-4" />
            IMPORT BACKUP (.JSON)
            <input
              type="file"
              accept=".json"
              onChange={handleImportLocalJson}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* 4. Local Storage Health & Diagnostics */}
      <div className="p-6 border border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#121212] space-y-4">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-[#F5F5F5] flex items-center gap-2">
            <Database className="w-4 h-4 text-[#FF3E00]" />
            LOCAL DATABASE STATUS
          </h3>
          <p className="text-xs text-zinc-500 dark:text-[#737373] uppercase font-bold tracking-wider mt-0.5">
            Overview of stored household items, service records, and local persistence.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3.5 border border-zinc-200 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717]">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-[#737373] block">
              TRACKED SCHEDULES
            </span>
            <span className="text-2xl font-black text-zinc-900 dark:text-[#F5F5F5] font-display mt-0.5 block">
              {tasks.length}
            </span>
          </div>

          <div className="p-3.5 border border-zinc-200 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717]">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-[#737373] block">
              SERVICE LOG ENTRIES
            </span>
            <span className="text-2xl font-black text-zinc-900 dark:text-[#F5F5F5] font-display mt-0.5 block">
              {totalHistoryCount}
            </span>
          </div>

          <div className="p-3.5 border border-zinc-200 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] col-span-2 sm:col-span-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-[#737373] block">
              STORAGE ENGINE
            </span>
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5 uppercase">
              <ShieldCheck className="w-4 h-4" /> OFFLINE FIRST
            </span>
          </div>
        </div>

        <div className="p-3 border border-zinc-200 dark:border-[#262626] bg-zinc-50/50 dark:bg-[#171717]/40 text-[11px] text-zinc-500 dark:text-[#737373] space-y-1">
          <p className="font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#FF3E00]" />
            DATA PRIVACY NOTICE:
          </p>
          <p>
            All schedules and maintenance logs are stored locally on your device in browser storage. No third-party accounts or cloud databases are connected.
          </p>
        </div>
      </div>
    </div>
  );
}
