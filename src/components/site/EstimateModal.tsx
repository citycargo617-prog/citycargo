import { useState, useMemo } from "react";
import { X, Truck, Phone, ArrowRight, Package } from "lucide-react";
import { useAdminData, calculateDynamicPrice, getStoredRoutePricing } from "@/lib/admin-store";
import type { TruckItem } from "@/lib/admin-store";
import { Link } from "@tanstack/react-router";

// ─── Types ──────────────────────────────────────────────
type TruckTab = "Open" | "Container" | "Trailer";

interface LoadOptions {
  widthFt: string;
  heightFt: string;
  addons: string[];
}

const ADDON_OPTIONS = [
  "Diesel Only",
  "Need to send my Person",
  "Extra Belt",
  "Helper Required",
  "Ramp Required",
  "Express Delivery",
];

const WIDTH_OPTIONS = ["7 ft", "7.5 ft", "8 ft", "8.5 ft", "9 ft", "9.5 ft", "10 ft"];
const HEIGHT_OPTIONS = ["7 ft", "7.5 ft", "8 ft", "8.5 ft", "9 ft", "9.5 ft", "10 ft"];

// Determines which visual tab a truck belongs to
function getTruckTab(truck: TruckItem): TruckTab {
  if (truck.category === "trailer") return "Trailer";
  const name = truck.name.toLowerCase();
  if (name.includes("container") || name.includes("closed")) return "Container";
  return "Open";
}

// ─── Truck SVG Illustrations ────────────────────────────
function TruckImage({ tab }: { tab: TruckTab }) {
  if (tab === "Trailer") {
    return (
      <svg viewBox="0 0 80 44" className="w-full h-full" fill="none">
        <rect x="2" y="14" width="50" height="22" rx="3" fill="#2d6a4f" />
        <rect x="52" y="8" width="22" height="28" rx="3" fill="#2d6a4f" />
        <rect x="52" y="8" width="22" height="13" rx="2" fill="rgba(0,0,0,0.22)" />
        <circle cx="14" cy="38" r="5" fill="#1a1a1a" /><circle cx="14" cy="38" r="2.5" fill="#555" />
        <circle cx="56" cy="38" r="5" fill="#1a1a1a" /><circle cx="56" cy="38" r="2.5" fill="#555" />
        <circle cx="68" cy="38" r="5" fill="#1a1a1a" /><circle cx="68" cy="38" r="2.5" fill="#555" />
        <rect x="72" y="18" width="6" height="14" rx="1" fill="#2d6a4f" />
      </svg>
    );
  }
  if (tab === "Container") {
    return (
      <svg viewBox="0 0 80 44" className="w-full h-full" fill="none">
        <rect x="2" y="10" width="55" height="26" rx="3" fill="#e54e1b" />
        <line x1="20" y1="10" x2="20" y2="36" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <line x1="38" y1="10" x2="38" y2="36" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <rect x="57" y="14" width="18" height="22" rx="3" fill="#c74012" />
        <rect x="57" y="14" width="18" height="10" rx="2" fill="rgba(0,0,0,0.28)" />
        <circle cx="14" cy="38" r="5" fill="#1a1a1a" /><circle cx="14" cy="38" r="2.5" fill="#555" />
        <circle cx="60" cy="38" r="5" fill="#1a1a1a" /><circle cx="60" cy="38" r="2.5" fill="#555" />
        <circle cx="72" cy="38" r="5" fill="#1a1a1a" /><circle cx="72" cy="38" r="2.5" fill="#555" />
      </svg>
    );
  }
  // Open body
  return (
    <svg viewBox="0 0 80 44" className="w-full h-full" fill="none">
      <rect x="2" y="20" width="52" height="14" rx="2" fill="#e54e1b" />
      <rect x="2" y="16" width="52" height="4" rx="1" fill="rgba(0,0,0,0.18)" />
      <rect x="57" y="14" width="18" height="20" rx="3" fill="#e54e1b" />
      <rect x="57" y="14" width="18" height="9" rx="2" fill="rgba(0,0,0,0.28)" />
      <circle cx="14" cy="38" r="5" fill="#1a1a1a" /><circle cx="14" cy="38" r="2.5" fill="#555" />
      <circle cx="60" cy="38" r="5" fill="#1a1a1a" /><circle cx="60" cy="38" r="2.5" fill="#555" />
      <circle cx="72" cy="38" r="5" fill="#1a1a1a" /><circle cx="72" cy="38" r="2.5" fill="#555" />
    </svg>
  );
}

