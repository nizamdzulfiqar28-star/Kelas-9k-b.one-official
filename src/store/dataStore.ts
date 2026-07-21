import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { students, documentation, schedule, pickets, achievements, organization } from '@/data/mockData';
import { useAuthStore } from './authStore';

let hasSyncedFromCloud = false;

export type UserRole = 'OWNER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  password?: string;
}

export interface Achievement {
  id: string;
  title: string;
  level: string;
  year: string;
  desc: string;
  url: string;
}

export interface Documentation {
  id: string;
  title: string;
  type: string;
  url: string;
  date: string;
  location: string;
  category: string;
}

export interface DaySchedule {
  day: string;
  subjects: string[];
}

export interface PicketDay {
  day: string;
  students: string[];
}

export interface OrgMember {
  id: string;
  role: string;
  name: string;
  url: string;
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
}

interface DataState {
  users: User[];
  achievements: Achievement[];
  documentations: Documentation[];
  schedules: DaySchedule[];
  pickets: PicketDay[];
  organization: OrgMember[];
  visitorCount: number;
  activities: Activity[];
  
  incrementVisitorCount: () => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Omit<User, 'id'>) => void;
  deleteUser: (id: string) => void;

  addAchievement: (item: Achievement) => void;
  updateAchievement: (id: string, item: Achievement) => void;
  deleteAchievement: (id: string) => void;

  addDocumentation: (item: Documentation) => void;
  updateDocumentation: (id: string, item: Documentation) => void;
  deleteDocumentation: (id: string) => void;

  updateSchedule: (day: string, subjects: string[]) => void;
  
  updatePickets: (day: string, students: string[]) => void;
  
  updateOrgMember: (id: string, member: Partial<OrgMember>) => void;
  addOrgMember: (member: Omit<OrgMember, 'id'>) => void;
  deleteOrgMember: (id: string) => void;
  clearActivities: () => void;
  isSyncing: boolean;
  syncFromCloud: () => Promise<void>;
  syncToCloud: () => Promise<void>;
}

const CLOUD_BIN_URL = 'https://extendsclass.com/api/json-storage/bin/acbefed';

