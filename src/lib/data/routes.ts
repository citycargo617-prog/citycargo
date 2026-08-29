export interface RouteInfo {
  from: string;
  to: string;
  distanceKm: number;
  estimatedHours: number;
}

export const popularRoutes: RouteInfo[] = [
  { from: "Delhi", to: "Mumbai", distanceKm: 1400, estimatedHours: 24 },
  { from: "Delhi", to: "Jaipur", distanceKm: 280, estimatedHours: 5 },
  { from: "Delhi", to: "Chandigarh", distanceKm: 250, estimatedHours: 4.5 },
  { from: "Delhi", to: "Lucknow", distanceKm: 550, estimatedHours: 9 },
  { from: "Delhi", to: "Ahmedabad", distanceKm: 950, estimatedHours: 15 },
  { from: "Mumbai", to: "Pune", distanceKm: 150, estimatedHours: 3 },
  { from: "Mumbai", to: "Ahmedabad", distanceKm: 530, estimatedHours: 8 },
  { from: "Mumbai", to: "Bengaluru", distanceKm: 980, estimatedHours: 16 },
  { from: "Mumbai", to: "Hyderabad", distanceKm: 710, estimatedHours: 12 },
  { from: "Mumbai", to: "Chennai", distanceKm: 1340, estimatedHours: 22 },
  { from: "Bengaluru", to: "Chennai", distanceKm: 350, estimatedHours: 6 },
  { from: "Bengaluru", to: "Hyderabad", distanceKm: 570, estimatedHours: 9 },
  { from: "Bengaluru", to: "Kochi", distanceKm: 560, estimatedHours: 9 },
  { from: "Chennai", to: "Hyderabad", distanceKm: 630, estimatedHours: 10 },
  { from: "Chennai", to: "Coimbatore", distanceKm: 500, estimatedHours: 8 },
  { from: "Kolkata", to: "Patna", distanceKm: 580, estimatedHours: 9 },
  { from: "Kolkata", to: "Bhubaneswar", distanceKm: 440, estimatedHours: 7 },
  { from: "Kolkata", to: "Guwahati", distanceKm: 990, estimatedHours: 16 },
  { from: "Pune", to: "Nashik", distanceKm: 210, estimatedHours: 4 },
  { from: "Pune", to: "Hyderabad", distanceKm: 560, estimatedHours: 9 },
  { from: "Ahmedabad", to: "Rajkot", distanceKm: 220, estimatedHours: 4 },
  { from: "Ahmedabad", to: "Surat", distanceKm: 265, estimatedHours: 4.5 },
  { from: "Jaipur", to: "Udaipur", distanceKm: 395, estimatedHours: 6.5 },
  { from: "Jaipur", to: "Jodhpur", distanceKm: 340, estimatedHours: 5.5 },
  { from: "Lucknow", to: "Varanasi", distanceKm: 320, estimatedHours: 5 },
  { from: "Lucknow", to: "Kanpur", distanceKm: 80, estimatedHours: 1.5 },
  { from: "Indore", to: "Bhopal", distanceKm: 195, estimatedHours: 3.5 },
  { from: "Nagpur", to: "Hyderabad", distanceKm: 500, estimatedHours: 8 },
  { from: "Nagpur", to: "Raipur", distanceKm: 285, estimatedHours: 5 },
  { from: "Delhi", to: "Agra", distanceKm: 230, estimatedHours: 4 },
];

export function getRoutesFromCity(cityName: string): RouteInfo[] {
  return popularRoutes.filter(
    (r) =>
      r.from.toLowerCase() === cityName.toLowerCase() ||
      r.to.toLowerCase() === cityName.toLowerCase(),
  );
}

export function estimatePrice(distanceKm: number, pricePerKm: number): number {
  const baseCharge = 500;
  return baseCharge + distanceKm * pricePerKm;
}

export function findRoute(from: string, to: string): RouteInfo | undefined {
  return popularRoutes.find(
    (r) =>
      (r.from.toLowerCase() === from.toLowerCase() && r.to.toLowerCase() === to.toLowerCase()) ||
      (r.from.toLowerCase() === to.toLowerCase() && r.to.toLowerCase() === from.toLowerCase()),
  );
}
