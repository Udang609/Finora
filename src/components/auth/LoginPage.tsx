import React, { useState } from 'react';
import { Wallet, User, ArrowRight, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

const PRESET_AVATARS = [
  {
    id: 'avatar-1',
    label: 'Pria Profesional',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-2',
    label: 'Wanita Kasual',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-3',
    label: 'Pria Kasual',
    url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-4',
    label: 'Wanita Profesional',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  },
];

export const LoginPage: React.FC = () => {
  const { userProfile, loginWithName } = useFinance();
  const [name, setName] = useState(userProfile.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(
    userProfile.avatarUrl || PRESET_AVATARS[0].url
  );
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();

    if (!cleanName) {
      setErrorMessage('Silakan masukkan nama Anda terlebih dahulu.');
      return;
    }

    if (cleanName.length < 2) {
      setErrorMessage('Nama minimal terdiri dari 2 karakter.');
      return;
    }

    if (cleanName.length > 50) {
      setErrorMessage('Nama maksimal 50 karakter.');
      return;
    }

    setErrorMessage('');
    loginWithName(cleanName, selectedAvatar);
  };

  return (
    <div className="min-h-screen bg-finora-bg flex flex-col justify-center items-center px-4 py-8 sm:py-12 relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-finora-primary text-white shadow-soft-lg mb-3">
            <Wallet className="w-7 h-7" aria-hidden="true" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-finora-textPrimary">
            FINORA
          </h1>
          <p className="text-xs sm:text-sm text-finora-textSecondary mt-1">
            Kelola Keuangan Pribadi Cerdas dan Mandiri
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-card p-6 sm:p-8 border border-finora-border shadow-soft-lg">
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-finora-textPrimary">
              Masuk Cukup Pakai Nama
            </h2>
            <p className="text-xs sm:text-sm text-finora-textSecondary mt-1 leading-relaxed">
              Tanpa email, tanpa nomor HP, dan tanpa kata sandi. Cukup ketikkan nama Anda untuk memulai.
            </p>
          </div>

          {/* Privacy Guarantee Pill */}
          <div className="mb-6 p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-finora-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <span className="font-semibold text-finora-textPrimary block mb-0.5">
                Privasi 100% di Perangkat Anda
              </span>
              Semua catatan keuangan dan pengaturan tersimpan aman di browser Anda tanpa perantara pihak ketiga.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Name Input */}
            <div>
              <label
                htmlFor="user-name-input"
                className="block text-xs font-semibold text-finora-textPrimary mb-1.5"
              >
                Nama Lengkap atau Panggilan <span className="text-finora-red">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" aria-hidden="true" />
                </div>
                <input
                  id="user-name-input"
                  type="text"
                  autoFocus
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Contoh: Dimas Pratama"
                  maxLength={50}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-btn border text-finora-textPrimary placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errorMessage
                      ? 'border-finora-red focus:ring-finora-red/20 focus:border-finora-red'
                      : 'border-finora-border focus:ring-finora-primary/20 focus:border-finora-primary'
                  }`}
                  aria-invalid={errorMessage ? 'true' : 'false'}
                  aria-describedby={errorMessage ? 'name-error-msg' : undefined}
                />
              </div>
              {errorMessage && (
                <p id="name-error-msg" className="text-xs text-finora-red mt-1.5 font-medium">
                  {errorMessage}
                </p>
              )}
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-semibold text-finora-textPrimary mb-2">
                Pilih Avatar (Opsional)
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {PRESET_AVATARS.map((avatar) => {
                  const isSelected = selectedAvatar === avatar.url;
                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar.url)}
                      className={`relative rounded-xl p-1 border-2 transition-all group flex flex-col items-center focus:outline-none focus:ring-2 focus:ring-finora-primary/30 ${
                        isSelected
                          ? 'border-finora-primary bg-blue-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                      aria-label={avatar.label}
                      title={avatar.label}
                    >
                      <img
                        src={avatar.url}
                        alt={avatar.label}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      {isSelected && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-finora-primary text-white flex items-center justify-center shadow">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-btn bg-finora-primary hover:bg-finora-primaryDark active:scale-[0.99] text-white font-semibold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-finora-primary focus:ring-offset-2"
            >
              <span>Mulai Kelola Keuangan</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>
        </div>

        {/* Feature Badges Footer */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-finora-textSecondary">
          <span className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-finora-border shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-finora-primary" aria-hidden="true" />
            Pencatatan Cepat
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-finora-border shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-finora-green" aria-hidden="true" />
            Privat & Lokal
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-finora-border shadow-xs">
            <Wallet className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
            Format Rupiah (IDR)
          </span>
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-6">
          Finora v1.0 &bull; Aplikasi Manajemen Keuangan Pribadi
        </p>
      </div>
    </div>
  );
};
