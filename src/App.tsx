import React from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { BottomNav } from './components/layout/BottomNav';
import { ToastContainer } from './components/common/Toast';
import { InstallBanner } from './components/common/InstallBanner';
import { TransactionModal } from './components/transactions/TransactionModal';

// Pages
import { DashboardPage } from './components/dashboard/DashboardPage';
import { TransactionPage } from './components/transactions/TransactionPage';
import { BudgetPage } from './components/budget/BudgetPage';
import { SavingsPage } from './components/savings/SavingsPage';
import { ReportsPage } from './components/reports/ReportsPage';
import { CalculatorPage } from './components/calculator/CalculatorPage';
import { SettingsPage } from './components/settings/SettingsPage';

const MainLayout: React.FC = () => {
  const { 
    activePage, 
    isAddTransactionOpen, 
    setIsAddTransactionOpen, 
    editingTransaction,
    setEditingTransaction,
    prefilledAmount,
    setPrefilledAmount
  } = useFinance();

  const handleCloseTransactionModal = () => {
    setIsAddTransactionOpen(false);
    setEditingTransaction(null);
    setPrefilledAmount(null);
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'transactions':
        return <TransactionPage />;
      case 'budget':
        return <BudgetPage />;
      case 'savings':
        return <SavingsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'calculator':
        return <CalculatorPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-finora-bg flex flex-row">
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Topbar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-8">
          {renderActivePage()}
        </main>

        {/* Bottom Navigation for Mobile */}
        <BottomNav />
        <InstallBanner />
      </div>

      {/* Global Add/Edit Transaction Modal */}
      <TransactionModal
        isOpen={isAddTransactionOpen}
        onClose={handleCloseTransactionModal}
        editingTransaction={editingTransaction}
        initialAmount={prefilledAmount}
      />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <FinanceProvider>
      <MainLayout />
    </FinanceProvider>
  );
}

export default App;
