import React, { useState, useEffect, useRef } from 'react';
import { KKGActivity, Participant } from '../types/certificate';
import { CertificateFront } from './CertificateFront';
import { CertificateBack } from './CertificateBack';
import { getShareableCertificateUrl } from '../utils/storage';
import confetti from 'canvas-confetti';
import {
  Printer,
  Copy,
  Check,
  Share2,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  FileText,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';

interface CertificateModalProps {
  activity: KKGActivity;
  participant: Participant;
  onClose: () => void;
  onOpenShareModal: (participant: Participant) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  activity,
  participant,
  onClose,
  onOpenShareModal,
}) => {
  const [activePage, setActivePage] = useState<'front' | 'back'>('front');
  const [copied, setCopied] = useState(false);
  const [scale, setScale] = useState<number>(0.85);
  const containerRef = useRef<HTMLDivElement>(null);

  const certUrl = getShareableCertificateUrl(participant.id);

  // Auto-fit on initial render based on container width
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 48;
      if (containerWidth < 1050) {
        const computedScale = Math.max(0.35, Math.min(1, containerWidth / 1060));
        setScale(Number(computedScale.toFixed(2)));
      } else {
        setScale(1);
      }
    }
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(certUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
    });
    window.print();
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `*SERTIFIKAT RESMI KKG - ${activity.gugusName.toUpperCase()}*\n\n` +
      `Kepada Yth. Bapak/Ibu: *${participant.name}*\n` +
      `Nomor Sertifikat: *${participant.certificateNumber}*\n` +
      `Kegiatan: *${activity.title} (${activity.totalHours} JP)*\n\n` +
      `Silakan unduh atau cetak sertifikat resmi Anda melalui tautan resmi berikut:\n` +
      `${certUrl}\n\n` +
      `Sertifikat ini dilengkapi kode QR verifikasi keabsahan online.`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const zoomIn = () => setScale((s) => Math.min(1.2, Number((s + 0.1).toFixed(2))));
  const zoomOut = () => setScale((s) => Math.max(0.35, Number((s - 0.1).toFixed(2))));
  const resetZoom = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 48;
      const computedScale = Math.max(0.35, Math.min(1, containerWidth / 1060));
      setScale(Number(computedScale.toFixed(2)));
    } else {
      setScale(1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[96vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Header toolbar (Hidden during print) */}
        <div className="bg-slate-900 text-white px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                {participant.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                No: {participant.certificateNumber} • {participant.role}
              </p>
            </div>
          </div>

          {/* Page Switcher */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setActivePage('front')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activePage === 'front'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Halaman 1 (Depan)</span>
            </button>
            <button
              onClick={() => setActivePage('back')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activePage === 'back'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Halaman 2 (Struktur {activity.totalHours} JP)</span>
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="hidden lg:flex items-center bg-slate-800 px-2 py-1 rounded-xl border border-slate-700 gap-1 text-xs">
            <button
              onClick={zoomOut}
              title="Perkecil Tampilan"
              className="p-1 hover:text-blue-300 text-slate-300 cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] px-1 text-slate-300">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={zoomIn}
              title="Perbesar Tampilan"
              className="p-1 hover:text-blue-300 text-slate-300 cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={resetZoom}
              title="Pas ke Layar"
              className="p-1 hover:text-blue-300 text-slate-300 ml-1 cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              title="Salin Tautan Sertifikat Ini"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Salin Link</span>
                </>
              )}
            </button>

            <button
              onClick={handleWhatsApp}
              title="Kirim ke WhatsApp"
              className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Kirim ke WA</span>
            </button>

            <button
              onClick={handlePrint}
              title="Cetak atau Simpan ke PDF"
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Unduh PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Area */}
        <div
          ref={containerRef}
          className="flex-1 overflow-auto p-4 sm:p-8 bg-slate-100 flex items-center justify-center print:p-0 print:bg-white print:overflow-visible"
        >
          {/* Printable wrapper */}
          <div className="print-certificate-container flex flex-col items-center">
            {/* On screen: shows current selected page with scale */}
            <div
              className="print:hidden certificate-scaler transition-transform duration-200"
              style={{
                width: `${1050 * scale}px`,
                height: `${742 * scale}px`,
              }}
            >
              {activePage === 'front' ? (
                <CertificateFront activity={activity} participant={participant} scale={scale} />
              ) : (
                <CertificateBack activity={activity} participant={participant} scale={scale} />
              )}
            </div>

            {/* During print: prints both Page 1 and Page 2 sequentially in landscape */}
            <div className="hidden print:block space-y-0">
              <div className="page-break-after">
                <CertificateFront activity={activity} participant={participant} scale={1} />
              </div>
              <div className="page-break-after pt-4">
                <CertificateBack activity={activity} participant={participant} scale={1} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar info */}
        <div className="bg-white border-t border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between text-xs text-slate-500 print:hidden gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Tautan Sertifikat Resmi Aktif:</span>
            <code className="bg-slate-100 text-blue-700 px-2 py-0.5 rounded font-mono text-[11px] truncate max-w-xs sm:max-w-md">
              {certUrl}
            </code>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenShareModal(participant)}
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Opsi Bagikan Lengkap</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
