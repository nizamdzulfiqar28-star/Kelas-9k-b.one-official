import React, { useState } from 'react';
import { useDataStore } from '@/store/dataStore';
import { Button } from '@/components/ui/button';
import { Edit, X, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function DashboardPiket() {
  const { pickets, updatePickets } = useDataStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDay, setEditingDay] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<string[]>([]);

  const handleOpenModal = (picketDay: typeof pickets[0]) => {
    setEditingDay(picketDay.day);
    setFormData([...picketDay.students]);
    setIsModalOpen(true);
  };

  const handleStudentChange = (index: number, value: string) => {
    const newFormData = [...formData];
    newFormData[index] = value;
    setFormData(newFormData);
  };
  
  const addStudent = () => {
    setFormData([...formData, '']);
  };
  
  const removeStudent = (index: number) => {
    const newFormData = [...formData];
    newFormData.splice(index, 1);
    setFormData(newFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDay) {
      updatePickets(editingDay, formData.filter(s => s.trim() !== ''));
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-heading font-bold text-white">Kelola Jadwal Piket</h2>
          <p className="text-sm text-slate-400">Edit jadwal petugas kebersihan kelas per hari.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pickets.map((picketDay) => (
          <div key={picketDay.day} className="bg-slate-900/50 rounded-2xl border border-white/10 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
              <h3 className="font-bold text-orange-300">{picketDay.day}</h3>
              <Button variant="ghost" size="icon" onClick={() => handleOpenModal(picketDay)}>
                <Edit className="w-4 h-4 text-blue-400" />
              </Button>
            </div>
            <div className="p-4 flex-1">
              <ul className="space-y-3">
                {picketDay.students.map((student, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-300 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500/50" />
                    {student}
                  </li>
                ))}
                {picketDay.students.length === 0 && (
                  <li className="text-slate-500 italic text-sm text-center py-2">jadwal piket belum dibentuk</li>
                )}
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
                  Edit Piket: {editingDay}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                  {formData.map((student, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <input 
                        type="text" required placeholder="Nama Siswa"
                        value={student} 
                        onChange={e => handleStudentChange(idx, e.target.value)}
                        className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeStudent(idx)}>
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addStudent} className="w-full gap-2 border-white/10 mt-2">
                    <Plus className="w-4 h-4" /> Tambah Siswa
                  </Button>
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
