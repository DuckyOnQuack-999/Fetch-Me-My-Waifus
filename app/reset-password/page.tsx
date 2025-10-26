"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Lock, Sparkles, CheckCircle, XCircle } from "lucide-react"
import { authService } from "@/lib/auth"
import { toast } from "sonner"
import { motion } from "framer-motion"
import Link from "next/link"

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [token, setToken] = useState<string | null>(null)
  const [passwordStrength, setPasswordStrength] = useState({
    hasLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
  })

  useEffect(() => {
    const resetToken = searchParams.get("token")
    setToken(resetToken)

    if (!resetToken) {
      toast.error("Invalid reset link")
      router.push("/login")
    }
  }, [searchParams, router])

  useEffect(() => {
    setPasswordStrength({
      hasLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    })
  }, [password])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords don't match")
      return
    }

    if (!token) {
      toast.error("Invalid reset token")
      return
    }

    setIsLoading(true)

    try {
      const result = await authService.resetPassword(token, password)

      if (result.success) {
        toast.success("Password reset successful! 🎉", {
          description: "You can now login with your new password",
        })
        router.push("/login")
      } else {
        toast.error("Reset failed", {
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

  const isPasswordValid = Object.values(passwordStrength).every((v) => v)

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <motion.div
          className="text-center space-y-2"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-4">
            <motion.div
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent animate-pulse-glow"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Lock className="h-10 w-10 text-white" />
            </motion.div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Reset Your Password
          </h1>
          <p className="text-muted-foreground">Create a new secure password</p>
        </motion.div>

        <Card className="glass-card animated-border">
          <CardHeader>
            <CardTitle>New Password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password strength indicator */}
              {password && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                  <p className="text-sm font-medium">Password requirements:</p>
                  <div className="space-y-1">
                    {[
                      { key: "hasLength", label: "At least 8 characters" },
                      { key: "hasUpper", label: "One uppercase letter" },
                      { key: "hasLower", label: "One lowercase letter" },
                      { key: "hasNumber", label: "One number" },
                      { key: "hasSpecial", label: "One special character" },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-2 text-sm">
                        {passwordStrength[key as keyof typeof passwordStrength] ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span
                          className={
                            passwordStrength[key as keyof typeof passwordStrength]
                              ? "text-green-500"
                              : "text-muted-foreground"
                          }
                        >
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              <Button type="submit" className="w-full btn-glow" disabled={isLoading || !isPasswordValid}>
                {isLoading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}>
                    <Sparkles className="h-4 w-4" />
                  </motion.div>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
