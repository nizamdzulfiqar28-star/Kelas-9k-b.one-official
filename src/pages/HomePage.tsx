import React from 'react';
import { motion } from 'motion/react';
import { Image, Trophy, Calendar, Users, Info, CalendarDays, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { logoBase64 } from '../logoBase64';

const quickMenu = [
  { title: 'Dokumentasi', icon: Image, color: 'text-pink-400', bg: 'bg-pink-400/10', to: '/dokumentasi' },
  { title: 'Prestasi', icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-400/10', to: '/prestasi' },
  { title: 'Jadwal Pelajaran', icon: Calendar, color: 'text-emerald-400', bg: 'bg-emerald-400/10', to: '/jadwal' },
  { title: 'Jadwal Piket', icon: CalendarDays, color: 'text-orange-400', bg: 'bg-orange-400/10', to: '/piket' },
  { title: 'Organisasi', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-400/10', to: '/struktur' },
  { title: 'Data Murid', icon: Info, color: 'text-cyan-400', bg: 'bg-cyan-400/10', to: '/murid' },
];

export default function HomePage() {
  return (
    <div className="container mx-auto px-6 md:px-12">
      {/* Hero Section */}
      <section className="py-20 flex flex-col items-center text-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
          className="w-32 h-32 mb-10 rounded-full flex items-center justify-center border-2 border-[#d4af37]/50 shadow-[0_0_20px_rgba(212,175,55,0.4)] overflow-hidden bg-[#0c0c12]"
        >
          <img src={logoBase64} alt="9K Logo" className="w-full h-full object-cover scale-[1.35]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="border border-[#d4af37]/30 rounded-full px-8 py-3 mb-10 flex items-center gap-6 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
        >
          <div className="w-6 h-[1px] bg-[#d4af37]/50" />
          <span className="text-[#d4af37] font-medium tracking-[0.3em] uppercase text-sm">
            Album Kelas 2026 / 2027
          </span>
          <div className="w-6 h-[1px] bg-[#d4af37]/50" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col items-center gap-2 mb-8"
        >
          <span className="text-3xl md:text-5xl text-slate-100 font-serif font-medium tracking-wide">Kelas</span>
          <span className="text-6xl md:text-[5.5rem] text-[#d4af37] font-serif italic tracking-widest my-1 drop-shadow-lg">IX K</span>
          <span className="text-xl md:text-3xl text-slate-200 font-serif tracking-[0.1em] uppercase mt-4">SMPN 1 IBUN</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-base md:text-lg text-slate-400 max-w-2xl mb-12 flex items-center justify-center gap-3 font-medium tracking-wide"
        >
          <span className="text-[#d4af37]">✦</span>
          Setiap momen adalah puisi yang tidak akan pernah terlupakan
          <span className="text-[#d4af37]">✦</span>
        </motion.p>
      </section>

      {/* Wali Kelas Profile */}
      <section className="mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
          className="relative rounded-3xl overflow-hidden glass-panel border border-[#d4af37]/20 shadow-[0_10px_40px_-10px_rgba(212,175,55,0.1)]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 via-transparent to-transparent pointer-events-none" />
          <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-full border-4 border-[#d4af37]/30 shadow-2xl bg-slate-900 overflow-hidden relative"
            >
              <img 
                src="https://www.image2url.com/r2/default/images/1784723215884-029653a0-f180-4a4c-86a1-01291e1348ce.jpg" 
                alt="Foto Ibu Hj. Iis Risnawati S.Pd"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback ke local image atau placeholder jika URL gagal
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/foto-wali-kelas.jpg";
                }}
              />
            </motion.div>
            <div className="text-center md:text-left flex-1 space-y-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#d4af37] mb-2 tracking-wide">Ibu Hj. Iis Risnawati S.Pd</h2>
                <p className="text-lg text-slate-300 font-medium tracking-wider uppercase text-sm">Wali Kelas 9K • NIP. 19700810 199702 2 003</p>
              </div>
              <blockquote className="text-xl md:text-2xl text-slate-200 italic font-serif leading-relaxed border-l-4 border-[#d4af37]/50 pl-6 text-left drop-shadow-md">
                "Jadilah generasi yang tidak hanya cerdas dalam akademik, tapi juga mulia dalam akhlak. Kelas 9K akan selalu menjadi keluarga."
              </blockquote>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Quick Menu */}
      <section className="mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-[#d4af37] mb-4">Eksplorasi Kelas</h2>
          <div className="w-16 h-[1px] bg-[#d4af37]/50 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickMenu.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1, type: "spring", bounce: 0.4 }}
              >
                <Link to={item.to}>
                  <Card className="h-full group hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(212,175,55,0.2)] transition-all duration-300 bg-black/40 backdrop-blur-md border-white/5">
                    <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                      <div className={`p-4 rounded-2xl ${item.bg} group-hover:bg-[#d4af37]/20 transition-colors duration-300`}>
                        <Icon className={`w-8 h-8 ${item.color} group-hover:text-[#d4af37] transition-colors duration-300`} />
                      </div>
                      <span className="font-medium text-sm md:text-base text-slate-300 group-hover:text-[#d4af37] transition-colors duration-300">
                        {item.title}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>
    </div>
  );
}
