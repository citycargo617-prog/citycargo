import { useState, useEffect, useCallback } from "react";
import { truckTypes as defaultTrucks, type TruckType as BaseTruckType } from "@/lib/data/trucks";
import { popularRoutes as defaultRoutes, type RouteInfo as BaseRouteInfo } from "@/lib/data/routes";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface TruckItem extends BaseTruckType {
  baseCharge?: number;
  active?: boolean;
}

export interface RouteItem extends BaseRouteInfo {
  id?: string;
  active?: boolean;
}

export interface AdminBooking {
  id: string;
  bookingNumber: string;
  customerName: string;
  phone: string;
  companyName?: string;
  pickupCity: string;
  dropCity: string;
  goodsType: string;
  truckTypeId: string;
  truckName: string;
  loadingDate: string;
  distanceKm: number;
  totalPrice: number;
  status: "Pending" | "Confirmed" | "Dispatched" | "In-Transit" | "Delivered" | "Cancelled";
  createdAt: string;
  instructions?: string;
  insuranceOptIn?: boolean;
}

export interface PricingSettings {
  baseBookingCharge: number;
  gstPercent: number;
  fuelSurchargePercent: number;
  insurancePercent: number;
}

export interface BannerSettings {
  promoTagline: string;
  promoTitle: string;
  promoSubtitle: string;
  referralOffer: string;
  announcementText: string;
  showAnnouncement: boolean;
}

// Per-route price override for each truck type
export interface RoutePricingEntry {
  from: string;
  to: string;
  truckTypeId: string;
  basePrice: number;       // Admin-set base price (before discount)
  discountPercent: number; // e.g. 5 = 5% off
}

const STORAGE_KEYS = {
  TRUCKS: "ccc_admin_trucks",
  ROUTES: "ccc_admin_routes",
  BOOKINGS: "ccc_admin_bookings",
  PRICING: "ccc_admin_pricing",
  BANNER: "ccc_admin_banner",
  ADMIN_AUTH: "ccc_admin_session",
  ROUTE_PRICING: "ccc_admin_route_pricing",
};

const DEFAULT_PRICING: PricingSettings = {
  baseBookingCharge: 500,
  gstPercent: 18,
  fuelSurchargePercent: 0,
  insurancePercent: 1.5,
};

const DEFAULT_BANNER: BannerSettings = {
  promoTagline: "India ka #1 Truck Booking Platform",
  promoTitle: "Book a truck in under 5 minutes",
  promoSubtitle: "Trusted by 50,000+ Businesses Across India",
  referralOffer: "Refer and earn upto ₹5,000",
  announcementText: "🚚 High freight capacity available across North-South corridors with instant tracking",
  showAnnouncement: true,
};

const INITIAL_DEMO_BOOKINGS: AdminBooking[] = [
  {
    id: "bk-101",
    bookingNumber: "CC-ND-8941",
    customerName: "Rajesh Sharma",
    phone: "9876543210",
    companyName: "Sharma Logistics Ltd",
    pickupCity: "Delhi",
    dropCity: "Mumbai",
    goodsType: "FMCG / Consumer Goods",
    truckTypeId: "22ft-container",
    truckName: "22ft Closed Container",
    loadingDate: "2026-08-04",
    distanceKm: 1400,
    totalPrice: 48100,
    status: "Confirmed",
    createdAt: "2026-08-01 14:20",
    insuranceOptIn: true,
  },
  {
    id: "bk-102",
    bookingNumber: "CC-MB-7214",
    customerName: "Vikram Mehta",
    phone: "9822334455",
    companyName: "Mehta Auto Components",
    pickupCity: "Mumbai",
    dropCity: "Pune",
    goodsType: "Auto Parts",
    truckTypeId: "bolero-pickup",
    truckName: "Bolero Pickup",
    loadingDate: "2026-08-03",
    distanceKm: 150,
    totalPrice: 2900,
    status: "In-Transit",
    createdAt: "2026-08-01 18:05",
    insuranceOptIn: false,
  },
  {
    id: "bk-103",
    bookingNumber: "CC-BL-3902",
    customerName: "Ananya Iyer",
    phone: "9741238901",
    companyName: "Apex Textiles",
    pickupCity: "Bengaluru",
    dropCity: "Chennai",
    goodsType: "Textiles / Garments",
    truckTypeId: "14ft-tempo",
    truckName: "14ft Closed Container",
    loadingDate: "2026-08-05",
    distanceKm: 350,
    totalPrice: 7500,
    status: "Pending",
    createdAt: "2026-08-02 08:30",
    insuranceOptIn: true,
  },
];

