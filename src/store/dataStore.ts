import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { students, documentation, schedule, pickets, achievements, organization } from '@/data/mockData';
import { useAuthStore } from './authStore';
import { supabase } from '../lib/supabase';

let hasSyncedFromCloud = false;
let isSubscribed = false;

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
    console.warn('[DataStore] Backup REST sync notice:', err);
  }

  try {
    const keys = ['users', 'achievements', 'documentations', 'schedules', 'pickets', 'organization', 'visitorCount', 'activities'];
    const upserts = keys.map(key => ({
      key,
      value: state[key]
    }));
    const { error } = await supabase.from('class_data').upsert(upserts);
    if (error) {
      console.warn('[DataStore] Supabase upsert error:', error.message);
    } else {
      console.log('[DataStore] Successfully pushed state to Supabase.');
    }
  } catch (err) {
    console.error('[DataStore] Error syncing to Supabase:', err);
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

        const fallbackRestSync = async () => {
          try {
            const res = await fetch(`${CLOUD_BIN_URL}?t=${Date.now()}`);
            if (res.ok) {
              const cloudData = await res.json();
              if (cloudData && !cloudData._fallback) {
                const localState = useDataStore.getState();
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
                
                set({
                  users: resolvedUsers,
                  achievements: cloudData.achievements || [],
                  documentations: cloudData.documentations || [],
                  schedules: (cloudData.schedules && cloudData.schedules.length > 0) ? cloudData.schedules : localState.schedules,
                  pickets: (cloudData.pickets && cloudData.pickets.length > 0) ? cloudData.pickets : localState.pickets,
                  organization: (cloudData.organization && cloudData.organization.length > 0) ? cloudData.organization : localState.organization,
                  visitorCount: cloudData.visitorCount !== undefined ? cloudData.visitorCount : localState.visitorCount,
                  activities: cloudData.activities || []
                });
                hasSyncedFromCloud = true;
                console.log('[DataStore] Fallback REST sync completed successfully.');
              }
            }
          } catch (err) {
            console.error('[DataStore] Fallback REST sync failed:', err);
          }
        };

        try {
          console.log('[DataStore] Attempting to sync from Supabase...');
          const { data, error } = await supabase.from('class_data').select('*');
          
          if (error) {
            console.warn('[DataStore] Supabase select error (tables might not exist yet):', error.message);
            await fallbackRestSync();
          } else if (data && data.length > 0) {
            const stateUpdate: any = {};
            data.forEach((row: any) => {
              stateUpdate[row.key] = row.value;
            });
            
            const defaultUsers: User[] = [
              { id: '1', name: 'Nizam DzR', username: 'nizam.dev', password: 'nizam280212', role: 'OWNER' },
              { id: '2', name: 'Admin', username: 'admin', password: 'adminpassword', role: 'ADMIN' },
              { id: '3', name: 'Typani', username: 'typani', password: 'typani', role: 'ADMIN' }
            ];
            const userMap = new Map<string, User>();
            defaultUsers.forEach(u => userMap.set(u.username.toLowerCase().trim(), u));
            (stateUpdate.users || []).forEach((u: any) => {
              if (u.username) {
                userMap.set(u.username.toLowerCase().trim(), u);
              }
            });
            stateUpdate.users = Array.from(userMap.values());

            const localState = useDataStore.getState();
            set({
              users: stateUpdate.users,
              achievements: stateUpdate.achievements || [],
              documentations: stateUpdate.documentations || [],
              schedules: (stateUpdate.schedules && stateUpdate.schedules.length > 0) ? stateUpdate.schedules : localState.schedules,
              pickets: (stateUpdate.pickets && stateUpdate.pickets.length > 0) ? stateUpdate.pickets : localState.pickets,
              organization: (stateUpdate.organization && stateUpdate.organization.length > 0) ? stateUpdate.organization : localState.organization,
              visitorCount: stateUpdate.visitorCount !== undefined ? stateUpdate.visitorCount : localState.visitorCount,
              activities: stateUpdate.activities || []
            });
            hasSyncedFromCloud = true;
            console.log('[DataStore] Successfully synced from Supabase.');
          } else {
            console.log('[DataStore] Supabase table is empty. Running fallback REST sync to populate...');
            await fallbackRestSync();
            const currentState = useDataStore.getState();
            await pushToCloud(currentState);
          }
        } catch (err) {
          console.error('[DataStore] Error during Supabase sync:', err);
          await fallbackRestSync();
        }

        // Setup real-time postgres changes subscription
        if (!isSubscribed) {
          console.log('[DataStore] Initializing Supabase Realtime subscription...');
          supabase
            .channel('public:class_data')
            .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'class_data' },
              (payload) => {
                console.log('[DataStore] Real-time table change received:', payload);
                if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                  const { key, value } = payload.new as { key: string; value: any };
                  if (key && value !== undefined) {
                    set({ [key]: value } as any);
                  }
                }
              }
            )
            .subscribe((status) => {
              console.log('[DataStore] Supabase subscription status:', status);
            });
          isSubscribed = true;
        }

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
        const id = Date.now().toString();
        set((state) => ({ users: [...state.users, { ...user, id }] }));
        
        // Background register in Supabase Auth to pre-create credentials
        const email = `${user.username.trim().toLowerCase()}@kelas9k.com`;
        supabase.auth.signUp({
          email,
          password: user.password || 'defaultpassword',
          options: {
            data: { name: user.name, role: user.role }
          }
        }).then(({ error }) => {
          if (error) console.warn('[DataStore] Background user signup warning:', error.message);
          else console.log('[DataStore] Background user registered in Supabase Auth successfully.');
        }).catch(err => {
          console.warn('[DataStore] Background user signup caught error:', err);
        });

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

