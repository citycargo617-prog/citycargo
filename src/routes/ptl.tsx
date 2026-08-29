import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Package,
  MapPin,
  Scale,
  ArrowRight,
  CheckCircle2,
  Clock,
  Shield,
  Users,
  Truck,
  Star,
  ChevronDown,
  ChevronUp,
  IndianRupee,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/ptl")({
  head: () => ({
    meta: [
      { title: "Part Load Transport — City Cargo PTL Marketplace" },
      {
        name: "description",
        content:
          "Compare, choose & book part truck load shipments starting from ₹2/kg. 100+ verified transporters, 21,000+ PIN codes.",
      },
    ],
  }),
  component: PtlPage,
});

const whyPtl = [
  {
    icon: IndianRupee,
    title: "Instant Rates",
    text: "Get competitive rates from 100+ verified transporters in seconds.",
  },
  {
    icon: Users,
    title: "100+ Transporters",
    text: "Access India's largest network of vetted PTL carriers.",
  },
  {
    icon: MapPin,
    title: "21,000+ PIN Codes",
    text: "Deliver to virtually any location across India.",
  },
  {
    icon: Shield,
    title: "Dedicated Manager",
    text: "Every business account gets a dedicated account manager.",
  },
  {
    icon: Truck,
    title: "Live Tracking",
    text: "Track your part load shipment in real-time via GPS.",
  },
  {
    icon: Clock,
    title: "On-time Delivery",
    text: "95%+ on-time delivery rate across all PTL shipments.",
  },
];

const howItWorks = [
  {
    step: "1",
    title: "Enter Details",
    text: "Provide pickup & drop pincode, and chargeable weight.",
  },
  {
    step: "2",
    title: "Compare Rates",
    text: "Get instant quotes from multiple verified transporters.",
  },
  { step: "3", title: "Book & Pay", text: "Choose the best rate and confirm your booking online." },
  {
    step: "4",
    title: "Track & Receive",
    text: "Track your shipment live and get delivery confirmation.",
  },
];

const ptlReviews = [
  {
    name: "Vikas Agarwal",
    role: "E-commerce seller, Delhi",
    text: "PTL rates are 35% cheaper than hiring a full truck. Perfect for my daily dispatches to Lucknow and Jaipur.",
  },
  {
    name: "Meera Patel",
    role: "Handicrafts exporter, Ahmedabad",
    text: "I ship 200-300 kg loads twice a week. The PTL marketplace gives me instant rates and door-to-door service.",
  },
  {
    name: "Suresh Reddy",
    role: "Pharma distributor, Hyderabad",
    text: "Temperature-controlled PTL options are hard to find. City Cargo connected me with the right transporter in minutes.",
  },
];

const ptlFaqs = [
  {
    q: "What is part truck load (PTL)?",
    a: "PTL lets you share truck space with other shippers, so you only pay for the space your goods occupy. Ideal for shipments between 50 kg and 5,000 kg.",
  },
  {
    q: "How is pricing calculated?",
    a: "PTL rates are per kg based, starting from ₹2/kg. The rate depends on the route, weight, and material type. Get an instant estimate using our calculator.",
  },
  {
    q: "What's the minimum weight?",
    a: "We accept part loads starting from as low as 50 kg. There's no maximum — if your load exceeds 5,000 kg, we recommend a full truck for better rates.",
  },
  {
    q: "How long does PTL delivery take?",
    a: "Delivery times vary by route. Metro-to-metro routes typically take 2-4 days. Tier-2/3 cities may take 4-7 days.",
  },
  {
    q: "Is insurance available for PTL?",
    a: "Yes! You can opt for goods-in-transit insurance during booking. Coverage up to ₹50 lakhs available.",
  },
];

