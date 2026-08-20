import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { 
  QrCode, 
  Camera, 
  Download, 
  X, 
  CheckCircle2, 
  Printer, 
  Scan, 
  Tag,
  AlertCircle
} from 'lucide-react';
import { MaintenanceTask } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { formatInterval } from '../utils/dateUtils';
import { sound } from '../utils/sound';

interface QRAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: MaintenanceTask[];
  onSelectTask: (task: MaintenanceTask) => void;
  initialTask?: MaintenanceTask | null;
}

export function QRAssetModal({
  isOpen,
  onClose,
  tasks,
  onSelectTask,
  initialTask
}: QRAssetModalProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'scan'>('generate');
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(initialTask || tasks[0] || null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (initialTask) {
      setSelectedTask(initialTask);
    } else if (tasks.length > 0 && !selectedTask) {
      setSelectedTask(tasks[0]);
    }
  }, [initialTask, tasks]);

  // Generate QR code for selected task
  useEffect(() => {
    if (selectedTask) {
      const qrPayload = JSON.stringify({
        app: 'remindme',
        taskId: selectedTask.id,
        title: selectedTask.title
      });

      QRCode.toDataURL(qrPayload, {
        width: 320,
        margin: 1,
        color: {
          dark: '#0A0A0A',
          light: '#FFFFFF'
        }
      })
        .then(url => setQrDataUrl(url))
        .catch(err => console.error('QR generation error:', err));
    }
  }, [selectedTask]);

  // Handle Camera Scanner
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (isOpen && activeTab === 'scan') {
      setCameraError(null);
      setScanning(true);

      navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
        .then(mediaStream => {
          stream = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.setAttribute('playsinline', 'true');
            videoRef.current.play();
            requestAnimationFrame(tick);
          }
        })
        .catch(err => {
          console.error('Camera access error:', err);
          setCameraError('Camera access denied or unavailable. Please grant camera permission in your browser.');
          setScanning(false);
        });
    }

    function tick() {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.height = videoRef.current.videoHeight;
            canvas.width = videoRef.current.videoWidth;
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'dontInvert',
            });

            if (code) {
              try {
                const parsed = JSON.parse(code.data);
                if (parsed.taskId) {
                  const found = tasks.find(t => t.id === parsed.taskId);
                  if (found) {
                    sound.playSuccess();
                    if ('vibrate' in navigator) navigator.vibrate([40, 60, 40]);
                    onSelectTask(found);
                    onClose();
                    return;
                  }
                }
              } catch {
                // Ignore raw non-json QR codes
              }
            }
          }
        }
      }
      if (activeTab === 'scan') {
        animationFrameRef.current = requestAnimationFrame(tick);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isOpen, activeTab, tasks]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div 
        id="qr-asset-modal"
        className="w-full max-w-xl bg-white dark:bg-[#121212] border-2 border-zinc-300 dark:border-[#262626] shadow-2xl overflow-hidden my-6"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-200 dark:border-[#262626] flex items-center justify-between bg-zinc-50 dark:bg-[#171717]">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-[#FF3E00]">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900 dark:text-[#F5F5F5] font-display">
                QR ASSET TAGS
              </h2>
              <p className="text-[10px] font-bold text-zinc-500 dark:text-[#737373] tracking-widest uppercase mt-0.5">
                PRINT STICKERS FOR APPLIANCES & SCAN TO LOG
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 border border-zinc-300 dark:border-[#262626] bg-white dark:bg-[#121212] text-zinc-600 dark:text-[#737373] hover:text-zinc-900 dark:hover:text-[#F5F5F5] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 border-b border-zinc-200 dark:border-[#262626] bg-zinc-100 dark:bg-[#171717]">
          <button
            type="button"
            onClick={() => setActiveTab('generate')}
            className={`py-3 text-xs font-black uppercase tracking-widest cursor-pointer border-b-2 flex items-center justify-center gap-2 ${
              activeTab === 'generate'
                ? 'border-[#FF3E00] text-zinc-900 dark:text-[#F5F5F5] bg-white dark:bg-[#121212]'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Tag className="w-4 h-4" />
            PRINTABLE ASSET TAG
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('scan')}
            className={`py-3 text-xs font-black uppercase tracking-widest cursor-pointer border-b-2 flex items-center justify-center gap-2 ${
              activeTab === 'scan'
                ? 'border-[#FF3E00] text-zinc-900 dark:text-[#F5F5F5] bg-white dark:bg-[#121212]'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            LIVE SCANNER
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {activeTab === 'generate' ? (
            <>
              {/* Task Selector */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-[#737373] mb-1.5">
                  SELECT APPLIANCE OR ITEM TO GENERATE STICKER:
                </label>
                <select
                  value={selectedTask?.id || ''}
                  onChange={(e) => {
                    const t = tasks.find(item => item.id === e.target.value);
                    if (t) setSelectedTask(t);
                  }}
                  className="w-full px-3.5 py-2.5 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] text-zinc-900 dark:text-[#F5F5F5] font-bold text-xs"
                >
                  {tasks.map(task => (
                    <option key={task.id} value={task.id}>
                      {task.title} ({task.category.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Printable Tag Visual Box */}
              {selectedTask && qrDataUrl && (
                <div id="printable-asset-tag" className="p-5 border-2 border-dashed border-zinc-400 dark:border-[#525252] bg-white text-black text-center space-y-3 max-w-sm mx-auto shadow-sm">
                  <div className="border-b border-black pb-2 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#FF3E00]">
                      REMINDME ASSET
                    </span>
                    <span className="text-[9px] font-bold uppercase">
                      ID: {selectedTask.id.slice(-6)}
                    </span>
                  </div>

                  <img 
                    src={qrDataUrl} 
                    alt="Asset QR Tag" 
                    className="w-44 h-44 mx-auto border border-zinc-200"
                  />

                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tight font-display leading-tight">
                      {selectedTask.title}
                    </h4>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 mt-0.5">
                      Cycle: {formatInterval(selectedTask.intervalValue, selectedTask.intervalUnit)}
                    </p>
                    {selectedTask.modelOrPartNumber && (
                      <p className="text-[10px] font-mono font-bold text-zinc-800">
                        Part: {selectedTask.modelOrPartNumber}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-zinc-200 text-[8px] font-bold uppercase tracking-widest text-zinc-400">
                    SCAN WITH REMINDME TO LOG SERVICE
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 border border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#171717] text-zinc-800 dark:text-[#F5F5F5] font-black text-xs uppercase tracking-widest cursor-pointer flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  PRINT STICKER
                </button>
                {qrDataUrl && (
                  <a
                    href={qrDataUrl}
                    download={`${selectedTask?.title.toLowerCase().replace(/\s+/g, '_')}_qr_tag.png`}
                    className="px-4 py-2 bg-[#FF3E00] hover:bg-[#FF3E00]/90 text-black font-black text-xs uppercase tracking-widest cursor-pointer flex items-center gap-2"
                  >
                    <Download className="w-4 h-4 stroke-[3]" />
                    SAVE IMAGE
                  </a>
                )}
              </div>
            </>
          ) : (
            /* Live Camera Scanner */
            <div className="space-y-4 text-center">
              <div className="relative w-full max-w-sm mx-auto aspect-square border-2 border-[#FF3E00] bg-black overflow-hidden flex items-center justify-center">
                <video ref={videoRef} className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />

                {/* Reticle / Viewfinder */}
                <div className="absolute inset-8 border-2 border-[#FF3E00] pointer-events-none opacity-80 animate-pulse">
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-4 border-l-4 border-[#FF3E00]" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-4 border-r-4 border-[#FF3E00]" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-4 border-l-4 border-[#FF3E00]" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-4 border-r-4 border-[#FF3E00]" />
                </div>
              </div>

              {cameraError ? (
                <div className="p-3 border border-red-500 bg-red-500/10 text-red-500 text-xs font-bold flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{cameraError}</span>
                </div>
              ) : (
                <p className="text-xs text-zinc-500 dark:text-[#737373] uppercase font-bold tracking-wider">
                  Point your camera at a RemindMe QR asset tag to automatically open its maintenance log.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
