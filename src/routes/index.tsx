import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Truck,
  MapPin,
  ShieldCheck,
  IndianRupee,
  Clock,
  Headphones,
  Package,
  Route as RouteIcon,
  Star,
  ArrowRight,
  CheckCircle2,
  XCircle,
  FileText,
  Shield,

  Smartphone,
  Play,
  Gift,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { CitySearchInput } from "@/components/site/CitySearchInput";
import { WeatherWidget } from "@/components/site/WeatherWidget";
import { EstimateModal } from "@/components/site/EstimateModal";
import heroTruck from "@/assets/hero-truck.jpg";
import { popularCities } from "@/lib/data/cities";
import { useAdminData } from "@/lib/admin-store";
import { BankDiscountForm } from "@/components/site/BankDiscountForm";
import { WhatsAppFloatingButton } from "@/components/site/WhatsAppFloatingButton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "City Cargo — Book Trucks Online for Full Load Transport" },
      {
        name: "description",
        content:
          "City Cargo connects you with verified trucks across India. Instant price estimates, GPS tracking and on-time full-load delivery.",
      },
      { property: "og:title", content: "City Cargo — Truck Booking Made Simple" },
      {
        property: "og:description",
        content:
          "Book verified trucks for full load transport with live GPS tracking and transparent pricing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

/* ─── Data ─────────────────────────────────────────── */

const features = [
  {
    icon: IndianRupee,
    title: "Transparent pricing",
    text: "Upfront estimates with zero hidden charges on every booking.",
  },
  {
    icon: MapPin,
    title: "Live GPS tracking",
    text: "Follow your consignment from pickup to doorstep in real time.",
  },
  {
    icon: ShieldCheck,
    title: "Verified fleet",
    text: "Every driver and vehicle is document-checked before dispatch.",
  },
  {
    icon: Clock,
    title: "On-time delivery",
    text: "98.4% of City Cargo loads arrive within the promised window.",
  },
  {
    icon: Headphones,
    title: "24x7 support",
    text: "A real person on call whenever your shipment needs attention.",
  },
  {
    icon: RouteIcon,
    title: "Pan-India routes",
    text: "20,000+ pin codes served across 600 cities and towns.",
  },
];

const services = [
  {
    icon: Truck,
    title: "Full truck load",
    text: "Dedicated vehicles from 1 ton tempos to 32 ft multi-axle trailers.",
  },
  {
    icon: Package,
    title: "Part load",
    text: "Pay only for the space you use on shared, scheduled routes.",
    href: "/ptl",
  },
  {
    icon: RouteIcon,
    title: "Fleet management",
    text: "GPS, fuel and driver insights for your own trucks in one dashboard.",
    href: "/buy-gps",
  },
];

const stats = [
  { value: "26L+", label: "Trucks on network" },
  { value: "600+", label: "Cities covered" },
  { value: "50K+", label: "Businesses served" },
  { value: "98.4%", label: "On-time delivery" },
];

const comparison = [
  "Book Trucks in 30 mins",
  "All Truck Types",
  "Deliver across India",
  "Market's Best Price",
  "24x7 GPS Tracking",
];

const testimonials = [
  {
    name: "Rakesh Malhotra",
    role: "Steel trader, Ludhiana",
    text: "City Cargo cut our dispatch time in half. Getting a truck now takes minutes, not a full day of phone calls.",
    rating: 5,
  },
  {
    name: "Anita Deshmukh",
    role: "FMCG distributor, Pune",
    text: "Live tracking means my clients stop calling me for updates. The pricing has stayed exactly as quoted.",
    rating: 5,
  },
  {
    name: "Imran Sheikh",
    role: "Furniture maker, Jaipur",
    text: "Verified drivers made all the difference. Six months, forty loads, not one damaged consignment.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Textile exporter, Surat",
    text: "The part-load service is a game-changer for us. We save 40% on smaller shipments without compromising on speed.",
    rating: 5,
  },
];



/* ─── Component ────────────────────────────────────── */

function Index() {
  const { banner } = useAdminData();
  const [pickupCity, setPickupCity] = useState("");
  const [dropCity, setDropCity] = useState("");
  const [showBankForm, setShowBankForm] = useState(false);
  const [showEstimate, setShowEstimate] = useState(false);

  function handleGetEstimate() {
    setShowEstimate(true);
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <EstimateModal
        open={showEstimate}
        onClose={() => setShowEstimate(false)}
        fromCity={pickupCity}
        toCity={dropCity}
      />

      {/* Top Announcement Bar if enabled */}
      {banner.showAnnouncement && banner.announcementText && (
        <div className="bg-primary px-4 py-2 text-center text-xs font-semibold text-primary-foreground">
          <p>{banner.announcementText}</p>
        </div>
      )}

      {/* ── Hero ── */}
      <section className="hero-surface relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-foreground">
              {banner.promoTagline || "India ka #1 Truck Booking Platform"}
            </span>
            <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-primary-foreground md:text-6xl">
              Book a truck in
              <span className="block bg-clip-text text-accent">under 5 minutes</span>
            </h1>
            <p className="mt-4 text-sm font-medium text-primary-foreground/70">
              {banner.promoSubtitle || "Trusted by 50,000+ Businesses Across India"}
            </p>

            {/* Booking card */}
            <div className="mt-8 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/50 p-5 shadow-[var(--shadow-elevated)]">
              <p className="mb-3 font-display text-base font-bold text-foreground">
                Need a full truck?
              </p>
              <div className="relative space-y-3">
                <CitySearchInput
                  placeholder="Enter your loading city"
                  value={pickupCity}
                  onChange={setPickupCity}
                  icon="pickup"
                />
                {/* Dotted connector */}
                <div className="absolute left-[27px] top-[48px] h-5 w-0.5 border-l-2 border-dashed border-muted-foreground/40" />
                <CitySearchInput
                  placeholder="Enter your unloading city"
                  value={dropCity}
                  onChange={setDropCity}
                  icon="drop"
                />
              </div>

              {/* Referral / promo banner */}
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-accent/15 p-3.5">
                <Gift className="h-5 w-5 shrink-0 text-accent-foreground" />
                <div>
                  <p className="text-xs font-bold text-accent-foreground">
                    {banner.referralOffer || "Refer and earn upto ₹5,000"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Share your referral code to start earning
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row items-center gap-2.5">
                <Button
                  variant="cta"
                  size="xl"
                  className="w-full sm:flex-1 !bg-foreground !text-background hover:!bg-foreground/90 font-bold"
                  onClick={handleGetEstimate}
                >
                  Get price estimate <ArrowRight className="h-4 w-4" />
                </Button>

                <a
                  href={`https://wa.me/919651429006?text=${encodeURIComponent(
                    pickupCity && dropCity
                      ? `Hi City Cargo, I want to book a truck from ${pickupCity} to ${dropCity}. Please share rates.`
                      : "Hi City Cargo, I want to book a truck. Please share vehicle options and rates."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 font-display text-sm font-bold text-white shadow-md shadow-[#25D366]/25 hover:bg-[#20bd5a] hover:scale-[1.02] transition-all"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="animate-cruise overflow-hidden rounded-3xl">
              <video
                src="/hero-video.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-[600px] rounded-3xl shadow-[var(--shadow-elevated)] object-cover"
              />
            </div>
            <div className="animate-float-soft absolute -bottom-6 left-4 rounded-2xl bg-card px-5 py-4 shadow-[var(--shadow-card)]">
              <p className="text-xs font-semibold text-muted-foreground">Live shipment</p>
              <p className="font-display text-lg font-bold text-foreground">Delhi → Jaipur</p>
              <p className="text-xs font-semibold text-accent-foreground">Arriving in 3h 20m</p>
            </div>
          </div>
        </div>

        {/* Animated road strip */}
        <div className="relative h-14 border-t border-primary-foreground/15 bg-primary/40">
          <div className="road-track absolute left-0 top-1/2 h-1.5 w-full -translate-y-1/2 opacity-60" />
          <Truck className="road-truck h-8 w-8 text-accent" style={{ top: "12px" }} />
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="card-elevated rounded-2xl p-6 text-center">
              <p className="font-display text-4xl font-extrabold text-primary">{s.value}</p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Live Route & Transit Weather Intelligence ── */}
      <section id="weather-section" className="mx-auto max-w-7xl px-5 py-8">
        <WeatherWidget city={pickupCity} onCityChange={setPickupCity} />
      </section>

      {/* ── Services ── */}
      <section id="services" className="mx-auto max-w-7xl px-5 py-16">
        <h2 className="font-display text-4xl font-extrabold tracking-tight text-foreground">
          What we move for you
        </h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
          One partner for every kind of load, from a single pallet to a full trailer.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {services.map((s) => (
            <Link
              key={s.title}
              to={s.href || "/booking"}
              className="card-elevated rounded-3xl p-8 block"
            >
              <span className="accent-surface inline-flex h-14 w-14 items-center justify-center rounded-2xl">
                <s.icon className="h-7 w-7 text-accent-foreground" />
              </span>
              <h3 className="mt-6 font-display text-xl font-bold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Why Choose Us — Comparison Table ── */}
      <section className="bg-secondary/60 py-20">
        <div className="mx-auto max-w-7xl px-5">
          <h2 className="text-center font-display text-4xl font-extrabold tracking-tight text-foreground">
            Why choose City Cargo?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            With 26+ lakh GPS-enabled trucks delivering top features for you.
          </p>

          {/* Comparison table */}
          <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
            <div className="grid grid-cols-[1fr_120px_120px] items-center border-b border-border px-6 py-4">
              <span />
              <span className="text-center font-display text-sm font-bold text-primary">
                City Cargo
              </span>
              <span className="text-center text-sm font-bold text-muted-foreground">Others</span>
            </div>
            {comparison.map((item, i) => (
              <div
                key={item}
                className={`grid grid-cols-[1fr_120px_120px] items-center px-6 py-4 ${i % 2 === 0 ? "bg-secondary/40" : ""}`}
              >
                <span className="text-sm font-semibold text-foreground">{item}</span>
                <span className="flex justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </span>
                <span className="flex justify-center">
                  <XCircle className="h-6 w-6 text-foreground/30" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Goods Insurance Banner ── */}
      <section className="bg-[oklch(0.2_0.04_258)] py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-5 md:flex-row md:justify-between">
          <div>
            <h2 className="font-display text-3xl font-extrabold text-white md:text-4xl">
              Up to ₹50 Lakh+ Coverage for Your Goods
            </h2>
            <p className="mt-1 text-lg font-bold text-accent">Starting at Just ₹299</p>
            <p className="mt-3 text-sm text-white/60">
              Comprehensive goods-in-transit insurance powered by top insurers. Opt in during
              booking.
            </p>
          </div>
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-blue-400/20">
            <Shield className="h-14 w-14 text-blue-300" />
          </div>
        </div>
      </section>

      {/* ── Video Showcase Section (Full Width Left to Right) ── */}
      <section className="w-full py-16">
        <div className="mx-auto max-w-7xl px-5 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <Play className="h-3.5 w-3.5 fill-primary text-primary" />
            <span>Watch Demo</span>
          </div>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            See City Cargo in Action
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Discover how easy it is to book verified trucks, monitor live GPS routes, and streamline
            your supply chain across India.
          </p>
        </div>

        {/* Full-width Edge-to-Edge Video Container */}
        <div className="relative mt-10 w-full overflow-hidden bg-black shadow-2xl">
          <video
            src="/showcase-video.mp4"
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            className="h-auto w-full aspect-video max-h-[85vh] object-cover pointer-events-none select-none"
          />
        </div>

        {/* Feature Highlights beneath video */}
        <div className="mx-auto mt-10 max-w-7xl px-5">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="card-elevated flex items-center gap-3 rounded-2xl p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-sm font-bold text-foreground">Verified Trucks</p>
                <p className="text-xs text-muted-foreground">Pan-India fleet</p>
              </div>
            </div>

            <div className="card-elevated flex items-center gap-3 rounded-2xl p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-sm font-bold text-foreground">Live GPS</p>
                <p className="text-xs text-muted-foreground">Real-time status</p>
              </div>
            </div>

            <div className="card-elevated flex items-center gap-3 rounded-2xl p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-sm font-bold text-foreground">Digital e-Bilty</p>
                <p className="text-xs text-muted-foreground">Instant POD docs</p>
              </div>
            </div>

            <div className="card-elevated flex items-center gap-3 rounded-2xl p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-sm font-bold text-foreground">Transit Cover</p>
                <p className="text-xs text-muted-foreground">Up to ₹50L+ safe</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why us features grid ── */}
      <section className="bg-secondary/60 py-20">
        <div className="mx-auto max-w-7xl px-5">
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-foreground">
            Built for reliability
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="card-elevated rounded-2xl p-6">
                <f.icon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 font-display text-lg font-bold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <h2 className="font-display text-4xl font-extrabold tracking-tight text-foreground">
          Loved by shippers
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <div key={t.name} className="card-elevated rounded-3xl p-7">
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground">"{t.text}"</p>
              <p className="mt-6 font-display font-bold text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Download App ── */}
      <section className="bg-secondary/60 py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-5 text-center md:flex-row md:text-left">
          <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-3xl bg-primary/10">
            <Smartphone className="h-16 w-16 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
              Download the City Cargo App
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Book trucks, track shipments, and manage payments on the go. Available on Android and
              iOS.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3 md:justify-start">
              <Button variant="cta" size="lg">
                <Smartphone className="mr-2 h-4 w-4" /> Google Play
              </Button>
              <Button variant="soft" size="lg">
                <Smartphone className="mr-2 h-4 w-4" /> App Store
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Popular Cities ── */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <h2 className="font-display text-4xl font-extrabold tracking-tight text-foreground">
          Transport services across India
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {popularCities.map((c) => (
            <Link
              key={c.name}
              to="/ts/$city"
              params={{ city: c.name.toLowerCase() }}
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-all hover:border-primary/40 hover:shadow-[var(--shadow-card)]"
            >
              <MapPin className="h-4 w-4 text-accent" />
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Bank Employee Special Discount ── */}
      <section className="relative overflow-hidden bg-[oklch(0.16_0.04_260)] py-20">
        {/* Subtle grid pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-5">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* ── Left: Video ── */}
            <div className="animate-fade-in-up relative">
              <div className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                <video
                  src="/new client.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  disablePictureInPicture
                  className="aspect-video w-full object-cover pointer-events-none select-none"
                />
              </div>
              {/* Floating badge on video */}
              <div className="absolute -bottom-4 -right-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent badge-pulse-glow lg:-right-6">
                <div className="text-center">
                  <p className="font-display text-xl font-extrabold leading-none text-accent-foreground">
                    15%
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-accent-foreground/80">
                    OFF
                  </p>
                </div>
              </div>
            </div>

            {/* ── Right: Details ── */}
            <div className="animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent">
                <Gift className="h-3.5 w-3.5" />
                Exclusive Offer
              </span>

              <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight tracking-tight text-white md:text-4xl lg:text-[2.75rem]">
                Special discount for{" "}
                <span className="bg-gradient-to-r from-accent to-[oklch(0.85_0.15_80)] bg-clip-text text-transparent">
                  bank employees
                </span>
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/60 md:text-base">
                We value government and banking professionals. All bank employees across India
                get an exclusive <strong className="text-white">flat 15% discount</strong> on
                full truck load bookings. Just verify your employee ID and start saving.
              </p>

              {/* Benefits list */}
              <div className="mt-6 space-y-3">
                {[
                  "Flat 15% off on all FTL bookings",
                  "Priority truck assignment within 15 mins",
                  "Free goods-in-transit insurance (up to ₹10L)",
                  "Dedicated relationship manager",
                  "Flexible payment — pay after delivery",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400" />
                    <span className="text-sm font-medium text-white/85">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  variant="cta"
                  size="xl"
                  className="shimmer-overlay"
                  onClick={() => setShowBankForm(true)}
                >
                  Claim your discount <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* Bank Discount Form Modal */}
              <BankDiscountForm open={showBankForm} onOpenChange={setShowBankForm} />

              {/* ── Animated Bank Logos Marquee ── */}
              <div className="mt-10">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
                  Trusted by employees of
                </p>

                <div className="space-y-3 overflow-hidden">
                  {/* Row 1 — scrolls left */}
                  <div className="bank-marquee">
                    {[...Array(2)].map((_, setIdx) => (
                      <div key={setIdx} className="flex items-center gap-5 pr-5">
                        {[
                          { name: "SBI", color: "#22408E" },
                          { name: "ICICI", color: "#F37021" },
                          { name: "PNB", color: "#D32F2F" },
                          { name: "HDFC", color: "#004B8D" },
                          { name: "Axis", color: "#800020" },
                          { name: "BOB", color: "#F36F21" },
                        ].map((bank) => (
                          <div
                            key={bank.name + setIdx}
                            className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20"
                          >
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: bank.color }}
                            />
                            <span className="whitespace-nowrap text-xs font-bold text-white/70">
                              {bank.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Row 2 — scrolls right */}
                  <div className="bank-marquee-reverse">
                    {[...Array(2)].map((_, setIdx) => (
                      <div key={setIdx} className="flex items-center gap-5 pr-5">
                        {[
                          { name: "Canara", color: "#FFD700" },
                          { name: "Union", color: "#003DA5" },
                          { name: "Kotak", color: "#ED1C24" },
                          { name: "Yes Bank", color: "#0060A9" },
                          { name: "IndusInd", color: "#8B1A4A" },
                          { name: "IDBI", color: "#39A845" },
                        ].map((bank) => (
                          <div
                            key={bank.name + setIdx}
                            className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20"
                          >
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: bank.color }}
                            />
                            <span className="whitespace-nowrap text-xs font-bold text-white/70">
                              {bank.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="hero-surface relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-5 py-20 text-center">
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-primary-foreground md:text-5xl">
            Your next load is one tap away
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Tell us where it's going. We'll find the right truck at the right price.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/booking" search={{ from: "", to: "" }}>
              <Button variant="cta" size="xl">
                Book a truck
              </Button>
            </Link>
            <Link to="/ptl">
              <Button variant="soft" size="xl">
                Part load rates
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative h-16 border-t border-primary-foreground/15">
          <div className="road-track absolute left-0 top-1/2 h-1.5 w-full -translate-y-1/2 opacity-50" />
          <Truck className="road-truck h-9 w-9 text-accent" style={{ top: "14px" }} />
        </div>
      </section>

      <WhatsAppFloatingButton fromCity={pickupCity} toCity={dropCity} />
      <Footer />
    </div>
  );
}
