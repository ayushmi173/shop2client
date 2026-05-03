import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthTokens } from '@/types';
import { api } from '@/lib/api';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  setAuth: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  refreshTokens: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isLoading: false,
      isAuthenticated: false,

      setAuth: (user, tokens) => {
        api.setAccessToken(tokens.accessToken);
        set({
          user,
          tokens,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: async () => {
        try {
          const { tokens } = get();
          if (tokens) {
            await api.post('/api/v1/auth/logout', {
              refreshToken: tokens.refreshToken,
            });
          }
        } catch (error) {
          // Ignore errors on logout
        }

        api.setAccessToken(null);
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
        });
      },

      refreshTokens: async () => {
        const { tokens } = get();
        if (!tokens?.refreshToken) return;

        try {
          const response = await api.post<AuthTokens>('/api/v1/auth/refresh', {
            refreshToken: tokens.refreshToken,
          });

          if (response.success && response.data) {
            api.setAccessToken(response.data.accessToken);
            set({ tokens: response.data });
          }
        } catch (error) {
          // If refresh fails, logout
          get().logout();
        }
      },
    }),
    {
      name: 'localconnect-auth',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
