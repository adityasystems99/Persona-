import React from 'react';
import { Bell, CheckCheck, Trash2, ShieldAlert, Sparkles, Clock, Target, CheckCircle2 } from 'lucide-react';
import { useDSA } from '../../context/DSAContext';
import { requestNotificationPermission, checkNotificationPermission } from '../../utils/notifications';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
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
        return <Sparkles className="text-rose-500" size={16} />;
      case 'reminder':
        return <Clock className="text-amber-500" size={16} />;
      case 'target':
        return <Target className="text-purple-500" size={16} />;
      case 'success':
        return <CheckCircle2 className="text-emerald-500" size={16} />;
      case 'milestone':
        return <Sparkles className="text-amber-500" size={16} />;
      case 'recovery':
        return <Clock className="text-rose-500" size={16} />;
      default:
        return <Bell className="text-blue-500" size={16} />;
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
    <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl shadow-soft-lg border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center space-x-2">
          <Bell size={16} className="text-slate-700" />
          <h3 className="font-bold text-slate-800 text-sm">Notifications & Reminders</h3>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={clearNotifications}
            className="text-xs text-slate-400 hover:text-rose-600 flex items-center space-x-1"
          >
            <Trash2 size={13} />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Browser Notification Banner if not granted */}
      {permission !== 'granted' && (
        <div className="p-3 bg-rose-50 border-b border-rose-100 flex items-start space-x-2.5">
          <ShieldAlert size={16} className="text-rose-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs">
            <p className="font-semibold text-rose-800">Browser alerts are not active</p>
            <p className="text-rose-600 mt-0.5">
              Enable browser notifications to receive hourly accountability alerts even if this tab is in the background.
            </p>
            <button
              onClick={handleEnableBrowserNotifications}
              className="mt-2 text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-700 px-3 py-1 rounded-md shadow-sm transition-all"
            >
              Grant Permission
            </button>
          </div>
        </div>
      )}

      {/* Notification list */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No notifications yet today. Keep coding!
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start space-x-3 ${
                !notif.read ? 'bg-rose-50/20' : ''
              }`}
            >
              <div className="p-2 rounded-xl bg-slate-100 flex-shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-xs font-bold text-slate-800 truncate">
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {formatTime(notif.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-snug">
                  {notif.message}
                </p>
              </div>
              {!notif.read && (
                <span className="w-2 h-2 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer info note about background limits */}
      <div className="p-2.5 bg-slate-50/60 border-t border-slate-100 text-center">
        <span className="text-[10px] text-slate-400">
          Reminders run while AlgoPulse is open in your browser • Active window: {settings.studyStartTime} - {settings.studyEndTime}
        </span>
      </div>
    </div>
  );
};
