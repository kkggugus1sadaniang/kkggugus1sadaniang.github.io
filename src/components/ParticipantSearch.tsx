import React, { useState, useMemo } from 'react';
import { KKGActivity, Participant } from '../types/certificate';
import { getShareableCertificateUrl } from '../utils/storage';
import {
  Search,
  Award,
  Link,
  Share2,
  Eye,
  CheckCircle2,
  FileCheck2,
  School,
  User,
  Filter,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface ParticipantSearchProps {
  activity: KKGActivity;
  participants: Participant[];
  onSelectParticipant: (participant: Participant) => void;
  onOpenShareModal: (participant: Participant) => void;
}

export const ParticipantSearch: React.FC<ParticipantSearchProps> = ({
  activity,
  participants,
  onSelectParticipant,
  onOpenShareModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.nipOrNuptk.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.schoolOrigin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchRole =
        selectedRole === 'all' || p.role.toLowerCase() === selectedRole.toLowerCase();

      return matchSearch && matchRole;
    });
  }, [participants, searchTerm, selectedRole]);

  const handleCopyLink = (p: Participant, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = getShareableCertificateUrl(p.id);
    navigator.clipboard.writeText(link);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleWhatsApp = (p: Participant, e: React.MouseEvent) => {
    e.stopPropagation();
    const certUrl = getShareableCertificateUrl(p.id);
    const text = encodeURIComponent(
      `Halo Bapak/Ibu ${p.name}, berikut link sertifikat resmi kegiatan KKG (${activity.totalHours} JP):\n${certUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-blue-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>Sertifikat Resmi {activity.totalHours} Jam Pelajaran (JP)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Portal Tautan & Sertifikat KKG
          </h1>

          <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
            {activity.title} • {activity.gugusName}. Cari nama Bapak/Ibu guru untuk mendapatkan link langsung, unduh PDF resmi, atau bagikan via WhatsApp.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-blue-200">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Verifikasi Barcode & QR Code
            </span>
            <span className="flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              Sesuai Format Portofolio PMM & BKN
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-sky-400" />
              {activity.eventDateFormatted}
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari berdasarkan Nama Guru, NIP, NUPTK, atau Sekolah (Contoh: Sri Nopi / Sukamaju)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-3 focus:ring-blue-100 text-sm transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-0.5 rounded cursor-pointer"
              >
                Hapus
              </button>
            )}
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3.5 py-3 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-700 focus:outline-hidden focus:border-blue-600 focus:ring-3 focus:ring-blue-100 cursor-pointer"
            >
              <option value="all">Semua Peran ({participants.length})</option>
              <option value="peserta">Peserta</option>
              <option value="narasumber">Narasumber</option>
              <option value="fasilitator">Fasilitator</option>
              <option value="panitia">Panitia</option>
            </select>
          </div>
        </div>

        {/* Results Counter and Tips */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100 gap-2">
          <span>
            Menampilkan <strong className="text-slate-800">{filteredParticipants.length}</strong> dari {participants.length} data guru terdaftar
          </span>
          <span className="text-slate-400 italic">
            Klik tombol "Salin Link" atau "Buka" untuk melihat tampilan sertifikat
          </span>
        </div>
      </div>

      {/* Participant List Cards */}
      {filteredParticipants.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">Tidak Ditemukan Data Guru</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Tidak ada sertifikat yang cocok dengan kata kunci "{searchTerm}". Pastikan ejaan nama atau nomor NIP sudah benar.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedRole('all');
            }}
            className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
          >
            Reset Pencarian
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredParticipants.map((p) => {
            const isCopied = copiedId === p.id;
            return (
              <div
                key={p.id}
                onClick={() => onSelectParticipant(p)}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold text-xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors text-sm sm:text-base leading-snug">
                          {p.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-mono">
                          NIP: {p.nipOrNuptk || 'Non-NIP'}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wider ${
                        p.role === 'Narasumber'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : p.role === 'Fasilitator'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : p.role === 'Panitia'
                          ? 'bg-slate-100 text-slate-800 border border-slate-200'
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {p.role}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 pl-11 mb-3">
                    <p className="flex items-center gap-1.5 truncate">
                      <School className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-700">{p.schoolOrigin}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      No: {p.certificateNumber}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleCopyLink(p, e)}
                      title="Salin Tautan Sertifikat"
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <Link className="w-3.5 h-3.5" />
                      <span>{isCopied ? 'Tersalin!' : 'Salin Link'}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenShareModal(p);
                      }}
                      title="Opsi Bagikan & QR"
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => handleWhatsApp(p, e)}
                      title="Kirim ke WhatsApp Guru"
                      className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition cursor-pointer"
                    >
                      <span className="text-[11px] font-bold">WA</span>
                    </button>
                  </div>

                  <button
                    onClick={() => onSelectParticipant(p)}
                    className="text-xs font-bold text-blue-600 group-hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Buka Sertifikat</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
