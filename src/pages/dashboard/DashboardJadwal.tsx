import React, { useState } from 'react';
import { useDataStore } from '@/store/dataStore';
import { Button } from '@/components/ui/button';
import { Edit, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

const getFilledSubjects = (subjects: string[]) => {
  const result = [...subjects];
  while (result.length > 0 && (!result[result.length - 1] || result[result.length - 1].trim() === '')) {
    result.pop();
  }
  return result;
};

export default function DashboardJadwal() {
  const { schedules, updateSchedule } = useDataStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDay, setEditingDay] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<string[]>([]);

  const handleOpenModal = (daySchedule: typeof schedules[0]) => {
    setEditingDay(daySchedule.day);
    // Pad to exactly 10 hours so they can edit up to 10 hours optionally
    const subjects = [...daySchedule.subjects];
    while (subjects.length < 10) {
      subjects.push('');
    }
    setFormData(subjects);
    setIsModalOpen(true);
  };

  const handleSubjectChange = (index: number, value: string) => {
    const newFormData = [...formData];
    newFormData[index] = value;
    setFormData(newFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDay) {
      updateSchedule(editingDay, formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-heading font-bold text-white">Kelola Jadwal Pelajaran</h2>
          <p className="text-sm text-slate-400">Edit jadwal mata pelajaran per hari.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schedules.map((daySchedule) => (
          <div key={daySchedule.day} className="bg-slate-900/50 rounded-2xl border border-white/10 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
              <h3 className="font-bold text-indigo-300">{daySchedule.day}</h3>
              <Button variant="ghost" size="icon" onClick={() => handleOpenModal(daySchedule)}>
                <Edit className="w-4 h-4 text-blue-400" />
              </Button>
            </div>
            <div className="p-0 flex-1">
              <ul className="divide-y divide-white/5">
                {getFilledSubjects(daySchedule.subjects).map((subject, idx) => (
                  <li key={idx} className={cn(
                    "px-4 py-2 flex items-center justify-between text-sm",
                    subject === 'Istirahat' ? "bg-slate-900/50 text-slate-500 font-medium italic" : "text-slate-300"
                  )}>
                    <span>Jam ke-{idx + 1}</span>
                    <span className="font-medium text-right">{subject}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl my-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">
                  Edit Jadwal: {editingDay}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                  {formData.map((subject, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <span className="text-sm font-medium text-slate-400 w-16">Jam {idx + 1}</span>
                      <input 
                        type="text"
                        value={subject} 
                        onChange={e => handleSubjectChange(idx, e.target.value)}
                        className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
                  <Button type="submit" className="bg-[#d4af37] hover:bg-[#ebd074] text-black font-semibold">Simpan Perubahan</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
