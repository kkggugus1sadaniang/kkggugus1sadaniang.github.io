import React, { useState } from 'react';
import {
  KKGActivity,
  Participant,
  CertificateRole,
  CertificateTheme,
  MaterialItem,
} from '../types/certificate';
import { getShareableCertificateUrl } from '../utils/storage';
import {
  Settings,
  Users,
  FileSpreadsheet,
  Plus,
  Trash2,
  Save,
  Check,
  Upload,
  Copy,
  Download,
  Palette,
  BookOpen,
  UserCheck,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface AdminPanelProps {
  activity: KKGActivity;
  participants: Participant[];
  onSaveActivity: (activity: KKGActivity) => void;
  onSaveParticipants: (participants: Participant[]) => void;
  onResetDefaults: () => void;
  onSelectParticipant: (participant: Participant) => void;
  onOpenShareModal: (participant: Participant) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  activity,
  participants,
  onSaveActivity,
  onSaveParticipants,
  onResetDefaults,
  onSelectParticipant,
  onOpenShareModal,
}) => {
  const [activeTab, setActiveTab] = useState<'activity' | 'materials' | 'participants' | 'bulk' | 'links'>('participants');
  
  // Activity form state
  const [actForm, setActForm] = useState<KKGActivity>({ ...activity });
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  // New participant single form state
  const [newParticipant, setNewParticipant] = useState<{
    name: string;
    nipOrNuptk: string;
    schoolOrigin: string;
    role: CertificateRole;
    gradeOrSubject: string;
  }>({
    name: '',
    nipOrNuptk: '',
    schoolOrigin: '',
    role: 'Peserta',
    gradeOrSubject: 'Guru SD',
  });

  // Bulk input state
  const [bulkText, setBulkText] = useState<string>('');
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [bulkSuccess, setBulkSuccess] = useState<string | null>(null);

  // Copy all links state
  const [copiedAllLinks, setCopiedAllLinks] = useState(false);

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveActivity(actForm);
    setSavedMessage('Pengaturan kegiatan KKG berhasil disimpan!');
    setTimeout(() => setSavedMessage(null), 3000);
  };

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParticipant.name.trim()) return;

    const nextSeq = participants.length + 1;
    const paddedSeq = String(nextSeq).padStart(3, '0');
    const newId = `KKG-2026-${paddedSeq}`;
    const certNum = actForm.certificateNumberFormat
      .replace('{seq}', paddedSeq)
      .replace('{year}', '2026');

    const created: Participant = {
      id: newId,
      name: newParticipant.name.trim(),
      nipOrNuptk: newParticipant.nipOrNuptk.trim() || '-',
      schoolOrigin: newParticipant.schoolOrigin.trim() || 'SD Negeri',
      role: newParticipant.role,
      gradeOrSubject: newParticipant.gradeOrSubject.trim(),
      issuedAt: actForm.issueDateFormatted,
      certificateNumber: certNum,
      status: 'valid',
    };

    const updated = [created, ...participants];
    onSaveParticipants(updated);
    setNewParticipant({
      name: '',
      nipOrNuptk: '',
      schoolOrigin: '',
      role: 'Peserta',
      gradeOrSubject: 'Guru SD',
    });
    setSavedMessage(`Sertifikat & Link untuk "${created.name}" berhasil dibuat!`);
    setTimeout(() => setSavedMessage(null), 3000);
  };

  const handleDeleteParticipant = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data peserta ini?')) {
      const updated = participants.filter((p) => p.id !== id);
      onSaveParticipants(updated);
    }
  };

  // Bulk import processor
  const handleProcessBulk = () => {
    setBulkError(null);
    setBulkSuccess(null);

    if (!bulkText.trim()) {
      setBulkError('Silakan masukkan baris data guru terlebih dahulu.');
      return;
    }

    const lines = bulkText.split('\n').filter((l) => l.trim().length > 0);
    const newEntries: Participant[] = [];
    let currentSeq = participants.length;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Format can be tab separated (copied from Excel) or comma separated
      const parts = line.includes('\t')
        ? line.split('\t').map((s) => s.trim())
        : line.split(',').map((s) => s.trim());

      if (parts.length < 1 || !parts[0]) continue;

      currentSeq++;
      const paddedSeq = String(currentSeq).padStart(3, '0');
      const id = `KKG-2026-${paddedSeq}`;
      const certNum = actForm.certificateNumberFormat
        .replace('{seq}', paddedSeq)
        .replace('{year}', '2026');

      const name = parts[0];
      const nip = parts[1] || '-';
      const school = parts[2] || 'SD Negeri';
      const roleStr = (parts[3] || 'Peserta').toLowerCase();
      let role: CertificateRole = 'Peserta';
      if (roleStr.includes('narasumber')) role = 'Narasumber';
      else if (roleStr.includes('fasilitator')) role = 'Fasilitator';
      else if (roleStr.includes('panitia')) role = 'Panitia';
      else if (roleStr.includes('moderator')) role = 'Moderator';

      const grade = parts[4] || 'Guru SD';

      newEntries.push({
        id,
        name,
        nipOrNuptk: nip,
        schoolOrigin: school,
        role,
        gradeOrSubject: grade,
        issuedAt: actForm.issueDateFormatted,
        certificateNumber: certNum,
        status: 'valid',
      });
    }

    if (newEntries.length === 0) {
      setBulkError('Gagal membaca data guru. Pastikan format teks sesuai petunjuk.');
      return;
    }

    const updated = [...participants, ...newEntries];
    onSaveParticipants(updated);
    setBulkSuccess(`Berhasil menambahkan ${newEntries.length} data guru beserta tautan sertifikatnya!`);
    setBulkText('');
  };

  // Add Material item
  const handleAddMaterial = () => {
    const newItem: MaterialItem = {
      id: `m-${Date.now()}`,
      category: 'Pokok',
      name: 'Materi Baru Pelatihan KKG',
      hours: 4,
      instructor: actForm.firstSignatory.name,
    };
    const updated = {
      ...actForm,
      materials: [...actForm.materials, newItem],
    };
    setActForm(updated);
  };

  const handleUpdateMaterial = (id: string, field: keyof MaterialItem, val: any) => {
    const updatedMaterials = actForm.materials.map((m) => {
      if (m.id === id) {
        return { ...m, [field]: val };
      }
      return m;
    });
    const total = updatedMaterials.reduce((sum, item) => sum + (Number(item.hours) || 0), 0);
    setActForm({
      ...actForm,
      materials: updatedMaterials,
      totalHours: total,
    });
  };

  const handleDeleteMaterial = (id: string) => {
    const updatedMaterials = actForm.materials.filter((m) => m.id !== id);
    const total = updatedMaterials.reduce((sum, item) => sum + (Number(item.hours) || 0), 0);
    setActForm({
      ...actForm,
      materials: updatedMaterials,
      totalHours: total,
    });
  };

  // Export all links to text
  const getAllLinksText = () => {
    return participants
      .map((p, idx) => {
        const url = getShareableCertificateUrl(p.id);
        return `${idx + 1}. ${p.name} (${p.schoolOrigin})\n   No. Sertifikat: ${p.certificateNumber}\n   Link Unduh: ${url}\n`;
      })
      .join('\n');
  };

  const handleCopyAllLinks = () => {
    navigator.clipboard.writeText(getAllLinksText());
    setCopiedAllLinks(true);
    setTimeout(() => setCopiedAllLinks(false), 2500);
  };

  const handleDownloadCSV = () => {
    let csv = 'Nama,NIP/NUPTK,Asal Sekolah,Peran,Nomor Sertifikat,Tautan Sertifikat\n';
    participants.forEach((p) => {
      const url = getShareableCertificateUrl(p.id);
      csv += `"${p.name}","${p.nipOrNuptk}","${p.schoolOrigin}","${p.role}","${p.certificateNumber}","${url}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Daftar_Link_Sertifikat_KKG_${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {savedMessage && (
        <div className="p-4 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center justify-between text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-200" />
            <span>{savedMessage}</span>
          </div>
        </div>
      )}

      {/* Admin Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center">
            <Settings className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Panel Pengurus & Generator Sertifikat KKG
            </h2>
            <p className="text-xs text-slate-500">
              Kelola data kegiatan, tanda tangan pejabat, buat link guru massal, dan ekspor link
            </p>
          </div>
        </div>

        <button
          onClick={onResetDefaults}
          className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-red-200 transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Kembalikan Data Contoh KKG</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('participants')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'participants'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Daftar Guru & Tautan ({participants.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bulk')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'bulk'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Impor Massal (Excel / CSV)</span>
        </button>

        <button
          onClick={() => setActiveTab('links')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'links'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Ekspor & Salin Semua Link</span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'activity'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Informasi Kegiatan & Pejabat</span>
        </button>

        <button
          onClick={() => setActiveTab('materials')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'materials'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Materi Halaman 2 ({actForm.totalHours} JP)</span>
        </button>
      </div>

      {/* TAB 1: Participants List & Add Single */}
      {activeTab === 'participants' && (
        <div className="space-y-6">
          {/* Add Single Participant Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Tambah 1 Guru & Terbitkan Link Sertifikat Baru</span>
            </h3>

            <form onSubmit={handleAddParticipant} className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-4">
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Nama Lengkap & Gelar *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Sri Nopi Rahmawati, S.Pd."
                  value={newParticipant.name}
                  onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div className="md:col-span-3">
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  NIP / NUPTK
                </label>
                <input
                  type="text"
                  placeholder="19890412 201402 2 004"
                  value={newParticipant.nipOrNuptk}
                  onChange={(e) => setNewParticipant({ ...newParticipant, nipOrNuptk: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div className="md:col-span-3">
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Asal Sekolah / Unit Kerja
                </label>
                <input
                  type="text"
                  placeholder="SD Negeri Sukamaju 01"
                  value={newParticipant.schoolOrigin}
                  onChange={(e) => setNewParticipant({ ...newParticipant, schoolOrigin: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Peran
                </label>
                <select
                  value={newParticipant.role}
                  onChange={(e) => setNewParticipant({ ...newParticipant, role: e.target.value as CertificateRole })}
                  className="w-full px-2 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-blue-600"
                >
                  <option value="Peserta">Peserta</option>
                  <option value="Narasumber">Narasumber</option>
                  <option value="Fasilitator">Fasilitator</option>
                  <option value="Panitia">Panitia</option>
                  <option value="Moderator">Moderator</option>
                </select>
              </div>

              <div className="md:col-span-12 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Terbitkan Sertifikat & Link</span>
                </button>
              </div>
            </form>
          </div>

          {/* Participant Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">
                Data Guru Terdaftar ({participants.length})
              </h3>
              <p className="text-xs text-slate-500">
                Semua tautan otomatis aktif dan siap dibagikan ke guru
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <th className="py-2.5 px-4 w-12 text-center">No</th>
                    <th className="py-2.5 px-4">Nama Lengkap & NIP</th>
                    <th className="py-2.5 px-4">Asal Sekolah</th>
                    <th className="py-2.5 px-3">Peran</th>
                    <th className="py-2.5 px-4">No. Sertifikat</th>
                    <th className="py-2.5 px-4 text-center">Aksi / Tautan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {participants.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 text-center text-slate-400 font-medium">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{p.name}</p>
                        <p className="text-[11px] text-slate-500 font-mono">NIP: {p.nipOrNuptk}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {p.schoolOrigin}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800">
                          {p.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        {p.certificateNumber}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onSelectParticipant(p)}
                            title="Buka Sertifikat"
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition cursor-pointer"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onOpenShareModal(p)}
                            title="Dapatkan Link & Format WA"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition cursor-pointer"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteParticipant(p.id)}
                            title="Hapus"
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Bulk Import */}
      {activeTab === 'bulk' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" />
              <span>Impor Massal Data Guru dari Excel / Spreadsheet</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Salin dan tempel daftar nama guru dari Excel ke kolom di bawah ini. Sistem akan otomatis membuatkan sertifikat dan tautan unik untuk masing-masing guru!
            </p>
          </div>

          <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-3.5 text-xs text-slate-700 space-y-1">
            <p className="font-bold text-blue-900">Petunjuk Format Baris:</p>
            <p>1 baris untuk 1 guru. Format kolom (pisahkan dengan koma atau Tab langsung copy-paste dari Excel):</p>
            <code className="block bg-white p-2 rounded border border-blue-200 font-mono text-[11px] text-blue-950">
              Nama Lengkap, NIP/NUPTK, Asal Sekolah, Peran
            </code>
            <p className="text-[11px] text-slate-500 italic mt-1">
              Contoh:<br />
              Siti Nurhasanah, S.Pd., 19850214 201001 2 015, SDN Karadenan 01, Peserta<br />
              Ahmad Fauzan, M.Pd., 19900312 201502 1 004, SDN Ciriung 02, Peserta
            </p>
          </div>

          {bulkError && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{bulkError}</span>
            </div>
          )}

          {bulkSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{bulkSuccess}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Tempel Teks / Data Excel Di Sini:
            </label>
            <textarea
              rows={8}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder="Siti Nurhasanah, S.Pd., 19850214 201001 2 015, SDN Karadenan 01, Peserta&#10;Ahmad Fauzan, M.Pd., 19900312 201502 1 004, SDN Ciriung 02, Peserta"
              className="w-full p-3 font-mono text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={handleProcessBulk}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Proses & Generate Link Semua Guru</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Export All Links */}
      {activeTab === 'links' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                <span>Kompilasi Seluruh Tautan Sertifikat Guru ({participants.length})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Koleksi tautan siap disalin untuk diumumkan di Grup WhatsApp KKG atau diarsipkan
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyAllLinks}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                {copiedAllLinks ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedAllLinks ? 'Semua Link Tersalin!' : 'Salin Semua Tautan'}</span>
              </button>

              <button
                onClick={handleDownloadCSV}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File Excel/CSV</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-900 text-slate-200 rounded-xl p-4 font-mono text-xs max-h-96 overflow-y-auto whitespace-pre-wrap border border-slate-800 leading-relaxed">
            {getAllLinksText()}
          </div>
        </div>
      )}

      {/* TAB 4: Activity & Signatories Settings */}
      {activeTab === 'activity' && (
        <form onSubmit={handleSaveActivity} className="space-y-6">
          {/* Main Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Palette className="w-4 h-4 text-blue-600" />
              <span>Detail Kegiatan KKG & Tema Sertifikat</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Nama Kegiatan KKG *
                </label>
                <input
                  type="text"
                  required
                  value={actForm.title}
                  onChange={(e) => setActForm({ ...actForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Nama Gugus / Komunitas KKG *
                </label>
                <input
                  type="text"
                  required
                  value={actForm.gugusName}
                  onChange={(e) => setActForm({ ...actForm,沉gugusName: e.target.value } as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Sub-Judul / Tema Pelatihan *
                </label>
                <textarea
                  rows={2}
                  required
                  value={actForm.subTitle}
                  onChange={(e) => setActForm({ ...actForm, subTitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Nomor SK / Penetapan KKG
                </label>
                <input
                  type="text"
                  value={actForm.skNumber}
                  onChange={(e) => setActForm({ ...actForm, skNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Format Penomoran Sertifikat
                </label>
                <input
                  type="text"
                  value={actForm.certificateNumberFormat}
                  onChange={(e) => setActForm({ ...actForm, certificateNumberFormat: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
                />
                <span className="text-[10px] text-slate-500">Gunakan {'{seq}'} untuk urutan nomor.</span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Waktu Pelaksanaan (Teks Tampil)
                </label>
                <input
                  type="text"
                  value={actForm.eventDateFormatted}
                  onChange={(e) => setActForm({ ...actForm, eventDateFormatted: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Tanggal Terbit Dokumen
                </label>
                <input
                  type="text"
                  value={actForm.issueDateFormatted}
                  onChange={(e) => setActForm({ ...actForm, issueDateFormatted: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Lokasi Pelaksanaan
                </label>
                <input
                  type="text"
                  value={actForm.location}
                  onChange={(e) => setActForm({ ...actForm, location: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Pilihan Warna Desain Sertifikat
                </label>
                <select
                  value={actForm.theme}
                  onChange={(e) => setActForm({ ...actForm, theme: e.target.value as CertificateTheme })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-blue-600"
                >
                  <option value="royal-blue">Royal Blue (Biru Standar Dinas)</option>
                  <option value="classic-gold">Classic Gold (Emas Kemdikbud)</option>
                  <option value="emerald-green">Emerald Green (Hijau Zamrud)</option>
                  <option value="modern-navy">Modern Navy (Navy Elegan)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Signatories */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>Pejabat Penandatangan Resmi</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Signatory 1 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
                <h4 className="text-xs font-bold text-blue-900 uppercase">
                  Penandatangan 1 (Ketua KKG)
                </h4>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block">Nama & Gelar</label>
                  <input
                    type="text"
                    value={actForm.firstSignatory.name}
                    onChange={(e) =>
                      setActForm({
                        ...actForm,
                        firstSignatory: { ...actForm.firstSignatory, name: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block">Jabatan / Judul</label>
                  <input
                    type="text"
                    value={actForm.firstSignatory.title}
                    onChange={(e) =>
                      setActForm({
                        ...actForm,
                        firstSignatory: { ...actForm.firstSignatory, title: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block">NIP</label>
                  <input
                    type="text"
                    value={actForm.firstSignatory.nip || ''}
                    onChange={(e) =>
                      setActForm({
                        ...actForm,
                        firstSignatory: { ...actForm.firstSignatory, nip: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              {/* Signatory 2 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
                <h4 className="text-xs font-bold text-blue-900 uppercase">
                  Penandatangan 2 (Pengawas / Korwil)
                </h4>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block">Nama & Gelar</label>
                  <input
                    type="text"
                    value={actForm.secondSignatory.name}
                    onChange={(e) =>
                      setActForm({
                        ...actForm,
                        secondSignatory: { ...actForm.secondSignatory, name: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block">Jabatan / Judul</label>
                  <input
                    type="text"
                    value={actForm.secondSignatory.title}
                    onChange={(e) =>
                      setActForm({
                        ...actForm,
                        secondSignatory: { ...actForm.secondSignatory, title: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block">NIP</label>
                  <input
                    type="text"
                    value={actForm.secondSignatory.nip || ''}
                    onChange={(e) =>
                      setActForm({
                        ...actForm,
                        secondSignatory: { ...actForm.secondSignatory, nip: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Informasi KKG</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 5: Materials (Page 2) */}
      {activeTab === 'materials' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Struktur Program Materi Pelatihan (Total: {actForm.totalHours} JP)
              </h3>
              <p className="text-xs text-slate-500">
                Tercantum pada Halaman 2 Sertifikat sebagai bukti fisik pemenuhan jam pelatihan guru
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddMaterial}
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-blue-700 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Materi</span>
            </button>
          </div>

          <div className="space-y-3">
            {actForm.materials.map((m, idx) => (
              <div
                key={m.id}
                className="p-3.5 border border-slate-200 rounded-xl bg-slate-50 flex flex-col md:flex-row items-start md:items-center gap-3"
              >
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-900 font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>

                <div className="flex-1 w-full md:w-auto">
                  <input
                    type="text"
                    value={m.name}
                    placeholder="Nama materi..."
                    onChange={(e) => handleUpdateMaterial(m.id, 'name', e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded font-semibold text-slate-800"
                  />
                </div>

                <div className="w-32">
                  <select
                    value={m.category}
                    onChange={(e) => handleUpdateMaterial(m.id, 'category', e.target.value)}
                    className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-700"
                  >
                    <option value="Umum">Umum</option>
                    <option value="Pokok">Pokok</option>
                    <option value="Penunjang">Penunjang</option>
                  </select>
                </div>

                <div className="w-24">
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={m.hours}
                      onChange={(e) => handleUpdateMaterial(m.id, 'hours', Number(e.target.value))}
                      className="w-14 px-2 py-1.5 text-xs bg-white border border-slate-300 rounded font-bold text-center"
                    />
                    <span className="text-xs text-slate-600 font-bold">JP</span>
                  </div>
                </div>

                <div className="w-48">
                  <input
                    type="text"
                    value={m.instructor || ''}
                    placeholder="Narasumber / Fasilitator"
                    onChange={(e) => handleUpdateMaterial(m.id, 'instructor', e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-700"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteMaterial(m.id)}
                  className="p-1.5 text-red-500 hover:text-red-700 rounded hover:bg-red-50 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              type="button"
              onClick={() => {
                onSaveActivity(actForm);
                setSavedMessage('Struktur materi pelatihan KKG berhasil diperbarui!');
                setTimeout(() => setSavedMessage(null), 3000);
              }}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Struktur Materi</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
