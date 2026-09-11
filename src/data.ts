import { siteConfig } from './config/site';
import type { RosaryModel, CustomizationComponent } from './types';

export const COMPANY_DATA = {
  name: siteConfig.name,
  shortName: siteConfig.shortName,
  whatsapp: siteConfig.whatsapp,
  niche: siteConfig.niche,
  instagram: siteConfig.instagram,
  tiktok: siteConfig.tiktok,
  slogan: siteConfig.slogan,
  domain: siteConfig.domain,
  address: siteConfig.address,
  email: siteConfig.email,
};

export const CATEGORIES = [
  { id: 'tercos-artesanais', name: 'Terços Artesanais', subcategories: ['Todos', 'Clássico em Crochê', 'Delicado Mini', 'Dezena em Crochê'] },
  { id: 'tercos-personalizados', name: 'Terços Personalizados', subcategories: ['Personalize Agora', 'Com Nome', 'Cores Especiais'] },
  { id: 'nossa-senhora', name: 'Nossa Senhora', subcategories: ['Aparecida', 'Das Graças', 'Fátima', 'Desatadora dos Nós'] },
  { id: 'santos', name: 'Santos e Devoções', subcategories: ['São Bento', 'São Miguel Arcanjo', 'Sagrada Família', 'Santo Antônio'] },
  { id: 'infantil', name: 'Infantil & Batizado', subcategories: ['Bebê', 'Infantil', 'Lembrancinhas'] },
  { id: 'primeira-eucaristia', name: 'Primeira Eucaristia', subcategories: ['Lembranças', 'Terços Especiais'] },
  { id: 'crisma', name: 'Crisma', subcategories: ['Espírito Santo', 'Lembranças'] },
  { id: 'casamento', name: 'Casamento & Noivas', subcategories: ['Terço de Noiva', 'Lembranças Padrinhos'] },
  { id: 'pulseiras-terco', name: 'Pulseiras de Terço', subcategories: ['Regulável', 'Delicada 6mm', 'Devocionais'] },
  { id: 'presentes', name: 'Presentes & Ocasiões', subcategories: ['Caixas Presente', 'Kits Oração'] },
  { id: 'monte-seu-terco', name: 'Monte seu Terço', subcategories: ['Simulador 2D Terço', 'Simulador 2D Pulseira'] },
];

export const DEFAULT_ROSARY_MODELS: RosaryModel[] = [
  // --- TERÇOS ---
  {
    id: "model-croche-tradicional",
    name: "Terço Tradicional em Crochê",
    slug: "croche-tradicional",
    description: "Design clássico com 5 dezenas tecidas à mão ponto por ponto, suave ao toque e perfeito para a oração diária.",
    base_price: 69.90,
    product_type: 'rosary',
    is_active: true,
    display_order: 1
  },
  {
    id: "model-croche-delicado",
    name: "Terço Delicado Mini em Crochê",
    slug: "croche-delicado",
    description: "Ponto fino e contas leves 6mm, gracioso para carregar na bolsa ou presentear com carinho.",
    base_price: 54.90,
    product_type: 'rosary',
    is_active: true,
    display_order: 2
  },
  {
    id: "model-croche-noiva",
    name: "Terço de Noiva Especial em Crochê",
    slug: "croche-noiva",
    description: "Montagem nobre com fio acetinado, pérolas e cristais delicados para o altar e bênção matrimonial.",
    base_price: 139.90,
    product_type: 'rosary',
    is_active: true,
    display_order: 3
  },
  {
    id: "model-croche-infantil",
    name: "Terço Infantil / Lembrança em Crochê",
    slug: "croche-infantil",
    description: "Cores suaves e toque delicado antialérgico, ideal para batizados e primeira comunhão.",
    base_price: 49.90,
    product_type: 'rosary',
    is_active: true,
    display_order: 4
  },
  {
    id: "model-croche-dezena",
    name: "Dezena de Bolso / Carro em Crochê",
    slug: "croche-dezena",
    description: "1 dezena compacta em crochê artesanal para retrovisor, berço, cabeceira ou oração rápida.",
    base_price: 32.90,
    product_type: 'rosary',
    is_active: true,
    display_order: 5
  },
  {
    id: "model-croche-colecao",
    name: "Terço Fio Sagrado Coleção",
    slug: "croche-colecao",
    description: "Acabamentos nobres, entremeio trabalhado em banho ouro suave e caixa especial para presente.",
    base_price: 89.90,
    product_type: 'rosary',
    is_active: true,
    display_order: 6
  },
  // --- PULSEIRAS DE TERÇO ---
  {
    id: "model-pulseira-croche-regulavel",
    name: "Pulseira de Terço em Crochê Regulável",
    slug: "pulseira-croche-regulavel",
    description: "Dezena de pulso tecida com fecho deslizante em macramê, adaptável a qualquer tamanho de pulso, com medalha central e mini cruz.",
    base_price: 39.90,
    product_type: 'bracelet',
    is_active: true,
    display_order: 7
  },
  {
    id: "model-pulseira-croche-delicada",
    name: "Pulseira de Terço Delicada Mini (6mm)",
    slug: "pulseira-croche-delicada",
    description: "Contas finas de 6mm com acabamento sutil e leveza extrema, ideal para o dia a dia e composições delicadas.",
    base_price: 34.90,
    product_type: 'bracelet',
    is_active: true,
    display_order: 8
  },
  {
    id: "model-pulseira-croche-sao-bento",
    name: "Pulseira de Terço São Bento Proteção",
    slug: "pulseira-croche-sao-bento",
    description: "Dezena com medalha sagrada de São Bento resinada/esculpida, fio reforçado e pingente de cruz com resplendor.",
    base_price: 44.90,
    product_type: 'bracelet',
    is_active: true,
    display_order: 9
  },
  {
    id: "model-pulseira-croche-noiva",
    name: "Pulseira de Terço Nupcial Pérolas & Zircônia",
    slug: "pulseira-croche-noiva",
    description: "Fio nobre acetinado, pérolas iluminadas e entremeio cravejado com microzircônias para noivas e madrinhas.",
    base_price: 52.90,
    product_type: 'bracelet',
    is_active: true,
    display_order: 10
  }
];

