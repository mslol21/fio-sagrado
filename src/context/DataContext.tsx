import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  Product, Category, GlobalOption, ShopSettings, Transaction, Order,
  Collection, Saint, Quote, RosaryModel, CustomizationComponent, CustomBuild
} from '../types';
import { supabase } from '../lib/supabase';
import { 
  CATEGORIES as INITIAL_CATEGORIES,
  DEFAULT_ROSARY_MODELS,
  DEFAULT_CUSTOMIZATION_COMPONENTS
} from '../data';
import { siteConfig } from '../config/site';

const compressImage = (file: File, maxWidth = 1024, maxHeight = 1024, quality = 0.75): Promise<File> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                type: 'image/webp',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

interface DataContextType {
  products: Product[];
  categories: Category[];
  globalOptions: GlobalOption[];
  settings: ShopSettings;
  transactions: Transaction[];
  orders: Order[];
  collections: Collection[];
  saints: Saint[];
  quotes: Quote[];
  rosaryModels: RosaryModel[];
  customizationComponents: CustomizationComponent[];
  customBuilds: CustomBuild[];
  loading: boolean;

  // Products
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Settings
  updateSettings: (settings: ShopSettings) => Promise<void>;

  // Files
  uploadFile: (file: File) => Promise<string>;

  // Categories
  addCategory: (name: string) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Global Options
  addGlobalOption: (option: Partial<GlobalOption>) => Promise<void>;
  updateGlobalOption: (option: GlobalOption) => Promise<void>;
  deleteGlobalOption: (id: string) => Promise<void>;

  // Transactions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'created_at'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;

  // Orders
  addOrder: (order: Omit<Order, 'id' | 'status' | 'created_at'>) => Promise<string>;
  updateOrderStatus: (id: string, status: 'approved' | 'cancelled') => Promise<void>;
  updateOrderProductionStatus: (id: string, productionStatus: string) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;

  // Collections
  addCollection: (collection: Omit<Collection, 'id' | 'created_at'>) => Promise<void>;
  updateCollection: (collection: Collection) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;

  // Saints
  addSaint: (saint: Omit<Saint, 'id' | 'created_at'>) => Promise<void>;
  updateSaint: (saint: Saint) => Promise<void>;
  deleteSaint: (id: string) => Promise<void>;

  // Quotes
  addQuote: (quote: Omit<Quote, 'id' | 'status' | 'created_at'>) => Promise<void>;
  updateQuoteStatus: (id: string, status: Quote['status']) => Promise<void>;
  deleteQuote: (id: string) => Promise<void>;

