import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'OWNER' | 'ADMIN' | 'USER' | null;

interface AuthState {
  isAuthenticated: boolean;
  role: Role;
  user: { name: string; username: string; role: Role } | null;
  login: (username: string, role: Role) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      role: null,
      user: null,
      login: (username, role) => set({ 
        isAuthenticated: true, 
        role, 
        user: { name: username === 'nizam.dev' ? 'Nizam DzR' : 'Admin User', username, role } 
      }),
      logout: () => set({ isAuthenticated: false, role: null, user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
