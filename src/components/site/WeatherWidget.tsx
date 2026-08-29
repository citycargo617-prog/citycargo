import { useState, useEffect, useCallback, useRef } from "react";
import {
  CloudSun,
  Wind,
  Droplets,
  Eye,
  Umbrella,
  LocateFixed,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Search,
  ShieldCheck,
  RefreshCw,
  MapPin,
} from "lucide-react";
import { fetchLiveWeather, type WeatherData } from "@/lib/weather";
import { detectUserCity } from "@/lib/location";
import { WeatherAnimation } from "@/components/site/WeatherAnimation";
import { searchCities, type City } from "@/lib/data/cities";
import { toast } from "sonner";

interface WeatherWidgetProps {
  city?: string;
  onCityChange?: (city: string) => void;
  className?: string;
}

const quickHubs = [
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Chennai",
  "Kolkata",
  "Jaipur",
  "Hyderabad",
  "Pune",
];

export function WeatherWidget({
  city: externalCity,
  onCityChange,
  className = "",
}: WeatherWidgetProps) {
  const [activeCity, setActiveCity] = useState(externalCity || "Delhi");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);

  // In-widget search box state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadWeather = useCallback(async (cityName: string, lat?: number, lng?: number) => {
    if (!cityName.trim()) return;
    setLoading(true);
    try {
      const data = await fetchLiveWeather(cityName, lat, lng);
      setWeather(data);
      setActiveCity(data.cityName);
    } catch {
      toast.error(`Unable to load weather for ${cityName}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // 1. React immediately when external city changes (from hero "Enter your loading city" input)
  useEffect(() => {
    if (externalCity && externalCity.trim()) {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        loadWeather(externalCity);
      }, 300);
    }
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [externalCity, loadWeather]);

  // 2. Listen to global "city-location-changed" event (GPS auto-detection or typing)
  useEffect(() => {
    function handleLocationChanged(e: Event) {
      const customEvent = e as CustomEvent<{ city?: string; lat?: number; lng?: number }>;
      if (customEvent.detail?.city) {
        loadWeather(customEvent.detail.city, customEvent.detail.lat, customEvent.detail.lng);
      }
    }

    window.addEventListener("city-location-changed", handleLocationChanged);
    return () => window.removeEventListener("city-location-changed", handleLocationChanged);
  }, [loadWeather]);

  // 3. Initial mount check: check cached detected location or default city
  useEffect(() => {
    if (externalCity) return; // already handled by externalCity effect
    let target = "Delhi";
    try {
      const cached = sessionStorage.getItem("user_detected_city");
      if (cached) target = cached;
    } catch {
      // ignore
    }
    loadWeather(target);
  }, [externalCity, loadWeather]);

  // Handle clicking outside search dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleAutoLocate() {
    setLocating(true);
    try {
      const loc = await detectUserCity();
      if (loc?.cityName) {
        toast.success(`Weather updated for your live location: ${loc.cityName}!`);
        onCityChange?.(loc.cityName);
        try {
          sessionStorage.setItem("user_detected_city", loc.cityName);
        } catch {
          // ignore
        }
        window.dispatchEvent(
          new CustomEvent("city-location-changed", {
            detail: { city: loc.cityName, lat: loc.lat, lng: loc.lng },
          }),
        );
        await loadWeather(loc.cityName, loc.lat, loc.lng);
      }
    } catch {
      toast.error("Location permission denied. Please search city manually.");
    } finally {
      setLocating(false);
    }
  }

  function handleSelectCity(cityName: string, lat?: number, lng?: number) {
    setActiveCity(cityName);
    setSearchQuery("");
    setSearchOpen(false);
    onCityChange?.(cityName);
    try {
      sessionStorage.setItem("user_detected_city", cityName);
    } catch {
      // ignore
    }
    window.dispatchEvent(
      new CustomEvent("city-location-changed", { detail: { city: cityName, lat, lng } }),
    );
    loadWeather(cityName, lat, lng);
  }

  const condition = weather?.condition;
  const isOptimal = condition?.advisoryLevel === "optimal";
  const isModerate = condition?.advisoryLevel === "moderate";

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-border/70 bg-card/80 p-6 md:p-8 shadow-2xl backdrop-blur-2xl transition-all ${className}`}
    >
      {/* Dynamic Ambient Background Glow based on current weather condition */}
      <div
        className={`pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-gradient-to-br ${
          condition?.gradient || "from-primary/20 to-accent/20"
        } opacity-60 blur-3xl transition-all duration-700`}
      />

      {/* Top Header Section */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CloudSun className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Live Logistics Weather Intelligence
            </span>
          </div>
          <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            Route & Transit Weather Forecast
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Auto-synced with your selected loading city & GPS location
          </p>
        </div>

        {/* Action Controls: Direct Search & GPS Locate */}
        <div className="flex items-center gap-2.5">
          {/* Quick City Search Field */}
          <div ref={searchRef} className="relative">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search any city..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  const matches = searchCities(e.target.value);
                  setSearchResults(matches);
                  setSearchOpen(matches.length > 0);
                }}
                onFocus={() => {
                  if (searchQuery) setSearchOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    handleSelectCity(searchQuery.trim());
                  }
                }}
                className="h-9 w-40 sm:w-48 rounded-xl border border-border bg-background/80 pl-8 pr-3 text-xs font-medium text-foreground outline-none transition-all focus:w-56 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Auto-suggest dropdown */}
            {searchOpen && searchResults.length > 0 && (
              <div className="absolute right-0 top-full z-50 mt-1 max-h-56 w-56 overflow-auto rounded-xl border border-border bg-card p-1 shadow-xl">
                {searchResults.slice(0, 6).map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => handleSelectCity(c.name, c.lat, c.lng)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] text-muted-foreground">{c.state}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Locate Me GPS Button */}
          <button
            type="button"
            onClick={handleAutoLocate}
            disabled={locating}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/80 px-3.5 py-2 text-xs font-bold text-foreground transition-all hover:bg-primary hover:text-primary-foreground active:scale-95 disabled:opacity-50"
            title="Auto-detect weather from GPS"
          >
            {locating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <LocateFixed className="h-3.5 w-3.5 text-accent" />
            )}
            <span className="hidden sm:inline">Locate Me</span>
          </button>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => loadWeather(activeCity)}
            disabled={loading}
            title="Refresh live weather"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-secondary/80 text-muted-foreground transition-all hover:text-foreground active:scale-95"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-primary" : ""}`} />
          </button>
        </div>
      </div>

      {/* Quick Major Logistics Hub Pills */}
      <div className="relative z-10 mt-4 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-semibold text-muted-foreground shrink-0 pr-1 flex items-center gap-1">
          <MapPin className="h-3 w-3 text-accent" />
          Hubs:
        </span>
        {quickHubs.map((hub) => {
          const isSelected = activeCity.toLowerCase() === hub.toLowerCase();
          return (
            <button
              key={hub}
              type="button"
              onClick={() => handleSelectCity(hub)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm scale-105 font-bold"
                  : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {hub}
            </button>
          );
        })}
      </div>

      {/* Main Weather Showcase */}
      {weather ? (
        <div className="relative z-10 mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Big Temperature, Dynamic Visual Animation, Road Advisory */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-background/50 p-6 backdrop-blur-md lg:col-span-7">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-display text-2xl font-black text-foreground">
                    {weather.cityName}
                  </h4>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    Live GPS Radar
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Updated {weather.updatedAt} · Real-time transit telemetry
                </p>
              </div>

              {/* Animated Weather Graphic */}
              <WeatherAnimation condition={weather.condition} isDay={weather.isDay} size="md" />
            </div>

            {/* Temperature & Condition Text */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-display text-5xl font-black tracking-tight text-foreground md:text-6xl">
                {weather.temp}°C
              </span>
              <div>
                <p className="text-base font-bold text-foreground">{weather.condition.label}</p>
                <p className="text-xs text-muted-foreground">Feels like {weather.feelsLike}°C</p>
              </div>
            </div>

            {/* Transit Road Advisory Banner */}
            <div
              className={`mt-5 flex items-center gap-3 rounded-xl border p-3.5 ${
                isOptimal
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200"
                  : isModerate
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-200"
                    : "border-red-500/30 bg-red-500/10 text-red-950 dark:text-red-200"
              }`}
            >
              {isOptimal ? (
                <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              ) : isModerate ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              ) : (
                <AlertTriangle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
              )}
              <div className="text-xs">
                <span className="font-bold">Freight Transit Status: </span>
                <span className="font-medium">{weather.condition.advisory}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Metrics & 3-Day Forecast */}
          <div className="flex flex-col justify-between gap-4 lg:col-span-5">
            {/* 4 Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border/50 bg-background/50 p-3.5 backdrop-blur-md">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Wind className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold">Wind Speed</span>
                </div>
                <p className="mt-1.5 font-display text-lg font-bold text-foreground">
                  {weather.windSpeed}{" "}
                  <span className="text-xs font-normal text-muted-foreground">km/h</span>
                </p>
              </div>

              <div className="rounded-2xl border border-border/50 bg-background/50 p-3.5 backdrop-blur-md">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Droplets className="h-4 w-4 text-cyan-500" />
                  <span className="text-xs font-semibold">Humidity</span>
                </div>
                <p className="mt-1.5 font-display text-lg font-bold text-foreground">
                  {weather.humidity}%
                </p>
              </div>

              <div className="rounded-2xl border border-border/50 bg-background/50 p-3.5 backdrop-blur-md">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-semibold">Visibility</span>
                </div>
                <p className="mt-1.5 font-display text-lg font-bold text-foreground">
                  {weather.visibility}+{" "}
                  <span className="text-xs font-normal text-muted-foreground">km</span>
                </p>
              </div>

              <div className="rounded-2xl border border-border/50 bg-background/50 p-3.5 backdrop-blur-md">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Umbrella className="h-4 w-4 text-blue-500" />
                  <span className="text-xs font-semibold">Precipitation</span>
                </div>
                <p className="mt-1.5 font-display text-lg font-bold text-foreground">
                  {weather.precipitation}{" "}
                  <span className="text-xs font-normal text-muted-foreground">mm</span>
                </p>
              </div>
            </div>

            {/* 3-Day Transit Forecast Mini-Cards */}
            <div className="rounded-2xl border border-border/50 bg-background/50 p-4 backdrop-blur-md">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                3-Day Transit Outlook
              </p>
              <div className="space-y-2">
                {weather.forecast.slice(0, 3).map((f) => (
                  <div
                    key={f.dayName}
                    className="flex items-center justify-between rounded-xl bg-secondary/40 px-3 py-2 text-xs transition-colors hover:bg-secondary"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{f.condition.icon}</span>
                      <span className="font-semibold text-foreground">{f.dayName}</span>
                      <span className="text-muted-foreground hidden sm:inline">
                        · {f.condition.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-display font-bold">
                      <span className="text-foreground">{f.tempMax}°</span>
                      <span className="text-muted-foreground font-normal">{f.tempMin}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 mt-6 flex h-48 items-center justify-center rounded-2xl border border-border/50 bg-background/50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}
