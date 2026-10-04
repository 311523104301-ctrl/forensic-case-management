import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Case, Evidence, CustodyTransaction, Examination, Assignment, Document, Report, Notification, AuditLog, HashRecord, TimelineEvent, User } from '../types';
import { CASES, EVIDENCE, CUSTODY_TRANSACTIONS, EXAMINATIONS, ASSIGNMENTS, DOCUMENTS, REPORTS, NOTIFICATIONS, AUDIT_LOGS, HASH_RECORDS, TIMELINE_EVENTS, USERS } from '../data/demo';

export type Page = 'dashboard' | 'cases' | 'case-detail' | 'evidence' | 'custody' | 'examinations' | 'assignments' | 'documents' | 'reports' | 'notifications' | 'audit' | 'users' | 'analytics' | 'settings';

const STORAGE_KEY = 'fcmp_app_state_v1';

type PersistedState = {
  cases: Case[];
  evidence: Evidence[];
  custodyTransactions: CustodyTransaction[];
  examinations: Examination[];
  assignments: Assignment[];
  documents: Document[];
  reports: Report[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  timelineEvents: TimelineEvent[];
};

const initialState: PersistedState = {
  cases: CASES,
  evidence: EVIDENCE,
  custodyTransactions: CUSTODY_TRANSACTIONS,
  examinations: EXAMINATIONS,
  assignments: ASSIGNMENTS,
  documents: DOCUMENTS,
  reports: REPORTS,
  notifications: NOTIFICATIONS,
  auditLogs: AUDIT_LOGS,
  timelineEvents: TIMELINE_EVENTS,
};

function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      cases: parsed.cases ?? CASES,
      evidence: parsed.evidence ?? EVIDENCE,
      custodyTransactions: parsed.custodyTransactions ?? CUSTODY_TRANSACTIONS,
      examinations: parsed.examinations ?? EXAMINATIONS,
      assignments: parsed.assignments ?? ASSIGNMENTS,
      documents: parsed.documents ?? DOCUMENTS,
      reports: parsed.reports ?? REPORTS,
      notifications: parsed.notifications ?? NOTIFICATIONS,
      auditLogs: parsed.auditLogs ?? AUDIT_LOGS,
      timelineEvents: parsed.timelineEvents ?? TIMELINE_EVENTS,
    };
  } catch {
    return initialState;
  }
}

interface AppContextType {
  page: Page;
  selectedCaseId: string | null;
  selectedEvidenceId: string | null;
  setPage: (page: Page, caseId?: string | null, evidenceId?: string | null) => void;
  cases: Case[];
  evidence: Evidence[];
  custodyTransactions: CustodyTransaction[];
  examinations: Examination[];
  assignments: Assignment[];
  documents: Document[];
  reports: Report[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  hashRecords: HashRecord[];
  timelineEvents: TimelineEvent[];
  users: User[];
  addCase: (c: Case) => void;
  updateCase: (id: string, updates: Partial<Case>) => void;
  addEvidence: (e: Evidence) => void;
  updateEvidence: (id: string, updates: Partial<Evidence>) => void;
  addCustodyTransaction: (tx: CustodyTransaction) => void;
  updateCustodyTransaction: (id: string, updates: Partial<CustodyTransaction>) => void;
  addExamination: (ex: Examination) => void;
  updateExamination: (id: string, updates: Partial<Examination>) => void;
  addReport: (r: Report) => void;
  updateReport: (id: string, updates: Partial<Report>) => void;
  markNotificationRead: (id: string) => void;
  addNotification: (n: Notification) => void;
  addAuditLog: (log: AuditLog) => void;
  addTimelineEvent: (e: TimelineEvent) => void;
  resetDemoData: () => void;
  unreadCount: number;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [page, setPageState] = useState<Page>('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  const [state, setState] = useState<PersistedState>(loadState);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Local persistence is a convenience for this browser-based demo build.
    }
  }, [state]);

  const setPage = (p: Page, caseId?: string | null, evidenceId?: string | null) => {
    setPageState(p);
    if (caseId !== undefined) setSelectedCaseId(caseId);
    if (evidenceId !== undefined) setSelectedEvidenceId(evidenceId);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3500);
  };

  const addCase = (c: Case) => setState(prev => ({ ...prev, cases: [c, ...prev.cases] }));
  const updateCase = (id: string, updates: Partial<Case>) => setState(prev => ({ ...prev, cases: prev.cases.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c) }));
  const addEvidence = (e: Evidence) => setState(prev => ({ ...prev, evidence: [e, ...prev.evidence] }));
  const updateEvidence = (id: string, updates: Partial<Evidence>) => setState(prev => ({ ...prev, evidence: prev.evidence.map(e => e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e) }));
  const addCustodyTransaction = (tx: CustodyTransaction) => setState(prev => ({ ...prev, custodyTransactions: [tx, ...prev.custodyTransactions] }));
  const updateCustodyTransaction = (id: string, updates: Partial<CustodyTransaction>) => setState(prev => ({ ...prev, custodyTransactions: prev.custodyTransactions.map(t => t.id === id ? { ...t, ...updates } : t) }));
  const addExamination = (ex: Examination) => setState(prev => ({ ...prev, examinations: [ex, ...prev.examinations] }));
  const updateExamination = (id: string, updates: Partial<Examination>) => setState(prev => ({ ...prev, examinations: prev.examinations.map(e => e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e) }));
  const addReport = (r: Report) => setState(prev => ({ ...prev, reports: [r, ...prev.reports] }));
  const updateReport = (id: string, updates: Partial<Report>) => setState(prev => ({ ...prev, reports: prev.reports.map(r => r.id === id ? { ...r, ...updates } : r) }));
  const markNotificationRead = (id: string) => setState(prev => ({ ...prev, notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n) }));
  const addNotification = (n: Notification) => setState(prev => ({ ...prev, notifications: [n, ...prev.notifications] }));
  const addAuditLog = (log: AuditLog) => setState(prev => ({ ...prev, auditLogs: [log, ...prev.auditLogs] }));
  const addTimelineEvent = (e: TimelineEvent) => setState(prev => ({ ...prev, timelineEvents: [...prev.timelineEvents, e] }));

  const resetDemoData = () => {
    setState(initialState);
    setPageState('dashboard');
    setSelectedCaseId(null);
    setSelectedEvidenceId(null);
    showToast('Demo data has been restored.', 'info');
  };

  const unreadCount = useMemo(() => state.notifications.filter(n => !n.read).length, [state.notifications]);

  return (
    <AppContext.Provider value={{
      page, selectedCaseId, selectedEvidenceId, setPage,
      ...state, hashRecords: HASH_RECORDS, users: USERS,
      addCase, updateCase, addEvidence, updateEvidence, addCustodyTransaction, updateCustodyTransaction,
      addExamination, updateExamination, addReport, updateReport, markNotificationRead, addNotification,
      addAuditLog, addTimelineEvent, resetDemoData, unreadCount, toast, showToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
