import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Truck, Menu, Phone, X, ChevronDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactDialog } from "@/components/site/ContactDialog";
import { popularCities } from "@/lib/data/cities";
import { Logo } from "@/components/site/Logo";
import { HeaderWeatherBadge } from "@/components/site/HeaderWeatherBadge";

const cityLinks = popularCities.map((c) => ({
  label: c.name,
  href: `/ts/${c.name.toLowerCase()}` as const,
}));

const routeLinks = [
  { label: "Delhi → Mumbai", from: "Delhi", to: "Mumbai" },
  { label: "Delhi → Jaipur", from: "Delhi", to: "Jaipur" },
  { label: "Mumbai → Pune", from: "Mumbai", to: "Pune" },
  { label: "Mumbai → Bengaluru", from: "Mumbai", to: "Bengaluru" },
  { label: "Bengaluru → Chennai", from: "Bengaluru", to: "Chennai" },
  { label: "Kolkata → Patna", from: "Kolkata", to: "Patna" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [routesOpen, setRoutesOpen] = useState(false);
  const [citiesOpen, setCitiesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">
        {/* Logo */}
        <Logo />

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-2 lg:flex">
          <Link to="/ptl">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-primary/40 text-primary font-semibold hover:bg-primary/5"
            >
              Looking for Part Load
            </Button>
          </Link>

          {/* Routes dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setRoutesOpen(true)}
            onMouseLeave={() => setRoutesOpen(false)}
          >
            <button className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
              Routes <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {routesOpen && (
              <div className="absolute left-0 top-full z-50 min-w-[220px] rounded-xl border border-border bg-card p-2 shadow-[var(--shadow-elevated)]">
                {routeLinks.map((r) => (
                  <Link
                    key={r.label}
                    to="/booking"
                    search={{ from: r.from, to: r.to }}
                    className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    {r.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Popular Cities dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setCitiesOpen(true)}
            onMouseLeave={() => setCitiesOpen(false)}
          >
            <button className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
              Popular Cities <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {citiesOpen && (
              <div className="absolute left-0 top-full z-50 min-w-[320px] rounded-xl border border-border bg-card p-3 shadow-[var(--shadow-elevated)]">
                <div className="grid grid-cols-2 gap-1">
                  {cityLinks.map((c) => (
                    <Link
                      key={c.label}
                      to="/ts/$city"
                      params={{ city: c.label.toLowerCase() }}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <MapPin className="h-3.5 w-3.5 text-accent" />
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <ContactDialog>
            <button className="px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
              Contact Us
            </button>
          </ContactDialog>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <HeaderWeatherBadge />

          <a
            href="tel:+919651429006"
            className="hidden items-center gap-2 text-sm font-semibold text-foreground sm:flex lg:hidden xl:flex"
          >
            <Phone className="h-4 w-4 text-accent" />
            +91 96514 29006
          </a>

          <Link to="/truck-owner/login" className="hidden sm:block">
            <Button variant="outline" size="sm" className="rounded-full font-semibold">
              I'm Truck Owner
            </Button>
          </Link>

          <Link to="/booking" search={{ from: "", to: "" }}>
            <Button variant="cta" size="lg">
              Book a Truck
            </Button>
          </Link>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-card px-5 py-6 lg:hidden">
          <nav className="flex flex-col gap-1">
            <Link
              to="/ptl"
              className="rounded-lg px-4 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
              onClick={() => setMobileOpen(false)}
            >
              Part Load Marketplace
            </Link>
            <Link
              to="/booking"
              search={{ from: "", to: "" }}
              className="rounded-lg px-4 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
              onClick={() => setMobileOpen(false)}
            >
              Book Full Truck
            </Link>
            <Link
              to="/buy-gps"
              className="rounded-lg px-4 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
              onClick={() => setMobileOpen(false)}
            >
              Buy GPS Tracker
            </Link>
            <Link
              to="/truck-owner/login"
              className="rounded-lg px-4 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
              onClick={() => setMobileOpen(false)}
            >
              I'm Truck Owner
            </Link>
            <Link
              to="/admin"
              className="rounded-lg px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/10"
              onClick={() => setMobileOpen(false)}
            >
              🔐 Admin Control Center
            </Link>
            <Link
              to="/careers"
              className="rounded-lg px-4 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
              onClick={() => setMobileOpen(false)}
            >
              Careers
            </Link>

            <div className="mt-4 border-t border-border pt-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Popular Cities
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {cityLinks.slice(0, 9).map((c) => (
                  <Link
                    key={c.label}
                    to="/ts/$city"
                    params={{ city: c.label.toLowerCase() as string }}
                    className="rounded-lg px-2 py-1.5 text-center text-xs text-muted-foreground hover:bg-secondary hover:text-foreground"
                    onClick={() => setMobileOpen(false)}
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
