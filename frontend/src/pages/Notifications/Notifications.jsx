import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Notifications.css'
import Footer from '../homepage/components/footer/Footer';
import Header from '../homepage/components/header/Header';
import { useNotifications } from '../../modules/NotificationContext';

const Notifications = () => {
    const navigate = useNavigate();
    const [read, setRead] = useState(false);
    document.title = "Notifications  |  DAOGROW";
    const { notifications, unreadCount, markAsRead } = useNotifications();

    // Group by date
  const grouped = notifications.reduce((acc, notif) => {
    const dateKey = new Date(notif.timestamp).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(notif);
    return acc;
  }, {});

    return (
        <div>
            <Header></Header>
            <div className="notifications-content">
                <h2>Notifications</h2>
                <small>{`${notifications.length > 0 ? `${notifications.filter((value) => !value.read).length} unread`  : 'No notifications yet'}`}</small>
                <div className="notification-list">
                    {Object.entries(grouped).map(([date, items]) => (
                        <div key={date} className="notification-day-group">
                        <h4>{date}</h4>
                        {items.map((notif) => (
                            <div key={notif.id} className={`notification ${notif.read ? 'read' : 'unread'}`}>
                            <strong>{notif.title}</strong>
                            <p>{notif.body}</p>
                            <small>{relativeTime(notif.timestamp)}</small>
                            </div>
                        ))}
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Notifications;
