import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: user?.name || '',
    username: user?.username || '',
    bio: user?.bio || '',
  });
  const [saved, setSaved] = useState('');

  const save = async () => {
    await api.put('/users/me', form);
    setSaved('Saved');
    setTimeout(() => setSaved(''), 1500);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
      <div className="card p-6 space-y-4 max-w-2xl">
        <input className="input-base" value={form.name} placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input-base" value={form.username} placeholder="Username" onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <textarea className="input-base" rows={4} value={form.bio} placeholder="Bio" onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        <div className="flex items-center gap-3">
          <button className="btn-primary" onClick={save}>Save profile</button>
          {saved && <span className="text-sm text-emerald-500">{saved}</span>}
        </div>
      </div>
    </div>
  );
}
