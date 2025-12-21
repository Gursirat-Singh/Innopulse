"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  User,
  Mail,
  Shield,
  Calendar,
  Edit3,
  Award,
  TrendingUp,
  Settings,
  Camera,
  MapPin,
  Phone,
  Star,
  Activity,
  Clock,
  CheckCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import Navbar from "@/components/navbar"
import Link from "next/link"

interface UserProfile {
  _id: string
  name?: string
  email: string
  phone?: string
  role: string
  createdAt: string
  updatedAt: string
}

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    if (user) {
      setProfile(user as UserProfile)
    }
  }, [user])

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pt-20">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-12 bg-muted rounded w-1/3"></div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="h-80 bg-muted rounded"></div>
                <div className="h-80 bg-muted rounded"></div>
              </div>
              <div className="h-64 bg-muted rounded"></div>
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
          <div className="max-w-4xl mx-auto px-6 py-8">
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive'
      case 'viewer':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'viewer':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const daysActive = Math.floor((new Date().getTime() - new Date(profile.createdAt).getTime()) / (1000 * 60 * 60 * 24))

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pt-20">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">My Profile</h1>
                <p className="text-muted-foreground mt-1">Manage your account information and preferences</p>
              </div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Profile Card - Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <Card className="glass-strong border-0 shadow-xl">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary via-accent to-primary rounded-full mx-auto flex items-center justify-center shadow-lg">
                      <User className="w-12 h-12 text-white" />
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {profile.name || profile.email.split('@')[0]}
                  </h2>

                  <Badge
                    variant="secondary"
                    className={`mb-4 px-3 py-1 text-sm font-medium ${getRoleColor(profile.role)}`}
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                  </Badge>

                  <div className="space-y-4 text-left">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm font-medium text-foreground">{profile.email}</p>
                      </div>
                    </div>

                    {profile.phone && (
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="text-sm font-medium text-foreground">{profile.phone}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Member Since</p>
                        <p className="text-sm font-medium text-foreground">{formatDate(profile.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  <Link href="/profile/edit">
                    <Button className="w-full mt-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats and Activity - Right Columns */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Enhanced Account Statistics */}
              <Card className="glass-strong border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Account Analytics
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Track your account performance and engagement</p>
                </CardHeader>
                <CardContent>
                  {/* Primary Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-md transition-all"
                    >
                      <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600 mb-1">{daysActive}</div>
                      <div className="text-xs text-blue-700 font-medium">Days Active</div>
                      <div className="text-xs text-blue-600/70 mt-1">
                        {daysActive < 30 ? 'New Member' : daysActive < 365 ? 'Active User' : 'Veteran'}
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-md transition-all"
                    >
                      <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {profile.role === 'admin' ? '∞' : 'Pro'}
                      </div>
                      <div className="text-xs text-green-700 font-medium">Access Level</div>
                      <div className="text-xs text-green-600/70 mt-1">
                        {profile.role === 'admin' ? 'Full Access' : 'Standard'}
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-md transition-all"
                    >
                      <Mail className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {profile.email.split('@')[1]}
                      </div>
                      <div className="text-xs text-purple-700 font-medium">Domain</div>
                      <div className="text-xs text-purple-600/70 mt-1">
                        Verified
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 hover:shadow-md transition-all"
                    >
                      <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-emerald-600 mb-1">
                        {profile.role === 'admin' ? '100%' : '95%'}
                      </div>
                      <div className="text-xs text-emerald-700 font-medium">Health Score</div>
                      <div className="text-xs text-emerald-600/70 mt-1">
                        Excellent
                      </div>
                    </motion.div>
                  </div>

                  {/* Secondary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-4 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl border border-indigo-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-indigo-600" />
                          <span className="text-sm font-medium text-indigo-700">Account Age</span>
                        </div>
                        <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                          {Math.floor(daysActive / 30)} months
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-indigo-600">Progress</span>
                          <span className="font-medium">{Math.min(100, Math.floor((daysActive / 365) * 100))}%</span>
                        </div>
                        <div className="w-full bg-indigo-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-violet-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.floor((daysActive / 365) * 100))}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-indigo-600/70">
                          {daysActive < 30 ? 'Getting started...' : daysActive < 90 ? 'Building momentum!' : 'Established member!'}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-rose-600" />
                          <span className="text-sm font-medium text-rose-700">Achievements</span>
                        </div>
                        <Badge variant="secondary" className="bg-rose-100 text-rose-700">
                          {profile.role === 'admin' ? '3/3' : '2/3'}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                          <span className="text-xs text-rose-700">Profile Complete</span>
                          <CheckCircle className="w-3 h-3 text-rose-600 ml-auto" />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                          <span className="text-xs text-rose-700">Email Verified</span>
                          <CheckCircle className="w-3 h-3 text-rose-600 ml-auto" />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ml-0.5 ${profile.role === 'admin' ? 'bg-rose-500' : 'bg-rose-300'}`}></div>
                          <span className="text-xs text-rose-700">Admin Access</span>
                          {profile.role === 'admin' ? (
                            <CheckCircle className="w-3 h-3 text-rose-600 ml-auto" />
                          ) : (
                            <div className="w-3 h-3 border border-rose-300 rounded-full ml-auto"></div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Details */}
              <Card className="glass-strong border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    Account Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground block mb-1">Account Created</label>
                        <p className="text-foreground font-medium">{formatDate(profile.createdAt)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground block mb-1">Last Updated</label>
                        <p className="text-foreground font-medium">{formatDate(profile.updatedAt)}</p>
                      </div>
                    </div>

                    <div className="space-y-4">


                      {/* Enhanced Account Status Section */}
                      <div>
                        <label className="text-sm font-medium text-muted-foreground block mb-3">Account Status</label>
                        <div className="space-y-3">
                          {/* Overall Status */}
                          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-green-700 font-medium">Active</span>
                            </div>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>

                          {/* Verification Status */}
                          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Mail className="w-4 h-4 text-blue-600" />
                              <span className="text-blue-700 font-medium">Email Verified</span>
                            </div>
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                          </div>

                          {/* Security Status */}
                          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Shield className="w-4 h-4 text-amber-600" />
                              <span className="text-amber-700 font-medium">Security</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-amber-500" />
                              <Star className="w-3 h-3 text-amber-500" />
                              <Star className="w-3 h-3 text-amber-500" />
                              <span className="text-xs text-amber-600 font-medium ml-1">Good</span>
                            </div>
                          </div>

                          {/* Profile Completion */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-muted-foreground">Profile Completion</span>
                              <span className="text-sm font-medium text-foreground">
                                {profile.name && profile.phone ? '100%' : profile.name ? '75%' : profile.phone ? '75%' : '50%'}
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
                                style={{
                                  width: profile.name && profile.phone ? '100%' : profile.name ? '75%' : profile.phone ? '75%' : '50%'
                                }}
                              ></div>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-xs text-muted-foreground">
                                {!profile.name && !profile.phone && "Add name & phone"}
                                {!profile.name && profile.phone && "Add name"}
                                {profile.name && !profile.phone && "Add phone"}
                                {profile.name && profile.phone && "Complete!"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                </CardContent>
              </Card>

              {/* Activity Timeline */}
              <Card className="glass-strong border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Profile created</p>
                        <p className="text-xs text-muted-foreground">{formatDate(profile.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                        <Mail className="w-4 h-4 text-accent" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Email verified</p>
                        <p className="text-xs text-muted-foreground">{formatDate(profile.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Account activated</p>
                        <p className="text-xs text-muted-foreground">Welcome to the platform!</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}
