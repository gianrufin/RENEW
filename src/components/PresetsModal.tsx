import React, { useState } from 'react';
import { X, Plus, Check, Sparkles, Filter } from 'lucide-react';
import { PRESET_TEMPLATES, CATEGORY_INFO } from '../data/presets';
import { PresetTemplate, CategoryType, MaintenanceTask } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { formatInterval } from '../utils/dateUtils';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingTasks: MaintenanceTask[];
  onAddPreset: (preset: PresetTemplate) => void;
  onAddBundle: (presets: PresetTemplate[]) => void;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  existingTasks,
  onAddPreset,
  onAddBundle
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const existingTitles = new Set(existingTasks.map(t => t.title.toLowerCase()));

  const filteredPresets = PRESET_TEMPLATES.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Bundle collections
  const bundles = [
    {
      id: 'hygiene_essentials',
      name: 'Bathroom & Hygiene Essentials',
      desc: 'Toothbrush, razor blade, loofah, and water bottle sanitizer.',
      icon: 'Smile',
      filter: (p: PresetTemplate) => ['toothbrush', 'razor_blade', 'loofah_sponge', 'water_bottle_deep_clean'].includes(p.id)
    },
    {
      id: 'hvac_appliances',
      name: 'HVAC & Appliance Protection',
      desc: 'AC mesh filter, fridge water filter, coffee machine descaling, and dishwasher clean.',
      icon: 'Fan',
      filter: (p: PresetTemplate) => ['clean_ac_filter', 'fridge_water_filter', 'descale_coffee_machine', 'dishwasher_deep_clean', 'washing_machine_tub_clean'].includes(p.id)
    },
    {
      id: 'vehicle_pack',
      name: 'Car Maintenance Pack',
      desc: 'Engine oil, tire rotation, cabin filter, and wiper blades.',
      icon: 'Car',
      filter: (p: PresetTemplate) => ['car_oil_change', 'car_tire_rotation', 'car_cabin_filter', 'car_wiper_blades'].includes(p.id)
    },
    {
      id: 'pet_parent',
      name: 'Pet Health & Preventatives',
      desc: 'Vaccinations, monthly flea/tick chewable, and nail/grooming trims.',
      icon: 'Dog',
      filter: (p: PresetTemplate) => ['dog_vaccinations', 'dog_flea_tick_pill', 'pet_grooming_nails'].includes(p.id)
    },
    {
      id: 'safety_pack',
      name: 'Home Safety & Fire Alarms',
      desc: 'Smoke detector test/battery check and fire extinguisher inspection.',
      icon: 'ShieldAlert',
      filter: (p: PresetTemplate) => ['smoke_detector_test', 'fire_extinguisher_check', 'dryer_vent_clean'].includes(p.id)
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div 
        id="presets-modal-container"
        className="w-full max-w-3xl bg-[#121212] border border-[#262626] shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#262626] flex items-center justify-between bg-[#171717] flex-shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#F5F5F5] font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF3E00]" />
              STARTER PACKS & PRESETS
            </h2>
            <p className="text-[10px] font-bold tracking-widest text-[#737373] uppercase mt-1">
              CURATED RECURRING SCHEDULES BACKED BY MANUFACTURER & VET STANDARDS
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 border border-[#262626] bg-[#121212] text-[#737373] hover:text-[#F5F5F5] hover:border-[#525252] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Starter Bundles Banner Grid */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF3E00] mb-3">
              1-CLICK ROUTINE BUNDLES
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {bundles.map((bundle) => {
                const bundlePresets = PRESET_TEMPLATES.filter(bundle.filter);
                const unaddedPresets = bundlePresets.filter(p => !existingTitles.has(p.title.toLowerCase()));

                return (
                  <div
                    key={bundle.id}
                    className="p-4 border border-[#262626] bg-[#171717] hover:border-[#525252] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 border border-[#262626] bg-[#121212] text-[#FF3E00]">
                          <DynamicIcon name={bundle.icon} className="w-4 h-4" />
                        </div>
                        <h4 className="text-xs font-black uppercase tracking-tight text-[#F5F5F5] font-display truncate">
                          {bundle.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-[#A3A3A3] line-clamp-2 mb-4 leading-relaxed">
                        {bundle.desc}
                      </p>
                    </div>

                    <button
                      onClick={() => onAddBundle(unaddedPresets)}
                      disabled={unaddedPresets.length === 0}
                      className={`w-full py-2.5 px-3 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        unaddedPresets.length === 0
                          ? 'border border-[#262626] bg-[#121212] text-[#525252] cursor-not-allowed'
                          : 'bg-[#FF3E00] hover:bg-[#FF3E00]/90 text-[#0A0A0A]'
                      }`}
                    >
                      {unaddedPresets.length === 0 ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" /> ALL ADDED
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 stroke-[3]" /> ADD BUNDLE ({unaddedPresets.length})
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Search & Filter Tabs */}
          <div className="pt-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#737373]">
                INDIVIDUAL PRESETS ({filteredPresets.length})
              </h3>
              <input
                type="text"
                placeholder="SEARCH PRESETS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3.5 py-2 text-xs border border-[#262626] bg-[#171717] text-[#F5F5F5] placeholder-[#525252] font-bold uppercase focus:outline-hidden focus:border-[#FF3E00]"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer border ${
                  selectedCategory === 'all'
                    ? 'border-[#F5F5F5] bg-[#F5F5F5] text-[#0A0A0A]'
                    : 'border-[#262626] bg-[#171717] text-[#A3A3A3] hover:border-[#525252]'
                }`}
              >
                ALL
              </button>
              {Object.entries(CATEGORY_INFO).map(([catKey, cat]) => (
                <button
                  key={catKey}
                  onClick={() => setSelectedCategory(catKey)}
                  className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer border ${
                    selectedCategory === catKey
                      ? 'border-[#FF3E00] bg-[#FF3E00] text-[#0A0A0A]'
                      : 'border-[#262626] bg-[#171717] text-[#A3A3A3] hover:border-[#525252]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Presets List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {filteredPresets.map((preset) => {
                const isAdded = existingTitles.has(preset.title.toLowerCase());
                const catInfo = CATEGORY_INFO[preset.category] || CATEGORY_INFO.other;

                return (
                  <div
                    key={preset.id}
                    className="p-4 border border-[#262626] bg-[#171717] hover:border-[#525252] transition-all flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 border border-[#262626] bg-[#121212] text-[#F5F5F5]">
                            <DynamicIcon name={preset.iconName} className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] px-1.5 py-0.5 border border-[#262626] bg-[#121212] text-[#A3A3A3]">
                              {catInfo.label}
                            </span>
                            <h4 className="text-sm font-black uppercase tracking-tight text-[#F5F5F5] font-display mt-1">
                              {preset.title}
                            </h4>
                          </div>
                        </div>
                        <span className="text-xs font-black text-[#FF3E00] whitespace-nowrap uppercase">
                          {formatInterval(preset.intervalValue, preset.intervalUnit)}
                        </span>
                      </div>

                      <p className="text-xs text-[#A3A3A3] mt-2.5 line-clamp-2 leading-relaxed">
                        {preset.description}
                      </p>

                      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-[#525252] mt-3">
                        <span>COST: <strong className="text-[#D4D4D4]">{preset.estimatedCost}</strong></span>
                        <span>/</span>
                        <span>EFFORT: <strong className="text-[#D4D4D4]">{preset.difficulty}</strong></span>
                      </div>
                    </div>

                    <button
                      onClick={() => onAddPreset(preset)}
                      disabled={isAdded}
                      className={`w-full py-2.5 px-3 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isAdded
                          ? 'border border-[#262626] bg-[#121212] text-[#525252] cursor-default'
                          : 'bg-[#F5F5F5] hover:bg-white text-[#0A0A0A]'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" /> ALREADY IN ALERTS
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 stroke-[3]" /> ADD TO ALERTS
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#262626] bg-[#171717] flex items-center justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#F5F5F5] hover:bg-white text-[#0A0A0A] font-black text-xs uppercase tracking-widest transition-colors cursor-pointer"
          >
            DONE BROWSING
          </button>
        </div>
      </div>
    </div>
  );
};
