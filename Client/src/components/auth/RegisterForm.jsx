import  { useState } from 'react';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await authService.register({ name, email, password });
      toast.success('Identity node created successfully. Proceeding to authentication portal.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to sync identity profile to cloud.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-5">
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Full Identity Name</label>
        <input 
          type="text" required value={name} onChange={e => setName(e.target.value)}
          className="w-full bg-space-800 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-neon-purple font-mono"
          placeholder="Arjun Sharma"
        />
      </div>
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Primary Network Email</label>
        <input 
          type="email" required value={email} onChange={e => setEmail(e.target.value)}
          className="w-full bg-space-800 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-neon-purple font-mono"
          placeholder="arjun@travelmind.ai"
        />
      </div>
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Secure Passcode Segment</label>
        <input 
          type="password" required value={password} onChange={e => setPassword(e.target.value)}
          className="w-full bg-space-800 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-neon-purple font-mono"
          placeholder="••••••••••••"
        />
      </div>
      <motion.button 
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={submitting}
        className="w-full py-3 rounded-lg bg-gradient-to-r from-neon-blue to-neon-cyan text-white font-mono font-bold uppercase tracking-widest text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 cursor-pointer"
      >
        {submitting ? 'Constructing Block...' : 'Deploy Profile Signature'}
      </motion.button>
    </form>
  );
};

export default RegisterForm;