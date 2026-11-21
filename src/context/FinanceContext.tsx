import React, { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import type { 
  Transaction, 
  Budget, 
  SavingsGoal, 
  UserProfile, 
  ActivePage, 
  ToastMessage,
  Category
} from '../types';
import { 
  INITIAL_TRANSACTIONS, 
  INITIAL_BUDGETS, 
  INITIAL_SAVINGS_GOALS, 
  INITIAL_USER_PROFILE 
} from '../data/initialData';

interface FinanceContextType {
  // Navigation & View
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;

  // Authentication & User Profile
  isLoggedIn: boolean;
  loginWithName: (name: string, avatarUrl?: string) => void;
  logout: () => void;
  userProfile: UserProfile;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  resetAllData: () => void;

  // Transactions
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  isAddTransactionOpen: boolean;
  setIsAddTransactionOpen: (open: boolean) => void;
  editingTransaction: Transaction | null;
  setEditingTransaction: (tx: Transaction | null) => void;
  openAddTransactionWithAmount: (amount?: number) => void;
  prefilledAmount: number | null;
  setPrefilledAmount: (amount: number | null) => void;

  // Budgets
  budgets: Budget[];
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  getSpentByCategory: (category: Category, month: number, year: number) => number;

  // Savings
  savingsGoals: SavingsGoal[];
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt'>) => void;
  updateSavingsGoal: (id: string, goal: Partial<SavingsGoal>) => void;
  adjustSavingsAmount: (id: string, delta: number) => void;
  deleteSavingsGoal: (id: string) => void;

  // Calculated Totals
  totalIncome: number;
  totalExpense: number;
  netCashFlow: number;
  totalBalance: number;

  // Feedback Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TRANSACTIONS: 'finora_transactions_v1',
  BUDGETS: 'finora_budgets_v1',
  SAVINGS: 'finora_savings_v1',
  USER: 'finora_user_v1',
  IS_LOGGED_IN: 'finora_is_logged_in_v1',
};

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- Auth & User Profile ---
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

  // --- Core Financial Data ---
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVINGS);
    return saved ? JSON.parse(saved) : INITIAL_SAVINGS_GOALS;
  });

  // --- UI Flow & Modals ---
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [prefilledAmount, setPrefilledAmount] = useState<number | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVINGS, JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Aggregated Calculations
  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const netCashFlow = totalIncome - totalExpense;
  const totalBalance = netCashFlow;

  // Transaction Actions
  const addTransaction = (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...data,
      id: 'tx-' + Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast('Transaksi berhasil disimpan.', 'success');
  };

  const updateTransaction = (id: string, data: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
    showToast('Transaksi berhasil diperbarui.', 'success');
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Transaksi berhasil dihapus.', 'info');
  };

  const openAddTransactionWithAmount = (amount?: number) => {
    if (typeof amount === 'number') {
      setPrefilledAmount(amount);
    }
    setEditingTransaction(null);
    setIsAddTransactionOpen(true);
  };

  // Budget Actions
  const addBudget = (data: Omit<Budget, 'id'>) => {
    // Check if category already budgeted for this month/year
    const exists = budgets.some(
      (b) => b.category === data.category && b.month === data.month && b.year === data.year
    );
    if (exists) {
      showToast(`Kategori ${data.category} sudah memiliki anggaran di bulan ini.`, 'error');
      return;
    }
    const newBg: Budget = {
      ...data,
      id: 'bg-' + Date.now().toString(),
    };
    setBudgets((prev) => [...prev, newBg]);
    showToast('Anggaran berhasil dibuat.', 'success');
  };

  const updateBudget = (id: string, data: Partial<Budget>) => {
    setBudgets((prev) => prev.map((b) => (b.id === id ? { ...b, ...data } : b)));
    showToast('Anggaran berhasil diperbarui.', 'success');
  };

  const deleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
    showToast('Anggaran berhasil dihapus.', 'info');
  };

  const getSpentByCategory = (category: Category, month: number, year: number): number => {
    return transactions
      .filter((t) => {
        if (t.type !== 'expense' || t.category !== category) return false;
        const [tYear, tMonth] = t.date.split('-').map(Number);
        return tYear === year && tMonth === month;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // Savings Goal Actions
  const addSavingsGoal = (data: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
    const newGoal: SavingsGoal = {
      ...data,
      id: 'sg-' + Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setSavingsGoals((prev) => [...prev, newGoal]);
    showToast('Target tabungan berhasil dibuat.', 'success');
  };

  const updateSavingsGoal = (id: string, data: Partial<SavingsGoal>) => {
    setSavingsGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...data } : g))
    );
    showToast('Target tabungan berhasil diperbarui.', 'success');
  };

  const adjustSavingsAmount = (id: string, delta: number) => {
    setSavingsGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const updated = Math.max(0, g.currentAmount + delta);
          return { ...g, currentAmount: updated };
        }
        return g;
      })
    );
    showToast('Nominal tabungan berhasil disesuaikan.', 'success');
  };

  const deleteSavingsGoal = (id: string) => {
    setSavingsGoals((prev) => prev.filter((g) => g.id !== id));
    showToast('Target tabungan berhasil dihapus.', 'info');
  };

  // Auth & Settings
  const loginWithName = (name: string, avatarUrl?: string) => {
    const cleanName = name.trim();
    if (!cleanName) return;

    setUserProfile((prev) => ({
      ...prev,
      name: cleanName,
      ...(avatarUrl ? { avatarUrl } : {}),
    }));
    setIsLoggedIn(true);
    showToast(`Selamat datang di Finora, ${cleanName}!`, 'success');
  };

  const logout = () => {
    setIsLoggedIn(false);
    showToast('Berhasil keluar dari sesi.', 'info');
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...data }));
    showToast('Profil pengguna berhasil disimpan.', 'success');
  };

  const resetAllData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setBudgets(INITIAL_BUDGETS);
    setSavingsGoals(INITIAL_SAVINGS_GOALS);
    setUserProfile(INITIAL_USER_PROFILE);
    showToast('Semua data berhasil di-reset ke nilai default.', 'info');
  };

  return (
    <FinanceContext.Provider
      value={{
        activePage,
        setActivePage,
        globalSearchQuery,
        setGlobalSearchQuery,
        isLoggedIn,
        loginWithName,
        logout,
        userProfile,
        updateUserProfile,
        resetAllData,
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        isAddTransactionOpen,
        setIsAddTransactionOpen,
        editingTransaction,
        setEditingTransaction,
        openAddTransactionWithAmount,
        prefilledAmount,
        setPrefilledAmount,
        budgets,
        addBudget,
        updateBudget,
        deleteBudget,
        getSpentByCategory,
        savingsGoals,
        addSavingsGoal,
        updateSavingsGoal,
        adjustSavingsAmount,
        deleteSavingsGoal,
        totalIncome,
        totalExpense,
        netCashFlow,
        totalBalance,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
