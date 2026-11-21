export type TransactionType = 'income' | 'expense';

export type Category = 
  | 'Gaji' 
  | 'Investasi' 
  | 'Bonus' 
  | 'Bisnis' 
  | 'Makanan & Minuman' 
  | 'Transportasi' 
  | 'Belanja' 
  | 'Hiburan' 
  | 'Tagihan & Utilitas' 
  | 'Kesehatan' 
  | 'Pendidikan' 
  | 'Keluarga' 
  | 'Lain-lain';

export interface Transaction {
  id: string;
  title: string;
  type: TransactionType;
  amount: number;
  category: Category;
  date: string; // YYYY-MM-DD
  notes?: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  category: Category;
  amount: number;
  month: number; // 1 - 12
  year: number;  // e.g. 2026
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string; // YYYY-MM-DD
  notes?: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  avatarUrl: string;
  currency: string; // 'IDR'
  dateFormat: string; // 'DD MMMM YYYY'
  theme: 'light' | 'dark' | 'system';
  isCompactView: boolean;
}

export type ActivePage = 
  | 'dashboard' 
  | 'transactions' 
  | 'budget' 
  | 'savings' 
  | 'reports' 
  | 'calculator' 
  | 'settings';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