const pushToCloud = async (state: any) => {
  try {
    const payload = {
      users: state.users,
      achievements: state.achievements,
      documentations: state.documentations,
      schedules: state.schedules,
      pickets: state.pickets,
      organization: state.organization,
      visitorCount: state.visitorCount,
      activities: state.activities,
      lastUpdated: new Date().toISOString()
    };
    await fetch(CLOUD_BIN_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error('Error syncing to cloud:', err);
  }
};

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      users: [
        { id: '1', name: 'Nizam DzR', username: 'nizam.dev', password: 'nizam280212', role: 'OWNER' },
        { id: '2', name: 'Admin', username: 'admin', password: 'adminpassword', role: 'ADMIN' }
      ],
      achievements: achievements,
      documentations: documentation,
      schedules: schedule,
      pickets: pickets,
      organization: organization,
      visitorCount: 142, // Seed value
      activities: [
        { id: 'act-1', user: 'Nizam DzR', action: 'mengupdate Website Kelas B.ONE', timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
        { id: 'act-2', user: 'Admin', action: 'menambahkan Dokumentasi "Study Tour Bali"', timestamp: new Date(Date.now() - 3600000 * 5).toISOString() }
      ],
      
      isSyncing: false,
      syncFromCloud: async () => {
        set({ isSyncing: true });
        try {
          const res = await fetch(CLOUD_BIN_URL);
          if (res.ok) {
            const cloudData = await res.json();
            if (cloudData && cloudData.users && cloudData.users.length > 0) {
              set({
                users: cloudData.users,
                achievements: cloudData.achievements || [],
                documentations: cloudData.documentations || [],
                schedules: cloudData.schedules || [],
                pickets: cloudData.pickets || [],
                organization: cloudData.organization || [],
                visitorCount: cloudData.visitorCount || 142,
                activities: cloudData.activities || [],
                isSyncing: false
              });
              hasSyncedFromCloud = true;
              return;
            } else {
              const currentState = useDataStore.getState();
              await pushToCloud(currentState);
              hasSyncedFromCloud = true;
            }
          }
        } catch (err) {
          console.error('Error syncing from cloud:', err);
        }
        set({ isSyncing: false });
      },
      syncToCloud: async () => {
        const currentState = useDataStore.getState();
        await pushToCloud(currentState);
      },

      incrementVisitorCount: () => set((state) => ({ visitorCount: state.visitorCount + 1 })),
      clearActivities: () => set(() => ({ activities: [] })),

      addUser: (user) => set((state) => ({ users: [...state.users, { ...user, id: Date.now().toString() }] })),
      updateUser: (id, user) => set((state) => ({
        users: state.users.map((u) => u.id === id ? { ...user, id } : u)
      })),
      deleteUser: (id) => set((state) => ({
        users: state.users.filter((u) => u.id !== id)
      })),

      addAchievement: (item) => set((state) => {
        const userName = useAuthStore.getState().user?.name || 'Seseorang';
        const newActivity: Activity = {
          id: Date.now().toString(),
          user: userName,
          action: `menambahkan Prestasi baru "${item.title}"`,
          timestamp: new Date().toISOString()
        };
        return { 
          achievements: [...state.achievements, item],
          activities: [newActivity, ...state.activities].slice(0, 50)
        };
      }),
      updateAchievement: (id, item) => set((state) => {
        const userName = useAuthStore.getState().user?.name || 'Seseorang';
        const newActivity: Activity = {
          id: Date.now().toString(),
          user: userName,
          action: `mengupdate Prestasi "${item.title}"`,
          timestamp: new Date().toISOString()
        };
        return {
          achievements: state.achievements.map((a) => a.id === id ? item : a),
          activities: [newActivity, ...state.activities].slice(0, 50)
        };
      }),
      deleteAchievement: (id) => set((state) => {
        const userName = useAuthStore.getState().user?.name || 'Seseorang';
        const item = state.achievements.find((a) => a.id === id);
        const newActivity: Activity = {
          id: Date.now().toString(),
          user: userName,
          action: `menghapus Prestasi "${item?.title || 'tidak dikenal'}"`,
          timestamp: new Date().toISOString()
        };
        return {
          achievements: state.achievements.filter((a) => a.id !== id),
          activities: [newActivity, ...state.activities].slice(0, 50)
        };
      }),
      
      addDocumentation: (item) => set((state) => {
        const userName = useAuthStore.getState().user?.name || 'Seseorang';
        const newActivity: Activity = {
          id: Date.now().toString(),
          user: userName,
          action: `menambahkan Dokumentasi baru "${item.title}"`,
          timestamp: new Date().toISOString()
        };
        return { 
          documentations: [...state.documentations, item],
          activities: [newActivity, ...state.activities].slice(0, 50)
        };
      }),
      updateDocumentation: (id, item) => set((state) => {
        const userName = useAuthStore.getState().user?.name || 'Seseorang';
        const newActivity: Activity = {
          id: Date.now().toString(),
          user: userName,
          action: `mengupdate Dokumentasi "${item.title}"`,
          timestamp: new Date().toISOString()
        };
        return {
          documentations: state.documentations.map((d) => d.id === id ? item : d),
          activities: [newActivity, ...state.activities].slice(0, 50)
        };
      }),
      deleteDocumentation: (id) => set((state) => {
        const userName = useAuthStore.getState().user?.name || 'Seseorang';
        const item = state.documentations.find((d) => d.id === id);
        const newActivity: Activity = {
          id: Date.now().toString(),
          user: userName,
          action: `menghapus Dokumentasi "${item?.title || 'tidak dikenal'}"`,
          timestamp: new Date().toISOString()
        };
        return {
          documentations: state.documentations.filter((d) => d.id !== id),
          activities: [newActivity, ...state.activities].slice(0, 50)
        };
      }),
      
      updateSchedule: (day, subjects) => set((state) => {
        const userName = useAuthStore.getState().user?.name || 'Seseorang';
        const newActivity: Activity = {
          id: Date.now().toString(),
          user: userName,
          action: `mengubah Jadwal Pelajaran hari ${day}`,
          timestamp: new Date().toISOString()
        };
        return {
          schedules: state.schedules.map((s) => s.day === day ? { ...s, subjects } : s),
          activities: [newActivity, ...state.activities].slice(0, 50)
        };
      }),
      
      updatePickets: (day, students) => set((state) => {
        const userName = useAuthStore.getState().user?.name || 'Seseorang';
        const newActivity: Activity = {
          id: Date.now().toString(),
          user: userName,
          action: `mengubah Jadwal Piket hari ${day}`,
          timestamp: new Date().toISOString()
        };
        return {
          pickets: state.pickets.map((p) => p.day === day ? { ...p, students } : p),
          activities: [newActivity, ...state.activities].slice(0, 50)
        };
      }),
      
      updateOrgMember: (id, member) => set((state) => {
        const userName = useAuthStore.getState().user?.name || 'Seseorang';
        const existingMember = state.organization.find((o) => o.id === id);
        const memberRole = existingMember?.role || member.role || 'Struktur';
        const newActivity: Activity = {
          id: Date.now().toString(),
          user: userName,
          action: `mengupdate Struktur Organisasi (${memberRole})`,
          timestamp: new Date().toISOString()
        };
        return {
          organization: state.organization.map((o) => o.id === id ? { ...o, ...member } : o),
          activities: [newActivity, ...state.activities].slice(0, 50)
        };
      }),
      
      addOrgMember: (member) => set((state) => {
        const userName = useAuthStore.getState().user?.name || 'Seseorang';
        const newActivity: Activity = {
          id: Date.now().toString(),
          user: userName,
          action: `menambahkan Jabatan Organisasi Baru (${member.role})`,
          timestamp: new Date().toISOString()
        };
        const newMember: OrgMember = {
          id: Date.now().toString(),
          ...member
        };
        return {
          organization: [...state.organization, newMember],
          activities: [newActivity, ...state.activities].slice(0, 50)
        };
      }),

      deleteOrgMember: (id) => set((state) => {
        const userName = useAuthStore.getState().user?.name || 'Seseorang';
        const existingMember = state.organization.find((o) => o.id === id);
        const memberRole = existingMember?.role || 'Struktur';
        const newActivity: Activity = {
          id: Date.now().toString(),
          user: userName,
          action: `menghapus Jabatan Organisasi (${memberRole})`,
          timestamp: new Date().toISOString()
        };
        return {
          organization: state.organization.filter((o) => o.id !== id),
          activities: [newActivity, ...state.activities].slice(0, 50)
        };
      })
    }),
    {
      name: 'class-data-storage-v3',
      merge: (persistedState: any, currentState) => {
        const merged = { ...currentState, ...(persistedState as any) };
        
        // Ensure critical fields are never undefined or completely empty if defaults exist
        if (!merged.schedules || merged.schedules.length === 0) {
          merged.schedules = currentState.schedules;
        }
        if (!merged.pickets || merged.pickets.length === 0) {
          merged.pickets = currentState.pickets;
        }
        if (!merged.organization || merged.organization.length === 0) {
          merged.organization = currentState.organization;
        }
        if (!merged.users || merged.users.length === 0) {
          merged.users = currentState.users;
        }
        if (!merged.documentations) {
          merged.documentations = currentState.documentations;
        }
        if (!merged.achievements) {
          merged.achievements = currentState.achievements;
        }
        return merged;
      }
    }
  )
);

// Subscribe to store updates and push to cloud automatically with a 1-second debounce
let syncTimeout: any = null;
useDataStore.subscribe((state) => {
  if (state.isSyncing) return; // don't sync while pulling
  if (!hasSyncedFromCloud) {
    console.log("Auto-sync to cloud skipped: App has not fetched the latest cloud database yet. This prevents overwriting with stale local cache.");
    return;
  }
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => {
    pushToCloud(state);
  }, 1000);
});
