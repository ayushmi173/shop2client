import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { ApiResponse } from '../types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

class ApiClient {
  private baseUrl: string;
  private accessToken: string | null = null;
  private tokenLoaded: boolean = false;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Don't load token in constructor to avoid SSR issues
  }

  private async loadToken() {
    if (this.tokenLoaded) return;
    // Skip on server-side rendering
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return;
    }
    try {
      this.accessToken = await AsyncStorage.getItem(TOKEN_KEY);
      this.tokenLoaded = true;
    } catch (error) {
      console.error('Error loading token:', error);
    }
  }

  async setAccessToken(token: string | null, refreshToken?: string | null) {
    this.accessToken = token;
    try {
      if (token) {
        await AsyncStorage.setItem(TOKEN_KEY, token);
        if (refreshToken) {
          await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }
      } else {
        await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
      }
    } catch (error) {
      console.error('Error saving token:', error);
    }
  }

  async getAccessToken(): Promise<string | null> {
    await this.loadToken();
    if (this.accessToken) return this.accessToken;
    // Skip on server-side rendering
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return null;
    }
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = await this.getAccessToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      return data;
    } catch (error: any) {
      if (error.error) {
        throw error;
      }
      throw {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error.message || 'Network error occurred',
        },
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient(API_BASE_URL);
export { API_BASE_URL };
