import { useState, useMemo } from "react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import {
  Truck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Package,
  Calendar,
  User,
  Phone,
  Building2,
  Shield,
  Clock,
  MapPin,
  FileText,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CitySearchInput } from "@/components/site/CitySearchInput";
import {
  useAdminData,
  calculateDynamicPrice,
  addBookingOrder,
  getStoredRoutePricing,
  type TruckItem,
} from "@/lib/admin-store";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Book a Truck — City Cargo" },
      {
        name: "description",
        content:
          "Book verified trucks online. Choose your route, vehicle type, and get instant pricing.",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    from: (search.from as string) || "",
    to: (search.to as string) || "",
  }),
  component: BookingPage,
});

const goodsTypes = [
  "Building Materials",
  "FMCG / Consumer Goods",
  "Electronics",
  "Textiles / Garments",
  "Auto Parts",
  "Chemicals",
  "Furniture",
  "Steel / Metals",
  "Agricultural Products",
  "Pharmaceuticals",
  "Food & Beverages",
  "Paper / Packaging",
  "Other",
];

function BookingPage() {
  const { from: initialFrom, to: initialTo } = useSearch({ from: "/booking" });
  const { activeTrucks, findRouteDynamic, pricing } = useAdminData();
  const [step, setStep] = useState(1);

  // Step 1: Route
  const [pickupCity, setPickupCity] = useState(initialFrom);
  const [dropCity, setDropCity] = useState(initialTo);
  const [goodsType, setGoodsType] = useState("");

  // Step 2: Vehicle
  const [selectedTruck, setSelectedTruck] = useState<string>("");
  const [vehicleTab, setVehicleTab] = useState<"Open" | "Container" | "Trailer">("Open");
  const [loadWidthFt, setLoadWidthFt] = useState("8 ft");
  const [loadHeightFt, setLoadHeightFt] = useState("8 ft");
  const [addons, setAddons] = useState<string[]>([]);

  // Step 3: Details
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [loadingDate, setLoadingDate] = useState("");
  const [instructions, setInstructions] = useState("");

  // Step 4: Review
  const [insurance, setInsurance] = useState(false);

  // Step 5: Confirmation
  const [bookingId, setBookingId] = useState("");

  const truck = useMemo(
    () => activeTrucks.find((t) => t.id === selectedTruck),
    [activeTrucks, selectedTruck],
  );
  const route = useMemo(
    () => findRouteDynamic(pickupCity, dropCity),
    [findRouteDynamic, pickupCity, dropCity],
  );

  const priceBreakdown = useMemo(() => {
    if (!truck || !route) return null;
    return calculateDynamicPrice(
      route.distanceKm,
      truck.pricePerKm,
      truck.baseCharge,
      insurance,
    );
  }, [truck, route, insurance]);

  function handleConfirm() {
    const dist = route ? route.distanceKm : 500;
    const finalPrice = priceBreakdown ? priceBreakdown.total : 15000;

    const saved = addBookingOrder({
      customerName: contactName || "Valued Customer",
      phone: contactPhone || "9999999999",
      companyName,
      pickupCity,
      dropCity,
      goodsType: goodsType || "General Cargo",
      truckTypeId: truck?.id || "custom-truck",
      truckName: truck?.name || "Standard Freight Truck",
      loadingDate: loadingDate || new Date().toISOString().slice(0, 10),
      distanceKm: dist,
      totalPrice: finalPrice,
      status: "Pending",
      instructions,
      insuranceOptIn: insurance,
    });

    setBookingId(saved.bookingNumber);
    setStep(5);
  }

  const steps = [
    { num: 1, label: "Route" },
    { num: 2, label: "Vehicle" },
    { num: 3, label: "Details" },
    { num: 4, label: "Review" },
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />

      <div className="mx-auto max-w-4xl px-5 py-10">
        {/* Step indicator */}
        {step <= 4 && (
          <div className="mb-10 flex items-center justify-center gap-2">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (s.num < step) setStep(s.num);
                  }}
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-display font-bold transition-all ${
                    s.num === step
                      ? "bg-primary text-primary-foreground scale-110"
                      : s.num < step
                        ? "bg-green-500 text-white"
                        : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {s.num < step ? <CheckCircle2 className="h-5 w-5" /> : s.num}
                </button>
                <span
                  className={`hidden text-sm font-semibold sm:block ${s.num === step ? "text-primary" : "text-muted-foreground"}`}
                >
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <div className={`h-0.5 w-8 ${s.num < step ? "bg-green-500" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Route */}
        {step === 1 && (
          <div className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-3">
              <MapPin className="h-6 w-6 text-primary" />
              <h2 className="font-display text-2xl font-bold text-foreground">Select Route</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Tell us where your load is going</p>

            <div className="mt-8 space-y-5">
              <div>
                <Label className="mb-2 block text-sm font-semibold">Loading City</Label>
                <CitySearchInput
                  placeholder="Enter loading city"
                  value={pickupCity}
                  onChange={setPickupCity}
                  icon="pickup"
                />
              </div>
              <div>
                <Label className="mb-2 block text-sm font-semibold">Unloading City</Label>
                <CitySearchInput
                  placeholder="Enter unloading city"
                  value={dropCity}
                  onChange={setDropCity}
                  icon="drop"
                />
              </div>
              <div>
                <Label className="mb-2 block text-sm font-semibold">Type of Goods</Label>
                <select
                  className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  value={goodsType}
                  onChange={(e) => setGoodsType(e.target.value)}
                >
                  <option value="">Select goods type</option>
                  {goodsTypes.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {route && (
                <div className="rounded-xl bg-secondary/60 p-4">
                  <p className="text-sm text-muted-foreground">
                    Route found:{" "}
                    <span className="font-bold text-foreground">{route.distanceKm} km</span> · Est.{" "}
                    {route.estimatedHours}h drive
                  </p>
                </div>
              )}
            </div>

            <Button
              variant="cta"
              size="xl"
              className="mt-8 w-full"
              onClick={() => setStep(2)}
              disabled={!pickupCity || !dropCity || !goodsType}
            >
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* ── Step 2: Vehicle (New Tabbed UI) ── */}
        {step === 2 && (
          <div className="rounded-3xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Truck className="h-6 w-6 text-primary" />
                <h2 className="font-display text-2xl font-bold text-foreground">Choose Vehicle</h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {pickupCity} → {dropCity} · {goodsType}
              </p>

              {/* Tabs */}
              <div className="flex gap-2 mt-4">
                {(["Open", "Container", "Trailer"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setVehicleTab(tab);
                      setSelectedTruck("");
                    }}
                    className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-semibold transition-all ${
                      vehicleTab === tab
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {vehicleTab === tab && (
                      <svg viewBox="0 0 10 10" className="h-3 w-3">
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
            </div>

            {/* Truck List */}
            <div className="px-4 py-4 space-y-2.5">
              {(() => {
                const routePricing = getStoredRoutePricing();

                function getTruckTab(t: TruckItem) {
                  if (t.category === "trailer") return "Trailer";
                  const n = t.name.toLowerCase();
                  if (n.includes("container") || n.includes("closed")) return "Container";
                  return "Open";
                }

                function TruckSVG({ tab }: { tab: "Open" | "Container" | "Trailer" }) {
                  if (tab === "Trailer") return (
                    <svg viewBox="0 0 80 44" className="w-full h-full" fill="none">
                      <rect x="2" y="14" width="50" height="22" rx="3" fill="#2d6a4f" />
                      <rect x="52" y="8" width="22" height="28" rx="3" fill="#2d6a4f" />
                      <rect x="52" y="8" width="22" height="13" rx="2" fill="rgba(0,0,0,0.22)" />
                      <circle cx="14" cy="38" r="5" fill="#1a1a1a" /><circle cx="14" cy="38" r="2.5" fill="#555" />
                      <circle cx="56" cy="38" r="5" fill="#1a1a1a" /><circle cx="56" cy="38" r="2.5" fill="#555" />
                      <circle cx="68" cy="38" r="5" fill="#1a1a1a" /><circle cx="68" cy="38" r="2.5" fill="#555" />
                    </svg>
                  );
                  if (tab === "Container") return (
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

                const tabTrucks = activeTrucks.filter((t) => getTruckTab(t) === vehicleTab);

                if (tabTrucks.length === 0) return (
                  <div className="py-12 text-center text-muted-foreground">
                    <Truck className="mx-auto h-10 w-10 opacity-30 mb-3" />
                    <p className="text-sm">No {vehicleTab} trucks available.</p>
                  </div>
                );

                return tabTrucks.map((t) => {
                  const routeEntry = routePricing.find(
                    (e) =>
                      ((e.from.toLowerCase() === pickupCity.toLowerCase() && e.to.toLowerCase() === dropCity.toLowerCase()) ||
                        (e.from.toLowerCase() === dropCity.toLowerCase() && e.to.toLowerCase() === pickupCity.toLowerCase())) &&
                      e.truckTypeId === t.id
                  );
                  const original = routeEntry
                    ? routeEntry.basePrice
                    : route
                    ? calculateDynamicPrice(route.distanceKm, t.pricePerKm, t.baseCharge ?? 500, false).total
                    : calculateDynamicPrice(300, t.pricePerKm, t.baseCharge ?? 500, false).total;
                  const discountPct = routeEntry ? (routeEntry.discountPercent || 5) : 5;
                  const discounted = Math.round(original * (1 - discountPct / 100));
                  const isSelected = selectedTruck === t.id;

                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTruck(t.id)}
                      className={`w-full flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border hover:border-primary/40 hover:bg-secondary/30"
                      }`}
                    >
                      {/* Truck SVG icon */}
                      <div className="h-12 w-16 shrink-0 rounded-xl bg-secondary flex items-center justify-center p-1.5">
                        <TruckSVG tab={vehicleTab} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-display text-sm font-bold text-foreground">
                            {vehicleTab} • {t.lengthFt}ft
                          </p>
                          {t.popular && (
                            <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent-foreground">POPULAR</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{t.tonnageMin}–{t.tonnageMax} ton</p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{t.description}</p>
                      </div>

                      {/* Price */}
                      <div className="text-right shrink-0">
                        <p className="text-[11px] text-muted-foreground">
                          from <span className="font-display text-base font-extrabold text-foreground">₹{discounted.toLocaleString("en-IN")}</span>
                        </p>
                        <div className="flex items-center gap-1 justify-end mt-0.5">
                          <span className="rounded px-1.5 py-0.5 text-[10px] font-bold bg-green-100 text-green-700">{discountPct}% Off</span>
                          <span className="text-[11px] text-muted-foreground line-through">₹{original.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    </button>
                  );
                });
              })()}
            </div>

            {/* Load Options (shown when a truck is selected) */}
            {selectedTruck && (
              <div className="border-t border-border px-6 py-5 space-y-4 bg-secondary/20">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Load Width</p>
                  <div className="flex flex-wrap gap-2">
                    {["7 ft","7.5 ft","8 ft","8.5 ft","9 ft","9.5 ft","10 ft"].map((w) => (
                      <button key={w} onClick={() => setLoadWidthFt(w)}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                          loadWidthFt === w ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:border-primary/50"
                        }`}>{w}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Load Height</p>
                  <div className="flex flex-wrap gap-2">
                    {["7 ft","7.5 ft","8 ft","8.5 ft","9 ft","9.5 ft","10 ft"].map((h) => (
                      <button key={h} onClick={() => setLoadHeightFt(h)}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                          loadHeightFt === h ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:border-primary/50"
                        }`}>{h}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Additional Services</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {["Diesel Only","Need to send my Person","Extra Belt","Helper Required","Ramp Required","Express Delivery"].map((addon) => {
                      const checked = addons.includes(addon);
                      return (
                        <button key={addon} onClick={() => setAddons(prev => checked ? prev.filter(a => a !== addon) : [...prev, addon])}
                          className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium text-left transition-all ${
                            checked ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:border-primary/40"
                          }`}>
                          <span className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 ${
                            checked ? "border-primary bg-primary" : "border-muted-foreground"
                          }`}>
                            {checked && <svg viewBox="0 0 10 10" className="h-2.5 w-2.5"><polyline points="1.5,5 4,7.5 8.5,2.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                          </span>
                          {addon}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="px-6 pb-6 pt-4 flex gap-3">
              <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button
                variant="cta"
                size="xl"
                className="flex-1"
                onClick={() => setStep(3)}
                disabled={!selectedTruck}
              >
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Details */}
        {step === 3 && (
          <div className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-3">
              <User className="h-6 w-6 text-primary" />
              <h2 className="font-display text-2xl font-bold text-foreground">Your Details</h2>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>
                  <Building2 className="mr-1 inline h-3.5 w-3.5" /> Company Name
                </Label>
                <Input
                  placeholder="Your company"
                  className="h-12 rounded-xl"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>
                  <User className="mr-1 inline h-3.5 w-3.5" /> Contact Person
                </Label>
                <Input
                  placeholder="Full name"
                  className="h-12 rounded-xl"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>
                  <Phone className="mr-1 inline h-3.5 w-3.5" /> Mobile Number
                </Label>
                <Input
                  placeholder="10-digit number"
                  className="h-12 rounded-xl"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  maxLength={10}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>
                  <Calendar className="mr-1 inline h-3.5 w-3.5" /> Loading Date
                </Label>
                <Input
                  type="date"
                  className="h-12 rounded-xl"
                  value={loadingDate}
                  onChange={(e) => setLoadingDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <Label>
                <FileText className="mr-1 inline h-3.5 w-3.5" /> Special Instructions (Optional)
              </Label>
              <textarea
                placeholder="Any special handling, timing, or delivery instructions..."
                className="min-h-[80px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>

            <div className="mt-8 flex gap-3">
              <Button variant="outline" size="lg" onClick={() => setStep(2)}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button
                variant="cta"
                size="xl"
                className="flex-1"
                onClick={() => setStep(4)}
                disabled={!contactName || !contactPhone || !loadingDate}
              >
                Review Booking <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              <h2 className="font-display text-2xl font-bold text-foreground">Review & Confirm</h2>
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-xl bg-secondary/60 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Route
                </p>
                <p className="mt-1 font-display text-lg font-bold text-foreground">
                  {pickupCity} → {dropCity}
                </p>
                {route && (
                  <p className="text-sm text-muted-foreground">
                    {route.distanceKm} km · Est. {route.estimatedHours}h
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-secondary/60 p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Vehicle
                  </p>
                  <p className="mt-1 font-display font-bold text-foreground">{truck?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {truck?.tonnageMin}–{truck?.tonnageMax}T · {truck?.lengthFt}ft
                  </p>
                </div>
                <div className="rounded-xl bg-secondary/60 p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Goods
                  </p>
                  <p className="mt-1 font-display font-bold text-foreground">{goodsType}</p>
                  <p className="text-sm text-muted-foreground">Loading: {loadingDate}</p>
                </div>
              </div>

              <div className="rounded-xl bg-secondary/60 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Contact
                </p>
                <p className="mt-1 font-bold text-foreground">
                  {contactName}
                  {companyName && ` · ${companyName}`}
                </p>
                <p className="text-sm text-muted-foreground">+91 {contactPhone}</p>
              </div>

              {/* Insurance toggle */}
              <div className="flex items-center justify-between rounded-xl border border-border p-5">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="font-bold text-foreground">Goods Insurance</p>
                    <p className="text-xs text-muted-foreground">
                      Coverage up to ₹50 Lakhs · Starting ₹299
                    </p>
                  </div>
                </div>
                <button
                  className={`relative h-7 w-12 rounded-full transition-colors ${insurance ? "bg-green-500" : "bg-gray-300"}`}
                  onClick={() => setInsurance(!insurance)}
                >
                  <span
                    className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${insurance ? "translate-x-5" : "translate-x-0.5"}`}
                  />
                </button>
              </div>

              {/* Price summary */}
              <div className="rounded-2xl bg-primary/5 border-2 border-primary/20 p-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Base Platform Charge</span>
                  <span className="font-semibold text-foreground">
                    ₹{priceBreakdown?.baseFare || 500}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Freight Charges ({route?.distanceKm || 0} km)</span>
                  <span className="font-semibold text-foreground">
                    ₹{priceBreakdown?.distanceCharge?.toLocaleString() || "—"}
                  </span>
                </div>
                {insurance && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Transit Insurance</span>
                    <span className="font-semibold text-foreground">
                      ₹{priceBreakdown?.insuranceCharge || 0}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">GST ({pricing.gstPercent}%)</span>
                  <span className="font-semibold text-foreground">
                    ₹{priceBreakdown?.gstAmount?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="mt-3 border-t border-primary/20 pt-3 flex items-center justify-between">
                  <span className="font-display font-bold text-foreground">Total Quoted Price</span>
                  <span className="font-display text-2xl font-extrabold text-primary">
                    ₹{priceBreakdown?.total?.toLocaleString() || "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Button variant="outline" size="lg" onClick={() => setStep(3)}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button variant="cta" size="xl" className="flex-1" onClick={handleConfirm}>
                Confirm Booking <CheckCircle2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {step === 5 && (
          <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-[var(--shadow-elevated)]">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="mt-6 font-display text-3xl font-extrabold text-foreground">
              Booking Confirmed!
            </h2>
            <p className="mt-2 text-muted-foreground">Your truck has been booked successfully</p>

            <div className="mx-auto mt-8 max-w-sm rounded-xl bg-secondary/60 p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Booking ID
              </p>
              <p className="mt-1 font-display text-2xl font-extrabold text-primary">{bookingId}</p>
              <div className="mt-4 space-y-2 text-left">
                <p className="text-sm">
                  <span className="text-muted-foreground">Route:</span>{" "}
                  <span className="font-semibold text-foreground">
                    {pickupCity} → {dropCity}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Vehicle:</span>{" "}
                  <span className="font-semibold text-foreground">{truck?.name}</span>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Date:</span>{" "}
                  <span className="font-semibold text-foreground">{loadingDate}</span>
                </p>
                <p className="text-sm flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-accent" />{" "}
                  <span className="font-semibold text-accent-foreground">
                    Pickup in ~45 minutes
                  </span>
                </p>
              </div>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              A confirmation SMS has been sent to +91 {contactPhone}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/">
                <Button variant="soft" size="lg">
                  Go Home
                </Button>
              </Link>
              <Button variant="cta" size="lg">
                Track Shipment <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {step === 5 && <Footer />}
    </div>
  );
}
