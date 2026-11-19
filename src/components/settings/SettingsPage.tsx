import React, { useState } from 'react';
import { 
  User, 
  Sliders, 
  ShieldCheck, 
  Info, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  LogOut 
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { Button } from '../common/Button';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { InstallCard } from '../common/InstallCard';

type SettingsTab = 'profile' | 'preferences' | 'account' | 'about';

export const SettingsPage: React.FC = () => {
  const { 
    userProfile, 
    updateUserProfile, 
    accessMode, 
    setAccessMode,
    migrateGuestToAccount, 
    resetAllData 
  } = useFinance();

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // Form states for profile
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [avatarUrl, setAvatarUrl] = useState(userProfile.avatarUrl);

  // Reset confirmation dialogs
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim(),
      email: email.trim(),
      avatarUrl: avatarUrl.trim(),
    });
  };

  const presetAvatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-finora-textPrimary">
          Pengaturan
        </h2>
        <p className="text-xs sm:text-sm text-finora-textSecondary mt-1">
          Kelola profil pengguna, preferensi aplikasi, dan mode akun
        </p>
      </div>

      {/* Tabs: two compact rows on mobile, underline row from tablet up */}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-4 sm:border-b sm:border-finora-border">
        {[
          { id: 'profile' as SettingsTab, label: 'Profil', icon: User },
          { id: 'preferences' as SettingsTab, label: 'Preferensi', icon: Sliders },
          { id: 'account' as SettingsTab, label: 'Akun & Akses', icon: ShieldCheck },
          { id: 'about' as SettingsTab, label: 'Tentang Aplikasi', icon: Info },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2 min-h-[44px] rounded-lg px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap sm:justify-start sm:min-h-0 sm:rounded-none sm:border-b-2 sm:px-1 sm:py-3 sm:text-sm ${
                isActive
                  ? 'bg-finora-lightBlue text-finora-primary font-semibold sm:border-finora-primary sm:bg-transparent'
                  : 'bg-white text-finora-textSecondary hover:text-finora-textPrimary sm:border-transparent sm:bg-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-card p-6 border border-finora-border shadow-soft max-w-2xl space-y-6">
          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-finora-textPrimary mb-2">
                Foto Profil
              </label>
              <div className="flex items-center gap-4">
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover border-2 border-finora-primary/20 shadow-sm"
                />
                <div className="space-y-2">
                  <div className="flex gap-2">
                    {presetAvatars.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAvatarUrl(url)}
                        className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all ${
                          avatarUrl === url ? 'border-finora-primary scale-105 shadow' : 'border-slate-200'
                        }`}
                      >
                        <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="Atau tempel URL gambar avatar..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-finora-border focus:outline-none focus:ring-1 focus:ring-finora-primary"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-finora-textPrimary mb-1">
                Nama Pengguna
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-btn border border-finora-border focus:outline-none focus:ring-2 focus:ring-finora-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-finora-textPrimary mb-1">
                Alamat Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-btn border border-finora-border focus:outline-none focus:ring-2 focus:ring-finora-primary"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" size="md" leftIcon={<Save className="w-4 h-4" />}>
                Simpan Profil
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Preferences */}
      {activeTab === 'preferences' && (
        <div className="bg-white rounded-card p-6 border border-finora-border shadow-soft max-w-2xl space-y-5">
          <div className="space-y-4 divide-y divide-slate-100">
            <div className="flex items-center justify-between pt-1">
              <div>
                <h4 className="text-sm font-semibold text-finora-textPrimary">Mata Uang Baku</h4>
                <p className="text-xs text-finora-textSecondary">Format baku Finora seluruh transaksi</p>
              </div>
              <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-finora-primary text-xs font-bold border border-blue-100">
                IDR (Rupiah Indonesia)
              </span>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <h4 className="text-sm font-semibold text-finora-textPrimary">Format Tanggal</h4>
                <p className="text-xs text-finora-textSecondary">Standar penanggalan nasional</p>
              </div>
              <span className="text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                19 November 2026 (DD MMMM YYYY)
              </span>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <h4 className="text-sm font-semibold text-finora-textPrimary">Tema Tampilan</h4>
                <p className="text-xs text-finora-textSecondary">Finora Clean Dashboard theme</p>
              </div>
              <span className="text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                Light Clean Mode (Bawaan)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Account & Access Mode */}
      {activeTab === 'account' && (
        <div className="bg-white rounded-card p-6 border border-finora-border shadow-soft max-w-2xl space-y-6">
          {/* Current Status Box */}
          <div className="p-4 rounded-xl border bg-slate-50 border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-slate-500">Mode Akses Saat Ini</span>
                <h4 className="text-base font-bold text-finora-textPrimary flex items-center gap-2 mt-0.5">
                  {accessMode === 'guest' ? 'Guest Mode (Mode Tamu)' : 'Account Mode (Akun Terdaftar)'}
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      accessMode === 'guest'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    Aktif
                  </span>
                </h4>
              </div>

              {accessMode === 'guest' ? (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={migrateGuestToAccount}
                >
                  Migrasi ke Akun
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLogoutConfirmOpen(true)}
                  leftIcon={<LogOut className="w-3.5 h-3.5" />}
                >
                  Logout
                </Button>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {accessMode === 'guest'
                ? 'Data Anda tersimpan di browser lokal. Klik "Migrasi ke Akun" untuk menghubungkan data dengan profil akun permanen.'
                : 'Data Anda telah tersinkronisasi dalam profil akun aktif.'}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pengelolaan Data & Reset
            </h4>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white gap-3">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-finora-textPrimary">
                  Reset Semua Data ke Contoh Awal
                </p>
                <p className="text-xs text-slate-500">
                  Mengembalikan transaksi, anggaran, dan tabungan ke data sampel dokumen Finora
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<RotateCcw className="w-3.5 h-3.5 text-slate-500" />}
                onClick={() => setIsResetConfirmOpen(true)}
              >
                Reset Data
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: About & Acceptance Criteria */}
      {activeTab === 'about' && (
        <div className="bg-white rounded-card p-6 border border-finora-border shadow-soft max-w-2xl space-y-6">
          <InstallCard />

          <div>
            <h3 className="text-lg font-bold text-finora-textPrimary flex items-center gap-2">
              FINORA: Personal Finance App
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-finora-primary">
                v1.0
              </span>
            </h3>
            <p className="text-xs text-finora-textSecondary mt-1 leading-relaxed">
              Finora adalah aplikasi pengelolaan keuangan pribadi yang membantu pengguna mencatat pemasukan, pengeluaran, mengatur anggaran, membuat target tabungan, serta menganalisis kondisi keuangan.
            </p>
          </div>

          {/* Acceptance Criteria Status (Bab 10) */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <h4 className="text-xs font-bold uppercase tracking-wider text-finora-textPrimary mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-finora-green" />
              Design Acceptance Criteria (Bab 10)
            </h4>
            <ul className="text-xs space-y-2 text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-finora-green flex-shrink-0" />
                <span>Semua halaman utama (Dashboard, Transaksi, Anggaran, Tabungan, Laporan, Kalkulator, Pengaturan) tersedia.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-finora-green flex-shrink-0" />
                <span>Tampilan Web (Sidebar) dan Mobile (Bottom Navigation) responsif.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-finora-green flex-shrink-0" />
                <span>Palet warna dan tipografi Inter konsisten dengan spesifikasi Finora v1.0.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-finora-green flex-shrink-0" />
                <span>Mata uang konsisten Rupiah (IDR) dengan pemisah ribuan titik.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-finora-green flex-shrink-0" />
                <span>Form transaksi memiliki semua field dan validasi data.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-finora-green flex-shrink-0" />
                <span>Anggaran memiliki indikator progres (Aman 0-74%, Mendekati 75-99%, Melebihi 100%+).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-finora-green flex-shrink-0" />
                <span>Kalkulator keuangan terintegrasi dengan aksi langsung isi transaksi.</span>
              </li>
            </ul>
          </div>

          <div className="pt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>© 2026 Finora Product Team. All rights reserved.</span>
            <span>Document Status: Specification v1.0</span>
          </div>
        </div>
      )}

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={resetAllData}
        title="Reset Semua Data?"
        message="Tindakan ini akan mengembalikan seluruh transaksi, anggaran, dan target tabungan ke nilai sampel awal. Apakah Anda yakin?"
        confirmText="Ya, Reset Semua"
        cancelText="Batal"
      />

      {/* Confirm Logout Dialog */}
      <ConfirmDialog
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={() => setAccessMode('guest')}
        title="Keluar dari Akun?"
        message="Anda akan beralih ke Mode Tamu (Guest Mode). Data tersimpan tetap aman di perangkat ini."
        confirmText="Logout"
        cancelText="Batal"
        variant="primary"
      />
    </div>
  );
};
