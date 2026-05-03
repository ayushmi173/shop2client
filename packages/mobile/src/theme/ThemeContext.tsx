import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Color palette
const palette = {
  // Primary - Indigo
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },
  // Secondary - Slate
  secondary: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  // Success - Emerald
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
  },
  // Error - Rose
  error: {
    50: '#FFF1F2',
    100: '#FFE4E6',
    500: '#F43F5E',
    600: '#E11D48',
    700: '#BE123C',
  },
  // Warning - Amber
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
  },
  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
};

// Light theme
const lightTheme = {
  dark: false,
  colors: {
    ...palette,
    background: {
      primary: '#FFFFFF',
      secondary: '#F8FAFC',
      tertiary: '#F1F5F9',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
      tertiary: '#94A3B8',
      inverse: '#FFFFFF',
    },
    border: {
      light: '#E2E8F0',
      default: '#CBD5E1',
      dark: '#94A3B8',
    },
    card: {
      background: '#FFFFFF',
      border: '#E2E8F0',
    },
    input: {
      background: '#F8FAFC',
      backgroundFocused: '#FFFFFF',
      border: '#E2E8F0',
      borderFocused: '#6366F1',
    },
    gradient: {
      primary: ['#6366F1', '#8B5CF6'],
      secondary: ['#EC4899', '#F43F5E'],
      success: ['#10B981', '#059669'],
      warm: ['#F59E0B', '#EF4444'],
    },
  },
};

// Dark theme
const darkTheme = {
  dark: true,
  colors: {
    ...palette,
    background: {
      primary: '#0F172A',
      secondary: '#1E293B',
      tertiary: '#334155',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#CBD5E1',
      tertiary: '#94A3B8',
      inverse: '#0F172A',
    },
    border: {
      light: '#334155',
      default: '#475569',
      dark: '#64748B',
    },
    card: {
      background: '#1E293B',
      border: '#334155',
    },
    input: {
      background: '#1E293B',
      backgroundFocused: '#334155',
      border: '#475569',
      borderFocused: '#818CF8',
    },
    gradient: {
      primary: ['#818CF8', '#A78BFA'],
      secondary: ['#F472B6', '#FB7185'],
      success: ['#34D399', '#10B981'],
      warm: ['#FBBF24', '#F87171'],
    },
  },
};

export type Theme = typeof lightTheme;
export type ThemeColors = typeof lightTheme.colors;

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (mode: 'light' | 'dark' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'app_theme_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_KEY);
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        setThemeMode(saved as 'light' | 'dark' | 'system');
      }
    } catch {}
  };

  const saveThemePreference = async (mode: 'light' | 'dark' | 'system') => {
    try {
      await AsyncStorage.setItem(THEME_KEY, mode);
    } catch {}
  };

  const isDark = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark';
    }
    return themeMode === 'dark';
  }, [themeMode, systemColorScheme]);

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    setThemeMode(newMode);
    saveThemePreference(newMode);
  };

  const setTheme = (mode: 'light' | 'dark' | 'system') => {
    setThemeMode(mode);
    saveThemePreference(mode);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook to get just the colors
export const useColors = (): ThemeColors => {
  const { theme } = useTheme();
  return theme.colors;
};

export { lightTheme, darkTheme, palette };
