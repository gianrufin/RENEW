import React from 'react';
import { CATEGORY_INFO } from '../data/presets';
import { ArrowUpDown } from 'lucide-react';

interface FilterBarProps {
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  sortBy: 'urgency' | 'due_date' | 'name' | 'category';
  onSortByChange: (sort: 'urgency' | 'due_date' | 'name' | 'category') => void;
  countsByCategory: Record<string, number>;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  sortBy,
  onSortByChange,
  countsByCategory,
  totalCount
}) => {
  return (
    <div className="w-full mb-8 space-y-4">
      {/* Top Filter Controls: Status Tabs & Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-[#121212] border border-zinc-300 dark:border-[#262626] overflow-x-auto scrollbar-none text-xs font-bold tracking-wider uppercase">
          <button
            onClick={() => onStatusFilterChange('all')}
            className={`px-3.5 py-1.5 transition-all whitespace-nowrap cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-zinc-900 dark:bg-[#F5F5F5] text-white dark:text-[#0A0A0A] font-black shadow-xs'
                : 'text-zinc-600 dark:text-[#A3A3A3] hover:text-zinc-900 dark:hover:text-[#F5F5F5]'
            }`}
          >
            ALL ({totalCount})
          </button>
          <button
            onClick={() => onStatusFilterChange('overdue')}
            className={`px-3.5 py-1.5 transition-all whitespace-nowrap cursor-pointer ${
              statusFilter === 'overdue'
                ? 'bg-[#FF3E00] text-black font-black shadow-xs'
                : 'text-zinc-600 dark:text-[#A3A3A3] hover:text-[#FF3E00]'
            }`}
          >
            ATTENTION REQUIRED
          </button>
          <button
            onClick={() => onStatusFilterChange('due_soon')}
            className={`px-3.5 py-1.5 transition-all whitespace-nowrap cursor-pointer ${
              statusFilter === 'due_soon'
                ? 'bg-zinc-900 dark:bg-[#F5F5F5] text-white dark:text-[#0A0A0A] font-black shadow-xs'
                : 'text-zinc-600 dark:text-[#A3A3A3] hover:text-zinc-900 dark:hover:text-[#F5F5F5]'
            }`}
          >
            DUE SOON
          </button>
          <button
            onClick={() => onStatusFilterChange('on_track')}
            className={`px-3.5 py-1.5 transition-all whitespace-nowrap cursor-pointer ${
              statusFilter === 'on_track'
                ? 'bg-zinc-900 dark:bg-[#F5F5F5] text-white dark:text-[#0A0A0A] font-black shadow-xs'
                : 'text-zinc-600 dark:text-[#A3A3A3] hover:text-zinc-900 dark:hover:text-[#F5F5F5]'
            }`}
          >
            ON TRACK
          </button>
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 dark:text-[#525252]" />
          <span className="text-zinc-500 dark:text-[#525252] font-bold tracking-widest uppercase hidden sm:inline">SORT:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as any)}
            className="px-3 py-2 border border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-zinc-900 dark:text-[#F5F5F5] font-bold text-xs tracking-wider uppercase focus:outline-hidden focus:border-[#FF3E00] cursor-pointer"
          >
            <option value="urgency">URGENCY FIRST</option>
            <option value="due_date">UPCOMING DUE DATE</option>
            <option value="name">TASK NAME (A-Z)</option>
            <option value="category">CATEGORY</option>
          </select>
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => onCategoryFilterChange('all')}
          className={`px-4 py-1.5 border transition-all whitespace-nowrap font-bold tracking-widest text-[11px] uppercase cursor-pointer ${
            categoryFilter === 'all'
              ? 'border-zinc-900 dark:border-[#F5F5F5] bg-zinc-900 dark:bg-[#F5F5F5] text-white dark:text-[#0A0A0A]'
              : 'border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-zinc-700 dark:text-[#A3A3A3] hover:border-zinc-500'
          }`}
        >
          ALL CATEGORIES
        </button>

        {Object.entries(CATEGORY_INFO).map(([key, info]) => {
          const count = countsByCategory[key] || 0;
          const isSelected = categoryFilter === key;

          return (
            <button
              key={key}
              onClick={() => onCategoryFilterChange(key)}
              className={`px-4 py-1.5 border transition-all whitespace-nowrap flex items-center gap-2 font-bold tracking-widest text-[11px] uppercase cursor-pointer ${
                isSelected
                  ? 'border-[#FF3E00] bg-[#FF3E00] text-black font-black'
                  : 'border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-zinc-700 dark:text-[#A3A3A3] hover:border-zinc-500'
              }`}
            >
              <span>{info.label}</span>
              {count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 font-black ${
                  isSelected ? 'bg-black text-[#FF3E00]' : 'bg-zinc-200 dark:bg-[#262626] text-zinc-800 dark:text-[#A3A3A3]'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
