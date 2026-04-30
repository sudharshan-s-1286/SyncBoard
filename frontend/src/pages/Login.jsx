import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, Zap } from 'lucide-react';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(credentials.email, credentials.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f7f8fc] dark:bg-[#0a0e1a]">

      {/* Left decorative panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden items-end p-12 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="glow-blob w-80 h-80 bg-blue-400 opacity-30 top-10 right-10" />
        <div className="glow-blob w-60 h-60 bg-violet-500 opacity-20 bottom-20 left-10" />
        <div className="relative z-10 max-w-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-white font-bold tracking-tight">SyncBoard</span>
          </div>
          <h2 className="text-3xl font-bold text-white leading-snug mb-3">
            Keep every project moving forward.
          </h2>
          <p className="text-blue-100/80 text-sm leading-relaxed">
            Tasks, comments, status updates — your whole team stays in sync without the noise.
          </p>
        </div>
      </div>

      {/* Right form column */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-fade-up">

          {/* mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/30">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white tracking-tight">SyncBoard</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Sign in to your workspace</p>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-800/40">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={credentials.email}
                  onChange={e => setCredentials({ ...credentials, email: e.target.value })}
                  placeholder="you@company.com"
                  className="input-base pl-10"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="login-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <Link to="/forgot-password" className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 font-medium">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="login-password"
                  type="password"
                  required
                  value={credentials.password}
                  onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-base pl-10"
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
                <><LogIn size={16} /> Sign in</>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-0.5">
              Create one <ArrowRight size={12} />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
