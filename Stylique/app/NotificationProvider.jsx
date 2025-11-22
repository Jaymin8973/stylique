import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { createContext, useContext, useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

const NotificationContext = createContext({
  notifications: [],
  markAllRead: () => {},
  clearAll: () => {},
});

const STORAGE_KEY = 'stylique:notifications';

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setNotifications(parsed);
          }
        }
      } catch (e) {
        console.log('Failed to load notifications:', e?.message);
      }
    };

    loadNotifications();
  }, []);

  useEffect(() => {
    const saveNotifications = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
      } catch (e) {
        console.log('Failed to save notifications:', e?.message);
      }
    };

    saveNotifications();
  }, [notifications]);

  useEffect(() => {
    const handleIncoming = (notification) => {
      const content = notification.request?.content || {};
      const id = notification.request?.identifier || `${Date.now()}`;

      const item = {
        id,
        title: content.title || 'Notification',
        body: content.body || '',
        data: content.data || {},
        receivedAt: new Date().toISOString(),
        read: false,
      };

      setNotifications((prev) => [item, ...prev]);

      // Show in-app preview toast at top center
      Toast.show({
        type: 'info',
        text1: item.title,
        text2: item.body,
        position: 'top',
      });
    };

    const receivedSubscription = Notifications.addNotificationReceivedListener(handleIncoming);

    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const notif = response.notification;
      const id = notif.request?.identifier;
      const content = notif.request?.content || {};

      setNotifications((prev) => {
        const exists = prev.some((n) => n.id === id);
        let next = prev;
        if (!exists) {
          const item = {
            id: id || `${Date.now()}`,
            title: content.title || 'Notification',
            body: content.body || '',
            data: content.data || {},
            receivedAt: new Date().toISOString(),
            read: false,
          };
          next = [item, ...prev];
        }
        return next.map((n) => (n.id === id ? { ...n, read: true } : n));
      });
    });

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
    AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <NotificationContext.Provider value={{ notifications, markAllRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
