import { storage } from "@/utils/localStorage"

interface User {
  id: string
  username: string
  email: string
  password: string
  avatar?: string
  createdAt: Date
  lastLogin?: Date
  preferences: {
    theme: string
    notifications: boolean
    autoDownload: boolean
  }
  subscription: {
    plan: "free" | "pro"
    validUntil?: Date
  }
  resetToken?: string
  resetTokenExpiry?: Date
}

interface AuthState {
  user: Omit<User, "password"> | null
  isAuthenticated: boolean
  sessionExpiry?: Date
}

class AuthService {
  private readonly STORAGE_KEY = "waifu_auth_state"
  private readonly USERS_KEY = "waifu_users"
  private readonly SESSION_DURATION = 7 * 24 * 60 * 60 * 1000

  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(password + "waifu_salt_2024")
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    const inputHash = await this.hashPassword(password)
    return inputHash === hash
  }

  private isSessionValid(state: AuthState): boolean {
    if (!state.sessionExpiry) return false
    return new Date() < new Date(state.sessionExpiry)
  }

  getCurrentUser(): Omit<User, "password"> | null {
    if (typeof window === "undefined") return null

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return null

      const state: AuthState = JSON.parse(stored)

      if (!this.isSessionValid(state)) {
        this.logout()
        return null
      }

      return state.user
    } catch (error) {
      console.error("Failed to get current user:", error)
      return null
    }
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string; user?: Omit<User, "password"> }> {
    try {
      if (!email || !password) {
        return { success: false, error: "Email and password are required" }
      }

      const users = this.getAllUsers()
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

      if (!user) {
        return { success: false, error: "Invalid email or password" }
      }

      const isValidPassword = await this.verifyPassword(password, user.password)
      if (!isValidPassword) {
        return { success: false, error: "Invalid email or password" }
      }

      user.lastLogin = new Date()
      this.updateUserInStorage(user)

      const { password: _, ...userWithoutPassword } = user
      const sessionExpiry = new Date(Date.now() + this.SESSION_DURATION)

      const authState: AuthState = {
        user: userWithoutPassword,
        isAuthenticated: true,
        sessionExpiry,
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authState))

      return { success: true, user: userWithoutPassword }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "Login failed. Please try again." }
    }
  }

  async register(
    username: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string; user?: Omit<User, "password"> }> {
    try {
      if (!username || username.length < 3) {
        return { success: false, error: "Username must be at least 3 characters" }
      }

      if (!email || !this.isValidEmail(email)) {
        return { success: false, error: "Please enter a valid email address" }
      }

      if (!password || password.length < 8) {
        return { success: false, error: "Password must be at least 8 characters" }
      }

      if (!this.isStrongPassword(password)) {
        return { success: false, error: "Password must contain uppercase, lowercase, number, and special character" }
      }

      const users = this.getAllUsers()

      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, error: "Email already registered" }
      }

      if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
        return { success: false, error: "Username already taken" }
      }

      const hashedPassword = await this.hashPassword(password)

      const newUser: User = {
        id: crypto.randomUUID(),
        username,
        email: email.toLowerCase(),
        password: hashedPassword,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        createdAt: new Date(),
        lastLogin: new Date(),
        preferences: {
          theme: "dark",
          notifications: true,
          autoDownload: false,
        },
        subscription: {
          plan: "free",
        },
      }

      users.push(newUser)
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users))

      storage.initializeUserStorage(newUser.id)

      const { password: _, ...userWithoutPassword } = newUser
      const sessionExpiry = new Date(Date.now() + this.SESSION_DURATION)

      const authState: AuthState = {
        user: userWithoutPassword,
        isAuthenticated: true,
        sessionExpiry,
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authState))

      return { success: true, user: userWithoutPassword }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false, error: "Registration failed. Please try again." }
    }
  }

  async requestPasswordReset(email: string): Promise<{ success: boolean; error?: string; message?: string }> {
    try {
      if (!email || !this.isValidEmail(email)) {
        return { success: false, error: "Please enter a valid email address" }
      }

      const users = this.getAllUsers()
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

      if (!user) {
        return {
          success: true,
          message: "If an account exists with this email, a password reset link has been sent.",
        }
      }

      const resetToken = crypto.randomUUID()
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000)

      user.resetToken = resetToken
      user.resetTokenExpiry = resetTokenExpiry

      this.updateUserInStorage(user)

      console.log("Password reset token:", resetToken)
      console.log("Reset link: /reset-password?token=" + resetToken)

      return {
        success: true,
        message: "If an account exists with this email, a password reset link has been sent.",
      }
    } catch (error) {
      console.error("Password reset error:", error)
      return { success: false, error: "Failed to process password reset request" }
    }
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ success: boolean; error?: string; message?: string }> {
    try {
      if (!token) {
        return { success: false, error: "Invalid reset token" }
      }

      if (!newPassword || newPassword.length < 8) {
        return { success: false, error: "Password must be at least 8 characters" }
      }

      if (!this.isStrongPassword(newPassword)) {
        return { success: false, error: "Password must contain uppercase, lowercase, number, and special character" }
      }

      const users = this.getAllUsers()
      const user = users.find((u) => u.resetToken === token)

      if (!user || !user.resetTokenExpiry) {
        return { success: false, error: "Invalid or expired reset token" }
      }

      if (new Date() > new Date(user.resetTokenExpiry)) {
        return { success: false, error: "Reset token has expired" }
      }

      const hashedPassword = await this.hashPassword(newPassword)
      user.password = hashedPassword
      user.resetToken = undefined
      user.resetTokenExpiry = undefined

      this.updateUserInStorage(user)

      return { success: true, message: "Password has been reset successfully" }
    } catch (error) {
      console.error("Password reset error:", error)
      return { success: false, error: "Failed to reset password" }
    }
  }

  logout(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  updateUser(updates: Partial<Omit<User, "password">>): Omit<User, "password"> | null {
    try {
      const currentUser = this.getCurrentUser()
      if (!currentUser) return null

      const users = this.getAllUsers()
      const userIndex = users.findIndex((u) => u.id === currentUser.id)

      if (userIndex === -1) return null

      const fullUser = users[userIndex]
      const updatedUser = { ...fullUser, ...updates }

      users[userIndex] = updatedUser
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users))

      const { password: _, ...userWithoutPassword } = updatedUser

      const authState: AuthState = {
        user: userWithoutPassword,
        isAuthenticated: true,
        sessionExpiry: new Date(Date.now() + this.SESSION_DURATION),
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authState))

      return userWithoutPassword
    } catch (error) {
      console.error("Update user error:", error)
      return null
    }
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<{ success: boolean; error?: string; message?: string }> {
    try {
      const currentUser = this.getCurrentUser()
      if (!currentUser) {
        return { success: false, error: "Not authenticated" }
      }

      if (!newPassword || newPassword.length < 8) {
        return { success: false, error: "Password must be at least 8 characters" }
      }

      if (!this.isStrongPassword(newPassword)) {
        return { success: false, error: "Password must contain uppercase, lowercase, number, and special character" }
      }

      const users = this.getAllUsers()
      const user = users.find((u) => u.id === currentUser.id)

      if (!user) {
        return { success: false, error: "User not found" }
      }

      const isValidPassword = await this.verifyPassword(currentPassword, user.password)
      if (!isValidPassword) {
        return { success: false, error: "Current password is incorrect" }
      }

      const hashedPassword = await this.hashPassword(newPassword)
      user.password = hashedPassword

      this.updateUserInStorage(user)

      return { success: true, message: "Password changed successfully" }
    } catch (error) {
      console.error("Change password error:", error)
      return { success: false, error: "Failed to change password" }
    }
  }

  private updateUserInStorage(user: User): void {
    const users = this.getAllUsers()
    const userIndex = users.findIndex((u) => u.id === user.id)

    if (userIndex !== -1) {
      users[userIndex] = user
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users))
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

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  private isStrongPassword(password: string): boolean {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
  }
}

export const authService = new AuthService()
export type { User, AuthState }
