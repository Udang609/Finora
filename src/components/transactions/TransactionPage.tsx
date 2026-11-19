import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Receipt,
  Trash2,
  Edit3
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { TransactionDetailModal } from './TransactionDetailModal';
import { 
  formatSignedIDR, 
  formatDateID, 
  getCategoryColor, 
  ALL_CATEGORIES 
} from '../../utils/formatters';
import type { Transaction, TransactionType } from '../../types';

export const TransactionPage: React.FC = () => {
  const { 
    transactions, 
    openAddTransactionWithAmount, 
    setEditingTransaction, 
    setIsAddTransactionOpen, 
    deleteTransaction,
    globalSearchQuery,
    setGlobalSearchQuery
  } = useFinance();

  // Local filter states
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTxForDetail, setSelectedTxForDetail] = useState<Transaction | null>(null);
  const [txToDelete, setTxToDelete] = useState<Transaction | null>(null);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Type filter
      if (filterType !== 'all' && tx.type !== filterType) return false;

      // Category filter
      if (selectedCategory !== 'all' && tx.category !== selectedCategory) return false;

      // Search query (from topbar or local)
      if (globalSearchQuery.trim()) {
        const query = globalSearchQuery.toLowerCase();
        const matchTitle = tx.title.toLowerCase().includes(query);
        const matchCat = tx.category.toLowerCase().includes(query);
        const matchNotes = (tx.notes || '').toLowerCase().includes(query);
        const matchAmount = tx.amount.toString().includes(query);
        if (!matchTitle && !matchCat && !matchNotes && !matchAmount) return false;
      }

      return true;
    });
  }, [transactions, filterType, selectedCategory, globalSearchQuery]);

  // Group transactions by date string (YYYY-MM-DD descending)
  const groupedByDate = useMemo(() => {
    const groups: { [date: string]: Transaction[] } = {};

    // Sort transactions by date descending, then created desc
    const sorted = [...filteredTransactions].sort((a, b) => {
      const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateDiff !== 0) return dateDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    sorted.forEach((tx) => {
      if (!groups[tx.date]) {
        groups[tx.date] = [];
      }
      groups[tx.date].push(tx);
    });

    return groups;
  }, [filteredTransactions]);

  const sortedDates = Object.keys(groupedByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const handleEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsAddTransactionOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-finora-textPrimary">
            Transaksi
          </h2>
          <p className="text-xs sm:text-sm text-finora-textSecondary mt-1">
            Riwayat pencatatan pemasukan dan pengeluaran keuangan
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => openAddTransactionWithAmount()}
        >
          Tambah Transaksi
        </Button>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="bg-white rounded-card p-4 border border-finora-border shadow-soft space-y-3">
        {/* Type Filter Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterType === 'all'
                  ? 'bg-white text-finora-textPrimary shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterType === 'income'
                  ? 'bg-finora-green text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pemasukan
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterType === 'expense'
                  ? 'bg-finora-red text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pengeluaran
            </button>
          </div>

          {/* Quick counts */}
          <span className="text-xs text-finora-textSecondary font-medium">
            Menampilkan <strong className="text-finora-textPrimary">{filteredTransactions.length}</strong> transaksi
          </span>
        </div>

        {/* Search & Category Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div className="sm:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={globalSearchQuery}
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
              placeholder="Search transaksi..."
              className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-btn border border-finora-border bg-finora-bg focus:outline-none focus:ring-2 focus:ring-finora-primary/20 focus:border-finora-primary"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Filter className="w-3.5 h-3.5" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-8 pr-3.5 py-2 text-xs sm:text-sm rounded-btn border border-finora-border bg-white text-finora-textPrimary focus:outline-none focus:ring-2 focus:ring-finora-primary"
            >
              <option value="all">Semua Kategori</option>
              {ALL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transaction List by Date */}
      {filteredTransactions.length === 0 ? (
        <EmptyState
          icon={<Receipt className="w-7 h-7" />}
          title="Belum ada transaksi"
          description="Belum ada transaksi. Mulai catat pemasukan atau pengeluaran pertamamu."
          actionText="Tambah Transaksi Pertama"
          actionIcon={<Plus className="w-4 h-4" />}
          onAction={() => openAddTransactionWithAmount()}
        />
      ) : (
        <div className="space-y-6">
          {sortedDates.map((dateStr) => {
            const dateTransactions = groupedByDate[dateStr];
            const dayIncome = dateTransactions
              .filter((t) => t.type === 'income')
              .reduce((s, t) => s + t.amount, 0);
            const dayExpense = dateTransactions
              .filter((t) => t.type === 'expense')
              .reduce((s, t) => s + t.amount, 0);

            return (
              <div key={dateStr} className="space-y-2">
                {/* Date header */}
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-xs sm:text-sm font-bold text-finora-textPrimary uppercase tracking-wider">
                    {formatDateID(dateStr)}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                    {dayIncome > 0 && (
                      <span className="text-finora-green">+{new Intl.NumberFormat('id-ID').format(dayIncome)}</span>
                    )}
                    {dayExpense > 0 && (
                      <span className="text-finora-red">-{new Intl.NumberFormat('id-ID').format(dayExpense)}</span>
                    )}
                  </div>
                </div>

                {/* Card containing items */}
                <div className="bg-white rounded-card border border-finora-border shadow-soft divide-y divide-slate-100 overflow-hidden">
                  {dateTransactions.map((tx) => {
                    const isIncome = tx.type === 'income';
                    const catColor = getCategoryColor(tx.category);

                    return (
                      <div
                        key={tx.id}
                        className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors group"
                      >
                        <div
                          onClick={() => setSelectedTxForDetail(tx)}
                          className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer"
                        >
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              isIncome ? 'bg-emerald-50 text-finora-green' : 'bg-red-50 text-finora-red'
                            }`}
                          >
                            {isIncome ? (
                              <ArrowDownLeft className="w-5 h-5" />
                            ) : (
                              <ArrowUpRight className="w-5 h-5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-finora-textPrimary truncate group-hover:text-finora-primary transition-colors">
                              {tx.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5 min-w-0">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-medium border whitespace-nowrap flex-shrink-0 ${catColor.bg} ${catColor.text} ${catColor.border}`}
                              >
                                {tx.category}
                              </span>
                              {tx.notes && (
                                <span className="text-[11px] text-slate-400 truncate max-w-[150px] sm:max-w-xs">
                                  {tx.notes}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Amount & Quick Actions */}
                        <div className="flex items-center gap-3 sm:gap-4 pl-3 flex-shrink-0">
                          <span
                            onClick={() => setSelectedTxForDetail(tx)}
                            className={`text-sm sm:text-base font-bold cursor-pointer whitespace-nowrap ${
                              isIncome ? 'text-finora-green' : 'text-finora-red'
                            }`}
                          >
                            {formatSignedIDR(tx.amount, tx.type)}
                          </span>

                          <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(tx)}
                              className="p-1.5 text-slate-400 hover:text-finora-primary hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Transaksi"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setTxToDelete(tx)}
                              className="p-1.5 text-slate-400 hover:text-finora-red hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus Transaksi"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedTxForDetail && (
        <TransactionDetailModal
          transaction={selectedTxForDetail}
          isOpen={!!selectedTxForDetail}
          onClose={() => setSelectedTxForDetail(null)}
          onEdit={(tx) => handleEdit(tx)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {txToDelete && (
        <ConfirmDialog
          isOpen={!!txToDelete}
          onClose={() => setTxToDelete(null)}
          onConfirm={() => {
            if (txToDelete) deleteTransaction(txToDelete.id);
          }}
          title="Hapus Transaksi?"
          message={`Apakah Anda yakin ingin menghapus transaksi "${txToDelete.title}"? Tindakan ini tidak dapat dibatalkan.`}
        />
      )}
    </div>
  );
};
