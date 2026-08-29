import { useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { MapPin, Truck, Star, ArrowRight, CheckCircle2, Clock, Shield } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { CitySearchInput } from "@/components/site/CitySearchInput";
import { getCityBySlug, type City } from "@/lib/data/cities";
import { getRoutesFromCity } from "@/lib/data/routes";
import { truckTypes } from "@/lib/data/trucks";

export const Route = createFileRoute("/ts/$city")({
  head: ({ params }) => {
    const cityName = params.city.charAt(0).toUpperCase() + params.city.slice(1);
    return {
      meta: [
        { title: `${cityName} Transport Service — City Cargo Truck Booking` },
        {
          name: "description",
          content: `Book trucks in ${cityName}. Full truck load and part load transport services with GPS tracking and transparent pricing.`,
        },
      ],
    };
  },
  component: CityTransportPage,
});

const cityTestimonials = [
  {
    name: "Local Business Owner",
    text: "City Cargo has transformed how we handle logistics. Reliable trucks at fair prices.",
    rating: 5,
  },
  {
    name: "Factory Manager",
    text: "We've been using City Cargo for 2 years. On-time delivery rate is exceptional.",
    rating: 5,
  },
  {
    name: "Trading Company",
    text: "The GPS tracking gives us complete peace of mind. Our clients love the transparency.",
    rating: 5,
  },
];

function CityTransportPage() {
  const { city: citySlug } = useParams({ from: "/ts/$city" });
  const city = getCityBySlug(citySlug);
  const cityName = city?.name || citySlug.charAt(0).toUpperCase() + citySlug.slice(1);
  const routes = getRoutesFromCity(cityName);

  const [pickupCity, setPickupCity] = useState(cityName);
  const [dropCity, setDropCity] = useState("");

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />

      {/* Hero */}
      <section className="hero-surface relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5">
              <MapPin className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary-foreground">
                {cityName} Transport
              </span>
            </div>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight text-primary-foreground md:text-5xl">
              Get the Best Transport
              <br />
              Services in <span className="text-accent">{cityName}</span>
            </h1>
            <p className="mt-4 max-w-lg text-primary-foreground/70">
              Book verified trucks for full load and part load transport from {cityName}. GPS
              tracking, transparent pricing, and 24x7 support on every shipment.
            </p>
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-primary-foreground/70">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" /> 500+ trucks in {cityName}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-400" /> 30-min truck confirmation
              </span>
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-400" /> Goods insurance available
              </span>
            </div>
          </div>

          {/* Booking card */}
          <div className="rounded-2xl bg-card p-6 shadow-[var(--shadow-elevated)]">
            <h2 className="font-display text-xl font-bold text-foreground">
              Book a truck from {cityName}
            </h2>
            <div className="mt-5 space-y-3">
              <CitySearchInput
                placeholder="Loading city"
                value={pickupCity}
                onChange={setPickupCity}
                icon="pickup"
              />
              <CitySearchInput
                placeholder="Unloading city"
                value={dropCity}
                onChange={setDropCity}
                icon="drop"
              />
              <Link to="/booking" search={{ from: pickupCity, to: dropCity }}>
                <Button variant="cta" size="xl" className="w-full mt-2">
                  Get Price Estimate <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular routes from this city */}
      {routes.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-16">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
            Popular routes from {cityName}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {routes.map((r) => {
              const otherCity = r.from === cityName ? r.to : r.from;
              return (
                <Link
                  key={`${r.from}-${r.to}`}
                  to="/booking"
                  search={{ from: cityName, to: otherCity }}
                  className="card-elevated flex items-center justify-between rounded-2xl p-5"
                >
                  <div>
                    <p className="font-display font-bold text-foreground">
                      {cityName} → {otherCity}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {r.distanceKm} km · ~{r.estimatedHours}h
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Available truck types */}
      <section className="bg-secondary/60 py-16">
        <div className="mx-auto max-w-7xl px-5">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
            Trucks available in {cityName}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {truckTypes.slice(0, 6).map((t) => (
              <div key={t.id} className="rounded-2xl bg-card p-5 shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.tonnageMin}–{t.tonnageMax}T · {t.lengthFt}ft
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{t.description}</p>
                <p className="mt-2 font-display font-bold text-primary">₹{t.pricePerKm}/km</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
          What {cityName} shippers say
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {cityTestimonials.map((t, i) => (
            <div key={i} className="card-elevated rounded-3xl p-7">
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground">"{t.text}"</p>
              <p className="mt-4 font-display font-bold text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground">{cityName}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="hero-surface py-16">
        <div className="mx-auto max-w-7xl px-5 text-center">
          <h2 className="font-display text-3xl font-extrabold text-primary-foreground">
            Start shipping from {cityName} today
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-primary-foreground/70">
            Get instant price estimates and book verified trucks in under 5 minutes.
          </p>
          <Link to="/booking" search={{ from: cityName, to: "" }}>
            <Button variant="cta" size="xl" className="mt-6">
              Book a Truck <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
