import React, { useEffect, useState } from 'react';
import { KKGActivity, Participant } from '../types/certificate';
import { generateQrCodeDataUrl } from '../utils/qr';
import { getVerificationUrl } from '../utils/storage';

interface CertificateFrontProps {
  activity: KKGActivity;
  participant: Participant;
  scale?: number;
}

export const CertificateFront: React.FC<CertificateFrontProps> = ({
  activity,
  participant,
  scale = 1,
}) => {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    const verifyUrl = getVerificationUrl(participant.id);
    generateQrCodeDataUrl(verifyUrl).then(setQrUrl);
  }, [participant.id]);

  // Theme color styles
  const getThemeClasses = () => {
    switch (activity.theme) {
      case 'classic-gold':
        return {
          primaryText: 'text-amber-900',
          accentBorder: 'border-amber-600',
          accentBg: 'bg-amber-700',
          subText: 'text-amber-800',
          badgeBg: 'from-amber-700 to-yellow-600',
          sealColor: '#b45309',
        };
      case 'emerald-green':
        return {
          primaryText: 'text-emerald-950',
          accentBorder: 'border-emerald-700',
          accentBg: 'bg-emerald-800',
          subText: 'text-emerald-850',
          badgeBg: 'from-emerald-800 to-teal-700',
          sealColor: '#047857',
        };
      case 'modern-navy':
        return {
          primaryText: 'text-slate-900',
          accentBorder: 'border-slate-800',
          accentBg: 'bg-slate-900',
          subText: 'text-slate-700',
          badgeBg: 'from-slate-900 to-slate-800',
          sealColor: '#0f172a',
        };
      case 'royal-blue':
      default:
        return {
          primaryText: 'text-blue-950',
          accentBorder: 'border-blue-800',
          accentBg: 'bg-blue-900',
          subText: 'text-blue-900',
          badgeBg: 'from-blue-900 to-indigo-900',
          sealColor: '#1e3a8a',
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <div
      className="relative bg-white text-slate-900 shadow-2xl overflow-hidden print:shadow-none print:m-0"
      style={{
        width: '1050px',
        height: '742px', // Aspect ratio approx standard A4 Landscape (1.414)
        transformOrigin: 'top left',
        transform: scale !== 1 ? `scale(${scale})` : undefined,
      }}
      id={`cert-front-${participant.id}`}
    >
      {/* Outer Decorative Border */}
      <div className="absolute inset-3 border-4 border-amber-600/70 pointer-events-none rounded-sm"></div>
      <div className="absolute inset-5 border border-dashed border-amber-500/60 pointer-events-none rounded-sm"></div>
      <div className="absolute inset-7 border-2 border-blue-950/80 pointer-events-none rounded-sm"></div>

      {/* Elegant Corner Ornaments */}
      <svg
        className="absolute top-4 left-4 w-16 h-16 text-amber-600/80 pointer-events-none"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path d="M0 0 L50 0 C40 10 30 20 20 30 C10 40 0 50 0 50 Z" />
        <circle cx="25" cy="25" r="4" />
      </svg>
      <svg
        className="absolute top-4 right-4 w-16 h-16 text-amber-600/80 pointer-events-none rotate-90"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path d="M0 0 L50 0 C40 10 30 20 20 30 C10 40 0 50 0 50 Z" />
        <circle cx="25" cy="25" r="4" />
      </svg>
      <svg
        className="absolute bottom-4 left-4 w-16 h-16 text-amber-600/80 pointer-events-none -rotate-90"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path d="M0 0 L50 0 C40 10 30 20 20 30 C10 40 0 50 0 50 Z" />
        <circle cx="25" cy="25" r="4" />
      </svg>
      <svg
        className="absolute bottom-4 right-4 w-16 h-16 text-amber-600/80 pointer-events-none rotate-180"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path d="M0 0 L50 0 C40 10 30 20 20 30 C10 40 0 50 0 50 Z" />
        <circle cx="25" cy="25" r="4" />
      </svg>

      {/* Subtle Background Watermark Logo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none">
        <svg viewBox="0 0 200 200" className="w-[500px] h-[500px]">
          <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="6" fill="none" />
          <polygon points="100,20 120,70 175,75 135,115 145,170 100,145 55,170 65,115 25,75 80,70" fill="currentColor" />
        </svg>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 px-16 py-8 flex flex-col h-full justify-between">
        {/* Header / Kop Lembaga */}
        <div className="text-center border-b-2 border-amber-600/40 pb-3">
          <div className="flex items-center justify-center gap-4 mb-1">
            {/* Tut Wuri Handayani SVG Logo */}
            <div className="w-14 h-14 flex items-center justify-center text-blue-900">
              <svg viewBox="0 0 100 100" className="w-14 h-14">
                <circle cx="50" cy="50" r="45" fill="#f8fafc" stroke="#1e3a8a" strokeWidth="3" />
                <path
                  d="M50 15 L60 38 L85 40 L65 58 L72 82 L50 68 L28 82 L35 58 L15 40 L40 38 Z"
                  fill="#d97706"
                  stroke="#92400e"
                  strokeWidth="1.5"
                />
                <circle cx="50" cy="50" r="14" fill="#1e3a8a" />
                <circle cx="50" cy="50" r="8" fill="#f8fafc" />
              </svg>
            </div>

            <div>
              <p className="text-xs font-bold tracking-widest text-slate-600 uppercase font-sans">
                DINAS PENDIDIKAN DAN KEBUDAYAAN • {activity.regency.toUpperCase()}
              </p>
              <h1 className="text-xl font-extrabold tracking-wide text-blue-950 font-serif uppercase">
                {activity.gugusName}
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                {activity.district}, {activity.regency}, Provinsi {activity.province} • SK Pengesahan: {activity.skNumber}
              </p>
            </div>

            {/* Emblem KKG SD */}
            <div className="w-14 h-14 flex items-center justify-center text-amber-700">
              <div className="w-12 h-12 rounded-full border-2 border-amber-600 flex flex-col items-center justify-center bg-amber-50 shadow-inner">
                <span className="text-[9px] font-black text-amber-800 tracking-tighter">KKG SD</span>
                <span className="text-[14px] leading-tight font-extrabold text-blue-900">{activity.totalHours}</span>
                <span className="text-[8px] font-bold text-amber-700">JP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Title & Number */}
        <div className="text-center mt-2">
          <h2
            className="text-3xl font-extrabold tracking-[0.25em] text-blue-950 uppercase font-serif"
            style={{ fontFamily: "'Cinzel', 'EB Garamond', Georgia, serif" }}
          >
            SERTIFIKAT
          </h2>
          <div className="flex items-center justify-center gap-3 mt-0.5">
            <div className="h-[1.5px] w-20 bg-gradient-to-r from-transparent to-amber-600"></div>
            <p className="text-xs font-mono font-semibold text-slate-700 tracking-wider">
              Nomor: {participant.certificateNumber}
            </p>
            <div className="h-[1.5px] w-20 bg-gradient-to-l from-transparent to-amber-600"></div>
          </div>
        </div>

        {/* Recipient Section */}
        <div className="text-center my-auto px-6">
          <p className="text-xs italic text-slate-600 font-serif">Diberikan dengan hormat kepada:</p>
          
          <h3
            className="text-2xl md:text-[28px] font-bold text-blue-950 tracking-wide mt-1.5 mb-1 font-serif underline decoration-amber-500/70 decoration-1 underline-offset-4"
            style={{ fontFamily: "'EB Garamond', Georgia, serif" }}
          >
            {participant.name}
          </h3>

          <p className="text-xs text-slate-700 font-medium">
            <span className="font-semibold text-slate-900">NIP/NUPTK:</span> {participant.nipOrNuptk || '-'}
            <span className="mx-2 text-slate-300">•</span>
            <span className="font-semibold text-slate-900">Unit Kerja:</span> {participant.schoolOrigin}
          </p>

          <div className="inline-block mt-2 px-4 py-0.5 rounded-full bg-blue-50 border border-blue-200">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
              Sebagai : {participant.role.toUpperCase()}
            </span>
          </div>

          <p className="text-xs text-slate-700 max-w-3xl mx-auto mt-2 leading-relaxed text-justify sm:text-center">
            Atas partisipasi dan kelulusannya dalam kegiatan <strong className="text-blue-950 font-semibold">{activity.title}</strong> bertema:
            <span className="italic block font-medium text-slate-900 my-0.5 text-xs">
              "{activity.subTitle}"
            </span>
            yang diselenggarakan oleh <span className="font-semibold">{activity.gugusName}</span> bertempat di {activity.location} pada tanggal {activity.eventDateFormatted}, setara dengan <strong className="text-blue-900">{activity.totalHours} Jam Pelajaran (JP)</strong>.
          </p>
        </div>

        {/* Footer: Signatures, Stamp & QR Code */}
        <div className="pt-2 border-t border-slate-200 grid grid-cols-12 items-end">
          {/* Signatory 1 (Ketua KKG) */}
          <div className="col-span-4 text-center relative">
            <p className="text-[11px] text-slate-600">Mengetahui,</p>
            <p className="text-xs font-bold text-slate-900">{activity.firstSignatory.title}</p>
            
            {/* Signature Area */}
            <div className="h-16 flex items-center justify-center relative my-1">
              {/* Digital signature cursive look */}
              <svg viewBox="0 0 160 50" className="w-32 h-12 text-blue-900">
                <path
                  d="M10 35 C 30 10, 45 45, 60 20 C 75 5, 90 40, 110 25 C 125 15, 140 35, 150 20"
                  fill="none"
                  stroke="#1e3a8a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M20 40 L 140 38"
                  fill="none"
                  stroke="#1e3a8a"
                  strokeWidth="1"
                  strokeDasharray="4 2"
                />
              </svg>

              {/* Official Stamp Overlay */}
              {activity.firstSignatory.showStamp && (
                <div className="absolute -left-2 top-0 pointer-events-none opacity-85 rotate-[-12deg]">
                  <div className="w-20 h-20 rounded-full border-2 border-indigo-700/80 border-dashed flex flex-col items-center justify-center p-1 text-center bg-indigo-50/20 backdrop-blur-[0.5px]">
                    <div className="w-16 h-16 rounded-full border border-indigo-700/80 flex flex-col items-center justify-center">
                      <span className="text-[6px] font-bold text-indigo-800 uppercase tracking-tighter">KELOMPOK KERJA GURU</span>
                      <span className="text-[7px] font-black text-indigo-900 my-0.5">★ KKG SD ★</span>
                      <span className="text-[5.5px] font-semibold text-indigo-700 uppercase">GUGUS 03 MELATI</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <p className="text-xs font-bold text-blue-950 underline decoration-slate-400">
              {activity.firstSignatory.name}
            </p>
            <p className="text-[10px] text-slate-600 font-mono">
              NIP. {activity.firstSignatory.nip || '-'}
            </p>
          </div>

          {/* Center: QR Code & Verification Tag */}
          <div className="col-span-4 flex flex-col items-center justify-center text-center px-2">
            <div className="bg-white p-1 rounded border border-slate-300 shadow-sm flex flex-col items-center">
              {qrUrl ? (
                <img src={qrUrl} alt="QR Verifikasi" className="w-16 h-16" />
              ) : (
                <div className="w-16 h-16 bg-slate-100 flex items-center justify-center text-[9px] text-slate-400">
                  QR Code
                </div>
              )}
            </div>
            <p className="text-[9px] font-bold text-slate-700 mt-1 uppercase tracking-tight">
              Scan / Pindai Verifikasi
            </p>
            <p className="text-[8px] text-slate-500 font-mono">
              ID: {participant.id}
            </p>
          </div>

          {/* Signatory 2 (Pengawas / Korwil) */}
          <div className="col-span-4 text-center">
            <p className="text-[11px] text-slate-600">
              {activity.location.split(',')[0]}, {activity.issueDateFormatted}
            </p>
            <p className="text-xs font-bold text-slate-900">{activity.secondSignatory.title}</p>
            
            {/* Signature Area */}
            <div className="h-16 flex items-center justify-center relative my-1">
              <svg viewBox="0 0 160 50" className="w-32 h-12 text-blue-900">
                <path
                  d="M15 25 C 35 40, 50 10, 75 35 C 95 15, 115 42, 135 20 C 145 15, 150 25, 155 30"
                  fill="none"
                  stroke="#1e3a8a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="80" cy="20" r="3" fill="#1e3a8a" />
              </svg>
            </div>

            <p className="text-xs font-bold text-blue-950 underline decoration-slate-400">
              {activity.secondSignatory.name}
            </p>
            <p className="text-[10px] text-slate-600 font-mono">
              NIP. {activity.secondSignatory.nip || '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
