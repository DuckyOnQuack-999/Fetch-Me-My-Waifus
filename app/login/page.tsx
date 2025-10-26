"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Sparkles, Mail, Lock, User, ArrowLeft, Heart } from "lucide-react"
import { authService } from "@/lib/auth"
import { toast } from "sonner"
import { useActivity } from "@/context/activityContext"
import { storage } from "@/utils/localStorage"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const { addActivity } = useActivity()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({ username: "", email: "", password: "", confirmPassword: "" })
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; delay: number }[]>([])

  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.push("/")
    }

    const hearts = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
    }))
    setFloatingHearts(hearts)
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await authService.login(loginData.email, loginData.password)

      if (result.success && result.user) {
        toast.success("Welcome back! 💖", {
          description: "Login successful",
        })

        storage.setCurrentUser(result.user.id)

        addActivity({
          userId: result.user.id,
          username: result.user.username,
          action: "logged in",
          details: "User successfully authenticated",
          type: "login",
        })

        router.push("/")
      } else {
        toast.error("Login failed", {
          description: result.error || "Please check your credentials",
        })
      }
    } catch (error) {
      toast.error("An error occurred", {
        description: "Please try again",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords don't match", {
        description: "Please make sure both passwords are the same",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await authService.register(registerData.username, registerData.email, registerData.password)

      if (result.success && result.user) {
        toast.success("Welcome to Waifu Hub! 🎉", {
          description: "Your account has been created",
        })

        storage.setCurrentUser(result.user.id)

        addActivity({
          userId: result.user.id,
          username: result.user.username,
          action: "registered",
          details: "New user account created",
          type: "register",
        })

        router.push("/")
      } else {
        toast.error("Registration failed", {
          description: result.error || "Please try again",
        })
      }
    } catch (error) {
      toast.error("An error occurred", {
        description: "Please try again",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await authService.requestPasswordReset(forgotPasswordEmail)

      if (result.success) {
        toast.success("Reset link sent! 📧", {
          description: result.message,
        })
        setShowForgotPassword(false)
        setForgotPasswordEmail("")
      } else {
        toast.error("Request failed", {
          description: result.error || "Please try again",
        })
      }
    } catch (error) {
      toast.error("An error occurred", {
        description: "Please try again",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

      {floatingHearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-primary/20"
          initial={{ y: "100vh", x: `${heart.x}vw`, opacity: 0 }}
          animate={{
            y: "-20vh",
            opacity: [0, 1, 1, 0],
            rotate: [0, 360],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            delay: heart.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <Heart className="h-8 w-8" fill="currentColor" />
        </motion.div>
      ))}

      <motion.div
        className="absolute top-20 left-20"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.7, 0.3],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
      >
        <Sparkles className="h-12 w-12 text-accent/40" />
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-20"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.6, 0.2],
          rotate: [360, 180, 0],
        }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
      >
        <Sparkles className="h-16 w-16 text-primary/40" />
      </motion.div>

      <div className="w-full max-w-md space-y-6 animate-fade-in relative z-10">
        <motion.div
          className="text-center space-y-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex justify-center mb-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent animate-pulse-glow shadow-2xl">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0%", "100%", "0%"],
            }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
            style={{ backgroundSize: "200%" }}
          >
            Welcome to Waifu Hub
          </motion.h1>

          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Your personal anime collection awaits ✨
          </motion.p>
        </motion.div>

        <AnimatePresence mode="wait">
          {showForgotPassword ? (
            <motion.div
              key="forgot-password"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="glass-card animated-border">
                <CardHeader>
                  <Button variant="ghost" size="sm" className="w-fit mb-2" onClick={() => setShowForgotPassword(false)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to login
                  </Button>
                  <CardTitle>Reset Password</CardTitle>
                  <CardDescription>Enter your email to receive a reset link</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="forgot-email"
                          type="email"
                          placeholder="your.email@example.com"
                          className="pl-10"
                          value={forgotPasswordEmail}
                          onChange={(e) => setForgotPasswordEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full btn-glow" disabled={isLoading}>
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                        >
                          <Sparkles className="h-4 w-4" />
                        </motion.div>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="auth-tabs"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="glass-card animated-border">
                <CardHeader>
                  <CardTitle>Authentication</CardTitle>
                  <CardDescription>Sign in or create a new account</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="login" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger
                        value="login"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        Sign In
                      </TabsTrigger>
                      <TabsTrigger
                        value="register"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        Sign Up
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="login-email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="login-email"
                              type="email"
                              placeholder="your.email@example.com"
                              className="pl-10"
                              value={loginData.email}
                              onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="login-password">Password</Label>
                            <Button
                              type="button"
                              variant="link"
                              size="sm"
                              className="text-primary p-0 h-auto"
                              onClick={() => setShowForgotPassword(true)}
                            >
                              Forgot password?
                            </Button>
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="login-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-10 pr-10"
                              value={loginData.password}
                              onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <Button type="submit" className="w-full btn-glow" disabled={isLoading}>
                          {isLoading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                            >
                              <Sparkles className="h-4 w-4" />
                            </motion.div>
                          ) : (
                            <>
                              <Heart className="h-4 w-4 mr-2" fill="currentColor" />
                              Sign In
                            </>
                          )}
                        </Button>
                      </form>
                    </TabsContent>

                    <TabsContent value="register">
                      <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="register-username">Username</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="register-username"
                              type="text"
                              placeholder="Choose a cool username"
                              className="pl-10"
                              value={registerData.username}
                              onChange={(e) => setRegisterData((prev) => ({ ...prev, username: e.target.value }))}
                              required
                              minLength={3}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">At least 3 characters</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="register-email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="register-email"
                              type="email"
                              placeholder="your.email@example.com"
                              className="pl-10"
                              value={registerData.email}
                              onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value }))}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="register-password">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="register-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a strong password"
                              className="pl-10 pr-10"
                              value={registerData.password}
                              onChange={(e) => setRegisterData((prev) => ({ ...prev, password: e.target.value }))}
                              required
                              minLength={8}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            At least 8 characters with uppercase, lowercase, number, and special character
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="register-confirm-password">Confirm Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="register-confirm-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              className="pl-10"
                              value={registerData.confirmPassword}
                              onChange={(e) =>
                                setRegisterData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                              }
                              required
                            />
                          </div>
                        </div>

                        <Button type="submit" className="w-full btn-glow" disabled={isLoading}>
                          {isLoading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                            >
                              <Sparkles className="h-4 w-4" />
                            </motion.div>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Create Account
                            </>
                          )}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.p
          className="text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          By continuing, you agree to our{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </motion.p>
      </div>
    </div>
  )
}
