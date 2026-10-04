import { Shield, LayoutDashboard, FolderOpen, Package, Link2, FlaskConical, ClipboardList, FileText, BarChart3, Bell, ScrollText, Users, Settings, ChevronRight, X } from 'lucide-react';
import type { Page } from '../../context/AppContext';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  id: Page;
  label: string;
  icon: React.ElementType;
  roles?: string[];
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'cases', label: 'Cases', icon: FolderOpen },
  { id: 'evidence', label: 'Evidence', icon: Package },
  { id: 'custody', label: 'Chain of Custody', icon: Link2 },
  { id: 'examinations', label: 'Examinations', icon: FlaskConical },
  { id: 'assignments', label: 'Assignments', icon: ClipboardList },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'audit', label: 'Audit Logs', icon: ScrollText, roles: ['ADMINISTRATOR', 'SUPERVISOR'] },
  { id: 'users', label: 'Users & Roles', icon: Users, roles: ['ADMINISTRATOR'] },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const ROLE_COLORS: Record<string, string> = {
  ADMINISTRATOR: 'text-red-400 bg-red-500/10',
  INVESTIGATOR: 'text-blue-400 bg-blue-500/10',
  FORENSIC_EXPERT: 'text-cyan-400 bg-cyan-500/10',
  LAB_TECHNICIAN: 'text-amber-400 bg-amber-500/10',
  SUPERVISOR: 'text-violet-400 bg-violet-500/10',
};

const ROLE_LABELS: Record<string, string> = {
  ADMINISTRATOR: 'Administrator',
  INVESTIGATOR: 'Investigator',
  FORENSIC_EXPERT: 'Forensic Expert',
  LAB_TECHNICIAN: 'Lab Technician',
  SUPERVISOR: 'Supervisor',
};

export function Sidebar({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const { page, setPage, unreadCount } = useApp();
  const { currentUser } = useAuth();

  const visibleItems = NAV_ITEMS.filter(item => {
    if (!item.roles) return true;
    return currentUser && item.roles.includes(currentUser.role);
  });

  const navBadge = (id: Page) => {
    if (id === 'notifications' && unreadCount > 0) return unreadCount;
    return undefined;
  };

  return (
    <aside className="flex flex-col h-full w-64 bg-[#080d16] border-r border-white/07 select-none">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/07">
        <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center shrink-0">
          <Shield size={16} className="text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white tracking-wide leading-none">FCMP</p>
          <p className="text-[10px] text-slate-500 mt-0.5 font-mono">Forensic Case Management</p>
        </div>
        {mobile && (
          <button onClick={onClose} className="ml-auto p-1 hover:bg-white/08 rounded text-slate-400">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {visibleItems.map(item => {
          const Icon = item.icon;
          const active = page === item.id || (item.id === 'cases' && page === 'case-detail');
          const badge = navBadge(item.id);
          return (
            <button
              key={item.id}
              onClick={() => { setPage(item.id); onClose?.(); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${active ? 'bg-blue-600/20 text-blue-300 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-white/05'}`}
            >
              <Icon size={15} className="shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {badge !== undefined && (
                <span className="text-[10px] font-bold bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center">{badge > 9 ? '9+' : badge}</span>
              )}
              {active && <ChevronRight size={12} className="text-blue-400/60" />}
            </button>
          );
        })}
      </nav>

      {/* User info */}
      {currentUser && (
        <div className="px-3 py-3 border-t border-white/07">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded hover:bg-white/05 transition-colors">
            <div className="w-7 h-7 rounded-full bg-blue-600/30 flex items-center justify-center text-xs font-bold text-blue-300 shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-200 truncate">{currentUser.name}</p>
              <span className={`text-[10px] font-mono px-1 py-0.5 rounded ${ROLE_COLORS[currentUser.role]}`}>
                {ROLE_LABELS[currentUser.role]}
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
