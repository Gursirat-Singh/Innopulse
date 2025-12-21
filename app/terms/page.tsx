"use client"

import Link from "next/link"
import { motion, type Variants } from "framer-motion"
import Navbar from "@/components/navbar"
import { ArrowLeft, Shield, Mail, FileText, ChevronRight, Zap } from "lucide-react"

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="relative pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Terms & Policies
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Important information about our terms of service, privacy policy, and how to contact us.
            </p>
          </motion.div>

          {/* Quick Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-12 grid md:grid-cols-3 gap-6"
          >
            {[
              { id: "privacy", icon: Shield, title: "Privacy Policy", desc: "How we protect your data" },
              { id: "contact", icon: Mail, title: "Contact Us", desc: "Get in touch with our team" },
              { id: "terms", icon: FileText, title: "Terms of Service", desc: "Our service agreements" },
            ].map((item, i) => (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                className="group p-6 rounded-2xl glass hover:bg-white/[0.05] transition-all duration-300 cursor-pointer"
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-accent group-hover:translate-x-1 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Privacy Policy Section */}
      <section id="privacy" className="relative py-20 border-y border-white/5">
        <div className="absolute inset-0 glass" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12"
          >
            <motion.div
              variants={fadeUpVariants}
              custom={0}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Privacy Policy</h2>
            </motion.div>
            <motion.p
              variants={fadeUpVariants}
              custom={1}
              className="text-muted-foreground text-lg leading-relaxed"
            >
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
            </motion.p>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                title: "Information We Collect",
                content: "We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. This may include your name, email address, and any other information you choose to provide."
              },
              {
                title: "How We Use Your Information",
                content: "We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and communicate with you about products, services, and promotional offers."
              },
              {
                title: "Information Sharing",
                content: "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law."
              },
              {
                title: "Data Security",
                content: "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure."
              },
              {
                title: "Your Rights",
                content: "You have the right to access, update, or delete your personal information. You may also opt out of receiving promotional communications from us by following the instructions in those communications."
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUpVariants}
                custom={i + 2}
                className="p-6 rounded-xl glass hover:bg-white/[0.02] transition-colors duration-300"
              >
                <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12"
          >
            <motion.div
              variants={fadeUpVariants}
              custom={0}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-chart-3 flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Contact Us</h2>
            </motion.div>
            <motion.p
              variants={fadeUpVariants}
              custom={1}
              className="text-muted-foreground text-lg leading-relaxed"
            >
              Have questions or need support? We're here to help. Reach out to us through any of the following channels.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                type: "General Inquiries",
                email: "hello@innopulse.in",
                desc: "For general questions about InnoPulse India and our services."
              },
              {
                type: "Support",
                email: "support@innopulse.in",
                desc: "Technical support and account-related assistance."
              },
              {
                type: "Partnerships",
                email: "partnerships@innopulse.in",
                desc: "Business partnerships and collaboration opportunities."
              },
              {
                type: "Press & Media",
                email: "press@innopulse.in",
                desc: "Media inquiries and press-related communications."
              },
            ].map((contact, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUpVariants}
                custom={i + 2}
                className="p-6 rounded-xl glass hover:bg-white/[0.02] transition-colors duration-300"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-xl font-semibold text-foreground mb-2">{contact.type}</h3>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-accent hover:text-accent/80 transition-colors font-medium mb-3 block"
                >
                  {contact.email}
                </a>
                <p className="text-muted-foreground leading-relaxed">{contact.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
            custom={6}
            className="mt-12 p-8 rounded-2xl glass-strong text-center"
          >
            <h3 className="text-2xl font-semibold text-foreground mb-4">Office Address</h3>
            <p className="text-muted-foreground leading-relaxed">
              InnoPulse India<br />
              Innovation Hub, Technology Park<br />
              Bangalore, Karnataka 560001<br />
              India
            </p>
          </motion.div>
        </div>
      </section>

      {/* Terms of Service Section */}
      <section id="terms" className="relative py-20 border-y border-white/5">
        <div className="absolute inset-0 glass" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12"
          >
            <motion.div
              variants={fadeUpVariants}
              custom={0}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-chart-3 to-primary flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Terms of Service</h2>
            </motion.div>
            <motion.p
              variants={fadeUpVariants}
              custom={1}
              className="text-muted-foreground text-lg leading-relaxed"
            >
              These terms govern your use of InnoPulse India services. By using our platform, you agree to these terms.
            </motion.p>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                title: "Acceptance of Terms",
                content: "By accessing and using InnoPulse India, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
              },
              {
                title: "Use License",
                content: "Permission is granted to temporarily access the materials (information or software) on InnoPulse India's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title."
              },
              {
                title: "User Responsibilities",
                content: "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account or password."
              },
              {
                title: "Prohibited Uses",
                content: "You may not use our services: for any unlawful purpose or to solicit others to perform unlawful acts; to violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances."
              },
              {
                title: "Service Availability",
                content: "We strive to provide continuous service but do not guarantee that the service will be uninterrupted or error-free. We reserve the right to modify or discontinue the service at any time."
              },
              {
                title: "Limitation of Liability",
                content: "In no event shall InnoPulse India or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our platform."
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUpVariants}
                custom={i + 2}
                className="p-6 rounded-xl glass hover:bg-white/[0.02] transition-colors duration-300"
              >
                <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.content}</p>
              </motion.div>
            ))}
          </div>
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
              <Link href="/terms#privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group">
                Privacy
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
              </Link>
              <Link href="/terms#terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group">
                Terms
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
              </Link>
              <Link href="/terms#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group">
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
