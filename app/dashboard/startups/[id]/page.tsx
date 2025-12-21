"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Building2,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  ExternalLink,
  Mail,
  Phone,
  Globe,
  TrendingUp,
  Target,
  ArrowLeft,
  Eye,
  UserCheck,
  Clock,
  UserX,
  Edit,
  MoreHorizontal,
  BarChart3,
  LineChart,
  PieChart,
} from "lucide-react"
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  PieChart as RechartsPieChart,
  Cell,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getStartupById } from "@/lib/services/startup.services"

interface Startup {
  _id: string
  name: string
  sector: string
  city: string
  stage: "Ideation" | "Seed" | "Series A" | "Series B" | "Growth"
  funding: number
  employees: number
  revenueRange: string
  website?: string
  email?: string
  phone?: string
  status: "pending" | "approved" | "rejected"
  createdBy: string
  approvedBy?: string
  createdAt: string
  updatedAt: string
}

const formatCurrency = (amount: number) => {
  if (amount >= 10000000) { // 1 crore
    const crores = amount / 10000000
    return `₹${crores.toFixed(1)} Cr`
  } else if (amount >= 100000) { // 1 lakh
    const lakhs = amount / 100000
    return `₹${lakhs.toFixed(1)}L`
  } else {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }
}

const formatDate = (dateString: string) => {
  try {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    return 'N/A'
  }
}

const getStatusBadgeVariant = (status: Startup['status']) => {
  switch (status) {
    case 'approved': return 'default'
    case 'pending': return 'secondary'
    case 'rejected': return 'destructive'
    default: return 'secondary'
  }
}

const getStatusIcon = (status: Startup['status']) => {
  switch (status) {
    case 'approved': return <UserCheck className="w-4 h-4" />
    case 'pending': return <Clock className="w-4 h-4" />
    case 'rejected': return <UserX className="w-4 h-4" />
    default: return <Clock className="w-4 h-4" />
  }
}

const getStageColor = (stage: Startup['stage']) => {
  switch (stage) {
    case 'Ideation': return 'bg-gray-500/20 text-gray-700 border-gray-500/30'
    case 'Seed': return 'bg-blue-500/20 text-blue-700 border-blue-500/30'
    case 'Series A': return 'bg-green-500/20 text-green-700 border-green-500/30'
    case 'Series B': return 'bg-purple-500/20 text-purple-700 border-purple-500/30'
    case 'Growth': return 'bg-orange-500/20 text-orange-700 border-orange-500/30'
    default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30'
  }
}

