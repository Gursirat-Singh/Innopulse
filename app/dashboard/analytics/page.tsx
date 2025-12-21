"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import {
  Building2,
  DollarSign,
  Users,
  TrendingUp,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  BarChart3,
  PieChart,
  Activity,
  Award,
  Zap,
  Calendar,
  ChevronDown,
  TrendingDown,
  Download,
  Loader2
} from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadialBarChart,
  RadialBar
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Enhanced dummy data for analytics
const kpiData = [
  {
    title: "Total Startups Tracked",
    value: "2,847",
    change: "+12.5%",
    changeType: "positive",
    icon: Building2,
    description: "All registered startups"
  },
  {
    title: "Total Funding Raised",
    value: "₹1,247 Cr",
    change: "+24.7%",
    changeType: "positive",
    icon: DollarSign,
    description: "Since inception"
  },
  {
    title: "Active Startups",
    value: "1,923",
    change: "+8.2%",
    changeType: "positive",
    icon: Activity,
    description: "Currently operational"
  },
  {
    title: "Jobs Created",
    value: "45,678",
    change: "+15.3%",
    changeType: "positive",
    icon: Users,
    description: "Direct employment"
  },
  {
    title: "Average Growth Rate",
    value: "18.4%",
    change: "+2.1%",
    changeType: "positive",
    icon: TrendingUp,
    description: "YoY growth"
  },
  {
    title: "New Startups This Month",
    value: "127",
    change: "+18.4%",
    changeType: "positive",
    icon: Target,
    description: "Monthly registrations"
  }
]

// Funding trends data for line chart
const fundingTrendData = [
  { month: "Jan", seed: 25, seriesA: 45, seriesB: 30, total: 100 },
  { month: "Feb", seed: 28, seriesA: 52, seriesB: 35, total: 115 },
  { month: "Mar", seed: 32, seriesA: 48, seriesB: 40, total: 120 },
  { month: "Apr", seed: 35, seriesA: 55, seriesB: 45, total: 135 },
  { month: "May", seed: 38, seriesA: 62, seriesB: 50, total: 150 },
  { month: "Jun", seed: 42, seriesA: 68, seriesB: 55, total: 165 },
  { month: "Jul", seed: 45, seriesA: 72, seriesB: 60, total: 177 },
  { month: "Aug", seed: 48, seriesA: 75, seriesB: 65, total: 188 },
  { month: "Sep", seed: 52, seriesA: 78, seriesB: 70, total: 200 },
  { month: "Oct", seed: 55, seriesA: 82, seriesB: 75, total: 212 },
  { month: "Nov", seed: 58, seriesA: 85, seriesB: 80, total: 223 },
  { month: "Dec", seed: 62, seriesA: 88, seriesB: 85, total: 235 }
]

// Sector distribution data for pie chart
const sectorData = [
  { name: "FinTech", value: 28, funding: 350, color: "#3B82F6" },
  { name: "SaaS", value: 22, funding: 275, color: "#10B981" },
  { name: "HealthTech", value: 18, funding: 225, color: "#EF4444" },
  { name: "EdTech", value: 15, funding: 188, color: "#8B5CF6" },
  { name: "E-commerce", value: 10, funding: 125, color: "#F59E0B" },
  { name: "AI & DeepTech", value: 7, funding: 88, color: "#EC4899" }
]

// Geographic data for bar chart
const cityData = [
  { name: "Bengaluru", startups: 1247, funding: 450, growth: 15.2 },
  { name: "Delhi NCR", startups: 892, funding: 320, growth: 12.8 },
  { name: "Mumbai", startups: 756, funding: 280, growth: 10.5 },
  { name: "Hyderabad", startups: 678, funding: 240, growth: 18.7 },
  { name: "Pune", startups: 567, funding: 180, growth: 22.3 }
]

// Growth trends data for area chart
const growthTrendData = [
  { month: "Jan", startups: 2100, funding: 850, jobs: 35000 },
  { month: "Feb", startups: 2180, funding: 920, jobs: 36500 },
  { month: "Mar", startups: 2250, funding: 980, jobs: 37800 },
  { month: "Apr", startups: 2320, funding: 1050, jobs: 39200 },
  { month: "May", startups: 2380, funding: 1120, jobs: 40500 },
  { month: "Jun", startups: 2450, funding: 1180, jobs: 41800 },
  { month: "Jul", startups: 2520, funding: 1250, jobs: 43100 },
  { month: "Aug", startups: 2580, funding: 1320, jobs: 44400 },
  { month: "Sep", startups: 2650, funding: 1380, jobs: 45700 },
  { month: "Oct", startups: 2720, funding: 1450, jobs: 47000 },
  { month: "Nov", startups: 2780, funding: 1520, jobs: 48300 },
  { month: "Dec", startups: 2847, funding: 1590, jobs: 49678 }
]

