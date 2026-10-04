import { useState } from 'react';
import { Search, Bell, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Sidebar } from './Sidebar';

const ROLE_LABELS: Record<string, string> = {
  ADMINISTRATOR: 'Administrator',
  INVESTIGATOR: 'Investigator',
  FORENSIC_EXPERT: 'Forensic Expert',
  LAB_TECHNICIAN: 'Lab Technician',
  SUPERVISOR: 'Supervisor',
};

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  cases: 'Cases',
  'case-detail': 'Case Details',
  evidence: 'Evidence Management',
  custody: 'Chain of Custody',
  examinations: 'Examinations',
  assignments: 'Assignments',
  documents: 'Documents',
  reports: 'Reports',
  notifications: 'Notifications',
  audit: 'Audit Logs',
  users: 'Users & Roles',
  analytics: 'Analytics',
  settings: 'Settings',
};

export function Topbar() {
  const { currentUser, logout } = useAuth();
  const { unreadCount, setPage, page, cases, evidence } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const searchResults = searchQuery.length > 1 ? [
    ...cases.filter(c => c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) || c.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map(c => ({ type: 'Case', label: `${c.caseNumber} – ${c.title}`, id: c.id, page: 'case-detail' as const })),
    ...evidence.filter(e => e.evidenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) || e.description.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map(e => ({ type: 'Evidence', label: `${e.evidenceNumber} – ${e.description.substring(0, 50)}`, id: e.id, page: 'evidence' as const })),
  ] : [];

  return (
    <>
      <header className="h-14 border-b border-white/07 flex items-center gap-3 px-4 bg-[#080d16] shrink-0">
        <button onClick={() => setMobileSidebar(true)} className="lg:hidden p-2 rounded hover:bg-white/08 text-slate-400">
          <Menu size={18} />
        </button>

        <h1 className="text-sm font-semibold text-slate-200 hidden sm:block">{PAGE_TITLES[page] || page}</h1>

        <div className="flex-1 max-w-md relative ml-auto lg:ml-0">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setShowSearch(true); }}
              onFocus={() => setShowSearch(true)}
              onBlur={() => setTimeout(() => setShowSearch(false), 200)}
              placeholder="Search cases, evidence…"
              className="w-full bg-white/05 border border-white/08 rounded-md pl-9 pr-3 py-1.5 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/08 transition-colors"
            />
          </div>
          {showSearch && searchResults.length > 0 && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-[#111827] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
              {searchResults.map((r, i) => (
                <button key={i} onMouseDown={() => { setPage(r.page, r.page === 'case-detail' ? r.id : null); setSearchQuery(''); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/05 text-left transition-colors">
                  <span className="text-[10px] font-mono bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">{r.type}</span>
                  <span className="text-xs text-slate-200 truncate">{r.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <button onClick={() => setPage('notifications')} className="relative p-2 rounded hover:bg-white/08 text-slate-400 hover:text-white transition-colors">
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </button>

          {currentUser && (
            <div className="relative">
              <button onClick={() => setShowProfile(p => !p)} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/08 transition-colors">
                <div className="w-6 h-6 rounded-full bg-blue-600/30 flex items-center justify-center text-xs font-bold text-blue-300">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="text-xs text-slate-300 hidden sm:block">{currentUser.name.split(' ')[0]}</span>
                <ChevronDown size={12} className="text-slate-500" />
              </button>
              {showProfile && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-[#111827] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/08">
                    <p className="text-sm font-medium text-white">{currentUser.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{currentUser.email}</p>
                    <p className="text-xs text-blue-400 mt-0.5 font-mono">{ROLE_LABELS[currentUser.role]}</p>
                  </div>
                  <button onClick={() => { logout(); setShowProfile(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Mobile sidebar drawer */}
      {mobileSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileSidebar(false)} />
          <div className="absolute left-0 top-0 bottom-0">
            <Sidebar mobile onClose={() => setMobileSidebar(false)} />
          </div>
        </div>
      )}
    </>
  );
}
