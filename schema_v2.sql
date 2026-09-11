-- ============================================================
-- SCHEMA V2 — ATELIÊ ENTRE SANTOS
-- Execute este arquivo no Supabase SQL Editor
-- Data: Agosto 2026
-- 
-- IMPORTANTE: Execute tudo de uma vez. As migrations usam
-- "IF NOT EXISTS" e "ADD COLUMN IF NOT EXISTS" para garantir
-- idempotência. Seguro para rodar em banco com dados existentes.
-- ============================================================

-- ============================================================
-- PARTE 1: NOVAS TABELAS
-- ============================================================

-- 1. Tabela de Coleções Entre Santos
CREATE TABLE IF NOT EXISTS public.collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  banner TEXT,
  status TEXT DEFAULT 'active',  -- active | coming_soon | ended
  launch_date DATE,
  total_items INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabela de Santos / Conteúdo Digital para QR Codes
CREATE TABLE IF NOT EXISTS public.saints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
  collection_number INTEGER,
  subtitle TEXT,
  keywords TEXT,           -- ex: "Proteção • Fé • Perseverança"
  history TEXT,
  meaning TEXT,
  curiosities TEXT,
  prayer TEXT,
  image TEXT,
  qr_code_url TEXT,        -- URL gerada para o QR Code
  digital_page_url TEXT,   -- URL da página digital: /santos/sao-bento
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabela de Orçamentos / Pedidos em Quantidade
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT,
  event_type TEXT,         -- batismo | primeira_comunhao | crisma | casamento | retiro | outro
  product TEXT,
  quantity INTEGER,
  event_date DATE,
  customization TEXT,
  notes TEXT,
  status TEXT DEFAULT 'new',
  -- new | contacted | sent | waiting | approved | in_production | done | lost
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- PARTE 2: NOVOS CAMPOS NAS TABELAS EXISTENTES
-- ============================================================

-- Tabela: products — Campos de Linha e SKU
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS line TEXT DEFAULT 'devocionais';
-- devocionais | leve-sua-fe | colecoes | personalizados | momentos | presentes
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Tabela: products — Disponibilidade
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS availability TEXT DEFAULT 'ready';
-- ready | made_to_order | limited_edition
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS production_days INTEGER DEFAULT 7;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS min_stock INTEGER DEFAULT 1;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS edition_quantity INTEGER;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS edition_number INTEGER;

-- Tabela: products — Coleção
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS collection_number INTEGER;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS collection_subtitle TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS saint_id UUID REFERENCES public.saints(id) ON DELETE SET NULL;

-- Tabela: products — Custo e Preço (custo nunca exposto ao cliente)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS cost NUMERIC;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS promotional_price NUMERIC;

-- Tabela: products — Informações da Peça
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS materials TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS weight_grams INTEGER;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS dimensions TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS care_instructions TEXT;

-- Tabela: orders — Fluxo de Produção Artesanal
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS production_status TEXT DEFAULT 'pending';
-- pending | awaiting_production | in_production | finishing | ready | shipped | delivered
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_code TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS due_date DATE;

-- Tabela: settings — Campos Expandidos
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS facebook TEXT;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS about_text TEXT;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS about_image TEXT;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS og_image TEXT;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS domain TEXT DEFAULT 'atelieentresantos.vercel.app';
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS whatsapp_message TEXT;
-- Mensagem padrão para WhatsApp de personalização

-- ============================================================
-- PARTE 3: RLS PARA NOVAS TABELAS
-- ============================================================

ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Coleções: leitura pública, escrita apenas autenticado
CREATE POLICY "Leitura pública de coleções" ON public.collections 
  FOR SELECT USING (true);

CREATE POLICY "Escrita de coleções autenticada" ON public.collections 
  FOR ALL USING (auth.role() = 'authenticated') 
  WITH CHECK (auth.role() = 'authenticated');

-- Santos: leitura pública, escrita apenas autenticado
CREATE POLICY "Leitura pública de santos" ON public.saints 
  FOR SELECT USING (true);

CREATE POLICY "Escrita de santos autenticada" ON public.saints 
  FOR ALL USING (auth.role() = 'authenticated') 
  WITH CHECK (auth.role() = 'authenticated');

-- Orçamentos: inserção pública, gestão apenas autenticado
CREATE POLICY "Inserção pública de orçamentos" ON public.quotes 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Leitura de orçamentos autenticada" ON public.quotes 
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Atualização de orçamentos autenticada" ON public.quotes 
  FOR UPDATE USING (auth.role() = 'authenticated') 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Exclusão de orçamentos autenticada" ON public.quotes 
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================================
-- PARTE 4: DADOS INICIAIS
-- ============================================================

-- Inserir primeira coleção: Guardiões da Fé
INSERT INTO public.collections (slug, name, description, status, total_items, display_order, is_active)
VALUES (
  'guardioes-da-fe',
  'Guardiões da Fé',
  'Uma coleção de peças artesanais dedicadas aos santos guardiões. Cada peça celebra um protetor da fé, trazendo sua história, significado e devoção em forma de arte.',
  'active',
  3,
  1,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Inserir santos iniciais da coleção Guardiões da Fé
-- (IDs serão gerados automaticamente)
DO $$
DECLARE
  col_id UUID;
BEGIN
  SELECT id INTO col_id FROM public.collections WHERE slug = 'guardioes-da-fe';
  
  IF col_id IS NOT NULL THEN
    INSERT INTO public.saints (slug, name, collection_id, collection_number, keywords, is_active)
    VALUES
      ('sao-bento', 'São Bento', col_id, 1, 'Proteção • Fé • Perseverança', true),
      ('sao-miguel-arcanjo', 'São Miguel Arcanjo', col_id, 2, 'Coragem • Proteção • Confiança', true),
      ('nossa-senhora-aparecida', 'Nossa Senhora Aparecida', col_id, 3, 'Fé • Esperança • Devoção', true)
    ON CONFLICT (slug) DO NOTHING;
  END IF;
END $$;

-- ============================================================
-- PARTE 5: ÍNDICES PARA PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_products_line ON public.products(line);
CREATE INDEX IF NOT EXISTS idx_products_availability ON public.products(availability);
CREATE INDEX IF NOT EXISTS idx_products_collection_id ON public.products(collection_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_collections_slug ON public.collections(slug);
CREATE INDEX IF NOT EXISTS idx_collections_is_active ON public.collections(is_active);
CREATE INDEX IF NOT EXISTS idx_saints_slug ON public.saints(slug);
CREATE INDEX IF NOT EXISTS idx_saints_collection_id ON public.saints(collection_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON public.quotes(status);
CREATE INDEX IF NOT EXISTS idx_orders_production_status ON public.orders(production_status);

-- ============================================================
-- FIM DO SCHEMA V2
-- Execute tudo acima de uma vez no Supabase SQL Editor
-- ============================================================
