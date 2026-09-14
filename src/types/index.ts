export type Category = {
  id: string;
  name: string;
}

export type GlobalOption = {
  id: string;
  type: 'color' | 'assembly';
  name: string;
  price?: number;
  image?: string;
  categoryIds?: string[];
  group?: string; // e.g., 'Entremeio', 'Crucifixo'
}

export type Variation = {
  id: string;
  name: string;
  price: number;
  image: string;
}

export type CustomizationList = {
  id: string;
  title: string;
  options: string; // Comma separated
}

// Linha de negócio do Ateliê
export type ProductLine =
  | 'devocionais'
  | 'leve-sua-fe'
  | 'colecoes'
  | 'personalizados'
  | 'momentos'
  | 'presentes';

// Disponibilidade do produto
export type ProductAvailability =
  | 'ready'        // Pronta entrega
  | 'made_to_order' // Sob encomenda
  | 'limited_edition'; // Edição limitada

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[];          // Até 5 imagens por produto
  category?: string;          // Categoria principal (legado)
  categories?: string[];      // Múltiplas categorias
  subcategory?: string;
  slug?: string;              // URL amigável: terco-nossa-senhora-aparecida
  sku?: string;               // SKU: TER-APA-001
  line?: ProductLine;         // Linha de negócio
  display_order?: number;

  // Flags
  isCustomizable?: boolean;
  hasAssemblyOption?: boolean;
  hasColorOption?: boolean;
  isActive?: boolean;
  isFeatured?: boolean;

  // Personalização
  availableColors?: string;
  hasNameOption?: boolean;
  namePrice?: number;
  variations?: Variation[];
  customizationLists?: CustomizationList[];
  selectedVariation?: Variation | GlobalOption | null;

  // Disponibilidade e estoque
  availability?: ProductAvailability;
  production_days?: number;
  stock?: number;
  min_stock?: number;
  edition_quantity?: number;
  edition_number?: number;

  // Coleção
  collection_id?: string;
  collection_number?: number;
  collection_subtitle?: string;
  saint_id?: string;

  // Informações da peça
  promotional_price?: number;
  materials?: string;
  weight_grams?: number;
  dimensions?: string;
  care_instructions?: string;
  customization?: CustomizationDetails;
}

export type CustomizationDetails = {
  buildId?: string;
  code: string;
  model: string;
  selections: {
    model?: RosaryModel;
    bead?: CustomizationComponent;
    ourFather?: CustomizationComponent;
    centerpiece?: CustomizationComponent;
    crucifix?: CustomizationComponent;
    extras?: CustomizationComponent[];
    customName?: string;
    customMessage?: string;
    notes?: string;
    [key: string]: string | number | boolean | CustomizationComponent | CustomizationComponent[] | RosaryModel | undefined;
  };
}

export type CartItem = Product & {
  quantity: number;
  selectedVariation?: Variation | GlobalOption | null;
  customization?: CustomizationDetails;
}

export type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string, productName?: string) => void;
  updateQuantity: (productId: string, quantity: number, productName?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  step: 'cart' | 'checkout';
  setStep: (step: 'cart' | 'checkout') => void;
}

export type ShopSettings = {
  name: string;
  whatsapp: string;
  niche: string;
  instagram: string;
  tiktok: string;
  slogan: string;
  facebook?: string;
  address?: string;
  about_text?: string;
  about_image?: string;
  og_image?: string;
  domain?: string;
  whatsapp_message?: string;
}

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category?: string;
  date: string;
  created_at?: string;
}

// Status de pedido expandido para fluxo artesanal
export type OrderStatus = 
  | 'pending'
  | 'approved'
  | 'cancelled';

export type ProductionStatus =
  | 'pending'
  | 'awaiting_production'
  | 'in_production'
  | 'finishing'
  | 'ready'
  | 'shipped'
  | 'delivered';

export type Order = {
  id: string;
  client_name: string;
  cep: string;
  cidade_uf: string;
  payment_method: string;
  total_price: number;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    customization?: CustomizationDetails;
  }[];
  status: OrderStatus;
  production_status?: ProductionStatus;
  tracking_code?: string;
  notes?: string;
  priority?: number;
  due_date?: string;
  created_at?: string;
}

// === ENTIDADES DE COLEÇÃO & SANTOS ===

export type CollectionStatus = 'active' | 'coming_soon' | 'ended';

export type Collection = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: string;
  banner?: string;
  status: CollectionStatus;
  launch_date?: string;
  total_items?: number;
  display_order?: number;
  is_active: boolean;
  created_at?: string;
}

export type Saint = {
  id: string;
  slug: string;
  name: string;
  collection_id?: string;
  collection_number?: number;
  subtitle?: string;
  keywords?: string;    // "Proteção • Fé • Perseverança"
  history?: string;
  meaning?: string;
  curiosities?: string;
  prayer?: string;
  image?: string;
  qr_code_url?: string;
  digital_page_url?: string;
  is_active: boolean;
  created_at?: string;
}

export type QuoteStatus =
  | 'new'
  | 'contacted'
  | 'sent'
  | 'waiting'
  | 'approved'
  | 'in_production'
  | 'done'
  | 'lost';

export type Quote = {
  id: string;
  name: string;
  whatsapp: string;
  email?: string;
  event_type?: string;
  product?: string;
  quantity?: number;
  event_date?: string;
  customization?: string;
  notes?: string;
  status: QuoteStatus;
  created_at?: string;
}

// === ENTIDADES DO CONSTRUTOR VISUAL DE TERÇOS (ROSARY BUILDER) ===

export type RosaryModel = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  base_price: number;
  layout?: Record<string, unknown>;
  product_type?: 'rosary' | 'bracelet';
  is_active: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export type ComponentType = 
  | 'bead'
  | 'our_father_bead'
  | 'centerpiece'
  | 'crucifix'
  | 'medal'
  | 'letter'
  | 'packaging';

export type CustomizationComponent = {
  id: string;
  product_type?: string;
  component_type: ComponentType;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  color?: string;
  material?: string;
  size?: string;
  additional_price: number;
  cost?: number;
  stock?: number;
  min_stock?: number;
  units_per_product?: number;
  display_order?: number;
  compatibility?: {
    models?: string[];
    colors?: string[];
    [key: string]: unknown;
  };
  metadata?: Record<string, unknown>;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export type RosaryConfiguration = {
  model?: RosaryModel;
  bead?: CustomizationComponent;
  ourFather?: CustomizationComponent;
  centerpiece?: CustomizationComponent;
  crucifix?: CustomizationComponent;
  extras: CustomizationComponent[];
  builderMode?: 'terco' | 'pulseira';
  customName?: string;
  customMessage?: string;
  notes?: string;
}

export type CustomBuild = {
  id: string;
  public_code: string;
  product_type: string;
  model_id?: string;
  configuration: RosaryConfiguration;
  base_price: number;
  additional_price: number;
  total_price: number;
  created_at?: string;
}

export const TYPES_VERSION = "3.0.0";
