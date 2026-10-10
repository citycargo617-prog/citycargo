import type { SupabaseReview } from "@/lib/supabase";

/* ─── Curated Base Reviews ─── */
const BASE_REVIEWS: SupabaseReview[] = [
  {
    id: "1",
    reviewer_name: "Rakesh Malhotra",
    city: "Ludhiana",
    rating: 5,
    title: "Lightning-fast dispatch",
    review_text:
      "City Cargo cut our dispatch time in half. Getting a truck now takes minutes, not a full day of phone calls. Highly recommended for steel transport.",
    is_approved: true,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "2",
    reviewer_name: "Anita Deshmukh",
    city: "Pune",
    rating: 5,
    title: "Transparent and reliable",
    review_text:
      "Live tracking means my clients stop calling me for updates. The pricing has stayed exactly as quoted every single time.",
    is_approved: true,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "3",
    reviewer_name: "Imran Sheikh",
    city: "Jaipur",
    rating: 5,
    title: "Zero damage guarantee",
    review_text:
      "Verified drivers made all the difference. Six months, forty loads, not one damaged consignment. Best for furniture logistics.",
    is_approved: true,
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: "4",
    reviewer_name: "Priya Sharma",
    city: "Surat",
    rating: 5,
    title: "Part load is a game-changer",
    review_text:
      "The part-load service saves us 40% on smaller shipments without compromising on speed. Excellent for textile exports.",
    is_approved: true,
    created_at: new Date(Date.now() - 11 * 86400000).toISOString(),
  },
  {
    id: "5",
    reviewer_name: "Vikram Patel",
    city: "Ahmedabad",
    rating: 4,
    title: "Great value for money",
    review_text:
      "Competitive pricing and on-time delivery. Used them for chemical drums and the service was top-notch. Will use again.",
    is_approved: true,
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    id: "6",
    reviewer_name: "Sunita Reddy",
    city: "Hyderabad",
    rating: 5,
    title: "Best logistics partner",
    review_text:
      "We switched from our old transporter 8 months ago. City Cargo's GPS tracking and 24x7 support is unmatched in the industry.",
    is_approved: true,
    created_at: new Date(Date.now() - 18 * 86400000).toISOString(),
  },
];

/* ─── Generator Pools ─── */
const FIRST_NAMES = [
  "Rajesh", "Amit", "Suresh", "Manoj", "Harish", "Deepak", "Rohit", "Sanjay", "Gaurav", "Alok",
  "Tarun", "Kavita", "Pankaj", "Naveen", "Dinesh", "Arvind", "Vinay", "Ankit", "Sachin", "Mohit",
  "Rahul", "Ajay", "Vikas", "Manish", "Sandeep", "Vishal", "Chetan", "Ashish", "Pradeep", "Satish",
  "Hemant", "Jagdish", "Bhupesh", "Raman", "Jaspreet", "Gurdeep", "Balwinder", "Manpreet", "Sukhwinder", "Farhan",
  "Tariq", "Shoaib", "Adil", "Karthik", "Senthil", "Venkatesh", "Murugan", "Raghu", "Vignesh", "Ashwin",
  "Balaji", "Sridhar", "Anand", "Vijay", "Murali", "Pooja", "Neha", "Shalini", "Meenakshi", "Divya",
  "Swati", "Ritu", "Ananya", "Preeti", "Geeta", "Rashmi", "Shweta", "Bhavna", "Kiran", "Simran",
  "Jyoti", "Pallavi", "Sunil", "Kishore", "Nitin", "Mahesh", "Devendra", "Kamlesh", "Mukesh", "Bharat",
  "Praveen", "Ashok", "Girish", "Santosh", "Lalit", "Sudhir", "Subhash", "Yogesh", "Brijesh", "Abhishek",
];

const LAST_NAMES = [
  "Sharma", "Patel", "Deshmukh", "Sheikh", "Reddy", "Malhotra", "Verma", "Gupta", "Singh", "Iyer",
  "Subramanian", "Nair", "Joshi", "Mehra", "Kulkarni", "Aggarwal", "Bansal", "Jain", "Singhania", "Mittal",
  "Bhasin", "Tiwari", "Choudhary", "Yadav", "Pillai", "Nambiar", "Menon", "Rao", "Hegde", "Gowda",
  "Bhat", "Sen", "Mukherjee", "Banerjee", "Chatterjee", "Dutta", "Roy", "Ghosh", "Das", "Khatri",
  "Sethi", "Bedi", "Gill", "Dhillon", "Sandhu", "Grewal", "Ahluwalia", "Chopra", "Kapoor", "Bhatia",
  "Bhardwaj", "Saxena", "Srivastava", "Pandey", "Mishra", "Tripathi", "Dubey", "Shukla", "Pathak", "Chauhan",
];

