"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, UserIcon, Zap, Sun, Moon, Menu, X, Bookmark } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from "@/lib/theme-context"
import { useState } from "react"
import Logo from "@/components/logo"

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Insights", href: "#insights" },
  { label: "About", href: "#about" },
]

export default function Navbar() {
  const { isLoggedIn, user, logout, isLoading } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault()
      const el = document.querySelector(href)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      setMobileMenuOpen(false)
    }
  }

  if (isLoading) {
    return (
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
      >
        <div className="mx-4 mt-4 rounded-full bg-background/60 backdrop-blur-2xl border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_20px_40px_-15px_rgba(0,0,0,0.4)] pointer-events-auto">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Logo size="md" />
            </Link>
            <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
          </div>
        </div>
      </motion.nav>
    )
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
      >
        <div className="mx-4 mt-4 rounded-full bg-background/60 backdrop-blur-2xl border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_20px_40px_-15px_rgba(0,0,0,0.4)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),_0_25px_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-500 pointer-events-auto">
          {/* Gradient line at bottom */}
          <div className="absolute bottom-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Logo size="md" />
              </motion.div>
            </Link>

            {/* Center Nav Links — desktop only */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-primary to-accent group-hover:w-3/4 transition-all duration-300 rounded-full" />
                </a>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="rounded-full w-9 h-9 p-0 text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              >
                {theme === 'light' ? (
                  <Moon className="w-[18px] h-[18px]" />
                ) : (
                  <Sun className="w-[18px] h-[18px]" />
                )}
              </Button>

              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden rounded-full w-9 h-9 p-0 text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>

              {!isLoggedIn ? (
                <>
                  <Link href="/login" className="hidden sm:block">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-foreground/5 text-sm">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="sm"
                        className="rounded-full px-5 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity border-0 text-white text-sm font-medium"
                      >
                        Get Started
                      </Button>
                    </motion.div>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard" className="hidden sm:block">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-foreground/5 text-sm">
                      Dashboard
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="rounded-full w-9 h-9 p-0 text-muted-foreground hover:text-foreground hover:bg-foreground/5">
                        <UserIcon className="w-[18px] h-[18px]" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 glass-strong rounded-xl border-white/10">
                      {user?.role === 'admin' ? (
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                      ) : (
                        <>
                          <DropdownMenuItem asChild>
                            <Link href="/profile" className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/dashboard/watchlist" className="flex items-center gap-2 justify-between w-full">
                              <div className="flex items-center gap-2">
                                <Bookmark className="w-4 h-4" />
                                Watchlist
                              </div>
                              {user?.watchlist && user.watchlist.length > 0 && (
                                <span className="bg-primary/20 text-primary text-xs font-bold px-1.5 py-0.5 rounded-full">
                                  {user.watchlist.length}
                               </span>
                              )}
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-destructive focus:text-destructive">
                        <LogOut className="w-4 h-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-[76px] left-4 right-4 z-50 md:hidden rounded-2xl bg-background/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-4"
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-xl transition-colors"
              >
                {link.label}
              </a>
            ))}
            {!isLoggedIn ? (
              <Link
                href="/login"
                className="sm:hidden px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-xl transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log in
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="sm:hidden px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-xl transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </>
  )
}
