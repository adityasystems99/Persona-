import React from 'react';
import { Bell, Trash2, ShieldAlert, Sparkles, Clock, Target, CheckCircle2 } from 'lucide-react';
import { useDSA } from '../../context/DSAContext';
import { requestNotificationPermission, checkNotificationPermission } from '../../utils/notifications';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen }) => {
  const { notifications, markNotificationRead, clearNotifications, updateSettings, settings } = useDSA();
  const permission = checkNotificationPermission();

  if (!isOpen) return null;

  const handleEnableBrowserNotifications = async () => {
    const res = await requestNotificationPermission();
    if (res === 'granted') {
      updateSettings({ browserNotificationsEnabled: true });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'stl':
        return <Sparkles className="text-violet-400" size={16} />;
      case 'reminder':
        return <Clock className="text-amber-400" size={16} />;
      case 'target':
        return <Target className="text-purple-400" size={16} />;
      case 'success':
        return <CheckCircle2 className="text-emerald-400" size={16} />;
      case 'milestone':
        return <Sparkles className="text-amber-400" size={16} />;
      case 'recovery':
        return <Clock className="text-violet-400" size={16} />;
      default:
        return <Bell className="text-indigo-400" size={16} />;
    }
  };

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="absolute right-0 top-12 w-80 sm:w-96 bg-[#12142e] rounded-2xl shadow-glass-panel border border-violet-500/30 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-white">
      {/* Header */}
      <div className="p-4 border-b border-violet-900/40 flex items-center justify-between bg-[#0b0c1e]/80">
        <div className="flex items-center space-x-2">
          <Bell size={16} className="text-violet-300" />
          <h3 className="font-bold text-white text-sm">Station Transmissions</h3>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={clearNotifications}
            className="text-xs text-slate-400 hover:text-violet-300 flex items-center space-x-1"
          >
            <Trash2 size={13} />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Browser Notification Banner if not granted */}
      {permission !== 'granted' && (
        <div className="p-3 bg-violet-950/60 border-b border-violet-800/40 flex items-start space-x-2.5">
          <ShieldAlert size={16} className="text-violet-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs">
            <p className="font-semibold text-violet-200">Browser alerts inactive</p>
            <p className="text-slate-300 mt-0.5">
              Enable browser notifications to receive hourly accountability check-ins in the background.
            </p>
            <button
              onClick={handleEnableBrowserNotifications}
              className="mt-2 text-[11px] font-bold text-white gradient-violet shadow-glow-violet px-3 py-1 rounded-md transition-all"
            >
              Grant Permission
            </button>
          </div>
        </div>
      )}

      {/* Notification list */}
      <div className="max-h-80 overflow-y-auto divide-y divide-violet-900/20">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No transmissions received yet. Continue mission!
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={`p-3.5 hover:bg-violet-950/30 transition-colors cursor-pointer flex items-start space-x-3 ${
                !notif.read ? 'bg-violet-950/20' : ''
              }`}
            >
              <div className="p-2 rounded-xl bg-[#0b0c1e] border border-violet-500/20 flex-shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-xs font-bold text-white truncate">
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {formatTime(notif.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-snug">
                  {notif.message}
                </p>
              </div>
              {!notif.read && (
                <span className="w-2 h-2 rounded-full bg-violet-500 shadow-glow-violet mt-2 flex-shrink-0" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-[#0b0c1e]/70 border-t border-violet-900/30 text-center">
        <span className="text-[10px] text-slate-400">
          AlgoPulse Active Window: {settings.studyStartTime} - {settings.studyEndTime}
        </span>
      </div>
    </div>
  );
};
