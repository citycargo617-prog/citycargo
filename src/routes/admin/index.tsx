import { useState, useEffect, useMemo } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Logo } from "@/components/site/Logo";
import {
  Truck,
  IndianRupee,
  MapPin,
  Package,
  Sliders,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  RefreshCw,
  LogOut,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Clock,
  Phone,
  Building2,
  FileText,
  AlertTriangle,
  Download,
  Upload,
  Sparkles,
  Search,
  CheckCircle2,
  Layers,
  Fuel,
  Info,
  Calendar,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useAdminData,
  isAdminLoggedIn,
  getAdminSession,
  logoutAdmin,
  addTruck,
  updateTruck,
  deleteTruck,
  addRoute,
  updateRoute,
  deleteRoute,
  updateBookingStatus,
  deleteBooking,
  savePricingSettings,
  saveBannerSettings,
  resetAllDataToDefaults,
  upsertRoutePricingEntry,
  deleteRoutePricingEntry,
  type TruckItem,
  type RouteItem,
  type AdminBooking,
  type RoutePricingEntry,
  calculateDynamicPrice,
} from "@/lib/admin-store";
import { isSupabaseConfigured } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Control Center — City Cargo Connect" },
      {
        name: "description",
        content: "Complete master administration for trucks, pricing, routes, bookings, and site settings.",
      },
    ],
  }),
  component: AdminDashboardPage,
});

type TabType = "overview" | "city-pricing" | "trucks" | "bookings" | "settings";

