import { useState, useContext } from 'react';
import { Moon, Sun, Bell, Menu, LogOut, Search } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import api from '../services/api';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ setSidebarOpen }) {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;
    api.get('/notifications').then((res) => setNotifications(res.data.slice(0, 5))).catch(() => {});
  }, [user, showNotifications]);

  return (
    <header className="nav-floating sticky top-0 z-30 h-16">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">

        {/* Left: hamburger + search */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            className="lg:hidden p-2 -ml-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-black/5 dark:hover:bg-white/8 transition-colors"
            onClick={() => setSidebarOpen(v => !v)}
          >
            <Menu size={20} />
          </button>

          {/* command-palette style search */}
          <div className="relative hidden sm:flex items-center w-64 group">
            <Search size={15} className="absolute left-3 text-gray-400 pointer-events-none" />
            <input
              id="global-search"
              type="search"
              placeholder="Search…"
              className="input-base pl-9 pr-14 py-2 text-sm w-full"
            />
            <kbd className="absolute right-3 pointer-events-none hidden sm:inline-flex items-center gap-1 text-[10px] font-medium text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 border border-black/8 dark:border-white/8 rounded px-1.5 py-0.5">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/8 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="relative">
            <button
              id="notifications-toggle"
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2 rounded-lg transition-colors ${
                showNotifications 
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/8'
              }`}
              title="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500 ring-1 ring-white dark:ring-[#0d1120]" />
            </button>

            {/* Notification Dropdown Menu */}
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#0d1120] rounded-2xl shadow-2xl border border-black/5 dark:border-white/5 z-50 animate-fade-up overflow-hidden">
                  <div className="p-4 border-b border-black/5 dark:border-white/5 bg-gray-50/50 dark:bg-white/3 flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-gray-500">Activity Log</span>
                    <button className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline">Mark all read</button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.map((n, i) => (
                      <div key={i} className="content-pill-full p-4 border-b border-black/3 dark:border-white/3 last:border-0 hover:bg-gray-50 dark:hover:bg-white/3 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-[11px] font-black uppercase tracking-tight text-gray-900 dark:text-white group-hover:text-blue-500">{n.title}</p>
                          <span className="text-[10px] font-bold text-gray-400">{new Date(n.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{n.message}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-white/3 text-center">
                     <Link to="/notifications" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">View All History</Link>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="w-px h-5 bg-black/8 dark:bg-white/8 mx-1" />

          <div className="flex items-center gap-2.5 pl-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
              {user?.name?.charAt(0) ?? 'U'}
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200 truncate max-w-[120px]">
              {user?.name}
            </span>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
