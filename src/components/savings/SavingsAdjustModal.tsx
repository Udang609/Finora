import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import type { SavingsGoal } from '../../types';
import { formatIDR, parseNumberInput } from '../../utils/formatters';
import { PlusCircle, MinusCircle } from 'lucide-react';

interface SavingsAdjustModalProps {
  goal: SavingsGoal | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SavingsAdjustModal: React.FC<SavingsAdjustModalProps> = ({
  goal,
  isOpen,
  onClose,
}) => {
  const { adjustSavingsAmount } = useFinance();

  const [mode, setMode] = useState<'add' | 'deduct'>('add');
  const [amountStr, setAmountStr] = useState('');
  const [error, setError] = useState('');

  if (!goal) return null;

  const numAmount = parseNumberInput(amountStr);
  const projectedAmount =
    mode === 'add'
      ? goal.currentAmount + numAmount
      : Math.max(0, goal.currentAmount - numAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numAmount || numAmount <= 0) {
      setError('Nominal harus lebih besar dari nol.');
      return;
    }

    if (mode === 'deduct' && numAmount > goal.currentAmount) {
      setError('Nominal pengurangan tidak boleh melebihi saldo tabungan saat ini.');
      return;
    }

    const delta = mode === 'add' ? numAmount : -numAmount;
    adjustSavingsAmount(goal.id, delta);
    setAmountStr('');
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'add' ? 'Tambah Tabungan' : 'Tarik / Kurangi Tabungan'}
      subtitle={goal.title}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Toggle Mode */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setMode('add');
              setError('');
            }}
            className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              mode === 'add'
                ? 'bg-finora-purple text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Tambah</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('deduct');
              setError('');
            }}
            className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              mode === 'deduct'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MinusCircle className="w-3.5 h-3.5" />
            <span>Kurangi</span>
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-semibold text-finora-textPrimary mb-1">
            Nominal {mode === 'add' ? 'Tambahan' : 'Pengurangan'} (IDR)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-xs sm:text-sm font-semibold text-slate-400">
              Rp
            </span>
            <input
              type="text"
              value={amountStr ? new Intl.NumberFormat('id-ID').format(numAmount) : ''}
              onChange={(e) => {
                setAmountStr(parseNumberInput(e.target.value).toString());
                setError('');
              }}
              placeholder="0"
              autoFocus
              className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-btn border border-finora-border focus:outline-none focus:ring-2 focus:ring-finora-purple"
            />
          </div>
          {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
        </div>

        {/* Quick Amount Chips */}
        <div className="flex flex-wrap gap-1.5">
          {[50000, 100000, 250000, 500000, 1000000].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => {
                setAmountStr(val.toString());
                setError('');
              }}
              className="text-[11px] font-medium px-2 py-1 bg-purple-50 text-finora-purple hover:bg-purple-100 rounded-md transition-colors"
            >
              +{formatIDR(val, false)}
            </button>
          ))}
        </div>

        {/* Preview change */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
          <div className="flex justify-between text-slate-500">
            <span>Terkumpul Sekarang:</span>
            <span className="font-semibold text-slate-700">{formatIDR(goal.currentAmount)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Setelah Penyesuaian:</span>
            <span className="font-bold text-finora-purple">{formatIDR(projectedAmount)}</span>
          </div>
          <div className="flex justify-between text-slate-500 pt-1 border-t border-slate-200">
            <span>Target Akhir:</span>
            <span className="font-semibold">{formatIDR(goal.targetAmount)}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="submit"
            size="md"
            className="bg-finora-purple hover:bg-purple-700 text-white"
          >
            Konfirmasi
          </Button>
        </div>
      </form>
    </Modal>
  );
};
