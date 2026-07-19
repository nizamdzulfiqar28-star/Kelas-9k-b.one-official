import React from 'react';
import { useDataStore } from '@/store/dataStore';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Shield, FileText, Wallet } from 'lucide-react';

export default function StrukturPage() {
  const { organization } = useDataStore();

  const pimpinan = organization.slice(0, 2);
  const sekretariat = organization.slice(2, 4);
  const keuangan = organization.slice(4, 6);

  const renderGroup = (title: string, icon: any, members: typeof organization) => {
    return (
      <div className="mb-16">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          {icon}
          <h2 className="text-xl md:text-2xl font-heading font-bold text-[#CBA358] tracking-wider uppercase">{title}</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
          {members.map((org, i) => (
            <motion.div
              key={org.id || org.role}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5, delay: i * 0.1, type: "spring", bounce: 0.4 }}
              className="w-full sm:w-[280px]"
            >
              <Card className="h-full group hover:-translate-y-2 transition-transform duration-300 overflow-hidden text-center bg-white/5 border border-white/10">
                <div className="aspect-square relative w-full mb-6 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 text-center border-b border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-10 pointer-events-none" />
                  
                  {org.url ? (
                    <img 
                      src={org.url} 
                      alt={org.name} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center relative z-20">
                      <Users className="w-12 h-12 text-[#CBA358]/60 mb-2" />
                      <span className="text-slate-300 font-sans text-xs tracking-widest font-medium uppercase px-2.5 py-1 bg-white/5 border border-white/10 rounded-full">
                        foto pengurus
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-4 inset-x-0 z-20">
                    <span className="inline-block px-4 py-1.5 bg-indigo-600 border border-indigo-500 shadow-xl rounded-full text-xs font-bold uppercase tracking-wider text-white">
                      {org.role}
                    </span>
                  </div>
                </div>
                <CardContent className="pb-8">
                  <h3 className="text-xl font-bold font-heading text-white">{org.name}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Struktur <span className="text-gradient">Organisasi</span></h1>
        <p className="text-slate-400 max-w-2xl mx-auto">Pengurus inti kelas yang siap melayani dan memimpin Kelas 9K B.ONE.</p>
      </div>

      <div className="max-w-5xl mx-auto animate-fade-in">
        {pimpinan.length > 0 && renderGroup("Pimpinan Kelas", <Shield className="w-5 h-5 text-[#CBA358]" />, pimpinan)}
        {sekretariat.length > 0 && renderGroup("Sekretariat", <FileText className="w-5 h-5 text-[#CBA358]" />, sekretariat)}
        {keuangan.length > 0 && renderGroup("Keuangan Kelas", <Wallet className="w-5 h-5 text-[#CBA358]" />, keuangan)}
      </div>
    </div>
  );
}
