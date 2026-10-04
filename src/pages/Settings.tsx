import { useState } from 'react';
import { Bell, Lock, Monitor, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Settings() {
  const { showToast, resetDemoData, cases, evidence } = useApp();
  const [notifSettings, setNotifSettings] = useState({ emailNotifs: true, transferAlerts: true, deadlineReminders: true, integrityAlerts: true });
  const [secSettings, setSecSettings] = useState({ sessionTimeout: '30', requireMFA: false, auditLevel: 'FULL' });

  return (
    <div className="p-5 space-y-5 max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold text-white">System Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">FCMP platform configuration</p>
      </div>

      {/* System Info */}
      <div className="bg-[#0f1624] border border-white/07 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Monitor size={15} className="text-blue-400" />
          <h3 className="text-sm font-semibold text-slate-200">System Information</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {[
            ['Platform', 'FCMP v2.4.1'],
            ['Build', '2026.09.29'],
            ['Environment', 'Standalone Demo'],
            ['Database', 'Browser localStorage'],
            ['Total Cases', String(cases.length)],
            ['Total Evidence', String(evidence.length)],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-1.5 border-b border-white/04">
              <span className="text-slate-500">{k}</span>
              <span className="text-slate-200 font-mono text-[10px]">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-[#0f1624] border border-white/07 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={15} className="text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-200">Notification Settings</h3>
        </div>
        <div className="space-y-3">
          {[
            { key: 'emailNotifs', label: 'Email Notifications', desc: 'Receive system notifications via email' },
            { key: 'transferAlerts', label: 'Evidence Transfer Alerts', desc: 'Notify on evidence custody transfers' },
            { key: 'deadlineReminders', label: 'Deadline Reminders', desc: 'Remind about approaching examination deadlines' },
            { key: 'integrityAlerts', label: 'Integrity Verification Alerts', desc: 'Alert on chain-of-custody integrity events' },
          ].map(({ key, label, desc }) => (
            <label key={key} className="flex items-center justify-between cursor-pointer py-2 border-b border-white/04 last:border-0">
              <div>
                <p className="text-xs text-slate-200">{label}</p>
                <p className="text-[10px] text-slate-500">{desc}</p>
              </div>
              <button
                onClick={() => setNotifSettings(s => ({ ...s, [key]: !s[key as keyof typeof s] }))}
                className={`w-10 h-5 rounded-full transition-colors relative ${notifSettings[key as keyof typeof notifSettings] ? 'bg-blue-600' : 'bg-slate-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${notifSettings[key as keyof typeof notifSettings] ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </label>
          ))}
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-[#0f1624] border border-white/07 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Lock size={15} className="text-red-400" />
          <h3 className="text-sm font-semibold text-slate-200">Security Settings</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Session Timeout (minutes)</label>
            <select value={secSettings.sessionTimeout} onChange={e => setSecSettings(s => ({ ...s, sessionTimeout: e.target.value }))}
              className="bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none">
              {['15', '30', '60', '120'].map(v => <option key={v} value={v}>{v} minutes</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Audit Log Level</label>
            <select value={secSettings.auditLevel} onChange={e => setSecSettings(s => ({ ...s, auditLevel: e.target.value }))}
              className="bg-white/05 border border-white/10 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none">
              <option value="FULL">Full (All Events)</option>
              <option value="STANDARD">Standard (Key Events)</option>
              <option value="MINIMAL">Minimal (Errors Only)</option>
            </select>
          </div>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-xs text-slate-200">Require MFA</p>
              <p className="text-[10px] text-slate-500">Multi-factor authentication for all users</p>
            </div>
            <button
              onClick={() => setSecSettings(s => ({ ...s, requireMFA: !s.requireMFA }))}
              className={`w-10 h-5 rounded-full transition-colors relative ${secSettings.requireMFA ? 'bg-blue-600' : 'bg-slate-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${secSettings.requireMFA ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </label>
        </div>
      </div>

      <button onClick={() => showToast('Settings saved successfully.')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
        <Save size={14} /> Save Settings
      </button>

      <div className="bg-[#0f1624] border border-amber-500/15 rounded-lg p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Demo workspace</h3>
            <p className="text-[10px] text-slate-500 mt-1">Restore the seeded forensic cases, evidence, reports and notifications used by this standalone build.</p>
          </div>
          <button onClick={resetDemoData} className="shrink-0 px-3 py-2 rounded text-xs font-medium border border-amber-500/20 text-amber-300 hover:bg-amber-500/10">Restore demo data</button>
        </div>
      </div>
    </div>
  );
}
