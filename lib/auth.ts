interface User {
  id: string
  username: string
  email: string
  avatar?: string
  createdAt: Date
  preferences: {
    theme: string
    notifications: boolean
    autoDownload: boolean
  }
  subscription: {
    plan: "free" | "pro"
    validUntil?: Date
  }
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

class AuthService {
  private readonly STORAGE_KEY = "waifu_auth_state"
  private readonly USERS_KEY = "waifu_users"

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return null

      const state: AuthState = JSON.parse(stored)
      return state.user
    } catch (error) {
      console.error("Failed to get current user:", error)
      return null
    }
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }

  async login(email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      // Get all users
      const users = this.getAllUsers()

      // Find user by email
      const user = users.find((u) => u.email === email)

      if (!user) {
        return { success: false, error: "Invalid email or password" }
      }

      // In a real app, you'd verify the password hash here
      // For demo purposes, we're just checking if the user exists

      // Save auth state
      const authState: AuthState = {
        user,
        isAuthenticated: true,
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authState))

      return { success: true, user }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "Login failed. Please try again." }
    }
  }

  async register(
    username: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      // Validate input
      if (!username || username.length < 3) {
        return { success: false, error: "Username must be at least 3 characters" }
      }
      if (!email || !email.includes("@")) {
        return { success: false, error: "Please enter a valid email" }
      }
      if (!password || password.length < 6) {
        return { success: false, error: "Password must be at least 6 characters" }
      }

      // Get all users
      const users = this.getAllUsers()

      // Check if email already exists
      if (users.some((u) => u.email === email)) {
        return { success: false, error: "Email already registered" }
      }

      // Check if username already exists
      if (users.some((u) => u.username === username)) {
        return { success: false, error: "Username already taken" }
      }

      // Create new user
      const newUser: User = {
        id: crypto.randomUUID(),
        username,
        email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        createdAt: new Date(),
        preferences: {
          theme: "dark",
          notifications: true,
          autoDownload: false,
        },
        subscription: {
          plan: "free",
        },
      }

      // Save user to users list
      users.push(newUser)
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users))

      // Save auth state
      const authState: AuthState = {
        user: newUser,
        isAuthenticated: true,
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authState))

      return { success: true, user: newUser }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false, error: "Registration failed. Please try again." }
    }
  }

  logout(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  updateUser(updates: Partial<User>): User | null {
    try {
      const currentUser = this.getCurrentUser()
      if (!currentUser) return null

      const updatedUser = { ...currentUser, ...updates }

      // Update in auth state
      const authState: AuthState = {
        user: updatedUser,
        isAuthenticated: true,
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authState))

      // Update in users list
      const users = this.getAllUsers()
      const userIndex = users.findIndex((u) => u.id === currentUser.id)
      if (userIndex !== -1) {
        users[userIndex] = updatedUser
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users))
      }

      return updatedUser
    } catch (error) {
      console.error("Update user error:", error)
      return null
    }
  }

  private getAllUsers(): User[] {
    try {
      const stored = localStorage.getItem(this.USERS_KEY)
      if (!stored) return []
      return JSON.parse(stored)
    } catch (error) {
      console.error("Failed to get users:", error)
      return []
    }
  }
}

export const authService = new AuthService()
export type { User, AuthState }
