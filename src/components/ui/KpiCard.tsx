import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: 'blue' | 'cyan' | 'amber' | 'emerald' | 'red' | 'violet';
  delta?: string;
  deltaUp?: boolean;
}

const colorMap = {
  blue: { icon: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  cyan: { icon: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  amber: { icon: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  red: { icon: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  violet: { icon: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
};

export function KpiCard({ label, value, icon: Icon, color, delta, deltaUp }: KpiCardProps) {
  const c = colorMap[color];
  return (
    <div className={`bg-[#0f1624] border ${c.border} rounded-lg p-5 flex items-start gap-4`}>
      <div className={`${c.bg} ${c.icon} p-2.5 rounded-lg shrink-0`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
        <p className="text-xs text-slate-400 mt-0.5">{label}</p>
        {delta && (
          <p className={`text-xs mt-1 font-medium ${deltaUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {deltaUp ? '↑' : '↓'} {delta}
          </p>
        )}
      </div>
    </div>
  );
}
