-- ==============================================================================
-- FIO SAGRADO - SECURITY HARDENING & RLS POLICIES (AUDIT REMEDIATION)
-- Database: Supabase PostgreSQL
-- ==============================================================================

-- 1. Enable RLS on all existing public tables
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.global_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.saints ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.rosary_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.customization_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.custom_builds ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.transactions ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing overly permissive policies
DROP POLICY IF EXISTS "Public access to products" ON public.products;
DROP POLICY IF EXISTS "Allow all on products" ON public.products;
DROP POLICY IF EXISTS "products_select_policy" ON public.products;
DROP POLICY IF EXISTS "products_insert_policy" ON public.products;
DROP POLICY IF EXISTS "products_update_policy" ON public.products;
DROP POLICY IF EXISTS "products_delete_policy" ON public.products;

DROP POLICY IF EXISTS "Public access to categories" ON public.categories;
DROP POLICY IF EXISTS "Allow all on categories" ON public.categories;

DROP POLICY IF EXISTS "Public access to global_options" ON public.global_options;
DROP POLICY IF EXISTS "Allow all on global_options" ON public.global_options;

DROP POLICY IF EXISTS "Public access to collections" ON public.collections;
DROP POLICY IF EXISTS "Allow all on collections" ON public.collections;

DROP POLICY IF EXISTS "Public access to saints" ON public.saints;
DROP POLICY IF EXISTS "Allow all on saints" ON public.saints;

DROP POLICY IF EXISTS "Public access to settings" ON public.settings;
DROP POLICY IF EXISTS "Allow all on settings" ON public.settings;

DROP POLICY IF EXISTS "Public access to rosary_models" ON public.rosary_models;
DROP POLICY IF EXISTS "Allow all on rosary_models" ON public.rosary_models;

DROP POLICY IF EXISTS "Public access to customization_components" ON public.customization_components;
DROP POLICY IF EXISTS "Allow all on customization_components" ON public.customization_components;

DROP POLICY IF EXISTS "Public access to custom_builds" ON public.custom_builds;
DROP POLICY IF EXISTS "Allow all on custom_builds" ON public.custom_builds;

DROP POLICY IF EXISTS "Public access to orders" ON public.orders;
DROP POLICY IF EXISTS "Allow all on orders" ON public.orders;

DROP POLICY IF EXISTS "Public access to quotes" ON public.quotes;
DROP POLICY IF EXISTS "Allow all on quotes" ON public.quotes;

DROP POLICY IF EXISTS "Public access to transactions" ON public.transactions;
DROP POLICY IF EXISTS "Allow all on transactions" ON public.transactions;

-- ==============================================================================
-- 3. APPLY LEAST-PRIVILEGE RLS POLICIES
-- ==============================================================================

-- PRODUCTS: Public can view active products; Authenticated users have full control
DROP POLICY IF EXISTS "products_public_select" ON public.products;
DROP POLICY IF EXISTS "products_admin_all" ON public.products;
CREATE POLICY "products_public_select" ON public.products
  FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "products_admin_all" ON public.products
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- CATEGORIES: Public can view categories; Authenticated users have full control
DROP POLICY IF EXISTS "categories_public_select" ON public.categories;
DROP POLICY IF EXISTS "categories_admin_all" ON public.categories;
CREATE POLICY "categories_public_select" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "categories_admin_all" ON public.categories
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- GLOBAL OPTIONS: Public can view options; Authenticated users have full control
DROP POLICY IF EXISTS "global_options_public_select" ON public.global_options;
DROP POLICY IF EXISTS "global_options_admin_all" ON public.global_options;
CREATE POLICY "global_options_public_select" ON public.global_options
  FOR SELECT USING (true);

CREATE POLICY "global_options_admin_all" ON public.global_options
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- COLLECTIONS: Public can view active collections; Authenticated users have full control
DROP POLICY IF EXISTS "collections_public_select" ON public.collections;
DROP POLICY IF EXISTS "collections_admin_all" ON public.collections;
CREATE POLICY "collections_public_select" ON public.collections
  FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "collections_admin_all" ON public.collections
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- SAINTS: Public can view active saints; Authenticated users have full control
DROP POLICY IF EXISTS "saints_public_select" ON public.saints;
DROP POLICY IF EXISTS "saints_admin_all" ON public.saints;
CREATE POLICY "saints_public_select" ON public.saints
  FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "saints_admin_all" ON public.saints
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- SETTINGS: Public can view store settings; Authenticated users have full control
DROP POLICY IF EXISTS "settings_public_select" ON public.settings;
DROP POLICY IF EXISTS "settings_admin_all" ON public.settings;
CREATE POLICY "settings_public_select" ON public.settings
  FOR SELECT USING (true);

