import { FolderOpen, Package, FlaskConical, ClipboardList, AlertTriangle, Clock } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { KpiCard } from '../components/ui/KpiCard';
import { CaseStatusBadge, PriorityBadge } from '../components/ui/Badge';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { USERS } from '../data/demo';

const COLORS = ['#3b82f6', '#06b6d4', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6'];

const monthlyData = [
  { month: 'Apr', cases: 3, evidence: 8 },
  { month: 'May', cases: 5, evidence: 12 },
  { month: 'Jun', cases: 4, evidence: 10 },
  { month: 'Jul', cases: 7, evidence: 18 },
  { month: 'Aug', cases: 6, evidence: 15 },
  { month: 'Sep', cases: 10, evidence: 25 },
];

export function Dashboard() {
  const { cases, evidence, examinations, assignments, setPage } = useApp();
  const { currentUser } = useAuth();

  const activeCases = cases.filter(c => c.status !== 'CLOSED').length;
  const pendingExams = examinations.filter(e => ['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'].includes(e.status)).length;
  const pendingReviews = examinations.filter(e => e.status === 'UNDER_REVIEW').length;
  const overdueAssignments = assignments.filter(a => a.status === 'OVERDUE').length;

  const statusData = Object.entries(
    cases.reduce((acc, c) => { acc[c.status] = (acc[c.status] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }));

  const evidenceTypeData = Object.entries(
    evidence.reduce((acc, e) => { acc[e.type] = (acc[e.type] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }));

  const recentCases = [...cases].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);

  const pendingActions = [
    ...examinations.filter(e => e.status === 'ASSIGNED').map(e => ({ type: 'Examination', text: `EX ${e.examinationNumber} awaiting acceptance`, priority: 'HIGH', id: e.id })),
    ...examinations.filter(e => e.status === 'UNDER_REVIEW').map(e => ({ type: 'Review', text: `EX ${e.examinationNumber} awaiting supervisor review`, priority: 'MEDIUM', id: e.id })),
    ...assignments.filter(a => a.status === 'OVERDUE').map(a => ({ type: 'Overdue', text: `Assignment for ${a.evidenceId} is overdue`, priority: 'CRITICAL', id: a.id })),
  ].slice(0, 5);

  const recentActivity = [
    { time: '09:00', user: 'Admin User', action: 'Logged in', color: 'bg-blue-500' },
    { time: '08:00', user: 'Dr. Priya Rajan', action: 'Submitted findings for EX-2026-001', color: 'bg-cyan-500' },
    { time: 'Sep 28', user: 'Suresh Kumar', action: 'Approved Report RPT-2026-001', color: 'bg-emerald-500' },
    { time: 'Sep 27', user: 'Arjun Mehta', action: 'Generated case report for FC-2026-003', color: 'bg-amber-500' },
    { time: 'Sep 25', user: 'Arjun Mehta', action: 'Transferred EV-2026-0001 to Dr. Priya Rajan', color: 'bg-violet-500' },
  ];

  const getUserName = (id: string) => USERS.find(u => u.id === id)?.name || 'Unknown';

  const tooltipStyle = { backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '11px' };

  return (
    <div className="p-5 space-y-5 max-w-screen-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Welcome back, {currentUser?.name.split(' ')[0]}</h2>
          <p className="text-xs text-slate-500 mt-0.5">Here's your operational overview for today.</p>
        </div>
        <p className="text-xs text-slate-600 font-mono hidden sm:block">{new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <KpiCard label="Total Cases" value={cases.length} icon={FolderOpen} color="blue" />
        <KpiCard label="Active Cases" value={activeCases} icon={FolderOpen} color="cyan" />
        <KpiCard label="Pending Exams" value={pendingExams} icon={FlaskConical} color="amber" />
        <KpiCard label="Evidence Items" value={evidence.length} icon={Package} color="violet" />
        <KpiCard label="Pending Reviews" value={pendingReviews} icon={ClipboardList} color="emerald" />
        <KpiCard label="Overdue Tasks" value={overdueAssignments} icon={AlertTriangle} color="red" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly Activity */}
        <div className="lg:col-span-2 bg-[#0f1624] border border-white/07 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Monthly Case & Evidence Activity</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="cG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="eG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#94a3b8' }} itemStyle={{ color: '#e2e8f0' }} />
              <Area type="monotone" dataKey="cases" stroke="#3b82f6" fill="url(#cG)" name="Cases" strokeWidth={2} />
              <Area type="monotone" dataKey="evidence" stroke="#06b6d4" fill="url(#eG)" name="Evidence" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Evidence by type */}
        <div className="bg-[#0f1624] border border-white/07 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Evidence by Type</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={evidenceTypeData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2} dataKey="value">
                {evidenceTypeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#e2e8f0' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">
            {evidenceTypeData.slice(0, 4).map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-slate-400 truncate max-w-28">{d.name}</span>
                </div>
                <span className="text-slate-300 font-mono">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cases by status + Priority */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#0f1624] border border-white/07 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Cases by Status</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={statusData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} width={110} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#e2e8f0' }} />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 3, 3, 0]} name="Cases" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pending Actions */}
        <div className="bg-[#0f1624] border border-white/07 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Pending Actions</h3>
          {pendingActions.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No pending actions</p>
          ) : (
            <div className="space-y-2">
              {pendingActions.map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded bg-white/03 border border-white/05">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${a.priority === 'CRITICAL' ? 'bg-red-400' : a.priority === 'HIGH' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-300 truncate">{a.text}</p>
                    <p className="text-[10px] text-slate-600 mt-0.5 font-mono">{a.type}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent cases + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-[#0f1624] border border-white/07 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-200">Recent Cases</h3>
            <button onClick={() => setPage('cases')} className="text-xs text-blue-400 hover:text-blue-300">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/06">
                  {['Case ID', 'Title', 'Investigator', 'Status', 'Priority'].map(h => (
                    <th key={h} className="text-left text-slate-500 font-medium pb-2 pr-4 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/04">
                {recentCases.map(c => (
                  <tr key={c.id} className="hover:bg-white/02 cursor-pointer" onClick={() => setPage('case-detail', c.id)}>
                    <td className="py-2.5 pr-4 font-mono text-blue-400">{c.caseNumber}</td>
                    <td className="py-2.5 pr-4 text-slate-200 max-w-[180px] truncate">{c.title}</td>
                    <td className="py-2.5 pr-4 text-slate-400">{getUserName(c.investigatorId).split(' ')[0]}</td>
                    <td className="py-2.5 pr-4"><CaseStatusBadge status={c.status} /></td>
                    <td className="py-2.5"><PriorityBadge priority={c.priority} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#0f1624] border border-white/07 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${a.color}`} />
                <div className="min-w-0">
                  <p className="text-xs text-slate-300">{a.action}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{a.user} · {a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
