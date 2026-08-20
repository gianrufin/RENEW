import React, { useMemo } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingBag, 
  ExternalLink, 
  Calendar, 
  Wrench,
  CheckCircle2,
  Sparkles,
  PieChart,
  Tag
} from 'lucide-react';
import { MaintenanceTask, CategoryType } from '../types';
import { formatInterval } from '../utils/dateUtils';
import { DynamicIcon } from './DynamicIcon';

interface BudgetPlannerViewProps {
  tasks: MaintenanceTask[];
  onEditTask: (task: MaintenanceTask) => void;
}

export function BudgetPlannerView({ tasks, onEditTask }: BudgetPlannerViewProps) {
  const activeTasks = tasks.filter(t => !t.isArchived);

  // Calculate annual cost for each task
  const costBreakdown = useMemo(() => {
    let totalAnnualCost = 0;
    const categoryTotals: Record<CategoryType, number> = {
      personal: 0,
      bedding: 0,
      appliances: 0,
      vehicle: 0,
      pets: 0,
      safety: 0,
      outdoor: 0,
      tech: 0,
      other: 0
    };

    const taskCosts = activeTasks.map(task => {
      // Extract numerical estimate from string (e.g., "$15 - $30" -> 22.5, "$50" -> 50, "Free" -> 0)
      let costPerOccurrence = 0;
      if (task.estimatedCost && !task.estimatedCost.toLowerCase().includes('free')) {
        const matches = task.estimatedCost.match(/\d+(\.\d+)?/g);
        if (matches && matches.length > 0) {
          const numbers = matches.map(Number);
          costPerOccurrence = numbers.reduce((a, b) => a + b, 0) / numbers.length;
        }
      }

      // Calculate occurrences per year (365 days)
      let occurrencesPerYear = 1;
      if (task.intervalUnit === 'days') {
        occurrencesPerYear = 365 / Math.max(1, task.intervalValue);
      } else if (task.intervalUnit === 'weeks') {
        occurrencesPerYear = 52 / Math.max(1, task.intervalValue);
      } else if (task.intervalUnit === 'months') {
        occurrencesPerYear = 12 / Math.max(1, task.intervalValue);
      } else if (task.intervalUnit === 'years') {
        occurrencesPerYear = 1 / Math.max(1, task.intervalValue);
      }

      const annualCost = costPerOccurrence * occurrencesPerYear;
      const monthlyCost = annualCost / 12;

      totalAnnualCost += annualCost;
      categoryTotals[task.category] = (categoryTotals[task.category] || 0) + annualCost;

      return {
        task,
        costPerOccurrence,
        occurrencesPerYear,
        annualCost,
        monthlyCost
      };
    }).sort((a, b) => b.annualCost - a.annualCost);

    return {
      totalAnnualCost,
      totalMonthlyCost: totalAnnualCost / 12,
      categoryTotals,
      taskCosts
    };
  }, [activeTasks]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#121212]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black tracking-[0.2em] uppercase px-2 py-0.5 border border-[#FF3E00] bg-[#FF3E00]/10 text-[#FF3E00]">
                FINANCIAL FORECAST
              </span>
              <span className="text-[10px] font-bold text-zinc-500 dark:text-[#737373] tracking-widest uppercase">
                PREVENTATIVE MAINTENANCE BUDGET
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-900 dark:text-[#F5F5F5] font-display">
              COSTS & REPLACEMENTS<span className="text-[#FF3E00]">.</span>
            </h2>
            <p className="text-xs text-zinc-600 dark:text-[#A3A3A3] uppercase font-bold tracking-wider mt-1 max-w-xl">
              Annualized estimates for filters, oils, dental heads, vet visits, and OEM replacement parts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-4 border border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#171717] text-left sm:text-right min-w-[130px]">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF3E00] block">
                MONTHLY RUN-RATE
              </span>
              <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-[#F5F5F5] font-display">
                ${costBreakdown.totalMonthlyCost.toFixed(2)}
              </span>
            </div>
            <div className="p-4 border-2 border-zinc-900 dark:border-[#F5F5F5] bg-zinc-900 dark:bg-[#F5F5F5] text-white dark:text-[#0A0A0A] text-left sm:text-right min-w-[130px]">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-80 block">
                ANNUAL ESTIMATE
              </span>
              <span className="text-2xl sm:text-3xl font-black font-display">
                ${costBreakdown.totalAnnualCost.toFixed(0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown by Category */}
      <div className="p-6 border border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#121212] space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-[#F5F5F5] flex items-center gap-2">
          <PieChart className="w-4 h-4 text-[#FF3E00]" />
          ANNUAL EXPENSE BY CATEGORY
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(Object.entries(costBreakdown.categoryTotals) as [CategoryType, number][])
            .filter(([_, amount]) => amount > 0)
            .sort((a, b) => b[1] - a[1])
            .map(([cat, amount]) => (
              <div key={cat} className="p-3 border border-zinc-200 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717]">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-[#737373] block truncate">
                  {cat}
                </span>
                <span className="text-lg font-black text-zinc-900 dark:text-[#F5F5F5] font-display mt-0.5 block">
                  ${amount.toFixed(0)} <span className="text-[10px] text-zinc-400 font-normal">/yr</span>
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Task cost list & Part Reordering */}
      <div className="p-6 border border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#121212] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-[#F5F5F5] flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#FF3E00]" />
            RECURRING PARTS & SUPPLIES DIRECTORY
          </h3>
          <span className="text-[10px] font-bold text-zinc-500 dark:text-[#737373] uppercase tracking-wider">
            {activeTasks.length} TRACKED ITEMS
          </span>
        </div>

        <div className="divide-y divide-zinc-200 dark:divide-[#262626]">
          {costBreakdown.taskCosts.map(({ task, costPerOccurrence, occurrencesPerYear, annualCost }) => {
            const reorderUrl = task.productLink || `https://www.google.com/search?q=${encodeURIComponent((task.modelOrPartNumber || task.title) + ' buy replacement')}`;
            
            return (
              <div key={task.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 first:pt-0">
                <div className="flex items-start gap-3">
                  <div className="p-2 border border-zinc-200 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] text-zinc-800 dark:text-[#F5F5F5] flex-shrink-0">
                    <DynamicIcon name={task.iconName} className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black uppercase tracking-tight text-zinc-900 dark:text-[#F5F5F5] font-display">
                        {task.title}
                      </h4>
                      <span className="text-[9px] font-bold text-zinc-500 dark:text-[#737373] uppercase">
                        • {formatInterval(task.intervalValue, task.intervalUnit)}
                      </span>
                    </div>

                    {task.modelOrPartNumber && (
                      <p className="text-xs font-bold text-[#FF3E00] uppercase tracking-wider mt-0.5 flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        Part #: {task.modelOrPartNumber}
                      </p>
                    )}

                    <p className="text-xs text-zinc-500 dark:text-[#737373] mt-0.5">
                      Est. per service: <strong className="text-zinc-800 dark:text-[#F5F5F5]">{task.estimatedCost || 'Free'}</strong> ({occurrencesPerYear.toFixed(1)}x / year)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0">
                  <div className="text-right">
                    <span className="text-sm font-black text-zinc-900 dark:text-[#F5F5F5] font-display block">
                      ${annualCost.toFixed(0)} <span className="text-[9px] text-zinc-400 font-normal">/yr</span>
                    </span>
                    <span className="text-[10px] text-zinc-500 dark:text-[#737373] font-bold uppercase">
                      ${(annualCost / 12).toFixed(1)}/mo
                    </span>
                  </div>

                  <a
                    href={reorderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] text-zinc-800 dark:text-[#F5F5F5] hover:border-[#FF3E00] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#FF3E00]" />
                    ORDER PART
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
