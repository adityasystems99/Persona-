// Browser & In-App Notification Manager

export const checkNotificationPermission = (): NotificationPermission => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
};

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  try {
    return await Notification.requestPermission();
  } catch {
    return 'denied';
  }
};

export const isWithinStudyWindow = (startTime: string, endTime: string): boolean => {
  try {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const startMinutes = startH * 60 + (startM || 0);
    const endMinutes = endH * 60 + (endM || 0);

    if (startMinutes <= endMinutes) {
      return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    } else {
      // Overnight window (e.g. 21:00 to 02:00)
      return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
    }
  } catch {
    return true;
  }
};

export const dispatchSystemNotification = (
  title: string,
  options?: NotificationOptions
): boolean => {
  if (
    typeof window !== 'undefined' &&
    'Notification' in window &&
    Notification.permission === 'granted'
  ) {
    try {
      new Notification(title, {
        icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f43f5e"%3E%3Cpath d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/%3E%3C/svg%3E',
        badge: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f43f5e"%3E%3Ccircle cx="12" cy="12" r="10"/%3E%3C/svg%3E',
        ...options,
      });
      return true;
    } catch {
      return false;
    }
  }
  return false;
};
