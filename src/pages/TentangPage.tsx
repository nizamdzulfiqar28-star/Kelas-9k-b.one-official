import React from 'react';
import { motion } from 'motion/react';
import { Heart, Calendar, School, Compass } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function TentangPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
          Tentang <span className="text-gradient">Kelas</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">Mengenal lebih dekat Kelas IX K SMPN 1 Ibun.</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Main message card with elegant gradient borders and premium shadow */}
          <div className="relative group p-0.5 rounded-3xl overflow-hidden bg-gradient-to-r from-[#d4af37]/30 via-indigo-500/20 to-[#d4af37]/30 mb-12 shadow-2xl">
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm rounded-3xl" />
            <div className="relative bg-slate-900/90 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/5 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] mb-8 border border-[#d4af37]/20">
                <Heart className="w-8 h-8 fill-current animate-pulse" />
              </div>
              
              <blockquote className="text-xl md:text-2xl font-sans font-medium text-slate-100 leading-relaxed max-w-3xl">
                "kelas 9k smpn 1 ibun tahun ajaran 2026 - 2027 adalah kelas yang akan penuh dengan kenangan bersama , karena ini adalah tahun ajaran terakhir kita bersekolah disini , semua kenangan dari kelas 7 tidak akan pernah terlupakan"
              </blockquote>

              <div className="mt-8 h-px w-24 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
              
              <p className="text-xs font-mono tracking-[0.2em] text-[#d4af37] mt-4 uppercase">
                IX K • SMPN 1 IBUN • MEMORY BOOK
              </p>
            </div>
          </div>
        </motion.div>

        {/* Supporting bento highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white/5 border border-white/10 h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
                  <School className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-white mb-2">SMPN 1 Ibun</h3>
                <p className="text-sm text-slate-400">Tempat kita mengukir prestasi, belajar bersama, dan tumbuh menjadi pribadi yang berkarakter.</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-white/5 border border-white/10 h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="p-3 rounded-2xl bg-pink-500/10 text-pink-400 border border-pink-500/20 mb-4">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-white mb-2">Tahun Ajaran terakhir</h3>
                <p className="text-sm text-slate-400">Periode 2026 - 2027 adalah momen kebersamaan terakhir sebelum kita melangkah mengejar mimpi masing-masing.</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-white/5 border border-white/10 h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-white mb-2">Kenangan Abadi</h3>
                <p className="text-sm text-slate-400">Setiap canda tawa, duka, dan perjuangan dari kelas 7 tersimpan rapat menjadi fondasi persaudaraan kita.</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
