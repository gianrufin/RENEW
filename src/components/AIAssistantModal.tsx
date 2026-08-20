import React, { useState } from 'react';
import { X, Sparkles, Send, Loader2, Plus, Check, ShieldAlert, Home, Car, Dog, ArrowRight } from 'lucide-react';
import { MaintenanceTask, PresetTemplate } from '../types';
import { formatInterval } from '../utils/dateUtils';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingTasks: MaintenanceTask[];
  onAddTaskFromAI: (task: Partial<MaintenanceTask>) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  existingTasks,
  onAddTaskFromAI
}) => {
  const [activeTab, setActiveTab] = useState<'ask' | 'audit'>('ask');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<any | null>(null);
  const [addedDirectly, setAddedDirectly] = useState(false);

  // Audit state
  const [homeType, setHomeType] = useState<'apartment' | 'house'>('apartment');
  const [hasCar, setHasCar] = useState(true);
  const [hasPets, setHasPets] = useState(true);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditResults, setAuditResults] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setRecommendation(null);
    setAddedDirectly(false);

    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() })
      });
      const data = await res.json();
      setRecommendation(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAudit = async () => {
    if (auditLoading) return;
    setAuditLoading(true);

    try {
      const res = await fetch('/api/ai/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lifestyle: { homeType, hasCar, hasPets },
          currentTasks: existingTasks.map(t => t.title)
        })
      });
      const data = await res.json();
      setAuditResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setAuditLoading(false);
    }
  };

  const handleAddAIResult = (item: any) => {
    onAddTaskFromAI({
      title: item.title,
      category: (item.category?.toLowerCase().includes('pet') ? 'pets' :
                 item.category?.toLowerCase().includes('vehicle') ? 'vehicle' :
                 item.category?.toLowerCase().includes('appliance') ? 'appliances' :
                 item.category?.toLowerCase().includes('bed') ? 'bedding' :
                 item.category?.toLowerCase().includes('personal') ? 'personal' : 'other'),
      intervalValue: item.intervalValue || 30,
      intervalUnit: (item.intervalUnit || 'days') as any,
      leadAlertDays: 3,
      preferredTime: '09:00',
      notes: item.description || item.reason || '',
      tips: item.tips || [],
      signsDue: item.signsDue || [],
      estimatedCost: item.estimatedCost || '',
      difficulty: item.difficulty || 'Quick (5m)',
      lastCompletedDate: new Date().toISOString().split('T')[0]
    });
    setAddedDirectly(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div 
        id="ai-assistant-modal"
        className="w-full max-w-2xl bg-[#121212] border border-[#262626] shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#262626] flex items-center justify-between bg-[#171717] flex-shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#F5F5F5] font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF3E00]" />
              AI MAINTENANCE ADVISOR
            </h2>
            <p className="text-[10px] font-bold tracking-widest text-[#737373] uppercase mt-1">
              GEMINI-POWERED FREQUENCY CALCULATOR & ROUTINE GAP AUDITOR
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 border border-[#262626] bg-[#121212] text-[#737373] hover:text-[#F5F5F5] hover:border-[#525252] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 pt-3 border-b border-[#262626] flex gap-6 text-xs font-black uppercase tracking-widest bg-[#171717]">
          <button
            onClick={() => setActiveTab('ask')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'ask'
                ? 'border-[#FF3E00] text-[#FF3E00]'
                : 'border-transparent text-[#737373] hover:text-[#F5F5F5]'
            }`}
          >
            ASK FREQUENCY FOR ANY ITEM
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'audit'
                ? 'border-[#FF3E00] text-[#FF3E00]'
                : 'border-transparent text-[#737373] hover:text-[#F5F5F5]'
            }`}
          >
            SMART HOUSEHOLD GAP AUDIT
          </button>
        </div>

        {/* Scrollable Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {activeTab === 'ask' && (
            <div>
              {/* Search Bar Prompt */}
              <form onSubmit={handleAskAI} className="space-y-3">
                <label className="block text-[10px] font-black text-[#737373] uppercase tracking-[0.2em]">
                  WHAT ITEM OR CHORE DO YOU WANT ADVICE ON?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. DESCALE COFFEE MAKER, BEARDED DRAGON UV BULB..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 px-4 py-3 border border-[#262626] bg-[#171717] text-[#F5F5F5] placeholder-[#525252] font-bold text-sm focus:outline-hidden focus:border-[#FF3E00]"
                  />
                  <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="px-5 py-3 bg-[#FF3E00] hover:bg-[#FF3E00]/90 disabled:opacity-50 text-[#0A0A0A] font-black text-xs uppercase tracking-widest flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 stroke-[3]" />}
                    CONSULT AI
                  </button>
                </div>
              </form>

              {/* Sample Prompts */}
              {!recommendation && !loading && (
                <div className="pt-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#525252] block mb-2">QUICK SUGGESTIONS:</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Humidifier filter replacement',
                      'Espresso machine group head gasket',
                      'Leather jacket conditioner',
                      'Vacuum HEPA filter wash',
                      'Water softener salt refill',
                      'Bathroom grout resealing'
                    ].map((example) => (
                      <button
                        key={example}
                        type="button"
                        onClick={() => { setQuery(example); }}
                        className="px-3 py-1.5 border border-[#262626] bg-[#171717] hover:border-[#525252] text-xs font-bold uppercase tracking-wider text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors cursor-pointer"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Result Card */}
              {recommendation && (
                <div className="mt-5 p-5 border border-[#FF3E00] bg-[#171717] space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 border border-[#FF3E00] bg-[#FF3E00]/10 text-[#FF3E00]">
                        {recommendation.category || 'MAINTENANCE'}
                      </span>
                      <h3 className="text-xl font-black uppercase tracking-tight text-[#F5F5F5] font-display mt-2">
                        {recommendation.title}
                      </h3>
                      <p className="text-xs text-[#A3A3A3] mt-1.5 leading-relaxed">
                        {recommendation.description}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-[10px] font-bold text-[#525252] uppercase tracking-widest block">RECOMMENDED CYCLE</span>
                      <span className="text-base font-black text-[#FF3E00] uppercase font-display">
                        {formatInterval(recommendation.intervalValue, recommendation.intervalUnit)}
                      </span>
                    </div>
                  </div>

                  {/* Tips & Warning Signs */}
                  {recommendation.tips && recommendation.tips.length > 0 && (
                    <div className="p-3.5 border border-[#262626] bg-[#121212] text-xs">
                      <span className="font-black text-[10px] tracking-[0.2em] uppercase text-[#FF3E00] block mb-1">PRO MAINTENANCE TIPS</span>
                      <ul className="space-y-1 text-[#A3A3A3]">
                        {recommendation.tips.map((t: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#525252] font-black">•</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {recommendation.signsDue && recommendation.signsDue.length > 0 && (
                    <div className="p-3.5 border border-[#262626] bg-[#121212] text-xs">
                      <span className="font-black text-[10px] tracking-[0.2em] uppercase text-[#F5F5F5] block mb-1">REPLACEMENT WARNING SIGNS</span>
                      <ul className="space-y-1 text-[#A3A3A3]">
                        {recommendation.signsDue.map((s: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#FF3E00] font-black">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Add Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleAddAIResult(recommendation)}
                      disabled={addedDirectly}
                      className={`px-5 py-2.5 text-xs font-black uppercase tracking-widest flex items-center gap-1.5 transition-all cursor-pointer ${
                        addedDirectly
                          ? 'bg-[#121212] border border-[#262626] text-[#F5F5F5]'
                          : 'bg-[#F5F5F5] hover:bg-white text-[#0A0A0A]'
                      }`}
                    >
                      {addedDirectly ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" /> ADDED TO ALERTS
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 stroke-[3]" /> ADD TO MY SCHEDULE
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="p-5 border border-[#262626] bg-[#171717] space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF3E00]">
                  YOUR HOUSEHOLD PROFILE
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {/* Home Type */}
                  <div>
                    <label className="text-[10px] font-bold text-[#737373] uppercase tracking-widest block mb-1.5">HOME SETUP</label>
                    <select
                      value={homeType}
                      onChange={(e) => setHomeType(e.target.value as any)}
                      className="w-full px-3 py-2 border border-[#262626] bg-[#121212] text-[#F5F5F5] font-bold uppercase"
                    >
                      <option value="apartment" className="bg-[#121212]">APARTMENT / CONDO</option>
                      <option value="house" className="bg-[#121212]">SINGLE FAMILY HOUSE</option>
                    </select>
                  </div>

                  {/* Vehicle */}
                  <div>
                    <label className="text-[10px] font-bold text-[#737373] uppercase tracking-widest block mb-1.5">VEHICLE?</label>
                    <button
                      type="button"
                      onClick={() => setHasCar(!hasCar)}
                      className={`w-full px-3 py-2 border text-left font-bold uppercase transition-colors cursor-pointer text-xs ${
                        hasCar ? 'border-[#FF3E00] bg-[#FF3E00]/10 text-[#FF3E00]' : 'border-[#262626] bg-[#121212] text-[#525252]'
                      }`}
                    >
                      {hasCar ? '✓ YES, OWN VEHICLE' : 'NO VEHICLE'}
                    </button>
                  </div>

                  {/* Pets */}
                  <div>
                    <label className="text-[10px] font-bold text-[#737373] uppercase tracking-widest block mb-1.5">PET PARENT?</label>
                    <button
                      type="button"
                      onClick={() => setHasPets(!hasPets)}
                      className={`w-full px-3 py-2 border text-left font-bold uppercase transition-colors cursor-pointer text-xs ${
                        hasPets ? 'border-[#FF3E00] bg-[#FF3E00]/10 text-[#FF3E00]' : 'border-[#262626] bg-[#121212] text-[#525252]'
                      }`}
                    >
                      {hasPets ? '✓ YES, PET OWNER' : 'NO PETS'}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleRunAudit}
                  disabled={auditLoading}
                  className="w-full py-3 px-4 bg-[#FF3E00] hover:bg-[#FF3E00]/90 text-[#0A0A0A] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {auditLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 stroke-[3]" />
                  )}
                  RUN ROUTINE GAP AUDIT
                </button>
              </div>

              {/* Audit Results */}
              {auditResults && (
                <div className="space-y-3">
                  {auditResults.auditSummary && (
                    <p className="text-xs text-[#F5F5F5] p-3.5 border border-[#262626] bg-[#171717] font-medium leading-relaxed">
                      {auditResults.auditSummary}
                    </p>
                  )}

                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#737373]">
                      RECOMMENDED MISSING ROUTINES:
                    </h4>

                    {auditResults.suggestions?.map((sug: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 border border-[#262626] bg-[#171717] flex items-start justify-between gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] px-1.5 py-0.5 border border-[#262626] bg-[#121212] text-[#A3A3A3]">
                              {sug.category}
                            </span>
                            <span className="text-xs font-black text-[#FF3E00] uppercase">
                              {formatInterval(sug.intervalValue, sug.intervalUnit)}
                            </span>
                          </div>
                          <h5 className="text-sm font-black uppercase tracking-tight text-[#F5F5F5] font-display mt-1">
                            {sug.title}
                          </h5>
                          <p className="text-xs text-[#A3A3A3] mt-1">
                            {sug.reason}
                          </p>
                        </div>

                        <button
                          onClick={() => handleAddAIResult(sug)}
                          className="px-3.5 py-2 bg-[#F5F5F5] hover:bg-white text-[#0A0A0A] text-xs font-black uppercase tracking-widest flex items-center gap-1 transition-colors cursor-pointer flex-shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" /> ADD
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
