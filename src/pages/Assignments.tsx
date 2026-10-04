import { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { PriorityBadge, Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { USERS } from '../data/demo';

export function Assignments() {
  const { assignments, evidence, cases } = useApp();
  const { currentUser } = useAuth();
  const [filterStatus, setFilterStatus] = useState('');
  const [myOnly, setMyOnly] = useState(currentUser?.role === 'FORENSIC_EXPERT');

  const getUser = (id: string) => USERS.find(u => u.id === id)?.name || 'Unknown';
  const getEvidence = (id: string) => evidence.find(e => e.id === id);
  const getCase = (id: string) => cases.find(c => c.id === id);

  const filtered = assignments.filter(a => {
    return (!filterStatus || a.status === filterStatus)
      && (!myOnly || a.expertId === currentUser?.id);
  });

  const statusVariant = (s: string) => {
    const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'muted'> = {
      PENDING: 'muted', ACCEPTED: 'info', REJECTED: 'danger', IN_PROGRESS: 'warning', COMPLETED: 'success', OVERDUE: 'danger'
    };
    return map[s] || 'muted';
  };

  return (
    <div className="p-5 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-white">Assignments</h2>
        <p className="text-xs text-slate-500 mt-0.5">Evidence assignments to forensic experts</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="bg-white/05 border border-white/08 rounded px-3 py-1.5 text-sm text-slate-300 focus:outline-none">
          <option value="">All Statuses</option>
          {['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE', 'REJECTED'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={myOnly} onChange={e => setMyOnly(e.target.checked)} className="accent-blue-500" />
          <span className="text-xs text-slate-400">My assignments only</span>
        </label>
      </div>

      <div className="bg-[#0f1624] border border-white/07 rounded-lg overflow-hidden">
        {filtered.length === 0 ? <EmptyState icon={ClipboardList} title="No assignments found" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/06 bg-white/02">
                  {['Evidence', 'Case', 'Expert', 'Assigned By', 'Due Date', 'Priority', 'Status', 'Notes'].map(h => (
                    <th key={h} className="text-left text-slate-500 font-medium px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/04">
                {filtered.map(a => {
                  const ev = getEvidence(a.evidenceId);
                  const cs = getCase(a.caseId);
                  const overdue = a.status === 'OVERDUE' || (new Date(a.dueDate) < new Date() && !['COMPLETED', 'REJECTED'].includes(a.status));
                  return (
                    <tr key={a.id} className={`hover:bg-white/02 ${overdue ? 'bg-red-500/03' : ''}`}>
                      <td className="px-4 py-3 font-mono text-cyan-400">{ev?.evidenceNumber || a.evidenceId}</td>
                      <td className="px-4 py-3 font-mono text-blue-400">{cs?.caseNumber || '–'}</td>
                      <td className="px-4 py-3 text-slate-300">{getUser(a.expertId)}</td>
                      <td className="px-4 py-3 text-slate-400">{getUser(a.assignedById)}</td>
                      <td className={`px-4 py-3 font-mono ${overdue ? 'text-red-400' : 'text-slate-400'}`}>{new Date(a.dueDate).toLocaleDateString('en-IN')}</td>
                      <td className="px-4 py-3"><PriorityBadge priority={a.priority} /></td>
                      <td className="px-4 py-3"><Badge variant={statusVariant(a.status)}>{a.status.replace(/_/g, ' ')}</Badge></td>
                      <td className="px-4 py-3 text-slate-500 max-w-[160px] truncate">{a.notes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
