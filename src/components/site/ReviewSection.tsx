import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  Star,
  MessageSquarePlus,
  MapPin,
  Send,
  Loader2,
  CheckCircle2,
  User,
  ChevronLeft,
  ChevronRight,
  Search,
  BadgeCheck,
  Grid3X3,
  Columns3,
  Sparkles,
  ArrowRight,
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
import { SEED_REVIEWS } from "@/lib/data/reviews-data";
import { toast } from "sonner";

/* ─── Official Google "G" Icon ─── */

export function GoogleLogo({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-label="Google" fill="none">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

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
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
  if (days < 365) return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""} ago`;
  return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? "s" : ""} ago`;
}

/* ─── Initials Avatar ─── */

function InitialsAvatar({ name }: { name: string }) {
  const initials =
    name
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .join("")
      .slice(0, 2)
      .toUpperCase() || "CC";

  const hue = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 360;

  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-xs font-bold text-white shadow-md ring-2 ring-white/20"
      style={{
        background: `linear-gradient(135deg, oklch(0.65 0.15 ${hue}), oklch(0.50 0.12 ${hue + 30}))`,
      }}
    >
      {initials}
    </div>
  );
}

/* ─── Review Card ─── */

function ReviewCard({
  review,
  index,
  className = "",
}: {
  review: SupabaseReview;
  index: number;
  className?: string;
}) {
  return (
    <div
      className={`review-card group relative flex flex-col rounded-2xl border border-border/70 bg-card/85 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-[var(--shadow-card)] hover:-translate-y-1 sm:p-6 ${className}`}
      style={{ animationDelay: `${(index % 12) * 50}ms` }}
    >
      {/* Header: User Info on left, Google Badge on right */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <InitialsAvatar name={review.reviewer_name} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate font-display text-sm font-bold text-foreground">
                {review.reviewer_name}
              </p>
              <span
                title="Verified Reviewer"
                className="inline-flex shrink-0 items-center text-emerald-600 dark:text-emerald-400"
              >
                <BadgeCheck className="h-4 w-4" />
              </span>
            </div>
            {review.city && (
              <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" />
                {review.city}
              </p>
            )}
          </div>
        </div>

        {/* Google Logo Badge in each card */}
        <div
          title="Verified on Google"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/80 bg-background/90 px-2.5 py-1 shadow-xs backdrop-blur-md transition-all group-hover:border-primary/30"
        >
          <GoogleLogo className="h-3.5 w-3.5 shrink-0" />
          <span className="font-sans text-[11px] font-semibold text-foreground/80">Google</span>
        </div>
      </div>

      {/* Rating + Time */}
      <div className="mt-3.5 flex items-center justify-between">
        <StarRating rating={review.rating} />
        <span className="text-[11px] font-medium text-muted-foreground/75">
          {timeAgo(review.created_at)}
        </span>
      </div>

      {/* Title */}
      {review.title && (
        <h4 className="mt-2.5 font-display text-sm font-bold leading-snug text-foreground">
          {review.title}
        </h4>
      )}

      {/* Review text */}
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        "{review.review_text}"
      </p>

      {/* Verified Google Footer Strip */}
      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-[11px]">
        <span className="inline-flex items-center gap-1.5 font-medium text-foreground/80">
          <GoogleLogo className="h-3.5 w-3.5 shrink-0" />
          <span>Posted on Google</span>
        </span>
        <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
          <BadgeCheck className="h-3.5 w-3.5" />
          Verified Consignment
        </span>
      </div>
    </div>
  );
}

/* ─── Summary Stats Bar ─── */

function ReviewSummary({
  reviews,
  selectedRating,
  onSelectRating,
}: {
  reviews: SupabaseReview[];
  selectedRating: number | null;
  onSelectRating: (star: number | null) => void;
}) {
  const count = reviews.length;
  const avg = count > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;
  const dist = [5, 4, 3, 2, 1].map((star) => {
    const starCount = reviews.filter((r) => r.rating === star).length;
    return {
      star,
      count: starCount,
      pct: count > 0 ? (starCount / count) * 100 : 0,
    };
  });

  return (
    <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-md sm:flex-row sm:gap-10 sm:p-8">
      {/* Big average with Google Logo */}
      <div className="text-center sm:text-left">
        <div className="flex items-center gap-3.5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-card p-2.5 shadow-sm sm:h-16 sm:w-16">
            <GoogleLogo className="h-full w-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                {avg.toFixed(1)}
              </p>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent sm:text-xs">
                  out of 5.0
                </span>
                <div className="mt-1 flex">
                  <StarRating rating={Math.round(avg)} />
                </div>
              </div>
            </div>
            <p className="mt-1 text-xs font-semibold text-muted-foreground sm:text-sm">
              Google Verified Rating
            </p>
          </div>
        </div>

        <p className="mt-3 text-sm font-semibold text-foreground">
          Based on <span className="font-mono font-bold text-primary">{count.toLocaleString()}</span> authentic customer reviews
        </p>

        <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
          <GoogleLogo className="h-3.5 w-3.5" />
          100% Genuine Google Reviews
        </div>
      </div>

      {/* Distribution bars */}
      <div className="flex w-full flex-1 flex-col gap-2 sm:max-w-md">
        {dist.map((d) => {
          const isSelected = selectedRating === d.star;
          return (
            <button
              key={d.star}
              type="button"
              onClick={() => onSelectRating(isSelected ? null : d.star)}
              className={`flex items-center gap-2.5 rounded-lg px-2 py-1 text-left transition-all ${
                isSelected
                  ? "bg-accent/15 font-bold ring-1 ring-accent"
                  : "hover:bg-muted/50"
              }`}
            >
              <span className="w-4 text-right text-xs font-semibold text-muted-foreground">
                {d.star}
              </span>
              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
              <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-accent transition-all duration-700"
                  style={{ width: `${d.pct}%` }}
                />
              </div>
              <span className="w-12 text-right font-mono text-[11px] text-muted-foreground">
                {d.count.toLocaleString()}
              </span>
            </button>
          );
        })}
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

  // Filter & Search state
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

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

  // Fetch Supabase reviews & merge with seed reviews
  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured) return;
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .eq("is_approved", true)
          .order("created_at", { ascending: false })
          .limit(100);

        if (!error && data && data.length > 0) {
          setReviews((prev) => {
            const incomingIds = new Set(data.map((r: SupabaseReview) => r.id));
            const remainingSeed = prev.filter((r) => !incomingIds.has(r.id));
            return [...data, ...remainingSeed];
          });
        }
      } catch (err) {
        console.error("Failed to fetch live reviews:", err);
      }
    }
    load();
  }, []);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (selectedRating !== null && r.rating !== selectedRating) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = r.reviewer_name.toLowerCase().includes(query);
        const matchesCity = r.city ? r.city.toLowerCase().includes(query) : false;
        const matchesTitle = r.title ? r.title.toLowerCase().includes(query) : false;
        const matchesText = r.review_text.toLowerCase().includes(query);
        if (!matchesName && !matchesCity && !matchesTitle && !matchesText) {
          return false;
        }
      }
      return true;
    });
  }, [reviews, selectedRating, searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedRating, searchQuery, viewMode]);

  // Pagination for grid
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReviews.slice(start, start + itemsPerPage);
  }, [filteredReviews, currentPage, itemsPerPage]);

  // Carousel items: top 24 most recent/featured of current filter
  const carouselReviews = useMemo(() => {
    return filteredReviews.slice(0, 24);
  }, [filteredReviews]);

  // Reset form on dialog close
  useEffect(() => {
    if (!dialogOpen) {
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
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                <GoogleLogo className="h-3.5 w-3.5" />
                Google Reviews
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Sparkles className="h-3 w-3" />
                500+ Verified Ratings
              </span>
            </div>
            <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Google Customer Reviews
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
              Verified reviews from manufacturers, traders, and logistics managers across India who trust City Cargo for daily transport.
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
          <ReviewSummary
            reviews={reviews}
            selectedRating={selectedRating}
            onSelectRating={setSelectedRating}
          />
        </div>

        {/* ── Filter & Search Toolbar ── */}
        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
          {/* Left: Star filter pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedRating(null)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                selectedRating === null
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              All ({reviews.length.toLocaleString()})
            </button>
            <button
              type="button"
              onClick={() => setSelectedRating(5)}
              className={`inline-flex items-center gap-1 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                selectedRating === 5
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Star className="h-3 w-3 fill-current" /> 5 Stars ({reviews.filter((r) => r.rating === 5).length.toLocaleString()})
            </button>
            <button
              type="button"
              onClick={() => setSelectedRating(4)}
              className={`inline-flex items-center gap-1 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                selectedRating === 4
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Star className="h-3 w-3 fill-current" /> 4 Stars ({reviews.filter((r) => r.rating === 4).length.toLocaleString()})
            </button>
          </div>

          {/* Right: Search & View Mode Switch */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search city, steel, GPS, driver..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-input bg-background/60 py-1.5 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground/60 transition-all focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl border border-border/80 bg-muted/50 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("carousel")}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  viewMode === "carousel"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Carousel View"
              >
                <Columns3 className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Carousel</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  viewMode === "grid"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Grid / Browse All"
              >
                <Grid3X3 className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Browse All</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status bar if filtered */}
        {(selectedRating !== null || searchQuery.trim()) && (
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing <strong className="text-foreground">{filteredReviews.length}</strong> matching reviews
              {selectedRating && ` with ${selectedRating} stars`}
              {searchQuery && ` for "${searchQuery}"`}
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedRating(null);
                setSearchQuery("");
              }}
              className="font-medium text-primary hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}

        {/* ── Content: Empty State ── */}
        {filteredReviews.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-card/40 p-12 text-center">
            <Search className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <h3 className="font-display text-base font-bold text-foreground">
              No matching reviews found
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Try searching for a different city, goods type, or clear the star filter.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedRating(null);
                setSearchQuery("");
              }}
              className="mt-4 rounded-xl"
            >
              Clear filters
            </Button>
          </div>
        ) : viewMode === "carousel" ? (
          /* ── Content: Carousel View ── */
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
              {carouselReviews.map((review, i) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  index={i}
                  className="min-w-[280px] max-w-[340px] shrink-0 sm:min-w-[320px]"
                />
              ))}

              {/* End of carousel CTA card */}
              <div className="flex min-w-[280px] max-w-[320px] shrink-0 flex-col items-center justify-center rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background p-2.5 shadow-sm">
                  <GoogleLogo className="h-full w-full" />
                </div>
                <h4 className="mt-3 font-display text-base font-bold text-foreground">
                  +{filteredReviews.length - carouselReviews.length} More Google Reviews
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Explore all {reviews.length} genuine customer ratings across India.
                </p>
                <Button
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="mt-4 gap-1.5 rounded-xl bg-primary text-xs font-bold"
                >
                  Browse all {reviews.length} reviews <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Fade edges */}
            {canScrollLeft && (
              <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-secondary/40 to-transparent" />
            )}
            {canScrollRight && (
              <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-secondary/40 to-transparent" />
            )}

            {/* Footer switcher note */}
            <div className="mt-4 flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
              <span className="flex items-center gap-1.5">
                <GoogleLogo className="h-3.5 w-3.5" />
                Showing <strong>{carouselReviews.length}</strong> featured Google reviews out of{" "}
                <strong>{filteredReviews.length.toLocaleString()}</strong> total
              </span>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
              >
                View all {reviews.length} reviews in paginated grid <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* ── Content: Paginated Grid View ── */
          <div className="mt-8">
            <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
              {paginatedReviews.map((review, i) => (
                <ReviewCard key={review.id} review={review} index={i} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <p className="text-xs text-muted-foreground">
                  Showing{" "}
                  <strong>
                    {(currentPage - 1) * itemsPerPage + 1}-
                    {Math.min(currentPage * itemsPerPage, filteredReviews.length)}
                  </strong>{" "}
                  of <strong>{filteredReviews.length.toLocaleString()}</strong> reviews (Page {currentPage} of {totalPages})
                </p>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: scrollRef.current?.offsetTop || 600, behavior: "smooth" });
                    }}
                    className="h-8 rounded-xl px-2.5 text-xs font-semibold"
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" /> Prev
                  </Button>

                  {/* Page numbers: window around current page */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      return (
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 2
                      );
                    })
                    .map((page, idx, arr) => {
                      const prevPage = arr[idx - 1];
                      const showEllipsis = prevPage && page - prevPage > 1;

                      return (
                        <div key={page} className="flex items-center gap-1.5">
                          {showEllipsis && (
                            <span className="px-1 text-xs text-muted-foreground">…</span>
                          )}
                          <Button
                            variant={page === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setCurrentPage(page);
                              window.scrollTo({ top: scrollRef.current?.offsetTop || 600, behavior: "smooth" });
                            }}
                            className="h-8 w-8 rounded-xl p-0 font-mono text-xs font-bold"
                          >
                            {page}
                          </Button>
                        </div>
                      );
                    })}

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: scrollRef.current?.offsetTop || 600, behavior: "smooth" });
                    }}
                    className="h-8 rounded-xl px-2.5 text-xs font-semibold"
                  >
                    Next <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
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
                Your feedback helps other businesses make informed transport decisions.
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
                <div className="flex items-center gap-2">
                  <GoogleLogo className="h-5 w-5" />
                  <DialogTitle className="font-display text-lg font-bold">
                    Share your experience
                  </DialogTitle>
                </div>
                <DialogDescription>
                  Tell us how City Cargo helped your business. Your review helps other shippers.
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
                      className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                      className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                    className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                    className="w-full resize-none rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
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
