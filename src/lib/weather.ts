import { cities, type City } from "./data/cities";
import { getNearestCity } from "./location";

export interface WeatherConditionInfo {
  label: string;
  category: "clear" | "clouds" | "rain" | "thunderstorm" | "fog" | "snow";
  icon: string;
  advisory: string;
  advisoryLevel: "optimal" | "moderate" | "caution";
  gradient: string;
}

export interface DayForecast {
  dayName: string;
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  condition: WeatherConditionInfo;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  weatherCode: number;
}

export interface WeatherData {
  cityName: string;
  state?: string;
  lat: number;
  lng: number;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  precipitation: number;
  isDay: boolean;
  weatherCode: number;
  condition: WeatherConditionInfo;
  forecast: DayForecast[];
  hourly: HourlyForecast[];
  updatedAt: string;
}

export function parseWeatherCode(code: number, isDay = true): WeatherConditionInfo {
  if (code === 0) {
    return {
      label: isDay ? "Sunny & Clear" : "Clear Night",
      category: "clear",
      icon: isDay ? "☀️" : "🌙",
      advisory: "Optimal Route Conditions · Highways Clear & Dry",
      advisoryLevel: "optimal",
      gradient: isDay
        ? "from-amber-500/20 via-orange-500/15 to-yellow-500/10"
        : "from-indigo-950/40 via-purple-900/20 to-blue-950/30",
    };
  }
  if ([1, 2, 3].includes(code)) {
    return {
      label: code === 1 ? "Mainly Clear" : code === 2 ? "Partly Cloudy" : "Overcast",
      category: "clouds",
      icon: isDay ? "⛅" : "☁️",
      advisory: "Good Visibility · Favorable Transit Speed",
      advisoryLevel: "optimal",
      gradient: "from-sky-500/20 via-blue-500/15 to-indigo-500/10",
    };
  }
  if ([45, 48].includes(code)) {
    return {
      label: "Fog & Mist",
      category: "fog",
      icon: "🌫️",
      advisory: "Reduced Visibility · Maintain Safe Following Distance",
      advisoryLevel: "moderate",
      gradient: "from-slate-500/25 via-gray-500/20 to-zinc-500/15",
    };
  }
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
    const isHeavy = [65, 82].includes(code);
    return {
      label: isHeavy ? "Heavy Rain" : "Light Rain & Showers",
      category: "rain",
      icon: "🌧️",
      advisory: isHeavy
        ? "Wet Highways · Reduce Speed & Ensure Tarpaulin Cargo Cover"
        : "Passing Showers · Safe for Loaded Trucks",
      advisoryLevel: isHeavy ? "caution" : "moderate",
      gradient: "from-blue-600/25 via-cyan-600/20 to-slate-700/20",
    };
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return {
      label: "Snowfall",
      category: "snow",
      icon: "❄️",
      advisory: "Ghat & Mountain Route Caution · Check Tire Chains",
      advisoryLevel: "caution",
      gradient: "from-cyan-400/20 via-sky-300/15 to-blue-500/15",
    };
  }
  if ([95, 96, 99].includes(code)) {
    return {
      label: "Thunderstorm",
      category: "thunderstorm",
      icon: "⛈️",
      advisory: "Severe Weather Warning · Secure High-Deck Loads",
      advisoryLevel: "caution",
      gradient: "from-purple-900/30 via-indigo-900/25 to-amber-600/15",
    };
  }

  return {
    label: "Moderate Weather",
    category: "clear",
    icon: "🌤️",
    advisory: "Standard Logistics Conditions",
    advisoryLevel: "optimal",
    gradient: "from-sky-500/20 via-blue-500/15 to-emerald-500/10",
  };
}

