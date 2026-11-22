import React, { useState, useRef } from 'react';
import { 
  User, 
  Sliders, 
  ShieldCheck, 
  Info, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  LogOut,
  Upload,
  Trash2,
  Camera
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { Button } from '../common/Button';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { InstallCard } from '../common/InstallCard';
import { processAvatarFile } from '../../utils/imageHelper';

type SettingsTab = 'profile' | 'preferences' | 'account' | 'about';

export const SettingsPage: React.FC = () => {
  const { 
    userProfile, 
    updateUserProfile, 
    logout,
    resetAllData
  } = useFinance();

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // Form states for profile
  const [name, setName] = useState(userProfile.name);
  const [avatarUrl, setAvatarUrl] = useState(userProfile.avatarUrl);
  const [avatarError, setAvatarError] = useState('');
  const [isProcessingAvatar, setIsProcessingAvatar] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset & action confirmation dialogs
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError('');
    setIsProcessingAvatar(true);

    try {
      const dataUrl = await processAvatarFile(file);
      setAvatarUrl(dataUrl);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAvatarError(err.message);
      } else {
        setAvatarError('Gagal memproses foto avatar.');
      }
    } finally {
      setIsProcessingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl('');
    setAvatarError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateUserProfile({
      name: name.trim(),
      avatarUrl: avatarUrl.trim(),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-finora-textPrimary">
          Pengaturan
        </h2>
        <p className="text-xs sm:text-sm text-finora-textSecondary mt-1">
          Kelola profil pengguna, preferensi aplikasi, dan sesi akun
        </p>
      </div>

      {/* Tabs: two compact rows on mobile, underline row from tablet up */}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-4 sm:border-b sm:border-finora-border">
        {[
          { id: 'profile' as SettingsTab, label: 'Profil', icon: User },
          { id: 'preferences' as SettingsTab, label: 'Preferensi', icon: Sliders },
          { id: 'account' as SettingsTab, label: 'Akun & Sesi', icon: ShieldCheck },
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
                Foto Profil Anda
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                {/* Avatar Preview */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative group w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-finora-primary/30 hover:border-finora-primary transition-all focus:outline-none focus:ring-2 focus:ring-finora-primary/40 shadow-sm"
                  title="Klik untuk memilih foto dari perangkat Anda"
                  aria-label="Pilih foto profil"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar Pengguna"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-100 text-finora-primary flex flex-col items-center justify-center font-bold text-2xl">
                      {name.trim() ? name.trim().charAt(0).toUpperCase() : <Camera className="w-7 h-7 text-finora-primary/70" />}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Camera className="w-6 h-6" />
                  </div>
                </button>

                {/* Actions & Guidance */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isProcessingAvatar}
                      className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-finora-textPrimary hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-1.5 shadow-2xs disabled:opacity-60"
                    >
                      <Upload className="w-3.5 h-3.5 text-finora-primary" />
                      <span>{avatarUrl ? 'Ganti Foto' : 'Unggah Foto dari Perangkat'}</span>
                    </button>

                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="px-3 py-2 rounded-lg text-xs font-medium text-finora-red hover:bg-red-50 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus Foto</span>
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 leading-normal">
                    Pilih foto sendiri dari galeri atau berkas Anda (JPG, PNG, atau WebP). Foto otomatis dioptimalkan agar tersimpan aman di browser Anda.
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                    aria-hidden="true"
                  />

                  {avatarError && (
                    <p className="text-xs text-finora-red font-medium">
                      {avatarError}
                    </p>
                  )}
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
                placeholder="Masukkan nama Anda"
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

      {/* Tab 3: Account & Session */}
      {activeTab === 'account' && (
        <div className="bg-white rounded-card p-6 border border-finora-border shadow-soft max-w-2xl space-y-6">
          {/* Current Session Box */}
          <div className="p-4 rounded-xl border bg-slate-50 border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {userProfile.avatarUrl ? (
                  <img
                    src={userProfile.avatarUrl}
                    alt={userProfile.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-finora-primary flex items-center justify-center font-bold text-lg border border-slate-200">
                    {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-finora-textPrimary">
                      {userProfile.name || 'Pengguna Finora'}
                    </h4>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Sesi Aktif
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Masuk dengan nama (tanpa email atau nomor HP)
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsLogoutConfirmOpen(true)}
                leftIcon={<LogOut className="w-3.5 h-3.5" />}
              >
                Keluar (Ganti Pengguna)
              </Button>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-finora-green flex-shrink-0 mt-0.5" />
              <span>
                Data keuangan Anda disimpan 100% secara lokal pada perangkat ini. Privasi Anda terjaga tanpa membutuhkan kata sandi, email, ataupun nomor telepon.
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pengelolaan Data & Reset
            </h4>

            {/* Clear All Data */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white gap-3">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-finora-textPrimary">
                  Bersihkan Semua Catatan Keuangan
                </p>
                <p className="text-xs text-slate-500">
                  Mengosongkan seluruh riwayat transaksi, anggaran, dan tabungan agar benar-benar bersih
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<RotateCcw className="w-3.5 h-3.5 text-slate-500" />}
                onClick={() => setIsResetConfirmOpen(true)}
              >
                Bersihkan Data
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
        title="Bersihkan Semua Data?"
        message="Tindakan ini akan mengosongkan seluruh catatan transaksi, anggaran, dan target tabungan Anda sehingga akun benar-benar bersih dari awal. Apakah Anda yakin?"
        confirmText="Ya, Bersihkan Data"
        cancelText="Batal"
        variant="danger"
      />

      {/* Confirm Logout Dialog */}
      <ConfirmDialog
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={logout}
        title="Keluar dari Sesi?"
        message="Anda akan kembali ke layar masuk nama. Seluruh data transaksi dan catatan tetap aman di perangkat ini."
        confirmText="Ya, Keluar"
        cancelText="Batal"
        variant="primary"
      />
    </div>
  );
};
