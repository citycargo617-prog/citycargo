import { Truck, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/site/Logo";

const quickLinks = [
  { label: "Book a Truck", href: "/booking" as const, search: { from: "", to: "" } },
  { label: "Part Load", href: "/ptl" as const, search: undefined },
  { label: "Buy GPS Tracker", href: "/buy-gps" as const, search: undefined },
  { label: "Truck Owner Login", href: "/truck-owner/login" as const, search: undefined },
  { label: "Admin Portal", href: "/admin" as const, search: undefined },
  { label: "Careers", href: "/careers" as const, search: undefined },
];

const serviceLinks = [
  { label: "Full Truck Load", href: "/booking" as const, search: { from: "", to: "" } },
  { label: "Part Truck Load", href: "/ptl" as const, search: undefined },
  { label: "Fleet Management", href: "/buy-gps" as const, search: undefined },
  { label: "Goods Insurance", href: "/booking" as const, search: { from: "", to: "" } },
  { label: "GPS Tracking", href: "/buy-gps" as const, search: undefined },
];

const popularCities = [
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Kolkata",
  "Jaipur",
  "Lucknow",
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-[oklch(0.15_0.04_260)]">
      {/* Main footer */}
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <Logo textClassName="text-white" accentClassName="text-white/80" className="h-11 w-11" />
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            India's trusted truck booking platform. Verified fleet, transparent pricing, and 24x7
            GPS tracking on every load.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <a
              href="tel:+919651429006"
              className="flex items-center gap-2 text-sm text-white/70 hover:text-accent transition-colors"
            >
              <Phone className="h-4 w-4 text-accent" /> +91 96514 29006
            </a>
            <a
              href="mailto:support@citycargo.in"
              className="flex items-center gap-2 text-sm text-white/70 hover:text-accent transition-colors"
            >
              <Mail className="h-4 w-4 text-accent" /> support@citycargo.in
            </a>
            <span className="flex items-start gap-2 text-sm text-white/70">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              Shop.208 Balaji plaza sector 12 Indira Nagar near polytechnic pin code (226016)
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-widest text-white/90">
            Quick Links
          </h4>
          <ul className="mt-5 space-y-3">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.href}
                  {...(l.search ? { search: l.search } : {})}
                  className="text-sm text-white/60 transition-colors hover:text-accent"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-widest text-white/90">
            Services
          </h4>
          <ul className="mt-5 space-y-3">
            {serviceLinks.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.href}
                  className="text-sm text-white/60 transition-colors hover:text-accent"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Popular Cities */}
        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-widest text-white/90">
            Popular Cities
          </h4>
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
            {popularCities.map((c) => (
              <li key={c}>
                <Link
                  to="/ts/$city"
                  params={{ city: c.toLowerCase() }}
                  className="text-sm text-white/60 transition-colors hover:text-accent"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} City Cargo Logistics Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
