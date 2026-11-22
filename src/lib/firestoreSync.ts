import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  collection,
  query,
  orderBy,
  Timestamp,
  type DocumentSnapshot,
  type DocumentReference,
  type Unsubscribe,
} from 'firebase/firestore';
import { getFirebaseDb } from '../config/firebase';
import type { Transaction, Budget, SavingsGoal, UserProfile } from '../types';

const SYNC_COLLECTIONS = {
  transactions: 'transactions',
  budgets: 'budgets',
  savingsGoals: 'savingsGoals',
  profile: 'profile',
} as const;

type CollectionKey = keyof typeof SYNC_COLLECTIONS;

interface SyncCallbacks {
  onTransactionsChange: (txs: Transaction[]) => void;
  onBudgetsChange: (budgets: Budget[]) => void;
  onSavingsGoalsChange: (goals: SavingsGoal[]) => void;
  onProfileChange: (profile: UserProfile | null) => void;
  onError?: (error: Error) => void;
}

let unsubscribeFns: Unsubscribe[] = [];
let isSyncing = false;

const db = () => getFirebaseDb();
const userCol = (uid: string, key: CollectionKey): ReturnType<typeof collection> => collection(db(), 'users', uid, SYNC_COLLECTIONS[key]);
const userDoc = (uid: string, key: CollectionKey, id: string): DocumentReference => doc(db(), 'users', uid, SYNC_COLLECTIONS[key], id);
const profileDoc = (uid: string): DocumentReference => doc(db(), 'users', uid, SYNC_COLLECTIONS.profile, 'data');

function fromFirestore<T>(snap: DocumentSnapshot): T | null {
  if (!snap.exists()) return null;
  const data = snap.data();
  return { id: snap.id, ...(data as object) } as T;
}

function timestampToISO(ts: Timestamp | number | string): string {
  if (typeof ts === 'string') return ts;
  if (typeof ts === 'number') return new Date(ts).toISOString();
  return new Date(ts.toMillis()).toISOString();
}

export function startSync(uid: string, callbacks: SyncCallbacks) {
  if (isSyncing) return;
  isSyncing = true;

  // Transactions
  unsubscribeFns.push(
    onSnapshot(query(userCol(uid, 'transactions'), orderBy('date', 'desc')), (snapshot) => {
      const txs: Transaction[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Record<string, unknown>;
        txs.push({ 
          id: docSnap.id, 
          ...data,
          createdAt: timestampToISO(data.createdAt as Timestamp | number | string)
        } as Transaction);
      });
      callbacks.onTransactionsChange(txs);
    }, (err: Error) => callbacks.onError?.(err))
  );

  // Budgets
  unsubscribeFns.push(
    onSnapshot(query(userCol(uid, 'budgets'), orderBy('createdAt', 'desc')), (snapshot) => {
      const budgets: Budget[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Record<string, unknown>;
        budgets.push({ 
          id: docSnap.id, 
          ...data
        } as Budget);
      });
      callbacks.onBudgetsChange(budgets);
    }, (err: Error) => callbacks.onError?.(err))
  );

  // Savings Goals
  unsubscribeFns.push(
    onSnapshot(query(userCol(uid, 'savingsGoals'), orderBy('createdAt', 'desc')), (snapshot) => {
      const goals: SavingsGoal[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Record<string, unknown>;
        goals.push({ 
          id: docSnap.id, 
          ...data,
          createdAt: timestampToISO(data.createdAt as Timestamp | number | string)
        } as SavingsGoal);
      });
      callbacks.onSavingsGoalsChange(goals);
    }, (err: Error) => callbacks.onError?.(err))
  );

  // Profile
  unsubscribeFns.push(
    onSnapshot(profileDoc(uid), (snap) => {
      const profile = fromFirestore<UserProfile>(snap);
      callbacks.onProfileChange(profile);
    }, (err: Error) => callbacks.onError?.(err))
  );
}

export function stopSync() {
  unsubscribeFns.forEach((unsub) => unsub());
  unsubscribeFns = [];
  isSyncing = false;
}

// ---------- Transactions ----------
export async function addTransactionFS(uid: string, tx: Omit<Transaction, 'id' | 'createdAt'>) {
  const ref = doc(userCol(uid, 'transactions'));
  const now = Timestamp.now();
  const payload = { ...tx, createdAt: now };
  await setDoc(ref, payload);
  return { id: ref.id, ...tx, createdAt: new Date(now.toMillis()).toISOString() } as Transaction;
}

export async function updateTransactionFS(uid: string, id: string, patch: Partial<Transaction>) {
  await updateDoc(userDoc(uid, 'transactions', id), patch);
}

export async function deleteTransactionFS(uid: string, id: string) {
  await deleteDoc(userDoc(uid, 'transactions', id));
}

// ---------- Budgets ----------
export async function addBudgetFS(uid: string, budget: Omit<Budget, 'id'>) {
  const ref = doc(userCol(uid, 'budgets'));
  const payload = { ...budget };
  await setDoc(ref, payload);
  return { id: ref.id, ...budget } as Budget;
}

export async function updateBudgetFS(uid: string, id: string, patch: Partial<Budget>) {
  await updateDoc(userDoc(uid, 'budgets', id), patch);
}

export async function deleteBudgetFS(uid: string, id: string) {
  await deleteDoc(userDoc(uid, 'budgets', id));
}

// ---------- Savings Goals ----------
export async function addSavingsGoalFS(uid: string, goal: Omit<SavingsGoal, 'id' | 'createdAt'>) {
  const ref = doc(userCol(uid, 'savingsGoals'));
  const now = Timestamp.now();
  const payload = { ...goal, createdAt: now };
  await setDoc(ref, payload);
  return { id: ref.id, ...goal, createdAt: new Date(now.toMillis()).toISOString() } as SavingsGoal;
}

export async function updateSavingsGoalFS(uid: string, id: string, patch: Partial<SavingsGoal>) {
  await updateDoc(userDoc(uid, 'savingsGoals', id), patch);
}

export async function deleteSavingsGoalFS(uid: string, id: string) {
  await deleteDoc(userDoc(uid, 'savingsGoals', id));
}

// ---------- Profile ----------
export async function updateProfileFS(uid: string, data: Partial<UserProfile>) {
  await setDoc(profileDoc(uid), data, { merge: true });
}

// ---------- Clear ----------
export async function clearAllDataFS(uid: string) {
  await setDoc(profileDoc(uid), { clearedAt: Timestamp.now() }, { merge: true });
}