const CITIES = [
  "Ludhiana", "Pune", "Jaipur", "Surat", "Ahmedabad", "Hyderabad", "Delhi NCR", "Mumbai", "Bengaluru", "Chennai",
  "Kolkata", "Kanpur", "Indore", "Nagpur", "Vadodara", "Coimbatore", "Rajkot", "Chandigarh", "Agra", "Varanasi",
  "Patna", "Bhopal", "Visakhapatnam", "Jamshedpur", "Nashik", "Kochi", "Guwahati", "Bhubaneswar", "Meerut", "Amritsar",
  "Jalandhar", "Ghaziabad", "Faridabad", "Noida", "Gurugram", "Tirupur", "Salem", "Madurai", "Hubballi", "Mangaluru",
  "Belagavi", "Kolhapur", "Aurangabad", "Solapur", "Udaipur", "Jodhpur", "Kota", "Gwalior", "Jabalpur", "Raipur",
  "Ranchi", "Dhanbad", "Asansol", "Siliguri", "Durgapur", "Rourkela", "Cuttack", "Panipat", "Sonipat", "Bhiwadi",
];

const CARGO_TYPES = [
  "steel coils & rods", "textile fabrics & yarn", "automotive spare parts", "pharmaceutical supplies",
  "FMCG packaged goods", "ceramic tiles", "industrial machinery", "electrical cables & panels",
  "consumer electronics", "chemical drums (non-hazardous)", "plastic polymer granules", "agricultural seeds & grain",
  "plywood & laminates", "kraft paper rolls", "solar PV modules & inverters", "hardware & sanitaryware",
  "paints & coating barrels", "brass fittings & castings", "footwear & leather goods", "corrugated boxes & packaging",
  "heavy construction equipment", "beverages & packaged water", "rice & pulses consignments", "auto batteries",
  "refrigeration units", "solar mounting structures", "metal fabrication items", "glassware & fragile materials",
  "cotton bales", "pulp & stationery", "pipe fittings & valves", "foundry castings", "rubber conveyor belts",
  "wire spools & fasteners", "submersible pumps", "medical instruments", "pre-cast concrete items",
  "cosmetics & personal care supplies", "furniture & modular fixtures", "UPS & electrical switchgears",
];

const TRUCK_TYPES = [
  "32ft multi-axle container", "24ft closed container", "19ft open body truck", "Tata Ace",
  "20ft container", "14ft truck", "32ft single axle truck", "22ft open body truck",
  "40ft trailer", "Eicher 17ft truck",
];

interface ReviewTemplate {
  title: string;
  template: string;
}

