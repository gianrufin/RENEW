import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Sparkles, 
  Layers, 
  Calendar, 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Search,
  RotateCcw,
  SlidersHorizontal,
  FileDown,
  QrCode,
  DollarSign,
  Settings,
  Flame,
  Wrench
} from 'lucide-react';
import { 
  MaintenanceTask, 
  PresetTemplate, 
  CategoryType, 
  ActiveAppTab, 
  ThemePreference 
} from './types';
import { PRESET_TEMPLATES } from './data/presets';
import { Navbar } from './components/Navbar';
import { StatsBanner } from './components/StatsBanner';
import { FilterBar } from './components/FilterBar';
import { TaskCard } from './components/TaskCard';
import { TaskModal } from './components/TaskModal';
import { CompleteTaskModal } from './components/CompleteTaskModal';
import { PresetsModal } from './components/PresetsModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { TaskHistoryModal } from './components/TaskHistoryModal';
import { CalendarExportModal } from './components/CalendarExportModal';
import { ThisWeekView } from './components/ThisWeekView';
import { BudgetPlannerView } from './components/BudgetPlannerView';
import { SettingsView } from './components/SettingsView';
import { QRAssetModal } from './components/QRAssetModal';
import { MorningSplashModal } from './components/MorningSplashModal';
import { BottomNavBar } from './components/BottomNavBar';
import { HeroLandingBanner } from './components/HeroLandingBanner';
import { DownloadAPKModal } from './components/DownloadAPKModal';
import { getTaskStatus, getDaysRemaining, calculateNextDueDate } from './utils/dateUtils';
import { sound } from './utils/sound';

const STORAGE_KEY = 'remindme_household_tasks_v2';
const SOUND_KEY = 'remindme_sound_enabled';
const THEME_KEY = 'remindme_theme_preference';
const SPLASH_LAST_DATE_KEY = 'remindme_splash_last_shown_date';

