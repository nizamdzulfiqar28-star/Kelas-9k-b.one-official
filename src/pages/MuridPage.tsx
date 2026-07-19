import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { students } from '@/data/mockData';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';

export default function MuridPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.absen.includes(searchQuery)
  );

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4">
          Daftar Absen Murid <span className="text-gradient">kelas 9k B.one</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">Daftar lengkap absen dan jenis kelamin siswa kelas 9K B.ONE.</p>
      </div>

      <div className="mb-8 max-w-md mx-auto relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Cari nama atau nomor absen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-slate-400"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredStudents.map((student, i) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10px" }}
            transition={{ duration: 0.4, delay: (i % 6) * 0.05, type: "spring", bounce: 0.3 }}
          >
            <Card className="hover:scale-[1.01] transition-transform">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center shrink-0">
                  <span className="font-heading font-bold text-slate-400">{student.absen}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate text-slate-100">{student.name}</h3>
                  <p className="text-sm text-slate-500 truncate">
                    {student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {filteredStudents.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          Tidak ada murid dengan nama atau absen tersebut.
        </div>
      )}
    </div>
  );
}
