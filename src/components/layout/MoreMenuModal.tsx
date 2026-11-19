import React from 'react';
import { 
  PieChart, 
  Target, 
  BarChart3, 
  Calculator, 
  Settings, 
  X, 
  ChevronRight 
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import type { ActivePage } from '../../types';

interface MoreMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MoreMenuModal: React.FC<MoreMenuModalProps> = ({ isOpen, onClose }) => {
  const { activePage, setActivePage } = useFinance();

  if (!isOpen) return null;

  const menuItems = [
    {
      id: 'budget' as ActivePage,
      label: 'Anggaran',
      description: 'Atur batas pengeluaran bulanan',
      icon: PieChart,
      color: 'bg-amber-50 text-finora-orange',
    },
    {
      id: 'savings' as ActivePage,
      label: 'Target Tabungan',
      description: 'Pantau impian & tabunganmu',
      icon: Target,
      color: 'bg-purple-50 text-finora-purple',
    },
    {
      id: 'reports' as ActivePage,
      label: 'Laporan Keuangan',
      description: 'Analisis & grafik arus kas',
      icon: BarChart3,
      color: 'bg-blue-50 text-finora-primary',
    },
    {
      id: 'calculator' as ActivePage,
      label: 'Kalkulator Keuangan',
      description: 'Hitung cepat & persentase diskon',
      icon: Calculator,
      color: 'bg-emerald-50 text-finora-green',
    },
    {
      id: 'settings' as ActivePage,
      label: 'Pengaturan',
      description: 'Profil, mode akses & preferensi',
      icon: Settings,
      color: 'bg-slate-100 text-slate-700',
    },
  ];

  const handleSelect = (page: ActivePage) => {
    setActivePage(page);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 lg:hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div className="relative w-full bg-white rounded-t-3xl shadow-2xl border-t border-finora-border overflow-hidden z-10 animate-in slide-in-from-bottom duration-300 pb-8 pt-4 px-6">
        {/* Handle bar */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between pb-3 border-b border-finora-border mb-3">
          <h3 className="text-base font-semibold text-finora-textPrimary">Menu Lainnya</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${
                  isActive ? 'bg-finora-lightBlue border border-blue-200' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-semibold ${isActive ? 'text-finora-primary' : 'text-finora-textPrimary'}`}>
                      {item.label}
                    </p>
                    <p className="text-xs text-finora-textSecondary">
                      {item.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
