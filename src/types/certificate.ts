export type CertificateRole = 'Peserta' | 'Narasumber' | 'Fasilitator' | 'Panitia' | 'Moderator';

export type CertificateTheme = 'classic-gold' | 'royal-blue' | 'emerald-green' | 'modern-navy';

export interface MaterialItem {
  id: string;
  name: string;
  category: 'Umum' | 'Pokok' | 'Penunjang';
  hours: number;
  instructor?: string;
}

export interface Signatory {
  name: string;
  title: string;
  position: string;
  nip?: string;
  signatureImage?: string; // data URL or standard signature
  showStamp?: boolean;
}

export interface KKGActivity {
  id: string;
  title: string;
  subTitle: string;
  gugusName: string;
  district: string;
  regency: string;
  province: string;
  certificateNumberFormat: string; // e.g. "421.2/{seq}/KKG-GUGUS-03/{year}"
  skNumber: string;
  startDate: string;
  endDate: string;
  eventDateFormatted: string; // e.g. "15 - 18 September 2026"
  issueDateFormatted: string; // e.g. "20 September 2026"
  location: string;
  totalHours: number; // e.g. 32 JP
  theme: CertificateTheme;
  firstSignatory: Signatory; // Ketua KKG
  secondSignatory: Signatory; // Pengawas / Korwil
  materials: MaterialItem[];
}

export interface Participant {
  id: string; // e.g. "KKG-2026-001"
  name: string;
  nipOrNuptk: string;
  schoolOrigin: string;
  role: CertificateRole;
  email?: string;
  phone?: string;
  gradeOrSubject?: string; // e.g. "Guru Kelas IV", "Guru PJOK", etc.
  issuedAt: string;
  certificateNumber: string;
  status: 'valid' | 'revoked';
}
