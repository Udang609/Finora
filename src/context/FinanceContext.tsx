import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';
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
import { useAuth } from './AuthContext';
import {
  startSync,
  stopSync,
  addTransactionFS,
  updateTransactionFS,
  deleteTransactionFS,
  addBudgetFS,
  updateBudgetFS,
  deleteBudgetFS,
  addSavingsGoalFS,
  updateSavingsGoalFS,
  deleteSavingsGoalFS,
  updateProfileFS,
  clearAllDataFS,
} from '../lib/firestoreSync';

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
  isSyncEnabled: boolean;
  setSyncEnabled: (enabled: boolean) => void;
  syncStatus: 'idle' | 'syncing' | 'error' | 'offline';
  syncError: string | null;

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
  SYNC_ENABLED: 'finora_sync_enabled_v1',
};

function loadLocalTransactions(): Transaction[] {
  const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  if (!saved) return INITIAL_TRANSACTIONS;
  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.some((t: Transaction) => t.id === 'tx-1' && t.title === 'Gaji Bulanan')) {
      localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
      return [];
    }
    return parsed;
  } catch {
    return [];
  }
}

function loadLocalBudgets(): Budget[] {
  const saved = localStorage.getItem(STORAGE_KEYS.BUDGETS);
  if (!saved) return INITIAL_BUDGETS;
  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.some((b: Budget) => b.id === 'bg-1' && b.category === 'Makanan & Minuman')) {
      localStorage.removeItem(STORAGE_KEYS.BUDGETS);
      return [];
    }
    return parsed;
  } catch {
    return [];
  }
}

function loadLocalSavings(): SavingsGoal[] {
  const saved = localStorage.getItem(STORAGE_KEYS.SAVINGS);
  if (!saved) return INITIAL_SAVINGS_GOALS;
  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.some((s: SavingsGoal) => s.id === 'sg-1' && s.title === 'Membeli Laptop')) {
      localStorage.removeItem(STORAGE_KEYS.SAVINGS);
      return [];
    }
    return parsed;
  } catch {
    return [];
  }
}

function loadLocalProfile(): UserProfile {
  const saved = localStorage.getItem(STORAGE_KEYS.USER);
  if (!saved) return INITIAL_USER_PROFILE;
  try {
    const parsed = JSON.parse(saved);
    if (parsed.name === 'Dimas Pratama' && parsed.avatarUrl?.includes('unsplash')) {
      localStorage.removeItem(STORAGE_KEYS.USER);
      return INITIAL_USER_PROFILE;
    }
    return parsed;
  } catch {
    return INITIAL_USER_PROFILE;
  }
}

function loadIsLoggedIn(): boolean {
  return localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';
}

