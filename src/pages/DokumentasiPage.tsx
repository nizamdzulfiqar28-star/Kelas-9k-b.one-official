import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Calendar, MapPin, Tag } from 'lucide-react';
import { useDataStore } from '@/store/dataStore';
import { Input } from '@/components/ui/input';

export default function DokumentasiPage() {
  const { documentations } = useDataStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<typeof documentations[0] | null>(null);

  const filteredDocs = documentations.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Galeri & <span className="text-gradient">Dokumentasi</span></h1>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto italic font-serif">
          "inilah berbagai dokumentasi dari kelas 9k yang penuh dengan berbagai kenangan"
        </p>
      </div>

      <div className="mb-8 max-w-md mx-auto relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Cari momen atau kategori..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-slate-400"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc, i) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.1, type: "spring", bounce: 0.4 }}
            className="group cursor-pointer relative rounded-2xl overflow-hidden glass-card border border-white/10"
            onClick={() => setSelectedMedia(doc)}
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src={doc.url} 
                alt={doc.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <h3 className="text-xl font-bold text-white mb-2">{doc.title}</h3>
              <div className="flex items-center gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {doc.date}</span>
                <span className="flex items-center gap-1"><Tag className="w-3 h-3"/> {doc.category}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          Tidak ada dokumentasi yang ditemukan.
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4 md:p-8"
            onClick={() => setSelectedMedia(null)}
          >
            <button 
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              onClick={() => setSelectedMedia(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-5xl w-full flex flex-col md:flex-row bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex-1 bg-black flex items-center justify-center max-h-[70vh]">
                <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="w-full md:w-80 p-6 md:p-8 flex flex-col gap-6">
                <div>
                  <h2 className="text-2xl font-bold font-heading mb-2">{selectedMedia.title}</h2>
                  <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-medium">
                    {selectedMedia.category}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Tanggal</span>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar className="w-4 h-4 text-indigo-400" />
                      {selectedMedia.date}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Lokasi</span>
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-4 h-4 text-indigo-400" />
                      {selectedMedia.location}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