// Monthly registrations data
const registrationsData = [
  { month: "Jan", registrations: 85 },
  { month: "Feb", registrations: 92 },
  { month: "Mar", registrations: 78 },
  { month: "Apr", registrations: 105 },
  { month: "May", registrations: 112 },
  { month: "Jun", registrations: 98 },
  { month: "Jul", registrations: 134 },
  { month: "Aug", registrations: 121 },
  { month: "Sep", registrations: 145 },
  { month: "Oct", registrations: 138 },
  { month: "Nov", registrations: 152 },
  { month: "Dec", registrations: 127 }
]

const insightsData = [
  {
    type: "funding",
    title: "FinTech Dominance",
    description: "FinTech continues to lead with 28% market share and ₹350 Cr in funding",
    impact: "high",
    trend: "up"
  },
  {
    type: "growth",
    title: "Tier-2 City Surge",
    description: "Hyderabad and Pune showing 20%+ YoY growth in startup activity",
    impact: "high",
    trend: "up"
  },
  {
    type: "opportunity",
    title: "AI Investment Boom",
    description: "AI & DeepTech funding increased 67% quarter-over-quarter",
    impact: "medium",
    trend: "up"
  },
  {
    type: "alert",
    title: "HealthTech Slowdown",
    description: "Healthcare funding decreased 12% compared to last quarter",
    impact: "medium",
    trend: "down"
  }
]

