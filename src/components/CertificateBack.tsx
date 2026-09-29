import React from 'react';
import { KKGActivity, Participant } from '../types/certificate';

interface CertificateBackProps {
  activity: KKGActivity;
  participant: Participant;
  scale?: number;
}

export const CertificateBack: React.FC<CertificateBackProps> = ({
  activity,
  participant,
  scale = 1,
}) => {
  const totalJP = activity.materials.reduce((sum, item) => sum + item.hours, 0);

  return (
    <div
      className="relative bg-white text-slate-900 shadow-2xl overflow-hidden print:shadow-none print:m-0"
      style={{
        width: '1050px',
        height: '742px',
        transformOrigin: 'top left',
        transform: scale !== 1 ? `scale(${scale})` : undefined,
      }}
      id={`cert-back-${participant.id}`}
    >
      {/* Outer Border */}
      <div className="absolute inset-4 border-2 border-slate-700 pointer-events-none"></div>
      <div className="absolute inset-5 border border-slate-300 pointer-events-none"></div>

      <div className="relative z-10 px-16 py-8 flex flex-col h-full justify-between">
        {/* Header */}
        <div className="text-center border-b border-slate-400 pb-3">
          <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900 font-serif">
            STRUKTUR PROGRAM & ALOKASI JAM PEMBELAJARAN
          </h2>
          <p className="text-xs font-semibold text-blue-900 uppercase mt-0.5">
            {activity.title}
          </p>
          <p className="text-[11px] text-slate-600">
            Nomor Sertifikat: <span className="font-mono font-medium">{participant.certificateNumber}</span>
          </p>
        </div>

        {/* Participant Mini Info */}
        <div className="bg-slate-50 border border-slate-200 rounded p-2.5 text-xs grid grid-cols-2 gap-2 my-1">
          <div>
            <span className="text-slate-500 font-medium">Nama Peserta:</span>{' '}
            <strong className="text-slate-900">{participant.name}</strong>
          </div>
          <div>
            <span className="text-slate-500 font-medium">NIP / NUPTK:</span>{' '}
            <strong className="text-slate-900">{participant.nipOrNuptk || '-'}</strong>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Unit Kerja:</span>{' '}
            <strong className="text-slate-900">{participant.schoolOrigin}</strong>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Peran / Tugas:</span>{' '}
            <strong className="text-blue-900 font-semibold">{participant.role} ({participant.gradeOrSubject || 'Guru SD'})</strong>
          </div>
        </div>

        {/* Material Table */}
        <div className="overflow-hidden border border-slate-300 rounded text-xs my-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 font-semibold">
                <th className="py-1.5 px-3 w-12 text-center border-r border-slate-300">NO</th>
                <th className="py-1.5 px-4 border-r border-slate-300">MATERI KEGIATAN / POKOK BAHASAN</th>
                <th className="py-1.5 px-3 w-28 text-center border-r border-slate-300">KATEGORI</th>
                <th className="py-1.5 px-3 w-20 text-center border-r border-slate-300">WAKTU (JP)</th>
                <th className="py-1.5 px-4 w-52">NARASUMBER / FASILITATOR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {activity.materials.map((m, idx) => (
                <tr key={m.id} className="hover:bg-slate-50/50">
                  <td className="py-1.5 px-3 text-center font-medium text-slate-600 border-r border-slate-300">
                    {idx + 1}
                  </td>
                  <td className="py-1.5 px-4 font-medium text-slate-850 border-r border-slate-300">
                    {m.name}
                  </td>
                  <td className="py-1.5 px-3 text-center text-slate-600 border-r border-slate-300">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-slate-100 font-medium">
                      {m.category}
                    </span>
                  </td>
                  <td className="py-1.5 px-3 text-center font-bold text-slate-900 border-r border-slate-300">
                    {m.hours} JP
                  </td>
                  <td className="py-1.5 px-4 text-slate-700 text-[11px]">
                    {m.instructor || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100/90 font-bold border-t-2 border-slate-300 text-slate-900">
                <td colSpan={3} className="py-2 px-4 text-right uppercase tracking-wider border-r border-slate-300">
                  JUMLAH ALOKASI JAM PELAJARAN (JP)
                </td>
                <td className="py-2 px-3 text-center text-blue-900 font-extrabold text-sm border-r border-slate-300">
                  {totalJP} JP
                </td>
                <td className="py-2 px-4 text-[10px] text-slate-500 font-normal italic">
                  * 1 JP setara 45 menit pembelajaran tatap muka/mandiri
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer Notes & Legal Signatory */}
        <div className="grid grid-cols-12 items-end pt-2 border-t border-slate-200">
          <div className="col-span-7 pr-4 text-[11px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">Catatan:</p>
            <p>1. Sertifikat ini sah dan diakui sebagai bukti fisik pengembangan keprofesian berkelanjutan (PKB) guru.</p>
            <p>2. Keabsahan data dapat diverifikasi secara daring melalui sistem resmi dengan memindai kode QR pada halaman depan.</p>
          </div>

          <div className="col-span-5 text-center">
            <p className="text-[11px] text-slate-600">
              Ditetapkan di {activity.location.split(',')[0]}
            </p>
            <p className="text-[11px] text-slate-600">
              Pada tanggal {activity.issueDateFormatted}
            </p>
            <p className="text-xs font-bold text-slate-900 mt-1">
              {activity.firstSignatory.title}
            </p>
            
            {/* Signature Area */}
            <div className="h-14 flex items-center justify-center relative my-0.5">
              <svg viewBox="0 0 160 50" className="w-28 h-10 text-blue-900">
                <path
                  d="M10 35 C 30 10, 45 45, 60 20 C 75 5, 90 40, 110 25 C 125 15, 140 35, 150 20"
                  fill="none"
                  stroke="#1e3a8a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <p className="text-xs font-bold text-blue-950 underline decoration-slate-400">
              {activity.firstSignatory.name}
            </p>
            <p className="text-[10px] text-slate-600 font-mono">
              NIP. {activity.firstSignatory.nip || '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
