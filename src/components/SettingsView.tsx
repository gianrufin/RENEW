import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Laptop, 
  Cloud, 
  CloudCheck, 
  CloudUpload, 
  CloudDownload, 
  Bell, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Download, 
  Upload, 
  Check, 
  AlertTriangle, 
  RefreshCw, 
  Smartphone,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { ThemePreference, GoogleDriveBackupSettings, MaintenanceTask } from '../types';
import { requestGoogleDriveAccessToken, uploadBackupToDrive, downloadBackupFromDrive } from '../utils/googleDrive';
import { sound } from '../utils/sound';

interface SettingsViewProps {
  theme: ThemePreference;
  onThemeChange: (theme: ThemePreference) => void;
  driveSettings: GoogleDriveBackupSettings;
  onDriveSettingsChange: (settings: GoogleDriveBackupSettings) => void;
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
  driveSettings,
  onDriveSettingsChange,
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
  const [isSyncingDrive, setIsSyncingDrive] = useState(false);
  const [driveMessage, setDriveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [localExported, setLocalExported] = useState(false);

  // Connect Google Drive
  const handleConnectDrive = async () => {
    try {
      setIsSyncingDrive(true);
      setDriveMessage(null);
      const authResult = await requestGoogleDriveAccessToken();
      
      const newSettings: GoogleDriveBackupSettings = {
        ...driveSettings,
        accessToken: authResult.accessToken,
        connectedEmail: authResult.email || 'Google Drive Connected',
        tokenExpiresAt: Date.now() + authResult.expiresIn * 1000,
        autoBackupDaily: true
      };

      // Perform initial backup
      const backupRes = await uploadBackupToDrive(tasks, authResult.accessToken);
      newSettings.lastBackupDate = backupRes.backupDate;
      newSettings.backupFileId = backupRes.fileId;

      onDriveSettingsChange(newSettings);
      setDriveMessage({ type: 'success', text: `Connected as ${authResult.email || 'Google Account'} & backed up ${tasks.length} tasks!` });
      sound.playSuccess();
    } catch (err: any) {
      console.error('Google Drive auth error:', err);
      setDriveMessage({ type: 'error', text: err.message || 'Failed to authenticate Google Drive' });
    } finally {
      setIsSyncingDrive(false);
    }
  };

  // Manual Backup to Google Drive
  const handleManualBackup = async () => {
    if (!driveSettings.accessToken) {
      handleConnectDrive();
      return;
    }

    try {
      setIsSyncingDrive(true);
      setDriveMessage(null);
      const result = await uploadBackupToDrive(tasks, driveSettings.accessToken);
      
      onDriveSettingsChange({
        ...driveSettings,
        lastBackupDate: result.backupDate,
        backupFileId: result.fileId
      });

      setDriveMessage({ type: 'success', text: `Backup complete! Saved ${result.taskCount} tasks to Google Drive.` });
      sound.playSuccess();
    } catch (err: any) {
      console.error('Manual drive backup error:', err);
      // If unauthorized token, prompt reconnect
      if (err.message?.includes('401') || err.message?.includes('token') || err.message?.includes('Status 401')) {
        setDriveMessage({ type: 'error', text: 'Session expired. Reconnecting Google Drive...' });
        handleConnectDrive();
      } else {
        setDriveMessage({ type: 'error', text: err.message || 'Failed to backup to Google Drive' });
      }
    } finally {
      setIsSyncingDrive(false);
    }
  };

  // Restore from Google Drive
  const handleRestoreFromDrive = async () => {
    if (!driveSettings.accessToken) {
      handleConnectDrive();
      return;
    }

    if (!window.confirm('Restore schedules from Google Drive? This will update your local task database with the cloud backup.')) {
      return;
    }

    try {
      setIsSyncingDrive(true);
      setDriveMessage(null);
      const restoreResult = await downloadBackupFromDrive(driveSettings.accessToken);
      onRestoreTasks(restoreResult.tasks);
      setDriveMessage({ type: 'success', text: `Restored ${restoreResult.tasks.length} schedules from Google Drive backup (${new Date(restoreResult.backupDate).toLocaleDateString()})!` });
      sound.playSuccess();
    } catch (err: any) {
      console.error('Drive restore error:', err);
      setDriveMessage({ type: 'error', text: err.message || 'Failed to download backup from Google Drive' });
    } finally {
      setIsSyncingDrive(false);
    }
  };

  const handleDisconnectDrive = () => {
    onDriveSettingsChange({
      autoBackupDaily: false,
      accessToken: undefined,
      connectedEmail: undefined,
      tokenExpiresAt: undefined,
      lastBackupDate: driveSettings.lastBackupDate,
      backupFileId: driveSettings.backupFileId
    });
    setDriveMessage({ type: 'success', text: 'Google Drive disconnected from local device.' });
  };

  // Local JSON file export
  const handleExportLocalJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `remindme_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setLocalExported(true);
    setTimeout(() => setLocalExported(false), 3000);
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
            alert(`Imported ${parsed.length} tasks successfully!`);
          } else if (parsed && Array.isArray(parsed.tasks)) {
            onRestoreTasks(parsed.tasks);
            sound.playSuccess();
            alert(`Imported ${parsed.tasks.length} tasks successfully!`);
          }
        } catch {
          alert('Invalid JSON backup file.');
        }
      };
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="p-6 sm:p-8 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#121212]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black tracking-[0.2em] uppercase px-2 py-0.5 border border-[#FF3E00] bg-[#FF3E00]/10 text-[#FF3E00]">
            CONTROL CENTER
          </span>
          <span className="text-[10px] font-bold text-zinc-500 dark:text-[#737373] tracking-widest uppercase">
            SETTINGS & CLOUD MIRROR
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-900 dark:text-[#F5F5F5] font-display">
          APPLICATION SETTINGS<span className="text-[#FF3E00]">.</span>
        </h2>
        <p className="text-xs text-zinc-600 dark:text-[#A3A3A3] uppercase font-bold tracking-wider mt-1">
          Customize display themes, configure automatic Google Drive backups, manage alerts, and export data.
        </p>
      </div>

      {/* 1. Theme Selector Section */}
      <div className="p-6 border border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#121212] space-y-4">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-[#F5F5F5] flex items-center gap-2">
            <Sun className="w-4 h-4 text-[#FF3E00]" />
            APPEARANCE & THEME
          </h3>
          <p className="text-xs text-zinc-500 dark:text-[#737373] uppercase font-bold tracking-wider mt-0.5">
            Select between Dark brutalist mode, clean Light mode, or System OS match.
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

      {/* 2. Google Drive Auto-Backup Section */}
      <div className="p-6 border-2 border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#121212] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-[#F5F5F5] flex items-center gap-2">
                <Cloud className="w-4 h-4 text-[#FF3E00]" />
                GOOGLE DRIVE AUTO-BACKUP
              </h3>
              {driveSettings.accessToken ? (
                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-emerald-500/10 border border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  CONNECTED
                </span>
              ) : (
                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-zinc-100 dark:bg-[#171717] border border-zinc-300 dark:border-[#262626] text-zinc-500">
                  OFFLINE
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 dark:text-[#737373] uppercase font-bold tracking-wider mt-0.5">
              Securely back up your maintenance timelines once daily to your personal Google Drive account.
            </p>
          </div>

          {driveSettings.accessToken ? (
            <button
              type="button"
              onClick={handleDisconnectDrive}
              className="text-xs font-bold uppercase tracking-wider text-red-500 hover:underline self-start sm:self-auto cursor-pointer"
            >
              Disconnect
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConnectDrive}
              disabled={isSyncingDrive}
              className="px-5 py-2.5 bg-[#FF3E00] hover:bg-[#FF3E00]/90 text-black font-black text-xs uppercase tracking-widest cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <CloudUpload className="w-4 h-4 stroke-[3]" />
              {isSyncingDrive ? 'CONNECTING...' : 'CONNECT GOOGLE DRIVE'}
            </button>
          )}
        </div>

        {/* Status Box */}
        {driveMessage && (
          <div className={`p-3.5 border text-xs font-bold flex items-center gap-2.5 ${
            driveMessage.type === 'success'
              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
              : 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-400'
          }`}>
            {driveMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{driveMessage.text}</span>
          </div>
        )}

        {/* Connected state controls */}
        {driveSettings.accessToken && (
          <div className="p-4 border border-zinc-200 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-[#737373] block">
                  CONNECTED ACCOUNT:
                </span>
                <span className="font-bold text-zinc-900 dark:text-[#F5F5F5]">
                  {driveSettings.connectedEmail || 'Google Drive Authorized'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-[#737373] block">
                  LAST BACKUP DATE:
                </span>
                <span className="font-bold text-[#FF3E00]">
                  {driveSettings.lastBackupDate 
                    ? new Date(driveSettings.lastBackupDate).toLocaleString() 
                    : 'Pending initial sync'}
                </span>
              </div>
            </div>

            {/* Daily auto backup toggle */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-200 dark:border-[#262626]">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-[#F5F5F5] block">
                  Auto-Backup Once Daily
                </span>
                <span className="text-[10px] text-zinc-500 dark:text-[#737373] uppercase font-bold tracking-wider">
                  Silently uploads latest schedule when launching or updating items
                </span>
              </div>
              <button
                type="button"
                onClick={() => onDriveSettingsChange({
                  ...driveSettings,
                  autoBackupDaily: !driveSettings.autoBackupDaily
                })}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  driveSettings.autoBackupDaily ? 'bg-[#FF3E00]' : 'bg-zinc-300 dark:bg-[#262626]'
                }`}
              >
                <div className={`bg-black dark:bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  driveSettings.autoBackupDaily ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Manual buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleManualBackup}
                disabled={isSyncingDrive}
                className="px-4 py-2 border border-zinc-900 dark:border-[#F5F5F5] bg-zinc-900 dark:bg-[#F5F5F5] text-white dark:text-[#0A0A0A] font-black text-xs uppercase tracking-widest cursor-pointer flex items-center gap-2 hover:opacity-90"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingDrive ? 'animate-spin' : ''}`} />
                BACKUP NOW
              </button>

