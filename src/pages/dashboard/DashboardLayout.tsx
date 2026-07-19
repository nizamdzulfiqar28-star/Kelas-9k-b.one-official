import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Image, Trophy, Calendar, CalendarDays, 
  Users, UserCircle, Settings, LogOut, ShieldAlert, ShieldCheck
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

const adminLinks = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { name: 'Dokumentasi', to: '/dashboard/dokumentasi', icon: Image },
  { name: 'Prestasi', to: '/dashboard/prestasi', icon: Trophy },
  { name: 'Jadwal', to: '/dashboard/jadwal', icon: Calendar },
  { name: 'Piket', to: '/dashboard/piket', icon: CalendarDays },
  { name: 'Struktur Organisasi', to: '/dashboard/struktur', icon: Users },
  { name: 'Daftar Siswa', to: '/dashboard/murid', icon: UserCircle },
];

const ownerLinks = [
  { name: 'Kelola Owner', to: '/dashboard/owners', icon: ShieldAlert },
  { name: 'Kelola Admin', to: '/dashboard/admins', icon: ShieldCheck },
  { name: 'Pengaturan', to: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout() {
  const { user, role, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen relative z-10">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 flex flex-col md:flex-row container mx-auto px-6 md:px-12 gap-8">
        {/* Navigation Sidebar for Desktop, scrollable horizontal on mobile */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col gap-2 text-center">
            <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-2 text-xl font-bold border border-indigo-500/30">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <h3 className="font-heading font-bold text-lg">{user?.name}</h3>
            <span className="text-xs font-semibold px-3 py-1 bg-white/10 rounded-full inline-block mx-auto text-slate-300">
              Role: {role}
            </span>
          </div>

          <nav className="glass-panel rounded-3xl p-4 border border-white/10 flex flex-col gap-1 md:overflow-y-auto md:max-h-[calc(100vh-250px)]">
            {adminLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/dashboard'}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                  isActive ? "bg-indigo-500/20 text-indigo-300" : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </NavLink>
            ))}

            {role === 'OWNER' && (
              <>
                <div className="h-px bg-white/10 my-3 mx-4" />
                <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Owner Only</div>
                {ownerLinks.map(link => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                      isActive ? "bg-pink-500/20 text-pink-300" : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.name}
                  </NavLink>
                ))}
              </>
            )}

            <div className="h-px bg-white/10 my-3 mx-4" />
            <button
              onClick={handleLogout}
              className="flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </nav>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 glass-panel rounded-3xl p-6 md:p-10 border border-white/10 min-h-[60vh]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
