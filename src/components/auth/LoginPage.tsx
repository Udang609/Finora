import React, { useState, useRef } from 'react';
import { Wallet, User, ArrowRight, ShieldCheck, Sparkles, Upload, Trash2, Camera } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { processAvatarFile } from '../../utils/imageHelper';

export const LoginPage: React.FC = () => {
  const { userProfile, loginWithName } = useFinance();
  const [name, setName] = useState(userProfile.name || '');
  const [customAvatar, setCustomAvatar] = useState(userProfile.avatarUrl || '');
  const [errorMessage, setErrorMessage] = useState('');
  const [avatarError, setAvatarError] = useState('');
  const [isProcessingAvatar, setIsProcessingAvatar] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError('');
    setIsProcessingAvatar(true);

    try {
      const dataUrl = await processAvatarFile(file);
      setCustomAvatar(dataUrl);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAvatarError(err.message);
      } else {
        setAvatarError('Gagal memproses foto. Silakan coba file lain.');
      }
    } finally {
      setIsProcessingAvatar(false);
      // Reset input agar bisa memilih file yang sama lagi bila perlu
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAvatar = () => {
    setCustomAvatar('');
    setAvatarError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
    loginWithName(cleanName, customAvatar);
  };

  // Hitung inisial nama untuk avatar fallback
  const nameInitial = name.trim() ? name.trim().charAt(0).toUpperCase() : '';

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
              Tanpa email, tanpa nomor HP, dan tanpa kata sandi. Gunakan nama Anda sendiri untuk memulai.
            </p>
          </div>

          {/* Privacy Guarantee Pill */}
          <div className="mb-6 p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-finora-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <span className="font-semibold text-finora-textPrimary block mb-0.5">
                Privasi 100% di Perangkat Anda
              </span>
              Semua catatan pemasukan, pengeluaran, dan pengaturan tersimpan aman di browser Anda tanpa perantara server luar.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Custom Avatar Upload Section */}
            <div>
              <label className="block text-xs font-semibold text-finora-textPrimary mb-2">
                Foto Avatar Sendiri (Opsional)
              </label>

              <div className="flex items-center gap-4 p-3 rounded-xl border border-slate-200 bg-slate-50/60">
                {/* Avatar Preview / Clickable circle */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative group w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-finora-primary/30 hover:border-finora-primary transition-all focus:outline-none focus:ring-2 focus:ring-finora-primary/40"
                  title="Klik untuk memilih foto dari perangkat Anda"
                  aria-label="Pilih foto profil"
                >
                  {customAvatar ? (
                    <img
                      src={customAvatar}
                      alt="Avatar pengguna"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-100 text-finora-primary flex flex-col items-center justify-center">
                      {nameInitial ? (
                        <span className="text-xl font-bold">{nameInitial}</span>
                      ) : (
                        <Camera className="w-6 h-6 text-finora-primary/70" />
                      )}
                    </div>
                  )}

                  {/* Hover overlay hint */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Camera className="w-5 h-5" />
                  </div>
                </button>

                {/* Upload Action & Guidance */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isProcessingAvatar}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-finora-textPrimary hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-1.5 shadow-2xs disabled:opacity-60"
                    >
                      <Upload className="w-3.5 h-3.5 text-finora-primary" />
                      <span>{customAvatar ? 'Ganti Foto' : 'Unggah Foto'}</span>
                    </button>

                    {customAvatar && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-finora-red hover:bg-red-50 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 mt-1.5 leading-normal">
                    Pilih foto sendiri dari galeri atau berkas Anda (JPG, PNG, atau WebP).
                  </p>
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileChange}
                className="hidden"
                aria-hidden="true"
              />

              {avatarError && (
                <p className="text-xs text-finora-red mt-1.5 font-medium">
                  {avatarError}
                </p>
              )}
            </div>

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
                  placeholder="Contoh: Budi Santoso"
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
            Privat & Bersih
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
