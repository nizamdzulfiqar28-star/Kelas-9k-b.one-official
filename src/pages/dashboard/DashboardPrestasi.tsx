import React, { useState } from 'react';
import { useDataStore } from '@/store/dataStore';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function DashboardPrestasi() {
  const { achievements, addAchievement, updateAchievement, deleteAchievement } = useDataStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    level: '',
    year: '',
    desc: '',
    url: ''
  });

  const handleOpenModal = (item?: typeof achievements[0]) => {
    if (item) {
      setFormData({
        title: item.title,
        level: item.level,
        year: item.year,
        desc: item.desc,
        url: item.url
      });
      setPreviewImage(item.url);
      setEditingId(item.id);
    } else {
      setFormData({ title: '', level: '', year: '', desc: '', url: '' });
      setPreviewImage(null);
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);
        setFormData(prev => ({ ...prev, url: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.url) return alert('Pilih foto terlebih dahulu');

    if (editingId) {
      updateAchievement(editingId, { id: editingId, ...formData });
    } else {
      addAchievement({ id: Date.now().toString(), ...formData });
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-heading font-bold text-white">Kelola Prestasi</h2>
          <p className="text-sm text-slate-400">Pencatatan prestasi dan penghargaan kelas.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2 bg-[#d4af37] hover:bg-[#ebd074] text-black">
          <Plus className="w-4 h-4" /> Tambah Prestasi
        </Button>
      </div>

      <div className="bg-slate-900/50 rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-white/10 text-slate-300">
              <tr>
                <th className="px-6 py-4 font-medium">Foto</th>
                <th className="px-6 py-4 font-medium">Nama Prestasi</th>
                <th className="px-6 py-4 font-medium">Tingkat</th>
                <th className="px-6 py-4 font-medium">Tahun</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {achievements.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden border border-white/10">
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-white">{item.title}</td>
                  <td className="px-6 py-4 text-slate-300">
                    <span className="px-2.5 py-1 bg-yellow-500/20 text-yellow-300 rounded-lg text-xs font-medium uppercase">
                      {item.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{item.year}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenModal(item)}>
                        <Edit className="w-4 h-4 text-blue-400" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteAchievement(item.id)}>
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {achievements.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    Belum ada data prestasi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
                  {editingId ? 'Edit Prestasi' : 'Tambah Prestasi'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Upload Foto</label>
                  <div className="flex items-center gap-4">
                    {previewImage ? (
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-black/20 border border-dashed border-white/20 flex flex-col items-center justify-center text-slate-500 shrink-0">
                        <Upload className="w-6 h-6 mb-1" />
                        <span className="text-[10px]">Pilih Foto</span>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/20 file:text-indigo-300 hover:file:bg-indigo-500/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Nama Prestasi</label>
                  <input 
                    type="text" required
                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Tingkat</label>
                    <input 
                      type="text" required placeholder="Contoh: Sekolah"
                      value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Tahun</label>
                    <input 
                      type="text" required placeholder="Contoh: 2026"
                      value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Deskripsi Singkat</label>
                  <textarea 
                    required rows={3}
                    value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
                  <Button type="submit" className="bg-[#d4af37] hover:bg-[#ebd074] text-black font-semibold">{editingId ? 'Simpan Perubahan' : 'Tambah Prestasi'}</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
