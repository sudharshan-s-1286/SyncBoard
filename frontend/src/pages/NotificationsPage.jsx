import { useEffect, useState } from 'react';
import api from '../services/api';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  const load = async () => {
    const res = await api.get('/notifications');
    setNotifications(res.data);
  };

  useEffect(() => {
    api.get('/notifications').then((res) => setNotifications(res.data)).catch(() => {});
  }, []);

  const markRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        <button className="btn-ghost" onClick={async () => { await api.put('/notifications/read-all'); load(); }}>Mark all read</button>
      </div>
      <div className="card divide-y divide-black/5 dark:divide-white/5">
        {notifications.length === 0 && <p className="p-6 text-sm text-gray-500">No notifications.</p>}
        {notifications.map((n) => (
          <div key={n.id} className="p-4 flex justify-between items-start">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{n.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{n.message}</p>
            </div>
            {!n.read && <button className="btn-ghost text-xs" onClick={() => markRead(n.id)}>Mark read</button>}
          </div>
        ))}
      </div>
    </div>
  );
}
