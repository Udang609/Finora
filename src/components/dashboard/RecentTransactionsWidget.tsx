import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Plus, ArrowRight, Receipt } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatSignedIDR, formatDateID, getCategoryColor } from '../../utils/formatters';
import type { Transaction } from '../../types';

interface RecentTransactionsWidgetProps {
  onSelectTransaction: (tx: Transaction) => void;
}

export const RecentTransactionsWidget: React.FC<RecentTransactionsWidgetProps> = ({
  onSelectTransaction,
}) => {
  const { transactions, setActivePage, openAddTransactionWithAmount } = useFinance();

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-card p-5 border border-finora-border shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-finora-textPrimary flex items-center gap-2">
            <Receipt className="w-4 h-4 text-finora-primary" />
            Transaksi Terbaru
          </h3>
          <p className="text-xs text-finora-textSecondary mt-0.5">
            5 aktivitas transaksi terakhir
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => openAddTransactionWithAmount()}
            className="text-xs font-medium text-finora-primary bg-finora-lightBlue hover:bg-blue-100 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah</span>
          </button>
          <button
            onClick={() => setActivePage('transactions')}
            className="text-xs font-medium text-finora-textSecondary hover:text-finora-textPrimary flex items-center gap-1 hover:underline"
          >
            Semua
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {recentTransactions.length === 0 ? (
        <div className="text-center py-8 text-finora-textSecondary text-xs">
          Belum ada transaksi. Mulai catat pemasukan atau pengeluaran pertamamu.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {recentTransactions.map((tx) => {
            const isIncome = tx.type === 'income';
            const catColor = getCategoryColor(tx.category);

            return (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction(tx)}
                className="py-3 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-xl transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isIncome ? 'bg-emerald-50 text-finora-green' : 'bg-red-50 text-finora-red'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-finora-textPrimary truncate group-hover:text-finora-primary transition-colors">
                      {tx.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-finora-textSecondary">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${catColor.bg} ${catColor.text} ${catColor.border}`}>
                        {tx.category}
                      </span>
                      <span>•</span>
                      <span>{formatDateID(tx.date)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 pl-3">
                  <span
                    className={`text-sm font-bold ${
                      isIncome ? 'text-finora-green' : 'text-finora-red'
                    }`}
                  >
                    {formatSignedIDR(tx.amount, tx.type)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
