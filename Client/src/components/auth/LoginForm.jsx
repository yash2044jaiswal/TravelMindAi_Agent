import  { useState } from 'react';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await authService.login({ email, password });
      login(data.token, data.user || { email });
      toast.success('Token verified. Security context loaded.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authorization matrix rejected credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Access Email Address</label>
        <input 
          type="email" required value={email} onChange={e => setEmail(e.target.value)}
          className="w-full bg-space-800 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-neon-cyan font-mono"
          placeholder="operator@travelmind.ai"
        />
      </div>
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Cryptography Keys (Password)</label>
        <input 
          type="password" required value={password} onChange={e => setPassword(e.target.value)}
          className="w-full bg-space-800 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-neon-cyan font-mono"
          placeholder="••••••••••••"
        />
      </div>
      <motion.button 
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={submitting}
        className="w-full py-3 rounded-lg bg-gradient-to-r from-neon-purple to-neon-blue text-white font-mono font-bold uppercase tracking-widest text-sm hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] disabled:opacity-50 cursor-pointer"
      >
        {submitting ? 'Verifying Gateway...' : 'Establish Secure Connection'}
      </motion.button>
    </form>
  );
};

export default LoginForm;