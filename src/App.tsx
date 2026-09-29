/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { KKGActivity, Participant } from './types/certificate';
import {
  loadActivity,
  saveActivity,
  loadParticipants,
  saveParticipants,
  resetToDefaults,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { ParticipantSearch } from './components/ParticipantSearch';
import { CertificateModal } from './components/CertificateModal';
import { ShareLinkModal } from './components/ShareLinkModal';
import { PublicVerifyView } from './components/PublicVerifyView';
import { AdminPanel } from './components/AdminPanel';
import {
  ShieldCheck,
  Search,
  Award,
  Link,
  CheckCircle2,
  FileCheck,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export default function App() {
  const [activity, setActivity] = useState<KKGActivity>(loadActivity);
  const [participants, setParticipants] = useState<Participant[]>(loadParticipants);

  const [currentTab, setCurrentTab] = useState<'search' | 'verify' | 'admin'>('search');
  
  // Modals & Active targets
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [shareParticipant, setShareParticipant] = useState<Participant | null>(null);

  // Verification target
  const [verifyTarget, setVerifyTarget] = useState<Participant | null>(null);
  const [verifySearchInput, setVerifySearchInput] = useState<string>('');

  // Handle URL query parameters (?cert=... or ?verify=... or ?id=...)
  useEffect(() => {
    const handleUrlParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const certParam = urlParams.get('cert') || urlParams.get('id');
      const verifyParam = urlParams.get('verify');

      if (verifyParam) {
        const found = participants.find(
          (p) =>
            p.id.toLowerCase() === verifyParam.toLowerCase() ||
            p.certificateNumber.toLowerCase() === verifyParam.toLowerCase()
        );
        setVerifyTarget(found || null);
        setCurrentTab('verify');
      } else if (certParam) {
        const found = participants.find(
          (p) =>
            p.id.toLowerCase() === certParam.toLowerCase() ||
            p.certificateNumber.toLowerCase() === certParam.toLowerCase()
        );
        if (found) {
          setSelectedParticipant(found);
        }
      }
    };

    handleUrlParams();
    window.addEventListener('popstate', handleUrlParams);
    return () => window.removeEventListener('popstate', handleUrlParams);
  }, [participants]);

  // Sync state if storage updates externally
  useEffect(() => {
    const syncData = () => {
      setActivity(loadActivity());
      setParticipants(loadParticipants());
    };
    window.addEventListener('kkg_data_updated', syncData);
    return () => window.removeEventListener('kkg_data_updated', syncData);
  }, []);

  const handleUpdateActivity = (newAct: KKGActivity) => {
    setActivity(newAct);
    saveActivity(newAct);
  };

  const handleUpdateParticipants = (newParts: Participant[]) => {
    setParticipants(newParts);
    saveParticipants(newParts);
  };

  const handleResetData = () => {
    if (confirm('Kembalikan semua data ke pengaturan dan peserta contoh resmi KKG?')) {
      resetToDefaults();
      setActivity(loadActivity());
      setParticipants(loadParticipants());
    }
  };

  const handleManualVerifySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifySearchInput.trim()) return;

    const term = verifySearchInput.trim().toLowerCase();
    const found = participants.find(
      (p) =>
        p.id.toLowerCase() === term ||
        p.certificateNumber.toLowerCase() === term ||
        p.nipOrNuptk.toLowerCase() === term ||
        p.name.toLowerCase().includes(term)
    );

    setVerifyTarget(found || null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        onChangeTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'verify') {
            setVerifyTarget(null);
          }
        }}
        activity={activity}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* TAB 1: Search & Shareable Certificate Links */}
        {currentTab === 'search' && (
          <ParticipantSearch
            activity={activity}
            participants={participants}
            onSelectParticipant={(p) => setSelectedParticipant(p)}
            onOpenShareModal={(p) => setShareParticipant(p)}
          />
        )}

        {/* TAB 2: Verification Portal */}
        {currentTab === 'verify' && (
          <div className="space-y-6">
            {verifyTarget ? (
              <PublicVerifyView
                activity={activity}
                participant={verifyTarget}
                onBackToHome={() => {
                  setVerifyTarget(null);
                  setCurrentTab('search');
                }}
                onOpenCertificate={(p) => setSelectedParticipant(p)}
              />
            ) : (
              <div className="max-w-2xl mx-auto my-6 space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-lg text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center mx-auto border border-blue-100 shadow-inner">
                    <ShieldCheck className="w-9 h-9" />
                  </div>

                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Verifikasi Keabsahan Sertifikat KKG
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                      Masukkan ID Dokumen (contoh: <code className="text-blue-700 font-mono">KKG-2026-001</code>), Nomor Sertifikat, atau NIP Guru untuk mengecek keaslian.
                    </p>
                  </div>

                  <form onSubmit={handleManualVerifySearch} className="flex gap-2 max-w-md mx-auto pt-2">
                    <input
                      type="text"
                      required
                      placeholder="Masukkan ID / Nomor Sertifikat / NIP..."
                      value={verifySearchInput}
                      onChange={(e) => setVerifySearchInput(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-xs"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                    >
                      Periksa
                    </button>
                  </form>

                  {/* Quick samples to click */}
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-[11px] text-slate-400 mb-2">Contoh ID untuk dicoba:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {participants.slice(0, 3).map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setVerifySearchInput(p.id);
                            setVerifyTarget(p);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[11px] font-mono transition cursor-pointer"
                        >
                          {p.id} ({p.name.split(' ')[0]})
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Admin & Link Generator Dashboard */}
        {currentTab === 'admin' && (
          <AdminPanel
            activity={activity}
            participants={participants}
            onSaveActivity={handleUpdateActivity}
            onSaveParticipants={handleUpdateParticipants}
            onResetDefaults={handleResetData}
            onSelectParticipant={(p) => setSelectedParticipant(p)}
            onOpenShareModal={(p) => setShareParticipant(p)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 print:hidden text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-700">
            Sistem Portal Tautan & Sertifikasi Resmi Kelompok Kerja Guru (KKG) SD
          </p>
          <p className="text-[11px] text-slate-400">
            Standar Dokumen Peningkatan Kompetensi Guru (32 JP) • Mendukung Bukti Dukung Pengelolaan Kinerja Guru & PMM Kemendikbudristek
          </p>
        </div>
      </footer>

      {/* Modal: Full Certificate View (Page 1 & 2 + Print/PDF) */}
      {selectedParticipant && (
        <CertificateModal
          activity={activity}
          participant={selectedParticipant}
          onClose={() => setSelectedParticipant(null)}
          onOpenShareModal={(p) => {
            setSelectedParticipant(null);
            setShareParticipant(p);
          }}
        />
      )}

      {/* Modal: Share Link & WhatsApp Generator */}
      {shareParticipant && (
        <ShareLinkModal
          activity={activity}
          participant={shareParticipant}
          onClose={() => setShareParticipant(null)}
          onOpenCertificate={(p) => {
            setShareParticipant(null);
            setSelectedParticipant(p);
          }}
        />
      )}
    </div>
  );
}
