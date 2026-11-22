import React from 'react';
import { Search, Plus, User, Calendar } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatDateID } from '../../utils/formatters';

export const Topbar: React.FC = () => {
  const { 
    globalSearchQuery, 
    setGlobalSearchQuery, 
    openAddTransactionWithAmount,
    userProfile,
    setActivePage
  } = useFinance();

  const todayStr = '2026-11-19';

  return (
    <header className="sticky top-0 z-30 bg-finora-bgSecondary/95 backdrop-blur-md border-b border-finora-border px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 transition-all">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-finora-textMuted">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={globalSearchQuery}
          onChange={(e) => setGlobalSearchQuery(e.target.value)}
          placeholder="Cari transaksi, kategori, atau catatan..."
          className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm input-field"
        />
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Date Display */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-finora-textSecondary bg-finora-bgTeritary px-3 py-1.5 rounded-lg border border-finora-border">
          <Calendar className="w-3.5 h-3.5 text-finora-primary" />
          <span className="font-medium">{formatDateID(todayStr)}</span>
        </div>

        {/* Quick Add Button (Mobile/Tablet) */}
        <button
          onClick={() => openAddTransactionWithAmount()}
          className="lg:hidden flex items-center justify-center p-2 rounded-btn btn-primary"
          title="Tambah Transaksi"
          aria-label="Tambah Transaksi"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* User Profile Button */}
        <button
          onClick={() => setActivePage('settings')}
          className="flex items-center gap-2 p-1 pl-2 sm:pl-3 pr-1.5 rounded-full hover:bg-finora-bgTeritary transition-all focus:outline-none border border-finora-border"
          title="Profil Pengguna & Pengaturan"
        >
          <span className="text-xs font-semibold text-finora-textPrimary max-w-[120px] truncate hidden sm:inline">
            {userProfile.name || 'Pengguna'}
          </span>
          {userProfile.avatarUrl ? (
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-7 h-7 rounded-full object-cover border border-finora-border"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-finora-lightBlue text-finora-primary flex items-center justify-center font-bold text-xs">
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
            </div>
          )}
        </button>
      </div>
    </header>
  );
};