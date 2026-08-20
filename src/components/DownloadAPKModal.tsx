import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Sparkles, 
  ShieldCheck, 
  QrCode, 
  CheckCircle2, 
  ChevronRight, 
  Zap, 
  X, 
  ExternalLink,
  Layers,
  ArrowDownToLine,
  HelpCircle
} from 'lucide-react';

interface DownloadAPKModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadAPKModal: React.FC<DownloadAPKModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Direct APK download paths
  const directApkDownloadUrl = './RENEW-Household-Maintenance.apk';
  const githubReleasesUrl = 'https://github.com/gianrufin/RENEW/releases';
  const githubActionsUrl = 'https://github.com/gianrufin/RENEW/actions';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + window.location.pathname + 'RENEW-Household-Maintenance.apk');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl border-2 border-zinc-900 dark:border-white bg-white dark:bg-[#0A0A0A] text-zinc-900 dark:text-[#EDEDED] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-200 dark:border-[#262626] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 border border-[#FF3E00] bg-[#FF3E00]/10 text-[#FF3E00]">
                UNIVERSAL ANDROID BUILD
              </span>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                v1.0.0 (SDK 34)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-zinc-900 dark:text-[#F5F5F5] font-display flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-[#FF3E00]" />
              DOWNLOAD RENEW ANDROID APP (.APK)
            </h2>
            <p className="text-xs text-zinc-500 dark:text-[#888888] font-bold uppercase tracking-wider">
              100% Offline-First SQLite • Zero Cloud Lock-In • Hardware QR Scanner
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Primary Download Button & WebAPK Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Direct APK Download */}
          <div className="p-5 border-2 border-[#FF3E00] bg-[#FF3E00]/5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black tracking-widest uppercase text-[#FF3E00] flex items-center gap-1.5">
                  <ArrowDownToLine className="w-4 h-4" /> PRIMARY DOWNLOAD
                </span>
                <span className="text-[10px] font-mono font-bold text-zinc-500">~12 MB</span>
              </div>
              <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                Standalone Native .APK
              </h3>
              <p className="text-xs text-zinc-600 dark:text-[#A3A3A3] leading-relaxed">
                Direct installable package for any Android 8.0+ device (Samsung, Google Pixel, Xiaomi, OnePlus, Motorola).
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={directApkDownloadUrl}
                download="RENEW-Household-Maintenance.apk"
                className="w-full py-3.5 px-4 bg-[#FF3E00] hover:bg-[#E03700] text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all active:translate-y-0.5"
              >
                <Download className="w-4 h-4 text-black" />
                DOWNLOAD .APK FILE
              </a>
              <button
                onClick={handleCopyLink}
                className="w-full py-2 px-3 border border-zinc-300 dark:border-[#333333] hover:border-zinc-500 text-[11px] font-bold uppercase tracking-wider text-zinc-700 dark:text-[#A3A3A3] hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                {copied ? '✓ COPIED DIRECT DOWNLOAD LINK' : 'COPY DOWNLOAD LINK'}
              </button>
            </div>
          </div>

          {/* Instant Chrome WebAPK */}
          <div className="p-5 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#121212] flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black tracking-widest uppercase text-emerald-500 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" /> 1-TAP WEBAPK (CHROME)
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-500">INSTANT</span>
              </div>
              <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                Chrome Android WebAPK
              </h3>
              <p className="text-xs text-zinc-600 dark:text-[#A3A3A3] leading-relaxed">
                Install directly from Chrome into your Android home screen and app drawer with automatic offline caching.
              </p>
            </div>

            <div className="p-3 border border-zinc-200 dark:border-[#262626] bg-white dark:bg-[#0A0A0A] space-y-1.5">
              <p className="text-[11px] font-bold text-zinc-800 dark:text-[#EDEDED]">
                1. Tap Chrome menu <strong>(⋮)</strong> top-right
              </p>
              <p className="text-[11px] font-bold text-zinc-800 dark:text-[#EDEDED]">
                2. Tap <span className="text-[#FF3E00]">"Install app"</span> or <span className="text-[#FF3E00]">"Add to Home Screen"</span>
              </p>
            </div>
          </div>
        </div>

        {/* 3 Simple Install Steps */}
        <div className="border border-zinc-200 dark:border-[#262626] p-4 bg-zinc-50 dark:bg-[#141414] space-y-3">
          <h4 className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-[#F5F5F5] flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#FF3E00]" />
            HOW TO INSTALL .APK ON ANDROID IN 30 SECONDS:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 border border-zinc-200 dark:border-[#262626] bg-white dark:bg-[#0A0A0A] space-y-1">
              <span className="text-[#FF3E00] font-black text-xs font-mono">01. DOWNLOAD</span>
              <p className="text-zinc-600 dark:text-[#A3A3A3] text-[11px] leading-snug">
                Tap <strong>Download .APK</strong> above to save the file to your device.
              </p>
            </div>
            <div className="p-2.5 border border-zinc-200 dark:border-[#262626] bg-white dark:bg-[#0A0A0A] space-y-1">
              <span className="text-[#FF3E00] font-black text-xs font-mono">02. ALLOW UNKNOWN</span>
              <p className="text-zinc-600 dark:text-[#A3A3A3] text-[11px] leading-snug">
                When prompted, toggle on <em>"Allow from this source"</em> in Android settings.
              </p>
            </div>
            <div className="p-2.5 border border-zinc-200 dark:border-[#262626] bg-white dark:bg-[#0A0A0A] space-y-1">
              <span className="text-[#FF3E00] font-black text-xs font-mono">03. OPEN & USE</span>
              <p className="text-zinc-600 dark:text-[#A3A3A3] text-[11px] leading-snug">
                Tap <strong>Install</strong>. RENEW will appear in your app drawer!
              </p>
            </div>
          </div>
        </div>

        {/* GitHub Releases & Source Code Links */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-zinc-200 dark:border-[#262626]">
          <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
            GITHUB REPOSITORY MIRRORS:
          </span>
          <div className="flex items-center gap-3">
            <a
              href={githubReleasesUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#FF3E00] hover:underline font-bold text-xs"
            >
              GitHub Releases <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-zinc-400">•</span>
            <a
              href={githubActionsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-zinc-600 dark:text-[#A3A3A3] hover:text-white font-bold text-xs"
            >
              CI/CD Workflows <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
