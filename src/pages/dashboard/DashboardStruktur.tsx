import React, { useState } from 'react';
import { useDataStore, OrgMember } from '@/store/dataStore';
import { Button } from '@/components/ui/button';
import { Edit, X, Upload, Users, Save, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function DashboardStruktur() {
  const { organization, updateOrgMember, addOrgMember, deleteOrgMember } = useDataStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingMember, setEditingMember] = useState<OrgMember | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    role: '',
    name: '',
    url: ''
  });

  const handleOpenModal = (item: OrgMember) => {
    setEditingMember(item);
    setIsAdding(false);
    setFormData({
      role: item.role,
      name: item.name,
      url: item.url || ''
    });
    setPreviewImage(item.url || null);
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setEditingMember(null);
    setIsAdding(true);
    setFormData({
      role: '',
      name: '',
      url: ''
    });
    setPreviewImage(null);
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
    
    if (isAdding) {
      addOrgMember({
        role: formData.role,
        name: formData.name,
        url: formData.url
      });
    } else {
      if (!editingMember) return;
      updateOrgMember(editingMember.id, {
        role: formData.role,
        name: formData.name,
        url: formData.url
      });
    }
    
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-heading font-bold text-white">Kelola Struktur Organisasi</h2>
          <p className="text-sm text-slate-400">Sunting informasi pengurus kelas (pimpinan, sekretaris, bendahara, seksi-seksi, dsb).</p>
        </div>
        <Button
          onClick={handleOpenAddModal}
          className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 rounded-xl px-4 py-2.5 shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" /> Tambah Jabatan Baru
        </Button>
      </div>

      <div className="bg-slate-900/50 rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-white/10 text-slate-300">
              <tr>
                <th className="px-6 py-4 font-medium">Foto</th>
                <th className="px-6 py-4 font-medium">Jabatan / Peran</th>
                <th className="px-6 py-4 font-medium">Nama Lengkap</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {organization.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden border border-white/10">
                      {item.url ? (
                        <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-5 h-5 text-[#CBA358]" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-white">
                    <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
                      {item.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300 font-medium">{item.name || <span className="text-slate-500 italic text-xs">Belum ditentukan</span>}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleOpenModal(item)}
                        className="gap-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          if (confirm(`Apakah Anda yakin ingin menghapus jabatan "${item.role}"?`)) {
                            deleteOrgMember(item.id);
                          }
                        }}
                        className="gap-1 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" /> Hapus
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
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
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">
                  {isAdding ? "Tambah Jabatan Baru" : "Edit Anggota Organisasi"}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Foto Pengurus
                  </label>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                      {previewImage ? (
                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-2">
                          <Users className="w-8 h-8 text-[#CBA358]/60 mx-auto mb-1" />
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Foto Inti</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="org-photo-upload"
                        />
                        <label
                          htmlFor="org-photo-upload"
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 text-white text-sm font-medium transition-colors"
                        >
                          <Upload className="w-4 h-4 text-indigo-400" />
                          Pilih Foto Baru
                        </label>
                      </div>
                      
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Atau masukkan URL gambar..."
                          value={formData.url}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, url: e.target.value }));
                            setPreviewImage(e.target.value);
                          }}
                          className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-300 text-xs"
                        />
                        {formData.url && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={() => {
                              setFormData(prev => ({ ...prev, url: '' }));
                              setPreviewImage(null);
                            }}
                            className="text-red-400 hover:text-red-300 py-2 h-auto"
                          >
                            Hapus
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Jabatan / Peran
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white"
                      placeholder="Contoh: Ketua Kelas"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white"
                      placeholder="Contoh: Ahmad Faisal"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-white/5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 border-white/10 hover:bg-white/5 hover:text-white"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#d4af37] hover:bg-[#ebd074] text-black gap-2"
                  >
                    <Save className="w-4 h-4" /> Simpan Perubahan
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
