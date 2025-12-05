import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Temporary hardcoded credentials - replace with proper authentication
    // TODO: Implement proper authentication with backend
    if (username === 'admin' && password === 'outpost2025') {
      // Store auth token in localStorage
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_user', username);
      navigate('/admin/dashboard');
    } else {
      setError('Invalid username or password');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-2">
            OC
          </h1>
          <p className="text-white/60 text-sm">Admin Panel</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#2a2a2a] rounded-2xl p-8 shadow-2xl border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-white/80 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-10 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#78BE20] transition-colors"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-10 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#78BE20] transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#78BE20] hover:bg-[#6da71d] text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-white/40 text-xs text-center">
              Outpost Custom Admin Panel v1.0
            </p>
          </div>
        </div>

        {/* Temp credentials display (remove in production) */}
        <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-yellow-400 text-xs text-center">
            Dev Mode: admin / outpost2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
