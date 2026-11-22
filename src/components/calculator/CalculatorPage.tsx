import React, { useState } from 'react';
import { 
  Delete, 
  ArrowRightCircle, 
  Percent, 
  Tag,
  Trash2
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatIDR } from '../../utils/formatters';
import { Button } from '../common/Button';

export const CalculatorPage: React.FC = () => {
  const { openAddTransactionWithAmount } = useFinance();

  const [expression, setExpression] = useState('');
  const [displayResult, setDisplayResult] = useState('0');
  const [isCalculated, setIsCalculated] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);
  const [discountInput, setDiscountInput] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [discountBase, setDiscountBase] = useState<number | null>(null);

  const handleInput = (val: string) => {
    if (isCalculated) {
      if (['+', '-', '×', '÷'].includes(val)) {
        setExpression(displayResult + ' ' + val + ' ');
        setIsCalculated(false);
        return;
      } else {
        setExpression(val);
        setDisplayResult(val);
        setIsCalculated(false);
        return;
      }
    }

    if (val === '00' && (expression === '' || expression.endsWith(' '))) {
      return;
    }

    if (['+', '-', '×', '÷'].includes(val)) {
      if (expression === '' && displayResult !== '0') {
        setExpression(displayResult + ' ' + val + ' ');
        return;
      }
      if (expression.endsWith(' ')) {
        // replace last operator
        setExpression(expression.slice(0, -3) + ' ' + val + ' ');
        return;
      }
      setExpression((prev) => prev + ' ' + val + ' ');
      return;
    }

    const newExpr = expression + val;
    setExpression(newExpr);
  };

  const handleClear = () => {
    setExpression('');
    setDisplayResult('0');
    setIsCalculated(false);
    setAppliedDiscount(null);
    setDiscountInput('');
    setDiscountError('');
    setDiscountBase(null);
  };

  const handleDelete = () => {
    if (isCalculated) {
      handleClear();
      return;
    }
    if (expression.endsWith(' ')) {
      setExpression((prev) => prev.slice(0, -3));
    } else {
      setExpression((prev) => prev.slice(0, -1));
    }
  };

  const handleCalculate = () => {
    try {
      if (!expression.trim()) return;

      // Replace symbols with standard JS operators
      let evalExpr = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/%/g, '* 0.01');

      // Safe calculation without arbitrary eval
      // Allow only numbers and mathematical operators: + - * / . ( ) space
      if (!/^[\d+\-*/. ()]+$/.test(evalExpr)) {
        throw new Error('Invalid input');
      }

      // eslint-disable-next-line no-eval
      const result = Function(`'use strict'; return (${evalExpr})`)();
      const rounded = Math.round(Number(result));
      setDisplayResult(rounded.toString());
      setIsCalculated(true);
    } catch {
      setDisplayResult('Error');
    }
  };

  const handleApplyDiscount = () => {
    const pct = Number(discountInput.replace(',', '.'));

    if (!discountInput.trim() || Number.isNaN(pct) || pct <= 0 || pct > 100) {
      setDiscountError('Masukkan angka diskon antara 1 sampai 100.');
      return;
    }

    const currentVal = Number(displayResult) || Number(expression) || 0;
    const base = discountBase ?? currentVal;

    if (base <= 0) {
      setDiscountError('Masukkan nominal harga terlebih dahulu, lalu terapkan diskon.');
      return;
    }

    setDiscountError('');
    setDiscountBase(base);
    setAppliedDiscount(pct);

    const finalPrice = Math.round(base * ((100 - pct) / 100));
    setExpression(`${base} × (100% - ${pct}%)`);
    setDisplayResult(finalPrice.toString());
    setIsCalculated(true);
  };

  const handleClearDiscount = () => {
    setAppliedDiscount(null);
    setDiscountInput('');
    setDiscountError('');
    if (discountBase !== null) {
      setExpression(String(discountBase));
      setDisplayResult(String(discountBase));
      setIsCalculated(false);
    }
    setDiscountBase(null);
  };

  const handleUseInTransaction = () => {
    const num = Number(displayResult);
    if (!isNaN(num) && num > 0) {
      openAddTransactionWithAmount(num);
    }
  };

  const numericResult = Number(displayResult) || 0;

  return (
    <div className="max-w-md mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-finora-textPrimary">
          Kalkulator Keuangan
        </h2>
        <p className="text-xs sm:text-sm text-finora-textSecondary mt-1">
          Hitung anggaran, diskon belanja, dan gunakan hasil langsung ke transaksi
        </p>
      </div>

      {/* Main Calculator Card */}
      <div className="card card-hover p-6">
        {/* Screen Display */}
        <div className="bg-finora-bgTeritary rounded-2xl p-4 sm:p-5 border border-finora-border mb-5 text-right">
          <div className="min-h-[22px] text-xs sm:text-sm font-medium text-finora-textSecondary overflow-x-auto whitespace-nowrap">
            {expression || '0'}
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-finora-textPrimary mt-1 truncate">
            {isNaN(numericResult) ? displayResult : formatIDR(numericResult)}
          </div>
        </div>

        {/* Custom Discount Calculator */}
        <div className="mb-4 p-3 bg-finora-bgTeritary rounded-xl border border-finora-border">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-semibold text-finora-textSecondary flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-finora-orange" />
              Hitung Diskon Sendiri
            </span>
            {appliedDiscount !== null && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-finora-orangeLight text-finora-orange">
                Diskon {appliedDiscount}% aktif
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                inputMode="decimal"
                min={1}
                max={100}
                value={discountInput}
                onChange={(e) => {
                  setDiscountInput(e.target.value);
                  if (discountError) setDiscountError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApplyDiscount();
                  }
                }}
                placeholder="Contoh: 15"
                className="input-field pl-3 pr-8"
                aria-label="Persentase diskon"
              />
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-semibold text-finora-textMuted pointer-events-none">
                %
              </span>
            </div>

            <button
              type="button"
              onClick={handleApplyDiscount}
              className="px-3.5 py-2 rounded-lg bg-finora-orange hover:bg-amber-600 text-white text-xs font-bold transition-colors shadow-sm whitespace-nowrap"
            >
              Terapkan
            </button>

            {appliedDiscount !== null && (
              <button
                type="button"
                onClick={handleClearDiscount}
                className="p-2 rounded-lg text-finora-textMuted hover:bg-finora-bgTeritary transition-colors"
                title="Hapus diskon"
                aria-label="Hapus diskon"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {discountError && (
            <p className="text-[11px] text-finora-red font-medium mt-1.5">{discountError}</p>
          )}

          {appliedDiscount !== null && discountBase !== null && (
            <p className="text-[11px] text-finora-textSecondary mt-1.5">
              Harga awal {formatIDR(discountBase)} dipotong {appliedDiscount}% menjadi {formatIDR(Number(displayResult) || 0)}.
            </p>
          )}
        </div>

        {/* Keypad Grid */}
        <div className="grid grid-cols-4 gap-2.5">
          {/* Row 1 */}
          <button
            onClick={handleClear}
            className="py-3.5 rounded-xl bg-finora-redLight text-finora-red font-bold text-sm hover:bg-finora-redLight/80 dark:hover:bg-finora-red-light/80 transition-colors flex items-center justify-center"
          >
            C
          </button>
          <button
            onClick={handleDelete}
            className="py-3.5 rounded-xl bg-finora-bgTeritary text-finora-textPrimary font-bold text-sm hover:bg-finora-border transition-colors flex items-center justify-center"
          >
            <Delete className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleInput('%')}
            className="py-3.5 rounded-xl bg-finora-lightBlue text-finora-primary font-bold text-sm hover:bg-finora-lightBlue/80 dark:hover:bg-finora-light-blue/80 transition-colors flex items-center justify-center"
          >
            <Percent className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleInput('÷')}
            className="py-3.5 rounded-xl bg-finora-lightBlue text-finora-primary font-bold text-base hover:bg-finora-lightBlue/80 dark:hover:bg-finora-light-blue/80 transition-colors"
          >
            ÷
          </button>

          {/* Row 2 */}
          <button
            onClick={() => handleInput('7')}
            className="py-3.5 rounded-xl bg-finora-bgSecondary border border-finora-border text-finora-textPrimary font-bold text-base hover:bg-finora-bgTeritary transition-colors shadow-sm"
          >
            7
          </button>
          <button
            onClick={() => handleInput('8')}
            className="py-3.5 rounded-xl bg-finora-bgSecondary border border-finora-border text-finora-textPrimary font-bold text-base hover:bg-finora-bgTeritary transition-colors shadow-sm"
          >
            8
          </button>
          <button
            onClick={() => handleInput('9')}
            className="py-3.5 rounded-xl bg-finora-bgSecondary border border-finora-border text-finora-textPrimary font-bold text-base hover:bg-finora-bgTeritary transition-colors shadow-sm"
          >
            9
          </button>
          <button
            onClick={() => handleInput('×')}
            className="py-3.5 rounded-xl bg-finora-lightBlue text-finora-primary font-bold text-base hover:bg-finora-lightBlue/80 dark:hover:bg-finora-light-blue/80 transition-colors"
          >
            ×
          </button>

          {/* Row 3 */}
          <button
            onClick={() => handleInput('4')}
            className="py-3.5 rounded-xl bg-finora-bgSecondary border border-finora-border text-finora-textPrimary font-bold text-base hover:bg-finora-bgTeritary transition-colors shadow-sm"
          >
            4
          </button>
          <button
            onClick={() => handleInput('5')}
            className="py-3.5 rounded-xl bg-finora-bgSecondary border border-finora-border text-finora-textPrimary font-bold text-base hover:bg-finora-bgTeritary transition-colors shadow-sm"
          >
            5
          </button>
          <button
            onClick={() => handleInput('6')}
            className="py-3.5 rounded-xl bg-finora-bgSecondary border border-finora-border text-finora-textPrimary font-bold text-base hover:bg-finora-bgTeritary transition-colors shadow-sm"
          >
            6
          </button>
          <button
            onClick={() => handleInput('-')}
            className="py-3.5 rounded-xl bg-finora-lightBlue text-finora-primary font-bold text-base hover:bg-finora-lightBlue/80 dark:hover:bg-finora-light-blue/80 transition-colors"
          >
            -
          </button>

          {/* Row 4 */}
          <button
            onClick={() => handleInput('1')}
            className="py-3.5 rounded-xl bg-finora-bgSecondary border border-finora-border text-finora-textPrimary font-bold text-base hover:bg-finora-bgTeritary transition-colors shadow-sm"
          >
            1
          </button>
          <button
            onClick={() => handleInput('2')}
            className="py-3.5 rounded-xl bg-finora-bgSecondary border border-finora-border text-finora-textPrimary font-bold text-base hover:bg-finora-bgTeritary transition-colors shadow-sm"
          >
            2
          </button>
          <button
            onClick={() => handleInput('3')}
            className="py-3.5 rounded-xl bg-finora-bgSecondary border border-finora-border text-finora-textPrimary font-bold text-base hover:bg-finora-bgTeritary transition-colors shadow-sm"
          >
            3
          </button>
          <button
            onClick={() => handleInput('+')}
            className="py-3.5 rounded-xl bg-finora-lightBlue text-finora-primary font-bold text-base hover:bg-finora-lightBlue/80 dark:hover:bg-finora-light-blue/80 transition-colors"
          >
            +
          </button>

          {/* Row 5 */}
          <button
            onClick={() => handleInput('0')}
            className="py-3.5 rounded-xl bg-finora-bgSecondary border border-finora-border text-finora-textPrimary font-bold text-base hover:bg-finora-bgTeritary transition-colors shadow-sm"
          >
            0
          </button>
          <button
            onClick={() => handleInput('00')}
            className="py-3.5 rounded-xl bg-finora-bgSecondary border border-finora-border text-finora-textPrimary font-bold text-base hover:bg-finora-bgTeritary transition-colors shadow-sm"
          >
            00
          </button>
          <button
            onClick={() => handleInput('.')}
            className="py-3.5 rounded-xl bg-finora-bgSecondary border border-finora-border text-finora-textPrimary font-bold text-base hover:bg-finora-bgTeritary transition-colors shadow-sm"
          >
            .
          </button>
          <button
            onClick={handleCalculate}
            className="py-3.5 rounded-xl bg-finora-primary hover:bg-finora-primaryDark text-white font-bold text-lg shadow-sm transition-all active:scale-95 flex items-center justify-center"
          >
            =
          </button>
        </div>

        {/* Integration Button with Transactions */}
        <div className="mt-5 pt-4 border-t border-finora-border">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full flex items-center justify-center gap-2"
            disabled={numericResult <= 0}
            onClick={handleUseInTransaction}
          >
            <ArrowRightCircle className="w-4 h-4" />
            <span>Gunakan untuk Transaksi ({formatIDR(Math.max(0, numericResult))})</span>
          </Button>
          <p className="text-[11px] text-center text-finora-textMuted mt-2">
            * Mengisi otomatis nominal di formulir transaksi tanpa menyimpannya langsung.
          </p>
        </div>
      </div>
    </div>
  );
};