const weatherCache = new Map<string, { data: WeatherData; timestamp: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

export async function fetchLiveWeather(
  cityName: string,
  lat?: number,
  lng?: number,
): Promise<WeatherData> {
  const cleanName = (cityName || "").trim();
  if (!cleanName && lat === undefined) {
    const defaultCity = cities[0];
    lat = defaultCity.lat;
    lng = defaultCity.lng;
    cityName = defaultCity.name;
  }

  // Determine coordinates
  let targetLat = lat;
  let targetLng = lng;
  let targetCityName = cleanName || "Delhi";

  if (targetLat === undefined || targetLng === undefined) {
    const matched = cities.find(
      (c) =>
        c.name.toLowerCase() === cleanName.toLowerCase() ||
        c.name.toLowerCase().startsWith(cleanName.toLowerCase()),
    );

    if (matched) {
      targetLat = matched.lat;
      targetLng = matched.lng;
      targetCityName = matched.name;
    } else if (cleanName.length >= 2) {
      // Dynamic geocoding lookup via Open-Meteo Geocoding
      try {
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanName)}&count=1&language=en&format=json`,
        );
        if (geoRes.ok) {
          const geoJson = await geoRes.json();
          if (geoJson.results && geoJson.results.length > 0) {
            const first = geoJson.results[0];
            targetLat = first.latitude;
            targetLng = first.longitude;
            targetCityName = first.name;
          }
        }
      } catch {
        // ignore geocode error and fallback
      }
    }

    if (targetLat === undefined || targetLng === undefined) {
      const defaultCity = cities[0]; // Delhi
      targetLat = defaultCity.lat;
      targetLng = defaultCity.lng;
      targetCityName = defaultCity.name;
    }
  }

  const cacheKey = `${targetLat.toFixed(2)},${targetLng.toFixed(2)}`;
  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return { ...cached.data, cityName: targetCityName };
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${targetLat}&longitude=${targetLng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=4`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("OpenMeteo fetch failed");
    const json = await res.json();

    const cur = json.current || {};
    const daily = json.daily || {};
    const hourly = json.hourly || {};

    const isDay = cur.is_day === 1;
    const weatherCode = cur.weather_code ?? 0;
    const condition = parseWeatherCode(weatherCode, isDay);

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const forecast: DayForecast[] = [];

    if (daily.time && Array.isArray(daily.time)) {
      for (let i = 0; i < Math.min(daily.time.length, 4); i++) {
        const d = new Date(daily.time[i]);
        const dayLabel = i === 0 ? "Today" : i === 1 ? "Tomorrow" : dayNames[d.getDay()];
        const code = daily.weather_code?.[i] ?? 0;
        forecast.push({
          dayName: dayLabel,
          date: daily.time[i],
          tempMax: Math.round(daily.temperature_2m_max?.[i] ?? 30),
          tempMin: Math.round(daily.temperature_2m_min?.[i] ?? 22),
          weatherCode: code,
          condition: parseWeatherCode(code, true),
        });
      }
    }

    const hourlyList: HourlyForecast[] = [];
    if (hourly.time && Array.isArray(hourly.time)) {
      const now = new Date();
      const currentHour = now.getHours();
      for (let i = currentHour; i < currentHour + 6 && i < hourly.time.length; i++) {
        const t = new Date(hourly.time[i]);
        const hoursStr = t.toLocaleTimeString([], { hour: "numeric", hour12: true });
        hourlyList.push({
          time: hoursStr,
          temp: Math.round(hourly.temperature_2m?.[i] ?? 28),
          weatherCode: hourly.weather_code?.[i] ?? 0,
        });
      }
    }

    const weatherData: WeatherData = {
      cityName: targetCityName,
      lat: targetLat,
      lng: targetLng,
      temp: Math.round(cur.temperature_2m ?? 28),
      feelsLike: Math.round(cur.apparent_temperature ?? cur.temperature_2m ?? 28),
      humidity: Math.round(cur.relative_humidity_2m ?? 50),
      windSpeed: Math.round(cur.wind_speed_10m ?? 12),
      visibility: 10,
      precipitation: cur.precipitation ?? 0,
      isDay,
      weatherCode,
      condition,
      forecast,
      hourly: hourlyList,
      updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    weatherCache.set(cacheKey, { data: weatherData, timestamp: Date.now() });
    return weatherData;
  } catch {
    // Fallback data when offline or network fails
    const isDay = true;
    const fallbackCondition = parseWeatherCode(0, isDay);
    return {
      cityName: targetCityName,
      lat: targetLat,
      lng: targetLng,
      temp: 29,
      feelsLike: 31,
      humidity: 52,
      windSpeed: 14,
      visibility: 10,
      precipitation: 0,
      isDay: true,
      weatherCode: 0,
      condition: fallbackCondition,
      forecast: [
        {
          dayName: "Today",
          date: new Date().toISOString(),
          tempMax: 32,
          tempMin: 23,
          weatherCode: 0,
          condition: fallbackCondition,
        },
        {
          dayName: "Tomorrow",
          date: new Date().toISOString(),
          tempMax: 33,
          tempMin: 24,
          weatherCode: 1,
          condition: parseWeatherCode(1, true),
        },
        {
          dayName: "Day After",
          date: new Date().toISOString(),
          tempMax: 31,
          tempMin: 22,
          weatherCode: 2,
          condition: parseWeatherCode(2, true),
        },
      ],
      hourly: [
        { time: "Now", temp: 29, weatherCode: 0 },
        { time: "+2h", temp: 31, weatherCode: 0 },
        { time: "+4h", temp: 30, weatherCode: 1 },
        { time: "+6h", temp: 28, weatherCode: 1 },
      ],
      updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  }
}
