"use client"

import { create } from "zustand"
import type { User } from "./auth"

interface AuthStore {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => {
    set({ user: null })
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
    }
  },
}))
