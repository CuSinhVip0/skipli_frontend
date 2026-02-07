import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { AuthUser } from "@/types"

interface AuthStore {
    user: AuthUser | null
    isAuthenticated: boolean
    setUser: (user: AuthUser) => void
    logout: () => void
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,

            setUser: (user) => set({ user, isAuthenticated: true }),

            logout: () => {
                set({ user: null, isAuthenticated: false })

                if (typeof window !== "undefined") {
                    localStorage.removeItem("user-skipli")
                }
            },
        }),
        {
            name: "user-skipli",
            storage: createJSONStorage(() => localStorage),
        },
    ),
)
