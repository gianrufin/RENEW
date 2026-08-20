import React from 'react';
import { 
  Download, 
  Smartphone, 
  Sparkles, 
  ShieldCheck, 
  QrCode, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Layers, 
  BellRing,
  CalendarCheck,
  Cpu
} from 'lucide-react';

interface HeroLandingBannerProps {
  onOpenDownloadModal: () => void;
  onOpenPresets: () => void;
  onOpenAI: () => void;
}

export const HeroLandingBanner: React.FC<HeroLandingBannerProps> = ({
  onOpenDownloadModal,
  onOpenPresets,
  onOpenAI
}) => {
  return (
    <div className="relative border-b border-zinc-300 dark:border-[#262626] bg-gradient-to-b from-zinc-100 via-white to-zinc-50 dark:from-[#111111] dark:via-[#0A0A0A] dark:to-[#0D0D0D] overflow-hidden">
      {/* Subtle Background Accent Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#FF3E00_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          
          {/* Left Column: Value Proposition & High Contrast Headline */}
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-[#FF3E00] bg-[#FF3E00]/10 text-[#FF3E00] font-black text-[10px] tracking-[0.2em] uppercase">
                <Smartphone className="w-3.5 h-3.5" />
                NATIVE ANDROID APK RELEASE
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 border border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#141414] text-zinc-600 dark:text-[#A3A3A3] font-bold text-[10px] tracking-widest uppercase">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                100% OFFLINE SQLITE
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 border border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#141414] text-zinc-600 dark:text-[#A3A3A3] font-bold text-[10px] tracking-widest uppercase">
                <QrCode className="w-3 h-3 text-[#FF3E00]" />
                HARDWARE QR SCANNER
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-zinc-900 dark:text-[#F5F5F5] font-display leading-[1.05]">
              HOUSEHOLD MAINTENANCE. <br className="hidden sm:inline" />
              <span className="text-[#FF3E00]">OFFLINE & ON AUTOPILOT.</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 dark:text-[#A3A3A3] font-medium max-w-2xl leading-relaxed">
              Never forget to replace HVAC filters, swap toothbrush heads, change synthetic car oil, or sanitize bedding. RENEW gives you an actionable morning briefing, printable QR appliance tags, and zero cloud tracking.
            </p>

            {/* Key Capabilities Pills */}
            <div className="flex flex-wrap gap-y-2 gap-x-4 pt-1 text-xs font-bold text-zinc-700 dark:text-[#D4D4D4]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#FF3E00]" />
                <span>Dual Exact & Weekly Routines</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#FF3E00]" />
                <span>Annual Replacement Budget</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#FF3E00]" />
                <span>Apple & Google Calendar Sync</span>
              </div>
            </div>
          </div>

          {/* Right Column: Prominent Call-To-Action (CTA) Download Box */}
          <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
            {/* Primary Download Button */}
            <button
              onClick={onOpenDownloadModal}
              id="hero-btn-download-apk"
              className="w-full sm:w-auto px-6 py-4 bg-[#FF3E00] hover:bg-[#E03700] text-black font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
            >
              <Download className="w-5 h-5 text-black group-hover:translate-y-0.5 transition-transform" />
              <span>DOWNLOAD ANDROID APP (.APK)</span>
            </button>

            {/* Secondary Direct Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onOpenPresets}
                className="px-3 py-2.5 border border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#141414] hover:border-zinc-500 text-zinc-800 dark:text-[#E5E5E5] font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-[#FF3E00]" />
                <span>Starter Packs</span>
              </button>
              <button
                onClick={onOpenAI}
                className="px-3 py-2.5 border border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#141414] hover:border-zinc-500 text-zinc-800 dark:text-[#E5E5E5] font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF3E00]" />
                <span>AI Schedule</span>
              </button>
            </div>

            {/* Live Web Status Indicator */}
            <div className="text-center sm:text-left lg:text-center">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-[#737373] tracking-widest uppercase">
                Works in Browser • Chrome WebAPK • Native APK
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
