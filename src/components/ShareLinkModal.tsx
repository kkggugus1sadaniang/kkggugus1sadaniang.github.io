import React, { useState, useEffect } from 'react';
import { KKGActivity, Participant } from '../types/certificate';
import { getShareableCertificateUrl, getVerificationUrl } from '../utils/storage';
import { generateQrCodeDataUrl } from '../utils/qr';
import {
  X,
  Copy,
  Check,
  Share2,
  QrCode,
  Download,
  ExternalLink,
  MessageCircle,
  FileCheck,
  Award,
} from 'lucide-react';

interface ShareLinkModalProps {
  activity: KKGActivity;
  participant: Participant;
  onClose: () => void;
  onOpenCertificate: (participant: Participant) => void;
}

export const ShareLinkModal: React.FC<ShareLinkModalProps> = ({
  activity,
  participant,
  onClose,
  onOpenCertificate,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedVerify, setCopiedVerify] = useState(false);
  const [copiedWA, setCopiedWA] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const certUrl = getShareableCertificateUrl(participant.id);
  const verifyUrl = getVerificationUrl(participant.id);

  useEffect(() => {
    generateQrCodeDataUrl(certUrl).then(setQrDataUrl);
  }, [certUrl]);

  const waMessage = 
`*SERTIFIKAT RESMI KELOMPOK KERJA GURU (KKG)*
Gugus: ${activity.gugusName}
Kegiatan: ${activity.title} (${activity.totalHours} JP)

Yth. Bapak/Ibu: *${participant.name}*
NIP/NUPTK: ${participant.nipOrNuptk || '-'}
Unit Kerja: ${participant.schoolOrigin}
Nomor Sertifikat: *${participant.certificateNumber}*

Berikut tautan resmi untuk mengunduh & mencetak sertifikat Anda:
🔗 ${certUrl}

Verifikasi Keabsahan:
🔍 ${verifyUrl}

Dokumen ini sah dan dapat digunakan sebagai bukti dukung RHK pada Platform Merdeka Mengajar (PMM).`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(certUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyVerify = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopiedVerify(true);
    setTimeout(() => setCopiedVerify(false), 2000);
  };

  const handleCopyWAMessage = () => {
    navigator.clipboard.writeText(waMessage);
    setCopiedWA(true);
    setTimeout(() => setCopiedWA(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(waMessage);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QR-Sertifikat-KKG-${participant.name.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Share2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                Tautan Sertifikat KKG
              </h3>
              <p className="text-xs text-blue-200">
                Bagikan ke guru, grup WhatsApp, atau verifikasi publik
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Target Teacher Summary Card */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-blue-700" />
                <span className="text-sm font-bold text-slate-900">{participant.name}</span>
                <span className="text-[10px] bg-blue-200 text-blue-900 font-bold px-1.5 py-0.5 rounded">
                  {participant.role}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {participant.schoolOrigin} • No: <span className="font-mono">{participant.certificateNumber}</span>
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenCertificate(participant);
              }}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 bg-white border border-blue-200 px-2.5 py-1.5 rounded-lg shadow-2xs hover:bg-blue-50 transition-all cursor-pointer"
            >
              <span>Lihat Desain</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Section 1: Direct Certificate Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>1. Tautan Langsung Sertifikat (Direct URL)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={certUrl}
                className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 focus:outline-hidden select-all"
              />
              <button
                onClick={handleCopyLink}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  copiedLink
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
                }`}
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Guru dapat langsung membuka link ini di HP/Laptop untuk melihat dan mengunduh sertifikat tanpa perlu login.
            </p>
          </div>

          {/* Section 2: QR Code & Verification */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="sm:col-span-4 flex flex-col items-center justify-center">
              <div className="bg-white p-2 rounded-lg border border-slate-300 shadow-xs">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="QR Sertifikat" className="w-24 h-24 object-contain" />
                ) : (
                  <div className="w-24 h-24 bg-slate-100 flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-slate-400" />
                  </div>
                )}
              </div>
              <button
                onClick={handleDownloadQR}
                className="mt-2 text-[11px] text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Gambar QR</span>
              </button>
            </div>

            <div className="sm:col-span-8 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Tautan Verifikasi Keabsahan</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Link khusus untuk pihak sekolah, pengawas, atau Dinas Pendidikan memvalidasi data sertifikat.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={verifyUrl}
                  className="flex-1 bg-white border border-slate-300 rounded px-2.5 py-1.5 text-[11px] font-mono text-slate-700 select-all"
                />
                <button
                  onClick={handleCopyVerify}
                  className="px-2.5 py-1.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold cursor-pointer"
                >
                  {copiedVerify ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: WhatsApp Broadcast Message */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Format Pesan Siap Kirim (WhatsApp)</span>
              </label>
              <button
                onClick={handleCopyWAMessage}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                {copiedWA ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedWA ? 'Teks Tersalin!' : 'Salin Format Teks'}</span>
              </button>
            </div>

            <div className="bg-slate-900 text-slate-200 p-3 rounded-xl text-xs font-mono max-h-32 overflow-y-auto leading-relaxed whitespace-pre-wrap border border-slate-800">
              {waMessage}
            </div>

            <button
              onClick={handleOpenWhatsApp}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Buka & Kirim Langsung via WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Selesai / Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
