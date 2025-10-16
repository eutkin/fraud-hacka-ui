"use client"

export type UserRole = "admin" | "operator" | "analyst"

export interface User {
  username: string
  roles: UserRole[]
}

// Test credentials with all three roles
const TEST_USER = {
  username: "testuser",
  password: "testpass123",
  roles: ["admin", "operator", "analyst"] as UserRole[],
}

export function login(username: string, password: string): User | null {
  if (username === TEST_USER.username && password === TEST_USER.password) {
    return {
      username: TEST_USER.username,
      roles: TEST_USER.roles,
    }
  }
  return null
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem("user")
  return stored ? JSON.parse(stored) : null
}

export function storeUser(user: User): void {
  localStorage.setItem("user", JSON.stringify(user))
}

export function clearUser(): void {
  localStorage.removeItem("user")
}
