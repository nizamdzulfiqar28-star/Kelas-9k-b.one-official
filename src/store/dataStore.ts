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

const CLOUD_BIN_URL = '/api/sync';

const pushToCloud = async (state: any) => {
  if (!hasSyncedFromCloud) {
    console.warn('[DataStore] Skipping push to cloud because initial cloud sync has not completed.');
    return;
  }
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
        { id: '2', name: 'Admin', username: 'admin', password: 'adminpassword', role: 'ADMIN' },
        { id: '3', name: 'Typani', username: 'typani', password: 'typani', role: 'ADMIN' }
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
          const res = await fetch(`${CLOUD_BIN_URL}?t=${Date.now()}`);
          if (res.ok) {
            const cloudData = await res.json();
            
            // Check if cloudData is valid and not a fallback/empty state
            if (cloudData && !cloudData._fallback) {
              const localState = useDataStore.getState();
              
              // 1. Resolve users (ensure default seed users are always included)
              const cloudUsers = cloudData.users || [];
              const defaultUsers: User[] = [
                { id: '1', name: 'Nizam DzR', username: 'nizam.dev', password: 'nizam280212', role: 'OWNER' },
                { id: '2', name: 'Admin', username: 'admin', password: 'adminpassword', role: 'ADMIN' },
                { id: '3', name: 'Typani', username: 'typani', password: 'typani', role: 'ADMIN' }
              ];
              const userMap = new Map<string, User>();
              defaultUsers.forEach(u => userMap.set(u.username.toLowerCase().trim(), u));
              cloudUsers.forEach((u: any) => {
                if (u.username) {
                  userMap.set(u.username.toLowerCase().trim(), u);
                }
              });
              const resolvedUsers = Array.from(userMap.values());
              
              // 2. Direct overwrite for items (no split-brain merging of deleted items)
              set({
                users: resolvedUsers,
                achievements: cloudData.achievements || [],
                documentations: cloudData.documentations || [],
                schedules: (cloudData.schedules && cloudData.schedules.length > 0) ? cloudData.schedules : localState.schedules,
                pickets: (cloudData.pickets && cloudData.pickets.length > 0) ? cloudData.pickets : localState.pickets,
                organization: (cloudData.organization && cloudData.organization.length > 0) ? cloudData.organization : localState.organization,
                visitorCount: cloudData.visitorCount !== undefined ? cloudData.visitorCount : localState.visitorCount,
                activities: cloudData.activities || [],
                isSyncing: false
              });
              
              hasSyncedFromCloud = true;
              console.log('[DataStore] Successfully synced from cloud and initialized local state.');
              return;
            } else {
              console.warn('[DataStore] Cloud returned a fallback or empty state, keeping local values.');
            }
          } else {
            console.error(`[DataStore] Failed to fetch cloud data: ${res.status}`);
          }
        } catch (err) {
          console.error('[DataStore] Error during syncFromCloud:', err);
        }
        
        // If we failed to get valid cloud data but reached here, we still set synced to true 
        // to allow the user to make local modifications that can be saved
        hasSyncedFromCloud = true;
        set({ isSyncing: false });
      },
      syncToCloud: async () => {
        const currentState = useDataStore.getState();
        await pushToCloud(currentState);
      },

      incrementVisitorCount: () => {
        set((state) => ({ visitorCount: state.visitorCount + 1 }));
        pushToCloud(useDataStore.getState());
      },
      clearActivities: () => {
        set(() => ({ activities: [] }));
        pushToCloud(useDataStore.getState());
      },

      addUser: (user) => {
        set((state) => ({ users: [...state.users, { ...user, id: Date.now().toString() }] }));
        pushToCloud(useDataStore.getState());
      },
      updateUser: (id, user) => {
        set((state) => ({
          users: state.users.map((u) => u.id === id ? { ...user, id } : u)
        }));
        pushToCloud(useDataStore.getState());
      },
      deleteUser: (id) => {
        set((state) => ({
          users: state.users.filter((u) => u.id !== id)
        }));
        pushToCloud(useDataStore.getState());
      },

      addAchievement: (item) => {
        set((state) => {
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
        });
        pushToCloud(useDataStore.getState());
      },
      updateAchievement: (id, item) => {
        set((state) => {
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
        });
        pushToCloud(useDataStore.getState());
      },
      deleteAchievement: (id) => {
        set((state) => {
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
        });
        pushToCloud(useDataStore.getState());
      },
      
      addDocumentation: (item) => {
        set((state) => {
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
        });
        pushToCloud(useDataStore.getState());
      },
      updateDocumentation: (id, item) => {
        set((state) => {
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
        });
        pushToCloud(useDataStore.getState());
      },
      deleteDocumentation: (id) => {
        set((state) => {
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
        });
        pushToCloud(useDataStore.getState());
      },
      
      updateSchedule: (day, subjects) => {
        set((state) => {
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
        });
        pushToCloud(useDataStore.getState());
      },
      
      updatePickets: (day, students) => {
        set((state) => {
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
        });
        pushToCloud(useDataStore.getState());
      },
      
      updateOrgMember: (id, member) => {
        set((state) => {
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
        });
        pushToCloud(useDataStore.getState());
      },
      
      addOrgMember: (member) => {
        set((state) => {
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
        });
        pushToCloud(useDataStore.getState());
      },

      deleteOrgMember: (id) => {
        set((state) => {
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
        });
        pushToCloud(useDataStore.getState());
      }
    }),
    {
      name: 'class-data-storage-v3',
      merge: (persistedState: any, currentState) => {
        const merged = { ...currentState, ...(persistedState as any) };
        
        // Ensure default hardcoded/seeded users are always merged with persisted users (by username)
        const userMap = new Map<string, User>();
        if (currentState.users) {
          currentState.users.forEach(u => {
            if (u.username) userMap.set(u.username.toLowerCase().trim(), u);
          });
        }
        if (persistedState && persistedState.users) {
          persistedState.users.forEach((u: any) => {
            if (u.username) userMap.set(u.username.toLowerCase().trim(), u);
          });
        }
        merged.users = Array.from(userMap.values());
        
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

