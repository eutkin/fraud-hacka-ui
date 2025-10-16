import { login, storeUser, getStoredUser, clearUser } from "@/lib/auth"
import jest from "jest"

describe("Authentication", () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  describe("login", () => {
    it("should return user with correct credentials", () => {
      const user = login("testuser", "testpass123")
      expect(user).not.toBeNull()
      expect(user?.username).toBe("testuser")
      expect(user?.roles).toEqual(["admin", "operator", "analyst"])
    })

    it("should return null with incorrect credentials", () => {
      const user = login("wronguser", "wrongpass")
      expect(user).toBeNull()
    })

    it("should return null with incorrect password", () => {
      const user = login("testuser", "wrongpass")
      expect(user).toBeNull()
    })
  })

  describe("storeUser and getStoredUser", () => {
    it("should store and retrieve user", () => {
      const user = { username: "testuser", roles: ["admin"] as any }
      storeUser(user)

      expect(localStorage.setItem).toHaveBeenCalledWith("user", JSON.stringify(user))

      localStorage.getItem = jest.fn().mockReturnValue(JSON.stringify(user))
      const retrieved = getStoredUser()

      expect(retrieved).toEqual(user)
    })

    it("should return null when no user stored", () => {
      localStorage.getItem = jest.fn().mockReturnValue(null)
      const user = getStoredUser()
      expect(user).toBeNull()
    })
  })

  describe("clearUser", () => {
    it("should remove user from localStorage", () => {
      clearUser()
      expect(localStorage.removeItem).toHaveBeenCalledWith("user")
    })
  })
})
