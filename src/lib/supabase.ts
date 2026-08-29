import { createClient } from "@supabase/supabase-js";

// Read environment variables (supports Vite VITE_ prefix as well as runtime env)
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  (typeof process !== "undefined" ? process.env.VITE_SUPABASE_URL : "") ||
  "";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  (typeof process !== "undefined" ? process.env.VITE_SUPABASE_ANON_KEY : "") ||
  "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("your-project-id") &&
    !supabaseAnonKey.includes("your-anon-key"),
);

// Fallback dummy client if credentials are not yet entered to avoid crashing
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createClient("https://placeholder.supabase.co", "placeholder-key");

export interface SupabaseBooking {
  id: string;
  booking_number: string;
  customer_name: string;
  phone: string;
  company_name?: string;
  pickup_city: string;
  drop_city: string;
  goods_type: string;
  truck_type_id: string;
  truck_name: string;
  loading_date: string;
  distance_km: number;
  total_price: number;
  status: string;
  instructions?: string;
  insurance_opt_in: boolean;
  created_at: string;
}

export interface SupabaseTruck {
  id: string;
  name: string;
  category: string;
  tonnage_min: number;
  tonnage_max: number;
  length_ft: number;
  price_per_km: number;
  base_charge: number;
  description: string;
  popular: boolean;
  is_active: boolean;
  image_url?: string;
  created_at: string;
}

export interface SupabaseRoute {
  id: string;
  from_city: string;
  to_city: string;
  distance_km: number;
  estimated_hours: number;
  created_at: string;
}
