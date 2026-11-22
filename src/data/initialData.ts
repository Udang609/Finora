import type { Transaction, Budget, SavingsGoal, UserProfile } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: '',
  avatarUrl: '',
  currency: 'IDR',
  dateFormat: 'DD MMMM YYYY',
  theme: 'light',
  isCompactView: false,
};

export const INITIAL_TRANSACTIONS: Transaction[] = [];
export const INITIAL_BUDGETS: Budget[] = [];
export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [];
