import { useState } from 'react';
import { BarChart3, Download, Eye, CheckCircle, XCircle, Plus, FileDown } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { USERS } from '../data/demo';
import type { Report } from '../types';

const REPORT_TYPES = [
  { id: 'CASE_SUMMARY', label: 'Case Summary' },
  { id: 'EVIDENCE_REPORT', label: 'Evidence Report' },
  { id: 'CHAIN_OF_CUSTODY', label: 'Chain of Custody Report' },
  { id: 'EXAMINATION_REPORT', label: 'Examination Report' },
  { id: 'COMPLETE_CASE', label: 'Complete Case Report' },
];

export function Reports() {
  const { reports, cases, examinations, evidence, custodyTransactions, addReport, updateReport, showToast } = useApp();
  const { currentUser } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [showPreview, setShowPreview] = useState<Report | null>(null);
  const [createForm, setCreateForm] = useState({ type: 'CASE_SUMMARY', caseId: '' });
  const [filterStatus, setFilterStatus] = useState('');

  const getUser = (id: string) => USERS.find(u => u.id === id)?.name || 'Unknown';
  const getCase = (id: string) => cases.find(c => c.id === id);

  const filtered = reports.filter(r => !filterStatus || r.status === filterStatus);

  const handleGenerate = () => {
    if (!createForm.caseId) return;
    const id = `r${Date.now()}`;
    const num = `RPT-2026-${String(reports.length + 1).padStart(3, '0')}`;
    const c = cases.find(x => x.id === createForm.caseId);
    const typeLabel = REPORT_TYPES.find(t => t.id === createForm.type)?.label || createForm.type;
    const newReport: Report = {
      id, reportNumber: num, type: createForm.type as any, caseId: createForm.caseId,
      generatedById: currentUser?.id || 'u2', generatedAt: new Date().toISOString(),
      status: 'DRAFT', title: `${typeLabel} – ${c?.caseNumber || 'Unknown Case'}`
    };
    addReport(newReport);
    showToast(`Report ${num} generated successfully.`);
    setShowCreate(false);
  };

  const handleSubmitReview = (r: Report) => {
    updateReport(r.id, { status: 'PENDING_REVIEW' });
    showToast(`Report ${r.reportNumber} submitted for review.`);
  };

  const handleApprove = (r: Report) => {
    updateReport(r.id, { status: 'APPROVED', reviewedById: currentUser?.id, reviewedAt: new Date().toISOString() });
    showToast(`Report ${r.reportNumber} approved.`);
  };

  const handleReject = (r: Report) => {
    updateReport(r.id, { status: 'REJECTED', reviewedById: currentUser?.id, reviewedAt: new Date().toISOString() });
    showToast(`Report ${r.reportNumber} rejected.`, 'error');
  };

  const previewContent = (r: Report) => {
    const c = getCase(r.caseId);
    const caseEvidence = evidence.filter(e => e.caseId === r.caseId);
    const caseExams = examinations.filter(e => e.caseId === r.caseId);
    const caseCustody = custodyTransactions.filter(t => caseEvidence.some(ev => ev.id === t.evidenceId));
    return { c, caseEvidence, caseExams, caseCustody };
  };

  const statusColor: Record<string, string> = {
    DRAFT: 'bg-slate-500/10 text-slate-400',
    PENDING_REVIEW: 'bg-amber-500/10 text-amber-400',
    APPROVED: 'bg-emerald-500/10 text-emerald-400',
    REJECTED: 'bg-red-500/10 text-red-400',
  };

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Report Center</h2>
          <p className="text-xs text-slate-500 mt-0.5">{filtered.length} reports</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
          <Plus size={14} /> Generate Report
        </button>
      </div>

      <div className="flex gap-2">
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="bg-white/05 border border-white/08 rounded px-3 py-1.5 text-sm text-slate-300 focus:outline-none">
          <option value="">All Statuses</option>
          {['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED'].map(s => (
            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? <EmptyState icon={BarChart3} title="No reports yet" /> : filtered.map(r => {
          const c = getCase(r.caseId);
          return (
            <div key={r.id} className="bg-[#0f1624] border border-white/07 rounded-lg px-4 py-3 flex items-center gap-4">
              <BarChart3 size={16} className="text-slate-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-200 font-medium truncate">{r.title}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                  {r.reportNumber} · {c?.caseNumber} · Generated {new Date(r.generatedAt).toLocaleDateString('en-IN')} by {getUser(r.generatedById)}
                </p>
                {r.reviewedById && r.reviewedAt && (
                  <p className="text-[10px] text-slate-600 mt-0.5">
                    Reviewed by {getUser(r.reviewedById)} on {new Date(r.reviewedAt).toLocaleDateString('en-IN')}
                    {r.reviewNotes && ` – "${r.reviewNotes}"`}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${statusColor[r.status]}`}>
                  {r.status.replace(/_/g, ' ')}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => setShowPreview(r)} className="p-1.5 rounded hover:bg-white/08 text-slate-400 hover:text-slate-200"><Eye size={13} /></button>
                  <button onClick={() => showToast('PDF download started.', 'info')} className="p-1.5 rounded hover:bg-white/08 text-slate-400 hover:text-slate-200"><FileDown size={13} /></button>
                  {r.status === 'DRAFT' && <button onClick={() => handleSubmitReview(r)} className="px-2 py-1 text-[10px] rounded bg-blue-600/20 border border-blue-500/20 text-blue-400 hover:bg-blue-600/30 transition-colors">Submit</button>}
                  {r.status === 'PENDING_REVIEW' && currentUser?.role === 'SUPERVISOR' && (
                    <>
                      <button onClick={() => handleApprove(r)} className="px-2 py-1 text-[10px] rounded bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-600/30 transition-colors">Approve</button>
                      <button onClick={() => handleReject(r)} className="px-2 py-1 text-[10px] rounded bg-red-600/20 border border-red-500/20 text-red-400 hover:bg-red-600/30 transition-colors">Reject</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Generate Report Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Generate New Report" size="md">
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Report Type</label>
            <select value={createForm.type} onChange={e => setCreateForm(f => ({ ...f, type: e.target.value }))}
              className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none">
              {REPORT_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Case *</label>
            <select value={createForm.caseId} onChange={e => setCreateForm(f => ({ ...f, caseId: e.target.value }))}
              className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none">
              <option value="">Select case…</option>
              {cases.map(c => <option key={c.id} value={c.id}>{c.caseNumber} – {c.title}</option>)}
            </select>
          </div>
          <div className="bg-blue-500/05 border border-blue-500/15 rounded p-3 text-xs text-blue-300">
            The report will include all relevant data from the selected case including evidence, chain of custody, examinations, and documents.
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-white/06">
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm rounded border border-white/10 text-slate-300 hover:bg-white/05">Cancel</button>
            <button onClick={handleGenerate} className="px-4 py-2 text-sm rounded bg-blue-600 hover:bg-blue-500 text-white font-medium">Generate</button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal open={!!showPreview} onClose={() => setShowPreview(null)} title={`Preview: ${showPreview?.reportNumber}`} size="xl">
        {showPreview && (() => {
          const { c, caseEvidence, caseExams, caseCustody } = previewContent(showPreview);
          return (
            <div className="p-6 space-y-5 text-xs">
              <div className="text-center border-b border-white/08 pb-4">
                <p className="text-lg font-bold text-white">{showPreview.title}</p>
                <p className="text-slate-500 mt-1 font-mono">{showPreview.reportNumber} · Generated {new Date(showPreview.generatedAt).toLocaleDateString('en-IN')}</p>
              </div>
              {c && (
                <div>
                  <p className="text-slate-400 font-semibold uppercase text-[10px] mb-2 tracking-wider">Case Information</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-slate-600">Case Number: </span><span className="text-slate-200 font-mono">{c.caseNumber}</span></div>
                    <div><span className="text-slate-600">Status: </span><span className="text-slate-200">{c.status.replace(/_/g, ' ')}</span></div>
                    <div><span className="text-slate-600">Type: </span><span className="text-slate-200">{c.type.replace(/_/g, ' ')}</span></div>
                    <div><span className="text-slate-600">Priority: </span><span className="text-slate-200">{c.priority}</span></div>
                    <div className="col-span-2"><span className="text-slate-600">Location: </span><span className="text-slate-200">{c.location}</span></div>
                  </div>
                </div>
              )}
              <div>
                <p className="text-slate-400 font-semibold uppercase text-[10px] mb-2 tracking-wider">Evidence Summary ({caseEvidence.length} items)</p>
                {caseEvidence.map(ev => (
                  <div key={ev.id} className="flex justify-between py-1 border-b border-white/04 text-xs">
                    <span className="font-mono text-cyan-400">{ev.evidenceNumber}</span>
                    <span className="text-slate-400">{ev.type.replace(/_/g, ' ')}</span>
                    <span className="text-slate-500">{ev.status.replace(/_/g, ' ')}</span>
                  </div>
                ))}
              </div>
              {caseExams.length > 0 && (
                <div>
                  <p className="text-slate-400 font-semibold uppercase text-[10px] mb-2 tracking-wider">Examinations ({caseExams.length})</p>
                  {caseExams.map(ex => (
                    <div key={ex.id} className="py-1 border-b border-white/04">
                      <p className="font-mono text-cyan-400">{ex.examinationNumber} – {ex.type}</p>
                      {ex.conclusion && <p className="text-slate-400 mt-0.5 text-[10px] line-clamp-2">{ex.conclusion}</p>}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <button onClick={() => showToast('PDF download started.', 'info')} className="flex items-center gap-2 px-4 py-2 text-sm rounded bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors">
                  <FileDown size={14} /> Download PDF
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
