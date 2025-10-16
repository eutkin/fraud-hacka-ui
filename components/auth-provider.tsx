"use client"

import type React from "react"

import { useEffect } from "react"
import { useAuthStore } from "@/lib/store"
import { getStoredUser } from "@/lib/auth"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser)

  useEffect(() => {
    const user = getStoredUser()
    if (user) {
      setUser(user)
    }
  }, [setUser])

  return <>{children}</>
}
