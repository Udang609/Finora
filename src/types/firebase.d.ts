// Firebase modular SDK type declarations
// Workaround for missing index.d.ts files in firebase v10.14.1

declare module 'firebase/app' {
  export interface FirebaseApp {
    name: string;
    options: FirebaseOptions;
    automaticDataCollectionEnabled: boolean;
  }

  export interface FirebaseOptions {
    apiKey?: string;
    authDomain?: string;
    projectId?: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
    measurementId?: string;
  }

  export function initializeApp(options: FirebaseOptions, name?: string): FirebaseApp;
  export function getApps(): FirebaseApp[];
  export function getApp(name?: string): FirebaseApp;
  export function deleteApp(app: FirebaseApp): Promise<void>;
}

declare module 'firebase/auth' {
  import type { FirebaseApp } from 'firebase/app';

  export interface User {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
    emailVerified: boolean;
    isAnonymous: boolean;
    metadata: UserMetadata;
    providerData: UserInfo[];
    refreshToken: string;
    tenantId: string | null;
    delete(): Promise<void>;
    getIdToken(forceRefresh?: boolean): Promise<string>;
    getIdTokenResult(forceRefresh?: boolean): Promise<IdTokenResult>;
    reload(): Promise<void>;
    toJSON(): object;
  }

  export interface UserMetadata {
    creationTime: string;
    lastSignInTime: string;
  }

  export interface UserInfo {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
    providerId: string;
    phoneNumber: string | null;
  }

  export interface IdTokenResult {
    token: string;
    expirationTime: string;
    authTime: string;
    issuedAtTime: string;
    signInProvider: string | null;
    signInSecondFactor: string | null;
    claims: { [key: string]: unknown };
  }

  export interface Auth {
    app: FirebaseApp;
    currentUser: User | null;
    languageCode: string | null;
    settings: AuthSettings;
    tenantId: string | null;
    onAuthStateChanged(nextOrObserver: (user: User | null) => void, error?: (error: Error) => void, completed?: () => void): () => void;
    onIdTokenChanged(nextOrObserver: (user: User | null) => void, error?: (error: Error) => void, completed?: () => void): () => void;
    signOut(): Promise<void>;
    setPersistence(persistence: Persistence): Promise<void>;
  }

  export interface AuthSettings {
    appVerificationDisabledForTesting: boolean;
  }

  export type Persistence = 'local' | 'session' | 'none';

  export function getAuth(app?: FirebaseApp): Auth;
  export function signInAnonymously(auth: Auth): Promise<UserCredential>;
  export function updateProfile(user: User, profile: { displayName?: string | null; photoURL?: string | null }): Promise<void>;
  export function signOut(auth: Auth): Promise<void>;
  export function onAuthStateChanged(auth: Auth, nextOrObserver: (user: User | null) => void, error?: (error: Error) => void, completed?: () => void): () => void;

  export interface UserCredential {
    user: User;
    providerId: string | null;
    operationType: 'signIn' | 'link' | 'reauthenticate';
  }
}

declare module 'firebase/firestore' {
  import type { FirebaseApp } from 'firebase/app';

  export interface Firestore {
    app: FirebaseApp;
    type: 'firestore-lite' | 'firestore';
  }

  export interface DocumentSnapshot<T = unknown> {
    exists(): boolean;
    readonly id: string;
    readonly ref: DocumentReference<T>;
    readonly metadata: SnapshotMetadata;
    data(): T | undefined;
    get(fieldPath: string | FieldPath): unknown;
    isEqual(other: DocumentSnapshot<T>): boolean;
  }

  export interface QuerySnapshot<T = unknown> {
    readonly docs: QueryDocumentSnapshot<T>[];
    readonly size: number;
    readonly empty: boolean;
    readonly metadata: SnapshotMetadata;
    readonly query: Query<T>;
    forEach(callback: (doc: QueryDocumentSnapshot<T>) => void): void;
    docChanges(): DocumentChange<T>[];
    isEqual(other: QuerySnapshot<T>): boolean;
  }

  export interface QueryDocumentSnapshot<T = unknown> extends DocumentSnapshot<T> {
    data(): T;
  }

  export interface DocumentChange<T = unknown> {
    type: 'added' | 'removed' | 'modified';
    doc: QueryDocumentSnapshot<T>;
    oldIndex: number;
    newIndex: number;
  }

  export interface SnapshotMetadata {
    hasPendingWrites: boolean;
    fromCache: boolean;
  }

