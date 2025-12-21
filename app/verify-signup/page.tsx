"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Shield,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  RotateCcw,
  Mail,
  Sun,
  Moon,
  LayoutDashboard
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTheme } from "@/lib/theme-context"
import { useAuth } from "@/lib/auth-context"


export default function VerifySignupPage() {
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const { theme, toggleTheme } = useTheme()
  const { isLoggedIn } = useAuth()

  useEffect(() => {
    if (!email) {
      router.push("/register")
    }
  }, [email, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setMessage("")

    try {
      const response = await fetch("/api/auth/signup-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (response.ok && data.verified && data.token) {
        setMessage("Account created successfully! Logging you in...")

        // Store the JWT token
        localStorage.setItem("token", data.token)

        // Redirect to home page after successful login
        setTimeout(() => {
          window.location.href = "/"
        }, 1500)
      } else {
        setError(data.message || "Invalid OTP")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full blur-3xl opacity-30" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-strong rounded-3xl p-8 shadow-2xl border border-border/50 backdrop-blur-xl text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-500/25">
                  <AlertCircle className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Invalid Access</h2>
              <p className="text-muted-foreground mb-6">
                Please start from the registration page.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-primary-foreground font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Go to Register
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-3xl opacity-30" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-500/10 to-pink-500/10 rounded-full blur-3xl opacity-20" />
      </div>

      {/* Back to Dashboard Button */}
      {isLoggedIn && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.3 }}
          className="fixed top-6 left-6 z-20"
        >
          <Link href="/dashboard">
            <button className="w-12 h-12 bg-background/80 backdrop-blur-xl border border-border/50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group">
              <LayoutDashboard className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
            </button>
          </Link>
        </motion.div>
      )}

      {/* Theme Toggle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.3 }}
        className="fixed top-6 right-6 z-20"
      >
        <button
          onClick={toggleTheme}
          className="w-12 h-12 bg-background/80 backdrop-blur-xl border border-border/50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        >
          <motion.div
            initial={false}
            animate={{ rotate: theme === 'dark' ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
            ) : (
              <Sun className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
            )}
          </motion.div>
        </button>
      </motion.div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/25">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Verify Your Account
            </h1>
            <p className="mt-3 text-muted-foreground text-lg">
              Enter the 6-digit code sent to
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{email}</span>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="glass-strong rounded-3xl p-8 shadow-2xl border border-border/50 backdrop-blur-xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Field */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="space-y-4"
              >
                <Label htmlFor="otp" className="text-sm font-semibold text-foreground flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Verification Code
                </Label>
                <div className="relative">
                  <Input
                    id="otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="h-16 text-center text-3xl font-mono tracking-[0.5em] bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-300 placeholder:text-muted-foreground/30"
                    placeholder="000000"
                    disabled={isLoading}
                  />
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <div className="flex gap-1">
                    {Array.from({ length: 6 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          i < otp.length ? "bg-primary" : "bg-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span>{otp.length}/6 digits</span>
                </div>
              </motion.div>



              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Success Message */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-4 bg-green-50/50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-800/50 rounded-xl text-green-700 dark:text-green-400 text-sm"
                >
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{message}</span>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Verifying Code...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Verify Account
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-8 space-y-4 text-center"
            >
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">
                  Didn't receive the code?
                </p>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Register again
                </Link>
              </div>

              <div className="pt-4 border-t border-border/50">
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  ← Back to Login
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
