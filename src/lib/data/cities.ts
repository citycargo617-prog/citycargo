export interface City {
  name: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
}

export const cities: City[] = [
  { name: "Delhi", state: "Delhi", pincode: "110001", lat: 28.6139, lng: 77.209 },
  { name: "Mumbai", state: "Maharashtra", pincode: "400001", lat: 19.076, lng: 72.8777 },
  { name: "Bengaluru", state: "Karnataka", pincode: "560001", lat: 12.9716, lng: 77.5946 },
  { name: "Chennai", state: "Tamil Nadu", pincode: "600001", lat: 13.0827, lng: 80.2707 },
  { name: "Hyderabad", state: "Telangana", pincode: "500001", lat: 17.385, lng: 78.4867 },
  { name: "Pune", state: "Maharashtra", pincode: "411001", lat: 18.5204, lng: 73.8567 },
  { name: "Ahmedabad", state: "Gujarat", pincode: "380001", lat: 23.0225, lng: 72.5714 },
  { name: "Kolkata", state: "West Bengal", pincode: "700001", lat: 22.5726, lng: 88.3639 },
  { name: "Jaipur", state: "Rajasthan", pincode: "302001", lat: 26.9124, lng: 75.7873 },
  { name: "Surat", state: "Gujarat", pincode: "395001", lat: 21.1702, lng: 72.8311 },
  { name: "Lucknow", state: "Uttar Pradesh", pincode: "226001", lat: 26.8467, lng: 80.9462 },
  { name: "Indore", state: "Madhya Pradesh", pincode: "452001", lat: 22.7196, lng: 75.8577 },
  { name: "Nagpur", state: "Maharashtra", pincode: "440001", lat: 21.1458, lng: 79.0882 },
  { name: "Kanpur", state: "Uttar Pradesh", pincode: "208001", lat: 26.4499, lng: 80.3319 },
  { name: "Patna", state: "Bihar", pincode: "800001", lat: 25.6093, lng: 85.1376 },
  { name: "Bhopal", state: "Madhya Pradesh", pincode: "462001", lat: 23.2599, lng: 77.4126 },
  { name: "Ludhiana", state: "Punjab", pincode: "141001", lat: 30.901, lng: 75.8573 },
  { name: "Agra", state: "Uttar Pradesh", pincode: "282001", lat: 27.1767, lng: 78.0081 },
  { name: "Varanasi", state: "Uttar Pradesh", pincode: "221001", lat: 25.3176, lng: 82.9739 },
  { name: "Nashik", state: "Maharashtra", pincode: "422001", lat: 19.9975, lng: 73.7898 },
  { name: "Vadodara", state: "Gujarat", pincode: "390001", lat: 22.3072, lng: 73.1812 },
  { name: "Rajkot", state: "Gujarat", pincode: "360001", lat: 22.3039, lng: 70.8022 },
  { name: "Visakhapatnam", state: "Andhra Pradesh", pincode: "530001", lat: 17.6868, lng: 83.2185 },
  { name: "Coimbatore", state: "Tamil Nadu", pincode: "641001", lat: 11.0168, lng: 76.9558 },
  { name: "Madurai", state: "Tamil Nadu", pincode: "625001", lat: 9.9252, lng: 78.1198 },
  { name: "Chandigarh", state: "Chandigarh", pincode: "160001", lat: 30.7333, lng: 76.7794 },
  { name: "Guwahati", state: "Assam", pincode: "781001", lat: 26.1445, lng: 91.7362 },
  { name: "Bhubaneswar", state: "Odisha", pincode: "751001", lat: 20.2961, lng: 85.8245 },
  { name: "Dehradun", state: "Uttarakhand", pincode: "248001", lat: 30.3165, lng: 78.0322 },
  { name: "Thiruvananthapuram", state: "Kerala", pincode: "695001", lat: 8.5241, lng: 76.9366 },
  { name: "Kochi", state: "Kerala", pincode: "682001", lat: 9.9312, lng: 76.2673 },
  { name: "Ranchi", state: "Jharkhand", pincode: "834001", lat: 23.3441, lng: 85.3096 },
  { name: "Gwalior", state: "Madhya Pradesh", pincode: "474001", lat: 26.2183, lng: 78.1828 },
  { name: "Jodhpur", state: "Rajasthan", pincode: "342001", lat: 26.2389, lng: 73.0243 },
  { name: "Raipur", state: "Chhattisgarh", pincode: "492001", lat: 21.2514, lng: 81.6296 },
  { name: "Amritsar", state: "Punjab", pincode: "143001", lat: 31.634, lng: 74.8723 },
  { name: "Allahabad", state: "Uttar Pradesh", pincode: "211001", lat: 25.4358, lng: 81.8463 },
  { name: "Vijayawada", state: "Andhra Pradesh", pincode: "520001", lat: 16.5062, lng: 80.648 },
  { name: "Jabalpur", state: "Madhya Pradesh", pincode: "482001", lat: 23.1815, lng: 79.9864 },
  { name: "Udaipur", state: "Rajasthan", pincode: "313001", lat: 24.5854, lng: 73.7125 },
  { name: "Aurangabad", state: "Maharashtra", pincode: "431001", lat: 19.8762, lng: 75.3433 },
  { name: "Jammu", state: "Jammu & Kashmir", pincode: "180001", lat: 32.7266, lng: 74.857 },
  { name: "Mysuru", state: "Karnataka", pincode: "570001", lat: 12.2958, lng: 76.6394 },
  { name: "Tirupati", state: "Andhra Pradesh", pincode: "517501", lat: 13.6288, lng: 79.4192 },
  { name: "Bareilly", state: "Uttar Pradesh", pincode: "243001", lat: 28.367, lng: 79.4304 },
  { name: "Aligarh", state: "Uttar Pradesh", pincode: "202001", lat: 27.8974, lng: 78.088 },
  { name: "Moradabad", state: "Uttar Pradesh", pincode: "244001", lat: 28.8386, lng: 78.7733 },
  { name: "Gorakhpur", state: "Uttar Pradesh", pincode: "273001", lat: 26.7606, lng: 83.3732 },
  { name: "Bikaner", state: "Rajasthan", pincode: "334001", lat: 28.0229, lng: 73.3119 },
  { name: "Noida", state: "Uttar Pradesh", pincode: "201301", lat: 28.5355, lng: 77.391 },
  { name: "Gurugram", state: "Haryana", pincode: "122001", lat: 28.4595, lng: 77.0266 },
  { name: "Faridabad", state: "Haryana", pincode: "121001", lat: 28.4089, lng: 77.3178 },
  { name: "Ghaziabad", state: "Uttar Pradesh", pincode: "201001", lat: 28.6692, lng: 77.4538 },
];

export function searchCities(query: string): City[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return cities
    .filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        c.pincode.startsWith(q),
    )
    .slice(0, 8);
}

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.name.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase());
}

export const popularCities = cities.slice(0, 12);
