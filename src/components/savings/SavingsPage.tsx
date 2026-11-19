import React, { useState } from 'react';
import { 
  Plus, 
  Target, 
  Calendar, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Coins 
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { SavingsModal } from './SavingsModal';
import { SavingsAdjustModal } from './SavingsAdjustModal';
import { formatIDR, formatDateID } from '../../utils/formatters';
import type { SavingsGoal } from '../../types';

export const SavingsPage: React.FC = () => {
  const { savingsGoals, deleteSavingsGoal } = useFinance();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [goalToAdjust, setGoalToAdjust] = useState<SavingsGoal | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<SavingsGoal | null>(null);

  const totalTarget = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCollected = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalCollected / totalTarget) * 100) : 0;

  const handleCreate = () => {
    setEditingGoal(null);
    setIsModalOpen(true);
  };

  const handleEdit = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-finora-textPrimary">
            Target Tabungan
          </h2>
          <p className="text-xs sm:text-sm text-finora-textSecondary mt-1">
            Wujudkan impian dan rencanakan tabungan masa depanmu secara terarah
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleCreate}
        >
          Buat Target
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-card p-5 border border-finora-border shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-finora-textSecondary tracking-wider">
              Total Target Tabungan
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-finora-purple flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-finora-textPrimary">
            {formatIDR(totalTarget)}
          </h3>
          <p className="text-xs text-finora-textSecondary mt-1">
            Dari {savingsGoals.length} target impian aktif
          </p>
        </div>

        <div className="bg-white rounded-card p-5 border border-finora-border shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-finora-textSecondary tracking-wider">
              Total Dana Terkumpul
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-finora-green flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-finora-green">
            {formatIDR(totalCollected)}
          </h3>
          <p className="text-xs text-finora-textSecondary mt-1">
            Virtual savings progress
          </p>
        </div>

        <div className="bg-white rounded-card p-5 border border-finora-border shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-finora-textSecondary tracking-wider">
              Rata-rata Pencapaian
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-finora-primary flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-finora-primary">
            {overallProgress}%
          </h3>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
            <div
              className="bg-finora-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, overallProgress)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Target Cards List */}
      {savingsGoals.length === 0 ? (
        <EmptyState
          icon={<Target className="w-7 h-7" />}
          title="Belum ada target tabungan"
          description="Mulai rencanakan pembelian barang impian, liburan, atau dana darurat dengan membuat target tabungan pertamamu."
          actionText="Buat Target Pertama"
          actionIcon={<Plus className="w-4 h-4" />}
          onAction={handleCreate}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {savingsGoals.map((goal) => {
            const progress = goal.targetAmount > 0 
              ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)) 
              : 0;
            const isCompleted = goal.currentAmount >= goal.targetAmount;
            const remainingToSave = Math.max(0, goal.targetAmount - goal.currentAmount);

            return (
              <div
                key={goal.id}
                className="bg-white rounded-card p-5 sm:p-6 border border-finora-border shadow-soft flex flex-col justify-between relative overflow-hidden"
              >
                {/* Top indicator ribbon if completed */}
                {isCompleted && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Target Tercapai!
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-finora-textPrimary">
                        {goal.title}
                      </h4>
                      {goal.notes && (
                        <p className="text-xs text-finora-textSecondary mt-0.5 line-clamp-1">
                          {goal.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Amounts */}
                  <div className="bg-finora-bg p-3.5 rounded-xl border border-slate-100 mb-4">
                    <div className="flex items-baseline justify-between mb-1">
                      <div>
                        <span className="text-[11px] font-medium text-finora-textSecondary block">
                          Terkumpul
                        </span>
                        <span className="text-base sm:text-lg font-bold text-finora-purple">
                          {formatIDR(goal.currentAmount)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-medium text-finora-textSecondary block">
                          Target Akhir
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-finora-textPrimary">
                          {formatIDR(goal.targetAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden mt-2">
                      <div
                        className="bg-finora-purple h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-xs font-semibold mt-2">
                      <span className="text-finora-purple">Progres: {progress}%</span>
                      <span className="text-finora-textSecondary font-normal">
                        Kurang: <strong className="text-slate-700">{formatIDR(remainingToSave)}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Deadline date */}
                  {goal.targetDate && (
                    <div className="flex items-center gap-1.5 text-xs text-finora-textSecondary mb-4">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Target Tanggal: <strong>{formatDateID(goal.targetDate)}</strong></span>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 mt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
                    onClick={() => setGoalToAdjust(goal)}
                  >
                    Tambah / Kurang
                  </Button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(goal)}
                      className="p-1.5 text-slate-400 hover:text-finora-primary hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Target"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setGoalToDelete(goal)}
                      className="p-1.5 text-slate-400 hover:text-finora-red hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus Target"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      <SavingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingGoal={editingGoal}
      />

      {/* Adjust Virtual Balance Modal */}
      <SavingsAdjustModal
        goal={goalToAdjust}
        isOpen={!!goalToAdjust}
        onClose={() => setGoalToAdjust(null)}
      />

      {/* Delete Confirmation */}
      {goalToDelete && (
        <ConfirmDialog
          isOpen={!!goalToDelete}
          onClose={() => setGoalToDelete(null)}
          onConfirm={() => {
            if (goalToDelete) deleteSavingsGoal(goalToDelete.id);
          }}
          title="Hapus Target Tabungan?"
          message={`Apakah Anda yakin ingin menghapus target "${goalToDelete.title}"?`}
        />
      )}
    </div>
  );
};
