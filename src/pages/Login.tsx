import { useState } from 'react';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const ok = await login(email, password);
    setLoading(false);
    if (!ok) setError('Invalid credentials. Please check your email and password.');
  };

  const fillDemo = (email: string, pass: string) => { setEmail(email); setPassword(pass); setError(''); };

  return (
    <div className="min-h-screen bg-[#080d16] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#0a1020] border-r border-white/07 p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <p className="text-base font-bold text-white tracking-wide">FCMP</p>
            <p className="text-xs text-slate-500 font-mono">Forensic Case Management Platform</p>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            Secure. Accountable.<br />Chain-of-Custody Ready.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Enterprise-grade forensic case management with tamper-evident audit trails, digital chain of custody, and role-based access control.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              { label: 'Active Cases', value: '9' },
              { label: 'Evidence Items', value: '12' },
              { label: 'Examinations', value: '4' },
              { label: 'Audit Events', value: '12+' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/04 border border-white/06 rounded-lg px-4 py-3">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-600">Version 2.4.1 · Build 2026.09.29 · Demo Build</p>
      </div>

      {/* Right panel – login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <p className="text-base font-bold text-white">FCMP</p>
          </div>

          <h1 className="text-xl font-bold text-white mb-1">Sign in</h1>
          <p className="text-sm text-slate-500 mb-7">Enter your credentials to access the system.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Email Address</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="you@fcm.local"
                className="w-full bg-white/05 border border-white/10 rounded-md px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 focus:bg-white/08 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  className="w-full bg-white/05 border border-white/10 rounded-md px-3 py-2.5 pr-10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 focus:bg-white/08 transition-colors"
                />
                <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="w-3.5 h-3.5 rounded accent-blue-500" />
                <span className="text-xs text-slate-400">Remember me</span>
              </label>
              <button type="button" className="text-xs text-blue-400 hover:text-blue-300">Forgot password?</button>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2.5 text-xs text-red-300">
                <AlertCircle size={14} className="shrink-0" /> {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-medium py-2.5 rounded-md text-sm transition-colors flex items-center justify-center gap-2">
              {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {loading ? 'Authenticating…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8">
            <p className="text-xs text-slate-600 mb-3 text-center">Demo accounts</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Admin', email: 'admin@fcm.local', pass: 'admin' },
                { label: 'Investigator', email: 'investigator@fcm.local', pass: 'investigator' },
                { label: 'Expert', email: 'expert@fcm.local', pass: 'expert' },
                { label: 'Supervisor', email: 'supervisor@fcm.local', pass: 'supervisor' },
              ].map(d => (
                <button key={d.label} onClick={() => fillDemo(d.email, d.pass)}
                  className="text-xs bg-white/04 hover:bg-white/08 border border-white/06 rounded px-2.5 py-2 text-slate-400 hover:text-slate-200 transition-colors text-left">
                  <span className="font-medium text-slate-300">{d.label}</span>
                  <br /><span className="text-slate-600 text-[10px]">{d.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
