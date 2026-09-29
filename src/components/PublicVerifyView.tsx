import React from 'react';
import { KKGActivity, Participant } from '../types/certificate';
import { getShareableCertificateUrl } from '../utils/storage';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Calendar,
  School,
  FileText,
  User,
  ExternalLink,
  ArrowLeft,
  Clock,
  Printer,
  Share2,
} from 'lucide-react';

interface PublicVerifyViewProps {
  activity: KKGActivity;
  participant: Participant | null;
  onBackToHome: () => void;
  onOpenCertificate: (participant: Participant) => void;
}

export const PublicVerifyView: React.FC<PublicVerifyViewProps> = ({
  activity,
  participant,
  onBackToHome,
  onOpenCertificate,
}) => {
  if (!participant) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-2xl border border-red-200 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Data Sertifikat Tidak Ditemukan
        </h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Nomor identifikasi sertifikat yang Anda cari tidak terdaftar dalam pangkalan data resmi KKG ini atau telah dicabut.
        </p>
        <button
          onClick={onBackToHome}
          className="mt-4 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-xs inline-flex items-center gap-2 hover:bg-blue-700 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Pencarian Sertifikat</span>
        </button>
      </div>
    );
  }

  const certUrl = getShareableCertificateUrl(participant.id);

  return (
    <div className="max-w-3xl mx-auto my-6 px-4 space-y-6">
      {/* Back button */}
      <button
        onClick={onBackToHome}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Halaman Utama</span>
      </button>

      {/* Verification Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Verification Status Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 border border-white/30 shadow-inner">
              <CheckCircle2 className="w-10 h-10 text-emerald-200" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/40 text-emerald-100 text-xs font-bold uppercase tracking-wider mb-1.5 border border-emerald-300/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Sertifikat Resmi & Sah Terverifikasi</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black">
                Validasi Keaslian Dokumen KKG
              </h1>
              <p className="text-emerald-100 text-xs mt-0.5">
                Dokumen ini terdaftar resmi dalam Basis Data Kelompok Kerja Guru (KKG)
              </p>
            </div>
          </div>
        </div>

        {/* Certificate Meta Details */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Main Attributes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Nomor Registrasi Sertifikat</span>
              </p>
              <p className="font-mono text-sm sm:text-base font-bold text-slate-900 break-all">
                {participant.certificateNumber}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Tanggal Terbit Dokumen</span>
              </p>
              <p className="text-sm sm:text-base font-bold text-slate-900">
                {activity.issueDateFormatted}
              </p>
            </div>
          </div>

          {/* Teacher Profile Section */}
          <div className="border border-slate-200 rounded-xl p-5 bg-gradient-to-b from-blue-50/40 to-transparent">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-700" />
              <span>Identitas Penerima Sertifikat</span>
            </h3>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-2.5 gap-1">
                <span className="text-xs text-slate-600">Nama Lengkap & Gelar:</span>
                <span className="text-sm font-bold text-blue-950 font-serif">
                  {participant.name}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-2.5 gap-1">
                <span className="text-xs text-slate-600">NIP / NUPTK:</span>
                <span className="text-xs font-mono font-semibold text-slate-800">
                  {participant.nipOrNuptk || '-'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-2.5 gap-1">
                <span className="text-xs text-slate-600">Instansi / Unit Kerja:</span>
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-slate-500" />
                  {participant.schoolOrigin}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-xs text-slate-600">Peran Dalam Kegiatan:</span>
                <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                  {participant.role} ({participant.gradeOrSubject || 'Pendidik'})
                </span>
              </div>
            </div>
          </div>

          {/* Activity Info */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/70">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Keterangan Penyelenggaraan</span>
            </h3>

            <div className="space-y-2 text-xs text-slate-700">
              <p>
                <strong className="text-slate-900">Kegiatan:</strong> {activity.title}
              </p>
              <p>
                <strong className="text-slate-900">Tema:</strong> "{activity.subTitle}"
              </p>
              <p>
                <strong className="text-slate-900">Penyelenggara:</strong> {activity.gugusName} ({activity.district}, {activity.regency})
              </p>
              <div className="flex items-center gap-3 pt-1">
                <span className="inline-flex items-center gap-1 text-slate-800 font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-md">
                  <Clock className="w-3.5 h-3.5" />
                  Alokasi: {activity.totalHours} Jam Pelajaran (JP)
                </span>
                <span className="text-slate-600">
                  SK Penetapan: <code className="font-mono text-[11px]">{activity.skNumber}</code>
                </span>
              </div>
            </div>
          </div>

          {/* Action Callouts */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => onOpenCertificate(participant)}
              className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Buka & Cetak Dokumen Sertifikat</span>
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(certUrl);
                alert('Tautan sertifikat berhasil disalin!');
              }}
              className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-300 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Salin Link</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
