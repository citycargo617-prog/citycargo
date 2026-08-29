import { cities, type City } from "./data/cities";

/**
 * Calculates the great-circle distance between two coordinates using the Haversine formula (in kilometers).
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Finds the nearest known city from our list based on latitude & longitude.
 */
export function getNearestCity(lat: number, lng: number): City {
  let closest = cities[0];
  let minDistance = Infinity;

  for (const city of cities) {
    const dist = calculateDistanceKm(lat, lng, city.lat, city.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = city;
    }
  }

  return closest;
}

/**
 * Attempts reverse geocoding via OpenStreetMap Nominatim with a fast timeout,
 * and matches it with known cities or falls back to nearest coordinate match.
 */
export async function reverseGeocodeCity(lat: number, lng: number): Promise<string> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
      {
        signal: controller.signal,
        headers: {
          "Accept-Language": "en",
        },
      },
    );
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const addr = data.address || {};
      const detectedName =
        addr.city || addr.town || addr.state_district || addr.county || addr.state;

      if (detectedName) {
        // Try finding direct match in our database
        const lower = detectedName.toLowerCase();
        const matchedCity = cities.find(
          (c) =>
            c.name.toLowerCase() === lower ||
            lower.includes(c.name.toLowerCase()) ||
            c.name.toLowerCase().includes(lower),
        );
        if (matchedCity) {
          return matchedCity.name;
        }
        return detectedName;
      }
    }
  } catch {
    // If API fails or is offline/blocked, fallback to nearest city calculation
  }

  // Fallback to nearest city by coordinates
  const nearest = getNearestCity(lat, lng);
  return nearest.name;
}

/**
 * Prompts user for browser geolocation and resolves the user's city name.
 */
export function detectUserCity(): Promise<{ cityName: string; lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const cityName = await reverseGeocodeCity(latitude, longitude);
          // Cache in sessionStorage
          try {
            sessionStorage.setItem("user_detected_city", cityName);
          } catch {
            // Ignore storage errors
          }
          resolve({ cityName, lat: latitude, lng: longitude });
        } catch (err) {
          // Fallback nearest
          const nearest = getNearestCity(position.coords.latitude, position.coords.longitude);
          resolve({
            cityName: nearest.name,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        }
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      },
    );
  });
}