  export interface DocumentReference<T = unknown> {
    readonly id: string;
    readonly path: string;
    readonly parent: CollectionReference<T>;
    readonly firestore: Firestore;
    withConverter(converter: null): DocumentReference<T>;
    withConverter<U>(converter: FirestoreDataConverter<U>): DocumentReference<U>;
    isEqual(other: DocumentReference<T>): boolean;
  }

  export interface CollectionReference<T = unknown> extends Query<T> {
    readonly id: string;
    readonly path: string;
    readonly parent: DocumentReference<unknown> | null;
    readonly firestore: Firestore;
    withConverter(converter: null): CollectionReference<T>;
    withConverter<U>(converter: FirestoreDataConverter<U>): CollectionReference<U>;
    doc(documentPath?: string): DocumentReference<T>;
    isEqual(other: CollectionReference<T>): boolean;
  }

  export interface Query<T = unknown> {
    readonly firestore: Firestore;
    readonly path: string;
    withConverter(converter: null): Query<T>;
    withConverter<U>(converter: FirestoreDataConverter<U>): Query<U>;
    isEqual(other: Query<T>): boolean;
  }

  export interface FirestoreDataConverter<T> {
    toFirestore(modelObject: T, options?: SetOptions): DocumentData;
    fromFirestore(snapshot: QueryDocumentSnapshot): T;
  }

  export interface SetOptions {
    merge?: boolean;
    mergeFields?: (string | FieldPath)[];
  }

  export interface DocumentData {
    [field: string]: unknown;
  }

  export interface FieldPath {
    readonly segments: string[];
  }

  export interface Timestamp {
    readonly seconds: number;
    readonly nanoseconds: number;
    toMillis(): number;
    toDate(): Date;
    isEqual(other: Timestamp): boolean;
  }

  export interface TimestampConstructor {
    now(): Timestamp;
    fromDate(date: Date): Timestamp;
    fromMillis(milliseconds: number): Timestamp;
  }

  export const Timestamp: TimestampConstructor;

  export interface Unsubscribe {
    (): void;
  }

  export function getFirestore(app?: FirebaseApp): Firestore;
  export function doc(firestore: Firestore, path: string, ...pathSegments: string[]): DocumentReference;
  export function doc(reference: DocumentReference, path: string, ...pathSegments: string[]): DocumentReference;
  export function doc(reference: CollectionReference): DocumentReference;
  export function collection(firestore: Firestore, path: string, ...pathSegments: string[]): CollectionReference;
  export function collection(reference: DocumentReference, path: string, ...pathSegments: string[]): CollectionReference;
  export function setDoc<T>(reference: DocumentReference<T>, data: T, options?: SetOptions): Promise<void>;
  export function updateDoc(reference: DocumentReference, data: UpdateData): Promise<void>;
  export function deleteDoc(reference: DocumentReference): Promise<void>;
  export function getDoc<T>(reference: DocumentReference<T>): Promise<DocumentSnapshot<T>>;
  export function onSnapshot<T>(reference: DocumentReference<T>, onNext: (snapshot: DocumentSnapshot<T>) => void, onError?: (error: Error) => void): Unsubscribe;
  export function onSnapshot<T>(query: Query<T>, onNext: (snapshot: QuerySnapshot<T>) => void, onError?: (error: Error) => void): Unsubscribe;
  export function query<T>(query: Query<T>, ...queryConstraints: QueryConstraint[]): Query<T>;
  export function where(fieldPath: string | FieldPath, opStr: WhereFilterOp, value: unknown): QueryConstraint;
  export function orderBy(fieldPath: string | FieldPath, directionStr?: 'asc' | 'desc'): QueryConstraint;
  export function limit(limit: number): QueryConstraint;
  export function writeBatch(firestore: Firestore): WriteBatch;

  export interface WriteBatch {
    set<T>(documentRef: DocumentReference<T>, data: T, options?: SetOptions): WriteBatch;
    update(documentRef: DocumentReference, data: UpdateData): WriteBatch;
    delete(documentRef: DocumentReference): WriteBatch;
    commit(): Promise<void>;
  }

  export interface UpdateData {
    [field: string]: unknown;
  }

  export type WhereFilterOp = '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in';
  export type QueryConstraint = unknown;

  export function enableIndexedDbPersistence(firestore: Firestore): Promise<void>;
  export function enableNetwork(firestore: Firestore): Promise<void>;
  export function disableNetwork(firestore: Firestore): Promise<void>;
}