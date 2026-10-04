import { useState } from 'react';
import { FileText, Upload, Download, Trash2, Eye } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Modal, ConfirmDialog } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { USERS } from '../data/demo';
import type { Document } from '../types';

const TYPE_COLORS: Record<string, string> = {
  CASE_REPORT: 'bg-blue-500/10 text-blue-400',
  EVIDENCE_PHOTO: 'bg-cyan-500/10 text-cyan-400',
  LAB_REPORT: 'bg-violet-500/10 text-violet-400',
  EXAM_REPORT: 'bg-emerald-500/10 text-emerald-400',
  SUPPORTING: 'bg-amber-500/10 text-amber-400',
  OTHER: 'bg-slate-500/10 text-slate-400',
};

export function Documents() {
  const { documents, cases, showToast } = useApp();
  const { currentUser } = useAuth();
  const [filterCase, setFilterCase] = useState('');
  const [filterType, setFilterType] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<Document | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadForm, setUploadForm] = useState({ name: '', type: 'SUPPORTING', caseId: '', description: '' });
  const [dragging, setDragging] = useState(false);

  const filtered = documents.filter(d =>
    (!filterCase || d.caseId === filterCase)
    && (!filterType || d.type === filterType)
    && d.status === 'ACTIVE'
  );

  const getUser = (id: string) => USERS.find(u => u.id === id)?.name || 'Unknown';
  const getCaseName = (id?: string) => id ? cases.find(c => c.id === id)?.caseNumber || '–' : '–';

  const handleUpload = () => {
    if (!uploadForm.name) return;
    showToast(`Document "${uploadForm.name}" uploaded successfully.`);
    setShowUpload(false);
    setUploadForm({ name: '', type: 'SUPPORTING', caseId: '', description: '' });
  };

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Documents</h2>
          <p className="text-xs text-slate-500 mt-0.5">{filtered.length} documents</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
          <Upload size={14} /> Upload Document
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <select value={filterCase} onChange={e => setFilterCase(e.target.value)}
          className="bg-white/05 border border-white/08 rounded px-3 py-1.5 text-sm text-slate-300 focus:outline-none">
          <option value="">All Cases</option>
          {cases.map(c => <option key={c.id} value={c.id}>{c.caseNumber}</option>)}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          className="bg-white/05 border border-white/08 rounded px-3 py-1.5 text-sm text-slate-300 focus:outline-none">
          <option value="">All Types</option>
          {Object.keys(TYPE_COLORS).map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
        </select>
      </div>

      <div className="bg-[#0f1624] border border-white/07 rounded-lg overflow-hidden">
        {filtered.length === 0 ? <EmptyState icon={FileText} title="No documents found" /> : (
          <div className="divide-y divide-white/04">
            {filtered.map(doc => (
              <div key={doc.id} className="flex items-center gap-4 px-4 py-3 hover:bg-white/02 transition-colors">
                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center shrink-0">
                  <FileText size={14} className="text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-200 truncate">{doc.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {getUser(doc.uploadedById)} · {new Date(doc.uploadedAt).toLocaleDateString('en-IN')} · {doc.fileSize} · v{doc.version}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${TYPE_COLORS[doc.type]}`}>
                    {doc.type.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs font-mono text-blue-400">{getCaseName(doc.caseId)}</span>
                  <div className="flex gap-1 ml-2">
                    <button onClick={() => showToast('Document preview opened.', 'info')} className="p-1.5 rounded hover:bg-white/08 text-slate-500 hover:text-slate-300"><Eye size={13} /></button>
                    <button onClick={() => showToast('Download started.', 'info')} className="p-1.5 rounded hover:bg-white/08 text-slate-500 hover:text-slate-300"><Download size={13} /></button>
                    {(currentUser?.role === 'ADMINISTRATOR' || doc.uploadedById === currentUser?.id) && (
                      <button onClick={() => setDeleteConfirm(doc)} className="p-1.5 rounded hover:bg-red-500/10 text-slate-500 hover:text-red-400"><Trash2 size={13} /></button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}
        onConfirm={() => { showToast('Document deleted.', 'error'); setDeleteConfirm(null); }}
        title="Delete Document" message={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
        confirmLabel="Delete" destructive
      />

      <Modal open={showUpload} onClose={() => setShowUpload(false)} title="Upload Document" size="md">
        <div className="p-6 space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragging ? 'border-blue-500/50 bg-blue-500/05' : 'border-white/10 hover:border-white/20'}`}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const file = e.dataTransfer.files[0]; if (file) setUploadForm(f => ({ ...f, name: file.name })); }}
          >
            <Upload size={20} className="mx-auto text-slate-500 mb-2" />
            <p className="text-xs text-slate-400">Drag & drop files here or <button className="text-blue-400 underline">browse</button></p>
            <p className="text-[10px] text-slate-600 mt-1">PDF, DOCX, XLSX, ZIP · Max 50 MB</p>
          </div>
          {uploadForm.name && <p className="text-xs text-slate-300 text-center">Selected: {uploadForm.name}</p>}
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Document Name</label>
            <input value={uploadForm.name} onChange={e => setUploadForm(f => ({ ...f, name: e.target.value }))} placeholder="Document filename"
              className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Type</label>
              <select value={uploadForm.type} onChange={e => setUploadForm(f => ({ ...f, type: e.target.value }))}
                className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none">
                {Object.keys(TYPE_COLORS).map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Related Case</label>
              <select value={uploadForm.caseId} onChange={e => setUploadForm(f => ({ ...f, caseId: e.target.value }))}
                className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none">
                <option value="">Select case…</option>
                {cases.map(c => <option key={c.id} value={c.id}>{c.caseNumber}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-white/06">
            <button onClick={() => setShowUpload(false)} className="px-4 py-2 text-sm rounded border border-white/10 text-slate-300 hover:bg-white/05">Cancel</button>
            <button onClick={handleUpload} className="px-4 py-2 text-sm rounded bg-blue-600 hover:bg-blue-500 text-white font-medium">Upload</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
