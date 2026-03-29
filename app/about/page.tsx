"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ArrowLeft, Target, TrendingUp, Shield, Zap, Globe, Users } from "lucide-react";

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: i * 0.15,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background overflow-hidden flex flex-col pt-32">
      <Navbar />

      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none -z-10" suppressHydrationWarning>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.05] via-transparent to-accent/[0.05] animate-gradient" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <motion.div
           animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
           transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
           className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-3xl translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <div className="flex-1">
        {/* Header Section */}
        <section className="relative pb-20">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <motion.div custom={0} variants={fadeUpVariants}>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Link>
              </motion.div>
              <motion.h1
                custom={1}
                variants={fadeUpVariants}
                className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.95] mb-6"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                  Illuminating India's
                </span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-chart-3 text-shimmer">
                  Innovation Ecosystem
                </span>
              </motion.h1>
              <motion.p
                custom={2}
                variants={fadeUpVariants}
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              >
                InnoPulse is India's most advanced, real-time startup intelligence platform. 
                We transform fragmented ecosystem data into crystalline strategic insights.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Mission Glass Cards */}
        <section className="relative py-24 border-y border-white/5">
          <div className="absolute inset-0 glass" />
          <div className="max-w-7xl mx-auto px-6 relative z-10 perspective-[2000px]">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-4">
                Our Core Mission
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Connecting Capital, Policy, and Founders
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Target, title: "Precision Tracking", desc: "Monitor multi-stage startup growth metrics from seed to unicorn scale." },
                { icon: Globe, title: "Geographic Mapping", desc: "Discover emerging tech hubs and capital distribution across states." },
                { icon: TrendingUp, title: "Actionable Insights", desc: "Equip venture capitalists and policymakers with evidence-based data." },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ 
                    scale: 1.03, 
                    y: -10, 
                    rotateX: 2, 
                    rotateY: -2,
                    boxShadow: "0 30px 60px -15px rgba(0,0,0,0.3)" 
                  }}
                  className="glass-strong rounded-3xl p-8 relative overflow-hidden group hover:border-primary/40 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 rounded-3xl" />
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg border border-white/10">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Foundation Story */}
        <section className="relative py-28">
           <div className="max-w-3xl mx-auto px-6 text-center space-y-8">
             <div className="w-16 h-16 mx-auto bg-gradient-to-br from-accent/20 to-chart-4/20 rounded-full flex items-center justify-center">
               <Zap className="w-8 h-8 text-accent" />
             </div>
             <h2 className="text-3xl font-bold">Why We Built InnoPulse</h2>
             <p className="text-muted-foreground text-lg leading-relaxed text-justify md:text-center">
               India's startup ecosystem is the third largest in the world, yet accessing centralized, verified, and rapidly updating intelligence remains incredibly difficult. Founders struggle to prove ecosystem growth to investors; policymakers lack real-time dashboards to measure initiative success, and analysts waste days aggregating funding data.
             </p>
             <p className="text-muted-foreground text-lg leading-relaxed text-justify md:text-center">
               InnoPulse acts as the definitive central nervous system for Indian innovation. By automating data ingestion and applying advanced analytics, we generate beautiful visual stories that drive funding momentum forward.
             </p>
           </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
