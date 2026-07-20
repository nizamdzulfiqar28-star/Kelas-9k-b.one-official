import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import DokumentasiPage from './pages/DokumentasiPage';
import MuridPage from './pages/MuridPage';
import JadwalPage from './pages/JadwalPage';
import PrestasiPage from './pages/PrestasiPage';
import StrukturPage from './pages/StrukturPage';
import TentangPage from './pages/TentangPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import DashboardDokumentasi from './pages/dashboard/DashboardDokumentasi';
import DashboardPrestasi from './pages/dashboard/DashboardPrestasi';
import DashboardUsers from './pages/dashboard/DashboardUsers';
import AnimatedBackground from './components/layout/AnimatedBackground';
import DashboardJadwal from './pages/dashboard/DashboardJadwal';
import DashboardPiket from './pages/dashboard/DashboardPiket';
import DashboardStruktur from './pages/dashboard/DashboardStruktur';
import { CustomCursor } from './components/ui/CustomCursor';
import { motion, AnimatePresence } from 'motion/react';
import { useDataStore } from './store/dataStore';
import ScrollToTop from './components/layout/ScrollToTop';

// Placeholder components for routes we haven't built yet
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="container mx-auto px-6 py-20 text-center">
    <h1 className="text-4xl font-heading font-bold mb-4">{title}</h1>
    <p className="text-slate-400">Fitur ini akan diintegrasikan dengan Dashboard & Supabase API dalam versi Full-Stack.</p>
  </div>
);

const DashboardPlaceholder = ({ title }: { title: string }) => (
  <div className="py-12 flex flex-col items-center justify-center text-center h-full">
    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
      <span className="text-2xl">🚧</span>
    </div>
    <h2 className="text-2xl font-heading font-bold mb-2">Kelola {title}</h2>
    <p className="text-slate-400 max-w-sm">Halaman pengelolaan data {title} akan tersedia pada versi Full-Stack dengan Supabase.</p>
  </div>
);

export default function App() {
  const [loading, setLoading] = useState(true);
  const { incrementVisitorCount } = useDataStore();

  useEffect(() => {
    // Only increment visitor count once per browser session
    const hasVisited = sessionStorage.getItem('has_visited');
    if (!hasVisited) {
      incrementVisitorCount();
      sessionStorage.setItem('has_visited', 'true');
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, [incrementVisitorCount]);

  // Automatic Background Music Engine with Interaction Fallback
  useEffect(() => {
    const audio = new Audio('https://sympathetic-lime-e1ftljwy.edgeone.dev/SpotiDown.App%20-%20Ethereal%20-%20mikeeysmind.mp3');
    audio.loop = true;
    audio.volume = 0.4; // Pleasant background volume level

    const playAudio = () => {
      audio.play().catch(err => {
        console.log("Autoplay blocked. Music will start on first user tap/click.", err);
      });
    };

    if (!loading) {
      playAudio();
    }

    const handleFirstInteraction = () => {
      audio.play().then(() => {
        // Once successfully playing, remove interaction fallback event listeners
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('touchstart', handleFirstInteraction);
      }).catch(err => console.log("Audio play failed on interaction", err));
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      audio.pause();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [loading]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <CustomCursor />
      <AnimatedBackground />
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#060609]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
              className="relative flex flex-col items-center"
            >
              {/* Outer glowing ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="w-32 h-32 rounded-full border-2 border-dashed border-[#d4af37]/40 absolute -top-4"
              />
              
              {/* Logo container */}
              <motion.div
                animate={{ scale: [0.95, 1.05, 0.95] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-24 h-24 rounded-full border border-[#d4af37]/30 overflow-hidden flex items-center justify-center bg-[#0c0c12] relative z-10"
              >
                <img src="https://iili.io/CjL453N.png" alt="9K Logo" className="w-full h-full object-cover scale-[1.35]" />
              </motion.div>

              {/* Text */}
              <div className="mt-12 text-center">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-[#d4af37] font-heading font-semibold text-xl tracking-wider uppercase mb-2"
                >
                  9K B.one
                </motion.p>
                <motion.div
                  className="flex items-center gap-1.5 justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <span className="text-xs text-slate-400 font-mono tracking-widest uppercase">
                    Memuat Album
                  </span>
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="w-1.5 h-3 bg-[#d4af37]"
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col"
          >
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="dokumentasi" element={<DokumentasiPage />} />
                <Route path="prestasi" element={<PrestasiPage />} />
                <Route path="jadwal" element={<JadwalPage />} />
                <Route path="piket" element={<JadwalPage />} />
                <Route path="struktur" element={<StrukturPage />} />
                <Route path="murid" element={<MuridPage />} />
                <Route path="tentang" element={<TentangPage />} />
                <Route path="login" element={<LoginPage />} />
              </Route>
              
              <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN', 'OWNER']} />}>
                <Route element={<DashboardLayout />}>
                  <Route index element={<DashboardHome />} />
                  <Route path="dokumentasi" element={<DashboardDokumentasi />} />
                  <Route path="prestasi" element={<DashboardPrestasi />} />
                  <Route path="jadwal" element={<DashboardJadwal />} />
                  <Route path="piket" element={<DashboardPiket />} />
                  <Route path="struktur" element={<DashboardStruktur />} />
                  <Route path="murid" element={<DashboardPlaceholder title="Daftar Siswa" />} />
                  <Route path="settings" element={<DashboardPlaceholder title="Pengaturan Website" />} />
                  
                  {/* Owner Only Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['OWNER']} />}>
                    <Route path="owners" element={<DashboardUsers roleFilter="OWNER" />} />
                    <Route path="admins" element={<DashboardUsers roleFilter="ADMIN" />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </motion.div>
        )}
      </AnimatePresence>
    </BrowserRouter>
  );
}


