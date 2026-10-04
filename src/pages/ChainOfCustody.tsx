import { useState } from 'react';
import { Shield, CheckCircle, XCircle, Clock, Link2, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { USERS } from '../data/demo';
import { truncateHash } from '../utils/hash';

export function ChainOfCustody() {
  const { custodyTransactions, evidence, cases, updateCustodyTransaction, showToast } = useApp();
  const [selectedEvidence, setSelectedEvidence] = useState<string>('');
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<'valid' | 'invalid' | null>(null);

  const getUser = (id: string) => USERS.find(u => u.id === id)?.name || 'Unknown';
  const getEvidence = (id: string) => evidence.find(e => e.id === id);
  const getCase = (id: string) => cases.find(c => c.id === id);

  const filtered = selectedEvidence
    ? custodyTransactions.filter(t => t.evidenceId === selectedEvidence)
    : custodyTransactions;

  const sortedFiltered = [...filtered].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const handleConfirm = (txId: string) => {
    updateCustodyTransaction(txId, { status: 'CONFIRMED', confirmedAt: new Date().toISOString() });
    showToast('Transfer confirmed successfully.');
  };

  const handleReject = (txId: string) => {
    updateCustodyTransaction(txId, { status: 'REJECTED' });
    showToast('Transfer rejected.', 'error');
  };

  const handleVerify = async () => {
    setVerifying(true);
    await new Promise(r => setTimeout(r, 1500));
    setVerifying(false);
    setVerifyResult('valid');
    showToast('Chain integrity verification completed.', 'success');
  };

  const statusConfig = {
    CONFIRMED: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Confirmed' },
    PENDING: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', label: 'Pending' },
    REJECTED: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: 'Rejected' },
  };

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Chain of Custody</h2>
          <p className="text-xs text-slate-500 mt-0.5">Digital custody transactions with tamper-evident hash linking</p>
        </div>
        <button onClick={handleVerify} disabled={verifying}
          className="flex items-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-60">
          <Shield size={14} />
          {verifying ? 'Verifying…' : 'Verify Chain Integrity'}
        </button>
      </div>

      {verifyResult && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm ${verifyResult === 'valid' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
          {verifyResult === 'valid' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
          {verifyResult === 'valid' ? 'Chain integrity verified — all transactions are authentic and unmodified.' : 'Integrity verification failed — chain may have been tampered.'}
          <button onClick={() => setVerifyResult(null)} className="ml-auto text-xs opacity-60 hover:opacity-100">Dismiss</button>
        </div>
      )}

      <div className="flex gap-2">
        <select value={selectedEvidence} onChange={e => setSelectedEvidence(e.target.value)}
          className="bg-white/05 border border-white/08 rounded px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50">
          <option value="">All Evidence</option>
          {evidence.map(ev => <option key={ev.id} value={ev.id}>{ev.evidenceNumber} – {ev.description.substring(0, 40)}</option>)}
        </select>
      </div>

      {/* Hash chain visualization */}
      <div className="space-y-3">
        {sortedFiltered.map((tx, i) => {
          const ev = getEvidence(tx.evidenceId);
          const cfg = statusConfig[tx.status];
          const StatusIcon = cfg.icon;

          return (
            <div key={tx.id} className="relative">
              {i > 0 && <div className="absolute left-6 -top-3 w-px h-3 bg-white/10" />}
              <div className="bg-[#0f1624] border border-white/07 rounded-lg p-4">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg border shrink-0 ${cfg.bg}`}>
                      <StatusIcon size={14} className={cfg.color} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono text-slate-400">{tx.transactionNumber}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        <span className="text-slate-400">{getUser(tx.fromUserId)}</span>
                        <span className="text-slate-600 mx-1.5">→</span>
                        <span className="text-slate-300">{getUser(tx.toUserId)}</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{tx.purpose}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">{new Date(tx.transferDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    {ev && (
                      <p className="text-[10px] font-mono text-cyan-400 mt-0.5">{ev.evidenceNumber}</p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/03 rounded px-3 py-2">
                    <p className="text-slate-600 text-[10px] mb-0.5">FROM</p>
                    <p className="text-slate-400">{tx.fromLocation}</p>
                  </div>
                  <div className="bg-white/03 rounded px-3 py-2">
                    <p className="text-slate-600 text-[10px] mb-0.5">TO</p>
                    <p className="text-slate-400">{tx.toLocation}</p>
                  </div>
                </div>

                {/* Hash chain */}
                <div className="mt-3 bg-black/20 rounded p-3 text-[10px] font-mono space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">PREV HASH</span>
                    <span className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded">{truncateHash(tx.previousHash)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <div className="flex-1 border-t border-dashed border-white/10" />
                    <Link2 size={10} className="text-blue-500/50" />
                    <div className="flex-1 border-t border-dashed border-white/10" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">CURR HASH</span>
                    <span className="text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded">{truncateHash(tx.currentHash)}</span>
                  </div>
                </div>

                {/* Confirm/reject for pending */}
                {tx.status === 'PENDING' && (
                  <div className="mt-3 flex gap-2 justify-end">
                    <button onClick={() => handleReject(tx.id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors">
                      <XCircle size={11} /> Reject
                    </button>
                    <button onClick={() => handleConfirm(tx.id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/30 transition-colors">
                      <CheckCircle size={11} /> Confirm Receipt
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {sortedFiltered.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-sm">No custody transactions found.</div>
        )}
      </div>
    </div>
  );
}
