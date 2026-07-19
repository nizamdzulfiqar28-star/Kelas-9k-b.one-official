import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image, Trophy, Users, Calendar, Eye } from 'lucide-react';
import { useDataStore } from '@/store/dataStore';
import { students } from '@/data/mockData';

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const { documentations, achievements, schedules, visitorCount, activities } = useDataStore();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  function formatRelativeTime(timestamp: string) {
    try {
      const now = new Date();
      const past = new Date(timestamp);
      const diffMs = now.getTime() - past.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Baru saja';
      if (diffMins < 60) return `${diffMins} menit yang lalu`;
      if (diffHours < 24) return `${diffHours} jam yang lalu`;
      return `${diffDays} hari yang lalu`;
    } catch (e) {
      return 'Beberapa waktu lalu';
    }
  }

  const stats = [
    { name: 'Total Siswa', value: students.length.toString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { name: 'Dokumentasi', value: documentations.length.toString(), icon: Image, color: 'text-pink-400', bg: 'bg-pink-400/10' },
    { name: 'Prestasi', value: achievements.length.toString(), icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { name: 'Jadwal Aktif', value: schedules.length.toString(), icon: Calendar, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { name: 'Pengunjung Website', value: visitorCount.toString(), icon: Eye, color: 'text-[#d4af37]', bg: 'bg-[#d4af37]/10' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-white/5 rounded-lg animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-white/5 rounded-2xl animate-pulse mt-8" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-heading font-bold text-white mb-6">Dashboard Statistik</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-white/5 border border-white/10">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${stat.bg} shrink-0`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400 leading-tight">{stat.name}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="bg-white/5 border border-white/10">
        <CardHeader className="border-b border-white/10 pb-4">
          <CardTitle className="text-lg font-heading text-white">Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {activities && activities.length > 0 ? (
              activities.map((activity, i) => (
                <div key={activity.id || i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-colors">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-200">
                      <span className="text-[#CBA358] font-semibold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-mono">{formatRelativeTime(activity.timestamp)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-slate-400">Belum ada aktivitas terekam.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
