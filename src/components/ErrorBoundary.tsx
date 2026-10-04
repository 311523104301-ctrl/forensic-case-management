import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props { children: ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('FCMP render error', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-screen bg-[#080d16] text-slate-200 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#0f1624] border border-white/10 rounded-xl p-6 text-center">
          <div className="mx-auto mb-4 w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
            <AlertTriangle size={20} className="text-amber-400" />
          </div>
          <h1 className="text-lg font-semibold text-white">Something went wrong</h1>
          <p className="text-sm text-slate-500 mt-2">The application could not render this view. Reload the workspace to continue.</p>
          <button onClick={() => window.location.reload()} className="mt-5 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium">
            <RotateCcw size={14} /> Reload application
          </button>
        </div>
      </div>
    );
  }
}
