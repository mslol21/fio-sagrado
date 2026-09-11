-- ============================================================
-- BANCO DE DADOS COMPLETO — FIO SAGRADO
-- Execute este arquivo no Supabase SQL Editor (1-Click Run)
-- ============================================================

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABELA DE PRODUTOS
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  promotional_price NUMERIC,
  cost NUMERIC,
  image TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  category TEXT,
  categories JSONB DEFAULT '[]'::jsonb,
  subcategory TEXT,
  line TEXT DEFAULT 'devocionais',
  slug TEXT,
  sku TEXT,
  availability TEXT DEFAULT 'ready',
  production_days INTEGER DEFAULT 7,
  stock INTEGER DEFAULT 10,
  min_stock INTEGER DEFAULT 1,
  edition_quantity INTEGER,
  edition_number INTEGER,
  display_order INTEGER DEFAULT 0,
  is_customizable BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  available_colors TEXT,
  has_name_option BOOLEAN DEFAULT false,
  name_price NUMERIC,
  has_color_option BOOLEAN DEFAULT false,
  materials TEXT,
  weight_grams INTEGER,
  dimensions TEXT,
  care_instructions TEXT,
  collection_id UUID,
  collection_number INTEGER,
  collection_subtitle TEXT,
  saint_id UUID,
  variations JSONB DEFAULT '[]'::jsonb,
  customization_lists JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. TABELA DE CONFIGURAÇÕES DA LOJA