// ─── Props ──────────────────────────────────────────────
interface EstimateModalProps {
  open: boolean;
  onClose: () => void;
  fromCity: string;
  toCity: string;
}

// ─── Main Component ─────────────────────────────────────
export function EstimateModal({ open, onClose, fromCity, toCity }: EstimateModalProps) {
  const { activeTrucks, findRouteDynamic, pricing } = useAdminData();

  const [activeTab, setActiveTab] = useState<TruckTab>("Open");
  const [selectedTruck, setSelectedTruck] = useState<TruckItem | null>(null);
  const [loadOptions, setLoadOptions] = useState<LoadOptions>({
    widthFt: "8 ft",
    heightFt: "8 ft",
    addons: [],
  });

  const route = useMemo(
    () => findRouteDynamic(fromCity, toCity),
    [fromCity, toCity, findRouteDynamic]
  );

  const tabTrucks = useMemo(() => {
    return activeTrucks.filter((t) => getTruckTab(t) === activeTab);
  }, [activeTrucks, activeTab]);

  function getPriceInfo(truck: TruckItem): { from: number; original: number; discountPct: number } {
    const routePricing = getStoredRoutePricing();
    const routeEntry = routePricing.find(
      (e) =>
        ((e.from.toLowerCase() === fromCity.toLowerCase() &&
          e.to.toLowerCase() === toCity.toLowerCase()) ||
          (e.from.toLowerCase() === toCity.toLowerCase() &&
            e.to.toLowerCase() === fromCity.toLowerCase())) &&
        e.truckTypeId === truck.id
    );
    if (routeEntry) {
      const discountPct = routeEntry.discountPercent || 5;
      const original = routeEntry.basePrice;
      const discounted = Math.round(original * (1 - discountPct / 100));
      return { from: discounted, original, discountPct };
    }
    const distanceKm = route?.distanceKm ?? 300;
    const result = calculateDynamicPrice(
      distanceKm,
      truck.pricePerKm,
      truck.baseCharge ?? pricing.baseBookingCharge
    );
    const original = result.total;
    const discountPct = 5;
    const discounted = Math.round(original * (1 - discountPct / 100));
    return { from: discounted, original, discountPct };
  }

  function toggleAddon(addon: string) {
    setLoadOptions((prev) => ({
      ...prev,
      addons: prev.addons.includes(addon)
        ? prev.addons.filter((a) => a !== addon)
        : [...prev.addons, addon],
    }));
  }

  const selectedPrice = selectedTruck ? getPriceInfo(selectedTruck) : null;
  const hasRoute = !!(fromCity && toCity);
  const routeLabel = hasRoute ? `${fromCity} → ${toCity}` : "Select route";

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl bg-card shadow-2xl border border-border overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card/80 backdrop-blur-sm shrink-0">
            <div>
              <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                <Truck className="h-5 w-5 text-accent" />
                Get Price Estimate
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {hasRoute ? (
                  <span className="font-semibold text-primary">{routeLabel}</span>
                ) : (
                  "Enter pickup & drop city to get estimates"
                )}
              </p>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* ── No-route fallback ── */}
          {!hasRoute ? (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center gap-4">
              <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center">
                <Package className="h-8 w-8 text-accent" />
              </div>
              <p className="font-display text-lg font-bold text-foreground">Enter your route</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Please enter both a pickup city and a drop city to see available truck prices.
              </p>
              <button
                onClick={onClose}
                className="mt-2 rounded-xl border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
              >
                Go back
              </button>
            </div>

          ) : selectedTruck ? (
            /* ── Detail View ── */
            <div className="flex-1 overflow-y-auto">
              <button
                onClick={() => setSelectedTruck(null)}
                className="flex items-center gap-1.5 px-5 pt-4 pb-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to list
              </button>

              <div className="flex justify-center px-5 pt-3 pb-1">
                <div className="h-24 w-48">
                  <TruckImage tab={activeTab} />
                </div>
              </div>

              <div className="px-5 pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display text-base font-bold text-foreground">
                      {activeTab} • {selectedTruck.lengthFt}ft
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedTruck.tonnageMin}–{selectedTruck.tonnageMax} ton
                    </p>
                  </div>
                  {selectedPrice && (
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        from{" "}
                        <span className="font-display text-lg font-extrabold text-foreground">
                          ₹{selectedPrice.from.toLocaleString("en-IN")}
                        </span>
                      </p>
                      <div className="flex items-center gap-1 justify-end mt-0.5">
                        <span className="rounded px-1.5 py-0.5 text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          {selectedPrice.discountPct}% Off
                        </span>
                        <span className="text-xs text-muted-foreground line-through">
                          ₹{selectedPrice.original.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="h-px bg-border mx-5 my-3" />

              <div className="px-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Load Width</p>
                <div className="flex flex-wrap gap-2">
                  {WIDTH_OPTIONS.map((w) => (
                    <button
                      key={w}
                      onClick={() => setLoadOptions((p) => ({ ...p, widthFt: w }))}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                        loadOptions.widthFt === w
                          ? "border-primary bg-primary/10 text-primary shadow-sm"
                          : "border-border text-foreground hover:border-primary/50"
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-5 mt-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Load Height</p>
                <div className="flex flex-wrap gap-2">
                  {HEIGHT_OPTIONS.map((h) => (
                    <button
                      key={h}
                      onClick={() => setLoadOptions((p) => ({ ...p, heightFt: h }))}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                        loadOptions.heightFt === h
                          ? "border-primary bg-primary/10 text-primary shadow-sm"
                          : "border-border text-foreground hover:border-primary/50"
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-border mx-5 my-4" />

              <div className="px-5 pb-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Additional Services</p>
                <div className="grid grid-cols-2 gap-2">
                  {ADDON_OPTIONS.map((addon) => {
                    const checked = loadOptions.addons.includes(addon);
                    return (
                      <button
                        key={addon}
                        onClick={() => toggleAddon(addon)}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-all text-left ${
                          checked
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-foreground hover:border-primary/40"
                        }`}
                      >
                        <span
                          className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                            checked ? "border-primary bg-primary" : "border-muted-foreground"
                          }`}
                        >
                          {checked && (
                            <svg viewBox="0 0 10 10" className="h-2.5 w-2.5">
                              <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        {addon}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="sticky bottom-0 px-5 py-4 bg-card border-t border-border flex gap-3">
                <a
                  href="tel:+919651429006"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
                >
                  <Phone className="h-4 w-4 text-accent" /> Call Us
                </a>
                <Link to="/booking" search={{ from: fromCity, to: toCity }} onClick={onClose} className="flex-1">
                  <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
                    Book Now <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>

          ) : (
            /* ── List View ── */
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Tabs */}
              <div className="px-4 pt-3 pb-2 shrink-0">
                <div className="flex gap-2">
                  {(["Open", "Container", "Trailer"] as TruckTab[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-semibold transition-all ${
                        activeTab === tab
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      {activeTab === tab && (
                        <svg viewBox="0 0 10 10" className="h-3 w-3 shrink-0">
                          <polyline points="1,5 4,8 9,2" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      {tab}
                    </button>
                  ))}
                </div>
                {route && (
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Distance: ~{route.distanceKm.toLocaleString("en-IN")} km · Est. {route.estimatedHours}h transit
                  </p>
                )}
                {!route && (
                  <p className="mt-2 text-[11px] text-amber-600 dark:text-amber-400">
                    Route not found in database — showing estimated prices
                  </p>
                )}
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto px-4 py-1 space-y-2.5 pb-4">
                {tabTrucks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                    <Truck className="h-10 w-10 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">No {activeTab} trucks available.</p>
                  </div>
                ) : (
                  tabTrucks.map((truck) => {
                    const { from: discounted, original, discountPct } = getPriceInfo(truck);
                    return (
                      <button
                        key={truck.id}
                        onClick={() => setSelectedTruck(truck)}
                        className="w-full flex items-center gap-3 rounded-2xl border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all p-3.5 text-left active:scale-[0.99]"
                      >
                        <div className="h-12 w-16 shrink-0 rounded-xl bg-secondary/80 flex items-center justify-center p-1.5">
                          <TruckImage tab={activeTab} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground">
                            {activeTab} • {truck.lengthFt}ft
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {truck.tonnageMin}–{truck.tonnageMax} ton
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-muted-foreground">
                            from{" "}
                            <span className="font-display text-base font-extrabold text-foreground">
                              ₹{discounted.toLocaleString("en-IN")}
                            </span>
                          </p>
                          <div className="flex items-center gap-1 justify-end mt-0.5">
                            <span className="rounded px-1.5 py-0.5 text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              {discountPct}% Off
                            </span>
                            <span className="text-xs text-muted-foreground line-through">
                              ₹{original.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-border shrink-0 flex gap-3">
                <a
                  href="tel:+919651429006"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
                >
                  <Phone className="h-4 w-4 text-accent" /> Call Us
                </a>
                <Link to="/booking" search={{ from: fromCity, to: toCity }} onClick={onClose} className="flex-1">
                  <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
                    Full Booking <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
