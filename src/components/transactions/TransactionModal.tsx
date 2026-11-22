import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import type { TransactionType, Category, Transaction } from '../../types';
import { 
  INCOME_CATEGORIES, 
  EXPENSE_CATEGORIES, 
  parseNumberInput 
} from '../../utils/formatters';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTransaction?: Transaction | null;
  initialAmount?: number | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  editingTransaction,
  initialAmount,
}) => {
  const { addTransaction, updateTransaction } = useFinance();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [amountStr, setAmountStr] = useState('');
  const [category, setCategory] = useState<Category>('Makanan & Minuman');
  const [date, setDate] = useState('2026-11-19');
  const [notes, setNotes] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingTransaction) {
      setTitle(editingTransaction.title);
      setType(editingTransaction.type);
      setAmountStr(editingTransaction.amount.toString());
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
      setNotes(editingTransaction.notes || '');
    } else {
      setTitle('');
      setType('expense');
      setAmountStr(initialAmount ? initialAmount.toString() : '');
      setCategory('Makanan & Minuman');
      setDate('2026-11-19');
      setNotes('');
    }
    setErrors({});
  }, [isOpen, editingTransaction, initialAmount]);

  // When type changes, ensure category matches the type list
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'income' && !INCOME_CATEGORIES.includes(category)) {
      setCategory(INCOME_CATEGORIES[0]);
    } else if (newType === 'expense' && !EXPENSE_CATEGORIES.includes(category)) {
      setCategory(EXPENSE_CATEGORIES[0]);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = parseNumberInput(e.target.value);
    setAmountStr(rawValue > 0 ? rawValue.toString() : '');
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = 'Nama transaksi wajib diisi.';
    }
    const numAmount = parseNumberInput(amountStr);
    if (!numAmount || numAmount <= 0) {
      newErrors.amount = 'Nominal harus lebih besar dari nol.';
    }
    if (!category) {
      newErrors.category = 'Kategori harus dipilih.';
    }
    if (!date) {
      newErrors.date = 'Tanggal harus valid.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const numAmount = parseNumberInput(amountStr);

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, {
        title: title.trim(),
        type,
        amount: numAmount,
        category,
        date,
        notes: notes.trim() || undefined,
      });
    } else {
      addTransaction({
        title: title.trim(),
        type,
        amount: numAmount,
        category,
        date,
        notes: notes.trim() || undefined,
      });
    }

    onClose();
  };

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const numericAmount = parseNumberInput(amountStr);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingTransaction ? 'Edit Transaksi' : 'Tambah Transaksi'}
      subtitle={editingTransaction ? 'Perbarui informasi transaksi keuangan' : 'Catat transaksi pemasukan atau pengeluaran baru'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Transaction Type Segmented Toggle */}
        <div>
          <label className="block text-xs font-semibold text-finora-textPrimary mb-1.5">
            Jenis Transaksi <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-finora-bgTeritary rounded-xl">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'expense'
                  ? 'bg-finora-red text-white shadow-sm'
                  : 'text-finora-textSecondary hover:text-finora-textPrimary'
              }`}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'income'
                  ? 'bg-finora-green text-white shadow-sm'
                  : 'text-finora-textSecondary hover:text-finora-textPrimary'
              }`}
            >
              Pemasukan
            </button>
          </div>
        </div>

        {/* Transaction Title */}
        <div>
          <label className="block text-xs font-semibold text-finora-textPrimary mb-1">
            Nama Transaksi <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Makan Siang, Gaji Bulanan, dsb."
            className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-btn border ${
              errors.title ? 'border-red-500 focus:ring-red-400' : 'border-finora-border focus:ring-finora-primary'
            } focus:outline-none focus:ring-2`}
          />
          {errors.title && <p className="text-[11px] text-red-500 mt-1">{errors.title}</p>}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-semibold text-finora-textPrimary mb-1">
            Nominal (IDR) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-xs sm:text-sm font-semibold text-finora-textMuted">
              Rp
            </span>
            <input
              type="text"
              value={amountStr ? new Intl.NumberFormat('id-ID').format(numericAmount) : ''}
              onChange={handleAmountChange}
              placeholder="0"
              className={`w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-semibold text-finora-textPrimary rounded-btn border ${
                errors.amount ? 'border-red-500 focus:ring-red-400' : 'border-finora-border focus:ring-finora-primary'
              } focus:outline-none focus:ring-2`}
            />
          </div>
          {errors.amount && <p className="text-[11px] text-red-500 mt-1">{errors.amount}</p>}
        </div>

        {/* Category & Date Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-finora-textPrimary mb-1">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-btn border border-finora-border bg-white text-finora-textPrimary focus:outline-none focus:ring-2 focus:ring-finora-primary"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-[11px] text-red-500 mt-1">{errors.category}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-finora-textPrimary mb-1">
              Tanggal <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-btn border border-finora-border bg-white text-finora-textPrimary focus:outline-none focus:ring-2 focus:ring-finora-primary"
            />
            {errors.date && <p className="text-[11px] text-red-500 mt-1">{errors.date}</p>}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-finora-textPrimary mb-1">
            Catatan (Opsional)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tambah catatan pengingat transaksi..."
            className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-btn border border-finora-border focus:outline-none focus:ring-2 focus:ring-finora-primary"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-finora-border">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary" size="md">
            {editingTransaction ? 'Simpan Perubahan' : 'Simpan Transaksi'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