function AdminDashboardPage() {
  const navigate = useNavigate();
  const session = getAdminSession();

  const [activeTab, setActiveTab] = useState<TabType>("city-pricing");

  // Admin store data
  const { trucks, activeTrucks, routes, activeRoutes, bookings, pricing, banner, routePricing, refresh } =
    useAdminData();

  // Authentication Guard
  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate({ to: "/admin/login" as const });
    }
  }, [navigate]);

  // Truck State & Modal
  const [truckModalOpen, setTruckModalOpen] = useState(false);
  const [editingTruck, setEditingTruck] = useState<TruckItem | null>(null);
  
  // Route Pricing Form State
  const [routePricingForm, setRoutePricingForm] = useState({
    from: "",
    to: "",
    truckTypeId: "",
    basePrice: 5000,
    discountPercent: 5,
  });
  const [routePricingSearch, setRoutePricingSearch] = useState("");

  const [truckCategoryFilter, setTruckCategoryFilter] = useState<string>("all");
  const [truckSearchQuery, setTruckSearchQuery] = useState("");

  const [truckForm, setTruckForm] = useState({
    name: "",
    category: "tempo" as TruckItem["category"],
    tonnageMin: 1,
    tonnageMax: 3,
    lengthFt: 10,
    pricePerKm: 0,
    baseCharge: 0,
    description: "",
    popular: false,
    active: true,
  });

  // Route State & Modal
  const [routeModalOpen, setRouteModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<RouteItem | null>(null);
  const [routeSearchQuery, setRouteSearchQuery] = useState("");
  const [routeForm, setRouteForm] = useState({
    from: "",
    to: "",
    distanceKm: 300,
    estimatedHours: 6,
    active: true,
  });

  // Booking Modal / Details
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>("all");
  const [bookingSearchQuery, setBookingSearchQuery] = useState("");

  // Settings State Form
  const [pricingForm, setPricingForm] = useState({
    baseBookingCharge: pricing.baseBookingCharge,
    gstPercent: pricing.gstPercent,
    fuelSurchargePercent: pricing.fuelSurchargePercent,
    insurancePercent: pricing.insurancePercent,
  });

  const [bannerForm, setBannerForm] = useState({
    promoTagline: banner.promoTagline,
    promoTitle: banner.promoTitle,
    promoSubtitle: banner.promoSubtitle,
    referralOffer: banner.referralOffer,
    announcementText: banner.announcementText,
    showAnnouncement: banner.showAnnouncement,
  });

  useEffect(() => {
    setPricingForm({
      baseBookingCharge: pricing.baseBookingCharge,
      gstPercent: pricing.gstPercent,
      fuelSurchargePercent: pricing.fuelSurchargePercent,
      insurancePercent: pricing.insurancePercent,
    });
    setBannerForm({
      promoTagline: banner.promoTagline,
      promoTitle: banner.promoTitle,
      promoSubtitle: banner.promoSubtitle,
      referralOffer: banner.referralOffer,
      announcementText: banner.announcementText,
      showAnnouncement: banner.showAnnouncement,
    });
  }, [pricing, banner]);

  // Route Quote Estimator Playground
  const [testFrom, setTestFrom] = useState("Delhi");
  const [testTo, setTestTo] = useState("Mumbai");
  const [testTruckId, setTestTruckId] = useState(trucks[0]?.id || "");
  const [testInsurance, setTestInsurance] = useState(true);

  const testEstimate = useMemo(() => {
    const r = routes.find(
      (item) =>
        (item.from.toLowerCase() === testFrom.toLowerCase() &&
          item.to.toLowerCase() === testTo.toLowerCase()) ||
        (item.from.toLowerCase() === testTo.toLowerCase() &&
          item.to.toLowerCase() === testFrom.toLowerCase()),
    );
    const dist = r ? r.distanceKm : 500;
    const t = trucks.find((tr) => tr.id === testTruckId) || trucks[0];
    const rate = t ? t.pricePerKm : 25;
    return calculateDynamicPrice(dist, rate, t?.baseCharge, testInsurance);
  }, [testFrom, testTo, testTruckId, testInsurance, routes, trucks]);

  // Filtered Trucks
  const filteredTrucks = useMemo(() => {
    return trucks.filter((t) => {
      const matchCat = truckCategoryFilter === "all" || t.category === truckCategoryFilter;
      const matchSearch =
        t.name.toLowerCase().includes(truckSearchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(truckSearchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [trucks, truckCategoryFilter, truckSearchQuery]);

  // Filtered Routes
  const filteredRoutes = useMemo(() => {
    return routes.filter((r) => {
      const q = routeSearchQuery.toLowerCase();
      return r.from.toLowerCase().includes(q) || r.to.toLowerCase().includes(q);
    });
  }, [routes, routeSearchQuery]);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchStatus = bookingStatusFilter === "all" || b.status === bookingStatusFilter;
      const q = bookingSearchQuery.toLowerCase();
      const matchSearch =
        b.bookingNumber.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.pickupCity.toLowerCase().includes(q) ||
        b.dropCity.toLowerCase().includes(q) ||
        (b.companyName && b.companyName.toLowerCase().includes(q));
      return matchStatus && matchSearch;
    });
  }, [bookings, bookingStatusFilter, bookingSearchQuery]);

  // ── KPI Summary ──
  const kpi = useMemo(() => {
    const totalRev = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const avgRate =
      activeTrucks.length > 0
        ? Math.round(
            activeTrucks.reduce((acc, curr) => acc + curr.pricePerKm, 0) / activeTrucks.length,
          )
        : 0;

    return {
      activeTrucksCount: activeTrucks.length,
      totalTrucksCount: trucks.length,
      routePricingCount: routePricing.length,
      totalBookings: bookings.length,
      totalRevenue: totalRev,
    };
  }, [trucks, activeTrucks, routePricing, bookings]);

  // Handlers: Truck
  function openAddTruck() {
    setEditingTruck(null);
    setTruckForm({
      name: "",
      category: "tempo",
      tonnageMin: 1,
      tonnageMax: 3,
      lengthFt: 10,
      pricePerKm: 0,
      baseCharge: 0,
      description: "",
      popular: false,
      active: true,
    });
    setTruckModalOpen(true);
  }

  function openEditTruck(t: TruckItem) {
    setEditingTruck(t);
    setTruckForm({
      name: t.name,
      category: t.category,
      tonnageMin: t.tonnageMin,
      tonnageMax: t.tonnageMax,
      lengthFt: t.lengthFt,
      pricePerKm: t.pricePerKm,
      baseCharge: t.baseCharge ?? 0,
      description: t.description,
      popular: !!t.popular,
      active: t.active !== false,
    });
    setTruckModalOpen(true);
  }

  function handleSaveTruck(e: React.FormEvent) {
    e.preventDefault();
    if (!truckForm.name.trim()) {
      toast.error("Truck name is required");
      return;
    }

    if (editingTruck) {
      updateTruck(editingTruck.id, truckForm);
      toast.success(`Updated ${truckForm.name} specifications!`);
    } else {
      addTruck({
        ...truckForm,
        id: truckForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      });
      toast.success(`Added new truck: ${truckForm.name}`);
    }
    setTruckModalOpen(false);
  }

  function handleDeleteTruck(id: string, name: string) {
    if (confirm(`Are you sure you want to remove "${name}" from your active fleet?`)) {
      deleteTruck(id);
      toast.success(`Truck ${name} removed`);
    }
  }

  // Handlers: Settings
  function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    savePricingSettings(pricingForm);
    saveBannerSettings(bannerForm);
    toast.success("All platform settings updated live!");
  }

  function handleResetDefaults() {
    if (
      confirm("Are you sure you want to restore default demo data? Custom changes will be reset.")
    ) {
      resetAllDataToDefaults();
      toast.success("Restored factory demo dataset!");
    }
  }

  function handleExportBackup() {
    const data = {
      trucks,
      routes,
      bookings,
      pricing,
      banner,
      routePricing,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `city-cargo-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    toast.success("Backup downloaded successfully!");
  }

  function handleLogout() {
    logoutAdmin();
    toast.info("Logged out from Admin Portal");
    navigate({ to: "/admin/login" as const });
  }

  const popularCityPills = [
    "Lucknow",
    "Delhi",
    "Mumbai",
    "Patna",
    "Kanpur",
    "Varanasi",
    "Gorakhpur",
    "Prayagraj",
    "Agra",
    "Kolkata",
    "Bengaluru",
    "Pune",
  ];

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      {/* ── Top Master Control Bar ── */}
      <header className="sticky top-0 z-50 border-b border-border/80 bg-card/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <div className="flex items-center gap-4">
            <Logo />
            <div className="hidden items-center gap-2 border-l border-border pl-4 sm:flex">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Admin Control Panel
              </span>
            </div>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/60 px-3.5 py-1.5 text-xs font-bold text-foreground transition-all hover:bg-secondary active:scale-95"
            >
              <ExternalLink className="h-3.5 w-3.5 text-primary" />
              <span className="hidden sm:inline">View Customer Site</span>
            </Link>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="rounded-xl text-xs font-bold text-red-600 hover:bg-red-500/10 hover:border-red-500/30"
            >
              <LogOut className="h-3.5 w-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
            {[
              {
                id: "city-pricing",
                label: `City-to-City Pricing (${routePricing.length})`,
                icon: MapPin,
                highlight: true,
              },
              {
                id: "trucks",
                label: `Vehicles & Fleet (${trucks.length})`,
                icon: Truck,
              },
              {
                id: "bookings",
                label: `Orders & Leads (${bookings.length})`,
                icon: Package,
              },
              { id: "overview", label: "Dashboard", icon: TrendingUp },
              { id: "settings", label: "Settings", icon: Sliders },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`relative flex items-center gap-2 rounded-t-xl px-4 py-3 text-xs font-bold transition-all ${
                    isSelected
                      ? "text-primary bg-background shadow-sm border-t border-x border-border/80"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isSelected ? "text-primary" : ""}`} />
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {tab.highlight && !isSelected && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                  {isSelected && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── Main Content Body ── */}
      <main className="mx-auto max-w-7xl px-5 py-8">
        {/* ========================================================================= */}
        {/* TAB 1: CITY-TO-CITY FIXED PRICING (PRIMARY) */}
        {/* ========================================================================= */}
        {activeTab === "city-pricing" && (
          <div className="space-y-8">
            {/* Header / Intro */}
            <div className="rounded-3xl border border-border/80 bg-gradient-to-r from-primary/15 via-primary/5 to-card p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                    <MapPin className="h-3.5 w-3.5" /> Fixed Price Controller
                  </span>
                  <h2 className="mt-2.5 font-display text-2xl font-black text-foreground sm:text-3xl">
                    City-to-City Fixed Pricing
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
                    Set fixed freight charges from any city to another. You decide the exact price for each vehicle type without distance/km math.
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-card/80 p-4 text-center">
                  <p className="text-[11px] font-bold uppercase text-muted-foreground">Configured Routes</p>
                  <p className="font-display text-3xl font-black text-primary">{routePricing.length}</p>
                </div>
              </div>
            </div>

            {/* Form & List Container */}
            <div className="rounded-3xl border border-border/80 bg-card shadow-sm overflow-hidden">
              {/* Form header */}
              <div className="px-6 py-5 border-b border-border/80 bg-secondary/30">
                <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                  <Plus className="h-4 w-4 text-primary" /> Add / Update City Fixed Price
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Choose origin city, destination city, vehicle type, and set your fixed price.
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* City quick pills helper */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Quick Pick Cities:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {popularCityPills.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => {
                          if (!routePricingForm.from) {
                            setRoutePricingForm({ ...routePricingForm, from: city });
                          } else if (!routePricingForm.to) {
                            setRoutePricingForm({ ...routePricingForm, to: city });
                          } else {
                            setRoutePricingForm({ ...routePricingForm, from: city, to: "" });
                          }
                        }}
                        className="rounded-lg border border-border bg-secondary/50 px-2.5 py-1 text-xs font-semibold text-foreground hover:border-primary hover:bg-primary/10 hover:text-primary transition-all"
                      >
                        + {city}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  {/* From */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      From (Origin City) *
                    </label>
                    <Input
                      placeholder="e.g. Lucknow"
                      value={routePricingForm.from}
                      onChange={(e) => setRoutePricingForm({ ...routePricingForm, from: e.target.value })}
                      className="h-11 rounded-xl mt-1 text-sm font-semibold"
                    />
                  </div>

                  {/* To */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      To (Destination City) *
                    </label>
                    <Input
                      placeholder="e.g. Patna"
                      value={routePricingForm.to}
                      onChange={(e) => setRoutePricingForm({ ...routePricingForm, to: e.target.value })}
                      className="h-11 rounded-xl mt-1 text-sm font-semibold"
                    />
                  </div>

                  {/* Vehicle Type */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Vehicle Type *
                    </label>
                    <select
                      value={routePricingForm.truckTypeId}
                      onChange={(e) => setRoutePricingForm({ ...routePricingForm, truckTypeId: e.target.value })}
                      className="h-11 w-full rounded-xl mt-1 border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-primary"
                    >
                      <option value="">— Select vehicle —</option>
                      <optgroup label="Open Body">
                        {trucks
                          .filter((t) => t.category !== "trailer" && !t.name.toLowerCase().includes("container") && !t.name.toLowerCase().includes("closed"))
                          .map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name} ({t.tonnageMin}–{t.tonnageMax}T, {t.lengthFt}ft)
                            </option>
                          ))}
                      </optgroup>
                      <optgroup label="Container / Closed">
                        {trucks
                          .filter((t) => t.name.toLowerCase().includes("container") || t.name.toLowerCase().includes("closed"))
                          .map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name} ({t.tonnageMin}–{t.tonnageMax}T, {t.lengthFt}ft)
                            </option>
                          ))}
                      </optgroup>
                      <optgroup label="Trailer">
                        {trucks
                          .filter((t) => t.category === "trailer")
                          .map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name} ({t.tonnageMin}–{t.tonnageMax}T, {t.lengthFt}ft)
                            </option>
                          ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* Fixed Price */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Fixed Base Price (₹) *
                    </label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">₹</span>
                      <Input
                        type="number"
                        min={0}
                        placeholder="e.g. 8500"
                        value={routePricingForm.basePrice || ""}
                        onChange={(e) => setRoutePricingForm({ ...routePricingForm, basePrice: Number(e.target.value) })}
                        className="h-11 rounded-xl pl-7 text-sm font-bold"
                      />
                    </div>
                  </div>

                  {/* Discount */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Discount % (Customer Offer)
                    </label>
                    <Input
                      type="number"
                      min={0}
                      max={50}
                      placeholder="e.g. 5"
                      value={routePricingForm.discountPercent || ""}
                      onChange={(e) => setRoutePricingForm({ ...routePricingForm, discountPercent: Number(e.target.value) })}
                      className="h-11 rounded-xl mt-1 text-sm font-semibold"
                    />
                  </div>
                </div>

                {/* Live Customer Preview & Submit */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  {routePricingForm.basePrice > 0 ? (
                    <div className="flex items-center gap-3 rounded-2xl bg-secondary/50 border border-border px-4 py-2.5">
                      <IndianRupee className="h-4 w-4 text-primary shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        Customer will see:{" "}
                        <span className="font-extrabold text-foreground text-sm">
                          ₹{Math.round(routePricingForm.basePrice * (1 - (routePricingForm.discountPercent || 0) / 100)).toLocaleString("en-IN")}
                        </span>
                        {routePricingForm.discountPercent > 0 && (
                          <>
                            <span className="ml-1.5 line-through text-muted-foreground">
                              ₹{routePricingForm.basePrice.toLocaleString("en-IN")}
                            </span>
                            <span className="ml-1.5 text-emerald-600 font-bold">
                              {routePricingForm.discountPercent}% off
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  ) : (
                    <div />
                  )}

                  <Button
                    type="button"
                    size="lg"
                    className="h-11 px-8 rounded-xl text-sm font-bold bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    onClick={() => {
                      if (!routePricingForm.from.trim() || !routePricingForm.to.trim() || !routePricingForm.truckTypeId) {
                        toast.error("Please enter Origin City, Destination City and select a Vehicle Type");
                        return;
                      }
                      if (!routePricingForm.basePrice || routePricingForm.basePrice <= 0) {
                        toast.error("Please enter a valid fixed price");
                        return;
                      }
                      upsertRoutePricingEntry(routePricingForm as RoutePricingEntry);
                      const truckName =
                        trucks.find((t) => t.id === routePricingForm.truckTypeId)?.name ?? routePricingForm.truckTypeId;
                      toast.success(`✓ Saved fixed price: ${routePricingForm.from} → ${routePricingForm.to} (${truckName})`);
                      setRoutePricingForm({
                        from: routePricingForm.from,
                        to: routePricingForm.to,
                        truckTypeId: "",
                        basePrice: 0,
                        discountPercent: 5,
                      });
                      refresh();
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" /> Save Fixed Price
                  </Button>
                </div>
              </div>
            </div>

            {/* List of Configured Routes */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    Configured City Routes ({routePricing.length})
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Live rates displayed to users when they request price estimates
                  </p>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search by city..."
                    value={routePricingSearch}
                    onChange={(e) => setRoutePricingSearch(e.target.value)}
                    className="h-9 w-60 pl-8 rounded-xl text-xs"
                  />
                </div>
              </div>

              {routePricing.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground border-2 border-dashed border-border rounded-2xl">
                  <MapPin className="h-12 w-12 opacity-25" />
                  <p className="font-bold text-base text-foreground">No fixed prices configured yet</p>
                  <p className="text-xs max-w-sm">
                    Use the form above to add flat fixed pricing between any origin and destination cities.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(() => {
                    const q = routePricingSearch.toLowerCase();
                    const filtered = routePricing.filter(
                      (e) => e.from.toLowerCase().includes(q) || e.to.toLowerCase().includes(q)
                    );

                    if (filtered.length === 0) {
                      return (
                        <p className="text-center py-8 text-xs text-muted-foreground">
                          No routes match "{routePricingSearch}".
                        </p>
                      );
                    }

                    const grouped: Record<string, typeof filtered> = {};
                    filtered.forEach((e) => {
                      const key = `${e.from.trim()} ➔ ${e.to.trim()}`;
                      if (!grouped[key]) grouped[key] = [];
                      grouped[key].push(e);
                    });

                    return Object.entries(grouped).map(([routeKey, entries]) => (
                      <div key={routeKey} className="rounded-2xl border border-border overflow-hidden">
                        {/* Route Title Bar */}
                        <div className="flex items-center justify-between px-5 py-3 bg-secondary/60 border-b border-border">
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <MapPin className="h-4 w-4" />
                            </span>
                            <span className="font-display text-sm font-black text-foreground">{routeKey}</span>
                            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                              {entries.length} vehicle rate{entries.length > 1 ? "s" : ""}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Remove all price rates for ${routeKey}?`)) {
                                entries.forEach((e) => deleteRoutePricingEntry(e.from, e.to, e.truckTypeId));
                                toast.success(`All rates removed for ${routeKey}`);
                                refresh();
                              }
                            }}
                            className="rounded-lg px-2.5 py-1 text-[11px] font-semibold text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="h-3 w-3" /> Remove Route
                          </button>
                        </div>

                        {/* Vehicles Rows */}
                        <div className="divide-y divide-border/60">
                          {entries.map((entry, idx) => {
                            const truck = trucks.find((t) => t.id === entry.truckTypeId);
                            const finalPrice = Math.round(entry.basePrice * (1 - (entry.discountPercent || 0) / 100));
                            return (
                              <div
                                key={idx}
                                className="flex items-center justify-between gap-4 px-5 py-3.5 bg-card hover:bg-secondary/20 transition-colors"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-foreground shrink-0">
                                    <Truck className="h-4 w-4 text-primary" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-foreground">
                                      {truck?.name ?? entry.truckTypeId}
                                    </p>
                                    {truck && (
                                      <p className="text-[11px] text-muted-foreground">
                                        {truck.category.toUpperCase()} · {truck.tonnageMin}–{truck.tonnageMax} Ton · {truck.lengthFt} ft
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-5">
                                  <div className="text-right">
                                    <p className="font-display text-base font-black text-foreground">
                                      ₹{finalPrice.toLocaleString("en-IN")}
                                    </p>
                                    <div className="flex items-center gap-1.5 justify-end">
                                      {entry.discountPercent > 0 && (
                                        <span className="rounded bg-emerald-500/10 px-1.5 py-0.2 text-[10px] font-bold text-emerald-600">
                                          {entry.discountPercent}% Off
                                        </span>
                                      )}
                                      <span className="text-xs text-muted-foreground line-through">
                                        ₹{entry.basePrice.toLocaleString("en-IN")}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      title="Edit this price"
                                      onClick={() => {
                                        setRoutePricingForm({
                                          from: entry.from,
                                          to: entry.to,
                                          truckTypeId: entry.truckTypeId,
                                          basePrice: entry.basePrice,
                                          discountPercent: entry.discountPercent,
                                        });
                                        window.scrollTo({ top: 120, behavior: "smooth" });
                                        toast.info("Loaded into form for editing!");
                                      }}
                                      className="rounded-lg p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                      type="button"
                                      title="Delete this price"
                                      onClick={() => {
                                        deleteRoutePricingEntry(entry.from, entry.to, entry.truckTypeId);
                                        toast.success("Price removed");
                                        refresh();
                                      }}
                                      className="rounded-lg p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: FLEET & VEHICLES */}
        {/* ========================================================================= */}
        {activeTab === "trucks" && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search vehicle models..."
                    value={truckSearchQuery}
                    onChange={(e) => setTruckSearchQuery(e.target.value)}
                    className="h-9 w-48 sm:w-64 pl-8 rounded-xl text-xs"
                  />
                </div>

                {/* Category filter */}
                <div className="flex items-center gap-1">
                  {["all", "tempo", "truck", "trailer"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setTruckCategoryFilter(cat)}
                      className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold capitalize transition-all ${
                        truckCategoryFilter === cat
                          ? "bg-primary text-primary-foreground font-bold shadow-sm"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={openAddTruck}
                className="rounded-xl font-bold text-xs bg-primary text-primary-foreground shadow-sm"
              >
                <Plus className="h-4 w-4 mr-1.5" /> Add New Vehicle
              </Button>
            </div>

            {/* Trucks Table */}
            <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border/60 bg-secondary/50 font-bold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3.5">Vehicle</th>
                      <th className="px-4 py-3.5">Type</th>
                      <th className="px-4 py-3.5">Capacity</th>
                      <th className="px-4 py-3.5">Configured Routes</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {filteredTrucks.map((t) => (
                      <tr key={t.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-bold text-foreground text-sm">{t.name}</div>
                          <div className="text-[11px] text-muted-foreground line-clamp-1 max-w-xs">{t.description}</div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`rounded-lg px-2.5 py-1 font-bold uppercase tracking-wider text-[10px] ${
                            t.category === "trailer" ? "bg-green-500/10 text-green-700 dark:text-green-400" :
                            t.category === "truck" ? "bg-blue-500/10 text-blue-700 dark:text-blue-400" :
                            "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                          }`}>
                            {t.category === "tempo" ? "Open" : t.category === "truck" ? "Container" : "Trailer"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-foreground">
                          {t.tonnageMin}–{t.tonnageMax}T · {t.lengthFt}ft
                        </td>
                        <td className="px-4 py-4">
                          {(() => {
                            const count = routePricing.filter((e) => e.truckTypeId === t.id).length;
                            return count > 0 ? (
                              <button
                                type="button"
                                onClick={() => setActiveTab("city-pricing")}
                                className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                              >
                                <CheckCircle2 className="h-3 w-3" />
                                {count} route{count > 1 ? "s" : ""} priced
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setRoutePricingForm({ ...routePricingForm, truckTypeId: t.id });
                                  setActiveTab("city-pricing");
                                }}
                                className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
                              >
                                <Plus className="h-3 w-3" /> Set price
                              </button>
                            );
                          })()}
                        </td>
                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() => updateTruck(t.id, { active: t.active === false })}
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold transition-all ${
                              t.active !== false
                                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                : "bg-red-500/15 text-red-600 dark:text-red-400"
                            }`}
                          >
                            {t.active !== false ? "● Active" : "○ Disabled"}
                          </button>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditTruck(t)}
                              className="h-8 rounded-lg text-xs"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteTruck(t.id, t.name)}
                              className="h-8 rounded-lg text-xs text-red-600 hover:bg-red-500/10 hover:border-red-500/30"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ORDERS & BOOKINGS CRM */}
        {/* ========================================================================= */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search booking #, customer, phone..."
                    value={bookingSearchQuery}
                    onChange={(e) => setBookingSearchQuery(e.target.value)}
                    className="h-9 w-64 pl-8 rounded-xl text-xs"
                  />
                </div>

                <div className="flex items-center gap-1 overflow-x-auto">
                  {["all", "Pending", "Confirmed", "Dispatched", "In-Transit", "Delivered", "Cancelled"].map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setBookingStatusFilter(st)}
                        className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                          bookingStatusFilter === st
                            ? "bg-primary text-primary-foreground font-bold shadow-sm"
                            : "bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {st}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border/60 bg-secondary/50 font-bold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3.5">Booking ID</th>
                      <th className="px-4 py-3.5">Customer & Company</th>
                      <th className="px-4 py-3.5">Route</th>
                      <th className="px-4 py-3.5">Vehicle</th>
                      <th className="px-4 py-3.5">Total Quote</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                          <Package className="mx-auto h-8 w-8 opacity-40 mb-2" />
                          <p className="font-semibold">No customer bookings found</p>
                          <p className="text-[11px]">Customer quote inquiries will appear here live</p>
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-secondary/30 transition-colors">
                          <td className="px-5 py-4 font-mono font-bold text-primary">
                            {b.bookingNumber}
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-bold text-foreground">{b.customerName}</div>
                            <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                              <span>{b.phone}</span>
                              {b.companyName && <span>· {b.companyName}</span>}
                            </div>
                          </td>
                          <td className="px-4 py-4 font-semibold text-foreground">
                            {b.pickupCity} ➔ {b.dropCity}
                          </td>
                          <td className="px-4 py-4 text-muted-foreground">{b.truckName}</td>
                          <td className="px-4 py-4 font-display font-extrabold text-sm text-foreground">
                            ₹{b.totalPrice.toLocaleString("en-IN")}
                          </td>
                          <td className="px-4 py-4">
                            <select
                              value={b.status}
                              onChange={(e) =>
                                updateBookingStatus(b.id, e.target.value as AdminBooking["status"])
                              }
                              className={`rounded-lg border px-2.5 py-1 text-xs font-bold outline-none cursor-pointer ${
                                b.status === "Confirmed"
                                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                  : b.status === "In-Transit" || b.status === "Dispatched"
                                    ? "border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-400"
                                    : b.status === "Delivered"
                                      ? "border-purple-500/40 bg-purple-500/10 text-purple-700 dark:text-purple-400"
                                      : b.status === "Cancelled"
                                        ? "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-400"
                                        : "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Dispatched">Dispatched</option>
                              <option value="In-Transit">In-Transit</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedBooking(b)}
                                className="h-8 rounded-lg text-xs"
                              >
                                <FileText className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (confirm(`Delete booking ${b.bookingNumber}?`)) {
                                    deleteBooking(b.id);
                                    toast.success("Booking deleted");
                                  }
                                }}
                                className="h-8 rounded-lg text-xs text-red-600 hover:bg-red-500/10 hover:border-red-500/30"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: DASHBOARD OVERVIEW */}
        {/* ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Quick KPI Cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-bold uppercase tracking-wider">City Prices Set</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 font-display text-3xl font-black text-foreground">
                  {kpi.routePricingCount}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Custom fixed rates active</p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-bold uppercase tracking-wider">Active Fleet</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                    <Truck className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 font-display text-3xl font-black text-foreground">
                  {kpi.activeTrucksCount}{" "}
                  <span className="text-xs font-medium text-muted-foreground">
                    / {kpi.totalTrucksCount} Total
                  </span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Vehicle types available</p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Bookings</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                    <Package className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 font-display text-3xl font-black text-foreground">
                  {kpi.totalBookings}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Customer inquiries</p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-bold uppercase tracking-wider">Quoted Volume</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                    <IndianRupee className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 font-display text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  ₹{kpi.totalRevenue.toLocaleString("en-IN")}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Total booking quote value</p>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
                <h3 className="font-display text-base font-bold text-foreground mb-1">
                  City-to-City Fixed Pricing
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Configure flat fixed prices for any city routes.
                </p>
                <Button
                  onClick={() => setActiveTab("city-pricing")}
                  className="rounded-xl font-bold text-xs bg-primary text-primary-foreground"
                >
                  <MapPin className="h-4 w-4 mr-1.5" /> Manage City Prices ({routePricing.length}) →
                </Button>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
                <h3 className="font-display text-base font-bold text-foreground mb-1">
                  Fleet & Vehicle Models
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Manage truck specs, tonnage capacities, and availability.
                </p>
                <Button
                  onClick={() => setActiveTab("trucks")}
                  variant="outline"
                  className="rounded-xl font-bold text-xs"
                >
                  <Truck className="h-4 w-4 mr-1.5" /> Manage Fleet Vehicles ({trucks.length}) →
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === "settings" && (
          <div className="space-y-8">
            {/* Supabase Cloud Connection Card */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    isSupabaseConfigured
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                  }`}>
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-base font-bold text-foreground">
                        Database Storage Connection
                      </h3>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        isSupabaseConfigured
                          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                      }`}>
                        {isSupabaseConfigured ? "● Cloud Connected (Postgres)" : "○ Local Storage (Offline Mode)"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isSupabaseConfigured
                        ? "Real-time sync enabled across all devices."
                        : "Data is saved locally in this browser. To sync across devices, configure .env"}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs rounded-xl"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `-- Run supabase-schema.sql in your Supabase SQL editor\n-- Check the project root for the full SQL file!`
                    );
                    toast.success("SQL Schema info copied to clipboard");
                  }}
                >
                  <FileText className="h-3.5 w-3.5 mr-1.5" /> Copy SQL Schema
                </Button>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Global charges */}
                <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                    <IndianRupee className="h-5 w-5 text-primary" />
                    <h3 className="font-display text-base font-bold text-foreground">
                      Taxes & Optional Charges
                    </h3>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        GST Rate (%)
                      </label>
                      <Input
                        type="number"
                        value={pricingForm.gstPercent}
                        onChange={(e) =>
                          setPricingForm({
                            ...pricingForm,
                            gstPercent: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="h-10 rounded-xl mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Transit Insurance (%)
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        value={pricingForm.insurancePercent}
                        onChange={(e) =>
                          setPricingForm({
                            ...pricingForm,
                            insurancePercent: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="h-10 rounded-xl mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Promo Banner & Announcement Form */}
                <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                    <Sparkles className="h-5 w-5 text-accent" />
                    <h3 className="font-display text-base font-bold text-foreground">
                      Promotional Banner & Announcements
                    </h3>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Hero Tagline
                      </label>
                      <Input
                        value={bannerForm.promoTagline}
                        onChange={(e) =>
                          setBannerForm({ ...bannerForm, promoTagline: e.target.value })
                        }
                        className="h-10 rounded-xl mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Announcement Marquee
                      </label>
                      <Input
                        value={bannerForm.announcementText}
                        onChange={(e) =>
                          setBannerForm({ ...bannerForm, announcementText: e.target.value })
                        }
                        className="h-10 rounded-xl mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save & Reset Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetDefaults}
                  className="text-xs font-bold text-red-600 hover:bg-red-500/10 rounded-xl"
                >
                  Reset to Factory Defaults
                </Button>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleExportBackup}
                    className="text-xs font-bold rounded-xl"
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" /> Backup JSON
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-xl font-display font-bold text-xs bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  >
                    <Check className="h-4 w-4 mr-1.5" /> Save All Settings Live
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* ── MODAL: ADD / EDIT TRUCK ── */}
      {truckModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-1">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  {editingTruck ? "Edit Vehicle" : "Add Vehicle to Fleet"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {editingTruck ? "Update vehicle specs" : "Set pricing separately in the Pricing tab"}
                </p>
              </div>
              <button
                onClick={() => setTruckModalOpen(false)}
                className="rounded-full h-8 w-8 flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTruck} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Truck Name
                </label>
                <Input
                  required
                  placeholder="e.g. 40ft High-Cube Trailer"
                  value={truckForm.name}
                  onChange={(e) => setTruckForm({ ...truckForm, name: e.target.value })}
                  className="h-10 rounded-xl mt-1 text-sm"
                />
              </div>

              {/* Vehicle Type */}
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Vehicle Type</label>
                <select
                  value={truckForm.category}
                  onChange={(e) =>
                    setTruckForm({
                      ...truckForm,
                      category: e.target.value as TruckItem["category"],
                    })
                  }
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-semibold outline-none mt-1 focus:border-primary"
                >
                  <option value="tempo">Open Body (Tempo / Small Truck)</option>
                  <option value="truck">Container / Closed Body</option>
                  <option value="trailer">Trailer (Multi-Axle)</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-muted-foreground">
                    Min Payload (Ton)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={truckForm.tonnageMin}
                    onChange={(e) =>
                      setTruckForm({ ...truckForm, tonnageMin: parseFloat(e.target.value) || 0 })
                    }
                    className="h-9 rounded-xl mt-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-muted-foreground">
                    Max Payload (Ton)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={truckForm.tonnageMax}
                    onChange={(e) =>
                      setTruckForm({ ...truckForm, tonnageMax: parseFloat(e.target.value) || 0 })
                    }
                    className="h-9 rounded-xl mt-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-muted-foreground">
                    Deck Length (Ft)
                  </label>
                  <Input
                    type="number"
                    value={truckForm.lengthFt}
                    onChange={(e) =>
                      setTruckForm({ ...truckForm, lengthFt: parseFloat(e.target.value) || 0 })
                    }
                    className="h-9 rounded-xl mt-1 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Description
                </label>
                <Input
                  placeholder="Suitable cargo types, capacity notes..."
                  value={truckForm.description}
                  onChange={(e) => setTruckForm({ ...truckForm, description: e.target.value })}
                  className="h-10 rounded-xl mt-1 text-xs"
                />
              </div>

              <div className="flex items-center gap-6 pt-3 border-t border-border/40">
                <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={truckForm.popular}
                    onChange={(e) => setTruckForm({ ...truckForm, popular: e.target.checked })}
                    className="rounded text-primary h-4 w-4"
                  />
                  <span>Mark as Popular</span>
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={truckForm.active}
                    onChange={(e) => setTruckForm({ ...truckForm, active: e.target.checked })}
                    className="rounded text-primary h-4 w-4"
                  />
                  <span>Active for Booking</span>
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-border/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setTruckModalOpen(false)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl font-bold bg-primary text-primary-foreground shadow-md"
                >
                  {editingTruck ? "Save Changes" : "Add Vehicle"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: VIEW BOOKING INVOICE / DETAILS ── */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Order Details & Invoice
                </span>
                <h3 className="font-display text-lg font-bold text-foreground">
                  {selectedBooking.bookingNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 rounded-2xl bg-secondary/40 p-4">
                <div>
                  <span className="text-muted-foreground">Customer Name:</span>
                  <p className="font-bold text-foreground text-sm">
                    {selectedBooking.customerName}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Phone:</span>
                  <p className="font-bold text-foreground text-sm">{selectedBooking.phone}</p>
                </div>
                {selectedBooking.companyName && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Company:</span>
                    <p className="font-semibold text-foreground">{selectedBooking.companyName}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border p-3">
                  <span className="text-muted-foreground">Route Lane:</span>
                  <p className="font-bold text-foreground">
                    {selectedBooking.pickupCity} ➔ {selectedBooking.dropCity}
                  </p>
                  <p className="text-muted-foreground text-[11px]">
                    {selectedBooking.distanceKm} km
                  </p>
                </div>
                <div className="rounded-xl border border-border p-3">
                  <span className="text-muted-foreground">Assigned Truck:</span>
                  <p className="font-bold text-foreground">{selectedBooking.truckName}</p>
                  <p className="text-muted-foreground text-[11px]">
                    Cargo: {selectedBooking.goodsType}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-center justify-between">
                <div>
                  <span className="text-muted-foreground">Total Quoted Amount</span>
                  <p className="text-xs text-muted-foreground">
                    Status: <strong className="text-primary">{selectedBooking.status}</strong>
                  </p>
                </div>
                <span className="font-display text-2xl font-black text-primary">
                  ₹{selectedBooking.totalPrice?.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2.5">
              <Button
                variant="outline"
                onClick={() => setSelectedBooking(null)}
                className="rounded-xl text-xs"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  window.print();
                }}
                className="rounded-xl text-xs font-bold bg-primary text-primary-foreground shadow-sm"
              >
                Print Invoice
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
