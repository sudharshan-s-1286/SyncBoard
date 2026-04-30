import { useEffect, useState } from 'react';
import api from '../services/api';

export default function InvitationsPage() {
  const [invites, setInvites] = useState([]);

  const load = async () => {
    const res = await api.get('/invitations/my');
    setInvites(res.data);
  };

  useEffect(() => {
    api.get('/invitations/my').then((res) => setInvites(res.data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invitations</h1>
      <div className="card divide-y divide-black/5 dark:divide-white/5">
        {invites.length === 0 && <p className="p-6 text-sm text-gray-500">No pending invitations.</p>}
        {invites.map((i) => (
          <div key={i.id} className="p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Team ID: {i.teamId}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Role: {i.role}</p>
            </div>
            <button className="btn-primary" onClick={async () => { await api.post(`/invitations/${i.id}/accept`); load(); }}>Accept</button>
          </div>
        ))}
      </div>
    </div>
  );
}
