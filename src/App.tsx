import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Cases } from './pages/Cases';
import { CaseDetail } from './pages/CaseDetail';
import { Evidence } from './pages/Evidence';
import { ChainOfCustody } from './pages/ChainOfCustody';
import { Examinations } from './pages/Examinations';
import { Assignments } from './pages/Assignments';
import { Documents } from './pages/Documents';
import { Reports } from './pages/Reports';
import { Notifications } from './pages/Notifications';
import { AuditLogs } from './pages/AuditLogs';
import { Users } from './pages/Users';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { Toast } from './components/ui/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';

function AppShell() {
  const { currentUser } = useAuth();
  const { page, toast } = useApp();

  if (!currentUser) return <Login />;

  const pageMap: Record<string, React.ReactNode> = {
    dashboard: <Dashboard />,
    cases: <Cases />,
    'case-detail': <CaseDetail />,
    evidence: <Evidence />,
    custody: <ChainOfCustody />,
    examinations: <Examinations />,
    assignments: <Assignments />,
    documents: <Documents />,
    reports: <Reports />,
    notifications: <Notifications />,
    audit: <AuditLogs />,
    users: <Users />,
    analytics: <Analytics />,
    settings: <Settings />,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#080d16]">
      {/* Sidebar – desktop only */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          {pageMap[page] || <Dashboard />}
        </main>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <AppShell />
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
