import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import type { SavingsGoal } from '../../types';
import { parseNumberInput } from '../../utils/formatters';

interface SavingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingGoal?: SavingsGoal | null;
}

export const SavingsModal: React.FC<SavingsModalProps> = ({
  isOpen,
  onClose,
  editingGoal,
}) => {
  const { addSavingsGoal, updateSavingsGoal } = useFinance();

  const [title, setTitle] = useState('');
  const [targetAmountStr, setTargetAmountStr] = useState('');
  const [currentAmountStr, setCurrentAmountStr] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title);
      setTargetAmountStr(editingGoal.targetAmount.toString());
      setCurrentAmountStr(editingGoal.currentAmount.toString());
      setTargetDate(editingGoal.targetDate || '');
      setNotes(editingGoal.notes || '');
    } else {
      setTitle('');
      setTargetAmountStr('');
      setCurrentAmountStr('0');
      setTargetDate('');
      setNotes('');
    }
    setErrors({});
  }, [isOpen, editingGoal]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) {
      errs.title = 'Nama target tabungan wajib diisi.';
    }
    const numTarget = parseNumberInput(targetAmountStr);
    if (!numTarget || numTarget <= 0) {
      errs.targetAmount = 'Target nominal harus lebih besar dari nol.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const numTarget = parseNumberInput(targetAmountStr);
    const numCurrent = parseNumberInput(currentAmountStr);

    if (editingGoal) {
      updateSavingsGoal(editingGoal.id, {
        title: title.trim(),
        targetAmount: numTarget,
        currentAmount: numCurrent,
        targetDate: targetDate || undefined,
        notes: notes.trim() || undefined,
      });
    } else {
      addSavingsGoal({
        title: title.trim(),
        targetAmount: numTarget,
        currentAmount: numCurrent,
        targetDate: targetDate || undefined,
        notes: notes.trim() || undefined,
      });
    }

    onClose();
  };

  const numericTarget = parseNumberInput(targetAmountStr);
  const numericCurrent = parseNumberInput(currentAmountStr);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingGoal ? 'Edit Target Tabungan' : 'Buat Target Tabungan'}
      subtitle="Tetapkan rencana impian dan pantau progres pencapaiannya"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-finora-textPrimary mb-1">
            Nama Target <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Membeli Laptop, Liburan ke Bali, Dana Darurat"
            className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-btn border ${
              errors.title ? 'border-red-500' : 'border-finora-border'
            } focus:outline-none focus:ring-2 focus:ring-finora-primary`}
          />
          {errors.title && <p className="text-[11px] text-red-500 mt-1">{errors.title}</p>}
        </div>

        {/* Target Amount */}
        <div>
          <label className="block text-xs font-semibold text-finora-textPrimary mb-1">
            Target Nominal (IDR) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-xs sm:text-sm font-semibold text-slate-400">
              Rp
            </span>
            <input
              type="text"
              value={targetAmountStr ? new Intl.NumberFormat('id-ID').format(numericTarget) : ''}
              onChange={(e) => setTargetAmountStr(parseNumberInput(e.target.value).toString())}
              placeholder="0"
              className={`w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-btn border ${
                errors.targetAmount ? 'border-red-500' : 'border-finora-border'
              } focus:outline-none focus:ring-2 focus:ring-finora-primary`}
            />
          </div>
          {errors.targetAmount && <p className="text-[11px] text-red-500 mt-1">{errors.targetAmount}</p>}
        </div>

        {/* Initial / Current Amount */}
        <div>
          <label className="block text-xs font-semibold text-finora-textPrimary mb-1">
            Jumlah Terkumpul Saat Ini (IDR)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-xs sm:text-sm font-semibold text-slate-400">
              Rp
            </span>
            <input
              type="text"
              value={currentAmountStr ? new Intl.NumberFormat('id-ID').format(numericCurrent) : '0'}
              onChange={(e) => setCurrentAmountStr(parseNumberInput(e.target.value).toString())}
              placeholder="0"
              className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-btn border border-finora-border focus:outline-none focus:ring-2 focus:ring-finora-primary"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            * Tabungan bersifat pencatatan virtual dan tidak memotong saldo utama.
          </p>
        </div>

        {/* Target Date */}
        <div>
          <label className="block text-xs font-semibold text-finora-textPrimary mb-1">
            Tanggal Target Selesai (Opsional)
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-btn border border-finora-border bg-white text-finora-textPrimary focus:outline-none focus:ring-2 focus:ring-finora-primary"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-finora-textPrimary mb-1">
            Catatan Target (Opsional)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tujuan tabungan atau rincian rencana..."
            className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-btn border border-finora-border focus:outline-none focus:ring-2 focus:ring-finora-primary"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-finora-border">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary" size="md">
            {editingGoal ? 'Simpan Perubahan' : 'Buat Target'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
