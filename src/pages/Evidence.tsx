import { useState } from 'react';
import { Plus, Search, QrCode, ArrowRightLeft, Package } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { EvidenceStatusBadge, ConditionBadge } from '../components/ui/Badge';
import { Modal, ConfirmDialog } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { USERS } from '../data/demo';
import type { Evidence as EvidenceType, EvidenceType as EType, EvidenceCondition, EvidenceStatus, CustodyTransaction } from '../types';

const EVIDENCE_TYPES: EType[] = ['FINGERPRINT', 'DOCUMENT', 'BIOLOGICAL_SAMPLE', 'DIGITAL_MEDIA', 'PHOTOGRAPH', 'TRACE_MATERIAL', 'PHYSICAL_OBJECT', 'OTHER'];
const CONDITIONS: EvidenceCondition[] = ['SEALED', 'SEAL_INTACT', 'OPENED_FOR_EXAMINATION', 'DAMAGED', 'TAMPERED', 'WET', 'BROKEN', 'OTHER'];

export function Evidence() {
  const { evidence, cases, addEvidence, addCustodyTransaction, updateEvidence, showToast, addAuditLog, addNotification } = useApp();
  const { currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCase, setFilterCase] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showQR, setShowQR] = useState<EvidenceType | null>(null);
  const [showTransfer, setShowTransfer] = useState<EvidenceType | null>(null);
  const [transferForm, setTransferForm] = useState({ toUserId: '', toLocation: '', purpose: '', condition: 'SEALED' as EvidenceCondition, conditionRemarks: '' });
  const [form, setForm] = useState({ caseId: '', type: 'FINGERPRINT' as EType, description: '', collectionDate: '', collectionLocation: '', condition: 'SEALED' as EvidenceCondition, notes: '' });

  const filtered = evidence.filter(e => {
    const q = search.toLowerCase();
    return (!q || e.evidenceNumber.toLowerCase().includes(q) || e.description.toLowerCase().includes(q))
      && (!filterType || e.type === filterType)
      && (!filterStatus || e.status === filterStatus)
      && (!filterCase || e.caseId === filterCase);
  });

  const handleCreate = () => {
    if (!form.caseId || !form.description) return;
    const id = `ev${Date.now()}`;
    const num = `EV-2026-${String(evidence.length + 1).padStart(4, '0')}`;
    const newEv: EvidenceType = {
      id, evidenceNumber: num, ...form, currentLocation: 'Evidence Storage Room A',
      currentHolderId: currentUser?.id || 'u5', status: 'REGISTERED',
      collectedById: currentUser?.id || 'u2', weight: '', dimensions: '',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), hasQR: true
    };
    addEvidence(newEv);
    addAuditLog({ id: `al${Date.now()}`, timestamp: new Date().toISOString(), userId: currentUser?.id || '', userRole: currentUser?.role || 'INVESTIGATOR', action: 'EVIDENCE_CREATED', entity: 'EVIDENCE', entityId: id, ipAddress: '192.168.1.x', result: 'SUCCESS', details: `Evidence ${num} registered.` });
    showToast(`Evidence ${num} registered.`);
    setShowCreate(false);
  };

  const handleTransfer = () => {
    if (!showTransfer || !transferForm.toUserId) return;
    const id = `ct${Date.now()}`;
    const txNum = `TX-2026-${String(Date.now()).slice(-4)}`;
    const tx: CustodyTransaction = {
      id, transactionNumber: txNum, evidenceId: showTransfer.id,
      fromUserId: showTransfer.currentHolderId, toUserId: transferForm.toUserId,
      fromLocation: showTransfer.currentLocation, toLocation: transferForm.toLocation || 'Destination',
      purpose: transferForm.purpose, condition: transferForm.condition,
      conditionRemarks: transferForm.conditionRemarks, transferDate: new Date().toISOString(),
      status: 'PENDING', previousHash: 'pending', currentHash: 'pending',
      createdAt: new Date().toISOString()
    };
    addCustodyTransaction(tx);
    updateEvidence(showTransfer.id, { status: 'IN_TRANSIT', currentHolderId: transferForm.toUserId, updatedAt: new Date().toISOString() });
    const recipient = USERS.find(u => u.id === transferForm.toUserId);
    if (recipient) {
      addNotification({ id: `n${Date.now()}`, userId: transferForm.toUserId, title: 'Evidence Transfer', message: `Evidence ${showTransfer.evidenceNumber} has been transferred to you. Please confirm receipt.`, type: 'INFO', read: false, relatedEntity: 'EVIDENCE', relatedId: showTransfer.id, createdAt: new Date().toISOString() });
    }
    showToast(`Transfer initiated for ${showTransfer.evidenceNumber}.`);
    setShowTransfer(null);
    setTransferForm({ toUserId: '', toLocation: '', purpose: '', condition: 'SEALED', conditionRemarks: '' });
  };

  const getCaseName = (id: string) => cases.find(c => c.id === id)?.caseNumber || id;

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Evidence Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">{filtered.length} of {evidence.length} items</p>
        </div>
        {(currentUser?.role === 'INVESTIGATOR' || currentUser?.role === 'ADMINISTRATOR') && (
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
            <Plus size={14} /> Register Evidence
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search evidence…"
            className="w-full bg-white/05 border border-white/08 rounded pl-8 pr-3 py-1.5 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50" />
        </div>
        <select value={filterCase} onChange={e => setFilterCase(e.target.value)}
          className="bg-white/05 border border-white/08 rounded px-3 py-1.5 text-sm text-slate-300 focus:outline-none">
          <option value="">All Cases</option>
          {cases.map(c => <option key={c.id} value={c.id}>{c.caseNumber}</option>)}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          className="bg-white/05 border border-white/08 rounded px-3 py-1.5 text-sm text-slate-300 focus:outline-none">
          <option value="">All Types</option>
          {EVIDENCE_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
        </select>
      </div>

      <div className="bg-[#0f1624] border border-white/07 rounded-lg overflow-hidden">
        {filtered.length === 0 ? <EmptyState icon={Package} title="No evidence found" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/06 bg-white/02">
                  {['Evidence ID', 'Case', 'Type', 'Description', 'Location', 'Status', 'Condition', 'Actions'].map(h => (
                    <th key={h} className="text-left text-slate-500 font-medium px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/04">
                {filtered.map(ev => (
                  <tr key={ev.id} className="hover:bg-white/02 transition-colors">
                    <td className="px-4 py-3 font-mono text-cyan-400 whitespace-nowrap">{ev.evidenceNumber}</td>
                    <td className="px-4 py-3 font-mono text-blue-400 whitespace-nowrap">{getCaseName(ev.caseId)}</td>
                    <td className="px-4 py-3 text-slate-400">{ev.type.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3 text-slate-300 max-w-[160px] truncate">{ev.description}</td>
                    <td className="px-4 py-3 text-slate-400 max-w-[120px] truncate">{ev.currentLocation}</td>
                    <td className="px-4 py-3"><EvidenceStatusBadge status={ev.status} /></td>
                    <td className="px-4 py-3"><ConditionBadge condition={ev.condition} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => setShowQR(ev)} className="p-1.5 rounded hover:bg-white/08 text-slate-400 hover:text-cyan-400 transition-colors" title="QR Code">
                          <QrCode size={13} />
                        </button>
                        <button onClick={() => setShowTransfer(ev)} className="p-1.5 rounded hover:bg-white/08 text-slate-400 hover:text-blue-400 transition-colors" title="Transfer">
                          <ArrowRightLeft size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QR Modal */}
      <Modal open={!!showQR} onClose={() => setShowQR(null)} title="Evidence QR Code" size="sm">
        {showQR && (
          <div className="p-6 flex flex-col items-center gap-4">
            <div className="p-4 bg-white rounded-lg">
              <QRCodeSVG value={JSON.stringify({ id: showQR.evidenceNumber, case: showQR.caseId, type: showQR.type, status: showQR.status })} size={160} />
            </div>
            <div className="w-full space-y-2 text-xs">
              {[
                ['Evidence ID', showQR.evidenceNumber],
                ['Case', getCaseName(showQR.caseId)],
                ['Type', showQR.type.replace(/_/g, ' ')],
                ['Status', showQR.status.replace(/_/g, ' ')],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1 border-b border-white/06">
                  <span className="text-slate-500">{k}</span>
                  <span className="text-slate-200 font-mono">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 w-full">
              <button className="flex-1 py-2 text-xs bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded border border-blue-500/20 transition-colors">Download QR</button>
              <button onClick={() => { showToast(`QR scan simulated: ${showQR.evidenceNumber}`, 'info'); setShowQR(null); }}
                className="flex-1 py-2 text-xs bg-white/05 hover:bg-white/08 text-slate-300 rounded border border-white/10 transition-colors">Simulate Scan</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Transfer Modal */}
      <Modal open={!!showTransfer} onClose={() => setShowTransfer(null)} title="Initiate Evidence Transfer" size="md">
        {showTransfer && (
          <div className="p-6 space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded p-3 text-xs text-amber-300">
              Transferring: <span className="font-mono font-medium">{showTransfer.evidenceNumber}</span>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Transfer To *</label>
              <select value={transferForm.toUserId} onChange={e => setTransferForm(f => ({ ...f, toUserId: e.target.value }))}
                className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50">
                <option value="">Select recipient…</option>
                {USERS.filter(u => u.id !== showTransfer.currentHolderId && u.status === 'ACTIVE').map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role.replace(/_/g, ' ')})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Destination Location</label>
              <input value={transferForm.toLocation} onChange={e => setTransferForm(f => ({ ...f, toLocation: e.target.value }))} placeholder="e.g. Forensic Lab Room 3"
                className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Purpose</label>
              <input value={transferForm.purpose} onChange={e => setTransferForm(f => ({ ...f, purpose: e.target.value }))} placeholder="Reason for transfer"
                className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Condition</label>
                <select value={transferForm.condition} onChange={e => setTransferForm(f => ({ ...f, condition: e.target.value as EvidenceCondition }))}
                  className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none">
                  {CONDITIONS.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Condition Remarks</label>
                <input value={transferForm.conditionRemarks} onChange={e => setTransferForm(f => ({ ...f, conditionRemarks: e.target.value }))} placeholder="Optional"
                  className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2 border-t border-white/06">
              <button onClick={() => setShowTransfer(null)} className="px-4 py-2 text-sm rounded border border-white/10 text-slate-300 hover:bg-white/05">Cancel</button>
              <button onClick={handleTransfer} className="px-4 py-2 text-sm rounded bg-blue-600 hover:bg-blue-500 text-white font-medium">Initiate Transfer</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Register Evidence Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Register New Evidence" size="lg">
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Case *</label>
              <select value={form.caseId} onChange={e => setForm(f => ({ ...f, caseId: e.target.value }))}
                className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none">
                <option value="">Select case…</option>
                {cases.map(c => <option key={c.id} value={c.id}>{c.caseNumber} – {c.title}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Evidence Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as EType }))}
                className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none">
                {EVIDENCE_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs text-slate-400 mb-1 block">Description *</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Evidence description"
                className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none resize-none" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Collection Date</label>
              <input type="datetime-local" value={form.collectionDate} onChange={e => setForm(f => ({ ...f, collectionDate: e.target.value }))}
                className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Collection Location</label>
              <input value={form.collectionLocation} onChange={e => setForm(f => ({ ...f, collectionLocation: e.target.value }))} placeholder="Scene location"
                className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Initial Condition</label>
              <select value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value as EvidenceCondition }))}
                className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none">
                {CONDITIONS.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Notes</label>
              <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Additional notes"
                className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none" />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-white/06">
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm rounded border border-white/10 text-slate-300 hover:bg-white/05">Cancel</button>
            <button onClick={handleCreate} className="px-4 py-2 text-sm rounded bg-blue-600 hover:bg-blue-500 text-white font-medium">Register Evidence</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
