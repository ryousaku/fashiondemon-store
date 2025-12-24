import { create } from 'zustand';

interface User {
    id: number;
    email: string;
    role: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    login: (user: User, token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>((set) => {
    const storedToken = localStorage.getItem('token');
    // Simple check, real app might validate token validity on init
    const initialToken = storedToken || null;

    return {
        user: null,
        token: initialToken,
        isAuthenticated: !!initialToken,
        login: (user, token) => {
            localStorage.setItem('token', token);
            set({ user, token, isAuthenticated: true });
        },
        logout: () => {
            localStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false });
        },
    };
});
