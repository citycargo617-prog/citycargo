import { useState, useEffect } from "react";
import { fetchLiveWeather, type WeatherData } from "@/lib/weather";
import { CloudSun } from "lucide-react";

export function HeaderWeatherBadge() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    let city = "Delhi";
    try {
      const cached = sessionStorage.getItem("user_detected_city");
      if (cached) city = cached;
    } catch {
      // ignore
    }

    fetchLiveWeather(city)
      .then((data) => setWeather(data))
      .catch(() => {});

    function handleLocationChanged(e: Event) {
      const customEvent = e as CustomEvent<{ city?: string; lat?: number; lng?: number }>;
      if (customEvent.detail?.city) {
        fetchLiveWeather(customEvent.detail.city, customEvent.detail.lat, customEvent.detail.lng)
          .then((data) => setWeather(data))
          .catch(() => {});
      }
    }

    window.addEventListener("city-location-changed", handleLocationChanged);
    return () => window.removeEventListener("city-location-changed", handleLocationChanged);
  }, []);

  if (!weather) return null;

  function scrollToWeather() {
    const el = document.getElementById("weather-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <button
      type="button"
      onClick={scrollToWeather}
      title="View Live Route Weather Forecast"
      className="hidden items-center gap-2 rounded-full border border-border/80 bg-secondary/60 px-3 py-1.5 text-xs font-semibold text-foreground backdrop-blur-md transition-all hover:bg-secondary hover:border-primary/40 active:scale-95 md:inline-flex"
    >
      <span className="text-sm">{weather.condition.icon}</span>
      <span>{weather.cityName}</span>
      <span className="font-display font-bold text-primary">{weather.temp}°C</span>
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
    </button>
  );
}
