import { useState, useEffect, useCallback, useRef } from "react";
import {
  Star,
  MessageSquarePlus,
  Quote,
  MapPin,
  Send,
  Loader2,
  CheckCircle2,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { SupabaseReview } from "@/lib/supabase";
import { toast } from "sonner";

/* ─── Fallback seed data (used when Supabase is not configured) ─── */

const SEED_REVIEWS: SupabaseReview[] = [
  {
    id: "1",
    reviewer_name: "Rakesh Malhotra",
    city: "Ludhiana",
    rating: 5,
    title: "Lightning-fast dispatch",
    review_text:
      "City Cargo cut our dispatch time in half. Getting a truck now takes minutes, not a full day of phone calls. Highly recommended for steel transport.",
    is_approved: true,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: "2",
    reviewer_name: "Anita Deshmukh",
    city: "Pune",
    rating: 5,
    title: "Transparent and reliable",
    review_text:
      "Live tracking means my clients stop calling me for updates. The pricing has stayed exactly as quoted every single time.",
    is_approved: true,
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: "3",
    reviewer_name: "Imran Sheikh",
    city: "Jaipur",
    rating: 5,
    title: "Zero damage guarantee",
    review_text:
      "Verified drivers made all the difference. Six months, forty loads, not one damaged consignment. Best for furniture logistics.",
    is_approved: true,
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: "4",
    reviewer_name: "Priya Sharma",
    city: "Surat",
    rating: 5,
    title: "Part load is a game-changer",
    review_text:
      "The part-load service saves us 40% on smaller shipments without compromising on speed. Excellent for textile exports.",
    is_approved: true,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: "5",
    reviewer_name: "Vikram Patel",
    city: "Ahmedabad",
    rating: 4,
    title: "Great value for money",
    review_text:
      "Competitive pricing and on-time delivery. Used them for chemical drums and the service was top-notch. Will use again.",
    is_approved: true,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "6",
    reviewer_name: "Sunita Reddy",
    city: "Hyderabad",
    rating: 5,
    title: "Best logistics partner",
    review_text:
      "We switched from our old transporter 8 months ago. City Cargo's GPS tracking and 24x7 support is unmatched in the industry.",
    is_approved: true,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

/* ─── Star Rating Input ─── */

function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="group relative rounded-lg p-1 transition-all duration-200 hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          <Star
            className={`h-7 w-7 transition-all duration-200 ${
              star <= (hovered || value)
                ? "fill-accent text-accent drop-shadow-[0_0_6px_oklch(0.78_0.17_65/0.5)]"
                : "fill-transparent text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

/* ─── Star Rating Display ─── */

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 transition-all ${
            star <= rating
              ? "fill-accent text-accent"
              : "fill-transparent text-muted-foreground/20"
          }`}
        />
      ))}
    </div>
  );
}

/* ─── Time Ago Helper ─── */

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
  if (days < 365) return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""} ago`;
  return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? "s" : ""} ago`;
}

/* ─── Initials Avatar ─── */

function InitialsAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Generate a consistent hue from the name
  const hue = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 360;

  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold text-white shadow-md"
      style={{
        background: `linear-gradient(135deg, oklch(0.65 0.15 ${hue}), oklch(0.50 0.12 ${hue + 30}))`,
      }}
    >
      {initials}
    </div>
  );
}

/* ─── Review Card ─── */

