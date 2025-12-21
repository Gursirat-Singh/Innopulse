"use client"

import { useMemo, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  TrendingUp,
  TrendingDown,
  Building2,
  DollarSign,
  Users,
  Target,
  MapPin,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  AlertTriangle,
  Zap,
  ChevronRight,
  Calendar,
  Award
} from "lucide-react"
import { getApprovedStartups, type Startup } from "@/lib/services/startup.services"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for analytics dashboard
const mockKPIs = [
  {
    title: "Total Startups Tracked",
    value: "2,847",
    delta: "+12.5%",
    deltaType: "positive",
    icon: Building2,
    description: "All registered startups"
  },
  {
    title: "Active Startups",
    value: "1,923",
    delta: "+8.2%",
    deltaType: "positive",
    icon: Activity,
    description: "Currently operational"
  },
  {
    title: "Total Funding Raised",
    value: "₹1,247 Cr",
    delta: "+24.7%",
    deltaType: "positive",
    icon: DollarSign,
    description: "Since inception"
  },
  {
    title: "Month-over-Month Growth",
    value: "15.3%",
    delta: "-2.1%",
    deltaType: "negative",
    icon: TrendingUp,
    description: "Growth rate"
  },
  {
    title: "New Startups Added",
    value: "127",
    delta: "+18.4%",
    deltaType: "positive",
    icon: Users,
    description: "Last 30 days"
  }
]

const mockInsights = [
  {
    type: "funding",
    title: "Funding Surge in Fintech",
    description: "₹450 Cr raised this quarter, 3x last year",
    icon: DollarSign,
    trend: "up",
    impact: "high"
  },
  {
    type: "growth",
    title: "Agritech Sector Booming",
    description: "45% growth in new startups this month",
    icon: TrendingUp,
    trend: "up",
    impact: "high"
  },
  {
    type: "shift",
    title: "Bengaluru Dominance Shifting",
    description: "Mumbai catching up with 23% market share",
    icon: MapPin,
    trend: "neutral",
    impact: "medium"
  },
  {
    type: "alert",
    title: "Healthcare Funding Dip",
    description: "32% decrease in healthcare investments",
    icon: AlertTriangle,
    trend: "down",
    impact: "medium"
  }
]

const mockGrowthData = [
  { month: "Jan", startups: 2100, funding: 850 },
  { month: "Feb", startups: 2180, funding: 920 },
  { month: "Mar", startups: 2250, funding: 980 },
  { month: "Apr", startups: 2320, funding: 1050 },
  { month: "May", startups: 2380, funding: 1120 },
  { month: "Jun", startups: 2450, funding: 1180 },
  { month: "Jul", startups: 2520, funding: 1250 },
  { month: "Aug", startups: 2580, funding: 1320 },
  { month: "Sep", startups: 2650, funding: 1380 },
  { month: "Oct", startups: 2720, funding: 1450 },
  { month: "Nov", startups: 2780, funding: 1520 },
  { month: "Dec", startups: 2847, funding: 1590 }
]

const mockTopSectors = [
  { name: "Fintech", growth: "+45.2%", startups: 234 },
  { name: "Healthtech", growth: "+38.7%", startups: 189 },
  { name: "Agritech", growth: "+52.1%", startups: 156 },
  { name: "Edtech", growth: "+29.4%", startups: 203 },
  { name: "SaaS", growth: "+33.8%", startups: 178 }
]

const mockTopCities = [
  { name: "Bengaluru", newStartups: 89, totalStartups: 1247 },
  { name: "Mumbai", newStartups: 67, totalStartups: 892 },
  { name: "Delhi", newStartups: 54, totalStartups: 756 },
  { name: "Hyderabad", newStartups: 43, totalStartups: 678 },
  { name: "Pune", newStartups: 38, totalStartups: 567 }
]

const mockAlerts = [
  {
    type: "concentration",
    title: "Funding Concentration Risk",
    message: "Top 5 sectors account for 78% of total funding",
    severity: "medium"
  },
  {
    type: "opportunity",
    title: "Emerging Sector Opportunity",
    message: "Deeptech shows 67% growth potential",
    severity: "low"
  }
]

