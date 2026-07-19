import React from 'react';
import { useDataStore } from '@/store/dataStore';
import { motion } from 'motion/react';
import { Trophy, Star, Sparkles } from 'lucide-react';

export default function PrestasiPage() {
  const { achievements } = useDataStore();

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
          Prestasi <span className="text-[#CBA358]">Kelas</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">prestasi yang diraih kelas 9k nihh</p>
      </div>

      {achievements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {achievements.map((achievement, i) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i % 2 === 0 ? 0 : 0.2, type: "spring", bounce: 0.4 }}
              className="group glass-panel rounded-3xl overflow-hidden relative border border-white/10 flex flex-col"
            >
              <div className="h-64 overflow-hidden relative">
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-bold text-yellow-500">{achievement.year}</span>
                </div>
                <img 
                  src={achievement.url} 
                  alt={achievement.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-medium text-indigo-300 uppercase tracking-wider">Tingkat {achievement.level}</span>
                </div>
                <h3 className="text-2xl font-bold font-heading mb-4 text-white leading-tight">{achievement.title}</h3>
                <p className="text-slate-400 leading-relaxed mb-6 flex-1">
                  {achievement.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center py-16 px-8 rounded-3xl border border-white/5 bg-[#13131A]/40 backdrop-blur-md shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#CBA358]/30 to-transparent" />
          <Trophy className="w-16 h-16 text-[#CBA358]/40 mx-auto mb-6 animate-pulse" />
          <p className="text-lg md:text-xl text-slate-300 font-serif italic leading-relaxed pl-4 border-l-2 border-[#CBA358]/50 inline-block text-left max-w-xl mx-auto">
            "untuk saat ini prestasi kelas belum ada , nanti dokumentasi prestasi akan di upload ketika sudah mendapat juara kelas , tapi kelas 9k udah pasti bakal dapet juara sih"
          </p>
        </motion.div>
      )}
    </div>
  );
}
