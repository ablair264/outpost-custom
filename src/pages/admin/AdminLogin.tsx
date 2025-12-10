import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn(email, password);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error || 'Invalid email or password');
    }

    setLoading(false);
  };

  return (
    <div className="login-page min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0f1419 0%, #183028 50%, #1a2f23 100%)',
        }}
      />

      {/* Animated gradient overlay */}
      <div
        className="absolute inset-0 animate-gradient-shift"
        style={{
          background: `linear-gradient(
            45deg,
            rgba(15, 20, 25, 0.9) 0%,
            rgba(100, 167, 11, 0.15) 20%,
            rgba(24, 48, 40, 0.95) 40%,
            rgba(138, 211, 59, 0.1) 60%,
            rgba(30, 58, 47, 0.9) 80%,
            rgba(100, 167, 11, 0.1) 100%
          )`,
          backgroundSize: '300% 300%',
          animation: 'gradientShift 15s ease infinite',
        }}
      />

      {/* Radial gradient overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 30% 40%, rgba(100, 167, 11, 0.12) 0%, transparent 40%),
            radial-gradient(ellipse at 70% 60%, rgba(138, 211, 59, 0.08) 0%, transparent 50%)
          `,
          animation: 'gradientPulse 20s ease-in-out infinite',
        }}
      />

      {/* Floating accent element */}
      <div
        className="absolute top-[20%] right-[15%] w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(100, 167, 11, 0.1) 0%, rgba(100, 167, 11, 0.05) 50%, transparent 100%)',
          filter: 'blur(40px)',
          animation: 'gentleFloat 20s ease-in-out infinite',
        }}
      />

      {/* Login container */}
      <div className="relative z-10 w-full max-w-[400px] mx-4">
        {/* Login card */}
        <div
          className="rounded-2xl p-8 md:p-10 backdrop-blur-xl relative overflow-hidden"
          style={{
            background: 'rgba(24, 48, 40, 0.85)',
            border: '2px solid rgba(100, 167, 11, 0.3)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(100, 167, 11, 0.15)',
          }}
        >
          {/* Card glow effect */}
          <div
            className="absolute inset-[-1px] rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10"
            style={{
              background: 'linear-gradient(45deg, rgba(100, 167, 11, 0.2), transparent, rgba(100, 167, 11, 0.2))',
            }}
          />

          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-3">
              <img
                src="/images/outpost-logo.png"
                alt="Outpost Custom"
                className="h-14 w-auto brightness-110 drop-shadow-lg hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = document.getElementById('logo-fallback');
                  if (fallback) fallback.style.display = 'block';
                }}
              />
              <h1
                id="logo-fallback"
                className="hidden hearns-font text-3xl text-white"
              >
                Outpost Custom
              </h1>
            </div>
            <p className="neuzeit-font text-sm text-white/70 font-medium">
              Access your admin dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Error message */}
            {error && (
              <div
                className="flex items-center gap-3 p-4 rounded-xl mb-4 animate-slideIn"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="neuzeit-font text-sm text-red-400">{error}</span>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block embossing-font text-xs font-semibold text-white uppercase tracking-wide pl-1"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl px-12 py-4 neuzeit-font text-sm text-white placeholder:text-white/40 outline-none transition-all duration-300 min-h-[52px]"
                  style={{
                    background: 'rgba(31, 41, 55, 0.8)',
                    border: '2px solid transparent',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#64a70b';
                    e.target.style.boxShadow = '0 0 0 3px rgba(100, 167, 11, 0.1), 0 8px 25px rgba(0, 0, 0, 0.15)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'transparent';
                    e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block embossing-font text-xs font-semibold text-white uppercase tracking-wide pl-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl px-12 py-4 neuzeit-font text-sm text-white placeholder:text-white/40 outline-none transition-all duration-300 min-h-[52px]"
                  style={{
                    background: 'rgba(31, 41, 55, 0.8)',
                    border: '2px solid transparent',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#64a70b';
                    e.target.style.boxShadow = '0 0 0 3px rgba(100, 167, 11, 0.1), 0 8px 25px rgba(0, 0, 0, 0.15)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'transparent';
                    e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl neuzeit-font font-bold text-sm transition-all duration-300 min-h-[52px] relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #64a70b 0%, #578f09 100%)',
                color: '#ffffff',
                boxShadow: '0 8px 25px rgba(100, 167, 11, 0.3)',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(100, 167, 11, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(100, 167, 11, 0.3)';
              }}
            >
              {/* Shine effect */}
              <div
                className="absolute top-0 -left-full w-full h-full transition-all duration-500 group-hover:left-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                }}
              />

              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="neuzeit-font text-xs text-white/50">
              Need help? Contact your administrator for assistance.
            </p>
          </div>
        </div>

        {/* Version */}
        <p className="text-center mt-6 neuzeit-font text-xs text-white/30">
          Outpost Custom Admin v2.0
        </p>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes gradientPulse {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.1) rotate(180deg);
            opacity: 1;
          }
        }

        @keyframes gentleFloat {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.4;
          }
          33% {
            transform: translate(30px, -20px) scale(1.05);
            opacity: 0.6;
          }
          66% {
            transform: translate(-20px, 20px) scale(0.95);
            opacity: 0.3;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .login-page * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
