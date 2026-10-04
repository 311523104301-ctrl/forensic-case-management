import { useState } from 'react';
import { FlaskConical, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { ExamStatusBadge, PriorityBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { USERS } from '../data/demo';
import type { Examination, ExamStatus } from '../types';

export function Examinations() {
  const { examinations, evidence, cases, updateExamination, addExamination, showToast, addAuditLog, addNotification } = useApp();
  const { currentUser } = useAuth();
  const [filterStatus, setFilterStatus] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editModal, setEditModal] = useState<Examination | null>(null);
  const [editForm, setEditForm] = useState({ methodology: '', instruments: '', observations: '', findings: '', conclusion: '' });
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ evidenceId: '', caseId: '', expertId: '', type: '', dueDate: '', priority: 'MEDIUM' });

  const filtered = examinations.filter(e => !filterStatus || e.status === filterStatus);
  const getUser = (id: string) => USERS.find(u => u.id === id)?.name || 'Unknown';
  const getEvidence = (id: string) => evidence.find(e => e.id === id);

  const openEdit = (ex: Examination) => {
    setEditModal(ex);
    setEditForm({ methodology: ex.methodology, instruments: ex.instruments, observations: ex.observations, findings: ex.findings, conclusion: ex.conclusion });
  };

  const handleStatusChange = (ex: Examination, status: ExamStatus) => {
    const now = new Date().toISOString();
    const updates: Partial<Examination> = { status, updatedAt: now };
    if (status === 'IN_PROGRESS' && !ex.dateStarted) updates.dateStarted = now;
    if (status === 'COMPLETED') updates.dateCompleted = now;
    updateExamination(ex.id, updates);
    addAuditLog({ id: `al${Date.now()}`, timestamp: now, userId: currentUser?.id || '', userRole: currentUser?.role || 'FORENSIC_EXPERT', action: `EXAMINATION_${status}`, entity: 'EXAMINATION', entityId: ex.id, ipAddress: '192.168.1.x', result: 'SUCCESS', details: `Examination ${ex.examinationNumber} status changed to ${status}.` });
    showToast(`Examination status updated to ${status.replace(/_/g, ' ')}`);
  };

  const handleSaveFindings = () => {
    if (!editModal) return;
    updateExamination(editModal.id, { ...editForm, updatedAt: new Date().toISOString() });
    showToast('Examination findings saved.');
    setEditModal(null);
  };

  const handleSubmit = (ex: Examination) => {
    handleStatusChange(ex, 'UNDER_REVIEW');
    addNotification({ id: `n${Date.now()}`, userId: 'u4', title: 'Examination Submitted', message: `Examination ${ex.examinationNumber} has been submitted for your review.`, type: 'INFO', read: false, createdAt: new Date().toISOString() });
  };

  const handleCreate = () => {
    if (!createForm.evidenceId || !createForm.type) return;
    const id = `ex${Date.now()}`;
    const num = `EX-2026-${String(examinations.length + 1).padStart(3, '0')}`;
    const ev = evidence.find(e => e.id === createForm.evidenceId);
    const newEx: Examination = {
      id, examinationNumber: num, evidenceId: createForm.evidenceId, caseId: createForm.caseId || ev?.caseId || '',
      expertId: createForm.expertId || 'u3', type: createForm.type,
      dateAssigned: new Date().toISOString(), methodology: '', instruments: '', observations: '', findings: '', conclusion: '',
      status: 'ASSIGNED', dueDate: createForm.dueDate || new Date(Date.now() + 7 * 86400000).toISOString(),
      priority: createForm.priority as any, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    addExamination(newEx);
    showToast(`Examination ${num} created and assigned.`);
    setShowCreate(false);
  };

  const canEditStatus = (ex: Examination) => {
    if (currentUser?.role === 'FORENSIC_EXPERT') return ex.expertId === currentUser.id;
    return ['ADMINISTRATOR', 'SUPERVISOR', 'INVESTIGATOR'].includes(currentUser?.role || '');
  };

  const STATUS_FLOW: Record<ExamStatus, ExamStatus | null> = {
    ASSIGNED: 'ACCEPTED', ACCEPTED: 'IN_PROGRESS', IN_PROGRESS: null, COMPLETED: null, UNDER_REVIEW: null, APPROVED: null
  };

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Examinations</h2>
          <p className="text-xs text-slate-500 mt-0.5">{filtered.length} examinations</p>
        </div>
        {['ADMINISTRATOR', 'INVESTIGATOR', 'SUPERVISOR'].includes(currentUser?.role || '') && (
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
            <Plus size={14} /> Create Examination
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="bg-white/05 border border-white/08 rounded px-3 py-1.5 text-sm text-slate-300 focus:outline-none">
          <option value="">All Statuses</option>
          {['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'UNDER_REVIEW', 'APPROVED'].map(s => (
            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? <EmptyState icon={FlaskConical} title="No examinations found" /> : filtered.map(ex => {
          const ev = getEvidence(ex.evidenceId);
          const isExpanded = expanded === ex.id;
          const overdue = new Date(ex.dueDate) < new Date() && !['COMPLETED', 'APPROVED'].includes(ex.status);

          return (
            <div key={ex.id} className={`bg-[#0f1624] border rounded-lg overflow-hidden transition-colors ${overdue ? 'border-red-500/30' : 'border-white/07'}`}>
              <div className="flex items-center gap-4 px-4 py-3.5 cursor-pointer hover:bg-white/02" onClick={() => setExpanded(isExpanded ? null : ex.id)}>
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 min-w-0">
                  <div>
                    <p className="text-[10px] text-slate-600">EXAM ID</p>
                    <p className="text-xs font-mono text-cyan-400">{ex.examinationNumber}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-600">TYPE</p>
                    <p className="text-xs text-slate-300">{ex.type}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-600">EXPERT</p>
                    <p className="text-xs text-slate-400">{getUser(ex.expertId)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-600">DUE DATE</p>
                    <p className={`text-xs font-mono ${overdue ? 'text-red-400' : 'text-slate-400'}`}>{new Date(ex.dueDate).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <ExamStatusBadge status={ex.status} />
                  <PriorityBadge priority={ex.priority} />
                  {isExpanded ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-white/06 px-4 pb-4 pt-3 space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-slate-600 mb-1">EVIDENCE</p>
                      <p className="text-slate-300 font-mono">{ev?.evidenceNumber} – {ev?.type.replace(/_/g, ' ')}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 mb-1">DATES</p>
                      <p className="text-slate-400">Assigned: {new Date(ex.dateAssigned).toLocaleDateString('en-IN')}</p>
                      {ex.dateStarted && <p className="text-slate-400">Started: {new Date(ex.dateStarted).toLocaleDateString('en-IN')}</p>}
                      {ex.dateCompleted && <p className="text-slate-400">Completed: {new Date(ex.dateCompleted).toLocaleDateString('en-IN')}</p>}
                    </div>
                  </div>

                  {ex.methodology && (
                    <div className="space-y-2 text-xs">
                      {[{ label: 'Methodology', val: ex.methodology }, { label: 'Instruments', val: ex.instruments }, { label: 'Observations', val: ex.observations }, { label: 'Findings', val: ex.findings }, { label: 'Conclusion', val: ex.conclusion }]
                        .filter(f => f.val).map(f => (
                          <div key={f.label}>
                            <p className="text-slate-600 mb-0.5">{f.label.toUpperCase()}</p>
                            <p className="text-slate-300 leading-relaxed">{f.val}</p>
                          </div>
                        ))}
                    </div>
                  )}

                  <div className="flex gap-2 flex-wrap">
                    {canEditStatus(ex) && (
                      <>
                        {ex.status === 'ASSIGNED' && <button onClick={() => handleStatusChange(ex, 'ACCEPTED')} className="px-3 py-1.5 text-xs rounded bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-600/30 transition-colors">Accept Assignment</button>}
                        {ex.status === 'ACCEPTED' && <button onClick={() => handleStatusChange(ex, 'IN_PROGRESS')} className="px-3 py-1.5 text-xs rounded bg-amber-600/20 border border-amber-500/30 text-amber-300 hover:bg-amber-600/30 transition-colors">Start Examination</button>}
                        {ex.status === 'IN_PROGRESS' && (
                          <>
                            <button onClick={() => openEdit(ex)} className="px-3 py-1.5 text-xs rounded bg-violet-600/20 border border-violet-500/30 text-violet-300 hover:bg-violet-600/30 transition-colors">Edit Findings</button>
                            <button onClick={() => { handleSaveFindings(); handleSubmit(ex); }} className="px-3 py-1.5 text-xs rounded bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/30 transition-colors">Submit Findings</button>
                          </>
                        )}
                        {ex.status === 'UNDER_REVIEW' && currentUser?.role === 'SUPERVISOR' && (
                          <>
                            <button onClick={() => handleStatusChange(ex, 'APPROVED')} className="px-3 py-1.5 text-xs rounded bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/30 transition-colors">Approve</button>
                            <button onClick={() => handleStatusChange(ex, 'IN_PROGRESS')} className="px-3 py-1.5 text-xs rounded bg-red-600/20 border border-red-500/30 text-red-300 hover:bg-red-600/30 transition-colors">Return for Revision</button>
                          </>
                        )}
                      </>
                    )}
                    <button onClick={() => openEdit(ex)} className="px-3 py-1.5 text-xs rounded bg-white/05 border border-white/10 text-slate-400 hover:bg-white/08 transition-colors">View/Edit Details</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit Findings Modal */}
      <Modal open={!!editModal} onClose={() => setEditModal(null)} title={`Edit Examination – ${editModal?.examinationNumber}`} size="xl">
        <div className="p-6 space-y-4">
          {(['methodology', 'instruments', 'observations', 'findings', 'conclusion'] as const).map(field => (
            <div key={field}>
              <label className="text-xs text-slate-400 mb-1 block capitalize">{field}</label>
              <textarea value={editForm[field]} onChange={e => setEditForm(f => ({ ...f, [field]: e.target.value }))} rows={3}
                className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 resize-none" />
            </div>
          ))}
          <div className="flex gap-3 justify-end pt-2 border-t border-white/06">
            <button onClick={() => setEditModal(null)} className="px-4 py-2 text-sm rounded border border-white/10 text-slate-300 hover:bg-white/05">Cancel</button>
            <button onClick={handleSaveFindings} className="px-4 py-2 text-sm rounded bg-blue-600 hover:bg-blue-500 text-white font-medium">Save</button>
          </div>
        </div>
      </Modal>

      {/* Create Examination Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Examination" size="md">
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Evidence *</label>
            <select value={createForm.evidenceId} onChange={e => setCreateForm(f => ({ ...f, evidenceId: e.target.value }))}
              className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none">
              <option value="">Select evidence…</option>
              {evidence.map(ev => <option key={ev.id} value={ev.id}>{ev.evidenceNumber} – {ev.type.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Assign Expert</label>
            <select value={createForm.expertId} onChange={e => setCreateForm(f => ({ ...f, expertId: e.target.value }))}
              className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none">
              <option value="">Select expert…</option>
              {USERS.filter(u => u.role === 'FORENSIC_EXPERT').map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Examination Type *</label>
            <input value={createForm.type} onChange={e => setCreateForm(f => ({ ...f, type: e.target.value }))} placeholder="e.g. Fingerprint Analysis, DNA Profiling"
              className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Due Date</label>
              <input type="date" value={createForm.dueDate} onChange={e => setCreateForm(f => ({ ...f, dueDate: e.target.value }))}
                className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Priority</label>
              <select value={createForm.priority} onChange={e => setCreateForm(f => ({ ...f, priority: e.target.value }))}
                className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none">
                {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-white/06">
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm rounded border border-white/10 text-slate-300 hover:bg-white/05">Cancel</button>
            <button onClick={handleCreate} className="px-4 py-2 text-sm rounded bg-blue-600 hover:bg-blue-500 text-white font-medium">Create & Assign</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