// Helper to broadcast changes
function broadcastUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("admin-data-updated"));
  }
}

// ── GETTERS ──────────────────────────────────────────
export function getStoredTrucks(): TruckItem[] {
  if (typeof window === "undefined") return defaultTrucks.map((t) => ({ ...t, active: true }));
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRUCKS);
    if (raw) return JSON.parse(raw);
  } catch {}
  const initial = defaultTrucks.map((t) => ({ ...t, active: true }));
  try {
    localStorage.setItem(STORAGE_KEYS.TRUCKS, JSON.stringify(initial));
  } catch {}
  return initial;
}

export function getStoredRoutes(): RouteItem[] {
  if (typeof window === "undefined") return defaultRoutes.map((r) => ({ ...r, active: true }));
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ROUTES);
    if (raw) return JSON.parse(raw);
  } catch {}
  const initial = defaultRoutes.map((r, i) => ({
    ...r,
    id: `route-${i + 1}`,
    active: true,
  }));
  try {
    localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(initial));
  } catch {}
  return initial;
}

export function getStoredBookings(): AdminBooking[] {
  if (typeof window === "undefined") return INITIAL_DEMO_BOOKINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (raw) return JSON.parse(raw);
  } catch {}
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_DEMO_BOOKINGS));
  } catch {}
  return INITIAL_DEMO_BOOKINGS;
}

export function getStoredPricing(): PricingSettings {
  if (typeof window === "undefined") return DEFAULT_PRICING;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRICING);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_PRICING;
}

export function getStoredBanner(): BannerSettings {
  if (typeof window === "undefined") return DEFAULT_BANNER;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BANNER);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_BANNER;
}

export function getStoredRoutePricing(): RoutePricingEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ROUTE_PRICING);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function saveRoutePricingEntries(entries: RoutePricingEntry[]): RoutePricingEntry[] {
  localStorage.setItem(STORAGE_KEYS.ROUTE_PRICING, JSON.stringify(entries));
  broadcastUpdate();
  return entries;
}

export function upsertRoutePricingEntry(entry: RoutePricingEntry): RoutePricingEntry[] {
  const all = getStoredRoutePricing();
  const idx = all.findIndex(
    (e) =>
      e.from.toLowerCase() === entry.from.toLowerCase() &&
      e.to.toLowerCase() === entry.to.toLowerCase() &&
      e.truckTypeId === entry.truckTypeId
  );
  if (idx >= 0) {
    all[idx] = entry;
  } else {
    all.push(entry);
  }
  return saveRoutePricingEntries(all);
}

export function deleteRoutePricingEntry(from: string, to: string, truckTypeId: string): RoutePricingEntry[] {
  const filtered = getStoredRoutePricing().filter(
    (e) =>
      !(e.from.toLowerCase() === from.toLowerCase() &&
        e.to.toLowerCase() === to.toLowerCase() &&
        e.truckTypeId === truckTypeId)
  );
  return saveRoutePricingEntries(filtered);
}

/** Returns route-specific price for a truck, or null if none set */
export function getRoutePrice(
  from: string,
  to: string,
  truckTypeId: string
): RoutePricingEntry | null {
  const all = getStoredRoutePricing();
  return (
    all.find(
      (e) =>
        ((e.from.toLowerCase() === from.toLowerCase() &&
          e.to.toLowerCase() === to.toLowerCase()) ||
          (e.from.toLowerCase() === to.toLowerCase() &&
            e.to.toLowerCase() === from.toLowerCase())) &&
        e.truckTypeId === truckTypeId
    ) ?? null
  );
}

