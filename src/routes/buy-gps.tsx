import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  MapPin,
  Navigation,
  Shield,
  Lock,
  Fuel,
  History,
  AlertTriangle,
  CheckCircle2,
  Truck,
  ArrowRight,
  Phone,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/buy-gps")({
  head: () => ({
    meta: [
      { title: "Buy GPS Tracker — City Cargo Fleet Management" },
      {
        name: "description",
        content:
          "Get real-time GPS tracking for your trucks. Anti-theft, geofencing, fuel analytics starting at ₹3,400.",
      },
    ],
  }),
  component: BuyGpsPage,
});

const gpsFeatures = [
  {
    icon: MapPin,
    title: "Real-Time Tracking",
    text: "Know your vehicle's exact location, speed, and direction at any moment.",
  },
  {
    icon: Shield,
    title: "Anti-Theft Protection",
    text: "Instant alerts on unauthorized movement. Parking lock feature to immobilize vehicles.",
  },
  {
    icon: Lock,
    title: "Geofencing",
    text: "Set virtual boundaries and get alerts when vehicles enter or exit designated zones.",
  },
  {
    icon: Fuel,
    title: "Fuel Analytics",
    text: "Monitor fuel consumption patterns and identify wastage or theft.",
  },
  {
    icon: History,
    title: "Route Playback",
    text: "Review complete route history, stops, and timing for any date range.",
  },
  {
    icon: AlertTriangle,
    title: "Smart Alerts",
    text: "Over-speeding, ignition on/off, SOS, extended stops — all notified instantly.",
  },
];

const howItWorks = [
  {
    step: "1",
    title: "Order Online",
    text: "Select number of devices and provide vehicle details.",
  },
  {
    step: "2",
    title: "Quick Install",
    text: "Our technician installs the GPS device in under 30 minutes.",
  },
  {
    step: "3",
    title: "Start Tracking",
    text: "Login to your dashboard and track all vehicles in real-time.",
  },
];

function BuyGpsPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [devices, setDevices] = useState("1");
  const [vehicleNumbers, setVehicleNumbers] = useState("");
  const [address, setAddress] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const unitPrice = 3400;
  const total = parseInt(devices) * unitPrice || unitPrice;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />

      {/* Hero */}
      <section className="hero-surface relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-foreground">
              <Navigation className="h-3.5 w-3.5" /> GPS Fleet Tracking
            </span>
            <h1 className="mt-6 font-display text-5xl font-extrabold leading-tight text-primary-foreground">
              Track Every Truck, <span className="text-accent">Every Minute</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-primary-foreground/70">
              Advanced GPS tracking with anti-theft, geofencing, fuel analytics, and route playback.
              Everything you need to manage your fleet from one dashboard.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-6">
              <div>
                <p className="text-sm text-primary-foreground/50 line-through">₹5,000</p>
                <p className="font-display text-4xl font-extrabold text-accent">₹3,400</p>
                <p className="text-sm text-primary-foreground/70">per device · one-time payment</p>
              </div>
              <div className="h-12 border-l border-primary-foreground/20" />
              <div className="space-y-1 text-sm text-primary-foreground/70">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" /> Free installation
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" /> 1 year warranty
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" /> Lifetime tracking
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <h2 className="text-center font-display text-4xl font-extrabold tracking-tight text-foreground">
          Powerful GPS features
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gpsFeatures.map((f) => (
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
          <div className="mt-12 grid gap-8 md:grid-cols-3">
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

      {/* Order form */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="mx-auto max-w-xl">
          <h2 className="text-center font-display text-3xl font-extrabold tracking-tight text-foreground">
            Order GPS Tracker
          </h2>
          <p className="mt-2 text-center text-muted-foreground">
            Fill in details and we'll get your GPS installed within 48 hours.
          </p>

          {submitted ? (
            <div className="mt-10 rounded-2xl border border-border bg-card p-10 text-center shadow-[var(--shadow-card)]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-foreground">Order Placed!</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Our team will contact you within 2 hours to schedule installation.
              </p>
              <p className="mt-4 font-display text-2xl font-extrabold text-primary">
                Total: ₹{total.toLocaleString()}
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gps-name">Your Name</Label>
                  <Input
                    id="gps-name"
                    placeholder="Full name"
                    className="h-12 rounded-xl"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gps-phone">Mobile Number</Label>
                  <Input
                    id="gps-phone"
                    placeholder="10-digit number"
                    className="h-12 rounded-xl"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gps-devices">Number of Devices</Label>
                  <select
                    id="gps-devices"
                    className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none focus:border-primary"
                    value={devices}
                    onChange={(e) => setDevices(e.target.value)}
                  >
                    {[1, 2, 3, 5, 10, 20, 50].map((n) => (
                      <option key={n} value={n}>
                        {n} device{n > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gps-vehicles">Vehicle Number(s)</Label>
                  <Input
                    id="gps-vehicles"
                    placeholder="MH-04-AB-1234"
                    className="h-12 rounded-xl"
                    value={vehicleNumbers}
                    onChange={(e) => setVehicleNumbers(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gps-address">Installation Address</Label>
                <Input
                  id="gps-address"
                  placeholder="Full address for GPS installation"
                  className="h-12 rounded-xl"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="rounded-xl bg-primary/5 p-4 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  {devices} device(s) × ₹{unitPrice.toLocaleString()}
                </span>
                <span className="font-display text-xl font-extrabold text-primary">
                  ₹{total.toLocaleString()}
                </span>
              </div>

              <Button type="submit" variant="cta" size="xl" className="w-full">
                Place Order <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Trust section */}
      <section className="bg-secondary/60 py-12">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid gap-6 sm:grid-cols-3 text-center">
            <div>
              <p className="font-display text-3xl font-extrabold text-primary">2L+</p>
              <p className="text-sm text-muted-foreground">GPS devices installed</p>
            </div>
            <div>
              <p className="font-display text-3xl font-extrabold text-primary">99.5%</p>
              <p className="text-sm text-muted-foreground">Uptime guarantee</p>
            </div>
            <div>
              <p className="font-display text-3xl font-extrabold text-primary">24x7</p>
              <p className="text-sm text-muted-foreground">Technical support</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
