import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import type { Budget, Category } from '../../types';
import { 
  EXPENSE_CATEGORIES, 
  INDONESIAN_MONTHS, 
  parseNumberInput 
} from '../../utils/formatters';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingBudget?: Budget | null;
  defaultMonth?: number;
  defaultYear?: number;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  editingBudget,
  defaultMonth = 11,
  defaultYear = 2026,
}) => {
  const { addBudget, updateBudget } = useFinance();

  const [category, setCategory] = useState<Category>('Makanan & Minuman');
  const [amountStr, setAmountStr] = useState('');
  const [month, setMonth] = useState(defaultMonth);
  const [year, setYear] = useState(defaultYear);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingBudget) {
      setCategory(editingBudget.category);
      setAmountStr(editingBudget.amount.toString());
      setMonth(editingBudget.month);
      setYear(editingBudget.year);
    } else {
      setCategory('Makanan & Minuman');
      setAmountStr('');
      setMonth(defaultMonth);
      setYear(defaultYear);
    }
    setError('');
  }, [isOpen, editingBudget, defaultMonth, defaultYear]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseNumberInput(amountStr);

    if (!numAmount || numAmount <= 0) {
      setError('Nominal anggaran harus lebih besar dari nol.');
      return;
    }

    if (editingBudget) {
      updateBudget(editingBudget.id, {
        category,
        amount: numAmount,
        month,
        year,
      });
    } else {
      addBudget({
        category,
        amount: numAmount,
        month,
        year,
      });
    }

    onClose();
  };

  const numericAmount = parseNumberInput(amountStr);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingBudget ? 'Edit Anggaran' : 'Buat Anggaran Baru'}
      subtitle="Atur batas maksimum pengeluaran bulanan per kategori"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Kategori */}
        <div>
          <label className="block text-xs font-semibold text-finora-textPrimary mb-1">
            Kategori Pengeluaran <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            disabled={!!editingBudget}
            className="input-field disabled:bg-finora-bgTeritary disabled:cursor-not-allowed"
          >
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Nominal Anggaran */}
        <div>
          <label className="block text-xs font-semibold text-finora-textPrimary mb-1">
            Batas Nominal Anggaran (IDR) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-xs sm:text-sm font-semibold text-finora-textMuted">
              Rp
            </span>
            <input
              type="text"
              value={amountStr ? new Intl.NumberFormat('id-ID').format(numericAmount) : ''}
              onChange={(e) => setAmountStr(parseNumberInput(e.target.value).toString())}
              placeholder="0"
              className="input-field pl-10"
            />
          </div>
          {error && <p className="text-[11px] text-finora-red mt-1">{error}</p>}
        </div>

        {/* Bulan & Tahun */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-finora-textPrimary mb-1">
              Bulan
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              disabled={!!editingBudget}
              className="input-field disabled:bg-finora-bgTeritary"
            >
              {INDONESIAN_MONTHS.map((m, idx) => (
                <option key={m} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-finora-textPrimary mb-1">
              Tahun
            </label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              disabled={!!editingBudget}
              className="input-field disabled:bg-finora-bgTeritary"
            >
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-finora-border">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary" size="md">
            {editingBudget ? 'Simpan Perubahan' : 'Buat Anggaran'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};