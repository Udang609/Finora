import React from 'react';
import { PieChart as PieIcon, ArrowUpRight } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatIDR } from '../../utils/formatters';

export const BudgetOverviewWidget: React.FC = () => {
  const { budgets, getSpentByCategory, setActivePage } = useFinance();

  const currentMonth = 11;
  const currentYear = 2026;

  const currentBudgets = budgets.filter((b) => b.month === currentMonth && b.year === currentYear);

  const totalBudgeted = currentBudgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpentInBudget = currentBudgets.reduce(
    (sum, b) => sum + getSpentByCategory(b.category, currentMonth, currentYear),
    0
  );
  const remainingBudget = Math.max(0, totalBudgeted - totalSpentInBudget);
  const overallPercentage = totalBudgeted > 0 ? Math.round((totalSpentInBudget / totalBudgeted) * 100) : 0;

  return (
    <div className="bg-white rounded-card p-5 border border-finora-border shadow-soft flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-finora-textPrimary flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-finora-orange" />
              Ringkasan Anggaran
            </h3>
            <p className="text-xs text-finora-textSecondary mt-0.5">
              Periode November 2026
            </p>
          </div>
          <button
            onClick={() => setActivePage('budget')}
            className="text-xs font-medium text-finora-primary hover:text-finora-primaryDark flex items-center gap-1 hover:underline"
          >
            Kelola
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Big numbers summary */}
        <div className="grid grid-cols-2 gap-3 p-3.5 bg-finora-bg rounded-xl mb-4 border border-slate-100">
          <div>
            <span className="text-[11px] font-medium text-finora-textSecondary">Total Anggaran</span>
            <p className="text-sm sm:text-base font-bold text-finora-textPrimary">{formatIDR(totalBudgeted)}</p>
          </div>
          <div>
            <span className="text-[11px] font-medium text-finora-textSecondary">Sisa Anggaran</span>
            <p className="text-sm sm:text-base font-bold text-finora-green">{formatIDR(remainingBudget)}</p>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs font-medium mb-1.5">
            <span className="text-finora-textSecondary">Pemakaian Total</span>
            <span className="text-finora-textPrimary font-semibold">{overallPercentage}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                overallPercentage >= 100
                  ? 'bg-finora-red'
                  : overallPercentage >= 75
                  ? 'bg-finora-orange'
                  : 'bg-finora-primary'
              }`}
              style={{ width: `${Math.min(100, overallPercentage)}%` }}
            />
          </div>
        </div>

        {/* Category breakdown items */}
        <div className="space-y-3">
          {currentBudgets.slice(0, 3).map((item) => {
            const spent = getSpentByCategory(item.category, currentMonth, currentYear);
            const percent = item.amount > 0 ? Math.round((spent / item.amount) * 100) : 0;
            const statusColor =
              percent >= 100
                ? 'bg-finora-red'
                : percent >= 75
                ? 'bg-finora-orange'
                : 'bg-finora-green';

            return (
              <div key={item.id} className="text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-finora-textPrimary truncate">{item.category}</span>
                  <span className="text-slate-500 font-medium">
                    {formatIDR(spent)} / {formatIDR(item.amount)}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${statusColor}`}
                    style={{ width: `${Math.min(100, percent)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 mt-4 text-center">
        <button
          onClick={() => setActivePage('budget')}
          className="text-xs font-medium text-finora-textSecondary hover:text-finora-primary transition-colors"
        >
          Lihat semua anggaran kategori →
        </button>
      </div>
    </div>
  );
};
