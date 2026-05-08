import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home, Users, FolderOpen, CheckSquare, Settings, Bell, User, MailOpen,
  X, Zap
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const navItems = [
  { name: 'Dashboard', icon: Home, path: '/dashboard' },
  { name: 'Teams', icon: Users, path: '/teams' },
  { name: 'Projects', icon: FolderOpen, path: '/projects' },
  { name: 'Tasks', icon: CheckSquare, path: '/tasks' },
  { name: 'Invites', icon: MailOpen, path: '/invitations' },
  { name: 'Notifications', icon: Bell, path: '/notifications' },
  { name: 'Profile', icon: User, path: '/profile' },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user } = useContext(AuthContext);

  return (
    <>
      {/* mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-60
        bg-white dark:bg-[#0a0e1a]
        border-r border-black/6 dark:border-white/6
        flex flex-col
        transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>

        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-black/5 dark:border-white/5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/30">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-base tracking-tight text-gray-900 dark:text-white">SyncBoard</span>
          </div>
          <button
            className="lg:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded"
            onClick={() => setIsOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-0.5">
          {navItems.map(({ name, icon: IconComp, path }) => (
            <NavLink
              key={name}
              to={path}
              className={({ isActive }) =>
                `nav-pill ${isActive ? 'active' : ''}`
              }
              onClick={() => setIsOpen(false)}
            >
              <IconComp size={17} className="shrink-0" />
              {name}
            </NavLink>
          ))}
        </nav>

        {/* User card at bottom */}
        <div className="px-3 py-4 border-t border-black/5 dark:border-white/5 shrink-0">
          <NavLink
            to="/settings"
            className={({ isActive }) => `nav-pill ${isActive ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <Settings size={17} className="shrink-0" />
            Settings
          </NavLink>

          <div className="mt-3 flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm shrink-0">
              {user?.name?.charAt(0) ?? 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