const REVIEW_TEMPLATES: ReviewTemplate[] = [
  {
    title: "Prompt dispatch and spotless delivery",
    template:
      "Booked a {truck} for transporting {cargo} from {city} to destination. Driver reached right on schedule, vehicle was clean and well-maintained, and the consignment arrived without a scratch. Truly impressed with City Cargo!",
  },
  {
    title: "Smooth supply chain partner",
    template:
      "We regularly dispatch {cargo} out of {city}. City Cargo provides verified drivers and accurate live tracking. Our transit turnaround times have improved noticeably over the past few months.",
  },
  {
    title: "Zero hidden charges & fair pricing",
    template:
      "Transparent pricing with zero unexpected fees at the unloading point. The digital e-bilty and instant POD upload made our accounting cycle much faster. Extremely reliable service.",
  },
  {
    title: "Safe transit for high-value cargo",
    template:
      "Moved fragile {cargo} from {city}. The driver was seasoned, adhered to safe speed limits, and secured the tarpaulins properly. Their 24x7 control tower helpline was always responsive.",
  },
  {
    title: "Truck placement within minutes",
    template:
      "City Cargo has completely solved our vehicle availability issue in {city}. Even during festival peak season, we had an assigned vehicle confirmed in less than an hour.",
  },
  {
    title: "Consignee loved the live GPS tracking",
    template:
      "The real-time GPS tracking link allowed our consignee to track the truck directly. It eliminated endless phone calls and helped our destination warehouse prepare unloading beforehand.",
  },
  {
    title: "Significant freight cost savings",
    template:
      "We saved almost 15% on our regular {city} freight expenses compared to market brokers, while getting superior GPS tracking and dedicated support.",
  },
  {
    title: "Verified vehicle & polite driver",
    template:
      "Driver was courteous, carried all verified RTO documents, and handled our {cargo} with utmost care. Delivered 3 hours ahead of estimated delivery time.",
  },
  {
    title: "Consistent and punctual logistics",
    template:
      "Using City Cargo for our routine {cargo} shipments across {city} hubs. Pickup is always on time, GPS never drops, and vehicle conditions are consistently great.",
  },
  {
    title: "Great assistance from control team",
    template:
      "The operations support team helped coordinate unloading swiftly when our factory gate faced a queue. Very dependable logistics partner for long-haul routes.",
  },
  {
    title: "No broker bargaining needed",
    template:
      "No haggling with middle brokers or sudden rate spikes. The rate quoted on City Cargo is final and fair. Outstanding experience for our business in {city}.",
  },
  {
    title: "Weatherproof transit protection",
    template:
      "Driver brought heavy-duty tarpaulins and ropes to secure our {cargo}. It rained heavily on the highway, but the entire consignment reached 100% dry and safe.",
  },
  {
    title: "Seamless booking via web platform",
    template:
      "Instant truck booking confirmation and driver contact details received within minutes. Unloading was completed without any hindrance.",
  },
  {
    title: "Switched all monthly loads to City Cargo",
    template:
      "We moved all our factory dispatches of {cargo} to City Cargo. Real-time truck visibility gave our clients peace of mind and zero transit disputes.",
  },
  {
    title: "Highway route expertise",
    template:
      "The driver was experienced on national highways, followed optimal toll routes, and delivered {cargo} from {city} in pristine condition. Highly recommended.",
  },
  {
    title: "Accurate billing & quick e-Bilty",
    template:
      "Clean invoicing with digital receipts sent straight to our WhatsApp and email. We send {cargo} weekly from {city} and haven't had a single issue.",
  },
  {
    title: "Safe handling of delicate goods",
    template:
      "Opted for goods transit cover and City Cargo handled our {cargo} with extreme care. Not a single carton damaged upon arrival.",
  },
  {
    title: "Emergency truck arranged on short notice",
    template:
      "Needed an urgent truck at 7:30 AM in {city} for an emergency shipment of {cargo}. City Cargo had a driver at our loading dock by 9:00 AM. Lifesaver!",
  },
  {
    title: "Professional fleet management",
    template:
      "Excellent coordination between the driver, city dispatch officer, and receiving team. The entire full-truckload journey was remarkably hassle-free.",
  },
  {
    title: "Dependable long-distance logistics",
    template:
      "Long route from {city} completed ahead of schedule. City Cargo's automated milestone alerts kept our logistics team updated around the clock.",
  },
  {
    title: "Superb part load (PTL) service",
    template:
      "Their part load service is quick and economical. We didn't have to wait days for vehicle consolidation—our {cargo} moved out the very next morning.",
  },
  {
    title: "Honest and transparent transporters",
    template:
      "Very honest service. The driver was disciplined and refused unnecessary toll detours. The consignment of {cargo} arrived in exact promised time.",
  },
  {
    title: "Flawless inter-state movement",
    template:
      "Inter-state permit formalities were handled smoothly by City Cargo. No delays at state checkpoints for our {cargo} shipment from {city}.",
  },
  {
    title: "Best logistics app experience",
    template:
      "Booking took less than 2 minutes. Transparent vehicle specifications, clear driver identification, and prompt loading of {cargo}.",
  },
  {
    title: "Excellent fleet condition",
    template:
      "The {truck} sent for our loading was brand new with GPS working flawlessly. Our {cargo} reached safely and our client in destination was pleased.",
  },
];

/* ─── Deterministic PRNG ─── */
function makeLcg(initialSeed: number) {
  let s = initialSeed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/* ─── Generate Seed Reviews (Total 520) ─── */
function generateSeedReviews(totalCount = 520): SupabaseReview[] {
  const reviews: SupabaseReview[] = [...BASE_REVIEWS];
  const rand = makeLcg(987654321);

  const needed = totalCount - BASE_REVIEWS.length;

  for (let i = 0; i < needed; i++) {
    const id = (i + BASE_REVIEWS.length + 1).toString();

    // Select name
    const firstName = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
    const reviewer_name = `${firstName} ${lastName}`;

    // Select city
    const city = CITIES[Math.floor(rand() * CITIES.length)];

    // Rating: ~87% 5-star, ~13% 4-star (all high/good rating)
    const rating = rand() < 0.87 ? 5 : 4;

    // Cargo and truck
    const cargo = CARGO_TYPES[Math.floor(rand() * CARGO_TYPES.length)];
    const truck = TRUCK_TYPES[Math.floor(rand() * TRUCK_TYPES.length)];

    // Template
    const templateObj = REVIEW_TEMPLATES[Math.floor(rand() * REVIEW_TEMPLATES.length)];
    const title = templateObj.title;
    const review_text = templateObj.template
      .replace(/{city}/g, city)
      .replace(/{cargo}/g, cargo)
      .replace(/{truck}/g, truck);

    // Date: spread over the past 360 days
    // Weight towards recent dates
    const daysAgo = Math.floor(Math.pow(rand(), 1.6) * 360) + 1;
    const date = new Date(Date.now() - daysAgo * 86400000 - Math.floor(rand() * 86400000));

    reviews.push({
      id,
      reviewer_name,
      city,
      rating,
      title,
      review_text,
      is_approved: true,
      created_at: date.toISOString(),
    });
  }

  // Sort descending by created_at
  reviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return reviews;
}

export const SEED_REVIEWS: SupabaseReview[] = generateSeedReviews(520);
