import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  PieChart, 
  Target, 
  BarChart3, 
  Calculator, 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Wallet,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import type { ActivePage } from '../../types';

export const Sidebar: React.FC = () => {
  const { 
    activePage, 
    setActivePage, 
    openAddTransactionWithAmount,
    accessMode,
    userProfile 
  } = useFinance();

  const [isTransactionsExpanded, setIsTransactionsExpanded] = useState(true);

  const navItems = [
    {
      id: 'dashboard' as ActivePage,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'transactions' as ActivePage,
      label: 'Transaksi',
      icon: ArrowLeftRight,
      hasSubmenu: true,
    },
    {
      id: 'budget' as ActivePage,
      label: 'Anggaran',
      icon: PieChart,
    },
    {
      id: 'savings' as ActivePage,
      label: 'Target Tabungan',
      icon: Target,
    },
    {
      id: 'reports' as ActivePage,
      label: 'Laporan',
      icon: BarChart3,
    },
    {
      id: 'calculator' as ActivePage,
      label: 'Kalkulator',
      icon: Calculator,
    },
    {
      id: 'settings' as ActivePage,
      label: 'Pengaturan',
      icon: Settings,
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-finora-darkBlue text-white h-screen sticky top-0 flex-shrink-0 shadow-lg select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-finora-primary flex items-center justify-center text-white shadow-md">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              FINORA
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-300">
                v1.0
              </span>
            </h1>
            <p className="text-[11px] text-slate-300 font-medium">Personal Finance App</p>
          </div>
        </div>
      </div>

      {/* Quick Add Transaction Button */}
      <div className="px-5 pt-5 pb-2">
        <button
          onClick={() => openAddTransactionWithAmount()}
          className="w-full flex items-center justify-center gap-2 bg-finora-primary hover:bg-finora-primaryDark text-white py-2.5 px-4 rounded-btn font-medium text-sm transition-all shadow-md active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Transaksi</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          const Icon = item.icon;

          if (item.hasSubmenu) {
            return (
              <div key={item.id} className="space-y-0.5">
                <button
                  onClick={() => {
                    setActivePage('transactions');
                    setIsTransactionsExpanded(!isTransactionsExpanded);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-finora-primary text-white shadow-sm'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isTransactionsExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-300" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  )}
                </button>

                {/* Submenu */}
                {isTransactionsExpanded && (
                  <div className="pl-9 pr-2 py-1 space-y-1">
                    <button
                      onClick={() => setActivePage('transactions')}
                      className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg transition-colors ${
                        activePage === 'transactions'
                          ? 'text-white font-medium bg-white/10'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      Semua Transaksi
                    </button>
                  </div>
                )}
              </div>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-finora-primary text-white shadow-sm'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Status / Mode Footer */}
      <div className="p-4 border-t border-white/10 bg-slate-900/40">
        <div 
          onClick={() => setActivePage('settings')}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
        >
          <img
            src={userProfile.avatarUrl}
            alt={userProfile.name}
            className="w-9 h-9 rounded-full object-cover border border-white/20"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{userProfile.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {accessMode === 'guest' ? (
                <span className="inline-flex items-center gap-1 text-[10px] text-amber-300 font-medium">
                  <ShieldCheck className="w-3 h-3" /> Guest Mode
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300 font-medium">
                  <UserCheck className="w-3 h-3" /> Account Mode
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