export default function StartupDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [startup, setStartup] = useState<Startup | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin] = useState(true) // Mock admin status
  const [isPdfMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('pdf') === 'true'
    }
    return false
  })

  // Generate report date for cover page
  const reportDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const startupId = params.id as string

  // Export to PDF function
  const exportToPDF = () => {
  if (!startupId) {
    alert("Unable to export PDF: Startup ID missing in route");
    return;
  }

  window.open(
    `/api/export/startup/${encodeURIComponent(startupId)}`,
    "_blank"
  );
};

  // Generate mock growth data based on startup stage and current metrics
  const generateGrowthData = (startup: Startup) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentYear = new Date().getFullYear()

    // Revenue growth data (last 12 months)
    const revenueData = months.map((month, index) => {
      const baseRevenue = startup.funding * 0.1 // Assume 10% of funding converts to annual revenue
      const growth = Math.random() * 0.3 + 0.85 // 85-115% growth factor
      const cumulativeGrowth = Math.pow(growth, index)
      return {
        month: `${month} ${currentYear}`,
        revenue: Math.round(baseRevenue * cumulativeGrowth / 12), // Monthly revenue
        growth: ((cumulativeGrowth - 1) * 100).toFixed(1) + '%'
      }
    })

    // User growth data
    const userData = months.map((month, index) => {
      const baseUsers = startup.employees * 50 // Assume 50 users per employee initially
      const growth = Math.random() * 0.4 + 0.9 // 90-130% monthly growth
      const totalUsers = Math.round(baseUsers * Math.pow(growth, index))
      return {
        month: `${month} ${currentYear}`,
        users: totalUsers,
        newUsers: Math.round(totalUsers * (Math.random() * 0.3 + 0.1)) // 10-40% new users monthly
      }
    })

    // Team growth data
    const teamData = months.map((month, index) => {
      const baseTeam = Math.max(5, startup.employees * 0.7) // Start with smaller team
      const growth = Math.random() * 0.2 + 0.95 // 95-115% growth
      return {
        month: `${month} ${currentYear}`,
        employees: Math.round(baseTeam * Math.pow(growth, index)),
        hiring: Math.round(Math.random() * 3) // 0-3 new hires per month
      }
    })

    // Funding rounds data
    const fundingRounds = [
      { round: 'Seed', amount: startup.funding * 0.2, date: '2023-Q1', investors: 5 },
      { round: 'Series A', amount: startup.funding * 0.4, date: '2023-Q3', investors: 8 },
      { round: 'Series B', amount: startup.funding * 0.4, date: '2024-Q2', investors: 12 },
    ]

    return { revenueData, userData, teamData, fundingRounds }
  }

  const growthData = startup ? generateGrowthData(startup) : null

  useEffect(() => {
    const fetchStartupDetails = async () => {
      try {
        setLoading(true)

        // In PDF mode, fetch directly from API without authentication
        if (isPdfMode) {
          const response = await fetch(`/api/startups/${startupId}`)
          if (response.ok) {
            const data = await response.json()
            setStartup(data)
          } else {
            setStartup(null)
          }
        } else {
          // Normal mode with authentication
          const data = await getStartupById(startupId)
          if (data) {
            setStartup(data)
          } else {
            setStartup(null)
          }
        }
      } catch (error) {
        console.error("Failed to load startup details:", error)
        setStartup(null)
      } finally {
        setLoading(false)
      }
    }

    if (startupId && startupId !== 'undefined' && startupId !== 'null') {
      fetchStartupDetails()
    } else {
      setLoading(false)
    }
  }, [startupId, isPdfMode])

  if (loading) {
    return (
      <div className="min-h-screen space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-muted animate-pulse rounded-lg"></div>
          <div className="space-y-2">
            <div className="h-8 w-64 bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-48 bg-muted animate-pulse rounded"></div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="apple-glass rounded-2xl p-6">
              <div className="space-y-4">
                <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-3/4 bg-muted animate-pulse rounded"></div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="apple-glass rounded-2xl p-6">
              <div className="h-32 bg-muted animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!startup) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">Startup not found</h2>
          <p className="text-muted-foreground mb-6">The startup you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isPdfMode ? 'bg-white text-black print-mode' : 'bg-gradient-to-br from-background via-background to-muted/20'}`}>
      {/* Cover Page - Only shown in PDF mode */}
      {isPdfMode && (
        <div className="page-break-after print-page-cover min-h-screen flex flex-col justify-center items-center text-center px-8 py-16">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Logo/Brand */}
            <div className="space-y-4">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto flex items-center justify-center">
                <Building2 className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">Innopulse</h1>
              <p className="text-lg text-gray-600">India's Startup Ecosystem Platform</p>
            </div>

            {/* Report Title */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2">
                Startup Analytics Report
              </h2>
              <h3 className="text-2xl font-semibold text-gray-800">
                {startup.name}
              </h3>
              <div className="flex items-center justify-center gap-4 text-gray-600">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {startup.city}
                </span>
                <span>•</span>
                <span>{startup.sector}</span>
                <span>•</span>
                <Badge className={`${getStageColor(startup.stage)} border text-sm px-3 py-1`}>
                  {startup.stage}
                </Badge>
              </div>
            </div>

            {/* Key Metrics Summary */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(startup.funding)}</div>
                <div className="text-sm text-gray-600">Total Funding</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{startup.employees}</div>
                <div className="text-sm text-gray-600">Team Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{formatDate(startup.createdAt).split(',')[0]}</div>
                <div className="text-sm text-gray-600">Founded</div>
              </div>
            </div>

            {/* Report Generation Date */}
            <div className="mt-16 pt-8 border-t border-gray-300">
              <p className="text-sm text-gray-500">Report Generated on {reportDate}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header Section - Hidden in PDF mode */}
      {!isPdfMode && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.back()}
                  className="glass border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/60 transition-all duration-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                    {startup.name}
                  </h1>
                  <p className="text-muted-foreground mt-2 flex items-center gap-2 text-lg">
                    <MapPin className="w-5 h-5" />
                    {startup.city} • {startup.sector}
                  </p>
                </div>
              </div>
              <Badge className={`${getStageColor(startup.stage)} border text-base px-4 py-2 font-medium`}>
                {startup.stage}
              </Badge>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className={`container mx-auto px-4 ${isPdfMode ? 'py-4 max-w-4xl print-content' : 'py-8'}`}>
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content Column */}
          <motion.div
            initial={isPdfMode ? false : { opacity: 0, x: -20 }}
            animate={isPdfMode ? {} : { opacity: 1, x: 0 }}
            transition={isPdfMode ? {} : { delay: 0.1 }}
            className="xl:col-span-3 space-y-8"
          >
          {/* Company Overview Section */}
          <div className={isPdfMode ? 'page-break-inside-avoid section-spacing' : ''}>
            <div className="mb-6">
              <h2 className={`text-2xl font-bold flex items-center gap-3 ${isPdfMode ? 'text-gray-900 border-b-2 border-blue-600 pb-2 mb-6' : 'text-foreground'}`}>
                <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-primary" />
                </div>
                Company Overview
              </h2>
            </div>

            <Card className={`apple-glass border-0 shadow-xl ${isPdfMode ? 'page-break-inside-avoid bg-white border border-gray-200' : ''}`}>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Key Metrics */}
                  <div className="space-y-4">
                    <div className={`flex items-center justify-between p-4 rounded-xl ${isPdfMode ? 'bg-gray-50 border border-gray-200' : 'bg-card/30'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isPdfMode ? 'bg-green-100' : 'bg-green-500/20'}`}>
                          <DollarSign className={`w-5 h-5 ${isPdfMode ? 'text-green-600' : 'text-green-600'}`} />
                        </div>
                        <div>
                          <p className={`text-sm ${isPdfMode ? 'text-gray-600' : 'text-muted-foreground'}`}>Total Funding</p>
                          <p className={`text-2xl font-bold ${isPdfMode ? 'text-gray-900' : 'text-foreground'}`}>{formatCurrency(startup.funding)}</p>
                        </div>
                      </div>
                    </div>

                    <div className={`flex items-center justify-between p-4 rounded-xl ${isPdfMode ? 'bg-gray-50 border border-gray-200' : 'bg-card/30'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isPdfMode ? 'bg-blue-100' : 'bg-blue-500/20'}`}>
                          <Users className={`w-5 h-5 ${isPdfMode ? 'text-blue-600' : 'text-blue-600'}`} />
                        </div>
                        <div>
                          <p className={`text-sm ${isPdfMode ? 'text-gray-600' : 'text-muted-foreground'}`}>Employees</p>
                          <p className={`text-2xl font-bold ${isPdfMode ? 'text-gray-900' : 'text-foreground'}`}>{startup.employees}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Business Details */}
                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl ${isPdfMode ? 'bg-gray-50 border border-gray-200' : 'bg-card/30'}`}>
                      <p className={`text-sm mb-2 ${isPdfMode ? 'text-gray-600' : 'text-muted-foreground'}`}>Revenue Range</p>
                      <p className={`text-lg font-semibold ${isPdfMode ? 'text-gray-900' : 'text-foreground'}`}>
                        {startup.revenueRange || "Not specified"}
                      </p>
                    </div>

                    <div className={`p-4 rounded-xl ${isPdfMode ? 'bg-gray-50 border border-gray-200' : 'bg-card/30'}`}>
                      <p className={`text-sm mb-2 ${isPdfMode ? 'text-gray-600' : 'text-muted-foreground'}`}>Business Stage</p>
                      <Badge className={`${getStageColor(startup.stage)} border text-base px-3 py-1 ${isPdfMode ? 'bg-gray-100 text-gray-800 border-gray-300' : ''}`}>
                        {startup.stage}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className={`p-6 rounded-xl mt-6 ${isPdfMode ? 'bg-gray-50 border border-gray-200' : 'bg-card/20'}`}>
                  <h3 className={`text-lg font-semibold mb-3 ${isPdfMode ? 'text-gray-900' : 'text-foreground'}`}>About {startup.name}</h3>
                  <p className={`leading-relaxed ${isPdfMode ? 'text-gray-700' : 'text-muted-foreground'}`}>
                    {startup.name} is a {startup.stage?.toLowerCase()} stage startup operating in the {startup.sector?.toLowerCase()} sector.
                    Located in {startup.city}, the company has raised {formatCurrency(startup.funding)} in funding and employs {startup.employees} people.
                    They generate revenue in the {startup.revenueRange?.toLowerCase()} range and are actively growing in the Indian startup ecosystem.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Growth Analytics Section */}
          <div className={isPdfMode ? 'page-break-before page-break-inside-avoid section-spacing' : ''}>
            <div className="mb-6">
              <h2 className={`text-2xl font-bold flex items-center gap-3 ${isPdfMode ? 'text-gray-900 border-b-2 border-blue-600 pb-2 mb-6' : 'text-foreground'}`}>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                </div>
                Growth Analytics
              </h2>
              <p className={`text-muted-foreground ${isPdfMode ? 'text-gray-600' : ''}`}>Performance metrics and growth trends over time</p>
            </div>

            <Card className={`apple-glass border-0 shadow-xl ${isPdfMode ? 'page-break-inside-avoid bg-white border border-gray-200' : ''}`}>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Revenue Growth Chart */}
                  <div className={`space-y-4 ${isPdfMode ? 'page-break-inside-avoid' : ''}`}>
                    <h4 className={`text-lg font-semibold flex items-center gap-2 ${isPdfMode ? 'text-gray-900' : 'text-foreground'}`}>
                      <LineChart className="w-5 h-5 text-green-600" />
                      Revenue Growth
                    </h4>
                    <div className={isPdfMode ? "h-80 w-full bg-white border border-gray-200 rounded-lg p-4" : "h-64"}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={growthData?.revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke={isPdfMode ? "#e5e7eb" : "#3b82f6"} opacity={0.3} />
                          <XAxis
                            dataKey="month"
                            stroke={isPdfMode ? "#6b7280" : "#3b82f6"}
                            fontSize={isPdfMode ? 10 : 12}
                            tick={{ fill: isPdfMode ? "#374151" : "#3b82f6" }}
                            angle={isPdfMode ? -45 : 0}
                            textAnchor={isPdfMode ? 'end' : 'middle'}
                            height={isPdfMode ? 60 : 30}
                          />
                          <YAxis
                            stroke={isPdfMode ? "#6b7280" : "#3b82f6"}
                            fontSize={isPdfMode ? 10 : 12}
                            tick={{ fill: isPdfMode ? "#374151" : "#3b82f6" }}
                            tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                            width={isPdfMode ? 80 : 60}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: isPdfMode ? '#ffffff' : 'hsl(var(--popover))',
                              border: `1px solid ${isPdfMode ? '#e5e7eb' : 'hsl(var(--border))'}`,
                              borderRadius: '8px',
                              color: isPdfMode ? '#111827' : 'hsl(var(--popover-foreground))',
                              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                              fontSize: isPdfMode ? '12px' : '14px'
                            }}
                            formatter={(value: number | undefined) => value ? [formatCurrency(value), 'Monthly Revenue'] : ['N/A', 'Monthly Revenue']}
                            labelStyle={{ color: isPdfMode ? '#111827' : 'hsl(var(--popover-foreground))' }}
                          />
                          <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke={isPdfMode ? "#059669" : "#3b82f6"}
                            strokeWidth={isPdfMode ? 2 : 3}
                            dot={{ fill: isPdfMode ? "#059669" : "#3b82f6", strokeWidth: 2, r: isPdfMode ? 3 : 4 }}
                            activeDot={{ r: isPdfMode ? 5 : 6, stroke: isPdfMode ? "#059669" : "#3b82f6", strokeWidth: 2 }}
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* User Growth Chart */}
                  <div className={`space-y-4 ${isPdfMode ? 'page-break-inside-avoid' : ''}`}>
                    <h4 className={`text-lg font-semibold flex items-center gap-2 ${isPdfMode ? 'text-gray-900' : 'text-foreground'}`}>
                      <Users className="w-5 h-5 text-blue-600" />
                      User Base Growth
                    </h4>
                    <div className={isPdfMode ? "h-80 w-full bg-white border border-gray-200 rounded-lg p-4" : "h-64"}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={growthData?.userData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke={isPdfMode ? "#e5e7eb" : "#3b82f6"} opacity={0.3} />
                          <XAxis
                            dataKey="month"
                            stroke={isPdfMode ? "#6b7280" : "#3b82f6"}
                            fontSize={isPdfMode ? 10 : 12}
                            tick={{ fill: isPdfMode ? "#374151" : "#3b82f6" }}
                            angle={isPdfMode ? -45 : 0}
                            textAnchor={isPdfMode ? 'end' : 'middle'}
                            height={isPdfMode ? 60 : 30}
                          />
                          <YAxis
                            stroke={isPdfMode ? "#6b7280" : "#3b82f6"}
                            fontSize={isPdfMode ? 10 : 12}
                            tick={{ fill: isPdfMode ? "#374151" : "#3b82f6" }}
                            tickFormatter={(value) => `${(value / 1000).toFixed(1)}K`}
                            width={isPdfMode ? 80 : 60}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: isPdfMode ? '#ffffff' : 'hsl(var(--popover))',
                              border: `1px solid ${isPdfMode ? '#e5e7eb' : 'hsl(var(--border))'}`,
                              borderRadius: '8px',
                              color: isPdfMode ? '#111827' : 'hsl(var(--popover-foreground))',
                              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                              fontSize: isPdfMode ? '12px' : '14px'
                            }}
                            formatter={(value: number | undefined, name: string | undefined) => value && name ? [
                              name === 'users' ? `${value.toLocaleString()} users` : `${value} new users`,
                              name === 'users' ? 'Total Users' : 'New Users'
                            ] : ['N/A', 'N/A']}
                            labelStyle={{ color: isPdfMode ? '#111827' : 'hsl(var(--popover-foreground))' }}
                          />
                          <Area
                            type="monotone"
                            dataKey="users"
                            stackId="1"
                            stroke={isPdfMode ? "#2563eb" : "#3b82f6"}
                            fill={isPdfMode ? "#dbeafe" : "#3b82f6"}
                            fillOpacity={isPdfMode ? 0.3 : 0.6}
                            strokeWidth={isPdfMode ? 2 : 3}
                          />
                          <Area
                            type="monotone"
                            dataKey="newUsers"
                            stackId="2"
                            stroke={isPdfMode ? "#7c3aed" : "#60a5fa"}
                            fill={isPdfMode ? "#ede9fe" : "#60a5fa"}
                            fillOpacity={isPdfMode ? 0.5 : 0.8}
                            strokeWidth={isPdfMode ? 2 : 3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Team Growth Chart */}
                  <div className={`space-y-4 ${isPdfMode ? 'page-break-inside-avoid' : ''}`}>
                    <h4 className={`text-lg font-semibold flex items-center gap-2 ${isPdfMode ? 'text-gray-900' : 'text-foreground'}`}>
                      <Users className="w-5 h-5 text-purple-600" />
                      Team Growth
                    </h4>
                    <div className={isPdfMode ? "h-80 w-full bg-white border border-gray-200 rounded-lg p-4" : "h-64"}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={growthData?.teamData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke={isPdfMode ? "#e5e7eb" : "#3b82f6"} opacity={0.3} />
                          <XAxis
                            dataKey="month"
                            stroke={isPdfMode ? "#6b7280" : "#3b82f6"}
                            fontSize={isPdfMode ? 10 : 12}
                            tick={{ fill: isPdfMode ? "#374151" : "#3b82f6" }}
                            angle={isPdfMode ? -45 : 0}
                            textAnchor={isPdfMode ? 'end' : 'middle'}
                            height={isPdfMode ? 60 : 30}
                          />
                          <YAxis
                            stroke={isPdfMode ? "#6b7280" : "#3b82f6"}
                            fontSize={isPdfMode ? 10 : 12}
                            tick={{ fill: isPdfMode ? "#374151" : "#3b82f6" }}
                            width={isPdfMode ? 60 : 50}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: isPdfMode ? '#ffffff' : 'hsl(var(--popover))',
                              border: `1px solid ${isPdfMode ? '#e5e7eb' : 'hsl(var(--border))'}`,
                              borderRadius: '8px',
                              color: isPdfMode ? '#111827' : 'hsl(var(--popover-foreground))',
                              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                              fontSize: isPdfMode ? '12px' : '14px'
                            }}
                            formatter={(value: number | undefined, name: string | undefined) => value && name ? [
                              name === 'employees' ? `${value} employees` : `${value} new hires`,
                              name === 'employees' ? 'Total Team' : 'New Hires'
                            ] : ['N/A', 'N/A']}
                            labelStyle={{ color: isPdfMode ? '#111827' : 'hsl(var(--popover-foreground))' }}
                          />
                          <Bar
                            dataKey="employees"
                            fill={isPdfMode ? "#7c3aed" : "#3b82f6"}
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar
                            dataKey="hiring"
                            fill={isPdfMode ? "#a78bfa" : "#60a5fa"}
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Funding Rounds */}
                  <div className={`space-y-4 ${isPdfMode ? 'page-break-inside-avoid' : ''}`}>
                    <h4 className={`text-lg font-semibold flex items-center gap-2 ${isPdfMode ? 'text-gray-900' : 'text-foreground'}`}>
                      <DollarSign className="w-5 h-5 text-orange-600" />
                      Funding Rounds
                    </h4>
                    <div className={isPdfMode ? "h-80 w-full bg-white border border-gray-200 rounded-lg p-4" : "h-64"}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={growthData?.fundingRounds} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke={isPdfMode ? "#e5e7eb" : "#3b82f6"} opacity={0.3} />
                          <XAxis
                            dataKey="round"
                            stroke={isPdfMode ? "#6b7280" : "#3b82f6"}
                            fontSize={isPdfMode ? 10 : 12}
                            tick={{ fill: isPdfMode ? "#374151" : "#3b82f6" }}
                          />
                          <YAxis
                            yAxisId="amount"
                            orientation="left"
                            stroke={isPdfMode ? "#6b7280" : "#3b82f6"}
                            fontSize={isPdfMode ? 10 : 12}
                            tick={{ fill: isPdfMode ? "#374151" : "#3b82f6" }}
                            tickFormatter={(value) => `₹${(value / 10000000).toFixed(1)}Cr`}
                            width={isPdfMode ? 80 : 70}
                          />
                          <YAxis
                            yAxisId="investors"
                            orientation="right"
                            stroke={isPdfMode ? "#6b7280" : "#3b82f6"}
                            fontSize={isPdfMode ? 10 : 12}
                            tick={{ fill: isPdfMode ? "#374151" : "#3b82f6" }}
                            width={isPdfMode ? 60 : 50}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: isPdfMode ? '#ffffff' : 'hsl(var(--popover))',
                              border: `1px solid ${isPdfMode ? '#e5e7eb' : 'hsl(var(--border))'}`,
                              borderRadius: '8px',
                              color: isPdfMode ? '#111827' : 'hsl(var(--popover-foreground))',
                              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                              fontSize: isPdfMode ? '12px' : '14px'
                            }}
                            formatter={(value: number | undefined, name: string | undefined) => value && name ? [
                              name === 'amount' ? formatCurrency(value) : `${value} investors`,
                              name === 'amount' ? 'Funding Amount' : 'Investors'
                            ] : ['N/A', 'N/A']}
                            labelStyle={{ color: isPdfMode ? '#111827' : 'hsl(var(--popover-foreground))' }}
                          />
                          <Bar
                            yAxisId="amount"
                            dataKey="amount"
                            fill={isPdfMode ? "#ea580c" : "#3b82f6"}
                            radius={[4, 4, 0, 0]}
                          />
                          <Line
                            yAxisId="investors"
                            type="monotone"
                            dataKey="investors"
                            stroke={isPdfMode ? "#dc2626" : "#60a5fa"}
                            strokeWidth={isPdfMode ? 2 : 3}
                            dot={{ fill: isPdfMode ? "#dc2626" : "#60a5fa", strokeWidth: 2, r: isPdfMode ? 3 : 4 }}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Growth Summary */}
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-6 rounded-xl mt-8 ${isPdfMode ? 'bg-gray-50 border border-gray-200 page-break-inside-avoid' : 'bg-card/20'}`}>
                  <div className="text-center">
                    <div className={`text-2xl font-bold mb-1 ${isPdfMode ? 'text-green-600' : 'text-green-600'}`}>
                      +{Math.round(Math.random() * 50 + 25)}%
                    </div>
                    <div className={`text-sm ${isPdfMode ? 'text-gray-600' : 'text-muted-foreground'}`}>Revenue Growth (YoY)</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold mb-1 ${isPdfMode ? 'text-blue-600' : 'text-blue-600'}`}>
                      +{Math.round(Math.random() * 80 + 40)}%
                    </div>
                    <div className={`text-sm ${isPdfMode ? 'text-gray-600' : 'text-muted-foreground'}`}>User Acquisition</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold mb-1 ${isPdfMode ? 'text-purple-600' : 'text-purple-600'}`}>
                      +{Math.round(Math.random() * 30 + 15)}%
                    </div>
                    <div className={`text-sm ${isPdfMode ? 'text-gray-600' : 'text-muted-foreground'}`}>Team Expansion</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          </motion.div>

          {/* Sidebar Column - Hidden in PDF mode */}
          {!isPdfMode && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Status Card */}
              <Card className="apple-glass border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created:</span>
                        <span className="font-medium">{formatDate(startup.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Updated:</span>
                        <span className="font-medium">{formatDate(startup.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="apple-glass border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Sector</span>
                    <Badge variant="secondary">{startup.sector}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">City</span>
                    <span className="font-medium">{startup.city}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Stage</span>
                    <span className="font-medium">{startup.stage}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Team Size</span>
                    <span className="font-medium">{startup.employees} people</span>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="apple-glass border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Get in touch with the startup team</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    {/* Website */}
                    <div className="flex items-center gap-3 p-4 bg-card/30 rounded-xl">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Website</p>
                        <p className="text-xs text-muted-foreground">
                          {startup.website ? (
                            <a
                              href={startup.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary transition-colors"
                            >
                              Visit website
                            </a>
                          ) : (
                            "Not provided"
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-3 p-4 bg-card/30 rounded-xl">
                      <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Email</p>
                        <p className="text-xs text-muted-foreground">
                          {startup.email ? (
                            <a
                              href={`mailto:${startup.email}`}
                              className="hover:text-primary transition-colors"
                            >
                              Send message
                            </a>
                          ) : (
                            "Not provided"
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-3 p-4 bg-card/30 rounded-xl">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Phone</p>
                        <p className="text-xs text-muted-foreground">
                          {startup.phone ? (
                            <a
                              href={`tel:${startup.phone}`}
                              className="hover:text-primary transition-colors"
                            >
                              Call now
                            </a>
                          ) : (
                            "Not provided"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Growth Indicators */}
              <Card className="apple-glass border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Growth Potential
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-card/30 rounded-lg">
                      <span className="text-sm text-muted-foreground">Funding Progress</span>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">On Track</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-card/30 rounded-lg">
                      <span className="text-sm text-muted-foreground">Market Position</span>
                      <span className="text-sm font-medium text-green-600">Growing</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-card/30 rounded-lg">
                      <span className="text-sm text-muted-foreground">Competitive Edge</span>
                      <span className="text-sm font-medium text-blue-600">Strong</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-card/30 rounded-lg">
                      <span className="text-sm text-muted-foreground">Innovation Level</span>
                      <span className="text-sm font-medium text-purple-600">High</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Export PDF Button */}
              <div className="pt-2">
                <Button
                  onClick={exportToPDF}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium"
                  size="sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Export Analytics as PDF
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
