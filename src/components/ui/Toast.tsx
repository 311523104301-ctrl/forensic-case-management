import { CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

export function Toast({ message, type }: ToastProps) {
  const configs = {
    success: { icon: CheckCircle, cls: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' },
    error: { icon: AlertCircle, cls: 'border-red-500/30 bg-red-500/10 text-red-300' },
    info: { icon: Info, cls: 'border-blue-500/30 bg-blue-500/10 text-blue-300' },
  };
  const { icon: Icon, cls } = configs[type];

  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm shadow-xl text-sm font-medium ${cls}`}>
      <Icon size={16} className="shrink-0" />
      {message}
    </div>
  );
}
