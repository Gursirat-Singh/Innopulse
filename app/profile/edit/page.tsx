"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  User,
  Mail,
  Phone,
  ArrowLeft,
  Save,
  Camera,
  Shield,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import Navbar from "@/components/navbar"

interface UserProfile {
  _id: string
  name?: string
  email: string
  phone?: string
  role: string
  createdAt: string
  updatedAt: string
}

interface FormData {
  name: string
  phone: string
}

interface FormErrors {
  name?: string
  phone?: string
  general?: string
}

export default function EditProfilePage() {
  const { user, isLoading, refreshUser } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState<FormData>({ name: '', phone: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (user) {
      const userProfile = user as UserProfile
      setProfile(userProfile)
      setFormData({
        name: userProfile.name || '',
        phone: userProfile.phone || ''
      })
    }
  }, [user])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long'
    }

    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setErrors({})

    if (!profile) {
      throw new Error('User profile not available')
    }

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: profile._id,
          name: formData.name.trim(),
          phone: formData.phone.trim() || undefined
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }

      const updatedUser = await response.json()

      // Refresh the user data in the auth context
      await refreshUser()

      setSuccessMessage('Profile updated successfully!')

      // Redirect back to profile page after a short delay
      setTimeout(() => {
        router.push('/profile')
      }, 2000)

    } catch (error) {
      console.error('Profile update error:', error)
      setErrors({
        general: error instanceof Error ? error.message : 'Failed to update profile'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pt-20">
          <div className="max-w-2xl mx-auto px-6 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-12 bg-muted rounded w-1/2"></div>
              <div className="h-80 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pt-20">
          <div className="max-w-2xl mx-auto px-6 py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-4">Profile Not Found</h1>
              <p className="text-muted-foreground">Unable to load your profile information.</p>
            </motion.div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pt-20">
        <div className="max-w-2xl mx-auto px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <Button
                onClick={() => router.back()}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Edit Profile</h1>
                <p className="text-muted-foreground mt-1">Update your personal information</p>
              </div>
            </div>
          </motion.div>

          {/* Success Message */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">{successMessage}</span>
            </motion.div>
          )}

          {/* Error Message */}
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-700 font-medium">{errors.general}</span>
            </motion.div>
          )}

          {/* Profile Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-strong border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Profile Avatar */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary via-accent to-primary rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-12 h-12 text-white" />
                    </div>
                    <p className="text-sm text-muted-foreground">Profile picture upload coming soon</p>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        className={errors.name ? 'border-red-500 focus:border-red-500' : ''}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email Field (Read-only) */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          readOnly
                          className="bg-muted/50 cursor-not-allowed"
                        />
                        <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                        className={errors.phone ? 'border-red-500 focus:border-red-500' : ''}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Role Display */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Account Role</Label>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={`px-3 py-1 ${profile.role === 'admin' ? 'text-red-600 bg-red-50 border-red-200' : 'text-blue-600 bg-blue-50 border-blue-200'}`}
                        >
                          <Shield className="w-3 h-3 mr-1" />
                          {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Account role cannot be changed</p>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="pt-6 border-t border-border/50">
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            Save Changes
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  )
}
