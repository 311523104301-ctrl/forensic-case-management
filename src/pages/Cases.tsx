import { useState } from 'react';
import { Plus, Search, Filter, ChevronUp, ChevronDown } from 'lucide-react';
import { CaseStatusBadge, PriorityBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { USERS } from '../data/demo';
import type { Case, CasePriority, CaseStatus, CaseType } from '../types';
import { FolderOpen } from 'lucide-react';

const STATUS_OPTIONS: CaseStatus[] = ['REGISTERED', 'UNDER_INVESTIGATION', 'EVIDENCE_COLLECTION', 'LABORATORY_ANALYSIS', 'EXPERT_REVIEW', 'REPORT_PREPARATION', 'CLOSED'];
const PRIORITY_OPTIONS: CasePriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const TYPE_OPTIONS: CaseType[] = ['HOMICIDE', 'PROPERTY_CRIME', 'CYBERCRIME', 'FRAUD', 'DRUG_OFFENSE', 'ASSAULT', 'ARSON', 'THEFT', 'OTHER'];

export function Cases() {
  const { cases, addCase, updateCase, setPage, showToast, addAuditLog } = useApp();
  const { currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [showCreate, setShowCreate] = useState(false);
  const [sortField, setSortField] = useState<'updatedAt' | 'priority' | 'caseNumber'>('updatedAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [form, setForm] = useState({ title: '', type: 'PROPERTY_CRIME' as CaseType, description: '', incidentDate: '', location: '', priority: 'MEDIUM' as CasePriority });

  const getUserName = (id: string) => USERS.find(u => u.id === id)?.name || 'Unknown';

  const filtered = cases
    .filter(c => {
      const q = search.toLowerCase();
      return (!q || c.caseNumber.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.location.toLowerCase().includes(q))
        && (!filterStatus || c.status === filterStatus)
        && (!filterPriority || c.priority === filterPriority);
    })
    .sort((a, b) => {
      let va: string = a[sortField] as string, vb: string = b[sortField] as string;
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  const toggleSort = (f: typeof sortField) => { if (sortField === f) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortField(f); setSortDir('desc'); } };

  const handleCreate = () => {
    if (!form.title.trim()) return;
    const id = `c${Date.now()}`;
    const caseNum = `FC-2026-${String(cases.length + 1).padStart(3, '0')}`;
    const newCase: Case = {
      id, caseNumber: caseNum, ...form, reportedDate: new Date().toISOString().split('T')[0],
      investigatorId: currentUser?.id || 'u2', supervisorId: 'u4', status: 'REGISTERED',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: [],
      managementPriority: 'LOW', managementReason: 'Newly registered case. No pending tasks.'
    };
    addCase(newCase);
    addAuditLog({ id: `al${Date.now()}`, timestamp: new Date().toISOString(), userId: currentUser?.id || '', userRole: currentUser?.role || 'INVESTIGATOR', action: 'CASE_CREATED', entity: 'CASE', entityId: id, ipAddress: '192.168.1.x', result: 'SUCCESS', details: `Case ${caseNum} created.` });
    showToast(`Case ${caseNum} created successfully.`);
    setShowCreate(false);
    setForm({ title: '', type: 'PROPERTY_CRIME', description: '', incidentDate: '', location: '', priority: 'MEDIUM' });
  };

  const SortIcon = ({ field }: { field: typeof sortField }) => (
    <span className="ml-1 opacity-50">
      {sortField === field ? (sortDir === 'asc' ? <ChevronUp size={11} className="inline" /> : <ChevronDown size={11} className="inline" />) : <ChevronDown size={11} className="inline opacity-40" />}
    </span>
  );

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Cases</h2>
          <p className="text-xs text-slate-500 mt-0.5">{filtered.length} of {cases.length} cases</p>
        </div>
        {(currentUser?.role === 'INVESTIGATOR' || currentUser?.role === 'ADMINISTRATOR') && (
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
            <Plus size={14} /> New Case
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cases…"
            className="w-full bg-white/05 border border-white/08 rounded pl-8 pr-3 py-1.5 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="bg-white/05 border border-white/08 rounded px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50">
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
          className="bg-white/05 border border-white/08 rounded px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50">
          <option value="">All Priorities</option>
          {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#0f1624] border border-white/07 rounded-lg overflow-hidden">
        {filtered.length === 0 ? <EmptyState icon={FolderOpen} title="No cases found" description="Try adjusting your search or filters." /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/06 bg-white/02">
                  <th className="text-left text-slate-500 font-medium px-4 py-3 cursor-pointer" onClick={() => toggleSort('caseNumber')}>Case ID <SortIcon field="caseNumber" /></th>
                  <th className="text-left text-slate-500 font-medium px-4 py-3">Title</th>
                  <th className="text-left text-slate-500 font-medium px-4 py-3">Type</th>
                  <th className="text-left text-slate-500 font-medium px-4 py-3">Investigator</th>
                  <th className="text-left text-slate-500 font-medium px-4 py-3">Status</th>
                  <th className="text-left text-slate-500 font-medium px-4 py-3 cursor-pointer" onClick={() => toggleSort('priority')}>Priority <SortIcon field="priority" /></th>
                  <th className="text-left text-slate-500 font-medium px-4 py-3 cursor-pointer" onClick={() => toggleSort('updatedAt')}>Updated <SortIcon field="updatedAt" /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/04">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-white/03 cursor-pointer transition-colors" onClick={() => setPage('case-detail', c.id)}>
                    <td className="px-4 py-3 font-mono text-blue-400 whitespace-nowrap">{c.caseNumber}</td>
                    <td className="px-4 py-3 text-slate-200 max-w-[200px]">
                      <p className="truncate">{c.title}</p>
                      <p className="text-slate-500 truncate mt-0.5">{c.location}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{c.type.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3 text-slate-400">{getUserName(c.investigatorId)}</td>
                    <td className="px-4 py-3"><CaseStatusBadge status={c.status} /></td>
                    <td className="px-4 py-3"><PriorityBadge priority={c.priority} /></td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{new Date(c.updatedAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Case Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Register New Case" size="lg">
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs text-slate-400 mb-1 block">Case Title *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Descriptive case title"
                className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Case Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as CaseType }))}
                className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50">
                {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Priority</label>
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as CasePriority }))}
                className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50">
                {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Incident Date</label>
              <input type="date" value={form.incidentDate} onChange={e => setForm(f => ({ ...f, incidentDate: e.target.value }))}
                className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Location</label>
              <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Incident location"
                className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-slate-400 mb-1 block">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Case description and initial observations"
                className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 resize-none" />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-white/06">
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm rounded border border-white/10 text-slate-300 hover:bg-white/05">Cancel</button>
            <button onClick={handleCreate} className="px-4 py-2 text-sm rounded bg-blue-600 hover:bg-blue-500 text-white font-medium">Register Case</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
