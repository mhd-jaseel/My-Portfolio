import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Incorrect email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] flex items-center justify-center p-4 selection:bg-[#1683FF]/20 selection:text-[#1683FF] relative">
      
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md p-8 sm:p-10 rounded-2xl bg-white border border-[#dce7fa] shadow-md relative"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#f0f6ff] border border-[#dce7fa] text-[#1683FF] flex items-center justify-center mx-auto mb-3.5 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-[#1a1a1a] tracking-tight">Admin Sign In</h1>
          <p className="text-xs text-[#666666] mt-1">Sign in to manage your portfolio content and settings</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8a99ad] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@domain.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1683FF] transition-all placeholder:text-[#8a99ad]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8a99ad] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1683FF] transition-all placeholder:text-[#8a99ad]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#1683FF] hover:bg-[#1371dc] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-4 border-t border-[#dce7fa] text-center">
          <p className="text-[11px] text-[#8a99ad]">
            Secure session &bull; Mohammed Jaseel Portfolio Admin
          </p>
        </div>
      </motion.div>

    </div>
  );
};

export default AdminLoginPage;