  // Rosary Builder: Models
  addRosaryModel: (model: Omit<RosaryModel, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateRosaryModel: (model: RosaryModel) => Promise<void>;
  deleteRosaryModel: (id: string) => Promise<void>;

  // Rosary Builder: Components
  addCustomizationComponent: (component: Omit<CustomizationComponent, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateCustomizationComponent: (component: CustomizationComponent) => Promise<void>;
  deleteCustomizationComponent: (id: string) => Promise<void>;

  // Rosary Builder: Save Custom Build
  saveCustomBuild: (build: Omit<CustomBuild, 'id' | 'public_code' | 'created_at'>) => Promise<{ id: string; public_code: string }>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const cleanProductDescription = (text?: string): string => {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map(l => l.trim())
    .reduce((acc: string[], curr: string) => {
      if (curr === '') {
        if (acc.length > 0 && acc[acc.length - 1] !== '') acc.push('');
      } else {
        acc.push(curr);
      }
      return acc;
    }, [])
    .join('\n')
    .trim();
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [globalOptions, setGlobalOptions] = useState<GlobalOption[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [saints, setSaints] = useState<Saint[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [rosaryModels, setRosaryModels] = useState<RosaryModel[]>(DEFAULT_ROSARY_MODELS);
  const [customizationComponents, setCustomizationComponents] = useState<CustomizationComponent[]>(DEFAULT_CUSTOMIZATION_COMPONENTS);
  const [customBuilds, setCustomBuilds] = useState<CustomBuild[]>([]);

  const [settings, setSettings] = useState<ShopSettings>({
    name: siteConfig.name,
    whatsapp: siteConfig.whatsapp,
    niche: siteConfig.niche,
    instagram: siteConfig.instagram,
    tiktok: siteConfig.tiktok,
    slogan: siteConfig.slogan,
    domain: siteConfig.domain
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();

    let channel: any = null;
    try {
      channel = supabase
        .channel('db-realtime-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => fetchData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => fetchData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, () => fetchData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'collections' }, () => fetchData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'saints' }, () => fetchData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'quotes' }, () => fetchData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'rosary_models' }, () => fetchData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'customization_components' }, () => fetchData())
        .subscribe();
    } catch (err) {
      console.warn('Realtime subscription not active:', err);
    }

    return () => {
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch (_) {}
      }
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch Products
      const { data: productsData, error: pError } = await supabase
        .from('products')
        .select('*')
        .order('display_order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (pError) throw pError;

      const mappedProducts = (productsData || []).map(p => {
        const isCustomizable = !!p.is_customizable;
        const hasColorOption = isCustomizable && (p.available_colors?.includes('[HAS_COLOR_OPTION]') || false);
        const availableColors = isCustomizable ? (p.available_colors?.replace('[HAS_COLOR_OPTION]', '').trim() || '') : '';
        const imagesList = p.images && Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.image ? [p.image] : []);
        const categoriesList = p.categories && Array.isArray(p.categories) && p.categories.length > 0 ? p.categories : (p.category ? [p.category] : []);
        return {
          ...p,
          description: cleanProductDescription(p.description),
          image: p.image || imagesList[0] || '',
          images: imagesList.slice(0, 5),
          category: p.category || categoriesList[0] || '',
          categories: categoriesList,
          isCustomizable,
          isActive: p.is_active,
          isFeatured: !!p.is_featured,
          availableColors,
          hasColorOption,
          hasNameOption: isCustomizable ? !!p.has_name_option : false,
          namePrice: isCustomizable ? p.name_price : undefined,
          variations: p.variations || [],
          customizationLists: isCustomizable ? (p.customization_lists || []) : [],
          line: p.line || 'devocionais',
          availability: p.availability || 'ready',
        };
      });
      setProducts(mappedProducts);

      // Fetch Settings
      const { data: settingsData, error: sError } = await supabase
        .from('settings')
        .select('*')
        .single();

      if (sError && sError.code !== 'PGRST116') throw sError;
      if (settingsData) {
        setSettings(settingsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      // Fetch Categories
      const { data: catData } = await supabase.from('categories').select('*').order('name');
      if (catData && catData.length > 0) {
        setCategories(catData);
      } else {
        setCategories(INITIAL_CATEGORIES);
      }

      // Fetch Global Options
      const { data: optData } = await supabase.from('global_options').select('*').order('name');
      const mappedOptions = (optData || []).map(o => ({
        ...o,
        categoryIds: o.category_ids || []
      }));
      setGlobalOptions(mappedOptions);

      // Fetch Transactions
      try {
        const { data: txData, error: txError } = await supabase.from('transactions').select('*').order('date', { ascending: false });
        if (!txError && txData) setTransactions(txData);
      } catch (e) {
        console.warn("Transactions table might not exist yet.", e);
      }

      // Fetch Orders
      try {
        const { data: ordersData, error: oError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        if (!oError && ordersData) setOrders(ordersData);
      } catch (error) {
        console.warn('Orders table might not exist yet.', error);
      }

      // Fetch Collections
      try {
        const { data: colData } = await supabase
          .from('collections')
          .select('*')
          .order('display_order', { ascending: true });
        if (colData && colData.length > 0) setCollections(colData);
      } catch (e) {
        console.warn('Collections table might not exist yet.', e);
      }

      // Fetch Saints
      try {
        const { data: saintsData } = await supabase
          .from('saints')
          .select('*')
          .order('collection_number', { ascending: true });
        if (saintsData && saintsData.length > 0) setSaints(saintsData);
      } catch (e) {
        console.warn('Saints table might not exist yet.', e);
      }

      // Fetch Quotes
      try {
        const { data: quotesData } = await supabase
          .from('quotes')
          .select('*')
          .order('created_at', { ascending: false });
        if (quotesData && quotesData.length > 0) setQuotes(quotesData);
      } catch (e) {
        console.warn('Quotes table might not exist yet.', e);
      }

      // Fetch Rosary Models
      try {
        const { data: modelsData } = await supabase
          .from('rosary_models')
          .select('*')
          .order('display_order', { ascending: true });
        if (modelsData && modelsData.length > 0) {
          setRosaryModels(modelsData);
        } else {
          setRosaryModels(DEFAULT_ROSARY_MODELS);
        }
      } catch (e) {
        console.warn('rosary_models table might not exist yet. Using defaults.', e);
        setRosaryModels(DEFAULT_ROSARY_MODELS);
      }

      // Fetch Customization Components
      try {
        const { data: compData } = await supabase
          .from('customization_components')
          .select('*')
          .order('display_order', { ascending: true });
        if (compData && compData.length > 0) {
          setCustomizationComponents(compData);
        } else {
          setCustomizationComponents(DEFAULT_CUSTOMIZATION_COMPONENTS);
        }
      } catch (e) {
        console.warn('customization_components table might not exist yet. Using defaults.', e);
        setCustomizationComponents(DEFAULT_CUSTOMIZATION_COMPONENTS);
      }

      // Fetch Custom Builds (if admin)
      try {
        const { data: buildsData } = await supabase
          .from('custom_builds')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);
        if (buildsData) setCustomBuilds(buildsData);
      } catch (e) {
        console.warn('custom_builds table might not exist yet.', e);
      }

      setLoading(false);
    }
  };

  // ==================== PRODUCTS ====================

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const isCustomizable = !!(product.isCustomizable !== undefined ? product.isCustomizable : (product as any).is_customizable);
    const hasNameOption = isCustomizable ? !!(product.hasNameOption !== undefined ? product.hasNameOption : (product as any).has_name_option) : false;
    const isActive = product.isActive !== undefined ? product.isActive : (product as any).is_active;
    const hasColorOption = isCustomizable ? !!(product.hasColorOption !== undefined ? product.hasColorOption : ((product as any).available_colors?.includes('[HAS_COLOR_OPTION]') || false)) : false;
    const availableColors = isCustomizable ? (product.availableColors !== undefined ? product.availableColors : ((product as any).available_colors?.replace('[HAS_COLOR_OPTION]', '').trim() || '')) : '';

    const imagesList = product.images && product.images.length > 0 ? product.images.slice(0, 5) : (product.image ? [product.image] : []);
    const mainImage = imagesList[0] || product.image || '';
    const categoriesList = product.categories && product.categories.length > 0 ? product.categories : (product.category ? [product.category] : []);
    const mainCategory = categoriesList[0] || product.category || '';

    const fullPayload = {
      name: product.name,
      description: cleanProductDescription(product.description),
      price: product.price,
      image: mainImage,
      images: imagesList,
      category: mainCategory,
      categories: categoriesList,
      subcategory: product.subcategory,
      slug: product.slug || product.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
      sku: product.sku || null,
      line: product.line || 'devocionais',
      is_customizable: isCustomizable,
      is_active: isActive !== false,
      is_featured: !!product.isFeatured,
      available_colors: hasColorOption ? `${availableColors || ''} [HAS_COLOR_OPTION]`.trim() : (availableColors || ''),
      has_name_option: hasNameOption,
      variations: product.variations || [],
      customization_lists: isCustomizable ? (product.customizationLists || []) : [],
      name_price: isCustomizable ? (product.namePrice || null) : null,
      availability: product.availability || 'ready',
      production_days: product.production_days || null,
      stock: product.stock || 0,
      min_stock: product.min_stock || 1,
      edition_quantity: product.edition_quantity || null,
      collection_id: product.collection_id || null,
      collection_number: product.collection_number || null,
      collection_subtitle: product.collection_subtitle || null,
      saint_id: product.saint_id || null,
      promotional_price: product.promotional_price || null,
      materials: product.materials || null,
      care_instructions: product.care_instructions || null,
      display_order: product.display_order || 0,
    };

    let { error } = await supabase.from('products').insert([fullPayload]).select();

    if (error) throw error;
    fetchData();
  };

  const updateProduct = async (product: Product) => {
    const isCustomizable = !!(product.isCustomizable !== undefined ? product.isCustomizable : (product as any).is_customizable);
    const hasNameOption = isCustomizable ? !!(product.hasNameOption !== undefined ? product.hasNameOption : (product as any).has_name_option) : false;
    const isActive = product.isActive !== undefined ? product.isActive : (product as any).is_active;
    const hasColorOption = isCustomizable ? !!(product.hasColorOption !== undefined ? product.hasColorOption : ((product as any).available_colors?.includes('[HAS_COLOR_OPTION]') || false)) : false;
    const availableColors = isCustomizable ? (product.availableColors !== undefined ? product.availableColors : ((product as any).available_colors?.replace('[HAS_COLOR_OPTION]', '').trim() || '')) : '';

    const imagesList = product.images && product.images.length > 0 ? product.images.slice(0, 5) : (product.image ? [product.image] : []);
    const mainImage = imagesList[0] || product.image || '';
    const categoriesList = product.categories && product.categories.length > 0 ? product.categories : (product.category ? [product.category] : []);
    const mainCategory = categoriesList[0] || product.category || '';

    const fullPayload = {
      name: product.name,
      description: cleanProductDescription(product.description),
      price: product.price,
      image: mainImage,
      images: imagesList,
      category: mainCategory,
      categories: categoriesList,
      subcategory: product.subcategory,
      slug: product.slug || product.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
      sku: product.sku || null,
      line: product.line || 'devocionais',
      is_customizable: isCustomizable,
      is_active: isActive !== false,
      is_featured: !!product.isFeatured,
      available_colors: hasColorOption ? `${availableColors || ''} [HAS_COLOR_OPTION]`.trim() : (availableColors || ''),
      has_name_option: hasNameOption,
      variations: product.variations || [],
      customization_lists: product.customizationLists || [],
      name_price: product.namePrice || null,
      availability: product.availability || 'ready',
      production_days: product.production_days || null,
      stock: product.stock || 0,
      min_stock: product.min_stock || 1,
      edition_quantity: product.edition_quantity || null,
      collection_id: product.collection_id || null,
      collection_number: product.collection_number || null,
      collection_subtitle: product.collection_subtitle || null,
      saint_id: product.saint_id || null,
      promotional_price: product.promotional_price || null,
      materials: product.materials || null,
      care_instructions: product.care_instructions || null,
      display_order: product.display_order || 0,
    };

    const { error } = await supabase.from('products').update(fullPayload).eq('id', product.id);
    if (error) throw error;
    fetchData();
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // ==================== SETTINGS ====================

  const updateSettings = async (newSettings: ShopSettings) => {
    const { error } = await supabase
      .from('settings')
      .update(newSettings)
      .eq('id', 1);

    if (error) throw error;
    setSettings(newSettings);
  };

  // ==================== FILE UPLOAD ====================

  const uploadFile = async (file: File): Promise<string> => {
    const isImage = file.type.startsWith('image/');
    const processedFile = isImage ? await compressImage(file) : file;
    const fileExt = processedFile.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, processedFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  // ==================== CATEGORIES ====================

  const addCategory = async (name: string) => {
    const newCategory: Category = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name
    };
    const { error } = await supabase.from('categories').insert([newCategory]);
    if (error) throw error;
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = async (category: Category) => {
    const { error } = await supabase
      .from('categories')
      .update({ name: category.name })
      .eq('id', category.id);
    if (error) throw error;
    setCategories(prev => prev.map(c => c.id === category.id ? category : c));
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // ==================== GLOBAL OPTIONS ====================

  const addGlobalOption = async (option: Partial<GlobalOption>) => {
    const newOpt = {
      name: option.name || '',
      type: option.type || 'color',
      price: option.price || 0,
      image: option.image || null,
      category_ids: option.categoryIds || [],
      group: option.group || 'Entremeio'
    };
    const { data, error } = await supabase.from('global_options').insert([newOpt]).select();
    if (error) throw error;
    if (data) {
      setGlobalOptions(prev => [...prev, { ...data[0], categoryIds: data[0].category_ids || [] }]);
    }
  };

  const updateGlobalOption = async (option: GlobalOption) => {
    const payload = {
      name: option.name,
      type: option.type,
      price: option.price,
      image: option.image,
      category_ids: option.categoryIds,
      group: option.group
    };
    const { error } = await supabase.from('global_options').update(payload).eq('id', option.id);
    if (error) throw error;
    setGlobalOptions(prev => prev.map(o => o.id === option.id ? option : o));
  };

  const deleteGlobalOption = async (id: string) => {
    const { error } = await supabase.from('global_options').delete().eq('id', id);
    if (error) throw error;
    setGlobalOptions(prev => prev.filter(o => o.id !== id));
  };

  // ==================== TRANSACTIONS ====================

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('transactions').insert([transaction]).select();
    if (error) throw error;
    if (data) setTransactions(prev => [data[0], ...prev]);
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) throw error;
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // ==================== ORDERS ====================

  const addOrder = async (order: Omit<Order, 'id' | 'status' | 'created_at'>): Promise<string> => {
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        ...order,
        status: 'pending',
        production_status: 'pending'
      }])
      .select();

    if (error) throw error;
    if (data && data[0]) {
      setOrders(prev => [data[0], ...prev]);
      return data[0].id;
    }
    return '';
  };

  const updateOrderStatus = async (id: string, status: 'approved' | 'cancelled') => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) throw error;
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const updateOrderProductionStatus = async (id: string, productionStatus: string) => {
    const { error } = await supabase.from('orders').update({ production_status: productionStatus }).eq('id', id);
    if (error) throw error;
    setOrders(prev => prev.map(o => o.id === id ? { ...o, production_status: productionStatus as any } : o));
  };

  const deleteOrder = async (id: string) => {
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) throw error;
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  // ==================== COLLECTIONS ====================

  const addCollection = async (collection: Omit<Collection, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('collections').insert([collection]).select();
    if (error) throw error;
    if (data) setCollections(prev => [...prev, data[0]]);
  };

  const updateCollection = async (collection: Collection) => {
    const { error } = await supabase.from('collections').update(collection).eq('id', collection.id);
    if (error) throw error;
    setCollections(prev => prev.map(c => c.id === collection.id ? collection : c));
  };

  const deleteCollection = async (id: string) => {
    const { error } = await supabase.from('collections').delete().eq('id', id);
    if (error) throw error;
    setCollections(prev => prev.filter(c => c.id !== id));
  };

  // ==================== SAINTS ====================

  const addSaint = async (saint: Omit<Saint, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('saints').insert([saint]).select();
    if (error) throw error;
    if (data) setSaints(prev => [...prev, data[0]]);
  };

  const updateSaint = async (saint: Saint) => {
    const { error } = await supabase.from('saints').update(saint).eq('id', saint.id);
    if (error) throw error;
    setSaints(prev => prev.map(s => s.id === saint.id ? saint : s));
  };

  const deleteSaint = async (id: string) => {
    const { error } = await supabase.from('saints').delete().eq('id', id);
    if (error) throw error;
    setSaints(prev => prev.filter(s => s.id !== id));
  };

  // ==================== QUOTES ====================

  const addQuote = async (quote: Omit<Quote, 'id' | 'status' | 'created_at'>) => {
    const { error } = await supabase.from('quotes').insert([{ ...quote, status: 'new' }]);
    if (error) throw error;
  };

  const updateQuoteStatus = async (id: string, status: Quote['status']) => {
    const { error } = await supabase.from('quotes').update({ status }).eq('id', id);
    if (error) throw error;
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, status } : q));
  };

  const deleteQuote = async (id: string) => {
    const { error } = await supabase.from('quotes').delete().eq('id', id);
    if (error) throw error;
    setQuotes(prev => prev.filter(q => q.id !== id));
  };

  // ==================== ROSARY BUILDER: MODELS ====================

  const addRosaryModel = async (model: Omit<RosaryModel, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase.from('rosary_models').insert([model]).select();
    if (error) {
      // Fallback local
      const localModel: RosaryModel = {
        ...model,
        id: `model-${Date.now()}`,
        created_at: new Date().toISOString()
      };
      setRosaryModels(prev => [...prev, localModel]);
      return;
    }
    if (data && data[0]) {
      setRosaryModels(prev => [...prev, data[0]]);
    }
  };

  const updateRosaryModel = async (model: RosaryModel) => {
    const { error } = await supabase.from('rosary_models').update({
      name: model.name,
      slug: model.slug,
      description: model.description,
      image: model.image,
      base_price: model.base_price,
      layout: model.layout,
      is_active: model.is_active,
      display_order: model.display_order,
      updated_at: new Date().toISOString()
    }).eq('id', model.id);

    setRosaryModels(prev => prev.map(m => m.id === model.id ? model : m));
    if (error) console.warn('Saved rosary_model locally (table might not exist in Supabase yet).');
  };

  const deleteRosaryModel = async (id: string) => {
    const { error } = await supabase.from('rosary_models').delete().eq('id', id);
    setRosaryModels(prev => prev.filter(m => m.id !== id));
    if (error) console.warn('Deleted rosary_model locally.', error);
  };

  // ==================== ROSARY BUILDER: COMPONENTS ====================

  const addCustomizationComponent = async (component: Omit<CustomizationComponent, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase.from('customization_components').insert([component]).select();
    if (error) {
      // Fallback local
      const localComp: CustomizationComponent = {
        ...component,
        id: `comp-${Date.now()}`,
        created_at: new Date().toISOString()
      };
      setCustomizationComponents(prev => [...prev, localComp]);
      return;
    }
    if (data && data[0]) {
      setCustomizationComponents(prev => [...prev, data[0]]);
    }
  };

  const updateCustomizationComponent = async (component: CustomizationComponent) => {
    const { error } = await supabase.from('customization_components').update({
      name: component.name,
      slug: component.slug,
      component_type: component.component_type,
      description: component.description,
      image: component.image,
      color: component.color,
      material: component.material,
      size: component.size,
      additional_price: component.additional_price,
      cost: component.cost,
      stock: component.stock,
      min_stock: component.min_stock,
      units_per_product: component.units_per_product,
      display_order: component.display_order,
      compatibility: component.compatibility,
      metadata: component.metadata,
      is_active: component.is_active,
      updated_at: new Date().toISOString()
    }).eq('id', component.id);

    setCustomizationComponents(prev => prev.map(c => c.id === component.id ? component : c));
    if (error) console.warn('Saved customization_component locally.', error);
  };

  const deleteCustomizationComponent = async (id: string) => {
    const { error } = await supabase.from('customization_components').delete().eq('id', id);
    setCustomizationComponents(prev => prev.filter(c => c.id !== id));
    if (error) console.warn('Deleted customization_component locally.', error);
  };

  // ==================== ROSARY BUILDER: SAVE CUSTOM BUILD ====================

  const saveCustomBuild = async (build: Omit<CustomBuild, 'id' | 'public_code' | 'created_at'>): Promise<{ id: string; public_code: string }> => {
    const randomCode = `ES-${Math.floor(10000 + Math.random() * 90000)}`;
    try {
      const { data, error } = await supabase
        .from('custom_builds')
        .insert([{
          public_code: randomCode,
          product_type: build.product_type || 'rosary',
          model_id: build.model_id || null,
          configuration: build.configuration,
          base_price: build.base_price,
          additional_price: build.additional_price,
          total_price: build.total_price
        }])
        .select();

      if (!error && data && data[0]) {
        setCustomBuilds(prev => [data[0], ...prev]);
        return { id: data[0].id, public_code: data[0].public_code };
      }
    } catch (e) {
      console.warn('custom_builds table not available yet, using generated code locally.', e);
    }

    const localBuild: CustomBuild = {
      id: `build-${Date.now()}`,
      public_code: randomCode,
      product_type: build.product_type || 'rosary',
      model_id: build.model_id,
      configuration: build.configuration,
      base_price: build.base_price,
      additional_price: build.additional_price,
      total_price: build.total_price,
      created_at: new Date().toISOString()
    };
    setCustomBuilds(prev => [localBuild, ...prev]);
    return { id: localBuild.id, public_code: randomCode };
  };

  return (
    <DataContext.Provider value={{
      products, settings, loading, categories, globalOptions, transactions, orders,
      collections, saints, quotes, rosaryModels, customizationComponents, customBuilds,
      addProduct, updateProduct, deleteProduct, updateSettings, uploadFile,
      addCategory, updateCategory, deleteCategory,
      addGlobalOption, updateGlobalOption, deleteGlobalOption,
      addTransaction, deleteTransaction,
      addOrder, updateOrderStatus, updateOrderProductionStatus, deleteOrder,
      addCollection, updateCollection, deleteCollection,
      addSaint, updateSaint, deleteSaint,
      addQuote, updateQuoteStatus, deleteQuote,
      addRosaryModel, updateRosaryModel, deleteRosaryModel,
      addCustomizationComponent, updateCustomizationComponent, deleteCustomizationComponent,
      saveCustomBuild
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