// ── TRUCK MUTATIONS ──────────────────────────────────
export function addTruck(newTruck: Omit<TruckItem, "id"> & { id?: string }): TruckItem {
  const trucks = getStoredTrucks();
  const id = newTruck.id || `truck-${Date.now().toString(36)}`;
  const item: TruckItem = {
    ...newTruck,
    id,
    active: newTruck.active !== false,
  };
  trucks.unshift(item);
  localStorage.setItem(STORAGE_KEYS.TRUCKS, JSON.stringify(trucks));
  broadcastUpdate();

  if (isSupabaseConfigured) {
    supabase
      .from("trucks")
      .upsert({
        id: item.id,
        name: item.name,
        category: item.category || "General",
        tonnage_min: item.tonnageMin,
        tonnage_max: item.tonnageMax,
        length_ft: item.lengthFt,
        price_per_km: item.pricePerKm,
        base_charge: item.baseCharge || 500,
        description: item.description,
        popular: item.popular || false,
        is_active: item.active !== false,
      })
      .then(
        ({ error }) => {
          if (error) console.warn("Supabase truck upsert error:", error.message);
        },
        (err: unknown) => console.warn("Supabase error:", err)
      );
  }

  return item;
}

export function updateTruck(id: string, updates: Partial<TruckItem>): boolean {
  const trucks = getStoredTrucks();
  const idx = trucks.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  trucks[idx] = { ...trucks[idx], ...updates };
  localStorage.setItem(STORAGE_KEYS.TRUCKS, JSON.stringify(trucks));
  broadcastUpdate();

  if (isSupabaseConfigured) {
    const updated = trucks[idx];
    supabase
      .from("trucks")
      .update({
        name: updated.name,
        category: updated.category,
        tonnage_min: updated.tonnageMin,
        tonnage_max: updated.tonnageMax,
        length_ft: updated.lengthFt,
        price_per_km: updated.pricePerKm,
        base_charge: updated.baseCharge,
        description: updated.description,
        popular: updated.popular,
        is_active: updated.active,
      })
      .eq("id", id)
      .then(
        ({ error }) => {
          if (error) console.warn("Supabase truck update error:", error.message);
        },
        (err: unknown) => console.warn("Supabase error:", err)
      );
  }

  return true;
}

export function deleteTruck(id: string): boolean {
  const trucks = getStoredTrucks().filter((t) => t.id !== id);
  localStorage.setItem(STORAGE_KEYS.TRUCKS, JSON.stringify(trucks));
  broadcastUpdate();

  if (isSupabaseConfigured) {
    supabase
      .from("trucks")
      .delete()
      .eq("id", id)
      .then(
        ({ error }) => {
          if (error) console.warn("Supabase truck delete error:", error.message);
        },
        (err: unknown) => console.warn("Supabase error:", err)
      );
  }

  return true;
}

// ── ROUTE MUTATIONS ──────────────────────────────────
export function addRoute(newRoute: Omit<RouteItem, "id">): RouteItem {
  const routes = getStoredRoutes();
  const id = `route-${Date.now().toString(36)}`;
  const item: RouteItem = { ...newRoute, id, active: true };
  routes.unshift(item);
  localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(routes));
  broadcastUpdate();

  if (isSupabaseConfigured) {
    supabase
      .from("routes")
      .upsert({
        id: item.id,
        from_city: item.from,
        to_city: item.to,
        distance_km: item.distanceKm,
        estimated_hours: item.estimatedHours,
      })
      .then(
        ({ error }) => {
          if (error) console.warn("Supabase route upsert error:", error.message);
        },
        (err: unknown) => console.warn("Supabase error:", err)
      );
  }

  return item;
}

export function updateRoute(id: string, updates: Partial<RouteItem>): boolean {
  const routes = getStoredRoutes();
  const idx = routes.findIndex((r) => r.id === id || (r.from === updates.from && r.to === updates.to));
  if (idx === -1) return false;
  routes[idx] = { ...routes[idx], ...updates };
  localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(routes));
  broadcastUpdate();

  if (isSupabaseConfigured) {
    const updated = routes[idx];
    supabase
      .from("routes")
      .update({
        from_city: updated.from,
        to_city: updated.to,
        distance_km: updated.distanceKm,
        estimated_hours: updated.estimatedHours,
      })
      .eq("id", updated.id || id)
      .then(
        ({ error }) => {
          if (error) console.warn("Supabase route update error:", error.message);
        },
        (err: unknown) => console.warn("Supabase error:", err)
      );
  }

  return true;
}

