import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Home, Image, Trophy, Calendar, Users, Info, LogIn, CalendarDays } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { logoBase64 } from '../../logoBase64';

const links = [
  { name: 'Beranda', to: '/', icon: Home },
  { name: 'Dokumentasi', to: '/dokumentasi', icon: Image },
  { name: 'Prestasi', to: '/prestasi', icon: Trophy },
  { name: 'Jadwal Pelajaran', to: '/jadwal', icon: Calendar },
  { name: 'Jadwal Piket', to: '/piket', icon: CalendarDays },
  { name: 'Struktur Organisasi', to: '/struktur', icon: Users },
  { name: 'Daftar Siswa', to: '/murid', icon: Users },
  { name: 'Tentang Kelas', to: '/tentang', icon: Info },
  { name: 'Login', to: '/login', icon: LogIn },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Force remove light mode class if any exists
    document.body.classList.remove('light');
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside or resizing
  useEffect(() => {
    const handleResize = () => setIsOpen(false);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <header className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b border-transparent",
        scrolled ? "bg-slate-950/80 backdrop-blur-xl border-white/10 py-3 shadow-2xl" : "py-5"
      )}>
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 group z-50">
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center border border-[#d4af37]/30 shadow-lg group-hover:scale-105 transition-transform bg-[#0c0c12]">
              <img src={logoBase64} alt="9K Logo" className="w-full h-full object-cover scale-[1.35]" />
            </div>
            <span className="font-heading font-semibold text-xl tracking-tight text-white">9K B.one</span>
          </NavLink>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative z-50 p-2.5 rounded-xl hover:bg-white/10 transition-colors text-slate-200"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-3xl pt-24 pb-12 px-6 overflow-y-auto"
          >
            <div className="container mx-auto max-w-2xl flex flex-col gap-2">
              {links.map((link, i) => {
                const Icon = link.icon;
                return (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={link.name}
                  >
                    <NavLink
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) => cn(
                        "flex items-center gap-4 p-4 rounded-2xl text-lg font-medium transition-all",
                        isActive 
                          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-xl",
                        "bg-white/5"
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {link.name}
                    </NavLink>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
