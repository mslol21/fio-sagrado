-- Script SQL de criação de tabelas para o Ateliê Entre Santos no Supabase

-- 1. Tabela de Produtos
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  image TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  category TEXT,
  categories JSONB DEFAULT '[]'::jsonb,
  subcategory TEXT,
  is_customizable BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  available_colors TEXT,
  has_name_option BOOLEAN DEFAULT false,
  name_price NUMERIC,
  variations JSONB DEFAULT '[]'::jsonb,
  customization_lists JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Garantir adição das novas colunas em bancos existentes
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS categories JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- 2. Tabela de Configurações da Loja
CREATE TABLE IF NOT EXISTS public.settings (
  id INT PRIMARY KEY DEFAULT 1,
  name TEXT,
  whatsapp TEXT,
  niche TEXT,
  instagram TEXT,
  tiktok TEXT,
  slogan TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Inserir configuração padrão caso não exista
INSERT INTO public.settings (id, name, whatsapp, niche, instagram, tiktok, slogan)
VALUES (1, 'Ateliê Entre Santos', '', '', '', '', '')
ON CONFLICT (id) DO NOTHING;

-- 3. Tabela de Categorias
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabela de Opções Globais
CREATE TABLE IF NOT EXISTS public.global_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT,
  name TEXT NOT NULL,
  price NUMERIC,
  image TEXT,
  category_ids JSONB DEFAULT '[]'::jsonb,
  "group" TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Tabela de Transações / Financeiro
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  type TEXT NOT NULL,
  category TEXT,
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Tabela de Pedidos
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  cep TEXT,
  cidade_uf TEXT,
  payment_method TEXT,
  total_price NUMERIC NOT NULL DEFAULT 0,
  items JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Configuração de Políticas de Acesso RLS (Row Level Security)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Liberar leitura e escrita pública para todas as tabelas (utilizando chave anon)
CREATE POLICY "Permitir tudo no products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo no settings" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo no settings_real" ON public.settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo no categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo no global_options" ON public.global_options FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo no transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo no orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

-- Storage bucket 'products' para imagens
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true) 
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Imagens públicas para download" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Permitir upload de imagens" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products');
CREATE POLICY "Permitir alteração de imagens" ON storage.objects FOR UPDATE USING (bucket_id = 'products');
CREATE POLICY "Permitir exclusão de imagens" ON storage.objects FOR DELETE USING (bucket_id = 'products');
