import React from 'react';
import { 
  Bell, 
  Calendar, 
  DollarSign, 
  Settings, 
  Plus, 
  Sparkles,
  QrCode
} from 'lucide-react';
import { ActiveAppTab } from '../types';

interface BottomNavBarProps {
  activeTab: ActiveAppTab;
  onTabChange: (tab: ActiveAppTab) => void;
  onNewTask: () => void;
  onOpenQR: () => void;
  overdueCount: number;
  thisWeekCount: number;
}

export function BottomNavBar({
  activeTab,
  onTabChange,
  onNewTask,
  onOpenQR,
  overdueCount,
  thisWeekCount
}: BottomNavBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#121212]/95 border-t border-zinc-300 dark:border-[#262626] backdrop-blur-md pb-safe">
      <div className="max-w-md sm:max-w-xl mx-auto px-3 py-2 flex items-center justify-around relative">
        {/* Tab 1: Alerts / Dashboard */}
        <button
          type="button"
          onClick={() => onTabChange('alerts')}
          className={`flex flex-col items-center justify-center min-w-[64px] py-1 transition-colors cursor-pointer relative ${
            activeTab === 'alerts'
              ? 'text-[#FF3E00]'
              : 'text-zinc-500 dark:text-[#737373] hover:text-zinc-900 dark:hover:text-[#F5F5F5]'
          }`}
        >
          <div className="relative">
            <Bell className="w-5 h-5 stroke-[2.5]" />
            {overdueCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-[#FF3E00] text-black text-[9px] font-black rounded-full flex items-center justify-center">
                {overdueCount > 9 ? '9+' : overdueCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider mt-1">
            ALERTS
          </span>
        </button>

        {/* Tab 2: This Week */}
        <button
          type="button"
          onClick={() => onTabChange('this_week')}
          className={`flex flex-col items-center justify-center min-w-[64px] py-1 transition-colors cursor-pointer relative ${
            activeTab === 'this_week'
              ? 'text-[#FF3E00]'
              : 'text-zinc-500 dark:text-[#737373] hover:text-zinc-900 dark:hover:text-[#F5F5F5]'
          }`}
        >
          <div className="relative">
            <Calendar className="w-5 h-5 stroke-[2.5]" />
            {thisWeekCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-zinc-900 dark:bg-[#F5F5F5] text-white dark:text-black text-[9px] font-black rounded-full flex items-center justify-center">
                {thisWeekCount > 9 ? '9+' : thisWeekCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider mt-1">
            THIS WEEK
          </span>
        </button>

        {/* Center Floating Action Button (+) */}
        <div className="relative -top-5 flex flex-col items-center">
          <button
            type="button"
            onClick={onNewTask}
            aria-label="Add new schedule"
            className="w-12 h-12 bg-[#FF3E00] hover:bg-[#FF3E00]/90 text-black border-2 border-black dark:border-white shadow-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
          <span className="text-[8px] font-black uppercase tracking-widest text-[#FF3E00] mt-1">
            NEW
          </span>
        </div>

        {/* Tab 3: Costs & Budget */}
        <button
          type="button"
          onClick={() => onTabChange('budget_planner')}
          className={`flex flex-col items-center justify-center min-w-[64px] py-1 transition-colors cursor-pointer ${
            activeTab === 'budget_planner'
              ? 'text-[#FF3E00]'
              : 'text-zinc-500 dark:text-[#737373] hover:text-zinc-900 dark:hover:text-[#F5F5F5]'
          }`}
        >
          <DollarSign className="w-5 h-5 stroke-[2.5]" />
          <span className="text-[10px] font-black uppercase tracking-wider mt-1">
            COSTS
          </span>
        </button>

        {/* Tab 4: Settings */}
        <button
          type="button"
          onClick={() => onTabChange('settings')}
          className={`flex flex-col items-center justify-center min-w-[64px] py-1 transition-colors cursor-pointer ${
            activeTab === 'settings'
              ? 'text-[#FF3E00]'
              : 'text-zinc-500 dark:text-[#737373] hover:text-zinc-900 dark:hover:text-[#F5F5F5]'
          }`}
        >
          <Settings className="w-5 h-5 stroke-[2.5]" />
          <span className="text-[10px] font-black uppercase tracking-wider mt-1">
            SETTINGS
          </span>
        </button>
      </div>
    </div>
  );
}
