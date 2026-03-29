import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";
import Logo from "./logo";

export function Footer() {
  return (
    <footer className="relative py-20 border-t border-white/5 bg-background">
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
                  target="_blank"
                  rel="noopener noreferrer"
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
                { label: "About", href: "/about" },
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
  );
}