export function deleteRoute(id: string): boolean {
  const routes = getStoredRoutes().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(routes));
  broadcastUpdate();

  if (isSupabaseConfigured) {
    supabase
      .from("routes")
      .delete()
      .eq("id", id)
      .then(
        ({ error }) => {
          if (error) console.warn("Supabase route delete error:", error.message);
        },
        (err: unknown) => console.warn("Supabase error:", err)
      );
  }

  return true;
}

// ── BOOKING MUTATIONS ────────────────────────────────
export function addBookingOrder(booking: Omit<AdminBooking, "id" | "bookingNumber" | "createdAt">): AdminBooking {
  const bookings = getStoredBookings();
  const id = `bk-${Date.now()}`;
  const bookingNumber = `CC-${booking.pickupCity.slice(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const item: AdminBooking = {
    ...booking,
    id,
    bookingNumber,
    createdAt: new Date().toISOString().replace("T", " ").slice(0, 16),
  };
  bookings.unshift(item);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  broadcastUpdate();

  // Async push to Supabase if configured
  if (isSupabaseConfigured) {
    supabase
      .from("bookings")
      .insert({
        booking_number: item.bookingNumber,
        customer_name: item.customerName,
        phone: item.phone,
        company_name: item.companyName,
        pickup_city: item.pickupCity,
        drop_city: item.dropCity,
        goods_type: item.goodsType,
        truck_type_id: item.truckTypeId,
        truck_name: item.truckName,
        loading_date: item.loadingDate,
        distance_km: item.distanceKm,
        total_price: item.totalPrice,
        status: item.status,
        instructions: item.instructions,
        insurance_opt_in: item.insuranceOptIn || false,
      })
      .then(
        ({ error }) => {
          if (error) console.warn("Supabase booking insert warning:", error.message);
        },
        (err: unknown) => console.warn("Supabase sync error:", err)
      );
  }

  return item;
}

export function updateBookingStatus(id: string, status: AdminBooking["status"]): boolean {
  const bookings = getStoredBookings();
  const idx = bookings.findIndex((b) => b.id === id || b.bookingNumber === id);
  if (idx === -1) return false;
  bookings[idx].status = status;
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  broadcastUpdate();

  if (isSupabaseConfigured) {
    const target = bookings[idx];
    supabase
      .from("bookings")
      .update({ status })
      .eq("booking_number", target.bookingNumber)
      .then(
        ({ error }) => {
          if (error) console.warn("Supabase status update warning:", error.message);
        },
        (err: unknown) => console.warn("Supabase sync error:", err)
      );
  }

  return true;
}

export function deleteBooking(id: string): boolean {
  const bookings = getStoredBookings().filter((b) => b.id !== id && b.bookingNumber !== id);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  broadcastUpdate();

  if (isSupabaseConfigured) {
    supabase
      .from("bookings")
      .delete()
      .or(`id.eq.${id},booking_number.eq.${id}`)
      .then(
        ({ error }) => {
          if (error) console.warn("Supabase booking delete warning:", error.message);
        },
        (err: unknown) => console.warn("Supabase delete error:", err)
      );
  }

  return true;
}

// ── SETTINGS MUTATIONS ───────────────────────────────
export function savePricingSettings(settings: Partial<PricingSettings>): PricingSettings {
  const current = getStoredPricing();
  const updated = { ...current, ...settings };
  localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(updated));
  broadcastUpdate();
  return updated;
}

export function saveBannerSettings(settings: Partial<BannerSettings>): BannerSettings {
  const current = getStoredBanner();
  const updated = { ...current, ...settings };
  localStorage.setItem(STORAGE_KEYS.BANNER, JSON.stringify(updated));
  broadcastUpdate();
  return updated;
}

export function resetAllDataToDefaults() {
  localStorage.removeItem(STORAGE_KEYS.TRUCKS);
  localStorage.removeItem(STORAGE_KEYS.ROUTES);
  localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
  localStorage.removeItem(STORAGE_KEYS.PRICING);
  localStorage.removeItem(STORAGE_KEYS.BANNER);
  localStorage.removeItem(STORAGE_KEYS.ROUTE_PRICING);
  broadcastUpdate();
}

// ── DYNAMIC PRICING CALCULATOR ────────────────────────
export function calculateDynamicPrice(
  distanceKm: number,
  pricePerKm: number,
  customBaseCharge?: number,
  insuranceOptIn?: boolean,
): {
  baseFare: number;
  distanceCharge: number;
  subtotal: number;
  insuranceCharge: number;
  gstAmount: number;
  total: number;
} {
  const pricing = getStoredPricing();
  const baseFare = customBaseCharge !== undefined ? customBaseCharge : pricing.baseBookingCharge;
  const distanceCharge = distanceKm * pricePerKm;
  const subtotal = baseFare + distanceCharge;
  const insuranceCharge = insuranceOptIn ? Math.round(subtotal * (pricing.insurancePercent / 100)) : 0;
  const taxableAmount = subtotal + insuranceCharge;
  const gstAmount = Math.round(taxableAmount * (pricing.gstPercent / 100));
  const total = taxableAmount + gstAmount;

  return {
    baseFare,
    distanceCharge,
    subtotal,
    insuranceCharge,
    gstAmount,
    total,
  };
}

// ── ADMIN AUTHENTICATION ─────────────────────────────
export interface AdminSession {
  email: string;
  role: "superadmin" | "manager";
  name: string;
  loggedAt: number;
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const session = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
    if (!session) return false;
    const parsed: AdminSession = JSON.parse(session);
    // 24 hour session validity
    return Date.now() - parsed.loggedAt < 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function loginAdmin(identifier: string, passOrPin: string): boolean {
  const validEmail = "admin@citycargo.in";
  const validPass = "admin123";
  const validPin = "8888";

  const isEmailMatch = identifier.toLowerCase().trim() === validEmail;
  const isPassMatch = passOrPin === validPass || passOrPin === validPin;
  const isDirectPin = identifier === validPin || passOrPin === validPin;

  if ((isEmailMatch && isPassMatch) || isDirectPin) {
    const session: AdminSession = {
      email: validEmail,
      role: "superadmin",
      name: "Fleet Director",
      loggedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(session));
    return true;
  }
  return false;
}

export function logoutAdmin() {
  localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
}

// ── REACT HOOK FOR REALTIME DATA CONSUMPTION ─────────
export function useAdminData() {
  const [trucks, setTrucks] = useState<TruckItem[]>(getStoredTrucks());
  const [routes, setRoutes] = useState<RouteItem[]>(getStoredRoutes());
  const [bookings, setBookings] = useState<AdminBooking[]>(getStoredBookings());
  const [pricing, setPricing] = useState<PricingSettings>(getStoredPricing());
  const [banner, setBanner] = useState<BannerSettings>(getStoredBanner());
  const [routePricing, setRoutePricing] = useState<RoutePricingEntry[]>(getStoredRoutePricing());

  const refresh = useCallback(() => {
    setTrucks(getStoredTrucks());
    setRoutes(getStoredRoutes());
    setBookings(getStoredBookings());
    setPricing(getStoredPricing());
    setBanner(getStoredBanner());
    setRoutePricing(getStoredRoutePricing());
  }, []);

  useEffect(() => {
    refresh();

    function handleUpdate() {
      refresh();
    }

    window.addEventListener("admin-data-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("admin-data-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [refresh]);

  const activeTrucks = trucks.filter((t) => t.active !== false);
  const activeRoutes = routes.filter((r) => r.active !== false);

  const findRouteDynamic = useCallback(
    (from: string, to: string): RouteItem | undefined => {
      const cleanFrom = from.trim().toLowerCase();
      const cleanTo = to.trim().toLowerCase();
      if (!cleanFrom || !cleanTo) return undefined;

      return routes.find(
        (r) =>
          (r.from.toLowerCase() === cleanFrom && r.to.toLowerCase() === cleanTo) ||
          (r.from.toLowerCase() === cleanTo && r.to.toLowerCase() === cleanFrom),
      );
    },
    [routes],
  );

  return {
    trucks,
    activeTrucks,
    routes,
    activeRoutes,
    bookings,
    pricing,
    banner,
    routePricing,
    refresh,
    findRouteDynamic,
  };
}
