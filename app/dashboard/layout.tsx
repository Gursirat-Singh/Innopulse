"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import type React from "react"
import { LayoutDashboard, Building2, Target, PieChart, Zap, X, LogOut, Menu, Sun, Moon, BarChart3, Clock } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"
import { useTheme } from "@/lib/theme-context"
import Logo from "@/components/logo"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { logout, isLoggedIn, isLoading, user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()

  const navigation = useMemo(() => {
    const baseNav = [
      { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
      { name: "Startups", href: "/dashboard/startups", icon: Building2 },
      { name: "Initiatives", href: "/dashboard/initiatives", icon: Target },
      { name: "Sectors", href: "/dashboard/sectors", icon: PieChart },
    ]

    // Add Pending Startups only for admin users
    if (user?.role === 'admin') {
      baseNav.splice(3, 0, { name: "Pending Startups", href: "/dashboard/pending-startups", icon: Clock })
    }

    return baseNav
  }, [user?.role])

  useEffect(() => {
    // Skip authentication check for PDF generation mode
    const isPdfMode = typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('pdf') === 'true'

    if (!isLoading && !isLoggedIn && !isPdfMode) {
      router.push("/login")
    }
  }, [isLoggedIn, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  // In PDF mode, allow access even without authentication
  const isPdfMode = typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('pdf') === 'true'

  if (!isLoggedIn && !isPdfMode) {
    return null
  }

  // If in PDF export mode, render just the content without the dashboard shell sidebar/nav
  if (isPdfMode) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-background flex">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col glass-strong">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-border">
            <Link href="/" className="flex items-center">
              <Logo size="md" />
            </Link>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-smooth ${
                    isActive
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/40"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={`w-5 h-5 transition-smooth ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}
                  />
                  {item.name}
                  {isActive && <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />}
                </Link>
              )
            })}
          </nav>

          {/* Theme Toggle & Logout */}
          <div className="p-4 space-y-2">
            <Button
              onClick={toggleTheme}
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-card/40 transition-smooth"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-4 h-4" />
                  Dark Mode
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4" />
                  Light Mode
                </>
              )}
            </Button>
            <Button
              onClick={logout}
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-xl px-4 lg:hidden">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          <Logo size="sm" />
        </div>

        <main className="relative z-10 p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
      </div>
    </div>
  )
}