function loadSyncEnabled(): boolean {
  return localStorage.getItem(STORAGE_KEYS.SYNC_ENABLED) === 'true';
}

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user: firebaseUser, isConfigured } = useAuth();

  // --- Auth & User Profile ---
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => loadIsLoggedIn());
  const [userProfile, setUserProfile] = useState<UserProfile>(() => loadLocalProfile());
  const [isSyncEnabled, setIsSyncEnabled] = useState<boolean>(() => loadSyncEnabled() && isConfigured);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error' | 'offline'>('idle');
  const [syncError, setSyncError] = useState<string | null>(null);

  // --- Core Financial Data ---
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadLocalTransactions());
  const [budgets, setBudgets] = useState<Budget[]>(() => loadLocalBudgets());
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => loadLocalSavings());

  // --- UI Flow & Modals ---
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [prefilledAmount, setPrefilledAmount] = useState<number | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // --- Sync State ---
  const [syncInitialized, setSyncInitialized] = useState(false);

  // Persist local state (always, as offline cache)
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SYNC_ENABLED, isSyncEnabled ? 'true' : 'false');
  }, [isSyncEnabled]);

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

  // --- Sync Logic ---
  const uid = firebaseUser?.uid;

  const initializeSync = useCallback(async () => {
    if (!isSyncEnabled || !uid || !isConfigured || syncInitialized) return;
    if (!isLoggedIn) return;

    setSyncInitialized(true);
    setSyncStatus('syncing');
    setSyncError(null);

    try {
      startSync(uid, {
        onTransactionsChange: (txs) => {
          if (txs.length > 0) setTransactions(txs);
        },
        onBudgetsChange: (bs) => {
          if (bs.length > 0) setBudgets(bs);
        },
        onSavingsGoalsChange: (gs) => {
          if (gs.length > 0) setSavingsGoals(gs);
        },
        onProfileChange: (profile) => {
          if (profile) setUserProfile(profile);
        },
        onError: (err) => {
          console.error('Firestore sync error:', err);
          setSyncStatus('error');
          setSyncError(err.message);
          showToast('Sinkronisasi gagal: ' + err.message, 'error');
        },
      });
      setSyncStatus('idle');
    } catch (err) {
      console.error('Sync init error:', err);
      setSyncStatus('error');
      setSyncError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [isSyncEnabled, uid, isConfigured, syncInitialized, isLoggedIn, showToast]);

  const stopSyncIfNeeded = useCallback(() => {
    if (syncInitialized) {
      stopSync();
      setSyncInitialized(false);
      setSyncStatus('idle');
    }
  }, [syncInitialized]);

  // Start/stop sync based on conditions
  useEffect(() => {
    if (isSyncEnabled && uid && isLoggedIn) {
      initializeSync();
    } else {
      stopSyncIfNeeded();
    }
    return () => stopSyncIfNeeded();
  }, [isSyncEnabled, uid, isLoggedIn, initializeSync, stopSyncIfNeeded]);

  // --- Auth Actions ---
  const loginWithName = useCallback((name: string, avatarUrl?: string) => {
    const cleanName = name.trim();
    if (!cleanName) return;

    if (userProfile.name && userProfile.name.toLowerCase() !== cleanName.toLowerCase()) {
      setTransactions([]);
      setBudgets([]);
      setSavingsGoals([]);
    }

    setUserProfile((prev) => ({
      ...prev,
      name: cleanName,
      avatarUrl: avatarUrl || '',
    }));
    setIsLoggedIn(true);
    showToast(`Selamat datang di Finora, ${cleanName}!`, 'success');

    // If sync enabled and firebase configured, update profile in Firestore
    if (isSyncEnabled && isConfigured && firebaseUser) {
      updateProfileFS(firebaseUser.uid, { name: cleanName, avatarUrl: avatarUrl || '' }).catch(console.error);
    }
  }, [userProfile.name, isSyncEnabled, isConfigured, firebaseUser, showToast]);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    showToast('Berhasil keluar dari sesi.', 'info');
    stopSyncIfNeeded();
  }, [showToast, stopSyncIfNeeded]);

  const updateUserProfile = useCallback((data: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...data }));
    showToast('Profil pengguna berhasil disimpan.', 'success');

    if (isSyncEnabled && isConfigured && firebaseUser) {
      updateProfileFS(firebaseUser.uid, data).catch(console.error);
    }
  }, [isSyncEnabled, isConfigured, firebaseUser, showToast]);

  const setSyncEnabled = useCallback(async (enabled: boolean) => {
    setIsSyncEnabled(enabled);
    if (enabled && isConfigured && firebaseUser && isLoggedIn) {
      showToast('Sinkronisasi cloud diaktifkan.', 'success');
    } else if (!enabled) {
      showToast('Sinkronisasi cloud dinonaktifkan. Data tetap tersimpan lokal.', 'info');
    }
  }, [isConfigured, firebaseUser, isLoggedIn, showToast]);

  const resetAllData = useCallback(() => {
    setTransactions([]);
    setBudgets([]);
    setSavingsGoals([]);
    showToast('Semua catatan pemasukan, pengeluaran, anggaran, dan tabungan berhasil dibersihkan.', 'info');

    if (isSyncEnabled && isConfigured && firebaseUser) {
      clearAllDataFS(firebaseUser.uid).catch(console.error);
    }
  }, [isSyncEnabled, isConfigured, firebaseUser, showToast]);

  // --- Transaction Actions ---
  const addTransaction = useCallback((data: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...data,
      id: 'tx-' + Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast('Transaksi berhasil disimpan.', 'success');

    if (isSyncEnabled && isConfigured && firebaseUser) {
      addTransactionFS(firebaseUser.uid, data).catch(console.error);
    }
  }, [isSyncEnabled, isConfigured, firebaseUser, showToast]);

  const updateTransaction = useCallback((id: string, data: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
    showToast('Transaksi berhasil diperbarui.', 'success');

    if (isSyncEnabled && isConfigured && firebaseUser) {
      updateTransactionFS(firebaseUser.uid, id, data).catch(console.error);
    }
  }, [isSyncEnabled, isConfigured, firebaseUser, showToast]);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Transaksi berhasil dihapus.', 'info');

    if (isSyncEnabled && isConfigured && firebaseUser) {
      deleteTransactionFS(firebaseUser.uid, id).catch(console.error);
    }
  }, [isSyncEnabled, isConfigured, firebaseUser, showToast]);

  const openAddTransactionWithAmount = useCallback((amount?: number) => {
    if (typeof amount === 'number') {
      setPrefilledAmount(amount);
    }
    setEditingTransaction(null);
    setIsAddTransactionOpen(true);
  }, []);

  // --- Budget Actions ---
  const addBudget = useCallback((data: Omit<Budget, 'id'>) => {
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

    if (isSyncEnabled && isConfigured && firebaseUser) {
      addBudgetFS(firebaseUser.uid, data).catch(console.error);
    }
  }, [budgets, isSyncEnabled, isConfigured, firebaseUser, showToast]);

  const updateBudget = useCallback((id: string, data: Partial<Budget>) => {
    setBudgets((prev) => prev.map((b) => (b.id === id ? { ...b, ...data } : b)));
    showToast('Anggaran berhasil diperbarui.', 'success');

    if (isSyncEnabled && isConfigured && firebaseUser) {
      updateBudgetFS(firebaseUser.uid, id, data).catch(console.error);
    }
  }, [isSyncEnabled, isConfigured, firebaseUser, showToast]);

  const deleteBudget = useCallback((id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
    showToast('Anggaran berhasil dihapus.', 'info');

    if (isSyncEnabled && isConfigured && firebaseUser) {
      deleteBudgetFS(firebaseUser.uid, id).catch(console.error);
    }
  }, [isSyncEnabled, isConfigured, firebaseUser, showToast]);

  const getSpentByCategory = useCallback((category: Category, month: number, year: number): number => {
    return transactions
      .filter((t) => {
        if (t.type !== 'expense' || t.category !== category) return false;
        const [tYear, tMonth] = t.date.split('-').map(Number);
        return tYear === year && tMonth === month;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // --- Savings Goal Actions ---
  const addSavingsGoal = useCallback((data: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
    const newGoal: SavingsGoal = {
      ...data,
      id: 'sg-' + Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setSavingsGoals((prev) => [...prev, newGoal]);
    showToast('Target tabungan berhasil dibuat.', 'success');

    if (isSyncEnabled && isConfigured && firebaseUser) {
      addSavingsGoalFS(firebaseUser.uid, data).catch(console.error);
    }
  }, [isSyncEnabled, isConfigured, firebaseUser, showToast]);

  const updateSavingsGoal = useCallback((id: string, data: Partial<SavingsGoal>) => {
    setSavingsGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...data } : g))
    );
    showToast('Target tabungan berhasil diperbarui.', 'success');

    if (isSyncEnabled && isConfigured && firebaseUser) {
      updateSavingsGoalFS(firebaseUser.uid, id, data).catch(console.error);
    }
  }, [isSyncEnabled, isConfigured, firebaseUser, showToast]);

  const adjustSavingsAmount = useCallback((id: string, delta: number) => {
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

    if (isSyncEnabled && isConfigured && firebaseUser) {
      updateSavingsGoalFS(firebaseUser.uid, id, { currentAmount: Math.max(0, delta) }).catch(console.error);
    }
  }, [isSyncEnabled, isConfigured, firebaseUser, showToast]);

  const deleteSavingsGoal = useCallback((id: string) => {
    setSavingsGoals((prev) => prev.filter((g) => g.id !== id));
    showToast('Target tabungan berhasil dihapus.', 'info');

    if (isSyncEnabled && isConfigured && firebaseUser) {
      deleteSavingsGoalFS(firebaseUser.uid, id).catch(console.error);
    }
  }, [isSyncEnabled, isConfigured, firebaseUser, showToast]);

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
        isSyncEnabled,
        setSyncEnabled,
        syncStatus,
        syncError,
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