export const DEFAULT_CUSTOMIZATION_COMPONENTS: CustomizationComponent[] = [
  // Contas / Fios Ave-Marias
  {
    id: "comp-bead-1",
    component_type: "bead",
    name: "Pérola Branca Acetinada (8mm)",
    slug: "bead-perola-branca-8mm",
    description: "Pérola com brilho suave e acabamento acetinado clássico.",
    color: "#F8F8F6",
    material: "Pérola Acetinada",
    size: "8mm",
    additional_price: 0,
    display_order: 1,
    is_active: true
  },
  {
    id: "comp-bead-1-6mm",
    component_type: "bead",
    name: "Pérola Branca Delicada (6mm)",
    slug: "bead-perola-branca-6mm",
    description: "Pérola em tamanho 6mm mais leve, perfeita para terços sutis.",
    color: "#F8F8F6",
    material: "Pérola Acetinada",
    size: "6mm",
    additional_price: 0,
    display_order: 2,
    is_active: true
  },
  {
    id: "comp-bead-2",
    component_type: "bead",
    name: "Pérola Champagne Nude (8mm)",
    slug: "bead-perola-champagne-8mm",
    description: "Tons quentes de nude e champagne com toque aveludado.",
    color: "#E8DDD0",
    material: "Pérola",
    size: "8mm",
    additional_price: 0,
    display_order: 3,
    is_active: true
  },
  {
    id: "comp-bead-2-6mm",
    component_type: "bead",
    name: "Pérola Champagne Delicada (6mm)",
    slug: "bead-perola-champagne-6mm",
    description: "Tons quentes e elegantes em proporção delicada de 6mm.",
    color: "#E8DDD0",
    material: "Pérola",
    size: "6mm",
    additional_price: 0,
    display_order: 4,
    is_active: true
  },
  {
    id: "comp-bead-3",
    component_type: "bead",
    name: "Cristal Azul Celeste Mariano (8mm)",
    slug: "bead-cristal-azul-8mm",
    description: "Cristal facetado suave com reflexos marianos luminosos.",
    color: "#5B82A6",
    material: "Cristal",
    size: "8mm",
    additional_price: 8.00,
    display_order: 5,
    is_active: true
  },
  {
    id: "comp-bead-3-6mm",
    component_type: "bead",
    name: "Cristal Azul Celeste Suave (6mm)",
    slug: "bead-cristal-azul-6mm",
    description: "Cristal facetado em azul celeste translúcido de 6mm.",
    color: "#6A8CA6",
    material: "Cristal",
    size: "6mm",
    additional_price: 7.00,
    display_order: 6,
    is_active: true
  },
  {
    id: "comp-bead-4",
    component_type: "bead",
    name: "Cristal Bisotado Transparente (8mm)",
    slug: "bead-cristal-transparente-8mm",
    description: "Transparência pura com corte brilhante que reflete a luz com delicadeza.",
    color: "#FFFFFF",
    material: "Cristal",
    size: "8mm",
    additional_price: 10.00,
    display_order: 7,
    is_active: true
  },
  {
    id: "comp-bead-7",
    component_type: "bead",
    name: "Quartzo Rosa Suave (8mm)",
    slug: "bead-quartzo-rosa-8mm",
    description: "Tom rosa suave em pedra natural, simbolizando amor materno e devoção.",
    color: "#E5B8BC",
    material: "Pedra Natural",
    size: "8mm",
    additional_price: 14.00,
    display_order: 8,
    is_active: true
  },
  {
    id: "comp-bead-6",
    component_type: "bead",
    name: "Madeira Nobre Natural (8mm)",
    slug: "bead-madeira-nobre-8mm",
    description: "Contas de madeira nobre encerada, toque rústico e acolhedor.",
    color: "#8C6239",
    material: "Madeira",
    size: "8mm",
    additional_price: 5.00,
    display_order: 9,
    is_active: true
  },

  // Contas Pai-Nossos
  {
    id: "comp-of-1",
    component_type: "our_father_bead",
    name: "Pérola Barroca Natural (10mm)",
    slug: "of-perola-barroca",
    description: "Conta em tamanho destaque com textura levemente irregular e nobre.",
    color: "#FAF7F0",
    material: "Pérola",
    size: "10mm",
    additional_price: 6.00,
    display_order: 1,
    is_active: true
  },
  {
    id: "comp-of-2",
    component_type: "our_father_bead",
    name: "Cristal Dourado Nobre (8mm)",
    slug: "of-cristal-dourado",
    description: "Brilho ouro suave para marcar os mistérios da oração.",
    color: "#CA9F53",
    material: "Cristal",
    size: "8mm",
    additional_price: 8.00,
    display_order: 2,
    is_active: true
  },
  {
    id: "comp-of-3",
    component_type: "our_father_bead",
    name: "Rosa Branca Esculpida (8mm)",
    slug: "of-rosa-resina",
    description: "Miniatura delicada de rosa talhada em relevo para os Pai-Nossos.",
    color: "#FFFFFF",
    material: "Resina Fina",
    size: "8mm",
    additional_price: 10.00,
    display_order: 3,
    is_active: true
  },
  {
    id: "comp-of-4",
    component_type: "our_father_bead",
    name: "Murano Artesanal Dourado (10mm)",
    slug: "of-murano-decorado",
    description: "Murano artesanal com detalhes dourados em espiral.",
    color: "#E6C687",
    material: "Murano",
    size: "10mm",
    additional_price: 12.00,
    display_order: 4,
    is_active: true
  },

  // Entremeios
  {
    id: "comp-cp-1",
    component_type: "centerpiece",
    name: "Nossa Senhora Aparecida (Dourado Suave)",
    slug: "centerpiece-aparecida-ouro",
    description: "Medalha com imagem de N. Sra. Aparecida e manto estilizado.",
    color: "#CA9F53",
    material: "Metal Dourado",
    size: "25mm",
    additional_price: 0,
    display_order: 1,
    is_active: true
  },
  {
    id: "comp-cp-2",
    component_type: "centerpiece",
    name: "Medalha de São Bento (Dourado)",
    slug: "centerpiece-sao-bento-ouro",
    description: "Cruz e medalha oficial de São Bento com oração de proteção no verso.",
    color: "#CA9F53",
    material: "Metal Dourado",
    size: "22mm",
    additional_price: 0,
    display_order: 2,
    is_active: true
  },
  {
    id: "comp-cp-3",
    component_type: "centerpiece",
    name: "Medalha de São Bento (Ouro Velho)",
    slug: "centerpiece-sao-bento-ouro-velho",
    description: "Acabamento vintage envelhecido com alta definição.",
    color: "#A68A56",
    material: "Metal Envelhecido",
    size: "22mm",
    additional_price: 0,
    display_order: 3,
    is_active: true
  },
  {
    id: "comp-cp-4",
    component_type: "centerpiece",
    name: "São Miguel Arcanjo (Dourado)",
    slug: "centerpiece-sao-miguel-ouro",
    description: "Representação de São Miguel com espada e escudo protetor.",
    color: "#CA9F53",
    material: "Metal Dourado",
    size: "24mm",
    additional_price: 4.00,
    display_order: 4,
    is_active: true
  },
  {
    id: "comp-cp-5",
    component_type: "centerpiece",
    name: "Nossa Senhora das Graças / Medalha Milagrosa",
    slug: "centerpiece-gracas",
    description: "Medalha Milagrosa tradicional com raios de graças.",
    color: "#CFCAC4",
    material: "Metal Prata",
    size: "22mm",
    additional_price: 0,
    display_order: 5,
    is_active: true
  },
  {
    id: "comp-cp-6",
    component_type: "centerpiece",
    name: "Sagrada Família",
    slug: "centerpiece-sagrada-familia",
    description: "Jesus, Maria e José, símbolo de união e bênção do lar.",
    color: "#CA9F53",
    material: "Metal Dourado",
    size: "24mm",
    additional_price: 5.00,
    display_order: 6,
    is_active: true
  },

  // Crucifixos
  {
    id: "comp-cr-1",
    component_type: "crucifix",
    name: "Crucifixo Barroco Dourado",
    slug: "crucifix-barroco-ouro",
    description: "Cruz barroca clássica com pontas trabalhadas e Cristo em relevo.",
    color: "#CA9F53",
    material: "Metal Dourado",
    size: "45mm",
    additional_price: 0,
    display_order: 1,
    is_active: true
  },
  {
    id: "comp-cr-2",
    component_type: "crucifix",
    name: "Crucifixo São Bento Vazado (Dourado)",
    slug: "crucifix-sao-bento-ouro",
    description: "Cruz com medalha embutida de São Bento.",
    color: "#CA9F53",
    material: "Metal Dourado",
    size: "45mm",
    additional_price: 6.00,
    display_order: 2,
    is_active: true
  },
  {
    id: "comp-cr-3",
    component_type: "crucifix",
    name: "Crucifixo São Bento (Ouro Velho)",
    slug: "crucifix-sao-bento-velho",
    description: "Acabamento antigo com detalhes refinados de oração.",
    color: "#A68A56",
    material: "Metal Envelhecido",
    size: "45mm",
    additional_price: 6.00,
    display_order: 3,
    is_active: true
  },
  {
    id: "comp-cr-4",
    component_type: "crucifix",
    name: "Crucifixo Delicado com Ponto de Luz",
    slug: "crucifix-delicado-luz",
    description: "Design fino e moderno com zircônia no centro.",
    color: "#CA9F53",
    material: "Metal Dourado",
    size: "38mm",
    additional_price: 12.00,
    display_order: 4,
    is_active: true
  },
  {
    id: "comp-cr-5",
    component_type: "crucifix",
    name: "Crucifixo Clássico Prateado",
    slug: "crucifix-classico-prata",
    description: "Acabamento em prata polida com detalhes tradicionais.",
    color: "#CFCAC4",
    material: "Metal Prata",
    size: "42mm",
    additional_price: 0,
    display_order: 5,
    is_active: true
  },

  // Extras
  {
    id: "comp-ex-1",
    component_type: "medal",
    name: "Medalha Adicional de São Bento",
    slug: "extra-medalha-sao-bento",
    description: "Mini medalha de proteção pendurada junto ao entremeio.",
    color: "#CA9F53",
    material: "Metal Dourado",
    additional_price: 7.00,
    display_order: 1,
    is_active: true
  },
  {
    id: "comp-ex-2",
    component_type: "medal",
    name: "Medalha Adicional N. Sra. Aparecida",
    slug: "extra-medalha-aparecida",
    description: "Mini medalha de Nossa Senhora com acabamento fino.",
    color: "#CA9F53",
    material: "Metal Dourado",
    additional_price: 7.00,
    display_order: 2,
    is_active: true
  },
  {
    id: "comp-ex-3",
    component_type: "letter",
    name: "Nome Personalizado em Contas Douradas",
    slug: "extra-nome-personalizado",
    description: "Adição de letrinhas metálicas com nome ou iniciais.",
    color: "#CA9F53",
    material: "Metal",
    additional_price: 10.00,
    display_order: 3,
    is_active: true
  },
  {
    id: "comp-ex-4",
    component_type: "packaging",
    name: "Caixa Especial de Linho & Veludo para Presente",
    slug: "extra-caixa-veludo",
    description: "Estojo rígido revestido em linho natural e veludo com laço artesanal.",
    color: "#F5EEE5",
    material: "Linho & Veludo",
    additional_price: 18.00,
    display_order: 4,
    is_active: true
  },
  {
    id: "comp-ex-5",
    component_type: "packaging",
    name: "Cartão Dedicatória Caligrafado à Mão",
    slug: "extra-cartao-caligrafado",
    description: "Cartão especial de bênção com mensagem personalizada.",
    color: "#FCFAF7",
    material: "Papel Algodão Especial",
    additional_price: 5.00,
    display_order: 5,
    is_active: true
  }
];

export const INITIAL_PRODUCTS: any[] = [];

