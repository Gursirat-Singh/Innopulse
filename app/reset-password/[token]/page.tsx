"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  Shield,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Sun,
  Moon,
  Home,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/lib/theme-context";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [passwordStrength, setPasswordStrength] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const otp = searchParams.get('otp')
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    if (!email || !otp) {
      router.push('/forgot-password')
    }
  }, [email, otp, router])

  const checkPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return ''
    if (pwd.length < 8) return 'Password must be at least 8 characters'
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pwd)) {
      return 'Password should contain uppercase, lowercase, and number'
    }
    return 'Strong password'
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    setPasswordStrength(checkPasswordStrength(newPassword))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setMessage('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Password reset successfully! Redirecting to login...')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        setError(data.message || 'An error occurred')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-3xl opacity-30" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-500/10 to-pink-500/10 rounded-full blur-3xl opacity-20" />
      </div>

      {/* Back to Home Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.3 }}
        className="fixed top-6 left-6 z-20"
      >
        <Link href="/">
          <button className="w-12 h-12 bg-background/80 backdrop-blur-xl border border-border/50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group">
            <Home className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
          </button>
        </Link>
      </motion.div>

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
          {/* Invalid Access State */}
          {(!email || !otp) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-strong rounded-3xl p-8 shadow-2xl border border-border/50 backdrop-blur-xl text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-500/25">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
                Invalid Access
              </h1>
              <p className="text-muted-foreground mb-6">
                Please complete the OTP verification first.
              </p>
              <Button
                onClick={() => router.push('/forgot-password')}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Start Over
              </Button>
            </motion.div>
          )}

          {/* Main Reset Password Form */}
          {email && otp && (
            <>
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
                  Reset Password
                </h1>
                <p className="mt-3 text-muted-foreground text-lg">
                  Enter your new secure password below
                </p>
              </motion.div>

              {/* Reset Password Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="glass-strong rounded-3xl p-8 shadow-2xl border border-border/50 backdrop-blur-xl"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Password Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="password" className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary" />
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={handlePasswordChange}
                        className="h-12 pl-4 pr-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-300 placeholder:text-muted-foreground/70"
                        placeholder="Enter new password"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {passwordStrength && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`text-sm flex items-center gap-2 ${
                          passwordStrength === 'Strong password'
                            ? 'text-green-600'
                            : 'text-yellow-600'
                        }`}
                      >
                        {passwordStrength === 'Strong password' ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <AlertCircle className="w-4 h-4" />
                        )}
                        {passwordStrength}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Confirm Password Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-12 pl-4 pr-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-300 placeholder:text-muted-foreground/70"
                        placeholder="Confirm new password"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
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
                      className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-600 text-sm"
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
                      disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
                      className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Resetting Password...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          Reset Password
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </form>

                {/* Back to Login Link */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="mt-8 text-center"
                >
                  <p className="text-muted-foreground">
                    Remember your password?{" "}
                    <Link
                      href="/login"
                      className="text-primary hover:text-primary/80 font-semibold transition-colors"
                    >
                      Sign in here
                    </Link>
                  </p>
                </motion.div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
