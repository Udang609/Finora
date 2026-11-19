import React from 'react';
import { Search, Plus, User, ShieldCheck, UserCheck, Calendar } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatDateID } from '../../utils/formatters';

export const Topbar: React.FC = () => {
  const { 
    globalSearchQuery, 
    setGlobalSearchQuery, 
    openAddTransactionWithAmount,
    accessMode,
    userProfile,
    setActivePage
  } = useFinance();

  const todayStr = '2026-11-19';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-finora-border px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 transition-all">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={globalSearchQuery}
          onChange={(e) => setGlobalSearchQuery(e.target.value)}
          placeholder="Cari transaksi, kategori, atau catatan..."
          className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-finora-bg border border-finora-border rounded-btn text-finora-textPrimary placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-finora-primary/20 focus:border-finora-primary transition-all"
        />
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Date Display */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-finora-textSecondary bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
          <Calendar className="w-3.5 h-3.5 text-finora-primary" />
          <span className="font-medium">{formatDateID(todayStr)}</span>
        </div>

        {/* Mode Badge */}
        <button
          onClick={() => setActivePage('settings')}
          className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors border ${
            accessMode === 'guest'
              ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
          }`}
          title="Klik untuk pengaturan akun"
        >
          {accessMode === 'guest' ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Guest</span>
            </>
          ) : (
            <>
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Akun</span>
            </>
          )}
        </button>

        {/* Quick Add Button (Mobile/Tablet) */}
        <button
          onClick={() => openAddTransactionWithAmount()}
          className="lg:hidden flex items-center justify-center p-2 rounded-btn bg-finora-primary hover:bg-finora-primaryDark text-white shadow-sm"
          title="Tambah Transaksi"
          aria-label="Tambah Transaksi"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* User Avatar */}
        <button
          onClick={() => setActivePage('settings')}
          className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-finora-primary/30 transition-all focus:outline-none"
          title="Pengaturan Profil"
        >
          {userProfile.avatarUrl ? (
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-finora-lightBlue text-finora-primary flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
          )}
        </button>
      </div>
    </header>
  );
};