// Initial realistic default tasks matching the user's explicit prompt
const DEFAULT_INITIAL_TASKS: MaintenanceTask[] = [
  {
    id: 'init-toothbrush',
    title: 'Replace Toothbrush / Brush Head',
    category: 'personal',
    iconName: 'Smile',
    intervalValue: 90,
    intervalUnit: 'days',
    lastCompletedDate: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Due in 5 days!
    leadAlertDays: 7,
    preferredTime: '09:00',
    scheduleType: 'exact_date',
    notes: 'Dentist recommends replacing every 3 months before bristles fray and accumulate oral bacteria.',
    tips: ['Replace immediately if you recently recovered from illness', 'Store upright to air dry'],
    signsDue: ['Frayed/bent bristles', 'Faded indicator bristles'],
    estimatedCost: '$5 - $12',
    difficulty: 'Quick (5m)',
    history: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'init-bedsheets',
    title: 'Wash Bed Sheets & Duvet Cover',
    category: 'bedding',
    iconName: 'Bed',
    intervalValue: 14,
    intervalUnit: 'days',
    lastCompletedDate: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Overdue by 2 days!
    leadAlertDays: 2,
    preferredTime: '10:00',
    scheduleType: 'flexible_week',
    notes: 'Wash in hot water at 60°C (140°F) to sanitize and remove allergens and dust mites.',
    tips: ['Rotate between 2 sheet sets', 'Wash pillowcases weekly'],
    signsDue: ['Over 14 days since laundry load', 'Musty odor'],
    estimatedCost: 'Free / DIY',
    difficulty: 'Moderate (15-30m)',
    history: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'init-aircon',
    title: 'Clean / Wash Air Conditioner Filter',
    category: 'appliances',
    iconName: 'Wind',
    intervalValue: 30,
    intervalUnit: 'days',
    lastCompletedDate: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Due tomorrow!
    leadAlertDays: 3,
    preferredTime: '11:00',
    scheduleType: 'exact_date',
    notes: 'Rinse dust mesh with lukewarm water; ensure completely dry before snapping back in.',
    tips: ['Vacuum loose dust before rinsing', 'Clean indoor unit louvers with damp cloth'],
    signsDue: ['Reduced cooling airflow', 'Musty smell upon startup', 'Visible grey dust carpet on mesh'],
    estimatedCost: 'Free / DIY',
    difficulty: 'Quick (5m)',
    history: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'init-car-oil',
    title: 'Car Engine Oil & Filter Change',
    category: 'vehicle',
    iconName: 'Car',
    intervalValue: 180,
    intervalUnit: 'days',
    lastCompletedDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Due in 60 days
    leadAlertDays: 14,
    preferredTime: '09:00',
    scheduleType: 'exact_date',
    notes: 'Full synthetic 5W-30 motor oil with new OEM filter. Check tire pressure during service.',
    modelOrPartNumber: 'Fram #PH7317 / Mobil 1 5W-30',
    tips: ['Record odometer reading in task completion log', 'Check dipstick level while car is parked on flat surface'],
    signsDue: ['Maintenance service light on dashboard', 'Dark black oil on dipstick', '6 months elapsed'],
    estimatedCost: '$55 - $90',
    difficulty: 'Moderate (15-30m)',
    history: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'init-dog-vax',
    title: 'Dog Annual Rabies & DHPP Vaccination',
    category: 'pets',
    iconName: 'Dog',
    intervalValue: 365,
    intervalUnit: 'days',
    lastCompletedDate: new Date(Date.now() - 340 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Due in 25 days!
    leadAlertDays: 30,
    preferredTime: '14:00',
    scheduleType: 'exact_date',
    notes: 'Annual vet checkup, heartworm test, Rabies booster and DHPP (Distemper/Parvovirus).',
    tips: ['Book appointment 2-3 weeks in advance', 'Request digital immunization certificate'],
    signsDue: ['Vaccination certificate reaching 1-year expiration date'],
    estimatedCost: '$120 - $220',
    difficulty: 'In-Depth (1h+)',
    history: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'init-smoke-alarm',
    title: 'Test Smoke & Carbon Monoxide Detectors',
    category: 'safety',
    iconName: 'BellRing',
    intervalValue: 180,
    intervalUnit: 'days',
    lastCompletedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    leadAlertDays: 7,
    preferredTime: '12:00',
    scheduleType: 'flexible_week',
    notes: 'Hold test button on all hallway and bedroom detectors; replace 9V backup batteries if chirping.',
    tips: ['Clean sensor vents with canned air', 'Replace the entire smoke detector unit every 10 years'],
    signsDue: ['Intermittent low-battery chirp sound', '6 months since last test'],
    estimatedCost: '$5 - $15',
    difficulty: 'Quick (5m)',
    history: [],
    createdAt: new Date().toISOString()
  }
];

export default function App() {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<ActiveAppTab>('alerts');

  // Theme preference state (dark, light, system)
  const [theme, setTheme] = useState<ThemePreference>(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY) as ThemePreference;
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    } catch {}
    return 'dark'; // Default to bold typography dark archetype
  });

  // Load stored tasks or initial presets
  const [tasks, setTasks] = useState<MaintenanceTask[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load from storage', e);
    }
    return DEFAULT_INITIAL_TASKS;
  });

  // Sound toggle state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SOUND_KEY) !== 'false';
    } catch {
      return true;
    }
  });

  // Browser notification permission state
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'default'>('default');

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'urgency' | 'due_date' | 'name' | 'category'>('urgency');

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<MaintenanceTask | null>(null);

  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [completingTask, setCompletingTask] = useState<MaintenanceTask | null>(null);

  const [isPresetsModalOpen, setIsPresetsModalOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyTask, setHistoryTask] = useState<MaintenanceTask | null>(null);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrSelectedTask, setQrSelectedTask] = useState<MaintenanceTask | null>(null);
  const [isSplashOpen, setIsSplashOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // Apply Theme effect to <html> classList
  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = () => {
      if (theme === 'dark') {
        root.classList.add('dark');
      } else if (theme === 'light') {
        root.classList.remove('dark');
      } else {
        // System preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Save Theme preference
  const handleThemeChange = (newTheme: ThemePreference) => {
    setTheme(newTheme);
    try {
      localStorage.setItem(THEME_KEY, newTheme);
    } catch {}
  };

  // Save tasks to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks', e);
    }
  }, [tasks]);

  // Check notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Show Morning Splash briefing once per calendar day (or when overdue items exist on initial launch)
  useEffect(() => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const lastShown = localStorage.getItem(SPLASH_LAST_DATE_KEY);
      const hasOverdue = tasks.some(t => !t.isArchived && getTaskStatus(t) === 'overdue');

      if (lastShown !== todayStr && hasOverdue) {
        setIsSplashOpen(true);
        localStorage.setItem(SPLASH_LAST_DATE_KEY, todayStr);
      }
    } catch {}
  }, []);

  const handleRequestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
      if (perm === 'granted') {
        new Notification('RemindMe Alerts Enabled! 🎉', {
          body: 'You will receive reminders when household maintenance is due.',
          icon: '/favicon.ico'
        });
        sound.playSuccess();
      }
    }
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem(SOUND_KEY, String(next));
    if (next) {
      sound.playAlertChime();
    }
  };

  // Task Operations
  const handleSaveTask = (taskData: Partial<MaintenanceTask>) => {
    if (taskData.id) {
      // Update existing
      setTasks(prev => prev.map(t => t.id === taskData.id ? { ...t, ...taskData } as MaintenanceTask : t));
    } else {
      // Create new
      const newTask: MaintenanceTask = {
        id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        title: taskData.title || 'Untitled Task',
        category: taskData.category || 'other',
        iconName: taskData.iconName || 'CheckCircle2',
        intervalValue: taskData.intervalValue || 30,
        intervalUnit: taskData.intervalUnit || 'days',
        lastCompletedDate: taskData.lastCompletedDate || new Date().toISOString().split('T')[0],
        leadAlertDays: taskData.leadAlertDays ?? 3,
        preferredTime: taskData.preferredTime || '09:00',
        scheduleType: taskData.scheduleType || 'exact_date',
        notes: taskData.notes,
        modelOrPartNumber: taskData.modelOrPartNumber,
        productLink: taskData.productLink,
        estimatedCost: taskData.estimatedCost,
        difficulty: taskData.difficulty,
        tips: taskData.tips || [],
        signsDue: taskData.signsDue || [],
        history: [],
        createdAt: new Date().toISOString()
      };
      setTasks(prev => [newTask, ...prev]);
    }
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleSnoozeTask = (taskId: string, days: number) => {
    sound.playSnooze();
    const snoozeDate = new Date();
    snoozeDate.setDate(snoozeDate.getDate() + days);
    const snoozeStr = snoozeDate.toISOString().split('T')[0];

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          snoozeUntil: snoozeStr
        };
      }
      return t;
    }));
  };

  const handleOpenComplete = (task: MaintenanceTask) => {
    setCompletingTask(task);
    setIsCompleteModalOpen(true);
  };

  const handleConfirmComplete = (taskId: string, logData: { completedDate: string; cost?: number; notes?: string }) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const historyEntry = {
          id: 'log_' + Date.now(),
          completedDate: logData.completedDate,
          cost: logData.cost,
          notes: logData.notes
        };

        return {
          ...t,
          lastCompletedDate: logData.completedDate,
          snoozeUntil: null, // Clear snooze on fresh completion
          history: [historyEntry, ...(t.history || [])]
        };
      }
      return t;
    }));
  };

  const handleAddPreset = (preset: PresetTemplate) => {
    const newTask: MaintenanceTask = {
      id: 'preset_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      title: preset.title,
      category: preset.category,
      iconName: preset.iconName,
      intervalValue: preset.intervalValue,
      intervalUnit: preset.intervalUnit,
      lastCompletedDate: new Date().toISOString().split('T')[0],
      leadAlertDays: preset.defaultLeadAlertDays,
      preferredTime: '09:00',
      scheduleType: 'exact_date',
      notes: preset.description,
      tips: preset.tips,
      signsDue: preset.signsDue,
      estimatedCost: preset.estimatedCost,
      difficulty: preset.difficulty,
      history: [],
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
    sound.playSuccess();
  };

  const handleAddBundle = (presets: PresetTemplate[]) => {
    const newTasks: MaintenanceTask[] = presets.map((preset, idx) => ({
      id: 'bundle_' + Date.now() + '_' + idx,
      title: preset.title,
      category: preset.category,
      iconName: preset.iconName,
      intervalValue: preset.intervalValue,
      intervalUnit: preset.intervalUnit,
      lastCompletedDate: new Date().toISOString().split('T')[0],
      leadAlertDays: preset.defaultLeadAlertDays,
      preferredTime: '09:00',
      scheduleType: 'exact_date',
      notes: preset.description,
      tips: preset.tips,
      signsDue: preset.signsDue,
      estimatedCost: preset.estimatedCost,
      difficulty: preset.difficulty,
      history: [],
      createdAt: new Date().toISOString()
    }));

    setTasks(prev => [...newTasks, ...prev]);
    sound.playSuccess();
  };

  // Open QR modal targeting specific task or general scanner
  const handleOpenQRForTask = (task?: MaintenanceTask) => {
    setQrSelectedTask(task || null);
    setIsQRModalOpen(true);
  };

  // Counts by category
  const countsByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.filter(t => !t.isArchived).forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, [tasks]);

  const overdueTasksCount = useMemo(() => {
    return tasks.filter(t => !t.isArchived && getTaskStatus(t) === 'overdue').length;
  }, [tasks]);

  const thisWeekTasksCount = useMemo(() => {
    return tasks.filter(t => {
      if (t.isArchived) return false;
      const days = getDaysRemaining(t);
      return (days >= 0 && days <= 7) || t.scheduleType === 'flexible_week';
    }).length;
  }, [tasks]);

  // Filtered & Sorted Tasks for Alerts Dashboard
  const displayedTasks = useMemo(() => {
    return tasks
      .filter(t => !t.isArchived)
      .filter(t => {
        // Status filter
        if (statusFilter !== 'all') {
          const s = getTaskStatus(t);
          if (statusFilter === 'overdue' && s !== 'overdue') return false;
          if (statusFilter === 'due_soon' && s !== 'due_soon') return false;
          if (statusFilter === 'on_track' && (s !== 'on_track' && s !== 'completed_today')) return false;
        }

        // Category filter
        if (categoryFilter !== 'all' && t.category !== categoryFilter) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = t.title.toLowerCase().includes(q);
          const matchNotes = (t.notes || '').toLowerCase().includes(q);
          const matchPart = (t.modelOrPartNumber || '').toLowerCase().includes(q);
          return matchTitle || matchNotes || matchPart;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'urgency') {
          const daysA = getDaysRemaining(a);
          const daysB = getDaysRemaining(b);
          return daysA - daysB;
        }
        if (sortBy === 'due_date') {
          const dateA = calculateNextDueDate(a.lastCompletedDate, a.intervalValue, a.intervalUnit, a.snoozeUntil).getTime();
          const dateB = calculateNextDueDate(b.lastCompletedDate, b.intervalValue, b.intervalUnit, b.snoozeUntil).getTime();
          return dateA - dateB;
        }
        if (sortBy === 'name') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'category') {
          return a.category.localeCompare(b.category);
        }
        return 0;
      });
  }, [tasks, statusFilter, categoryFilter, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#F9F9FB] dark:bg-[#0A0A0A] text-zinc-900 dark:text-[#F5F5F5] flex flex-col antialiased selection:bg-[#FF3E00] selection:text-black pb-20 sm:pb-12 transition-colors duration-200">
      {/* Navigation Header */}
      <Navbar
        onNewTask={() => { setEditingTask(null); setIsTaskModalOpen(true); }}
        onOpenPresets={() => setIsPresetsModalOpen(true)}
        onOpenAI={() => setIsAIAssistantOpen(true)}
        onOpenCalendar={() => setIsCalendarModalOpen(true)}
        onOpenSplash={() => setIsSplashOpen(true)}
        onOpenQR={() => handleOpenQRForTask()}
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        notificationPermission={notificationPermission}
        onRequestNotificationPermission={handleRequestNotificationPermission}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        overdueCount={overdueTasksCount}
      />

      {/* Hero Landing & APK Download CTA Banner */}
      <HeroLandingBanner
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
        onOpenPresets={() => setIsPresetsModalOpen(true)}
        onOpenAI={() => setIsAIAssistantOpen(true)}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Desktop Tab Navigation Bar */}
        <div className="hidden sm:flex items-center gap-2 mb-6 border-b border-zinc-200 dark:border-[#262626] pb-3">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-2 text-xs font-black tracking-widest uppercase transition-all cursor-pointer border ${
              activeTab === 'alerts'
                ? 'bg-zinc-900 dark:bg-[#F5F5F5] text-white dark:text-[#0A0A0A] border-zinc-900 dark:border-[#F5F5F5]'
                : 'border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-zinc-600 dark:text-[#A3A3A3] hover:text-zinc-900 dark:hover:text-[#F5F5F5]'
            }`}
          >
            All Alerts ({tasks.filter(t => !t.isArchived).length})
          </button>

          <button
            onClick={() => setActiveTab('this_week')}
            className={`px-4 py-2 text-xs font-black tracking-widest uppercase transition-all cursor-pointer border flex items-center gap-1.5 ${
              activeTab === 'this_week'
                ? 'bg-zinc-900 dark:bg-[#F5F5F5] text-white dark:text-[#0A0A0A] border-zinc-900 dark:border-[#F5F5F5]'
                : 'border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-zinc-600 dark:text-[#A3A3A3] hover:text-zinc-900 dark:hover:text-[#F5F5F5]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#FF3E00]" />
            On This Week ({thisWeekTasksCount})
          </button>

          <button
            onClick={() => setActiveTab('budget_planner')}
            className={`px-4 py-2 text-xs font-black tracking-widest uppercase transition-all cursor-pointer border flex items-center gap-1.5 ${
              activeTab === 'budget_planner'
                ? 'bg-zinc-900 dark:bg-[#F5F5F5] text-white dark:text-[#0A0A0A] border-zinc-900 dark:border-[#F5F5F5]'
                : 'border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-zinc-600 dark:text-[#A3A3A3] hover:text-zinc-900 dark:hover:text-[#F5F5F5]'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            Annual Cost Planner
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-xs font-black tracking-widest uppercase transition-all cursor-pointer border flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-zinc-900 dark:bg-[#F5F5F5] text-white dark:text-[#0A0A0A] border-zinc-900 dark:border-[#F5F5F5]'
                : 'border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-zinc-600 dark:text-[#A3A3A3] hover:text-zinc-900 dark:hover:text-[#F5F5F5]'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Settings & Storage
          </button>
        </div>

        {/* TAB 1: ALL ALERTS DASHBOARD */}
        {activeTab === 'alerts' && (
          <div>
            {/* Bold Typography Massive Header */}
            <div className="pt-2 sm:pt-4 pb-6 border-b border-zinc-200 dark:border-[#262626] mb-8">
              <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.85] text-zinc-900 dark:text-[#F5F5F5] font-display">
                ALERTS<span className="text-[#FF3E00]">.</span>
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mt-6 gap-4">
                <div>
                  <p className="text-zinc-500 dark:text-[#A3A3A3] font-bold tracking-[0.2em] uppercase text-xs">
                    {tasks.filter(t => !t.isArchived).length} ACTIVE MAINTENANCE SCHEDULES
                  </p>
                  <p className="text-zinc-400 dark:text-[#525252] text-xs font-bold tracking-widest uppercase mt-1">
                    RECURRING TIMELINES & REPLENISHMENT
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="text-3xl sm:text-4xl font-black leading-none uppercase tracking-tight text-zinc-900 dark:text-[#F5F5F5] font-display">
                    {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date())}
                  </p>
                  <p className="text-[#FF3E00] text-xs font-black tracking-widest uppercase mt-1">
                    {new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date())}
                  </p>
                </div>
              </div>
            </div>

            {/* Dashboard Statistics & Health Metric */}
            <StatsBanner
              tasks={tasks}
              onFilterChange={setStatusFilter}
              currentFilter={statusFilter}
              onOpenPresets={() => setIsPresetsModalOpen(true)}
              onOpenAI={() => setIsAIAssistantOpen(true)}
            />

            {/* Filter & Sorting Strip */}
            <FilterBar
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={setCategoryFilter}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              countsByCategory={countsByCategory}
              totalCount={tasks.filter(t => !t.isArchived).length}
            />

            {/* Tasks Grid */}
            {displayedTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={handleOpenComplete}
                    onEdit={(t) => { setEditingTask(t); setIsTaskModalOpen(true); }}
                    onDelete={handleDeleteTask}
                    onSnooze={handleSnoozeTask}
                    onViewHistory={(t) => { setHistoryTask(t); setIsHistoryModalOpen(true); }}
                    onOpenQRTag={(t) => handleOpenQRForTask(t)}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="p-12 text-center border-2 border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#121212] max-w-lg mx-auto mt-6 space-y-4 shadow-sm">
                <div className="w-12 h-12 bg-zinc-100 dark:bg-[#171717] border border-zinc-300 dark:border-[#262626] text-[#FF3E00] mx-auto flex items-center justify-center">
                  <Sparkles className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 dark:text-[#F5F5F5] font-display">
                    NO MAINTENANCE TASKS FOUND
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-[#737373] mt-1 max-w-xs mx-auto uppercase tracking-wider font-bold">
                    {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                      ? 'Try clearing your active filters or search query.'
                      : 'Start tracking toothbrush replacement, bed sheets, AC filters, car oil, or pet care.'}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => { setSearchQuery(''); setStatusFilter('all'); setCategoryFilter('all'); }}
                    className="px-4 py-2 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-[#F5F5F5] hover:border-zinc-500 cursor-pointer"
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={() => setIsPresetsModalOpen(true)}
                    className="px-4 py-2 bg-zinc-900 dark:bg-[#F5F5F5] hover:opacity-90 text-white dark:text-[#0A0A0A] text-xs font-black uppercase tracking-widest cursor-pointer"
                  >
                    Starter Packs
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ON THIS WEEK VIEW */}
        {activeTab === 'this_week' && (
          <ThisWeekView
            tasks={tasks}
            onComplete={handleOpenComplete}
            onSnooze={handleSnoozeTask}
            onEdit={(t) => { setEditingTask(t); setIsTaskModalOpen(true); }}
            onNewTask={() => { setEditingTask(null); setIsTaskModalOpen(true); }}
          />
        )}

        {/* TAB 3: BUDGET & ANNUAL COST PLANNER */}
        {activeTab === 'budget_planner' && (
          <BudgetPlannerView
            tasks={tasks}
            onEditTask={(t) => { setEditingTask(t); setIsTaskModalOpen(true); }}
          />
        )}

        {/* TAB 4: SETTINGS & LOCAL STORAGE */}
        {activeTab === 'settings' && (
          <SettingsView
            theme={theme}
            onThemeChange={handleThemeChange}
            tasks={tasks}
            onRestoreTasks={(importedTasks) => {
              setTasks(importedTasks);
              sound.playSuccess();
            }}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            notificationPermission={notificationPermission}
            onRequestNotificationPermission={handleRequestNotificationPermission}
            showMorningSplash={true}
            onToggleMorningSplash={() => {}}
            onOpenMorningSplash={() => setIsSplashOpen(true)}
            onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
          />
        )}
      </main>

      {/* Bottom Navigation Bar (Mobile-first Android UX) */}
      <BottomNavBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNewTask={() => { setEditingTask(null); setIsTaskModalOpen(true); }}
        onOpenQR={() => handleOpenQRForTask()}
        overdueCount={overdueTasksCount}
        thisWeekCount={thisWeekTasksCount}
      />

      {/* Footer (Desktop) */}
      <footer className="hidden sm:block w-full border-t border-zinc-200 dark:border-[#262626] py-8 text-center text-xs text-zinc-500 dark:text-[#525252] mt-16 bg-white dark:bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold tracking-widest uppercase">RENEW • RECURRING MAINTENANCE ENGINE</span>
          <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest">
            <button 
              onClick={() => setIsCalendarModalOpen(true)} 
              className="text-zinc-600 dark:text-[#A3A3A3] hover:text-zinc-900 dark:hover:text-[#F5F5F5] transition-colors cursor-pointer"
            >
              Export .ICS
            </button>
            <span>/</span>
            <button 
              onClick={() => setIsAIAssistantOpen(true)} 
              className="text-[#FF3E00] hover:underline transition-colors cursor-pointer"
            >
              AI Advisor
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => { setIsTaskModalOpen(false); setEditingTask(null); }}
        onSave={handleSaveTask}
        initialTask={editingTask}
      />

      <CompleteTaskModal
        task={completingTask}
        isOpen={isCompleteModalOpen}
        onClose={() => { setIsCompleteModalOpen(false); setCompletingTask(null); }}
        onConfirm={handleConfirmComplete}
      />

      <PresetsModal
        isOpen={isPresetsModalOpen}
        onClose={() => setIsPresetsModalOpen(false)}
        existingTasks={tasks}
        onAddPreset={handleAddPreset}
        onAddBundle={handleAddBundle}
      />

      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        existingTasks={tasks}
        onAddTaskFromAI={handleSaveTask}
      />

      <TaskHistoryModal
        task={historyTask}
        isOpen={isHistoryModalOpen}
        onClose={() => { setIsHistoryModalOpen(false); setHistoryTask(null); }}
      />

      <CalendarExportModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        tasks={tasks}
      />

      <QRAssetModal
        isOpen={isQRModalOpen}
        onClose={() => { setIsQRModalOpen(false); setQrSelectedTask(null); }}
        tasks={tasks}
        initialTask={qrSelectedTask}
        onSelectTask={(task) => {
          setIsQRModalOpen(false);
          handleOpenComplete(task);
        }}
      />

      <MorningSplashModal
        isOpen={isSplashOpen}
        onClose={() => setIsSplashOpen(false)}
        tasks={tasks}
        onComplete={handleOpenComplete}
        onSnooze={handleSnoozeTask}
        onViewTask={(t) => { setEditingTask(t); setIsTaskModalOpen(true); }}
      />

      <DownloadAPKModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </div>
  );
}
