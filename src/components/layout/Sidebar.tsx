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
  User
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import type { ActivePage } from '../../types';

export const Sidebar: React.FC = () => {
  const { 
    activePage, 
    setActivePage, 
    openAddTransactionWithAmount,
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
    <aside className="hidden lg:flex flex-col w-64 bg-finora-bgSecondary border-r border-finora-border text-finora-textPrimary h-screen sticky top-0 flex-shrink-0 shadow-soft select-none dark:shadow-soft-dark">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-finora-border">
        <div className="flex items-center gap-3">
          <img
            src="./pwa-192x192.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-xl shadow-md flex-shrink-0"
          />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-finora-textPrimary flex items-center gap-1.5">
              FINORA
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-finora-primary/20 text-finora-primary">
                v1.0
              </span>
            </h1>
            <p className="text-[11px] text-finora-textMuted font-medium">Personal Finance App</p>
          </div>
        </div>
      </div>

      {/* Quick Add Transaction Button */}
      <div className="px-5 pt-5 pb-2">
        <button
          onClick={() => openAddTransactionWithAmount()}
          className="w-full flex items-center justify-center gap-2 btn-primary"
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
                      : 'text-finora-textSecondary hover:bg-finora-bgTeritary hover:text-finora-textPrimary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isTransactionsExpanded ? (
                    <ChevronDown className="w-4 h-4 text-finora-textMuted" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-finora-textMuted" />
                  )}
                </button>

                {/* Submenu */}
                {isTransactionsExpanded && (
                  <div className="pl-9 pr-2 py-1 space-y-1">
                    <button
                      onClick={() => setActivePage('transactions')}
                      className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg transition-colors ${
                        activePage === 'transactions'
                          ? 'text-finora-textPrimary font-medium bg-finora-bgTeritary'
                          : 'text-finora-textSecondary hover:text-finora-textPrimary hover:bg-finora-bgTeritary'
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
                  : 'text-finora-textSecondary hover:bg-finora-bgTeritary hover:text-finora-textPrimary'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-finora-border bg-finora-bgTeritary">
        <div 
          onClick={() => setActivePage('settings')}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-finora-border transition-colors cursor-pointer"
        >
          {userProfile.avatarUrl ? (
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-9 h-9 rounded-full object-cover border border-finora-border"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-finora-bgTeritary text-finora-textPrimary flex items-center justify-center font-bold text-xs border border-finora-border">
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-finora-textPrimary truncate">{userProfile.name || 'Pengguna Finora'}</p>
            <p className="text-[10px] text-finora-textMuted truncate">Finora Personal</p>
          </div>
        </div>
      </div>
    </aside>
  );
};