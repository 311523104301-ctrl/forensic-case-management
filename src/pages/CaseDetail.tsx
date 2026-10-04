import { useState } from 'react';
import { ArrowLeft, Edit2, Check, X, Package, FlaskConical, FileText, BarChart3, Clock, Activity, MapPin, Calendar, User } from 'lucide-react';
import { CaseStatusBadge, PriorityBadge, EvidenceStatusBadge, ConditionBadge, ExamStatusBadge } from '../components/ui/Badge';
import { useApp } from '../context/AppContext';
import { USERS } from '../data/demo';
import type { CaseStatus } from '../types';

const TABS = ['Overview', 'Evidence', 'Timeline', 'Examinations', 'Documents', 'Reports', 'Activity'];

const STATUS_OPTIONS: CaseStatus[] = ['REGISTERED', 'UNDER_INVESTIGATION', 'EVIDENCE_COLLECTION', 'LABORATORY_ANALYSIS', 'EXPERT_REVIEW', 'REPORT_PREPARATION', 'CLOSED'];

const MGMT_COLORS: Record<string, string> = {
  LOW: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  MEDIUM: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  HIGH: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  CRITICAL: 'text-red-400 bg-red-500/10 border-red-500/20',
};

export function CaseDetail() {
  const { selectedCaseId, cases, evidence, examinations, documents, reports, timelineEvents, updateCase, setPage, showToast } = useApp();
  const [tab, setTab] = useState('Overview');

  const c = cases.find(x => x.id === selectedCaseId);
  if (!c) return (
    <div className="p-5">
      <button onClick={() => setPage('cases')} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-4"><ArrowLeft size={14} /> Back to Cases</button>
      <p className="text-slate-400">Case not found.</p>
    </div>
  );

  const caseEvidence = evidence.filter(e => e.caseId === c.id);
  const caseExams = examinations.filter(e => e.caseId === c.id);
  const caseDocs = documents.filter(d => d.caseId === c.id);
  const caseReports = reports.filter(r => r.caseId === c.id);
  const caseTimeline = timelineEvents.filter(t => t.caseId === c.id).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const getUser = (id: string) => USERS.find(u => u.id === id);
  const investigator = getUser(c.investigatorId);
  const supervisor = getUser(c.supervisorId);

  const handleStatusChange = (status: CaseStatus) => {
    updateCase(c.id, { status, updatedAt: new Date().toISOString() });
    showToast(`Case status updated to ${status.replace(/_/g, ' ')}`);
  };

  const iconMap: Record<string, string> = {
    case: '📁', evidence: '🔍', transfer: '🔄', assign: '👤', exam: '🔬', findings: '📋', default: '•'
  };

  return (
    <div className="p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start gap-4 flex-wrap">
        <button onClick={() => setPage('cases')} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mt-1 shrink-0"><ArrowLeft size={13} /> Cases</button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">{c.caseNumber}</span>
            <h2 className="text-base font-semibold text-white">{c.title}</h2>
          </div>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <CaseStatusBadge status={c.status} />
            <PriorityBadge priority={c.priority} />
            {c.managementPriority && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded border ${MGMT_COLORS[c.managementPriority]}`}>
                Mgmt: {c.managementPriority}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <select value={c.status} onChange={e => handleStatusChange(e.target.value as CaseStatus)}
            className="bg-white/05 border border-white/10 rounded px-3 py-1.5 text-xs text-slate-300 focus:outline-none">
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
        </div>
      </div>

      {/* Management priority alert */}
      {c.managementPriority && c.managementPriority !== 'LOW' && (
        <div className={`border rounded-lg px-4 py-2.5 text-xs flex items-start gap-2 ${MGMT_COLORS[c.managementPriority]}`}>
          <span className="font-bold shrink-0">⚠ WORKFLOW PRIORITY {c.managementPriority}</span>
          <span className="text-current/70">{c.managementReason}</span>
        </div>
      )}

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Evidence Items', value: caseEvidence.length, icon: Package },
          { label: 'Examinations', value: caseExams.length, icon: FlaskConical },
          { label: 'Documents', value: caseDocs.length, icon: FileText },
          { label: 'Reports', value: caseReports.length, icon: BarChart3 },
        ].map(s => (
          <div key={s.label} className="bg-[#0f1624] border border-white/07 rounded-lg p-3 flex items-center gap-3">
            <s.icon size={16} className="text-slate-500 shrink-0" />
            <div>
              <p className="text-lg font-bold text-white tabular-nums">{s.value}</p>
              <p className="text-[10px] text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-white/07">
        <div className="flex gap-0 overflow-x-auto">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${tab === t ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {tab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#0f1624] border border-white/07 rounded-lg p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Case Description</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{c.description || 'No description provided.'}</p>
            </div>
            <div className="bg-[#0f1624] border border-white/07 rounded-lg p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Case Details</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { label: 'Case Number', value: c.caseNumber, mono: true },
                  { label: 'Case Type', value: c.type.replace(/_/g, ' ') },
                  { label: 'Location', value: c.location },
                  { label: 'Incident Date', value: c.incidentDate },
                  { label: 'Reported Date', value: c.reportedDate },
                  { label: 'Created', value: new Date(c.createdAt).toLocaleDateString('en-IN') },
                ].map(d => (
                  <div key={d.label}>
                    <p className="text-slate-600 mb-0.5">{d.label}</p>
                    <p className={`text-slate-200 ${d.mono ? 'font-mono' : ''}`}>{d.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-[#0f1624] border border-white/07 rounded-lg p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Assigned Personnel</h3>
              {[{ label: 'Investigator', user: investigator }, { label: 'Supervisor', user: supervisor }].map(p => (
                <div key={p.label} className="flex items-center gap-3 py-2">
                  <div className="w-7 h-7 rounded-full bg-blue-600/20 flex items-center justify-center text-xs font-bold text-blue-300">
                    {p.user?.name.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="text-xs text-slate-200">{p.user?.name}</p>
                    <p className="text-[10px] text-slate-500">{p.label}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-[#0f1624] border border-white/07 rounded-lg p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {c.tags.map(tag => (
                  <span key={tag} className="text-[10px] bg-slate-700/50 text-slate-400 px-2 py-0.5 rounded">{tag}</span>
                ))}
                {c.tags.length === 0 && <p className="text-xs text-slate-600">No tags</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'Evidence' && (
        <div className="bg-[#0f1624] border border-white/07 rounded-lg overflow-hidden">
          {caseEvidence.length === 0 ? <p className="text-xs text-slate-500 p-6 text-center">No evidence registered for this case.</p> : (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/06 bg-white/02">
                  {['Evidence ID', 'Type', 'Description', 'Status', 'Condition', 'Holder'].map(h => (
                    <th key={h} className="text-left text-slate-500 font-medium px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/04">
                {caseEvidence.map(ev => (
                  <tr key={ev.id} className="hover:bg-white/02">
                    <td className="px-4 py-3 font-mono text-cyan-400">{ev.evidenceNumber}</td>
                    <td className="px-4 py-3 text-slate-400">{ev.type.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3 text-slate-300 max-w-[200px] truncate">{ev.description}</td>
                    <td className="px-4 py-3"><EvidenceStatusBadge status={ev.status} /></td>
                    <td className="px-4 py-3"><ConditionBadge condition={ev.condition} /></td>
                    <td className="px-4 py-3 text-slate-400">{USERS.find(u => u.id === ev.currentHolderId)?.name || '–'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'Timeline' && (
        <div className="max-w-2xl space-y-1">
          {caseTimeline.length === 0 ? <p className="text-xs text-slate-500">No timeline events yet.</p> : caseTimeline.map((event, i) => (
            <div key={event.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-sm shrink-0">
                  {iconMap[event.icon] || '•'}
                </div>
                {i < caseTimeline.length - 1 && <div className="w-px flex-1 bg-white/07 my-1" />}
              </div>
              <div className="pb-4 min-w-0">
                <p className="text-xs font-medium text-slate-200">{event.action.replace(/_/g, ' ')}</p>
                <p className="text-xs text-slate-400 mt-0.5">{event.description}</p>
                <p className="text-[10px] text-slate-600 mt-1 font-mono">
                  {new Date(event.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} · {USERS.find(u => u.id === event.userId)?.name || 'System'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'Examinations' && (
        <div className="space-y-3">
          {caseExams.length === 0 ? <p className="text-xs text-slate-500">No examinations for this case.</p> : caseExams.map(ex => (
            <div key={ex.id} className="bg-[#0f1624] border border-white/07 rounded-lg p-4">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <span className="text-xs font-mono text-cyan-400">{ex.examinationNumber}</span>
                  <p className="text-sm font-medium text-white mt-0.5">{ex.type}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Expert: {USERS.find(u => u.id === ex.expertId)?.name}</p>
                </div>
                <ExamStatusBadge status={ex.status} />
              </div>
              {ex.findings && <p className="text-xs text-slate-400 mt-3 leading-relaxed border-t border-white/06 pt-3 line-clamp-2">{ex.findings}</p>}
            </div>
          ))}
        </div>
      )}

      {tab === 'Documents' && (
        <div className="space-y-2">
          {caseDocs.length === 0 ? <p className="text-xs text-slate-500">No documents uploaded.</p> : caseDocs.map(doc => (
            <div key={doc.id} className="flex items-center gap-3 bg-[#0f1624] border border-white/07 rounded-lg px-4 py-3">
              <FileText size={16} className="text-slate-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-200 truncate">{doc.name}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{doc.fileSize} · Uploaded {new Date(doc.uploadedAt).toLocaleDateString('en-IN')} · v{doc.version}</p>
              </div>
              <button className="text-xs text-blue-400 hover:text-blue-300">View</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'Reports' && (
        <div className="space-y-2">
          {caseReports.length === 0 ? <p className="text-xs text-slate-500">No reports generated.</p> : caseReports.map(r => (
            <div key={r.id} className="flex items-center gap-3 bg-[#0f1624] border border-white/07 rounded-lg px-4 py-3">
              <BarChart3 size={16} className="text-slate-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-200 truncate">{r.title}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 font-mono">{r.reportNumber} · {new Date(r.generatedAt).toLocaleDateString('en-IN')}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${r.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' : r.status === 'PENDING_REVIEW' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-500/10 text-slate-400'}`}>{r.status.replace(/_/g, ' ')}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'Activity' && (
        <div className="text-xs text-slate-400 space-y-2">
          <p className="text-slate-500">Recent activity log for this case:</p>
          {[
            { time: c.updatedAt, action: 'Case last updated' },
            { time: c.createdAt, action: 'Case registered' },
          ].map((a, i) => (
            <div key={i} className="flex gap-3 py-2 border-b border-white/04">
              <span className="font-mono text-slate-600 shrink-0">{new Date(a.time).toLocaleDateString('en-IN')}</span>
              <span className="text-slate-300">{a.action}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
