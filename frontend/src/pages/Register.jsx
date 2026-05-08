import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, ArrowRight, Zap } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(form.name, form.email, form.password);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f7f8fc] dark:bg-[#0a0e1a]">

      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden items-end p-12 bg-gradient-to-br from-violet-600 to-blue-700">
        <div className="glow-blob w-80 h-80 bg-violet-400 opacity-30 -top-10 -right-10" />
        <div className="glow-blob w-60 h-60 bg-blue-400 opacity-20 bottom-10 left-20" />
        <div className="relative z-10 max-w-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-white font-bold tracking-tight">SyncBoard</span>
          </div>
          <h2 className="text-3xl font-bold text-white leading-snug mb-3">
            Built for teams that ship.
          </h2>
          <p className="text-violet-100/80 text-sm leading-relaxed">
            No fluff. Just tasks, timelines, and the people you work with — all in one place.
          </p>
        </div>
      </div>

      {/* Right form column */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-fade-up">

          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/30">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white tracking-tight">SyncBoard</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Create your account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Free forever — no credit card needed</p>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-800/40">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="reg-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Maya Patel"
                  className="input-base pl-icon"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Work email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="maya@company.com"
                  className="input-base pl-icon"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="reg-password"
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="6+ characters"
                  className="input-base pl-icon"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 mt-2 disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><UserPlus size={16} /> Create account</>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Already on SyncBoard?{' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-0.5">
              Sign in <ArrowRight size={12} />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
