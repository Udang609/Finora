import React, { useState } from 'react';
import { LayoutDashboard, ArrowLeftRight, MoreHorizontal, Plus } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { MoreMenuModal } from './MoreMenuModal';

export const BottomNav: React.FC = () => {
  const { activePage, setActivePage, openAddTransactionWithAmount } = useFinance();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const isMoreActive = ['budget', 'savings', 'reports', 'calculator', 'settings'].includes(activePage);

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-finora-border px-4 py-2 flex items-center justify-around shadow-lg">
        {/* Dashboard */}
        <button
          onClick={() => setActivePage('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            activePage === 'dashboard'
              ? 'text-finora-primary font-semibold'
              : 'text-finora-textSecondary hover:text-finora-textPrimary'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 ${activePage === 'dashboard' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[11px] mt-1">Dashboard</span>
        </button>

        {/* Center Floating Plus Button */}
        <button
          onClick={() => openAddTransactionWithAmount()}
          className="flex items-center justify-center -mt-5 w-12 h-12 rounded-full bg-finora-primary text-white shadow-soft-lg hover:bg-finora-primaryDark active:scale-95 transition-all"
          aria-label="Tambah Transaksi"
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* Transaksi */}
        <button
          onClick={() => setActivePage('transactions')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            activePage === 'transactions'
              ? 'text-finora-primary font-semibold'
              : 'text-finora-textSecondary hover:text-finora-textPrimary'
          }`}
        >
          <ArrowLeftRight className={`w-5 h-5 ${activePage === 'transactions' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[11px] mt-1">Transaksi</span>
        </button>

        {/* Lainnya */}
        <button
          onClick={() => setIsMoreOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isMoreActive
              ? 'text-finora-primary font-semibold'
              : 'text-finora-textSecondary hover:text-finora-textPrimary'
          }`}
        >
          <MoreHorizontal className={`w-5 h-5 ${isMoreActive ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[11px] mt-1">Lainnya</span>
        </button>
      </div>

      <MoreMenuModal isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} />
    </>
  );
};
