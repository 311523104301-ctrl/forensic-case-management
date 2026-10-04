import type { CaseStatus, CasePriority, EvidenceStatus, EvidenceCondition, ExamStatus } from '../../types';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'muted' | 'purple';

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/20',
  warning: 'bg-amber-500/15 text-amber-400 ring-amber-500/20',
  danger: 'bg-red-500/15 text-red-400 ring-red-500/20',
  info: 'bg-cyan-500/15 text-cyan-400 ring-cyan-500/20',
  muted: 'bg-slate-500/15 text-slate-400 ring-slate-500/20',
  purple: 'bg-violet-500/15 text-violet-400 ring-violet-500/20',
};

export function Badge({ variant, children, size = 'sm' }: { variant: BadgeVariant; children: React.ReactNode; size?: 'xs' | 'sm' }) {
  const sz = size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs';
  return (
    <span className={`inline-flex items-center font-medium ring-1 ring-inset rounded ${sz} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}

export function CaseStatusBadge({ status }: { status: CaseStatus }) {
  const map: Record<CaseStatus, [BadgeVariant, string]> = {
    REGISTERED: ['muted', 'Registered'],
    UNDER_INVESTIGATION: ['info', 'Under Investigation'],
    EVIDENCE_COLLECTION: ['warning', 'Evidence Collection'],
    LABORATORY_ANALYSIS: ['purple', 'Lab Analysis'],
    EXPERT_REVIEW: ['warning', 'Expert Review'],
    REPORT_PREPARATION: ['info', 'Report Prep'],
    CLOSED: ['success', 'Closed'],
  };
  const [variant, label] = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function PriorityBadge({ priority }: { priority: CasePriority }) {
  const map: Record<CasePriority, [BadgeVariant, string]> = {
    LOW: ['success', 'Low'],
    MEDIUM: ['warning', 'Medium'],
    HIGH: ['danger', 'High'],
    CRITICAL: ['danger', '⚠ Critical'],
  };
  const [variant, label] = map[priority];
  return <Badge variant={variant}>{label}</Badge>;
}

export function EvidenceStatusBadge({ status }: { status: EvidenceStatus }) {
  const map: Record<EvidenceStatus, [BadgeVariant, string]> = {
    REGISTERED: ['muted', 'Registered'],
    STORED: ['info', 'Stored'],
    ASSIGNED: ['warning', 'Assigned'],
    IN_TRANSIT: ['warning', 'In Transit'],
    UNDER_EXAMINATION: ['purple', 'Under Exam'],
    EXAMINATION_COMPLETED: ['success', 'Exam Completed'],
    RETURNED: ['success', 'Returned'],
    ARCHIVED: ['muted', 'Archived'],
  };
  const [variant, label] = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function ConditionBadge({ condition }: { condition: EvidenceCondition }) {
  const map: Record<EvidenceCondition, [BadgeVariant, string]> = {
    SEALED: ['success', 'Sealed'],
    SEAL_INTACT: ['success', 'Seal Intact'],
    OPENED_FOR_EXAMINATION: ['warning', 'Opened'],
    DAMAGED: ['danger', 'Damaged'],
    TAMPERED: ['danger', '⚠ Tampered'],
    WET: ['warning', 'Wet'],
    BROKEN: ['danger', 'Broken'],
    OTHER: ['muted', 'Other'],
  };
  const [variant, label] = map[condition];
  return <Badge variant={variant}>{label}</Badge>;
}

export function ExamStatusBadge({ status }: { status: ExamStatus }) {
  const map: Record<ExamStatus, [BadgeVariant, string]> = {
    ASSIGNED: ['muted', 'Assigned'],
    ACCEPTED: ['info', 'Accepted'],
    IN_PROGRESS: ['warning', 'In Progress'],
    COMPLETED: ['success', 'Completed'],
    UNDER_REVIEW: ['purple', 'Under Review'],
    APPROVED: ['success', 'Approved'],
  };
  const [variant, label] = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}
