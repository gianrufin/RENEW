export type CategoryType = 
  | 'personal'
  | 'bedding'
  | 'appliances'
  | 'vehicle'
  | 'pets'
  | 'safety'
  | 'outdoor'
  | 'tech'
  | 'other';

export type IntervalUnit = 'days' | 'weeks' | 'months' | 'years';

export type TaskStatus = 'overdue' | 'due_soon' | 'on_track' | 'completed_today';

export interface MaintenanceLogEntry {
  id: string;
  completedDate: string; // ISO date string YYYY-MM-DD
  cost?: number;
  notes?: string;
  performedBy?: string;
}

export type ThemePreference = 'dark' | 'light' | 'system';

export type ScheduleType = 'exact_date' | 'flexible_week';

export type ActiveAppTab = 'alerts' | 'this_week' | 'budget_planner' | 'qr_scanner' | 'settings';

export interface MaintenanceTask {
  id: string;
  title: string;
  category: CategoryType;
  iconName: string;
  intervalValue: number;
  intervalUnit: IntervalUnit;
  lastCompletedDate: string; // ISO date string YYYY-MM-DD
  leadAlertDays: number; // Alert X days before due (e.g. 3)
  preferredTime: string; // "09:00"
  scheduleType?: ScheduleType; // 'exact_date' or 'flexible_week'
  notes?: string;
  modelOrPartNumber?: string;
  productLink?: string;
  estimatedCost?: string;
  difficulty?: string;
  tips?: string[];
  signsDue?: string[];
  history: MaintenanceLogEntry[];
  snoozeUntil?: string | null; // ISO date string
  isArchived?: boolean;
  createdAt: string;
}

export interface PresetTemplate {
  id: string;
  title: string;
  category: CategoryType;
  iconName: string;
  intervalValue: number;
  intervalUnit: IntervalUnit;
  defaultLeadAlertDays: number;
  description: string;
  estimatedCost: string;
  difficulty: 'Quick (5m)' | 'Moderate (15-30m)' | 'In-Depth (1h+)';
  tips: string[];
  signsDue: string[];
  suggestedPartOrProduct?: string;
}

export interface LifestyleProfile {
  homeType: 'apartment' | 'house' | 'condo';
  hasCar: boolean;
  hasPets: boolean;
  hasGarden: boolean;
  occupantsCount: number;
}
