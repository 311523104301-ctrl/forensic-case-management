import { Bell, CheckCheck, Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const TYPE_CONFIG = {
  INFO: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  WARNING: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  SUCCESS: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  ALERT: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
};

export function Notifications() {
  const { notifications, markNotificationRead } = useApp();
  const { currentUser } = useAuth();

  const myNotifications = notifications.filter(n => !currentUser || n.userId === currentUser.id || currentUser.role === 'ADMINISTRATOR');
  const unread = myNotifications.filter(n => !n.read).length;

  const markAllRead = () => myNotifications.filter(n => !n.read).forEach(n => markNotificationRead(n.id));

  return (
    <div className="p-5 space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Notifications</h2>
          <p className="text-xs text-slate-500 mt-0.5">{unread} unread · {myNotifications.length} total</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300">
            <CheckCheck size={13} /> Mark all read
          </button>
        )}
      </div>

      <div className="space-y-2">
        {myNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell size={28} className="mx-auto text-slate-600 mb-3" />
            <p className="text-sm text-slate-500">No notifications</p>
          </div>
        ) : myNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(n => {
          const cfg = TYPE_CONFIG[n.type];
          const Icon = cfg.icon;
          return (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`flex items-start gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-opacity ${n.read ? 'opacity-50' : ''} ${cfg.bg}`}
            >
              <Icon size={15} className={`${cfg.color} mt-0.5 shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium ${n.read ? 'text-slate-400' : 'text-white'}`}>{n.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>
                <p className="text-[10px] text-slate-600 mt-1">{new Date(n.createdAt).toLocaleString('en-IN')}</p>
              </div>
              {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 shrink-0" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
