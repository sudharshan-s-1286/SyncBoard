import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import api from '../services/api';
import { 
  User, Bell, Shield, Palette, 
  Moon, Sun, Lock, Save, 
  Trash2, Mail, BadgeCheck
} from 'lucide-react';

export default function Settings() {
  const { user, refreshUser } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({ name: user?.name || '', username: user?.username || '', bio: user?.bio || '' });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '' });
  const [prefs, setPrefs] = useState({
    emailNotifications: user?.emailNotifications ?? true,
    pushNotifications: user?.pushNotifications ?? true,
    profilePublic: user?.profilePublic ?? true,
  });

  const tabs = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'account', icon: Lock, label: 'Account' },
    { id: 'appearance', icon: Palette, label: 'Appearance' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Workspace Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your persona and workspace preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10 items-start">
        {/* Sidebar Tabs */}
        <nav className="flex flex-col gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
          <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5">
            <button className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all w-full">
              <Trash2 size={18} />
              Delete Account
            </button>
          </div>
        </nav>

        {/* Content Area */}
        <div className="space-y-8 max-w-2xl">
          
          {activeTab === 'profile' && (
            <div className="card p-8 animate-fade-up">
              <div className="flex items-center gap-6 mb-10">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {user?.name?.charAt(0) ?? 'U'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {user?.name}
                    <BadgeCheck size={18} className="text-blue-500" />
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                  <button className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-2 uppercase tracking-widest hover:underline">
                    Change Avatar
                  </button>
                </div>
              </div>

              <form className="space-y-6" onSubmit={async (e) => {
                e.preventDefault();
                await api.put('/users/me', profile);
                await refreshUser();
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Display Name</label>
                    <input type="text" className="input-base" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Username</label>
                    <input type="text" className="input-base" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} placeholder="@mayapatel" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Biography</label>
                  <textarea rows={4} className="input-base resize-none" value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="Software Engineer at SyncBoard. Lover of clean code and team syncs." />
                </div>

                <div className="pt-4 border-t border-black/5 dark:border-white/5 flex justify-end">
                  <button type="submit" className="btn-primary gap-2">
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="card p-8 animate-fade-up space-y-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Interface Theme</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred visual mode for SyncBoard.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => theme !== 'light' && toggleTheme()}
                  className={`flex flex-col gap-3 p-4 rounded-2xl border-2 transition-all text-left ${theme === 'light' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-transparent bg-gray-50 dark:bg-white/3'}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-amber-500">
                    <Sun size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">Light Mode</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Classic high-contrast view.</p>
                  </div>
                </button>

                <button 
                  onClick={() => theme !== 'dark' && toggleTheme()}
                  className={`flex flex-col gap-3 p-4 rounded-2xl border-2 transition-all text-left ${theme === 'dark' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-transparent bg-gray-50 dark:bg-white/3'}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center shadow-sm text-indigo-400">
                    <Moon size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">Dark Mode</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Gentle on the eyes, deep aesthetic.</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="card p-8 animate-fade-up space-y-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Change Password</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ensure your workspace stays secure with regular updates.</p>
              </div>

              <form className="space-y-5" onSubmit={async (e) => {
                e.preventDefault();
                await api.put('/users/me/password', password);
                setPassword({ currentPassword: '', newPassword: '' });
              }}>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -track-y-1/2 mt-3.5 text-gray-400" />
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Current Password</label>
                  <input type="password" placeholder="••••••••" className="input-base pl-icon" value={password.currentPassword} onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })} />
                </div>
                <div className="relative">
                   <Lock size={16} className="absolute left-3 top-1/2 -track-y-1/2 mt-3.5 text-gray-400" />
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">New Password</label>
                  <input type="password" placeholder="••••••••" className="input-base pl-icon" value={password.newPassword} onChange={(e) => setPassword({ ...password, newPassword: e.target.value })} />
                </div>
                <button type="submit" className="btn-primary mt-2">Update Password</button>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card p-8 animate-fade-up space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Notification Preferences</h3>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Email notifications</span>
                <input type="checkbox" checked={prefs.emailNotifications} onChange={(e) => setPrefs({ ...prefs, emailNotifications: e.target.checked })} />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Push notifications</span>
                <input type="checkbox" checked={prefs.pushNotifications} onChange={(e) => setPrefs({ ...prefs, pushNotifications: e.target.checked })} />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Public profile</span>
                <input type="checkbox" checked={prefs.profilePublic} onChange={(e) => setPrefs({ ...prefs, profilePublic: e.target.checked })} />
              </label>
              <button className="btn-primary" onClick={async () => { await api.put('/users/me/preferences', prefs); await refreshUser(); }}>
                Save notification preferences
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
