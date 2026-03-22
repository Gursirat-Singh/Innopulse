"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { getApprovedStartups, type Startup } from "@/lib/services/startup.services";
import { formatIndianCurrency, formatIndianNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button"
import Logo from "@/components/logo";
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
  Github,
  Linkedin,
  ExternalLink,
} from "lucide-react";
import Navbar from "@/components/navbar";

function FloatingShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-indigo-500/[0.15]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
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
  );
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
  );
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
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function HomePage() {
  const [startups, setStartups] = useState<Startup[]>([]);

  useEffect(() => {
    getApprovedStartups().then(setStartups).catch(console.error);
  }, []);

  const { startupCount, fundingSum, uniqueCities } = useMemo(() => {
    let fundingSum = 0;
    const citiesRender = new Set();
    startups.forEach(s => {
      fundingSum += Number(s.funding) || 0;
      citiesRender.add(s.city);
    });
    return { 
      startupCount: formatIndianNumber(startups.length), 
      fundingSum: formatIndianCurrency(fundingSum), 
      uniqueCities: startups.length > 0 ? citiesRender.size.toString() : "0"
    };
  }, [startups]);

  return (
    <main
      className="min-h-screen bg-background overflow-hidden"
      suppressHydrationWarning
    >
      <Navbar />
      <div
        className="fixed inset-0 pointer-events-none"
        suppressHydrationWarning
      >
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
      <section className="relative pt-36 pb-20 md:pt-48 md:pb-32 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              custom={0}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass gradient-border mb-10"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-foreground/80">
                Now tracking {startups.length > 0 ? startupCount : "..."} startups
              </span>
              <ArrowRight className="w-4 h-4 text-accent" />
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95]"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                India&apos;s Startup
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-chart-3 text-shimmer">
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
              Track startup growth, funding trends, employment impact, and
              policy effectiveness across India — all in one unified dashboard.
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="rounded-full px-8 h-14 text-base bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all border-0 glow-primary shadow-2xl shadow-primary/20"
                  >
                    Explore Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <a
                  href="https://youtu.be/a0GkgCabh2w"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full px-8 h-14 text-base glass border-white/10 hover:bg-white/5 text-foreground bg-transparent"
                  >
                    View Demo
                    <ExternalLink className="w-4 h-4 ml-2 opacity-50" />
                  </Button>
                </a>
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
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-2"
          >
            <motion.div className="w-1.5 h-1.5 rounded-full bg-accent" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 border-y border-white/5">
        <div className="absolute inset-0 glass" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              {
                value: startups.length > 0 ? startupCount : "...",
                label: "Startups Tracked",
                sublabel: "Across India",
                color: "from-primary/30",
              },
              {
                value: startups.length > 0 ? fundingSum : "...",
                label: "Funding Analyzed",
                sublabel: "Since 2015",
                color: "from-accent/30",
              },
              {
                value: startups.length > 0 ? uniqueCities : "...",
                label: "Cities Covered",
                sublabel: "Full coverage",
                color: "from-chart-3/30",
              },
              {
                value: "150+",
                label: "Policy Reports",
                sublabel: "Generated",
                color: "from-chart-4/30",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                className="relative group"
              >
                <motion.div
                  whileHover={{ scale: 1.03, y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-center p-6 rounded-2xl glass hover:bg-white/[0.04] transition-all duration-500"
                >
                  {/* Accent border top */}
                  <div className={`absolute top-0 left-[15%] right-[15%] h-[2px] bg-gradient-to-r ${stat.color} to-transparent rounded-full`} />
                  <motion.div
                    className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="mt-3 text-sm font-medium text-foreground">
                    {stat.label}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.sublabel}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative py-28 md:py-36">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4"
            >
              Platform Features
            </motion.span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground text-balance">
              Everything you need to understand
              <br className="hidden md:block" />
              <span className="text-gradient">
                {" "}India&apos;s innovation economy
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
                num: "01",
              },
              {
                icon: TrendingUp,
                title: "Funding Intelligence",
                description:
                  "Analyze funding rounds, investor activity, and capital flows over time with real-time updates.",
                gradient: "from-accent to-accent/50",
                num: "02",
              },
              {
                icon: Target,
                title: "Policy Impact Analysis",
                description:
                  "Understand how government policies affect startup formation, employment, and scale.",
                gradient: "from-chart-3 to-chart-3/50",
                num: "03",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="group relative p-8 pt-10 rounded-2xl glass hover:bg-white/[0.05] transition-all duration-500 cursor-pointer overflow-hidden"
              >
                {/* Gradient top border */}
                <div
                  className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${feature.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Hover glow effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}
                />

                {/* Number indicator */}
                <span className="absolute top-6 right-6 text-xs font-mono font-bold text-muted-foreground/30 group-hover:text-primary/40 transition-colors duration-300">
                  {feature.num}
                </span>

                <div
                  className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
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
      <section id="insights" className="relative py-28 md:py-36">
        <div className="absolute inset-0 glass" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-4"
              >
                Why InnoPulse
              </motion.span>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground text-balance">
                Data that drives
                <br />
                <span className="text-gradient">
                  strategic decisions
                </span>
              </h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                India&apos;s startup ecosystem is vast, fragmented, and fast-moving.
                InnoPulse turns scattered information into actionable insights
                for strategic decision-making.
              </p>

              <div className="mt-10 space-y-5">
                {[
                  {
                    icon: BarChart3,
                    text: "Evidence-based policymaking",
                    color: "from-primary to-primary/50",
                  },
                  {
                    icon: LineChart,
                    text: "Investor-ready market insights",
                    color: "from-accent to-accent/50",
                  },
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
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-foreground font-medium group-hover:text-accent transition-colors duration-300">
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block mt-10"
              >
                <Link href="/dashboard/analytics">
                  <Button
                    className="rounded-full px-8 h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity border-0 shadow-xl shadow-primary/15"
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
                  <span className="ml-4 text-sm text-muted-foreground font-medium">
                    Dashboard Preview
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      Funding Trends Q4 2024
                    </span>
                    <span className="text-sm text-accent font-semibold">
                      +23% YoY
                    </span>
                  </div>

                  {/* Animated Chart Bars */}
                  <div className="flex items-end gap-2 h-40">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map(
                      (height, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${height}%` }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.8,
                            delay: i * 0.05,
                            ease: "easeOut",
                          }}
                          whileHover={{ scaleY: 1.1 }}
                          className="flex-1 bg-gradient-to-t from-primary/40 to-accent/60 rounded-t-md cursor-pointer hover:from-primary/60 hover:to-accent/80 transition-colors duration-300"
                        />
                      )
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
                    {[
                      { value: "₹8.2K Cr", label: "Total Raised" },
                      { value: "342", label: "Deals Closed" },
                      { value: "18", label: "New Unicorns" },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="text-2xl font-bold text-foreground">
                          {stat.value}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {stat.label}
                        </div>
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
                    <div className="text-lg font-bold text-foreground">
                      2.5M+ Jobs
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Created by startups
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="about" className="relative py-28 md:py-36">
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
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl translate-x-1/2 -translate-y-1/2"
              />
              <motion.div
                animate={{
                  x: [0, -80, 0],
                  y: [0, 60, 0],
                }}
                transition={{
                  duration: 25,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-accent/20 to-transparent blur-3xl -translate-x-1/2 translate-y-1/2"
              />
              {/* Dot pattern overlay */}
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                  backgroundSize: "24px 24px",
                }}
              />
            </div>

            <div className="relative z-10">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-6"
              >
                Get Started Today
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold text-foreground text-balance"
              >
                Explore India&apos;s Innovation
                <br className="hidden md:block" />
                <span className="text-gradient"> Landscape</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mt-6 text-muted-foreground text-lg max-w-xl mx-auto"
              >
                Start exploring data-driven insights into India&apos;s startup
                economy today.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="rounded-full px-10 h-14 text-base bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity border-0 glow-primary shadow-2xl shadow-primary/20"
                    >
                      Enter Dashboard
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href="/dashboard/startups">
                    <Button
                      size="lg"
                      className="rounded-full px-10 h-14 text-base glass border-white/10 hover:bg-white/5 text-foreground bg-transparent"
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
      <footer className="relative py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          {/* Footer Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-8 mb-16">
            {/* Brand */}
            <div className="col-span-2 md:col-span-2">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Logo size="lg" className="mb-5" />
              </motion.div>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                India&apos;s most comprehensive startup intelligence platform.
                Empowering strategic decisions with data-driven insights.
              </p>
              {/* Social Links */}
              <div className="flex items-center gap-3 mt-6">
                {[
                  { icon: Github, href: "https://github.com/Gursirat-Singh", label: "GitHub" },
                  { icon: Linkedin, href: "https://www.linkedin.com/in/gursirat22", label: "LinkedIn" },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    aria-label={social.label}
                    className="w-9 h-9 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-300"
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                Platform
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Analytics", href: "/dashboard/analytics" },
                  { label: "Startups", href: "/dashboard/startups" },
                  { label: "Sectors", href: "/dashboard/sectors" },
                ].map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                Company
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "About", href: "#about" },
                  { label: "Terms", href: "/terms#terms" },
                  { label: "Privacy", href: "/terms#privacy" },
                  { label: "Contact", href: "/terms#contact" },
                ].map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                Resources
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "Initiatives", href: "/dashboard/initiatives" },
                  { label: "Policy Reports", href: "/dashboard/analytics" },
                  { label: "Data Insights", href: "/dashboard" },
                ].map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                © 2026 InnoPulse India. All rights reserved.
              </p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                Built with <span className="text-red-400 mx-1">♥</span> for India&apos;s startup ecosystem
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
