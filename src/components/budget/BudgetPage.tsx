import React, { useState } from 'react';
import { 
  Plus, 
  PieChart, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle, 
  Edit3, 
  Trash2,
  Calendar
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { BudgetModal } from './BudgetModal';
import { formatIDR, INDONESIAN_MONTHS, getCategoryColor } from '../../utils/formatters';
import type { Budget } from '../../types';

export const BudgetPage: React.FC = () => {
  const { budgets, getSpentByCategory, deleteBudget } = useFinance();

  const [selectedMonth, setSelectedMonth] = useState(11); // November
  const [selectedYear, setSelectedYear] = useState(2026);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);

  // Budgets for current selected month & year
  const activeBudgets = budgets.filter(
    (b) => b.month === selectedMonth && b.year === selectedYear
  );

  const totalBudget = activeBudgets.reduce((sum, b) => sum + b.amount, 0);
  const totalExpense = activeBudgets.reduce(
    (sum, b) => sum + getSpentByCategory(b.category, selectedMonth, selectedYear),
    0
  );
  const remainingBudget = totalBudget - totalExpense;

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-finora-textPrimary">
            Anggaran
          </h2>
          <p className="text-xs sm:text-sm text-finora-textSecondary mt-1">
            Atur dan kontrol batas pengeluaran bulanan agar keuangan tetap sehat
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleCreate}
          >
            Buat Anggaran
          </Button>
        </div>
      </div>

      {/* Period Selector Bar */}
      <div className="bg-white rounded-card p-4 border border-finora-border shadow-soft flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-finora-primary" />
          <span className="text-xs sm:text-sm font-semibold text-finora-textPrimary">
            Periode:
          </span>
          <div className="flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="text-xs sm:text-sm font-medium border border-finora-border rounded-lg px-2.5 py-1.5 bg-finora-bg text-finora-textPrimary focus:outline-none focus:ring-2 focus:ring-finora-primary"
            >
              {INDONESIAN_MONTHS.map((m, idx) => (
                <option key={m} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="text-xs sm:text-sm font-medium border border-finora-border rounded-lg px-2.5 py-1.5 bg-finora-bg text-finora-textPrimary focus:outline-none focus:ring-2 focus:ring-finora-primary"
            >
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-finora-textSecondary">
          {activeBudgets.length} kategori dianggarkan
        </span>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card card-hover p-5">
          <span className="text-xs font-semibold uppercase text-finora-textSecondary tracking-wider">
            Total Budget
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-finora-textPrimary mt-1">
            {formatIDR(totalBudget)}
          </h3>
          <p className="text-xs text-finora-textSecondary mt-1">
            Batas pengeluaran {INDONESIAN_MONTHS[selectedMonth - 1]} {selectedYear}
          </p>
        </div>

        <div className="card card-hover p-5">
          <span className="text-xs font-semibold uppercase text-finora-textSecondary tracking-wider">
            Total Pengeluaran
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-finora-red mt-1">
            {formatIDR(totalExpense)}
          </h3>
          <p className="text-xs text-finora-textSecondary mt-1">
            {totalBudget > 0 ? `${Math.round((totalExpense / totalBudget) * 100)}% dari batas anggaran` : 'Belum ada anggaran'}
          </p>
        </div>

        <div className="card card-hover p-5">
          <span className="text-xs font-semibold uppercase text-finora-textSecondary tracking-wider">
            Sisa Anggaran
          </span>
          <h3
            className={`text-xl sm:text-2xl font-bold mt-1 ${
              remainingBudget >= 0 ? 'text-finora-green' : 'text-finora-red'
            }`}
          >
            {formatIDR(remainingBudget)}
          </h3>
          <p className="text-xs text-finora-textSecondary mt-1">
            {remainingBudget >= 0 ? 'Masih dalam batas aman' : 'Melebihi alokasi anggaran!'}
          </p>
        </div>
      </div>

      {/* Budget Category List */}
      {activeBudgets.length === 0 ? (
        <EmptyState
          icon={<PieChart className="w-7 h-7" />}
          title={`Belum ada anggaran untuk ${INDONESIAN_MONTHS[selectedMonth - 1]} ${selectedYear}`}
          description="Rencanakan pengeluaran dengan menentukan batas anggaran kategori untuk bulan ini."
          actionText="Buat Anggaran Sekarang"
          actionIcon={<Plus className="w-4 h-4" />}
          onAction={handleCreate}
        />
      ) : (
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-finora-textPrimary">
            Kategori Anggaran
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBudgets.map((b) => {
              const spent = getSpentByCategory(b.category, selectedMonth, selectedYear);
              const percentage = b.amount > 0 ? Math.round((spent / b.amount) * 100) : 0;
              const remaining = b.amount - spent;
              const catColor = getCategoryColor(b.category);

              // Status check
              let statusLabel = 'Aman';
              let statusBadgeClass = 'bg-finora-greenLight text-finora-green border-finora-green';
              let progressColorClass = 'bg-finora-green';
              let StatusIcon = CheckCircle;

              if (percentage >= 100) {
                statusLabel = 'Melebihi anggaran';
                statusBadgeClass = 'bg-finora-redLight text-finora-red border-finora-red';
                progressColorClass = 'bg-finora-red';
                StatusIcon = AlertCircle;
              } else if (percentage >= 75) {
                statusLabel = 'Mendekati batas';
                statusBadgeClass = 'bg-finora-orangeLight text-finora-orange border-finora-orange';
                progressColorClass = 'bg-finora-orange';
                StatusIcon = AlertTriangle;
              }

              return (
                <div
                  key={b.id}
                  className="card card-hover p-5 flex flex-col justify-between"
                >
                  <div>
                    {/* Card Top: Category & Status */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${catColor.bg} ${catColor.text} ${catColor.border}`}>
                        {b.category}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusBadgeClass}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusLabel}
                        </span>
                      </div>
                    </div>

                    {/* Spent / Budget numbers */}
                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="text-base font-bold text-finora-textPrimary">
                        {formatIDR(spent)}
                      </span>
                      <span className="text-xs font-semibold text-finora-textMuted">
                        Target: {formatIDR(b.amount)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-finora-border rounded-full h-3 overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${progressColorClass}`}
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      />
                    </div>

                    {/* Details row */}
                    <div className="flex justify-between text-xs text-finora-textSecondary font-medium">
                      <span>Progres: <strong className="text-finora-textPrimary">{percentage}%</strong></span>
                      <span>
                        Sisa: <strong className={remaining < 0 ? 'text-finora-red' : 'text-finora-green'}>
                          {formatIDR(remaining)}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-finora-border">
                    <button
                      onClick={() => handleEdit(b)}
                      className="p-1.5 text-finora-textMuted hover:text-finora-primary hover:bg-finora-lightBlue dark:hover:bg-finora-bgTeritary rounded-lg transition-colors text-xs flex items-center gap-1 font-medium"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setBudgetToDelete(b)}
                      className="p-1.5 text-finora-textMuted hover:text-finora-red hover:bg-finora-redLight dark:hover:bg-finora-bgTeritary rounded-lg transition-colors text-xs flex items-center gap-1 font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingBudget={editingBudget}
        defaultMonth={selectedMonth}
        defaultYear={selectedYear}
      />

      {/* Delete Confirmation */}
      {budgetToDelete && (
        <ConfirmDialog
          isOpen={!!budgetToDelete}
          onClose={() => setBudgetToDelete(null)}
          onConfirm={() => {
            if (budgetToDelete) deleteBudget(budgetToDelete.id);
          }}
          title="Hapus Anggaran?"
          message={`Apakah Anda yakin ingin menghapus anggaran untuk kategori "${budgetToDelete.category}"?`}
        />
      )}
    </div>
  );
};
