import { create } from 'zustand';
import { api } from '../lib/api';
import { 
  WorkerListItem, 
  WorkerDetail, 
  Profession, 
  ServiceRequest,
  WorkerDashboardData,
} from '../types';

interface WorkerFilters {
  profession?: string;
  city?: string;
  minRating?: number;
  verified?: boolean;
  available?: boolean;
  sortBy?: 'trustScore' | 'rating' | 'price' | 'experience' | 'distance';
  search?: string;
}

interface WorkerState {
  // Workers list
  workers: WorkerListItem[];
  isLoadingWorkers: boolean;
  hasMore: boolean;
  page: number;
  filters: WorkerFilters;
  
  // Selected worker detail
  selectedWorker: WorkerDetail | null;
  isLoadingDetail: boolean;
  
  // Professions
  professions: Profession[];
  isLoadingProfessions: boolean;
  
  // Worker dashboard (for worker role)
  dashboardData: WorkerDashboardData | null;
  isLoadingDashboard: boolean;
  pendingRequests: ServiceRequest[];
  
  // Actions
  fetchWorkers: (reset?: boolean) => Promise<void>;
  fetchWorkerById: (id: string) => Promise<void>;
  fetchProfessions: () => Promise<void>;
  setFilters: (filters: Partial<WorkerFilters>) => void;
  clearFilters: () => void;
  
  // Worker dashboard actions
  fetchDashboard: () => Promise<void>;
  updateAvailability: (isAvailable: boolean) => Promise<boolean>;
  acceptRequest: (requestId: string) => Promise<boolean>;
  rejectRequest: (requestId: string, reason?: string) => Promise<boolean>;
}

export const useWorkerStore = create<WorkerState>((set, get) => ({
  // Initial state
  workers: [],
  isLoadingWorkers: false,
  hasMore: true,
  page: 1,
  filters: {},
  
  selectedWorker: null,
  isLoadingDetail: false,
  
  professions: [],
  isLoadingProfessions: false,
  
  dashboardData: null,
  isLoadingDashboard: false,
  pendingRequests: [],

  fetchWorkers: async (reset = false) => {
    const { page, filters, isLoadingWorkers, hasMore } = get();
    
    if (isLoadingWorkers || (!reset && !hasMore)) return;
    
    const currentPage = reset ? 1 : page;
    set({ isLoadingWorkers: true });
    
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      });
      
      if (filters.profession) params.append('profession', filters.profession);
      if (filters.city) params.append('city', filters.city);
      if (filters.minRating) params.append('minRating', filters.minRating.toString());
      if (filters.verified) params.append('verified', 'true');
      if (filters.available) params.append('available', 'true');
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.search) params.append('search', filters.search);
      
      const response = await api.get<WorkerListItem[]>(
        `/workers/search?${params.toString()}`
      );
      
      if (response.success && response.data) {
        const newWorkers = Array.isArray(response.data) ? response.data : [];
        
        set({
          workers: reset ? newWorkers : [...get().workers, ...newWorkers],
          page: currentPage + 1,
          hasMore: newWorkers.length === 10,
        });
      }
    } catch (error) {
      console.error('Error fetching workers:', error);
    } finally {
      set({ isLoadingWorkers: false });
    }
  },

  fetchWorkerById: async (id: string) => {
    set({ isLoadingDetail: true, selectedWorker: null });
    
    try {
      const response = await api.get<WorkerDetail>(`/workers/${id}`);
      
      if (response.success && response.data) {
        set({ selectedWorker: response.data as WorkerDetail });
      }
    } catch (error) {
      console.error('Error fetching worker:', error);
    } finally {
      set({ isLoadingDetail: false });
    }
  },

  fetchProfessions: async () => {
    if (get().professions.length > 0) return;
    
    set({ isLoadingProfessions: true });
    
    try {
      const response = await api.get<Profession[]>('/professions');
      
      if (response.success && response.data) {
        const professions = Array.isArray(response.data) ? response.data : [];
        set({ professions });
      }
    } catch (error) {
      console.error('Error fetching professions:', error);
    } finally {
      set({ isLoadingProfessions: false });
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    // Reset and refetch with new filters
    get().fetchWorkers(true);
  },

  clearFilters: () => {
    set({ filters: {} });
    get().fetchWorkers(true);
  },

  // Worker Dashboard Actions
  fetchDashboard: async () => {
    set({ isLoadingDashboard: true });
    
    try {
      const response = await api.get<WorkerDashboardData>('/workers/me/dashboard');
      
      if (response.success && response.data) {
        set({ 
          dashboardData: response.data,
          pendingRequests: response.data.pendingRequests || [],
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      set({ isLoadingDashboard: false });
    }
  },

  updateAvailability: async (isAvailable: boolean) => {
    try {
      const response = await api.patch<{ isAvailable: boolean }>(
        '/workers/me/availability', 
        { isAvailable }
      );
      
      if (response.success) {
        set((state) => ({
          dashboardData: state.dashboardData 
            ? { ...state.dashboardData, isAvailable }
            : null,
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  acceptRequest: async (requestId: string) => {
    try {
      const response = await api.post(`/service-requests/${requestId}/accept`);
      
      if (response.success) {
        // Remove from pending, add to active
        set((state) => ({
          pendingRequests: state.pendingRequests.filter((r) => r.id !== requestId),
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  rejectRequest: async (requestId: string, reason?: string) => {
    try {
      const response = await api.post(`/service-requests/${requestId}/reject`, { reason });
      
      if (response.success) {
        set((state) => ({
          pendingRequests: state.pendingRequests.filter((r) => r.id !== requestId),
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
}));
