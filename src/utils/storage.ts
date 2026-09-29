import { KKGActivity, Participant } from '../types/certificate';
import { initialActivity, initialParticipants } from '../data/mockData';

const ACTIVITY_STORAGE_KEY = 'kkg_portal_activity_v1';
const PARTICIPANTS_STORAGE_KEY = 'kkg_portal_participants_v1';

export function loadActivity(): KKGActivity {
  try {
    const raw = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load activity from localStorage', err);
  }
  return initialActivity;
}

export function saveActivity(activity: KKGActivity): void {
  try {
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activity));
    window.dispatchEvent(new Event('kkg_data_updated'));
  } catch (err) {
    console.error('Failed to save activity to localStorage', err);
  }
}

export function loadParticipants(): Participant[] {
  try {
    const raw = localStorage.getItem(PARTICIPANTS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load participants from localStorage', err);
  }
  return initialParticipants;
}

export function saveParticipants(participants: Participant[]): void {
  try {
    localStorage.setItem(PARTICIPANTS_STORAGE_KEY, JSON.stringify(participants));
    window.dispatchEvent(new Event('kkg_data_updated'));
  } catch (err) {
    console.error('Failed to save participants to localStorage', err);
  }
}

export function resetToDefaults(): void {
  localStorage.removeItem(ACTIVITY_STORAGE_KEY);
  localStorage.removeItem(PARTICIPANTS_STORAGE_KEY);
  window.dispatchEvent(new Event('kkg_data_updated'));
}

export function getShareableCertificateUrl(participantId: string): string {
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  return `${origin}${pathname}?cert=${encodeURIComponent(participantId)}`;
}

export function getVerificationUrl(participantId: string): string {
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  return `${origin}${pathname}?verify=${encodeURIComponent(participantId)}`;
}
