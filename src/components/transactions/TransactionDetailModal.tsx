import React, { useState } from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Calendar, 
  Tag, 
  FileText, 
  Edit3, 
  Trash2 
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { useFinance } from '../../context/FinanceContext';
import type { Transaction } from '../../types';
import { formatIDR, formatDateID, getCategoryColor } from '../../utils/formatters';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (tx: Transaction) => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  isOpen,
  onClose,
  onEdit,
}) => {
  const { deleteTransaction, setEditingTransaction, setIsAddTransactionOpen } = useFinance();
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  if (!transaction) return null;

  const isIncome = transaction.type === 'income';
  const catColor = getCategoryColor(transaction.category);

  const handleTriggerEdit = () => {
    onClose();
    if (onEdit) {
      onEdit(transaction);
    } else {
      setEditingTransaction(transaction);
      setIsAddTransactionOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    deleteTransaction(transaction.id);
    setIsConfirmDeleteOpen(false);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Detail Transaksi" maxWidth="md">
        <div className="space-y-5">
          {/* Main Amount Card */}
          <div
            className={`p-5 rounded-2xl flex flex-col items-center justify-center text-center ${
              isIncome ? 'bg-emerald-50 text-emerald-950' : 'bg-red-50 text-red-950'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 shadow-sm ${
                isIncome ? 'bg-finora-green text-white' : 'bg-finora-red text-white'
              }`}
            >
              {isIncome ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider opacity-75">
              {isIncome ? 'Pemasukan' : 'Pengeluaran'}
            </span>
            <h2
              className={`text-2xl sm:text-3xl font-extrabold mt-1 ${
                isIncome ? 'text-finora-green' : 'text-finora-red'
              }`}
            >
              {isIncome ? `+${formatIDR(transaction.amount)}` : `-${formatIDR(transaction.amount)}`}
            </h2>
            <p className="text-sm font-semibold text-slate-800 mt-1">{transaction.title}</p>
          </div>

          {/* Details List */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100 text-xs sm:text-sm">
            <div className="flex items-center justify-between">
              <span className="text-finora-textSecondary flex items-center gap-2">
                <Tag className="w-4 h-4 text-slate-400" />
                Kategori
              </span>
              <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${catColor.bg} ${catColor.text} ${catColor.border}`}>
                {transaction.category}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-finora-textSecondary flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                Tanggal Transaksi
              </span>
              <span className="font-semibold text-finora-textPrimary">
                {formatDateID(transaction.date)}
              </span>
            </div>

            {transaction.notes && (
              <div className="pt-2 border-t border-slate-200">
                <span className="text-finora-textSecondary flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-slate-400" />
                  Catatan
                </span>
                <p className="text-xs text-finora-textPrimary bg-white p-2.5 rounded-lg border border-slate-200">
                  {transaction.notes}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <Button
              type="button"
              variant="danger"
              size="md"
              leftIcon={<Trash2 className="w-4 h-4" />}
              onClick={() => setIsConfirmDeleteOpen(true)}
            >
              Hapus
            </Button>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="md" onClick={onClose}>
                Tutup
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                leftIcon={<Edit3 className="w-4 h-4" />}
                onClick={handleTriggerEdit}
              >
                Edit
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Confirmation Dialog for deletion */}
      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Transaksi?"
        message={`Apakah Anda yakin ingin menghapus transaksi "${transaction.title}" sebesar ${formatIDR(
          transaction.amount
        )}? Data yang dihapus tidak dapat dipulihkan.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
      />
    </>
  );
};
