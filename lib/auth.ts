import { storage } from "@/utils/localStorage"

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  createdAt: string
  preferences: {
    theme: "light" | "dark"
    notifications: boolean
    language: string
  }
  subscription: {
    plan: "free" | "pro" | "enterprise"
    expiresAt?: string
  }
}

class AuthService {
  private currentUser: User | null = null
  private readonly STORAGE_KEY = "waifu_auth_user"
  private readonly SESSION_KEY = "waifu_auth_session"

  constructor() {
    this.loadUser()
  }

  private loadUser() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        this.currentUser = JSON.parse(stored)
      }
    } catch (error) {
      console.error("Failed to load user:", error)
    }
  }

  private saveUser(user: User) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user))
      this.currentUser = user
    } catch (error) {
      console.error("Failed to save user:", error)
    }
  }

  async register(
    username: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Check if user already exists
      const existingUsers = this.getAllUsers()
      if (existingUsers.some((u) => u.email === email)) {
        return { success: false, error: "Email already registered" }
      }

      if (existingUsers.some((u) => u.username === username)) {
        return { success: false, error: "Username already taken" }
      }

      // Create new user
      const user: User = {
        id: crypto.randomUUID(),
        username,
        email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        createdAt: new Date().toISOString(),
        preferences: {
          theme: "dark",
          notifications: true,
          language: "en",
        },
        subscription: {
          plan: "free",
        },
      }

      // Store password hash (in production, use proper hashing)
      const passwordHash = btoa(password) // Simple encoding for demo
      storage.set(`password_${user.id}`, passwordHash)

      // Save user to storage
      existingUsers.push(user)
      storage.set("all_users", JSON.stringify(existingUsers))

      this.saveUser(user)
      this.createSession(user.id)

      return { success: true, user }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false, error: "Registration failed" }
    }
  }

  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const users = this.getAllUsers()
      const user = users.find((u) => u.email === email)

      if (!user) {
        return { success: false, error: "User not found" }
      }

      // Verify password
      const storedHash = storage.get(`password_${user.id}`)
      const inputHash = btoa(password)

      if (storedHash !== inputHash) {
        return { success: false, error: "Invalid password" }
      }

      this.saveUser(user)
      this.createSession(user.id)

      return { success: true, user }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "Login failed" }
    }
  }

  logout() {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
      localStorage.removeItem(this.SESSION_KEY)
      this.currentUser = null
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null && this.hasValidSession()
  }

  updateUser(updates: Partial<User>): boolean {
    if (!this.currentUser) return false

    try {
      const updatedUser = { ...this.currentUser, ...updates }
      this.saveUser(updatedUser)

      // Update in all users list
      const users = this.getAllUsers()
      const index = users.findIndex((u) => u.id === updatedUser.id)
      if (index !== -1) {
        users[index] = updatedUser
        storage.set("all_users", JSON.stringify(users))
      }

      return true
    } catch (error) {
      console.error("Failed to update user:", error)
      return false
    }
  }

  updatePreferences(preferences: Partial<User["preferences"]>): boolean {
    if (!this.currentUser) return false

    return this.updateUser({
      preferences: { ...this.currentUser.preferences, ...preferences },
    })
  }

  upgradeToPro(): boolean {
    if (!this.currentUser) return false

    return this.updateUser({
      subscription: {
        plan: "pro",
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
      },
    })
  }

  private createSession(userId: string) {
    const session = {
      userId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    }
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session))
  }

  private hasValidSession(): boolean {
    try {
      const stored = localStorage.getItem(this.SESSION_KEY)
      if (!stored) return false

      const session = JSON.parse(stored)
      return new Date(session.expiresAt) > new Date()
    } catch {
      return false
    }
  }

  private getAllUsers(): User[] {
    try {
      const stored = storage.get("all_users")
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }
}

export const authService = new AuthService()
