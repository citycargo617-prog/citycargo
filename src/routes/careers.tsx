import { createFileRoute } from "@tanstack/react-router";
import {
  Heart,
  Rocket,
  Users,
  Lightbulb,
  BookOpen,
  Zap,
  Stethoscope,
  GraduationCap,
  Camera,
  PartyPopper,
  MapPin,
  ArrowRight,
  Mail,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — Join the City Cargo Team" },
      {
        name: "description",
        content:
          "Join India's fastest-growing logistics platform. Explore open roles in engineering, product, operations, and more.",
      },
    ],
  }),
  component: CareersPage,
});

const values = [
  {
    icon: Rocket,
    title: "Hyper Growth Culture",
    text: "We're scaling at breakneck speed. Every quarter brings new challenges and bigger milestones.",
  },
  {
    icon: Zap,
    title: "Mission Mode",
    text: "We operate with startup intensity. Big problems, fast solutions, real impact.",
  },
  {
    icon: Heart,
    title: "Customer First",
    text: "Every decision starts with the question: how does this help our shippers and truck owners?",
  },
  {
    icon: Lightbulb,
    title: "License to Fail",
    text: "We celebrate smart experiments even when they don't work. Failure is how we learn fast.",
  },
  {
    icon: BookOpen,
    title: "Freedom to Experiment",
    text: "No idea is too crazy to try. Autonomy and ownership define how we build.",
  },
  {
    icon: Users,
    title: "Innovate to Solve",
    text: "We don't follow playbooks — we write them. Technology-first approach to logistics.",
  },
];

const perks = [
  {
    icon: Stethoscope,
    title: "Health Insurance",
    text: "Comprehensive medical coverage for you and your family.",
  },
  {
    icon: PartyPopper,
    title: "Flexible Leaves",
    text: "Unlimited sick days, generous PTO, and work-from-home flexibility.",
  },
  {
    icon: GraduationCap,
    title: "Learning Budget",
    text: "₹50,000/year for courses, conferences, books, and certifications.",
  },
  {
    icon: Camera,
    title: "Media & Wellness",
    text: "In-office gym, meditation room, and team outings every quarter.",
  },
];

const openings = [
  {
    title: "Senior Full-Stack Engineer",
    dept: "Engineering",
    location: "Gurugram",
    type: "Full-time",
    desc: "Build and scale our truck booking platform using React, Node.js, and PostgreSQL. 4+ years experience required.",
  },
  {
    title: "Product Manager — Fleet",
    dept: "Product",
    location: "Gurugram",
    type: "Full-time",
    desc: "Own the fleet management product roadmap. Work closely with truck owners to build GPS tracking and analytics features.",
  },
  {
    title: "Data Scientist",
    dept: "Data",
    location: "Gurugram / Remote",
    type: "Full-time",
    desc: "Build ML models for dynamic pricing, route optimization, and demand forecasting. Strong Python and statistics skills needed.",
  },
  {
    title: "Operations Manager — South India",
    dept: "Operations",
    location: "Bengaluru",
    type: "Full-time",
    desc: "Manage ground operations, driver relationships, and service quality across Karnataka, Tamil Nadu, and Kerala.",
  },
  {
    title: "UI/UX Designer",
    dept: "Design",
    location: "Gurugram",
    type: "Full-time",
    desc: "Design beautiful, intuitive interfaces for our web and mobile apps. Figma expertise and mobile design experience required.",
  },
  {
    title: "Business Development Executive",
    dept: "Sales",
    location: "Multiple Cities",
    type: "Full-time",
    desc: "Acquire and manage key shipper accounts. Travel to client locations and build long-term partnerships.",
  },
  {
    title: "Content Writer — SEO",
    dept: "Marketing",
    location: "Remote",
    type: "Contract",
    desc: "Create SEO-optimized content for city landing pages, blog posts, and marketing collateral.",
  },
];

function CareersPage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />

      {/* Hero */}
      <section className="hero-surface relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-5 py-20 text-center lg:py-28">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-foreground">
            We're hiring
          </span>
          <h1 className="mt-6 font-display text-5xl font-extrabold leading-tight text-primary-foreground md:text-6xl">
            Build the future of
            <span className="block text-accent">Indian logistics</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-primary-foreground/70">
            City Cargo is reimagining how goods move across India. Join our team of 200+ builders,
            dreamers, and problem-solvers creating technology that powers commerce.
          </p>
          <Button
            variant="cta"
            size="xl"
            className="mt-8"
            onClick={() =>
              document.getElementById("openings")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            View Open Positions <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <h2 className="text-center font-display text-4xl font-extrabold tracking-tight text-foreground">
          Our values
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          These aren't just wall posters — they drive every decision we make.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="card-elevated rounded-2xl p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <v.icon className="h-6 w-6 text-primary" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Perks */}
      <section className="bg-secondary/60 py-20">
        <div className="mx-auto max-w-7xl px-5">
          <h2 className="text-center font-display text-4xl font-extrabold tracking-tight text-foreground">
            Perks & benefits
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl bg-card p-6 text-center shadow-[var(--shadow-card)]"
              >
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
                  <p.icon className="h-7 w-7 text-accent-foreground" />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings" className="mx-auto max-w-7xl px-5 py-20">
        <h2 className="text-center font-display text-4xl font-extrabold tracking-tight text-foreground">
          Open positions
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          Don't see your role? Send your resume to{" "}
          <a
            href="mailto:careers@citycargo.in"
            className="font-semibold text-primary hover:underline"
          >
            careers@citycargo.in
          </a>
        </p>

        <div className="mt-10 space-y-4">
          {openings.map((job) => (
            <div
              key={job.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-[var(--shadow-card)]"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">{job.title}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                    <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
                      {job.dept}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {job.location}
                    </span>
                    <span className="text-muted-foreground">{job.type}</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{job.desc}</p>
                </div>
                <a href={`mailto:careers@citycargo.in?subject=Application: ${job.title}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
                  >
                    Apply <Mail className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="hero-surface py-16">
        <div className="mx-auto max-w-7xl px-5 text-center">
          <h2 className="font-display text-3xl font-extrabold text-primary-foreground">
            Ready to join us?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-primary-foreground/70">
            Send your resume and a short note about why you want to join City Cargo.
          </p>
          <a href="mailto:careers@citycargo.in">
            <Button variant="cta" size="xl" className="mt-6">
              <Mail className="mr-2 h-4 w-4" /> careers@citycargo.in
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
