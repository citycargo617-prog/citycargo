export interface TruckType {
  id: string;
  name: string;
  category: "tempo" | "truck" | "trailer";
  tonnageMin: number;
  tonnageMax: number;
  lengthFt: number;
  pricePerKm: number;
  description: string;
  popular?: boolean;
}

export const truckTypes: TruckType[] = [
  {
    id: "tata-ace",
    name: "Tata Ace",
    category: "tempo",
    tonnageMin: 0.75,
    tonnageMax: 1,
    lengthFt: 7,
    pricePerKm: 14,
    description: "Ideal for small loads within the city or short distances.",
  },
  {
    id: "bolero-pickup",
    name: "Bolero Pickup",
    category: "tempo",
    tonnageMin: 1,
    tonnageMax: 1.5,
    lengthFt: 8,
    pricePerKm: 16,
    description: "Perfect for medium city loads with open-body flexibility.",
  },
  {
    id: "14ft-tempo",
    name: "14ft Closed Container",
    category: "tempo",
    tonnageMin: 2,
    tonnageMax: 4,
    lengthFt: 14,
    pricePerKm: 20,
    description: "Enclosed container for weather-proof deliveries up to 4 tons.",
  },
  {
    id: "17ft-tempo",
    name: "17ft Closed Container",
    category: "tempo",
    tonnageMin: 4,
    tonnageMax: 5,
    lengthFt: 17,
    pricePerKm: 24,
    description: "Larger enclosed vehicle suitable for furniture and electronics.",
  },
  {
    id: "19ft-open",
    name: "19ft Open Body",
    category: "truck",
    tonnageMin: 7,
    tonnageMax: 9,
    lengthFt: 19,
    pricePerKm: 28,
    description: "Open-body truck for construction materials and heavy machinery.",
  },
  {
    id: "22ft-container",
    name: "22ft Closed Container",
    category: "truck",
    tonnageMin: 9,
    tonnageMax: 14,
    lengthFt: 22,
    pricePerKm: 34,
    description: "Most popular size. Ideal for FMCG, textiles, and general cargo.",
    popular: true,
  },
  {
    id: "24ft-container",
    name: "24ft Multi-Axle Container",
    category: "truck",
    tonnageMin: 14,
    tonnageMax: 16,
    lengthFt: 24,
    pricePerKm: 40,
    description: "Heavy-duty container for bulk industrial shipments.",
  },
  {
    id: "32ft-sxl",
    name: "32ft Single-Axle Trailer",
    category: "trailer",
    tonnageMin: 18,
    tonnageMax: 22,
    lengthFt: 32,
    pricePerKm: 50,
    description: "Long-haul trailer for voluminous low-weight cargo.",
  },
  {
    id: "32ft-mxl",
    name: "32ft Multi-Axle Trailer",
    category: "trailer",
    tonnageMin: 22,
    tonnageMax: 28,
    lengthFt: 32,
    pricePerKm: 58,
    description: "Heavy long-haul trailer. Best for steel, cement, and machinery.",
  },
  {
    id: "40ft-trailer",
    name: "40ft Flatbed Trailer",
    category: "trailer",
    tonnageMin: 28,
    tonnageMax: 35,
    lengthFt: 40,
    pricePerKm: 68,
    description: "Largest flatbed for over-dimensional cargo and project logistics.",
  },
];

export function getTrucksByCategory(category: TruckType["category"]) {
  return truckTypes.filter((t) => t.category === category);
}

export function getTruckById(id: string) {
  return truckTypes.find((t) => t.id === id);
}