function ReviewCard({ review, index }: { review: SupabaseReview; index: number }) {
  return (
    <div
      className="review-card group relative flex min-w-[280px] max-w-[340px] shrink-0 flex-col rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-primary/30 hover:shadow-[var(--shadow-card)] hover:-translate-y-1 sm:min-w-[320px] sm:p-6"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Quote accent */}
      <Quote className="absolute right-4 top-4 h-8 w-8 text-primary/[0.06] transition-colors group-hover:text-primary/[0.12]" />

      {/* Header: Avatar + Info */}
      <div className="flex items-center gap-3">
        <InitialsAvatar name={review.reviewer_name} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-bold text-foreground">
            {review.reviewer_name}
          </p>
          {review.city && (
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {review.city}
            </p>
          )}
        </div>
      </div>

      {/* Rating + Time */}
      <div className="mt-3 flex items-center justify-between">
        <StarRating rating={review.rating} />
        <span className="text-[11px] text-muted-foreground/70">
          {timeAgo(review.created_at)}
        </span>
      </div>

      {/* Title */}
      {review.title && (
        <h4 className="mt-3 font-display text-sm font-bold leading-snug text-foreground">
          {review.title}
        </h4>
      )}

      {/* Review text */}
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        "{review.review_text}"
      </p>
    </div>
  );
}

/* ─── Summary Stats Bar ─── */

