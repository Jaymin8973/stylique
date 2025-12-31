import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthApi from '../services/authApi';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }
    try {
      setLoading(true);
      const res = await AuthApi.login({ email, password });
      console.log(res);
      localStorage.setItem('authToken', res.token);
      localStorage.setItem('authUser', JSON.stringify(res.user));
      navigate('/', { replace: true });
    } catch (err: any) {
      const apiErr = err?.response?.data?.error || err?.message || 'Login failed';
      setError(apiErr);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EAE6FF] via-white to-[#FDFBFF]">
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-gray-200 p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Seller Hub</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your dashboard</p>
        </div>
        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-gray-500">© {new Date().getFullYear()} Seller Hub. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;
