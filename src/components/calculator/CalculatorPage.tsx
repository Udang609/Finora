import React, { useState } from 'react';
import { 
  Delete, 
  ArrowRightCircle, 
  Percent, 
  Tag 
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatIDR } from '../../utils/formatters';
import { Button } from '../common/Button';

export const CalculatorPage: React.FC = () => {
  const { openAddTransactionWithAmount } = useFinance();

  const [expression, setExpression] = useState('');
  const [displayResult, setDisplayResult] = useState('0');
  const [isCalculated, setIsCalculated] = useState(false);
  const [discountPercent, setDiscountPercent] = useState<number | null>(null);

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
    setDiscountPercent(null);
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

  const handleApplyDiscount = (pct: number) => {
    setDiscountPercent(pct);
    const currentVal = Number(displayResult) || Number(expression) || 0;
    if (currentVal > 0) {
      const finalPrice = Math.round(currentVal * ((100 - pct) / 100));
      setExpression(`${currentVal} × (100% - ${pct}%)`);
      setDisplayResult(finalPrice.toString());
      setIsCalculated(true);
    }
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
      <div className="bg-white rounded-card p-6 border border-finora-border shadow-soft-lg">
        {/* Screen Display */}
        <div className="bg-finora-bg rounded-2xl p-4 sm:p-5 border border-slate-200/80 mb-5 text-right">
          <div className="min-h-[22px] text-xs sm:text-sm font-medium text-finora-textSecondary overflow-x-auto whitespace-nowrap">
            {expression || '0'}
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-finora-textPrimary mt-1 truncate">
            {isNaN(numericResult) ? displayResult : formatIDR(numericResult)}
          </div>
        </div>

        {/* Quick Discount Presets */}
        <div className="flex items-center justify-between gap-1 mb-4 bg-slate-50 p-2 rounded-xl border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 pl-1 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-finora-orange" />
            Diskon:
          </span>
          <div className="flex gap-1.5">
            {[10, 20, 30, 50].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => handleApplyDiscount(d)}
                className={`text-xs font-semibold px-2 py-1 rounded-lg transition-colors ${
                  discountPercent === d
                    ? 'bg-finora-orange text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {d}%
              </button>
            ))}
          </div>
        </div>

        {/* Keypad Grid */}
        <div className="grid grid-cols-4 gap-2.5">
          {/* Row 1 */}
          <button
            onClick={handleClear}
            className="py-3.5 rounded-xl bg-red-50 text-finora-red font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center"
          >
            C
          </button>
          <button
            onClick={handleDelete}
            className="py-3.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors flex items-center justify-center"
          >
            <Delete className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleInput('%')}
            className="py-3.5 rounded-xl bg-blue-50 text-finora-primary font-bold text-sm hover:bg-blue-100 transition-colors flex items-center justify-center"
          >
            <Percent className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleInput('÷')}
            className="py-3.5 rounded-xl bg-blue-50 text-finora-primary font-bold text-base hover:bg-blue-100 transition-colors"
          >
            ÷
          </button>

          {/* Row 2 */}
          <button
            onClick={() => handleInput('7')}
            className="py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-base hover:bg-slate-50 transition-colors shadow-sm"
          >
            7
          </button>
          <button
            onClick={() => handleInput('8')}
            className="py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-base hover:bg-slate-50 transition-colors shadow-sm"
          >
            8
          </button>
          <button
            onClick={() => handleInput('9')}
            className="py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-base hover:bg-slate-50 transition-colors shadow-sm"
          >
            9
          </button>
          <button
            onClick={() => handleInput('×')}
            className="py-3.5 rounded-xl bg-blue-50 text-finora-primary font-bold text-base hover:bg-blue-100 transition-colors"
          >
            ×
          </button>

          {/* Row 3 */}
          <button
            onClick={() => handleInput('4')}
            className="py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-base hover:bg-slate-50 transition-colors shadow-sm"
          >
            4
          </button>
          <button
            onClick={() => handleInput('5')}
            className="py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-base hover:bg-slate-50 transition-colors shadow-sm"
          >
            5
          </button>
          <button
            onClick={() => handleInput('6')}
            className="py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-base hover:bg-slate-50 transition-colors shadow-sm"
          >
            6
          </button>
          <button
            onClick={() => handleInput('-')}
            className="py-3.5 rounded-xl bg-blue-50 text-finora-primary font-bold text-base hover:bg-blue-100 transition-colors"
          >
            -
          </button>

          {/* Row 4 */}
          <button
            onClick={() => handleInput('1')}
            className="py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-base hover:bg-slate-50 transition-colors shadow-sm"
          >
            1
          </button>
          <button
            onClick={() => handleInput('2')}
            className="py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-base hover:bg-slate-50 transition-colors shadow-sm"
          >
            2
          </button>
          <button
            onClick={() => handleInput('3')}
            className="py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-base hover:bg-slate-50 transition-colors shadow-sm"
          >
            3
          </button>
          <button
            onClick={() => handleInput('+')}
            className="py-3.5 rounded-xl bg-blue-50 text-finora-primary font-bold text-base hover:bg-blue-100 transition-colors"
          >
            +
          </button>

          {/* Row 5 */}
          <button
            onClick={() => handleInput('0')}
            className="py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-base hover:bg-slate-50 transition-colors shadow-sm"
          >
            0
          </button>
          <button
            onClick={() => handleInput('00')}
            className="py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-base hover:bg-slate-50 transition-colors shadow-sm"
          >
            00
          </button>
          <button
            onClick={() => handleInput('.')}
            className="py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-base hover:bg-slate-50 transition-colors shadow-sm"
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
        <div className="mt-5 pt-4 border-t border-slate-100">
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
          <p className="text-[11px] text-center text-slate-400 mt-2">
            * Mengisi otomatis nominal di formulir transaksi tanpa menyimpannya langsung.
          </p>
        </div>
      </div>
    </div>
  );
};
