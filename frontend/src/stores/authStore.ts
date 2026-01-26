import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, authApi, getErrorMessage } from '@/lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => {
        if (token) {
          localStorage.setItem('jwtToken', token);
        } else {
          localStorage.removeItem('jwtToken');
        }
        set({ token });
      },
      setLoading: (isLoading) => set({ isLoading }),

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login({ email, password });
          get().setToken(response.jwtToken);
          
          // Fetch user profile after login
          await get().fetchProfile();
        } catch (error) {
          throw new Error(getErrorMessage(error));
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true });
        try {
          const response = await authApi.register({ name, email, password });
          set({ 
            user: {
              userId: response.userId,
              name: response.name,
              email: response.email,
              isAccountVerified: response.isAccountVerified,
            }
          });
        } catch (error) {
          throw new Error(getErrorMessage(error));
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        localStorage.removeItem('jwtToken');
        set({ user: null, token: null, isAuthenticated: false });
      },

      fetchProfile: async () => {
        try {
          const profile = await authApi.getProfile();
          set({ 
            user: profile, 
            isAuthenticated: true 
          });
        } catch (error) {
          set({ user: null, isAuthenticated: false });
          throw new Error(getErrorMessage(error));
        }
      },

      checkAuth: async () => {
        const token = get().token || localStorage.getItem('jwtToken');
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return false;
        }

        try {
          const response = await authApi.isAuthenticated();
          if (response) {
            await get().fetchProfile();
            return true;
          }
          return false;
        } catch {
          get().logout();
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
