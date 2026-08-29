import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/site/Logo";
import {
  Truck,
  MapPin,
  IndianRupee,
  Fuel,
  FileText,
  Plus,
  Bell,
  LogOut,
  ChevronRight,
  Activity,
  Clock,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/truck-owner/dashboard")({
  head: () => ({
    meta: [
      { title: "Fleet Dashboard — City Cargo" },
      {
        name: "description",
        content:
          "Manage your fleet, track vehicles, and view earnings on City Cargo's fleet owner dashboard.",
      },
    ],
  }),
  component: Dashboard,
});

const mockVehicles = [
  {
    id: "MH-04-AB-1234",
    type: "22ft Container",
    status: "in-transit" as const,
    route: "Mumbai → Pune",
    eta: "2h 15m",
    earnings: 12400,
    fuel: 78,
  },
  {
    id: "MH-04-CD-5678",
    type: "32ft Trailer",
    status: "in-transit" as const,
    route: "Mumbai → Ahmedabad",
    eta: "6h 30m",
    earnings: 28500,
    fuel: 62,
  },
  {
    id: "RJ-14-EF-9012",
    type: "14ft Tempo",
    status: "idle" as const,
    route: "—",
    eta: "—",
    earnings: 0,
    fuel: 95,
  },
  {
    id: "DL-01-GH-3456",
    type: "19ft Open Body",
    status: "active" as const,
    route: "Delhi → Jaipur",
    eta: "3h 45m",
    earnings: 8900,
    fuel: 45,
  },
  {
    id: "GJ-05-IJ-7890",
    type: "Tata Ace",
    status: "idle" as const,
    route: "—",
    eta: "—",
    earnings: 0,
    fuel: 88,
  },
  {
    id: "KA-01-KL-2345",
    type: "24ft Container",
    status: "in-transit" as const,
    route: "Bengaluru → Chennai",
    eta: "4h 10m",
    earnings: 15200,
    fuel: 55,
  },
];

const statusColors = {
  "in-transit": "bg-blue-100 text-blue-700",
  active: "bg-green-100 text-green-700",
  idle: "bg-gray-100 text-gray-500",
};

const statusLabels = {
  "in-transit": "In Transit",
  active: "Active",
  idle: "Idle",
};

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const totalEarnings = mockVehicles.reduce((sum, v) => sum + v.earnings, 0);
  const activeTrips = mockVehicles.filter((v) => v.status !== "idle").length;
  const avgFuel = Math.round(
    mockVehicles.reduce((sum, v) => sum + v.fuel, 0) / mockVehicles.length,
  );

  const sidebarItems = [
    { icon: Activity, label: "Dashboard", active: true },
    { icon: Truck, label: "Vehicles" },
    { icon: Navigation, label: "GPS Tracking" },
    { icon: IndianRupee, label: "Earnings" },
    { icon: Fuel, label: "Fuel Analytics" },
    { icon: FileText, label: "Documents" },
    { icon: Bell, label: "Alerts" },
  ];

  return (
    <div className="flex min-h-screen bg-background font-sans">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} shrink-0 border-r border-border bg-card transition-all duration-300`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-border px-5">
          <Logo
            showText={sidebarOpen}
            className="h-9 w-9"
            textClassName="text-lg text-foreground"
            accentClassName="text-[8px] text-foreground/80"
          />
        </div>

        <nav className="mt-4 px-3 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                item.active
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="mt-auto border-t border-border px-3 py-4">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span>Logout</span>}
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">Fleet Dashboard</h1>
            <p className="text-xs text-muted-foreground">Welcome back, Fleet Owner</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Bell className="mr-2 h-4 w-4" /> Alerts
            </Button>
            <Link to="/buy-gps">
              <Button variant="cta" size="sm">
                <Plus className="mr-2 h-4 w-4" /> Add Vehicle
              </Button>
            </Link>
          </div>
        </div>

        <div className="p-6">
          {/* Summary cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total Vehicles</span>
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-2 font-display text-3xl font-extrabold text-foreground">
                {mockVehicles.length}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{activeTrips} active</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Active Trips</span>
                <Navigation className="h-5 w-5 text-blue-500" />
              </div>
              <p className="mt-2 font-display text-3xl font-extrabold text-foreground">
                {activeTrips}
              </p>
              <p className="mt-1 text-xs text-green-600 font-medium">↑ 2 from yesterday</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Today's Earnings</span>
                <IndianRupee className="h-5 w-5 text-green-500" />
              </div>
              <p className="mt-2 font-display text-3xl font-extrabold text-foreground">
                ₹{totalEarnings.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-green-600 font-medium">↑ 12% vs last week</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Avg Fuel Level</span>
                <Fuel className="h-5 w-5 text-accent" />
              </div>
              <p className="mt-2 font-display text-3xl font-extrabold text-foreground">
                {avgFuel}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Across all vehicles</p>
            </div>
          </div>

          {/* GPS Map placeholder */}
          <div className="mt-6 rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-foreground">Live GPS Tracking</h2>
              <Button variant="outline" size="sm">
                Full Map View
              </Button>
            </div>
            <div className="mt-4 flex h-64 items-center justify-center rounded-xl bg-secondary/60">
              <div className="text-center">
                <MapPin className="mx-auto h-12 w-12 text-primary/40" />
                <p className="mt-3 text-sm font-medium text-muted-foreground">
                  Live map view — {activeTrips} vehicles in transit
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Connect GPS devices to see real-time positions
                </p>
              </div>
            </div>
          </div>

          {/* Vehicle list */}
          <div className="mt-6 rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border p-5">
              <h2 className="font-display text-lg font-bold text-foreground">Your Vehicles</h2>
              <Button variant="soft" size="sm">
                View All
              </Button>
            </div>
            <div className="divide-y divide-border">
              {mockVehicles.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Truck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-foreground">{v.id}</p>
                      <p className="text-xs text-muted-foreground">{v.type}</p>
                    </div>
                  </div>
                  <div className="hidden items-center gap-6 sm:flex">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{v.route}</p>
                      {v.status !== "idle" && (
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" /> ETA: {v.eta}
                        </p>
                      )}
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${statusColors[v.status]}`}
                    >
                      {statusLabels[v.status]}
                    </span>
                    {v.earnings > 0 && (
                      <span className="text-sm font-bold text-green-600">
                        ₹{v.earnings.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