export default function DashboardOverview() {
  const router = useRouter()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [startups, setStartups] = useState<Startup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const data = await getApprovedStartups()
        setStartups(data)
      } catch (error) {
        console.error("Failed to fetch startups:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStartups()
  }, [])



  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Innopulse Overview
            </h1>
            <p className="text-muted-foreground mt-2">
              Indian startup ecosystem intelligence at a glance
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Last updated: Dec 20, 2025</span>
          </div>
        </div>
      </motion.div>

      {/* KPI Summary Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8"
      >
        {mockKPIs.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="glass-strong rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                <kpi.icon className="w-6 h-6 text-primary" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                kpi.deltaType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {kpi.deltaType === 'positive' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                <span>{kpi.delta}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
              <div className="text-sm text-muted-foreground">{kpi.title}</div>
              <div className="text-xs text-muted-foreground/70">{kpi.description}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column - Insights & Rankings */}
        <div className="lg:col-span-2 space-y-8">

          {/* What Changed Recently Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-strong rounded-2xl p-6 shadow-lg border border-border/50"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">What Changed Recently</h2>
                <p className="text-sm text-muted-foreground">Key ecosystem developments</p>
              </div>
            </div>

            <div className="space-y-4">
              {mockInsights.map((insight, index) => (
                <motion.div
                  key={insight.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.01, x: 2 }}
                  className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                    insight.impact === 'high'
                      ? 'bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-500/20'
                      : 'bg-card/30 hover:bg-card/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    insight.trend === 'up' ? 'bg-green-500/20 text-green-600' :
                    insight.trend === 'down' ? 'bg-red-500/20 text-red-600' :
                    'bg-blue-500/20 text-blue-600'
                  }`}>
                    <insight.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    insight.impact === 'high'
                      ? 'bg-blue-500/20 text-blue-700'
                      : 'bg-muted/20 text-muted-foreground'
                  }`}>
                    {insight.impact}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Rankings Snapshot */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >

            {/* Top Sectors */}
            <Card className="glass-strong shadow-lg border border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Award className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Top Sectors by Growth</CardTitle>
                    <CardDescription>Fastest growing industries</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTopSectors.map((sector, index) => (
                    <motion.div
                      key={sector.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 2 }}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-card/50 transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-md flex items-center justify-center text-xs font-bold text-primary">
                          {index + 1}
                        </div>
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {sector.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-green-600 font-semibold">{sector.growth}</span>
                        <span className="text-sm text-muted-foreground">({sector.startups})</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Cities */}
            <Card className="glass-strong shadow-lg border border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Top Cities by Activity</CardTitle>
                    <CardDescription>Most active startup hubs</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTopCities.map((city, index) => (
                    <motion.div
                      key={city.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 2 }}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-card/50 transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-md flex items-center justify-center text-xs font-bold text-primary">
                          {index + 1}
                        </div>
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {city.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-blue-600 font-semibold">+{city.newStartups}</span>
                        <span className="text-sm text-muted-foreground">({city.totalStartups})</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Chart & Alerts */}
        <div className="space-y-8">

          {/* Primary Trend Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-strong rounded-2xl p-6 shadow-lg border border-border/50"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">12-Month Trend</h2>
                <p className="text-sm text-muted-foreground">Startup growth & funding</p>
              </div>
            </div>

            {/* Simple Chart Visualization */}
            <div className="space-y-4">
              <div className="flex items-end gap-1 h-32">
                {mockGrowthData.map((data, index) => (
                  <motion.div
                    key={data.month}
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.startups / 3000) * 100}%` }}
                    transition={{ delay: 0.8 + index * 0.05, duration: 0.5 }}
                    className="flex-1 bg-gradient-to-t from-primary/60 to-primary/30 rounded-t-sm relative group"
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium text-foreground bg-card px-2 py-1 rounded shadow-lg">
                      {data.startups}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Jan</span>
                <span>Jun</span>
                <span>Dec</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/30">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current trajectory:</span>
                <span className="text-green-600 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +15.3%
                </span>
              </div>
            </div>
          </motion.div>

          {/* Alerts / Signals Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-strong rounded-2xl p-6 shadow-lg border border-border/50"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Signals & Alerts</h2>
                <p className="text-sm text-muted-foreground">Important observations</p>
              </div>
            </div>

            <div className="space-y-4">
              {mockAlerts.map((alert, index) => (
                <motion.div
                  key={alert.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    alert.severity === 'medium'
                      ? 'bg-amber-500/5 border-amber-500/20'
                      : 'bg-blue-500/5 border-blue-500/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      alert.severity === 'medium' ? 'bg-amber-500/20' : 'bg-blue-500/20'
                    }`}>
                      {alert.type === 'concentration' ? (
                        <PieChart className="w-3 h-3 text-amber-600" />
                      ) : (
                        <TrendingUp className="w-3 h-3 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-sm">{alert.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>



          {/* Smart Navigation CTAs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => router.push("/dashboard/sectors")}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Explore Fastest Growing Sector
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => router.push("/dashboard/startups")}
                variant="outline"
                className="w-full glass-strong border-border/50 hover:bg-card/50 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Users className="w-4 h-4 mr-2" />
                View Newly Added Startups
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => router.push("/dashboard/initiatives")}
                variant="outline"
                className="w-full glass-strong border-border/50 hover:bg-card/50 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Target className="w-4 h-4 mr-2" />
                Browse Government Initiatives
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
