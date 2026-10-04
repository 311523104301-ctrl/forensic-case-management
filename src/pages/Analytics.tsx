import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useApp } from '../context/AppContext';

const COLORS = ['#3b82f6', '#06b6d4', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#f97316'];

const tooltipStyle = { backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '11px' };

export function Analytics() {
  const { cases, evidence, examinations, assignments } = useApp();

  const casesByStatus = Object.entries(
    cases.reduce((acc, c) => { acc[c.status] = (acc[c.status] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }));

  const casesByType = Object.entries(
    cases.reduce((acc, c) => { acc[c.type] = (acc[c.type] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }));

  const evidenceByType = Object.entries(
    evidence.reduce((acc, e) => { acc[e.type] = (acc[e.type] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }));

  const evidenceByStatus = Object.entries(
    evidence.reduce((acc, e) => { acc[e.status] = (acc[e.status] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }));

  const examsByStatus = Object.entries(
    examinations.reduce((acc, e) => { acc[e.status] = (acc[e.status] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }));

  const priorityDist = Object.entries(
    cases.reduce((acc, c) => { acc[c.priority] = (acc[c.priority] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const monthlyActivity = [
    { month: 'Apr', cases: 3, evidence: 8, exams: 2 },
    { month: 'May', cases: 5, evidence: 12, exams: 4 },
    { month: 'Jun', cases: 4, evidence: 10, exams: 3 },
    { month: 'Jul', cases: 7, evidence: 18, exams: 6 },
    { month: 'Aug', cases: 6, evidence: 15, exams: 5 },
    { month: 'Sep', cases: 10, evidence: 25, exams: 8 },
  ];

  const Chart = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-[#0f1624] border border-white/07 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">{title}</h3>
      {children}
    </div>
  );

  const kpis = [
    { label: 'Avg Case Duration', value: '18 days', sub: 'Open cases' },
    { label: 'Exam Completion Rate', value: '62.5%', sub: 'All time' },
    { label: 'Pending Assignments', value: assignments.filter(a => a.status === 'PENDING').length, sub: 'Unaccepted' },
    { label: 'Overdue Items', value: assignments.filter(a => a.status === 'OVERDUE').length, sub: 'Require attention' },
  ];

  return (
    <div className="p-5 space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-white">Analytics</h2>
        <p className="text-xs text-slate-500 mt-0.5">System-wide operational metrics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="bg-[#0f1624] border border-white/07 rounded-lg p-4">
            <p className="text-xl font-bold text-white tabular-nums">{k.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{k.label}</p>
            <p className="text-[10px] text-slate-600 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Chart title="Monthly Activity Trend">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#e2e8f0' }} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              <Line type="monotone" dataKey="cases" stroke="#3b82f6" strokeWidth={2} dot={false} name="Cases" />
              <Line type="monotone" dataKey="evidence" stroke="#06b6d4" strokeWidth={2} dot={false} name="Evidence" />
              <Line type="monotone" dataKey="exams" stroke="#10b981" strokeWidth={2} dot={false} name="Exams" />
            </LineChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Case Priority Distribution">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={priorityDist} cx="50%" cy="50%" outerRadius={70} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                {priorityDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Cases by Status">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={casesByStatus} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} width={120} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#e2e8f0' }} />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 3, 3, 0]} name="Cases" />
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Evidence by Type">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={evidenceByType}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" height={50} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#e2e8f0' }} />
              <Bar dataKey="value" fill="#06b6d4" radius={[3, 3, 0, 0]} name="Evidence" />
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Examination Workload">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={examsByStatus} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value">
                {examsByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '10px', color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Evidence Status Distribution">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={evidenceByStatus} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 9 }} width={110} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#e2e8f0' }} />
              <Bar dataKey="value" fill="#10b981" radius={[0, 3, 3, 0]} name="Evidence" />
            </BarChart>
          </ResponsiveContainer>
        </Chart>
      </div>
    </div>
  );
}