CREATE TABLE IF NOT EXISTS public.settings (
  id INT PRIMARY KEY DEFAULT 1,
  name TEXT DEFAULT 'Fio Sagrado',
  whatsapp TEXT DEFAULT '5582920006579',
  niche TEXT DEFAULT 'Terços Artesanais em Crochê & Artigos Religiosos',
  instagram TEXT DEFAULT 'fiosagrado.com.br',
  tiktok TEXT DEFAULT '@fiosagrado.com.br',
  facebook TEXT DEFAULT '',
  slogan TEXT DEFAULT 'Terços feitos à mão, ponto por ponto, com fé e carinho.',
  domain TEXT DEFAULT 'fiosagrado.com.br',
  address TEXT DEFAULT 'Ateliê em Maceió, AL • Enviamos com carinho para todo o Brasil',
  about_text TEXT DEFAULT 'A Fio Sagrado nasceu do desejo de unir a oração do Santo Rosário à beleza acolhedora do trabalho manual em crochê, transformando fios nobres e contas selecionadas em instrumentos de profunda devoção. Cada peça é confeccionada à mão, ponto por ponto, com carinho, paciência e clima de prece em Maceió/AL, sendo enviada com muito afeto para todo o Brasil.',
  about_image TEXT,
  og_image TEXT,
  whatsapp_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Inserir / atualizar configurações oficiais
INSERT INTO public.settings (
  id, name, whatsapp, niche, instagram, tiktok, slogan, domain, address, about_text
) VALUES (
  1,
  'Fio Sagrado',
  '5582920006579',
  'Terços Artesanais em Crochê & Artigos Religiosos',
  'fiosagrado.com.br',
  '@fiosagrado.com.br',
  'Terços feitos à mão, ponto por ponto, com fé e carinho.',
  'fiosagrado.com.br',
  'Ateliê em Maceió, AL • Enviamos com carinho para todo o Brasil',
  'A Fio Sagrado nasceu do desejo de unir a oração do Santo Rosário à beleza acolhedora do trabalho manual em crochê, transformando fios nobres e contas selecionadas em instrumentos de profunda devoção. Cada peça é confeccionada à mão, ponto por ponto, com carinho, paciência e clima de prece em Maceió/AL, sendo enviada com muito afeto para todo o Brasil.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  whatsapp = EXCLUDED.whatsapp,
  niche = EXCLUDED.niche,
  instagram = EXCLUDED.instagram,
  tiktok = EXCLUDED.tiktok,
  slogan = EXCLUDED.slogan,
  domain = EXCLUDED.domain,
  address = EXCLUDED.address,
  about_text = EXCLUDED.about_text;

-- 4. TABELA DE CATEGORIAS
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO public.categories (id, name) VALUES
  ('tercos-artesanais', 'Terços Artesanais'),
  ('tercos-personalizados', 'Terços Personalizados'),
  ('nossa-senhora', 'Nossa Senhora & Devoções'),
  ('santos', 'Santos & Proteção'),
  ('infantil', 'Infantil & Batizado'),
  ('primeira-eucaristia', 'Primeira Eucaristia'),
  ('crisma', 'Crisma'),
  ('casamento', 'Casamento & Noivas'),
  ('pulseiras-terco', 'Pulseiras de Terço'),
  ('presentes', 'Presentes & Caixas'),
  ('monte-seu-terco', 'Monte seu Terço')
ON CONFLICT (id) DO NOTHING;

-- 5. TABELA DE OPÇÕES GLOBAIS
CREATE TABLE IF NOT EXISTS public.global_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT,
  name TEXT NOT NULL,
  price NUMERIC DEFAULT 0,
  image TEXT,
  category_ids JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. TABELA DE PEDIDOS
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  cep TEXT,
  cidade_uf TEXT,
  payment_method TEXT DEFAULT 'Pix',
  total_price NUMERIC NOT NULL DEFAULT 0,
  items JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'pending',
  production_status TEXT DEFAULT 'pending',
  tracking_code TEXT,
  notes TEXT,
  priority INTEGER DEFAULT 0,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. TABELA DE TRANSAÇÕES FINANCEIRAS
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL, -- 'income' | 'expense'
  amount NUMERIC NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. TABELA DE COLEÇÕES
CREATE TABLE IF NOT EXISTS public.collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  banner TEXT,
  status TEXT DEFAULT 'active',
  launch_date DATE,
  total_items INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. TABELA DE SANTOS / QR CODES
CREATE TABLE IF NOT EXISTS public.saints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
  collection_number INTEGER,
  subtitle TEXT,
  keywords TEXT,
  history TEXT,
  meaning TEXT,
  curiosities TEXT,
  prayer TEXT,
  image TEXT,
  qr_code_url TEXT,
  digital_page_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. TABELA DE ORÇAMENTOS (LEADS)
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT,
  event_type TEXT,
  product TEXT,
  quantity INTEGER,
  event_date DATE,
  customization TEXT,
  notes TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. MODELOS DE TERÇO & PULSEIRA 2D (rosary_models)
CREATE TABLE IF NOT EXISTS public.rosary_models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  product_type TEXT DEFAULT 'rosary', -- 'rosary' | 'bracelet'
  description TEXT,
  image TEXT,
  base_price NUMERIC NOT NULL DEFAULT 59.90,
  layout JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO public.rosary_models (name, slug, product_type, description, base_price, display_order, is_active) VALUES
  ('Tradicional', 'tradicional', 'rosary', 'Design clássico e harmonioso com 5 dezenas completas em crochê.', 59.90, 1, true),
  ('Delicado', 'delicado', 'rosary', 'Contas menores e acabamento sutil, leve para carregar consigo.', 49.90, 2, true),
  ('Premium & Colecionador', 'premium', 'rosary', 'Acabamentos nobres, entremeio trabalhado e cristais selecionados.', 79.90, 3, true),
  ('Noiva Especial', 'noiva', 'rosary', 'Montagem refinada com cristais e pérolas translúcidas para casamento.', 119.90, 4, true),
  ('Infantil / Lembrança', 'infantil', 'rosary', 'Cores suaves e contas resistentes, ideal para batizados.', 44.90, 5, true),
  ('Dezena de Bolso / Carro', 'dezena', 'rosary', '1 dezena compacta com fecho superior.', 29.90, 6, true),
  ('Pulseira de Terço Regulável', 'pulseira-regulavel', 'bracelet', 'Pulseira de 1 dezena em crochê com nó corrediço ajustável em macramê.', 39.90, 7, true),
  ('Pulseira Delicada Marian', 'pulseira-delicada', 'bracelet', 'Pulseira minimalista com mini medalha e fecho suave.', 34.90, 8, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  product_type = EXCLUDED.product_type,
  description = EXCLUDED.description,
  base_price = EXCLUDED.base_price;

-- 12. COMPONENTES DO CONFIGURADOR 2D (customization_components)
CREATE TABLE IF NOT EXISTS public.customization_components (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_type TEXT DEFAULT 'rosary',
  component_type TEXT NOT NULL, 
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  color TEXT,
  material TEXT,
  size TEXT,
  additional_price NUMERIC DEFAULT 0,
  cost NUMERIC,
  stock INTEGER DEFAULT 100,
  min_stock INTEGER DEFAULT 5,
  units_per_product INTEGER DEFAULT 1,
  display_order INTEGER DEFAULT 0,
  compatibility JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seeds de Contas das Ave-Marias (bead)
INSERT INTO public.customization_components (component_type, name, slug, description, color, material, size, additional_price, display_order, is_active) VALUES
  ('bead', 'Pérola Branca Clássica', 'bead-perola-branca', 'Pérola com brilho suave e acabamento acetinado.', '#F8F8F6', 'Pérola', '8mm', 0.00, 1, true),
  ('bead', 'Pérola Champagne Nude', 'bead-perola-champagne', 'Tons quentes de nude e areia com toque delicado.', '#E8DDD0', 'Pérola', '8mm', 0.00, 2, true),
  ('bead', 'Cristal Azul Safira', 'bead-cristal-azul', 'Cristal de vidro facetado com reflexos marianos.', '#3B6082', 'Cristal', '8mm', 8.00, 3, true),
  ('bead', 'Cristal Bisotado Transparente', 'bead-cristal-transparente', 'Transparência pura com corte brilhante.', '#FFFFFF', 'Cristal', '8mm', 10.00, 4, true),
  ('bead', 'Ágata Verde Esmeralda', 'bead-agata-verde', 'Pedra natural com veios únicos de serenidade.', '#4A6B53', 'Pedra Natural', '8mm', 12.00, 5, true),
  ('bead', 'Madeira Nobre Natural', 'bead-madeira-nobre', 'Contas de madeira nobre encerada.', '#8C6239', 'Madeira', '8mm', 5.00, 6, true),
  ('bead', 'Quartzo Rosa Suave', 'bead-quartzo-rosa', 'Tom rosa suave, simbolizando amor e devoção.', '#E5B8BC', 'Pedra Natural', '8mm', 14.00, 7, true),
  ('bead', 'Hematita Grafite Metálica', 'bead-hematita-grafite', 'Brilho metálico cinza chumbo.', '#4A4E54', 'Pedra Natural', '8mm', 10.00, 8, true),
  ('bead', 'Terracota Artesanal', 'bead-terracota', 'Efeito cerâmica artesanal em tom terra.', '#B86548', 'Resina', '8mm', 6.00, 9, true)
ON CONFLICT (slug) DO NOTHING;

-- Seeds de Contas Pai-Nosso (our_father_bead)
INSERT INTO public.customization_components (component_type, name, slug, description, color, material, size, additional_price, display_order, is_active) VALUES
  ('our_father_bead', 'Pérola Barroca 10mm', 'of-perola-barroca', 'Conta em destaque com textura levemente irregular.', '#FAF7F0', 'Pérola', '10mm', 6.00, 1, true),
  ('our_father_bead', 'Cristal Dourado Metalizado', 'of-cristal-dourado', 'Brilho ouro radiante para marcar os mistérios.', '#D4AF37', 'Cristal', '10mm', 8.00, 2, true),
  ('our_father_bead', 'Rosa Branca em Resina', 'of-rosa-resina', 'Miniatura delicada de rosa talhada em relevo.', '#FFFFFF', 'Resina', '10mm', 10.00, 3, true),
  ('our_father_bead', 'Murano Decorado', 'of-murano-decorado', 'Murano artesanal com detalhes dourados.', '#E6C687', 'Murano', '10mm', 12.00, 4, true),
  ('our_father_bead', 'Madeira Canelada Destaque', 'of-madeira-canelada', 'Contas maiores de madeira com sulcos artesanais.', '#704824', 'Madeira', '10mm', 5.00, 5, true)
ON CONFLICT (slug) DO NOTHING;

-- Seeds de Entremeios (centerpiece)
INSERT INTO public.customization_components (component_type, name, slug, description, color, material, size, additional_price, display_order, is_active) VALUES
  ('centerpiece', 'Nossa Senhora Aparecida (Dourado)', 'centerpiece-aparecida-ouro', 'Medalha com imagem de N. Sra. Aparecida e manto estilizado.', '#D4AF37', 'Metal Dourado', '25mm', 0.00, 1, true),
  ('centerpiece', 'Medalha de São Bento (Dourado)', 'centerpiece-sao-bento-ouro', 'Cruz e medalha oficial de São Bento.', '#D4AF37', 'Metal Dourado', '22mm', 0.00, 2, true),
  ('centerpiece', 'Medalha de São Bento (Ouro Velho)', 'centerpiece-sao-bento-ouro-velho', 'Acabamento vintage envelhecido.', '#A68A56', 'Metal Envelhecido', '22mm', 0.00, 3, true),
  ('centerpiece', 'São Miguel Arcanjo (Dourado)', 'centerpiece-sao-miguel-ouro', 'Representação de São Miguel com espada e escudo.', '#D4AF37', 'Metal Dourado', '24mm', 4.00, 4, true),
  ('centerpiece', 'Nossa Senhora das Graças / Milagrosa', 'centerpiece-gracas', 'Medalha Milagrosa tradicional com raios de graças.', '#CFCAC4', 'Metal Prata', '22mm', 0.00, 5, true),
  ('centerpiece', 'Sagrada Família', 'centerpiece-sagrada-familia', 'Jesus, Maria e José, bênção do lar.', '#D4AF37', 'Metal Dourado', '24mm', 5.00, 6, true),
  ('centerpiece', 'Espírito Santo Resplendor', 'centerpiece-espirito-santo', 'Pomba da paz e chamas dos 7 dons.', '#D4AF37', 'Metal Dourado', '22mm', 4.00, 7, true)
ON CONFLICT (slug) DO NOTHING;

-- Seeds de Crucifixos (crucifix)
INSERT INTO public.customization_components (component_type, name, slug, description, color, material, size, additional_price, display_order, is_active) VALUES
  ('crucifix', 'Crucifixo Barroco Dourado', 'crucifix-barroco-ouro', 'Cruz barroca clássica com Cristo em relevo.', '#D4AF37', 'Metal Dourado', '45mm', 0.00, 1, true),
  ('crucifix', 'Crucifixo São Bento Vazado (Dourado)', 'crucifix-sao-bento-ouro', 'Cruz com medalha embutida de São Bento.', '#D4AF37', 'Metal Dourado', '45mm', 6.00, 2, true),
  ('crucifix', 'Crucifixo São Bento (Ouro Velho)', 'crucifix-sao-bento-velho', 'Acabamento antigo com detalhes refinados.', '#A68A56', 'Metal Envelhecido', '45mm', 6.00, 3, true),
  ('crucifix', 'Crucifixo Delicado com Ponto de Luz', 'crucifix-delicado-luz', 'Design fino com zircônia no centro.', '#E8D59E', 'Metal Dourado', '38mm', 12.00, 4, true),
  ('crucifix', 'Crucifixo Clássico Prateado', 'crucifix-classico-prata', 'Acabamento em prata polida tradicional.', '#CFCAC4', 'Metal Prata', '42mm', 0.00, 5, true),
  ('crucifix', 'Crucifixo Rústico Madeira & Metal', 'crucifix-madeira-metal', 'Cruz de madeira com corpo de Cristo em metal.', '#66462C', 'Madeira e Metal', '48mm', 8.00, 6, true)
ON CONFLICT (slug) DO NOTHING;

-- Seeds de Extras (medal, letter, packaging)
INSERT INTO public.customization_components (component_type, name, slug, description, color, material, additional_price, display_order, is_active) VALUES
  ('medal', 'Medalha Adicional de São Bento', 'extra-medalha-sao-bento', 'Mini medalha de proteção pendurada junto ao entremeio.', '#D4AF37', 'Metal Dourado', 7.00, 1, true),
  ('medal', 'Medalha Adicional N. Sra. Aparecida', 'extra-medalha-aparecida', 'Mini medalha de Nossa Senhora com acabamento fino.', '#D4AF37', 'Metal Dourado', 7.00, 2, true),
  ('letter', 'Nome Personalizado em Contas Douradas', 'extra-nome-personalizado', 'Adição de letrinhas metálicas com nome ou iniciais.', '#D4AF37', 'Metal', 10.00, 3, true),
  ('packaging', 'Caixa Especial de Veludo para Presente', 'extra-caixa-veludo', 'Estojo rígido revestido em veludo nobre com laço.', '#141E30', 'Veludo', 18.00, 4, true),
  ('packaging', 'Cartão Dedicatória Caligrafado à Mão', 'extra-cartao-caligrafado', 'Cartão especial de bênção com mensagem personalizada.', '#F5F2EB', 'Papel Especial', 5.00, 5, true)
ON CONFLICT (slug) DO NOTHING;

-- 13. TABELA DE BUILDS CUSTOMIZADOS (custom_builds)
CREATE TABLE IF NOT EXISTS public.custom_builds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  public_code TEXT UNIQUE NOT NULL,
  product_type TEXT DEFAULT 'rosary',
  model_id UUID REFERENCES public.rosary_models(id) ON DELETE SET NULL,
  configuration JSONB NOT NULL,
  base_price NUMERIC NOT NULL DEFAULT 0,
  additional_price NUMERIC NOT NULL DEFAULT 0,
  total_price NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 14. POLÍTICAS DE SEGURANÇA (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rosary_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customization_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_builds ENABLE ROW LEVEL SECURITY;

-- Políticas públicas de leitura e inserção
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Manage Products" ON public.products FOR ALL USING (true);

CREATE POLICY "Public Read Settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Public Manage Settings" ON public.settings FOR ALL USING (true);

CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Manage Categories" ON public.categories FOR ALL USING (true);

CREATE POLICY "Public Read Options" ON public.global_options FOR SELECT USING (true);
CREATE POLICY "Public Manage Options" ON public.global_options FOR ALL USING (true);

CREATE POLICY "Public Manage Orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Public Manage Transactions" ON public.transactions FOR ALL USING (true);
CREATE POLICY "Public Manage Collections" ON public.collections FOR ALL USING (true);
CREATE POLICY "Public Manage Saints" ON public.saints FOR ALL USING (true);
CREATE POLICY "Public Manage Quotes" ON public.quotes FOR ALL USING (true);
CREATE POLICY "Public Manage Models" ON public.rosary_models FOR ALL USING (true);
CREATE POLICY "Public Manage Components" ON public.customization_components FOR ALL USING (true);
CREATE POLICY "Public Manage Builds" ON public.custom_builds FOR ALL USING (true);

-- 15. CRIAÇÃO DO STORAGE BUCKET 'products' (Se a extensão storage existir)
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Storage Access" ON storage.objects
FOR ALL USING (bucket_id = 'products')
WITH CHECK (bucket_id = 'products');
