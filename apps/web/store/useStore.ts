import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/lib/api';

interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: 'USER' | 'OPERATOR' | 'MODERATOR' | 'ADMIN';
}

interface AuthStore {
  user: AuthUser | null;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,

      setUser: (user) => set({ user }),

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await apiClient.post('/auth/login', { email, password });
          set({ user: data.user });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try { await apiClient.post('/auth/logout'); } catch {}
        set({ user: null });
      },

      checkAuth: async () => {
        if (get().user) return;
        try {
          const { data } = await apiClient.get('/users/me');
          set({ user: data.data });
        } catch {
          set({ user: null });
        }
      },
    }),
    { name: 'auth-store', partialize: (s) => ({ user: s.user }) },
  ),
);

interface SearchStore {
  recentSearches: string[];
  addSearch: (q: string) => void;
  clearSearches: () => void;
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      recentSearches: [],
      addSearch: (q) => set({
        recentSearches: [q, ...get().recentSearches.filter(s => s !== q)].slice(0, 10),
      }),
      clearSearches: () => set({ recentSearches: [] }),
    }),
    { name: 'search-store' },
  ),
);