function ReviewSummary({ reviews }: { reviews: SupabaseReview[] }) {
  const count = reviews.length;
  const avg = count > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: count > 0 ? (reviews.filter((r) => r.rating === star).length / count) * 100 : 0,
  }));

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-md sm:flex-row sm:gap-10 sm:p-8">
      {/* Big average */}
      <div className="text-center sm:text-left">
        <p className="font-display text-5xl font-extrabold tracking-tight text-foreground">
          {avg.toFixed(1)}
        </p>
        <div className="mt-1.5 flex justify-center sm:justify-start">
          <StarRating rating={Math.round(avg)} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {count} review{count !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Distribution bars */}
      <div className="flex flex-1 flex-col gap-1.5 sm:max-w-xs">
        {dist.map((d) => (
          <div key={d.star} className="flex items-center gap-2.5">
            <span className="w-4 text-right text-xs font-semibold text-muted-foreground">
              {d.star}
            </span>
            <Star className="h-3 w-3 fill-accent text-accent" />
            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-accent transition-all duration-700"
                style={{ width: `${d.pct}%` }}
              />
            </div>
            <span className="w-6 text-right text-[11px] text-muted-foreground">
              {d.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Review Section ─── */

export function ReviewSection() {
  const [reviews, setReviews] = useState<SupabaseReview[]>(SEED_REVIEWS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  // Carousel state
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  }, []);

  function scroll(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 360;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }

  // Fetch reviews
  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured) return;
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(20);
      if (!error && data && data.length > 0) {
        setReviews(data as SupabaseReview[]);
      }
    }
    load();
  }, []);

  // Reset form on dialog close
  useEffect(() => {
    if (!dialogOpen) {
      // Small delay so the closing animation finishes before resetting
      const t = setTimeout(() => {
        setName("");
        setCity("");
        setRating(0);
        setTitle("");
        setText("");
        setSubmitted(false);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [dialogOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!text.trim()) {
      toast.error("Please write your review");
      return;
    }

    setSubmitting(true);

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("reviews").insert({
          reviewer_name: name.trim(),
          city: city.trim() || null,
          rating,
          title: title.trim() || null,
          review_text: text.trim(),
        });
        if (error) throw error;
      }

      // Add to local state immediately
      const newReview: SupabaseReview = {
        id: crypto.randomUUID(),
        reviewer_name: name.trim(),
        city: city.trim() || undefined,
        rating,
        title: title.trim() || undefined,
        review_text: text.trim(),
        is_approved: true,
        created_at: new Date().toISOString(),
      };
      setReviews((prev) => [newReview, ...prev]);
      setSubmitted(true);
      toast.success("Thank you! Your review has been submitted.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="relative overflow-hidden bg-secondary/40 py-14 sm:py-20">
      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-64 w-64 rounded-full bg-primary/[0.04] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-accent/[0.06] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-5">
        {/* ── Section Header ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
              <Star className="h-3 w-3 fill-accent" />
              Customer Reviews
            </span>
            <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              What our customers say
            </h2>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground sm:text-base">
              Real experiences from businesses across India who trust City Cargo for their logistics.
            </p>
          </div>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setDialogOpen(true)}
            className="group gap-2 self-start rounded-xl border-primary/20 font-display font-bold text-primary shadow-sm transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-md sm:self-auto"
          >
            <MessageSquarePlus className="h-4 w-4 transition-transform group-hover:scale-110" />
            Write a Review
          </Button>
        </div>

        {/* ── Summary Stats ── */}
        <div className="mt-8">
          <ReviewSummary reviews={reviews} />
        </div>

        {/* ── Review Carousel ── */}
        <div className="relative mt-8">
          {/* Scroll buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute -left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 shadow-lg backdrop-blur-md transition-all hover:bg-card hover:shadow-xl sm:-left-4"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute -right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 shadow-lg backdrop-blur-md transition-all hover:bg-card hover:shadow-xl sm:-right-4"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
          )}

          {/* Cards row */}
          <div
            ref={scrollRef}
            onScroll={checkScrollState}
            className="review-scroll flex gap-4 overflow-x-auto pb-4 sm:gap-5"
          >
            {reviews.map((review, i) => (
              <ReviewCard key={review.id} review={review} index={i} />
            ))}
          </div>

          {/* Fade edges */}
          {canScrollLeft && (
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-secondary/40 to-transparent" />
          )}
          {canScrollRight && (
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-secondary/40 to-transparent" />
          )}
        </div>
      </div>

      {/* ── Write Review Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl border-border/50 bg-card/95 p-0 backdrop-blur-xl sm:max-w-lg">
          {submitted ? (
            /* ── Success State ── */
            <div className="flex flex-col items-center gap-4 p-8 text-center sm:p-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground">
                Thank you for your review!
              </h3>
              <p className="text-sm text-muted-foreground">
                Your feedback helps other businesses make informed decisions.
              </p>
              <Button
                variant="outline"
                className="mt-2 rounded-xl"
                onClick={() => setDialogOpen(false)}
              >
                Close
              </Button>
            </div>
          ) : (
            /* ── Form ── */
            <>
              <DialogHeader className="border-b border-border/50 px-6 pb-4 pt-6">
                <DialogTitle className="font-display text-lg font-bold">
                  Share your experience
                </DialogTitle>
                <DialogDescription>
                  Tell us how City Cargo helped your business. Your review helps others.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-5 px-6 pb-6 pt-5">
                {/* Star Rating */}
                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <Star className="h-3.5 w-3.5 text-accent" />
                    Your Rating
                    <span className="text-destructive">*</span>
                  </label>
                  <StarRatingInput value={rating} onChange={setRating} />
                  {rating > 0 && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {
                        ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][
                          rating
                        ]
                      }
                    </p>
                  )}
                </div>

                {/* Name + City */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="review-name"
                      className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-foreground"
                    >
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      Your Name
                      <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="review-name"
                      type="text"
                      placeholder="e.g. Rajesh Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={60}
                      className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="review-city"
                      className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-foreground"
                    >
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      City
                    </label>
                    <input
                      id="review-city"
                      type="text"
                      placeholder="e.g. Mumbai"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      maxLength={40}
                      className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                {/* Review Title */}
                <div>
                  <label
                    htmlFor="review-title"
                    className="mb-1.5 text-sm font-semibold text-foreground"
                  >
                    Review Title
                  </label>
                  <input
                    id="review-title"
                    type="text"
                    placeholder="Summarize your experience in a line"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={80}
                    className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                {/* Review Text */}
                <div>
                  <label
                    htmlFor="review-text"
                    className="mb-1.5 text-sm font-semibold text-foreground"
                  >
                    Your Review <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="review-text"
                    rows={4}
                    placeholder="How was your experience with City Cargo? Tell us about the service, pricing, and delivery..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={500}
                    className="w-full resize-none rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <p className="mt-1 text-right text-[11px] text-muted-foreground/60">
                    {text.length}/500
                  </p>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full gap-2 rounded-xl bg-primary font-display font-bold text-primary-foreground shadow-md transition-all hover:shadow-lg"
                  size="lg"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Review
                    </>
                  )}
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