function PtlPage() {
  const [loadingPin, setLoadingPin] = useState("");
  const [unloadingPin, setUnloadingPin] = useState("");
  const [weight, setWeight] = useState("");
  const [estimate, setEstimate] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function calculateRate() {
    const w = parseFloat(weight);
    if (!w || !loadingPin || !unloadingPin) return;
    // Mock calculation: base ₹200 + ₹3-6 per kg depending on "distance"
    const ratePerKg = 2 + Math.random() * 4;
    const total = Math.round(200 + w * ratePerKg);
    setEstimate(total);
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[oklch(0.97_0.02_85)]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5">
              <Package className="h-4 w-4 text-accent-foreground" />
              <span className="text-xs font-bold uppercase tracking-widest text-accent-foreground">
                Part Load Market
              </span>
            </div>
            <h1 className="mt-6 font-display text-5xl font-extrabold leading-tight tracking-tight text-foreground">
              Part Load Market
            </h1>
            <p className="mt-2 text-xl font-bold text-accent-foreground">Starts from ₹2/kg</p>
            <p className="mt-4 max-w-lg text-muted-foreground">
              Compare rates from 100+ verified transporters and book your part load shipment at the
              best price. Door-to-door service across India.
            </p>
          </div>

          {/* Rate calculator card */}
          <div className="rounded-2xl bg-card p-6 shadow-[var(--shadow-elevated)]">
            <h2 className="font-display text-xl font-bold text-foreground">
              Compare, Choose & Book your part load
            </h2>
            <div className="mt-5 space-y-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-green-500">
                  <MapPin className="h-4 w-4 text-white" />
                </span>
                <Input
                  placeholder="Enter your loading pincode"
                  className="h-12 pl-13 rounded-xl"
                  value={loadingPin}
                  onChange={(e) => setLoadingPin(e.target.value)}
                  maxLength={6}
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-red-500">
                  <MapPin className="h-4 w-4 text-white" />
                </span>
                <Input
                  placeholder="Enter your unloading pincode"
                  className="h-12 pl-13 rounded-xl"
                  value={unloadingPin}
                  onChange={(e) => setUnloadingPin(e.target.value)}
                  maxLength={6}
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-primary">
                  <Scale className="h-4 w-4 text-primary-foreground" />
                </span>
                <Input
                  placeholder="Enter Chargeable Weight (in Kg)"
                  className="h-12 pl-13 rounded-xl"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  type="number"
                />
              </div>

              {estimate !== null && (
                <div className="rounded-xl bg-green-50 p-4 text-center">
                  <p className="text-sm text-muted-foreground">Estimated Price</p>
                  <p className="font-display text-3xl font-extrabold text-green-700">
                    ₹{estimate.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    *Actual rates may vary. Final quote provided after booking.
                  </p>
                </div>
              )}

              <Button
                variant="cta"
                size="xl"
                className="w-full !bg-accent !text-accent-foreground hover:!bg-accent/90"
                onClick={calculateRate}
              >
                Get Price Estimate <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why PTL */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <h2 className="text-center font-display text-4xl font-extrabold tracking-tight text-foreground">
          Why choose City Cargo PTL?
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyPtl.map((f) => (
            <div key={f.title} className="card-elevated rounded-2xl p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <f.icon className="h-6 w-6 text-primary" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-secondary/60 py-20">
        <div className="mx-auto max-w-7xl px-5">
          <h2 className="text-center font-display text-4xl font-extrabold tracking-tight text-foreground">
            How it works
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {howItWorks.map((s, i) => (
              <div key={s.step} className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary font-display text-2xl font-extrabold text-primary-foreground">
                  {s.step}
                </div>
                {i < howItWorks.length - 1 && (
                  <div className="absolute left-[calc(50%+40px)] top-8 hidden h-0.5 w-[calc(100%-80px)] bg-primary/20 md:block" />
                )}
                <h3 className="mt-4 font-display text-lg font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <h2 className="font-display text-4xl font-extrabold tracking-tight text-foreground">
          What our shippers say
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {ptlReviews.map((t) => (
            <div key={t.name} className="card-elevated rounded-3xl p-7">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
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

      {/* FAQ */}
      <section className="bg-secondary/60 py-20">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="text-center font-display text-4xl font-extrabold tracking-tight text-foreground">
            Part Load FAQs
          </h2>
          <div className="mt-10 space-y-3">
            {ptlFaqs.map((faq, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card">
                <button
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="pr-4 font-display text-base font-bold text-foreground">
                    {faq.q}
                  </span>
                  {openFaq === i ? (
                    <ChevronUp className="h-5 w-5 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="border-t border-border px-6 py-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-surface py-16">
        <div className="mx-auto max-w-7xl px-5 text-center">
          <h2 className="font-display text-3xl font-extrabold text-primary-foreground md:text-4xl">
            Ready to ship your part load?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-primary-foreground/70">
            Get instant rates from 100+ transporters. No signup needed.
          </p>
          <Button
            variant="cta"
            size="xl"
            className="mt-6"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Get Rates Now <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
