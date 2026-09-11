-- ============================================================
-- SCHEMA V3 — ATELIÊ ENTRE SANTOS
-- CONSTRUTOR VISUAL DE TERÇOS PERSONALIZADOS
-- Execute este arquivo no Supabase SQL Editor
-- ============================================================

-- 1. Tabela de Modelos de Terço (rosary_models)
CREATE TABLE IF NOT EXISTS public.rosary_models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  base_price NUMERIC NOT NULL DEFAULT 59.90,
  layout JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabela de Componentes de Personalização (customization_components)
CREATE TABLE IF NOT EXISTS public.customization_components (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_type TEXT DEFAULT 'rosary',
  component_type TEXT NOT NULL, 
  -- 'bead' | 'our_father_bead' | 'centerpiece' | 'crucifix' | 'medal' | 'letter' | 'packaging'
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

-- 3. Tabela de Configurações / Terços Criados (custom_builds)
CREATE TABLE IF NOT EXISTS public.custom_builds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  public_code TEXT UNIQUE NOT NULL, -- Ex: 'ES-28471'
  product_type TEXT DEFAULT 'rosary',
  model_id UUID REFERENCES public.rosary_models(id) ON DELETE SET NULL,
  configuration JSONB NOT NULL,
  base_price NUMERIC NOT NULL DEFAULT 0,
  additional_price NUMERIC NOT NULL DEFAULT 0,
  total_price NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- RLS (ROW LEVEL SECURITY)
-- ============================================================

ALTER TABLE public.rosary_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customization_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_builds ENABLE ROW LEVEL SECURITY;

-- rosary_models
CREATE POLICY "Leitura pública de modelos ativos" ON public.rosary_models 
  FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Gestão autenticada de modelos" ON public.rosary_models 
  FOR ALL USING (auth.role() = 'authenticated') 
  WITH CHECK (auth.role() = 'authenticated');

-- customization_components
CREATE POLICY "Leitura pública de componentes ativos" ON public.customization_components 
  FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Gestão autenticada de componentes" ON public.customization_components 
  FOR ALL USING (auth.role() = 'authenticated') 
  WITH CHECK (auth.role() = 'authenticated');

-- custom_builds
CREATE POLICY "Criação pública de builds" ON public.custom_builds 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Leitura pública de build por código" ON public.custom_builds 
  FOR SELECT USING (true);

CREATE POLICY "Gestão autenticada de builds" ON public.custom_builds 
  FOR ALL USING (auth.role() = 'authenticated') 
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- ÍNDICES DE PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_rosary_models_slug ON public.rosary_models(slug);
CREATE INDEX IF NOT EXISTS idx_rosary_models_is_active ON public.rosary_models(is_active);
CREATE INDEX IF NOT EXISTS idx_custom_components_type ON public.customization_components(component_type);
CREATE INDEX IF NOT EXISTS idx_custom_components_is_active ON public.customization_components(is_active);
CREATE INDEX IF NOT EXISTS idx_custom_builds_code ON public.custom_builds(public_code);

-- ============================================================
-- DADOS PADRÃO (SEED INICIAL)
-- ============================================================

-- Modelos de Terço
INSERT INTO public.rosary_models (name, slug, description, base_price, display_order, is_active)
VALUES
  ('Tradicional', 'tradicional', 'Design clássico e harmonioso com 5 dezenas completas, perfeito para o dia a dia de oração.', 59.90, 1, true),
  ('Delicado', 'delicado', 'Contas menores e acabamento sutil, leve para carregar consigo ou na bolsa.', 49.90, 2, true),
  ('Premium & Colecionador', 'premium', 'Acabamentos nobres, entremeio trabalhado e cristais selecionados.', 79.90, 3, true),
  ('Noiva Especial', 'noiva', 'Montagem refinada com cristais e pérolas translúcidas para o grande dia.', 119.90, 4, true),
  ('Infantil / Lembrança', 'infantil', 'Cores suaves e contas resistentes, ideal para batizados e primeira comunhão.', 44.90, 5, true),
  ('Dezena de Bolso / Carro', 'dezena', '1 dezena compacta em arco com fecho superior para retrovisor, bolsa ou oração rápida.', 29.90, 6, true)
ON CONFLICT (slug) DO NOTHING;

-- Contas das Ave-Marias (bead)
INSERT INTO public.customization_components (component_type, name, slug, description, color, material, size, additional_price, display_order, is_active)
VALUES
  ('bead', 'Pérola Branca Clássica', 'bead-perola-branca', 'Pérola sintética com brilho suave e acabamento acetinado.', '#F8F8F6', 'Pérola', '8mm', 0.00, 1, true),
  ('bead', 'Pérola Champagne Nude', 'bead-perola-champagne', 'Tons quentes de nude e areia com toque delicado.', '#E8DDD0', 'Pérola', '8mm', 0.00, 2, true),
  ('bead', 'Cristal Azul Safira', 'bead-cristal-azul', 'Cristal de vidro facetado com reflexos brilhantes marianos.', '#3B6082', 'Cristal', '8mm', 8.00, 3, true),
  ('bead', 'Cristal Bisotado Transparente', 'bead-cristal-transparente', 'Transparência pura com corte brilhante que reflete a luz.', '#FFFFFF', 'Cristal', '8mm', 10.00, 4, true),
  ('bead', 'Ágata Verde Esmeralda', 'bead-agata-verde', 'Pedra natural com veios únicos de esperança e serenidade.', '#4A6B53', 'Pedra Natural', '8mm', 12.00, 5, true),
  ('bead', 'Madeira Nobre Natural', 'bead-madeira-nobre', 'Contas de madeira nobre encerada, rústico e acolhedor.', '#8C6239', 'Madeira', '8mm', 5.00, 6, true),
  ('bead', 'Quartzo Rosa Suave', 'bead-quartzo-rosa', 'Tom rosa suave, simbolizando amor, carinho e intercessão.', '#E5B8BC', 'Pedra Natural', '8mm', 14.00, 7, true),
  ('bead', 'Hematita Grafite Metálica', 'bead-hematita-grafite', 'Brilho metálico cinza chumbo com presença e peso oracional.', '#4A4E54', 'Pedra Natural', '8mm', 10.00, 8, true),
  ('bead', 'Terracota Artesanal', 'bead-terracota', 'Efeito cerâmica artesanal acolhedor em tom terra.', '#B86548', 'Resina', '8mm', 6.00, 9, true)
ON CONFLICT (slug) DO NOTHING;

-- Contas dos Pai-Nossos (our_father_bead)
INSERT INTO public.customization_components (component_type, name, slug, description, color, material, size, additional_price, display_order, is_active)
VALUES
  ('our_father_bead', 'Pérola Barroca 10mm', 'of-perola-barroca', 'Conta em tamanho destaque com textura levemente irregular.', '#FAF7F0', 'Pérola', '10mm', 6.00, 1, true),
  ('our_father_bead', 'Cristal Dourado Metalizado', 'of-cristal-dourado', 'Brilho ouro radiante para marcar os mistérios da oração.', '#D4AF37', 'Cristal', '10mm', 8.00, 2, true),
  ('our_father_bead', 'Rosa Branca em Resina', 'of-rosa-resina', 'Miniatura delicada de rosa talhada em relevo.', '#FFFFFF', 'Resina', '10mm', 10.00, 3, true),
  ('our_father_bead', 'Murano Decorado', 'of-murano-decorado', 'Murano artesanal com detalhes dourados em espiral.', '#E6C687', 'Murano', '10mm', 12.00, 4, true),
  ('our_father_bead', 'Madeira Canelada Destaque', 'of-madeira-canelada', 'Contas maiores de madeira com sulcos artesanais.', '#704824', 'Madeira', '10mm', 5.00, 5, true)
ON CONFLICT (slug) DO NOTHING;

-- Entremeios / Medalhas Centrais (centerpiece)
INSERT INTO public.customization_components (component_type, name, slug, description, color, material, size, additional_price, display_order, is_active)
VALUES
  ('centerpiece', 'Nossa Senhora Aparecida (Dourado)', 'centerpiece-aparecida-ouro', 'Medalha com imagem de N. Sra. Aparecida e manto estilizado.', '#D4AF37', 'Metal Dourado', '25mm', 0.00, 1, true),
  ('centerpiece', 'Medalha de São Bento (Dourado)', 'centerpiece-sao-bento-ouro', 'Cruz e medalha oficial de São Bento com oração de proteção no verso.', '#D4AF37', 'Metal Dourado', '22mm', 0.00, 2, true),
  ('centerpiece', 'Medalha de São Bento (Ouro Velho)', 'centerpiece-sao-bento-ouro-velho', 'Acabamento vintage envelhecido com alta definição.', '#A68A56', 'Metal Envelhecido', '22mm', 0.00, 3, true),
  ('centerpiece', 'São Miguel Arcanjo (Dourado)', 'centerpiece-sao-miguel-ouro', 'Representação de São Miguel com espada e escudo protetor.', '#D4AF37', 'Metal Dourado', '24mm', 4.00, 4, true),
  ('centerpiece', 'Nossa Senhora das Graças / Milagrosa', 'centerpiece-gracas', 'Medalha Milagrosa tradicional com raios de graças.', '#CFCAC4', 'Metal Prata', '22mm', 0.00, 5, true),
  ('centerpiece', 'Sagrada Família', 'centerpiece-sagrada-familia', 'Jesus, Maria e José, símbolo de união e bênção do lar.', '#D4AF37', 'Metal Dourado', '24mm', 5.00, 6, true),
  ('centerpiece', 'São José com Menino Jesus', 'centerpiece-sao-jose', 'São José patrono das famílias e protetor.', '#D4AF37', 'Metal Dourado', '22mm', 4.00, 7, true),
  ('centerpiece', 'Espírito Santo Resplendor', 'centerpiece-espirito-santo', 'Pomba da paz e chamas dos 7 dons do Espírito Santo.', '#D4AF37', 'Metal Dourado', '22mm', 4.00, 8, true)
ON CONFLICT (slug) DO NOTHING;

-- Crucifixos (crucifix)
INSERT INTO public.customization_components (component_type, name, slug, description, color, material, size, additional_price, display_order, is_active)
VALUES
  ('crucifix', 'Crucifixo Barroco Dourado', 'crucifix-barroco-ouro', 'Cruz barroca clássica com pontas trabalhadas e Cristo em relevo.', '#D4AF37', 'Metal Dourado', '45mm', 0.00, 1, true),
  ('crucifix', 'Crucifixo São Bento Vazado (Dourado)', 'crucifix-sao-bento-ouro', 'Cruz com medalha embutida de São Bento.', '#D4AF37', 'Metal Dourado', '45mm', 6.00, 2, true),
  ('crucifix', 'Crucifixo São Bento (Ouro Velho)', 'crucifix-sao-bento-velho', 'Acabamento antigo com detalhes refinados de oração.', '#A68A56', 'Metal Envelhecido', '45mm', 6.00, 3, true),
  ('crucifix', 'Crucifixo Delicado com Ponto de Luz', 'crucifix-delicado-luz', 'Design fino e moderno com zircônia no centro.', '#E8D59E', 'Metal Dourado', '38mm', 12.00, 4, true),
  ('crucifix', 'Crucifixo Clássico Prateado', 'crucifix-classico-prata', 'Acabamento em prata polida com detalhes tradicionais.', '#CFCAC4', 'Metal Prata', '42mm', 0.00, 5, true),
  ('crucifix', 'Crucifixo Rústico Madeira & Metal', 'crucifix-madeira-metal', 'Cruz de madeira maciça com corpo de Cristo em metal.', '#66462C', 'Madeira e Metal', '48mm', 8.00, 6, true)
ON CONFLICT (slug) DO NOTHING;

-- Extras & Personalizações Adicionais (medal, letter, packaging)
INSERT INTO public.customization_components (component_type, name, slug, description, color, material, additional_price, display_order, is_active)
VALUES
  ('medal', 'Medalha Adicional de São Bento', 'extra-medalha-sao-bento', 'Mini medalha de proteção pendurada junto ao entremeio.', '#D4AF37', 'Metal Dourado', 7.00, 1, true),
  ('medal', 'Medalha Adicional N. Sra. Aparecida', 'extra-medalha-aparecida', 'Mini medalha de Nossa Senhora com acabamento fino.', '#D4AF37', 'Metal Dourado', 7.00, 2, true),
  ('letter', 'Nome Personalizado em Contas Douradas', 'extra-nome-personalizado', 'Adição de letrinhas metálicas com nome ou iniciais.', '#D4AF37', 'Metal', 10.00, 3, true),
  ('packaging', 'Caixa Especial de Veludo para Presente', 'extra-caixa-veludo', 'Estojo rígido revestido em veludo nobre com laço dourado.', '#141E30', 'Veludo', 18.00, 4, true),
  ('packaging', 'Cartão Dedicatória Caligrafado à Mão', 'extra-cartao-caligrafado', 'Cartão especial de bênção com mensagem personalizada.', '#F5F2EB', 'Papel Especial', 5.00, 5, true)
ON CONFLICT (slug) DO NOTHING;
