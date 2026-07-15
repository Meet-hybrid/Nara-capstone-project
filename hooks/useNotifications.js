import { useState, useEffect, useCallback } from 'react';
import useNotificationStore from '../store/notificationStore';
import { getNotifications, markNotificationsRead } from '../services/memberService';

export function useNotifications() {
  const { notifications, unreadCount, setNotifications, markAllRead: clearAll } = useNotificationStore();
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    console.log('Fetching latest notifications');
    setIsLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data.data || data);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAll = useCallback(async () => {
    try {
      await markNotificationsRead();
      clearAll();
    } catch {
      // silent
    }
  }, []);

  useEffect(() => { refresh(); }, []);

  return { notifications, unreadCount, markAllRead: markAll, isLoading, refresh };
}
