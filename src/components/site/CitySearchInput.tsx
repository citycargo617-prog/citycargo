import { useState, useRef, useEffect, useCallback } from "react";
import { MapPin, LocateFixed, Loader2, Navigation } from "lucide-react";
import { searchCities, type City } from "@/lib/data/cities";
import { detectUserCity } from "@/lib/location";
import { toast } from "sonner";

interface CitySearchInputProps {
  placeholder: string;
  value: string;
  onChange: (city: string) => void;
  icon?: "pickup" | "drop";
  className?: string;
  enableAutoLocation?: boolean;
  autoFetchOnMount?: boolean;
}

export function CitySearchInput({
  placeholder,
  value,
  onChange,
  icon = "pickup",
  className = "",
  enableAutoLocation = icon === "pickup",
  autoFetchOnMount = icon === "pickup",
}: CitySearchInputProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<City[]>([]);
  const [open, setOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hasAutoFetchedRef = useRef(false);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDetectLocation = useCallback(
    async (isManualClick = true) => {
      if (typeof window === "undefined" || !("geolocation" in navigator)) {
        if (isManualClick) {
          toast.error("Geolocation is not supported by your browser");
        }
        return;
      }

      setIsLocating(true);
      try {
        const { cityName } = await detectUserCity();
        if (cityName) {
          setQuery(cityName);
          onChange(cityName);
          setOpen(false);
          try {
            sessionStorage.setItem("user_detected_city", cityName);
          } catch {
            // ignore
          }
          window.dispatchEvent(
            new CustomEvent("city-location-changed", { detail: { city: cityName } }),
          );
          if (isManualClick) {
            toast.success(`Location detected: ${cityName}`, {
              description: "Pickup location set to your current city.",
            });
          }
        }
      } catch (err: unknown) {
        if (isManualClick) {
          const error = err as { code?: number; message?: string };
          if (error.code === 1) {
            toast.error("Location permission denied", {
              description:
                "Please allow location access in your browser settings to auto-fill your city.",
            });
          } else {
            toast.error("Could not fetch location", {
              description: "Please search and select your city manually.",
            });
          }
        }
      } finally {
        setIsLocating(false);
      }
    },
    [onChange],
  );

  // Auto-fetch location on initial mount if configured and input is empty
  useEffect(() => {
    if (!autoFetchOnMount || value || hasAutoFetchedRef.current) return;
    hasAutoFetchedRef.current = true;

    // Check cached session first for instantaneous fill
    try {
      const cached = sessionStorage.getItem("user_detected_city");
      if (cached) {
        setQuery(cached);
        onChange(cached);
        window.dispatchEvent(
          new CustomEvent("city-location-changed", { detail: { city: cached } }),
        );
        return;
      }
    } catch {
      // Ignore sessionStorage issues
    }

    // Trigger browser location prompt & auto-fill
    handleDetectLocation(false);
  }, [autoFetchOnMount, value, onChange, handleDetectLocation]);

  function handleInput(val: string) {
    setQuery(val);
    onChange(val);
    const matches = searchCities(val);
    setResults(matches);
    setOpen(matches.length > 0 || (enableAutoLocation && !val));

    if (val.trim().length >= 2) {
      window.dispatchEvent(
        new CustomEvent("city-location-changed", { detail: { city: val.trim() } }),
      );
    }
  }

  function handleSelect(city: City) {
    setQuery(city.name);
    onChange(city.name);
    setOpen(false);
    try {
      sessionStorage.setItem("user_detected_city", city.name);
    } catch {
      // ignore
    }
    window.dispatchEvent(
      new CustomEvent("city-location-changed", {
        detail: { city: city.name, lat: city.lat, lng: city.lng },
      }),
    );
  }

  const iconColor = icon === "pickup" ? "bg-green-500" : "bg-red-500";

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative flex items-center">
        {/* Left Indicator Icon */}
        <span
          className={`absolute left-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md ${iconColor} pointer-events-none z-10`}
        >
          <MapPin className="h-3.5 w-3.5 text-white" />
        </span>

        {/* City Input Field */}
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => {
            if (results.length > 0 || enableAutoLocation) setOpen(true);
          }}
          className={`h-12 w-full rounded-xl border border-input bg-background pl-12 ${
            enableAutoLocation ? "pr-12" : "pr-4"
          } text-sm font-medium text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20`}
        />

        {/* Right Auto-Detect Location Button */}
        {enableAutoLocation && (
          <button
            type="button"
            title="Use my current location"
            onClick={() => handleDetectLocation(true)}
            disabled={isLocating}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-primary transition-all active:scale-95 disabled:opacity-60"
          >
            {isLocating ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <LocateFixed className="h-4 w-4 text-primary hover:scale-110 transition-transform" />
            )}
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-border bg-card p-1.5 shadow-[var(--shadow-elevated)]">
          {/* Quick Detect Location Row in Dropdown */}
          {enableAutoLocation && (
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-primary transition-colors hover:bg-primary/10 border-b border-border/50 mb-1"
              onClick={() => handleDetectLocation(true)}
            >
              {isLocating ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4 shrink-0 fill-primary/20" />
              )}
              <div>
                <p className="text-sm font-bold text-primary">Use Current Location</p>
                <p className="text-xs text-muted-foreground">Auto-detect city via GPS</p>
              </div>
            </button>
          )}

          {/* Search Result Items */}
          {results.map((city) => (
            <button
              key={city.name}
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-secondary"
              onClick={() => handleSelect(city)}
            >
              <MapPin className="h-4 w-4 shrink-0 text-accent" />
              <div>
                <p className="text-sm font-semibold text-foreground">{city.name}</p>
                <p className="text-xs text-muted-foreground">
                  {city.state} · {city.pincode}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