              <button
                type="button"
                onClick={handleRestoreFromDrive}
                disabled={isSyncingDrive}
                className="px-4 py-2 border border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-zinc-700 dark:text-[#A3A3A3] hover:text-zinc-900 dark:hover:text-[#F5F5F5] font-black text-xs uppercase tracking-widest cursor-pointer flex items-center gap-2"
              >
                <CloudDownload className="w-3.5 h-3.5" />
                RESTORE FROM DRIVE
              </button>
            </div>
          </div>
        )}

        <div className="p-3 border border-zinc-200 dark:border-[#262626] bg-zinc-50/50 dark:bg-[#171717]/40 text-[11px] text-zinc-500 dark:text-[#737373] space-y-1">
          <p className="font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#FF3E00]" />
            SCOPED PERMISSION NOTICE:
          </p>
          <p>
            RemindMe only accesses files it creates (<code>drive.file</code> scope). Your personal Drive files and folders remain private and untouched.
          </p>
        </div>
      </div>

      {/* 3. Notifications & Splash Section */}
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
                className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] text-zinc-700 dark:text-[#A3A3A3] hover:text-zinc-900 cursor-pointer"
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

      {/* 4. Local File Backup Export / Import */}
      <div className="p-6 border border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#121212] space-y-4">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-[#F5F5F5] flex items-center gap-2">
            <Download className="w-4 h-4 text-[#FF3E00]" />
            OFFLINE FILE BACKUP & RESTORE
          </h3>
          <p className="text-xs text-zinc-500 dark:text-[#737373] uppercase font-bold tracking-wider mt-0.5">
            Download an offline JSON database file to transfer between devices without logging into Google.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleExportLocalJson}
            className="px-4 py-2 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] text-zinc-800 dark:text-[#F5F5F5] font-black text-xs uppercase tracking-widest hover:border-zinc-500 cursor-pointer flex items-center gap-2"
          >
            {localExported ? <Check className="w-4 h-4 text-emerald-500" /> : <Download className="w-4 h-4" />}
            {localExported ? 'EXPORTED JSON' : 'EXPORT BACKUP (.JSON)'}
          </button>

          <label className="px-4 py-2 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] text-zinc-800 dark:text-[#F5F5F5] font-black text-xs uppercase tracking-widest hover:border-zinc-500 cursor-pointer flex items-center gap-2">
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
    </div>
  );
}