export default function AnalyticsPage() {
  const [isExporting, setIsExporting] = useState(false)

  const exportToPDF = async () => {
    try {
      setIsExporting(true)

      // Wait for state update and re-render
      await new Promise(resolve => setTimeout(resolve, 100))

      const element = document.querySelector('.analytics-content') as HTMLElement
      if (!element) {
        throw new Error('Analytics content not found')
      }

      // Configure html2canvas options to avoid color parsing issues
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      })

      // Create PDF
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')

      const imgWidth = 210 // A4 width in mm
      const pageHeight = 295 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Add additional pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Save the PDF
      pdf.save('innopulse-analytics.pdf')

    } catch (error) {
      console.error('PDF export failed:', error)
      alert('Failed to export PDF. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto p-6 space-y-8 analytics-content">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Analytics Overview
            </h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive insights into India's startup ecosystem performance
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Last updated: Dec 20, 2025</span>
          </div>
        </motion.div>

        {/* Key Metrics Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">Key Performance Indicators</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {kpiData.map((kpi, index) => (
              <motion.div
                key={kpi.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="glass-strong rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                    <kpi.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
                    kpi.changeType === 'positive'
                      ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
                      : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
                  }`}>
                    {kpi.changeType === 'positive' ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    <span>{kpi.change}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-foreground">{kpi.value}</div>
                  <div className="text-sm text-muted-foreground font-medium">{kpi.title}</div>
                  <div className="text-xs text-muted-foreground">{kpi.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Funding & Trends Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">Funding & Investment Trends</h2>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Primary Funding Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="xl:col-span-2"
            >
              <Card className="glass-strong shadow-lg border border-border/50 h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Funding Trends by Stage</CardTitle>
                      <CardDescription>Monthly investment distribution across funding stages</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={fundingTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                        <XAxis
                          dataKey="month"
                          stroke="#6B7280"
                          fontSize={12}
                          tickLine={false}
                        />
                        <YAxis
                          stroke="#6B7280"
                          fontSize={12}
                          tickLine={false}
                        />
                        {!isExporting && (
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--background))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                          />
                        )}
                        <Area
                          type="monotone"
                          dataKey="seed"
                          stackId="1"
                          stroke="#8B5CF6"
                          fill="#8B5CF6"
                          strokeWidth={2}
                          isAnimationActive={!isExporting}
                        />
                        <Area
                          type="monotone"
                          dataKey="seriesA"
                          stackId="1"
                          stroke="#3B82F6"
                          fill="#3B82F6"
                          strokeWidth={2}
                          isAnimationActive={!isExporting}
                        />
                        <Area
                          type="monotone"
                          dataKey="seriesB"
                          stackId="1"
                          stroke="#10B981"
                          fill="#10B981"
                          strokeWidth={2}
                          isAnimationActive={!isExporting}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 text-sm mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded"></div>
                      <span className="font-medium">Seed Stage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span className="font-medium">Series A</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span className="font-medium">Series B+</span>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                    <p className="text-sm text-muted-foreground text-center">
                      <span className="font-semibold text-blue-600">Key Insight:</span> Series A investments show the strongest growth trajectory,
                      representing 35% of total funding with consistent monthly increases.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sector Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass-strong shadow-lg border border-border/50 h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                      <PieChart className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Sector Distribution</CardTitle>
                      <CardDescription>Funding share by industry</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={sectorData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                            isAnimationActive={!isExporting}
                          >
                            {sectorData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          {!isExporting && (
                            <Tooltip
                              contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                              }}
                              formatter={(value) => [`${value}%`, 'Market Share']}
                            />
                          )}
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      {sectorData.map((sector) => (
                        <div key={sector.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: sector.color }}
                            ></div>
                            <span className="text-sm font-medium">{sector.name}</span>
                          </div>
                          <span className="text-sm font-bold">{sector.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        {/* Growth & Performance Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">Growth & Performance Analytics</h2>
          </div>

          {/* Ecosystem Growth Trends - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-strong shadow-lg border border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Ecosystem Growth Trends</CardTitle>
                    <CardDescription>Comprehensive view of startups, funding, and employment growth</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growthTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis
                        dataKey="month"
                        stroke="#6B7280"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis
                        yAxisId="left"
                        stroke="#6B7280"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#6B7280"
                        fontSize={12}
                        tickLine={false}
                      />
                      {!isExporting && (
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                          }}
                        />
                      )}
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="startups"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        name="Active Startups"
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                        isAnimationActive={!isExporting}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="funding"
                        stroke="#10B981"
                        strokeWidth={3}
                        name="Funding (₹ Cr)"
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                        isAnimationActive={!isExporting}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="jobs"
                        stroke="#F59E0B"
                        strokeWidth={3}
                        name="Jobs Created"
                        dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                        isAnimationActive={!isExporting}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bottom Row: Registrations, Geographic, Insights */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Monthly Registrations */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="glass-strong shadow-lg border border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Monthly Registrations</CardTitle>
                      <CardDescription>New startup registrations</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={registrationsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                        <XAxis
                          dataKey="month"
                          stroke="#6B7280"
                          fontSize={11}
                          tickLine={false}
                        />
                        <YAxis
                          stroke="#6B7280"
                          fontSize={11}
                          tickLine={false}
                        />
                        {!isExporting && (
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--background))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                          />
                        )}
                        <Area
                          type="monotone"
                          dataKey="registrations"
                          stroke="#8B5CF6"
                          fill="url(#registrationsGradient)"
                          strokeWidth={2}
                          isAnimationActive={!isExporting}
                        />
                        <defs>
                          <linearGradient id="registrationsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Geographic Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="glass-strong shadow-lg border border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Geographic Insights</CardTitle>
                      <CardDescription>Top startup hubs by activity</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cityData.map((city, index) => (
                      <motion.div
                        key={city.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-card/50 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{city.name}</div>
                            <div className="text-sm text-muted-foreground">{city.startups} startups</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">{city.funding}</div>
                          <div className="text-xs text-muted-foreground">+{city.growth}% growth</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Key Insights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="glass-strong shadow-lg border border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Key Insights</CardTitle>
                      <CardDescription>Auto-generated highlights</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {insightsData.map((insight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        className={`p-3 rounded-lg border transition-all duration-300 ${
                          insight.trend === 'up'
                            ? 'bg-green-50/50 dark:bg-green-950/20 border-green-200/50 dark:border-green-800/50'
                            : insight.trend === 'down'
                            ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200/50 dark:border-red-800/50'
                            : 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/50 dark:border-blue-800/50'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            insight.trend === 'up' ? 'bg-green-500' :
                            insight.trend === 'down' ? 'bg-red-500' : 'bg-blue-500'
                          }`}></div>
                          <p className="text-sm text-foreground leading-relaxed">{insight.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
