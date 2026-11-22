import React, { useState } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Coins, 
  Plus,
  ScanLine
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatIDR } from '../../utils/formatters';
import { Button } from '../common/Button';
import { SummaryCard } from './SummaryCard';
import { CashFlowChart } from './CashFlowChart';
import { BudgetOverviewWidget } from './BudgetOverviewWidget';
import { RecentTransactionsWidget } from './RecentTransactionsWidget';
import { TransactionDetailModal } from '../transactions/TransactionDetailModal';
import { ReceiptScanner } from '../scanner/ReceiptScanner';
import type { Transaction } from '../../types';

export const DashboardPage: React.FC = () => {
  const { 
    totalBalance, 
    totalIncome, 
    totalExpense, 
    netCashFlow, 
    openAddTransactionWithAmount,
    setActivePage,
    addTransaction
  } = useFinance();

  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleScannerSave = (transactions: Omit<Transaction, 'id' | 'createdAt'>[]) => {
    transactions.forEach(tx => addTransaction(tx));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-finora-textPrimary">
            Dashboard Keuangan
          </h2>
          <p className="text-xs sm:text-sm text-finora-textSecondary mt-1">
            Ringkasan kondisi keuangan bulan November 2026
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsScannerOpen(true)}
            leftIcon={<ScanLine className="w-3.5 h-3.5" />}
            className="hidden sm:flex"
          >
            Scan Struk
          </Button>
          <button
            onClick={() => openAddTransactionWithAmount()}
            className="flex items-center gap-2 bg-finora-primary hover:bg-finora-primaryDark text-white px-4 py-2.5 rounded-btn text-sm font-medium transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Transaksi</span>
          </button>
        </div>
      </div>

      {/* 4 Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="TOTAL SALDO"
          amount={formatIDR(totalBalance)}
          subtitle="Arus kas bersih saat ini"
          icon={<Wallet className="w-5 h-5 text-finora-primary" />}
          iconBgColor="bg-blue-50"
          accentColor="bg-finora-primary"
          onClick={() => setActivePage('transactions')}
        />

        <SummaryCard
          title="TOTAL PEMASUKAN"
          amount={formatIDR(totalIncome)}
          subtitle="Total pemasukan tercatat"
          icon={<TrendingUp className="w-5 h-5 text-finora-green" />}
          iconBgColor="bg-emerald-50"
          accentColor="bg-finora-green"
          onClick={() => setActivePage('reports')}
        />

        <SummaryCard
          title="TOTAL PENGELUARAN"
          amount={formatIDR(totalExpense)}
          subtitle="Total pengeluaran tercatat"
          icon={<TrendingDown className="w-5 h-5 text-finora-red" />}
          iconBgColor="bg-red-50"
          accentColor="bg-finora-red"
          onClick={() => setActivePage('reports')}
        />

        <SummaryCard
          title="ARUS KAS BERSIH"
          amount={formatIDR(netCashFlow)}
          subtitle={netCashFlow >= 0 ? 'Surplus kondisi keuangan' : 'Defisit keuangan'}
          icon={<Coins className="w-5 h-5 text-finora-purple" />}
          iconBgColor="bg-purple-50"
          accentColor="bg-finora-purple"
          onClick={() => setActivePage('reports')}
        />
      </div>

      {/* Financial Chart & Budget Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CashFlowChart />
        </div>
        <div className="lg:col-span-1">
          <BudgetOverviewWidget />
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <RecentTransactionsWidget onSelectTransaction={(tx) => setSelectedTx(tx)} />
      </div>

      {/* Detail Modal */}
      {selectedTx && (
        <TransactionDetailModal
          transaction={selectedTx}
          isOpen={!!selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )}

      {/* Receipt Scanner Modal */}
      <ReceiptScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onSave={handleScannerSave}
      />
    </div>
  );
};
