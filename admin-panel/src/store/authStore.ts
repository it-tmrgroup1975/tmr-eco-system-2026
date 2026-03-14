import { create } from 'zustand';

interface User {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  setAuth: (user: User, access: string, refresh: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setAuth: (user, access, refresh) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    set({ user });
  },
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null });
    window.location.href = '/login';
  },
}));