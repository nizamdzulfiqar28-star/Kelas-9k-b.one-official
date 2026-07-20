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
import { Volume2 } from 'lucide-react';
import { logoBase64 } from './logoBase64';

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

// Create global Audio instance outside React lifecycle with multi-source fallback
const AUDIO_URLS = [
  'https://litter.catbox.moe/udmf9b.mp3', // Super fast direct CDN link with range-request & CORS support (resolves mobile Safari/Vercel silence!)
  'https://d.uguu.se/HkdkPCdk.mp3',      // Fast secondary fallback direct stream link
  '/bg-music.mp3'                        // Local static file fallback
];

let currentAudioIndex = 0;
const globalAudio = typeof window !== 'undefined' ? new Audio(AUDIO_URLS[0]) : null;

if (globalAudio) {
  globalAudio.loop = true;
  globalAudio.volume = 0.4; // Pleasant background volume level
  globalAudio.preload = 'auto';
  globalAudio.load(); // Force immediate background pre-buffering to eliminate playback latency

  // If the active stream has any issue, automatically fall back to the next source
  globalAudio.addEventListener('error', () => {
    if (currentAudioIndex < AUDIO_URLS.length - 1) {
      currentAudioIndex++;
      console.log(`Audio stream error. Falling back to source: ${AUDIO_URLS[currentAudioIndex]}`);
      globalAudio.src = AUDIO_URLS[currentAudioIndex];
      globalAudio.load();
    }
  });
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [readyToEnter, setReadyToEnter] = useState(false);
  const { incrementVisitorCount } = useDataStore();

  useEffect(() => {
    // Only increment visitor count once per browser session
    const hasVisited = sessionStorage.getItem('has_visited');
    if (!hasVisited) {
      incrementVisitorCount();
      sessionStorage.setItem('has_visited', 'true');
    }
  }, [incrementVisitorCount]);

  useEffect(() => {
    let active = true;

    const runPreload = async () => {
      // Create a super fast, buttery-smooth simulated progress bar.
      // Reaches 100% in ~200-300ms for a snappy, instantaneous feedback.
      let currentProgress = 0;
      while (active && currentProgress < 100) {
        const delay = Math.random() * 15 + 5; // 5-20ms
        await new Promise((r) => setTimeout(r, delay));
        if (!active) return;
        currentProgress += Math.floor(Math.random() * 12) + 8; // 8-20% increase
        if (currentProgress > 100) currentProgress = 100;
        setProgress(currentProgress);
      }

      if (active) {
        setProgress(100);
        setTimeout(() => {
          if (active) setReadyToEnter(true);
        }, 80);
      }
    };

    runPreload();

    return () => {
      active = false;
    };
  }, []);

  // Attempt autoplay immediately as early as possible
  useEffect(() => {
    if (!globalAudio) return;

    const playAudio = () => {
      globalAudio.play().catch(err => {
        console.log("Autoplay blocked. Music will start on user interaction.", err);
      });
    };

    playAudio();

    const handleFirstInteraction = () => {
      globalAudio.play().then(() => {
        // Once successfully playing, remove interaction fallback event listeners
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('touchstart', handleFirstInteraction);
      }).catch(err => console.log("Audio play failed on interaction", err));
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  const handleEnter = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (globalAudio) {
      globalAudio.play().catch(err => console.log("Audio play failed", err));
    }
    setLoading(false);
  };

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
            onClick={() => handleEnter()}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#060609] cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
              className="relative flex flex-col items-center animate-none"
            >
              {/* Circular Progress Ring */}
              <div className="w-32 h-32 absolute -top-4 flex items-center justify-center select-none z-0">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Outer glow aura circle track */}
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    className="stroke-[#d4af37]/10"
                    strokeWidth="3.5"
                    fill="transparent"
                  />
                  {/* Live SVG Progress Ring */}
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="54"
                    className="stroke-[#d4af37]"
                    strokeWidth="3.5"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 54}
                    animate={{
                      strokeDashoffset: 2 * Math.PI * 54 * (1 - progress / 100),
                    }}
                    transition={{ duration: 0.1, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>

                {/* Pulsing glow underlay that intensifies with progress */}
                <div 
                  className="absolute inset-4 rounded-full transition-shadow duration-300 pointer-events-none"
                  style={{
                    boxShadow: `0 0 ${15 + (progress / 100) * 20}px rgba(212,175,55,${0.1 + (progress / 100) * 0.4})`,
                  }}
                />
              </div>
              
              {/* Logo container */}
              <motion.div
                animate={{ scale: [0.95, 1.05, 0.95] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-24 h-24 rounded-full border border-[#d4af37]/30 overflow-hidden flex items-center justify-center bg-[#0c0c12] relative z-10"
              >
                <img src={logoBase64} alt="9K Logo" className="w-full h-full object-cover scale-[1.35]" />
              </motion.div>

              {/* Text */}
              <div className="mt-12 text-center flex flex-col items-center">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-[#d4af37] font-heading font-semibold text-xl tracking-wider uppercase mb-2"
                >
                  9K B.one
                </motion.p>
                
                <AnimatePresence mode="wait">
                  {!readyToEnter ? (
                    <motion.div
                      key="loading-text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-3.5 mt-2 h-16 justify-center"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-mono tracking-widest uppercase">
                          Memuat Album
                        </span>
                        <span className="text-xs font-mono font-bold text-[#d4af37]">
                          {progress}%
                        </span>
                      </div>

                      {/* Smooth loading bar with high-precision gradient */}
                      <div className="w-36 h-1 bg-slate-900 border border-slate-800/60 rounded-full overflow-hidden relative">
                        <motion.div
                          className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#d4af37]/60 via-[#d4af37] to-[#e6c865]"
                          initial={{ width: "0%" }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.1, ease: "easeOut" }}
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="enter-button"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleEnter}
                      className="mt-2 px-6 py-2.5 bg-gradient-to-r from-[#d4af37]/20 to-[#d4af37]/5 hover:from-[#d4af37]/30 hover:to-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] rounded-full font-heading font-semibold text-xs tracking-widest uppercase shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300 flex items-center justify-center cursor-pointer relative z-20"
                    >
                      <span>klik tombol ini untuk melihat album</span>
                    </motion.button>
                  )}
                </AnimatePresence>
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


