import React, { useState } from 'react';
import { useDataStore } from '@/store/dataStore';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const getFilledSubjects = (subjects: string[]) => {
  const result = [...subjects];
  while (result.length > 0 && (!result[result.length - 1] || result[result.length - 1].trim() === '')) {
    result.pop();
  }
  return result;
};

export default function JadwalPage() {
  const [activeTab, setActiveTab] = useState<'pelajaran' | 'piket'>('pelajaran');
  const { schedules: schedule, pickets } = useDataStore();

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Jadwal <span className="text-gradient">Kelas</span></h1>
        <p className="text-slate-400 max-w-2xl mx-auto">Jadwal mata pelajaran dan tugas kebersihan harian.</p>
      </div>

      <div className="flex justify-center mb-12">
        <div className="inline-flex glass-panel p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('pelajaran')}
            className={cn(
              "px-6 py-2.5 rounded-lg font-medium text-sm transition-all",
              activeTab === 'pelajaran' ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            Mata Pelajaran
          </button>
          <button
            onClick={() => setActiveTab('piket')}
            className={cn(
              "px-6 py-2.5 rounded-lg font-medium text-sm transition-all",
              activeTab === 'piket' ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            Jadwal Piket
          </button>
        </div>
      </div>

      {activeTab === 'pelajaran' ? (
        <motion.div 
          key="pelajaran"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {schedule.map((day, i) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5, delay: i * 0.1, type: "spring", bounce: 0.4 }}
            >
              <Card className="h-full">
                <div className="p-4 border-b border-white/10 bg-white/5">
                  <h2 className="text-xl font-bold font-heading text-center text-indigo-300">{day.day}</h2>
                </div>
                <CardContent className="p-0">
                  <ul className="divide-y divide-white/5">
                    {getFilledSubjects(day.subjects).map((subject, idx) => (
                      <li key={idx} className={cn(
                        "px-6 py-3 flex items-center justify-between text-sm",
                        subject === 'Istirahat' ? "bg-slate-900/50 text-slate-500 font-medium italic" : "text-slate-300"
                      )}>
                        <span>Jam ke-{idx + 1}</span>
                        <span className="font-medium text-right">{subject}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          key="piket"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {pickets.map((day, i) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5, delay: i * 0.1, type: "spring", bounce: 0.4 }}
            >
              <Card className="h-full">
                <div className="p-4 border-b border-white/10 bg-white/5">
                  <h2 className="text-xl font-bold font-heading text-center text-orange-300">{day.day}</h2>
                </div>
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    {day.students && day.students.length > 0 ? (
                      day.students.map((student, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-slate-300">
                          <div className="w-2 h-2 rounded-full bg-orange-500/50" />
                          {student}
                        </li>
                      ))
                    ) : (
                      <li className="text-center py-4 text-slate-500 text-sm italic">
                        jadwal piket belum dibentuk
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
