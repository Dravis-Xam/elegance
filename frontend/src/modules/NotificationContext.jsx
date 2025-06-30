// src/modules/NotificationContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { formatTime, relativeTime } from '../utils/timeUtils';
import { toast } from './ToastStore';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

const socket = io(import.meta.env.VITE_BACKEND_URL, {withCredentials: true});

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    socket.on('connect', () => {
      setConnected(true);
      console.log('[Socket] Connected');
    });

    socket.on('disconnect', () => {
      setConnected(false);
      console.log('[Socket] Disconnected');
    });

    socket.on('new-notification', (data) => {
      const now = new Date();
      const newNotif = {
        id: crypto.randomUUID(),
        title: data.title,
        body: data.body,
        timestamp: now.toISOString(),
        read: false,
      };

      setNotifications((prev) => [newNotif, ...prev]);

      if (Notification.permission === 'granted') {
        const notification = new Notification(data.message, {
          body: `Click to view`,
          data: data,
        });

        notification.onclick = (e) => {
          if (e.target.data.type === 'New product') {
            window.open(`/search?q=${e.target.data.metadata.createdProduct._id}`, '_blank');
          }
           if (e.target.data.type === 'Maintenance') {
            toast.error(e.target.data.message);
          }
        };
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('new-notification');
    };
  }, []);

  const addNotification = (notif) => {
    const now = new Date();
    const newNotif = {
      id: crypto.randomUUID(),
      title: notif.title,
      body: notif.body,
      timestamp: now.toISOString(),
      read: false,
    };

    setNotifications((prev) => [newNotif, ...prev]);

    if (Notification.permission === 'granted') {
      new Notification(`Notification - ${now.toLocaleDateString()}`, {
        body: `${notif.body} - ${formatTime(now)}`,
        tag: `notif-${now.toDateString()}`,
      });
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAllAsRead, connected }}>
      {children}
    </NotificationContext.Provider>
  );
};
