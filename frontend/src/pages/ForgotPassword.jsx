import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import api from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message || 'Check your inbox for reset steps.');
    } catch {
      setMessage('Could not process request right now. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f8fc] dark:bg-[#0a0e1a] px-6">
      <div className="card p-8 max-w-md w-full">
        <Link to="/login" className="text-sm text-blue-600 dark:text-blue-400 inline-flex items-center gap-1 mb-5">
          <ArrowLeft size={14} /> Back to login
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot password</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6">We will send reset instructions to your email.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input-base pl-icon" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
          </div>
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Sending...' : 'Send reset instructions'}</button>
        </form>
        {message && <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">{message}</p>}
      </div>
    </div>
  );
}
