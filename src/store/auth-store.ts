import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface User {
    id: string
    email: string
    name: string
}

interface AuthState {
    user: User | null
    accessToken: string | null
    refreshToken: string | null // For header-based auth fallback
    isAuthenticated: boolean
    setAuth: (user: User, accessToken: string, refreshToken?: string) => void
    setAccessToken: (token: string) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            setAuth: (user, accessToken, refreshToken) => 
                set({ user, accessToken, refreshToken: refreshToken || null, isAuthenticated: true }),
            setAccessToken: (accessToken) => set({ accessToken }),
            logout: () => set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
)
