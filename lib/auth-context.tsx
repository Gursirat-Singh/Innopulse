"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { isAuthenticated, logout as authLogout, getUserFromToken } from './auth'
import api from './api'

interface User {
  _id: string
  name?: string
  email: string
  phone?: string
  role: string
  createdAt: string
  updatedAt: string
  watchlist?: string[]
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isLoggedIn: boolean
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = async () => {
    // Skip authentication in PDF mode
    const isPdfMode = typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('pdf') === 'true'

    if (isPdfMode) {
      setUser(null)
      setIsLoading(false)
      return
    }

    if (!isAuthenticated()) {
      setUser(null)
      setIsLoading(false)
      return
    }

    try {
      const response = await api.get(`/auth/profile?_t=${Date.now()}`)
      setUser(response.data)
    } catch (error: any) {
      console.error('Failed to fetch user profile:', error)
      // If token is invalid, clear localStorage and logout
      if (error.response?.status === 401 || error.message?.includes('invalid')) {
        localStorage.removeItem('token')
      }
      authLogout()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    authLogout()
    setUser(null)
    window.location.href = '/'
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const value = {
    user,
    isLoading,
    isLoggedIn: !!user,
    logout,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
