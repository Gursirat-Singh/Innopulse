"use client"

import Link from "next/link"
import { motion , type Variants } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  BarChart3,
  Building2,
  TrendingUp,
  Users,
  Zap,
  Target,
  LineChart,
  PieChart,
  Sparkles,
} from "lucide-react"
import Navbar from "@/components/navbar"

function FloatingShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-indigo-500/[0.15]",
}: {
  className?: string
  delay?: number
  width?: number
  height?: number
  rotate?: number
  gradient?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate: rotate }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r ${gradient} to-transparent backdrop-blur-[2px] border border-white/[0.1] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] after:absolute after:inset-0 after:rounded-full after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),transparent_70%)]`}
        />
      </motion.div>
    </motion.div>
  )
}

function GridPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  )
}

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.3 + i * 0.15,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background overflow-hidden" suppressHydrationWarning>
      <Navbar />
      <div className="fixed inset-0 pointer-events-none" suppressHydrationWarning>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-accent/[0.08] animate-gradient" />
        <GridPattern />

        {/* Floating geometric shapes */}
        <FloatingShape
          delay={0.2}
          width={600}
          height={140}
          rotate={12}
          gradient="from-primary/[0.12]"
          className="left-[-15%] top-[15%]"
        />
        <FloatingShape
          delay={0.4}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-accent/[0.12]"
          className="right-[-10%] top-[60%]"
        />
        <FloatingShape
          delay={0.3}
          width={350}
          height={90}
          rotate={-8}
          gradient="from-chart-3/[0.12]"
          className="left-[5%] bottom-[10%]"
        />
        <FloatingShape
          delay={0.5}
          width={250}
          height={70}
          rotate={20}
          gradient="from-chart-4/[0.12]"
          className="right-[20%] top-[8%]"
        />
        <FloatingShape
          delay={0.6}
          width={180}
          height={50}
          rotate={-25}
          gradient="from-primary/[0.1]"
          className="left-[30%] top-[5%]"
        />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              custom={0}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-foreground/80">Now tracking 50,000+ startups</span>
              <ArrowRight className="w-4 h-4 text-accent" />
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                India's Startup
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-chart-3">
                Intelligence Platform
              </span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Track startup growth, funding trends, employment impact, and policy effectiveness across India — all in
              one unified dashboard.
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="rounded-full px-8 h-14 text-base bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity border-0 glow-primary"
                  >
                    Explore Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 h-14 text-base glass border-white/10 hover:bg-white/5 text-foreground bg-transparent"
                >
                  View Demo
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-2"
          >
            <motion.div className="w-1.5 h-1.5 rounded-full bg-accent" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 border-y border-white/5">
        <div className="absolute inset-0 glass" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4"
          >
            {[
              { value: "50,000+", label: "Startups Tracked", sublabel: "Across India" },
              { value: "₹2.5L Cr", label: "Funding Analyzed", sublabel: "Since 2015" },
              { value: "28", label: "States Covered", sublabel: "Full coverage" },
              { value: "150+", label: "Policy Reports", sublabel: "Generated" },
            ].map((stat, i) => (
              <motion.div key={i} variants={cardVariants} className="text-center group">
                <motion.div
                  className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {stat.value}
                </motion.div>
                <div className="mt-2 text-sm font-medium text-foreground">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.sublabel}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-foreground text-balance">
              Everything you need to understand
              <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                India's innovation economy
              </span>
            </h2>
            <p className="mt-6 text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful tools designed for policymakers, analysts, and founders.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Building2,
                title: "Startup Tracking",
                description:
                  "Monitor startups across sectors, cities, and growth stages with structured, comparable data.",
                gradient: "from-primary to-primary/50",
              },
              {
                icon: TrendingUp,
                title: "Funding Intelligence",
                description:
                  "Analyze funding rounds, investor activity, and capital flows over time with real-time updates.",
                gradient: "from-accent to-accent/50",
              },
              {
                icon: Target,
                title: "Policy Impact Analysis",
                description: "Understand how government policies affect startup formation, employment, and scale.",
                gradient: "from-chart-3 to-chart-3/50",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="group relative p-8 rounded-2xl glass hover:bg-white/[0.05] transition-all duration-500 cursor-pointer overflow-hidden"
              >
                {/* Hover glow effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}
                />

                <div
                  className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="relative text-xl font-semibold text-foreground mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-foreground group-hover:to-accent transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="relative text-muted-foreground leading-relaxed group-hover:text-foreground/70 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Arrow indicator */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="absolute bottom-8 right-8"
                >
                  <ArrowRight className="w-5 h-5 text-accent" />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Insights Section */}
      <section id="insights" className="relative py-24 md:py-32">
        <div className="absolute inset-0 glass" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-foreground text-balance">
                Data that drives
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  strategic decisions
                </span>
              </h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                India's startup ecosystem is vast, fragmented, and fast-moving. InnoPulse turns scattered information
                into actionable insights for strategic decision-making.
              </p>

              <div className="mt-10 space-y-5">
                {[
                  { icon: BarChart3, text: "Evidence-based policymaking", color: "from-primary to-primary/50" },
                  { icon: LineChart, text: "Investor-ready market insights", color: "from-accent to-accent/50" },
                  {
                    icon: PieChart,
                    text: "Founder benchmarking and trend analysis",
                    color: "from-chart-3 to-chart-3/50",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    whileHover={{ x: 8 }}
                    className="flex items-center gap-4 group cursor-pointer"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-foreground font-medium group-hover:text-accent transition-colors duration-300">
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="inline-block mt-10">
                <Link href="/dashboard/analytics">
                  <Button
                    className="rounded-full px-8 h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity border-0"
                    size="lg"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="glass-strong rounded-3xl p-8 glow-primary"
              >
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  <span className="ml-4 text-sm text-muted-foreground">Dashboard Preview</span>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Funding Trends Q4 2024</span>
                    <span className="text-sm text-accent font-semibold">+23% YoY</span>
                  </div>

                  {/* Animated Chart Bars */}
                  <div className="flex items-end gap-2 h-40">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${height}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
                        whileHover={{ scaleY: 1.1 }}
                        className="flex-1 bg-gradient-to-t from-primary/40 to-accent/60 rounded-t-md cursor-pointer hover:from-primary/60 hover:to-accent/80 transition-colors duration-300"
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
                    {[
                      { value: "₹8.2K Cr", label: "Total Raised" },
                      { value: "342", label: "Deals Closed" },
                      { value: "18", label: "New Unicorns" },
                    ].map((stat, i) => (
                      <motion.div key={i} whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                        <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="absolute -bottom-6 -right-6 glass-strong rounded-xl p-5 glow-accent"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">2.5M+ Jobs</div>
                    <div className="text-sm text-muted-foreground">Created by startups</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-3xl glass-strong p-12 md:p-20 text-center"
          >
            {/* Animated background orbs */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                animate={{
                  x: [0, 100, 0],
                  y: [0, -50, 0],
                }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl translate-x-1/2 -translate-y-1/2"
              />
              <motion.div
                animate={{
                  x: [0, -80, 0],
                  y: [0, 60, 0],
                }}
                transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-accent/20 to-transparent blur-3xl -translate-x-1/2 translate-y-1/2"
              />
            </div>

            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-5xl font-bold text-foreground text-balance"
              >
                Explore India's Innovation Landscape
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mt-6 text-muted-foreground text-lg max-w-xl mx-auto"
              >
                Start exploring data-driven insights into India's startup economy today.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="rounded-full px-10 h-14 text-base bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity border-0 glow-primary"
                    >
                      Enter Dashboard
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link href="/dashboard/startups">
                  <Button
                    size="lg"
                    className="rounded-full px-10 h-14 text-base bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white border-0 glow-blue"
                  >
                    Browse Startups
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-foreground text-lg">InnoPulse India</span>
            </motion.div>
            <div className="flex items-center gap-8">
              <Link
                href="/terms#privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                Privacy
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href="/terms#terms"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                Terms
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href="/terms#contact"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 InnoPulse India. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