CREATE POLICY "settings_admin_all" ON public.settings
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ROSARY MODELS: Public can view active models; Authenticated users have full control
DROP POLICY IF EXISTS "rosary_models_public_select" ON public.rosary_models;
DROP POLICY IF EXISTS "rosary_models_admin_all" ON public.rosary_models;
CREATE POLICY "rosary_models_public_select" ON public.rosary_models
  FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "rosary_models_admin_all" ON public.rosary_models
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- CUSTOMIZATION COMPONENTS: Public can view active components; Authenticated users have full control
DROP POLICY IF EXISTS "customization_components_public_select" ON public.customization_components;
DROP POLICY IF EXISTS "customization_components_admin_all" ON public.customization_components;
CREATE POLICY "customization_components_public_select" ON public.customization_components
  FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "customization_components_admin_all" ON public.customization_components
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- CUSTOM BUILDS: Public can view and create custom builds; Authenticated users can manage
DROP POLICY IF EXISTS "custom_builds_public_select" ON public.custom_builds;
DROP POLICY IF EXISTS "custom_builds_public_insert" ON public.custom_builds;
DROP POLICY IF EXISTS "custom_builds_admin_all" ON public.custom_builds;
CREATE POLICY "custom_builds_public_select" ON public.custom_builds
  FOR SELECT USING (true);

CREATE POLICY "custom_builds_public_insert" ON public.custom_builds
  FOR INSERT WITH CHECK (true);

CREATE POLICY "custom_builds_admin_all" ON public.custom_builds
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ORDERS: Public can INSERT orders (checkout); Only authenticated users can SELECT/UPDATE/DELETE
DROP POLICY IF EXISTS "orders_public_insert" ON public.orders;
DROP POLICY IF EXISTS "orders_admin_select" ON public.orders;
DROP POLICY IF EXISTS "orders_admin_update" ON public.orders;
DROP POLICY IF EXISTS "orders_admin_delete" ON public.orders;
CREATE POLICY "orders_public_insert" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "orders_admin_select" ON public.orders
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "orders_admin_update" ON public.orders
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "orders_admin_delete" ON public.orders
  FOR DELETE USING (auth.role() = 'authenticated');

-- QUOTES: Public can INSERT quotes; Only authenticated users can SELECT/UPDATE/DELETE
DROP POLICY IF EXISTS "quotes_public_insert" ON public.quotes;
DROP POLICY IF EXISTS "quotes_admin_select" ON public.quotes;
DROP POLICY IF EXISTS "quotes_admin_update" ON public.quotes;
DROP POLICY IF EXISTS "quotes_admin_delete" ON public.quotes;
CREATE POLICY "quotes_public_insert" ON public.quotes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "quotes_admin_select" ON public.quotes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "quotes_admin_update" ON public.quotes
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "quotes_admin_delete" ON public.quotes
  FOR DELETE USING (auth.role() = 'authenticated');

-- TRANSACTIONS: Financial data is strictly restricted to authenticated users
DROP POLICY IF EXISTS "transactions_admin_select" ON public.transactions;
DROP POLICY IF EXISTS "transactions_admin_insert" ON public.transactions;
DROP POLICY IF EXISTS "transactions_admin_update" ON public.transactions;
DROP POLICY IF EXISTS "transactions_admin_delete" ON public.transactions;
CREATE POLICY "transactions_admin_select" ON public.transactions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "transactions_admin_insert" ON public.transactions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "transactions_admin_update" ON public.transactions
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "transactions_admin_delete" ON public.transactions
  FOR DELETE USING (auth.role() = 'authenticated');

-- ==============================================================================
-- 4. STORAGE BUCKETS HARDENING
-- ==============================================================================
-- Public buckets: Anyone can read assets, but only authenticated users can upload/update/delete.
-- ==============================================================================

DROP POLICY IF EXISTS "Public media access" ON storage.objects;
DROP POLICY IF EXISTS "Admin media upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin media update" ON storage.objects;
DROP POLICY IF EXISTS "Admin media delete" ON storage.objects;

CREATE POLICY "Public media access" ON storage.objects
  FOR SELECT USING (bucket_id IN ('product-images', 'saints-images', 'collections-images'));

CREATE POLICY "Admin media upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id IN ('product-images', 'saints-images', 'collections-images')
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Admin media update" ON storage.objects
  FOR UPDATE USING (
    bucket_id IN ('product-images', 'saints-images', 'collections-images')
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Admin media delete" ON storage.objects
  FOR DELETE USING (
    bucket_id IN ('product-images', 'saints-images', 'collections-images')
    AND auth.role() = 'authenticated'
  );
