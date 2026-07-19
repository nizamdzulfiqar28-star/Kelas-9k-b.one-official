import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User as UserIcon, KeyRound, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useDataStore } from '@/store/dataStore';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore(state => state.login);
  const { users } = useDataStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    // Simulate API login and validate with dataStore
    setTimeout(() => {
      setLoading(false);
      
      // Master fallback for Owner (Bypasses LocalStorage Cache)
      const isMasterOwner = username === 'nizam.dev' && password === 'nizam280212';
      
      const foundUser = (users || []).find(u => u.username === username && u.password === password);
      
      if (isMasterOwner || foundUser) {
        setSuccess(true);
        login(isMasterOwner ? 'nizam.dev' : foundUser!.username, isMasterOwner ? 'OWNER' : foundUser!.role);
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } else {
        // More informative error messages
        if (username === 'nizam.dev') {
          setErrorMsg('Password salah untuk akun Owner. Silahkan coba lagi.');
        } else {
          setErrorMsg('Username atau password tidak ditemukan. Kamu bukan admin web kelas 9k yaa, sorry.');
        }
      }
    }, 800);
  };

  return (
    <div className="container mx-auto px-6 py-20 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass-panel p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-xl shadow-indigo-500/10">
              <Lock className="w-8 h-8 text-indigo-400" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-white mb-2">Login Portal</h1>
            <p className="text-slate-400 text-sm">Masuk untuk mengakses Dashboard CMS (Owner/Admin).</p>
          </div>

          {success ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
              className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center text-sm"
            >
              Berhasil login! Di versi full-stack, Anda akan diarahkan ke Dashboard.
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-center">
                <p className="text-amber-400 text-xs leading-relaxed">
                  Akun owner hanya dipegang oleh Nizam DzR.Dev , jika ingin menjadi admin silahkan hubungi nizam dzr.dev disertai dengan persetujuan nya , terimakasih
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{errorMsg}</p>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Username</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={loading}>
                {loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
              </Button>
            </form>
          )}

          <div className="mt-8 text-center border-t border-white/10 pt-6">
            <p className="text-xs text-slate-500">
              Saat ini aplikasi menggunakan Local Storage. Integrasi Supabase API akan tersedia pada versi Full-Stack.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
