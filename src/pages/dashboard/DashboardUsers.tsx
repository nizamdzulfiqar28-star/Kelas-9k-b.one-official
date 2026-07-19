import React, { useState } from 'react';
import { useDataStore, UserRole, User } from '@/store/dataStore';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, X, ShieldAlert, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardUsersProps {
  roleFilter: UserRole;
}

export default function DashboardUsers({ roleFilter }: DashboardUsersProps) {
  const { users, addUser, updateUser, deleteUser } = useDataStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    role: roleFilter,
    password: ''
  });

  const filteredUsers = users.filter(u => u.role === roleFilter);

  const handleOpenModal = (user?: User) => {
    if (user) {
      setFormData({ name: user.name, username: user.username, role: user.role, password: user.password || '' });
      setEditingId(user.id);
    } else {
      setFormData({ name: '', username: '', role: roleFilter, password: '' });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateUser(editingId, formData);
    } else {
      addUser(formData);
    }
    setIsModalOpen(false);
  };

  const isOwner = roleFilter === 'OWNER';
  const Icon = isOwner ? ShieldAlert : ShieldCheck;
  const title = isOwner ? 'Kelola Owner' : 'Kelola Admin';
  const desc = isOwner ? 'Manajemen akun Owner dengan hak akses penuh.' : 'Manajemen akun Admin kelas.';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <Icon className={`w-6 h-6 ${isOwner ? 'text-pink-400' : 'text-emerald-400'}`} /> {title}
          </h2>
          <p className="text-sm text-slate-400">{desc}</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="w-4 h-4" /> Tambah {isOwner ? 'Owner' : 'Admin'}
        </Button>
      </div>

      <div className="bg-slate-900/50 rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-white/10 text-slate-300">
              <tr>
                <th className="px-6 py-4 font-medium">Nama Lengkap</th>
                <th className="px-6 py-4 font-medium">Username</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                  <td className="px-6 py-4 text-slate-300">@{user.username}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                      isOwner ? 'bg-pink-500/20 text-pink-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenModal(user)}>
                        <Edit className="w-4 h-4 text-blue-400" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteUser(user.id)} disabled={user.username === 'nizam.dev'}>
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                    Belum ada data {isOwner ? 'Owner' : 'Admin'}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingId ? `Edit ${isOwner ? 'Owner' : 'Admin'}` : `Tambah ${isOwner ? 'Owner' : 'Admin'}`}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Nama Lengkap</label>
                  <input 
                    type="text" required
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Username</label>
                  <input 
                    type="text" required
                    value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {!editingId && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Password</label>
                    <input 
                      type="password" required placeholder="Minimal 8 karakter"
                      value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">Pada versi penuh, password akan di-hash dengan bcrypt.</p>
                  </div>
                )}

                <div className="pt-4 flex justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
                  <Button type="submit">{editingId ? 'Simpan Perubahan' : 'Tambahkan Akun'}</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
