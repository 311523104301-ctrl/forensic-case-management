import { useState } from 'react';
import { Plus, Edit2, Power, KeyRound, Users as UsersIcon } from 'lucide-react';
import { Modal, ConfirmDialog } from '../components/ui/Modal';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import type { User, UserRole } from '../types';
import { USERS } from '../data/demo';

const ROLE_LABELS: Record<UserRole, string> = {
  ADMINISTRATOR: 'Administrator',
  INVESTIGATOR: 'Investigator',
  FORENSIC_EXPERT: 'Forensic Expert',
  LAB_TECHNICIAN: 'Lab Technician',
  SUPERVISOR: 'Supervisor',
};

const ROLE_COLORS: Record<UserRole, string> = {
  ADMINISTRATOR: 'text-red-400 bg-red-500/10',
  INVESTIGATOR: 'text-blue-400 bg-blue-500/10',
  FORENSIC_EXPERT: 'text-cyan-400 bg-cyan-500/10',
  LAB_TECHNICIAN: 'text-amber-400 bg-amber-500/10',
  SUPERVISOR: 'text-violet-400 bg-violet-500/10',
};

export function Users() {
  const { showToast } = useApp();
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>(USERS);
  const [showCreate, setShowCreate] = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState<User | null>(null);
  const [createForm, setCreateForm] = useState({ name: '', email: '', role: 'INVESTIGATOR' as UserRole, department: '' });

  if (currentUser?.role !== 'ADMINISTRATOR') {
    return <div className="p-5"><p className="text-sm text-slate-400">Access restricted to administrators.</p></div>;
  }

  const handleCreate = () => {
    if (!createForm.name || !createForm.email) return;
    const newUser: User = {
      id: `u${Date.now()}`, ...createForm, status: 'ACTIVE',
      lastLogin: 'Never', createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    showToast(`User ${createForm.name} created.`);
    setShowCreate(false);
    setCreateForm({ name: '', email: '', role: 'INVESTIGATOR', department: '' });
  };

  const handleToggleStatus = (user: User) => {
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : u));
    showToast(`User ${user.name} ${user.status === 'ACTIVE' ? 'deactivated' : 'activated'}.`);
    setDeactivateTarget(null);
  };

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Users & Roles</h2>
          <p className="text-xs text-slate-500 mt-0.5">{users.filter(u => u.status === 'ACTIVE').length} active users</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
          <Plus size={14} /> Add User
        </button>
      </div>

      <div className="bg-[#0f1624] border border-white/07 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/06 bg-white/02">
                {['Name', 'Email', 'Role', 'Department', 'Status', 'Last Login', 'Actions'].map(h => (
                  <th key={h} className="text-left text-slate-500 font-medium px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/04">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-white/02">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center text-xs font-bold text-blue-300 shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <span className="text-slate-200">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-[10px]">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${ROLE_COLORS[u.role]}`}>{ROLE_LABELS[u.role]}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{u.department}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${u.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-500'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-[10px]">{u.lastLogin === 'Never' ? 'Never' : new Date(u.lastLogin).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => showToast('User edit dialog opened.', 'info')} className="p-1.5 rounded hover:bg-white/08 text-slate-500 hover:text-slate-300" title="Edit">
                        <Edit2 size={12} />
                      </button>
                      <button onClick={() => showToast('Password reset email sent.', 'success')} className="p-1.5 rounded hover:bg-white/08 text-slate-500 hover:text-amber-400" title="Reset Password">
                        <KeyRound size={12} />
                      </button>
                      {u.id !== currentUser?.id && (
                        <button onClick={() => setDeactivateTarget(u)} className={`p-1.5 rounded hover:bg-white/08 ${u.status === 'ACTIVE' ? 'text-slate-500 hover:text-red-400' : 'text-slate-500 hover:text-emerald-400'}`} title={u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}>
                          <Power size={12} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={!!deactivateTarget} onClose={() => setDeactivateTarget(null)}
        onConfirm={() => deactivateTarget && handleToggleStatus(deactivateTarget)}
        title={deactivateTarget?.status === 'ACTIVE' ? 'Deactivate User' : 'Activate User'}
        message={`Are you sure you want to ${deactivateTarget?.status === 'ACTIVE' ? 'deactivate' : 'activate'} ${deactivateTarget?.name}?`}
        confirmLabel={deactivateTarget?.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
        destructive={deactivateTarget?.status === 'ACTIVE'}
      />

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add New User" size="md">
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Full Name *</label>
            <input value={createForm.name} onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name"
              className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Email *</label>
            <input type="email" value={createForm.email} onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))} placeholder="user@fcm.local"
              className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Role</label>
              <select value={createForm.role} onChange={e => setCreateForm(f => ({ ...f, role: e.target.value as UserRole }))}
                className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none">
                {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Department</label>
              <input value={createForm.department} onChange={e => setCreateForm(f => ({ ...f, department: e.target.value }))} placeholder="Department"
                className="w-full bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none" />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-white/06">
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm rounded border border-white/10 text-slate-300 hover:bg-white/05">Cancel</button>
            <button onClick={handleCreate} className="px-4 py-2 text-sm rounded bg-blue-600 hover:bg-blue-500 text-white font-medium">Create User</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
