import React from 'react';
import { 
  Bell, 
  Plus, 
  Sparkles, 
  Calendar, 
  Layers, 
  Search, 
  QrCode, 
  CloudCheck, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon,
  Laptop
} from 'lucide-react';
import { ThemePreference } from '../types';

interface NavbarProps {
  onNewTask: () => void;
  onOpenPresets: () => void;
  onOpenAI: () => void;
  onOpenCalendar: () => void;
  onOpenSplash: () => void;
  onOpenQR: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  notificationPermission: NotificationPermission | 'default';
  onRequestNotificationPermission: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  overdueCount: number;
  isDriveConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewTask,
  onOpenPresets,
  onOpenAI,
  onOpenCalendar,
  onOpenSplash,
  onOpenQR,
  searchQuery,
  onSearchChange,
  notificationPermission,
  onRequestNotificationPermission,
  soundEnabled,
  onToggleSound,
  overdueCount,
  isDriveConnected
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-200 dark:border-[#262626] bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="text-xl sm:text-3xl font-black tracking-tighter uppercase text-zinc-900 dark:text-[#F5F5F5] font-display flex items-baseline">
              RENEW<span className="text-[#FF3E00]">.</span>
            </div>
            
            {/* Google Drive Status Badge */}
            {isDriveConnected && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                DRIVE SYNC
              </span>
            )}
          </div>

          {/* Search Input */}
          <div className="hidden md:flex flex-1 max-w-xs relative">
            <Search className="w-4 h-4 text-zinc-400 dark:text-[#525252] absolute left-3 top-2.5 sm:top-3" />
            <input
              type="text"
              placeholder="SEARCH ALERTS / TASKS..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 sm:py-2 text-xs font-bold tracking-wider rounded-none border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#121212] text-zinc-900 dark:text-[#F5F5F5] placeholder-zinc-400 dark:placeholder-[#525252] focus:outline-hidden focus:border-[#FF3E00] uppercase transition-all"
            />
          </div>

          {/* Action Buttons (Non-overlapping) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Daily Briefing Splash */}
            <button
              onClick={onOpenSplash}
              title="Open Daily Alert Briefing"
              className="px-2.5 sm:px-3 py-2 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#121212] text-zinc-800 dark:text-[#A3A3A3] hover:text-[#FF3E00] hover:border-[#FF3E00] font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-[#FF3E00]" />
              <span className="hidden sm:inline">BRIEFING</span>
              {overdueCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#FF3E00] text-black text-[9px] font-black flex items-center justify-center">
                  {overdueCount}
                </span>
              )}
            </button>

            {/* QR Asset Scanner */}
            <button
              onClick={onOpenQR}
              title="Scan or print appliance QR tags"
              className="p-2 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#121212] text-zinc-800 dark:text-[#A3A3A3] hover:text-zinc-900 dark:hover:text-[#F5F5F5] hover:border-zinc-500 cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* AI Advisor Button */}
            <button
              onClick={onOpenAI}
              id="btn-open-ai"
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] hover:border-[#FF3E00] text-zinc-900 dark:text-[#F5F5F5] font-bold text-xs tracking-widest uppercase transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF3E00]" />
              <span className="hidden sm:inline">AI Advisor</span>
            </button>

            {/* Starter Packs */}
            <button
              onClick={onOpenPresets}
              id="btn-open-presets"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#121212] text-zinc-700 dark:text-[#A3A3A3] hover:text-zinc-900 dark:hover:text-[#F5F5F5] font-bold text-xs tracking-widest uppercase transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              Packs
            </button>

            {/* Sync Calendar */}
            <button
              onClick={onOpenCalendar}
              title="Sync to Apple / Google Calendar"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#121212] text-zinc-700 dark:text-[#A3A3A3] hover:text-zinc-900 dark:hover:text-[#F5F5F5] font-bold text-xs tracking-widest uppercase transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              .ICS
            </button>

            {/* Create Custom Alert */}
            <button
              onClick={onNewTask}
              id="btn-create-task"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-[#FF3E00] hover:bg-[#FF3E00]/90 text-black font-black text-xs tracking-widest uppercase transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};


