-- ==============================================================================
-- CITY CARGO CONNECT - SUPABASE DATABASE SCHEMA
-- Run this SQL in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. BOOKINGS TABLE (Customer orders submitted from website)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    company_name TEXT,
    pickup_city TEXT NOT NULL,
    drop_city TEXT NOT NULL,
    goods_type TEXT NOT NULL,
    truck_type_id TEXT NOT NULL,
    truck_name TEXT NOT NULL,
    loading_date DATE NOT NULL,
    distance_km NUMERIC NOT NULL,
    total_price NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending', 'Confirmed', 'Dispatched', 'In-Transit', 'Delivered', 'Cancelled'
    instructions TEXT,
    insurance_opt_in BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. TRUCKS TABLE (Fleet vehicles and pricing rates)
CREATE TABLE IF NOT EXISTS public.trucks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Small Commercial', 'Light Duty', 'Medium Duty', 'Heavy Duty', 'Specialized'
    tonnage_min NUMERIC NOT NULL,
    tonnage_max NUMERIC NOT NULL,
    length_ft NUMERIC NOT NULL,
    price_per_km NUMERIC NOT NULL,
    base_charge NUMERIC NOT NULL DEFAULT 500,
    description TEXT,
    popular BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. ROUTES TABLE (Inter-city lanes and estimated transit duration)
CREATE TABLE IF NOT EXISTS public.routes (
    id TEXT PRIMARY KEY,
    from_city TEXT NOT NULL,
    to_city TEXT NOT NULL,
    distance_km NUMERIC NOT NULL,
    estimated_hours NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. ROUTE PRICING TABLE (City-to-city fixed prices per vehicle)
CREATE TABLE IF NOT EXISTS public.route_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_city TEXT NOT NULL,
    to_city TEXT NOT NULL,
    truck_type_id TEXT NOT NULL,
    base_price NUMERIC NOT NULL,
    discount_percent NUMERIC NOT NULL DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(from_city, to_city, truck_type_id)
);

-- 5. SITE SETTINGS TABLE (Platform pricing rules and promo banners)
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trucks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous users to insert bookings
CREATE POLICY "Allow public booking creation" 
ON public.bookings FOR INSERT 
WITH CHECK (true);

-- Allow public to read their bookings or all bookings (for demo/admin)
CREATE POLICY "Allow public read bookings" 
ON public.bookings FOR SELECT 
USING (true);

-- Allow updates to bookings (admin status changes)
CREATE POLICY "Allow update bookings" 
ON public.bookings FOR UPDATE 
USING (true);

-- Allow public read access to active trucks
CREATE POLICY "Allow public read trucks" 
ON public.trucks FOR SELECT 
USING (true);

-- Allow all operations on trucks
CREATE POLICY "Allow full access trucks" 
ON public.trucks FOR ALL 
USING (true);

-- Allow public read access to routes
CREATE POLICY "Allow public read routes" 
ON public.routes FOR SELECT 
USING (true);

-- Allow all operations on routes
CREATE POLICY "Allow full access routes" 
ON public.routes FOR ALL 
USING (true);

-- Allow public read access to site_settings
CREATE POLICY "Allow public read site_settings" 
ON public.site_settings FOR SELECT 
USING (true);

-- Allow all operations on site_settings
CREATE POLICY "Allow full access site_settings" 
ON public.site_settings FOR ALL 
USING (true);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

INSERT INTO public.trucks (id, name, category, tonnage_min, tonnage_max, length_ft, price_per_km, base_charge, description, popular, is_active)
VALUES
  ('tata-ace', 'Tata Ace / Chhota Hathi', 'Small Commercial', 0.5, 0.75, 7, 22, 400, 'Perfect for local city delivery, small cargo, e-commerce cartons, and appliances.', true, true),
  ('pickup-8ft', 'Mahindra Bolero Pickup 8ft', 'Light Duty', 1.0, 1.7, 8, 28, 500, 'Ideal for consumer goods, agricultural products, and medium hardware loads.', true, true),
  ('tata-407', 'Tata 407 / 14ft Closed Container', 'Light Duty', 2.5, 4.0, 14, 38, 750, 'Weather-protected container suitable for electronics, textiles, and FMCG parcels.', false, true),
  ('eicher-19ft', 'Eicher 19ft Open / Container', 'Medium Duty', 6.0, 8.5, 19, 52, 1000, 'High-demand truck for industrial machinery, furniture, and regional distribution.', true, true),
  ('tata-22ft', 'Tata 22ft Multi-Axle Truck', 'Medium Duty', 9.0, 12.0, 22, 65, 1200, 'Heavy-load transport for raw materials, auto parts, and manufacturing goods.', false, true),
  ('trailer-32ft-sxl', '32ft Single Axle Container', 'Heavy Duty', 7.0, 9.0, 32, 74, 1500, 'Spacious container for voluminous FMCG, pharma, white goods, and long hauls.', true, true),
  ('trailer-32ft-mxl', '32ft Multi-Axle Heavy Container', 'Heavy Duty', 14.0, 18.0, 32, 92, 1800, 'Maximum volume & heavy payload container for interstate long-haul logistics.', false, true),
  ('open-trailer-40ft', '40ft High Bed Open Trailer', 'Specialized', 22.0, 32.0, 40, 125, 2500, 'Heavy-duty trailer for steel coils, oversized industrial machinery, and pipes.', false, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.routes (id, from_city, to_city, distance_km, estimated_hours)
VALUES
  ('del-mum', 'Delhi', 'Mumbai', 1420, 28),
  ('del-blr', 'Delhi', 'Bengaluru', 2150, 42),
  ('del-kol', 'Delhi', 'Kolkata', 1530, 30),
  ('del-jai', 'Delhi', 'Jaipur', 280, 5),
  ('del-lko', 'Delhi', 'Lucknow', 550, 9),
  ('del-ahm', 'Delhi', 'Ahmedabad', 940, 18),
  ('del-pun', 'Delhi', 'Pune', 1440, 29),
  ('del-chn', 'Delhi', 'Chennai', 2180, 43),
  ('del-hyd', 'Delhi', 'Hyderabad', 1580, 31),
  ('mum-blr', 'Mumbai', 'Bengaluru', 980, 18),
  ('mum-pun', 'Mumbai', 'Pune', 150, 3.5),
  ('mum-ahm', 'Mumbai', 'Ahmedabad', 530, 10),
  ('mum-hyd', 'Mumbai', 'Hyderabad', 710, 14),
  ('mum-kol', 'Mumbai', 'Kolkata', 1960, 38),
  ('mum-chn', 'Mumbai', 'Chennai', 1340, 26),
  ('mum-jai', 'Mumbai', 'Jaipur', 1150, 22),
  ('blr-chn', 'Bengaluru', 'Chennai', 350, 6.5),
  ('blr-hyd', 'Bengaluru', 'Hyderabad', 570, 10),
  ('blr-pun', 'Bengaluru', 'Pune', 840, 16),
  ('kol-del', 'Kolkata', 'Delhi', 1530, 30),
  ('kol-pat', 'Kolkata', 'Patna', 580, 11),
  ('kol-bhu', 'Kolkata', 'Bhubaneswar', 440, 8.5),
  ('ahm-sur', 'Ahmedabad', 'Surat', 270, 5)
ON CONFLICT (id) DO NOTHING;
