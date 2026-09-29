import React from 'react';
import { Award, Search, ShieldCheck, Settings, BookOpen } from 'lucide-react';
import { KKGActivity } from '../types/certificate';

interface NavbarProps {
  currentTab: 'search' | 'verify' | 'admin';
  onChangeTab: (tab: 'search' | 'verify' | 'admin') => void;
  activity: KKGActivity;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onChangeTab,
  activity,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => onChangeTab('search')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-900 to-indigo-700 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Award className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                  Sertifikat<span className="text-blue-600">KKG</span>
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full">
                  {activity.totalHours} JP
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate max-w-[200px] sm:max-w-xs">
                {activity.gugusName}
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onChangeTab('search')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentTab === 'search'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Pencarian & Unduh</span>
            </button>

            <button
              onClick={() => onChangeTab('verify')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentTab === 'verify'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verifikasi QR</span>
            </button>

            <button
              onClick={() => onChangeTab('admin')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentTab === 'admin'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Panel Pengurus</span>
              <span className="sm:hidden">Admin</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
