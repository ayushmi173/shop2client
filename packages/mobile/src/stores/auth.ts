import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { api } from '../lib/api';
import { User, AuthResponse } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  initialize: () => Promise<void>;
  sendOTP: (phone: string) => Promise<{ success: boolean; message?: string }>;
  verifyOTP: (phone: string, otp: string) => Promise<{ success: boolean; isNewUser?: boolean }>;
  updateProfile: (data: { firstName: string; lastName?: string; email?: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const USER_KEY = 'user';

// Safe storage helper for web SSR
const safeGetItem = async (key: string): Promise<string | null> => {
  if (Platform.OS === 'web' && typeof window === 'undefined') {
    return null;
  }
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSetItem = async (key: string, value: string): Promise<void> => {
  if (Platform.OS === 'web' && typeof window === 'undefined') {
    return;
  }
  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    // Ignore storage errors
  }
};

const safeRemoveItem = async (key: string): Promise<void> => {
  if (Platform.OS === 'web' && typeof window === 'undefined') {
    return;
  }
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // Ignore storage errors
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  initialize: async () => {
    try {
      // Skip on SSR
      if (Platform.OS === 'web' && typeof window === 'undefined') {
        set({ isLoading: false });
        return;
      }

      const token = await api.getAccessToken();
      const userJson = await safeGetItem(USER_KEY);
      
      if (token && userJson) {
        try {
          const user = JSON.parse(userJson);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch {
          set({ isLoading: false });
        }
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ isLoading: false });
    }
  },

  sendOTP: async (phone: string) => {
    try {
      const response = await api.post<{ message: string }>('/auth/otp/send', { phone });
      return { success: response.success, message: response.message };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.error?.message || 'Failed to send OTP' 
      };
    }
  },

  verifyOTP: async (phone: string, otp: string) => {
    try {
      const response = await api.post<AuthResponse>('/auth/otp/verify', { phone, otp });
      
      if (response.success && response.data) {
        const { user, tokens, isNewUser } = response.data;
        
        await api.setAccessToken(tokens.accessToken, tokens.refreshToken);
        await safeSetItem(USER_KEY, JSON.stringify(user));
        
        set({ user, isAuthenticated: true });
        
        return { success: true, isNewUser };
      }
      
      return { success: false };
    } catch (error: any) {
      return { success: false };
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await api.put<User>('/auth/profile', data);
      
      if (response.success && response.data) {
        const user = response.data;
        await safeSetItem(USER_KEY, JSON.stringify(user));
        set({ user });
        return true;
      }
      
      return false;
    } catch {
      return false;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore logout errors
    } finally {
      await api.setAccessToken(null);
      await safeRemoveItem(USER_KEY);
      set({ user: null, isAuthenticated: false });
    }
  },

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },
}));
