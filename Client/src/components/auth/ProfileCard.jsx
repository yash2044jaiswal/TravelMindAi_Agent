import  { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';
import { FiEdit2, FiShield } from 'react-icons/fi';

const ProfileCard = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [editing, setEditing] = useState(false);

  const handleUpdate = async () => {
    try {
      const res = await authService.updateProfile({ name });
      setUser(prev => ({ ...prev, name: res.name || name }));
      setEditing(false);
      toast.success('Identity matrix credentials updated.');
    } catch (err) {
        console.log(err);
        
      toast.error('Identity change compilation failed.');
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-3 bg-neon-purple/10 text-neon-purple border-b border-l border-white/5 rounded-bl-xl font-mono text-[10px]">
        VERIFIED HUMAN NOD
      </div>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-neon-purple to-neon-cyan flex items-center justify-center font-mono text-2xl font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          {editing ? (
            <div className="flex items-center gap-2">
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="bg-space-800 border border-white/10 rounded px-2 py-1 text-sm font-mono focus:outline-none focus:border-neon-cyan"/>
              <button onClick={handleUpdate} className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded border border-emerald-500/30">Commit</button>
            </div>
          ) : (
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              {user?.name || 'Anonymous Intelligence'}
              <FiEdit2 className="text-slate-400 text-xs cursor-pointer hover:text-white" onClick={() => setEditing(true)} />
            </h3>
          )}
          <p className="text-sm font-mono text-slate-400 mt-1">{user?.email}</p>
        </div>
      </div>
      <div className="border-t border-white/5 pt-4 flex items-center justify-between text-xs font-mono text-slate-500">
        <span className="flex items-center gap-1"><FiShield className="text-neon-cyan" /> Encryption Type</span>
        <span>AES-256 / JWT Client Bound</span>
      </div>
    </div>
  );
};

export default ProfileCard;