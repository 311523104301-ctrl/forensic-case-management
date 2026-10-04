import { useState } from 'react';
import { Search, ScrollText } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { useApp } from '../context/AppContext';
import { USERS } from '../data/demo';

const ACTION_COLORS: Record<string, string> = {
  LOGIN: 'bg-blue-500/10 text-blue-400',
  CASE_CREATED: 'bg-emerald-500/10 text-emerald-400',
  CASE_UPDATED: 'bg-amber-500/10 text-amber-400',
  EVIDENCE_CREATED: 'bg-cyan-500/10 text-cyan-400',
  EVIDENCE_TRANSFERRED: 'bg-violet-500/10 text-violet-400',
  EXAMINATION_STARTED: 'bg-amber-500/10 text-amber-400',
  FINDINGS_SUBMITTED: 'bg-emerald-500/10 text-emerald-400',
  REPORT_GENERATED: 'bg-blue-500/10 text-blue-400',
  REPORT_APPROVED: 'bg-emerald-500/10 text-emerald-400',
  USER_CREATED: 'bg-violet-500/10 text-violet-400',
};

export function AuditLogs() {
  const { auditLogs } = useApp();
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterRole, setFilterRole] = useState('');

  const filtered = auditLogs.filter(log => {
    const q = search.toLowerCase();
    const user = USERS.find(u => u.id === log.userId)?.name || '';
    return (!q || log.action.toLowerCase().includes(q) || user.toLowerCase().includes(q) || log.entity.toLowerCase().includes(q) || log.entityId.toLowerCase().includes(q))
      && (!filterAction || log.action === filterAction)
      && (!filterRole || log.userRole === filterRole);
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const uniqueActions = [...new Set(auditLogs.map(l => l.action))];
  const getUser = (id: string) => USERS.find(u => u.id === id)?.name || 'Unknown';

  return (
    <div className="p-5 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-white">Audit Logs</h2>
        <p className="text-xs text-slate-500 mt-0.5">Tamper-evident system activity log · {filtered.length} events</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search logs…"
            className="w-full bg-white/05 border border-white/08 rounded pl-8 pr-3 py-1.5 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50" />
        </div>
        <select value={filterAction} onChange={e => setFilterAction(e.target.value)}
          className="bg-white/05 border border-white/08 rounded px-3 py-1.5 text-sm text-slate-300 focus:outline-none">
          <option value="">All Actions</option>
          {uniqueActions.map(a => <option key={a} value={a}>{a.replace(/_/g, ' ')}</option>)}
        </select>
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)}
          className="bg-white/05 border border-white/08 rounded px-3 py-1.5 text-sm text-slate-300 focus:outline-none">
          <option value="">All Roles</option>
          {['ADMINISTRATOR', 'INVESTIGATOR', 'FORENSIC_EXPERT', 'LAB_TECHNICIAN', 'SUPERVISOR'].map(r => (
            <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      <div className="bg-[#0f1624] border border-white/07 rounded-lg overflow-hidden">
        {filtered.length === 0 ? <EmptyState icon={ScrollText} title="No audit logs found" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/06 bg-white/02">
                  {['Timestamp', 'User', 'Role', 'Action', 'Entity', 'Entity ID', 'IP Address', 'Result'].map(h => (
                    <th key={h} className="text-left text-slate-500 font-medium px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/04">
                {filtered.map(log => (
                  <tr key={log.id} className="hover:bg-white/02">
                    <td className="px-4 py-3 font-mono text-slate-500 whitespace-nowrap">{new Date(log.timestamp).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-slate-300">{getUser(log.userId)}</td>
                    <td className="px-4 py-3 text-slate-500">{log.userRole.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${ACTION_COLORS[log.action] || 'bg-slate-500/10 text-slate-400'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{log.entity}</td>
                    <td className="px-4 py-3 font-mono text-slate-500 text-[10px]">{log.entityId}</td>
                    <td className="px-4 py-3 font-mono text-slate-600">{log.ipAddress}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${log.result === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {log.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
