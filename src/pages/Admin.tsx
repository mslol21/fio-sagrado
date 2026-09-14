import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import type { Product, GlobalOption, Category, Collection, Saint, Order, QuoteStatus, ProductLine, ProductAvailability } from '../types';
import type { User } from '@supabase/supabase-js';
import { 
  Plus, Edit2, Trash2, Save, X, ShoppingBag, Settings, ArrowLeft, Lock, 
  Palette, Grid, LineChart, LogOut, Download, LayoutDashboard, 
  FolderKanban, MessageSquareQuote, BookOpen, Layers, 
  AlertTriangle, ExternalLink, QrCode, MessageCircle, Sparkles, Search,
  Calculator
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FinancePanel } from '../components/FinancePanel';
import { CustomizerAdmin } from '../components/admin/CustomizerAdmin';
import { supabase } from '../lib/supabase';
import { siteConfig } from '../config/site';

const getColorHex = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes('areia')) return '#E2DBD0';
  if (lower.includes('bege')) return '#D4C4B5';
  if (lower.includes('off-white') || lower.includes('off white')) return '#F5F2EB';
  if (lower.includes('nude')) return '#E3C8B7';
  if (lower.includes('terracota')) return '#C06C53';
  if (lower.includes('cinza quente')) return '#9E948B';
  if (lower.includes('marrom claro')) return '#92765A';
  if (lower.includes('branco')) return '#FFFFFF';
  if (lower.includes('preto')) return '#1A1A1A';
  if (lower.includes('azul')) return '#6A8CA6';
  if (lower.includes('rosa')) return '#E0A899';
  if (lower.includes('verde')) return '#7B8E78';
  if (lower.includes('dourado') || lower.includes('ouro')) return '#D4AF37';
  return '#666666';
};

const QUOTE_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: 'Novo', color: 'bg-blue-100 text-blue-800' },
  contacted: { label: 'Em contato', color: 'bg-yellow-100 text-yellow-800' },
  sent: { label: 'Orçamento enviado', color: 'bg-purple-100 text-purple-800' },
  waiting: { label: 'Aguardando cliente', color: 'bg-amber-100 text-amber-800' },
  approved: { label: 'Aprovado', color: 'bg-emerald-100 text-emerald-800' },
  in_production: { label: 'Em produção', color: 'bg-indigo-100 text-indigo-800' },
  done: { label: 'Concluído', color: 'bg-green-100 text-green-800' },
  lost: { label: 'Perdido', color: 'bg-gray-100 text-gray-700' },
};

const PRODUCTION_STATUS_LABELS: Record<string, { label: string; color: string; next?: string }> = {
  pending: { label: 'Aguardando Pagamento', color: 'bg-yellow-100 text-yellow-800', next: 'awaiting_production' },
  awaiting_production: { label: 'Aguardando Produção', color: 'bg-orange-100 text-orange-800', next: 'in_production' },
  in_production: { label: 'Em Produção', color: 'bg-blue-100 text-blue-800', next: 'finishing' },
  finishing: { label: 'Finalização', color: 'bg-purple-100 text-purple-800', next: 'ready' },
  ready: { label: 'Pronto para Envio', color: 'bg-emerald-100 text-emerald-800', next: 'shipped' },
  shipped: { label: 'Enviado', color: 'bg-indigo-100 text-indigo-800', next: 'delivered' },
  delivered: { label: 'Entregue', color: 'bg-green-100 text-green-800' },
};

export const Admin: React.FC = () => {
  const { showToast } = useToast();
  const { 
    products, settings, categories, globalOptions, orders,
    collections, saints, quotes,
    addProduct, updateProduct, deleteProduct, updateSettings, uploadFile,
    addCategory, updateCategory, deleteCategory,
    addGlobalOption, updateGlobalOption, deleteGlobalOption,
    addTransaction, updateOrderStatus, updateOrderProductionStatus, deleteOrder,
    addCollection, updateCollection, deleteCollection,
    addSaint, updateSaint, deleteSaint,
    updateQuoteStatus, deleteQuote
  } = useData();

  type AdminTab = 
    | 'dashboard'
    | 'products' 
    | 'customizer'
    | 'orders' 
    | 'production'
    | 'quotes'
    | 'collections'
    | 'saints'
    | 'categories' 
    | 'colors' 
    | 'settings' 
    | 'finance';

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingOption, setEditingOption] = useState<GlobalOption | null>(null);
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [isAddingCollection, setIsAddingCollection] = useState(false);
  const [editingSaint, setEditingSaint] = useState<Saint | null>(null);
  const [isAddingSaint, setIsAddingSaint] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [subTab, setSubTab] = useState<'colors' | 'entremeio' | 'crucifixo' | 'outros'>('colors');
  
  // Product filter states
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState<string>('');
  
  // Product pricing calculator states
  const [costPrice, setCostPrice] = useState<number>(0);
  const [expensesPrice, setExpensesPrice] = useState<number>(0);
  const [profitMargin, setProfitMargin] = useState<number>(100);
  const [showPricingCalc, setShowPricingCalc] = useState<boolean>(true);

  // Quick pricing modal from products table
  const [quickCalcProduct, setQuickCalcProduct] = useState<Product | null>(null);
  const [quickCost, setQuickCost] = useState<number>(0);
  const [quickExpenses, setQuickExpenses] = useState<number>(0);
  const [quickMargin, setQuickMargin] = useState<number>(100);
  
  // Security state
  const [user, setUser] = useState<User | { id: string; email: string; role?: string } | null>(() => {
    if (typeof window !== 'undefined' && import.meta.env.DEV) {
      const localSession = localStorage.getItem('fio_sagrado_admin_session');
      if (localSession) {
        try {
          const parsed = JSON.parse(localSession);
          if (parsed && parsed.email) {
            return parsed;
          }
        } catch {
          localStorage.removeItem('fio_sagrado_admin_session');
        }
      }
    }
    return null;
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    // Check Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPass
      });
      if (signInError) throw signInError;
      if (data?.user) {
        setUser(data.user);
        showToast('Login realizado com sucesso!', 'success');
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Credenciais inválidas ou conta não cadastrada no Supabase.';
      setError(errMsg);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('fio_sagrado_admin_session');
      setUser(null);
      await supabase.auth.signOut();
      showToast('Sessão encerrada com sucesso.', 'info');
    } catch (err) {
      console.error('Error logging out:', err);
      setUser(null);
    }
  };

  // Form states
  const [formProduct, setFormProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    promotional_price: 0,
    image: '',
    images: [],
    category: '',
    categories: [],
    subcategory: 'Todos',
    line: 'devocionais',
    sku: '',
    availability: 'ready',
    production_days: 5,
    stock: 10,
    min_stock: 2,
    edition_quantity: undefined,
    collection_id: '',
    collection_subtitle: '',
    materials: '',
    care_instructions: '',
    isCustomizable: false,
    isActive: true,
    isFeatured: false,
    availableColors: '',
    hasNameOption: false,
    hasColorOption: false,
    variations: [],
    customizationLists: []
  });

  const [formSettings, setFormSettings] = useState(settings);
  const [prevSettings, setPrevSettings] = useState(settings);
  if (settings !== prevSettings) {
    setPrevSettings(settings);
    setFormSettings(settings);
  }

  const [formCollection, setFormCollection] = useState<Partial<Collection>>({
    name: '',
    slug: '',
    description: '',
    image: '',
    banner: '',
    status: 'active',
    total_items: 3,
    display_order: 1,
    is_active: true,
  });

  const [formSaint, setFormSaint] = useState<Partial<Saint>>({
    name: '',
    slug: '',
    collection_id: '',
    collection_number: 1,
    subtitle: '',
    keywords: '',
    history: '',
    meaning: '',
    curiosities: '',
    prayer: '',
    image: '',
    qr_code_url: '',
    digital_page_url: '',
    is_active: true,
  });

  const [formOption, setFormOption] = useState<Partial<GlobalOption>>({
    name: '',
    price: 0,
    image: '',
    categoryIds: [],
    group: 'Entremeio'
  });
  const [categoryName, setCategoryName] = useState('');

  // Product submission
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formProduct.name || formProduct.price === undefined) return;
    try {
      const payload: Partial<Product> = { ...formProduct };
      if (!payload.category && categories.length > 0) {
        payload.category = categories[0].id;
      }
      if (!payload.categories || payload.categories.length === 0) {
        payload.categories = payload.category ? [payload.category] : [];
      } else if (payload.category && !payload.categories.includes(payload.category)) {
        payload.categories = [payload.category, ...payload.categories];
      }
      payload.isActive = payload.isActive !== false;
      payload.isCustomizable = !!payload.isCustomizable;
      if (!payload.isCustomizable) {
        payload.hasNameOption = false;
        payload.hasColorOption = false;
        payload.availableColors = '';
        payload.customizationLists = [];
      }

      if (payload.description) {
        payload.description = payload.description
          .replace(/\r\n/g, '\n')
          .replace(/\r/g, '\n')
          .split('\n')
          .map((l: string) => l.trim())
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
      }

      if (editingProduct) {
        await updateProduct(payload as Product);
        showToast('Produto atualizado com sucesso!', 'success');
      } else {
        await addProduct(payload as Product);
        showToast('Novo produto cadastrado com sucesso!', 'success');
      }
      setEditingProduct(null);
      setIsAddingProduct(false);
      resetProductForm();
    } catch (error: unknown) {
      console.error('Erro ao salvar produto:', error);
      const err = error as Error;
      showToast('Erro ao salvar produto: ' + (err?.message || 'Falha no banco de dados'), 'error');
    }
  };

  const resetProductForm = () => {
    const defaultCat = categories[0]?.id || 'tercos';
    setCostPrice(0);
    setExpensesPrice(0);
    setProfitMargin(100);
    setFormProduct({
      name: '', description: '', price: 0, promotional_price: undefined, image: '', images: [],
      category: defaultCat, categories: [defaultCat], subcategory: 'Todos',
      line: 'devocionais', sku: '', availability: 'ready', production_days: 5,
      stock: 10, min_stock: 2, isCustomizable: false, isActive: true, isFeatured: false,
      availableColors: '', hasNameOption: false, hasColorOption: false,
      variations: [], customizationLists: []
    });
  };

  const startEditProduct = (product: Product) => {
    const imagesList = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);
    const categoriesList = product.categories && product.categories.length > 0 ? product.categories : (product.category ? [product.category] : []);
    const mainCat = product.category || categoriesList[0] || (categories[0]?.id || 'tercos');
    
    // Inicializar valores de referência na calculadora
    const currentPrice = product.price || 0;
    const estCost = currentPrice > 0 ? Number((currentPrice * 0.4).toFixed(2)) : 0;
    const estExp = currentPrice > 0 ? Number((currentPrice * 0.1).toFixed(2)) : 0;
    setCostPrice(estCost);
    setExpensesPrice(estExp);
    setProfitMargin(100);

    setEditingProduct(product);
    setFormProduct({
      ...product,
      images: imagesList.slice(0, 5),
      image: imagesList[0] || product.image || '',
      category: mainCat,
      categories: categoriesList.length > 0 ? categoriesList : [mainCat],
      line: product.line || 'devocionais',
      availability: product.availability || 'ready',
      stock: product.stock ?? 10,
      min_stock: product.min_stock ?? 2,
      production_days: product.production_days ?? 5,
    });
    setIsAddingProduct(true);
  };

  const openQuickCalc = (product: Product) => {
    setQuickCalcProduct(product);
    const pPrice = product.price || 0;
    setQuickCost(pPrice > 0 ? Number((pPrice * 0.4).toFixed(2)) : 0);
    setQuickExpenses(pPrice > 0 ? Number((pPrice * 0.1).toFixed(2)) : 0);
    setQuickMargin(100);
  };

  const handleSaveQuickPrice = async (newPrice: number) => {
    if (!quickCalcProduct || newPrice <= 0) return;
    try {
      await updateProduct({
        ...quickCalcProduct,
        price: newPrice
      });
      showToast(`Preço de "${quickCalcProduct.name}" atualizado para R$ ${newPrice.toFixed(2)}!`, 'success');
      setQuickCalcProduct(null);
    } catch (err: unknown) {
      const error = err as Error;
      showToast('Erro ao atualizar preço: ' + (error?.message || 'Falha no banco'), 'error');
    }
  };

  // Collection submission
  // Collection submission
  const handleCollectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCollection.name) return;
    try {
      const slug = formCollection.slug || formCollection.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
      const payload: Omit<Collection, 'id' | 'created_at'> = {
        name: formCollection.name,
        slug,
        description: formCollection.description || '',
        image: formCollection.image || '',
        banner: formCollection.banner || '',
        status: formCollection.status || 'active',
        total_items: formCollection.total_items ?? 3,
        display_order: formCollection.display_order ?? 1,
        is_active: formCollection.is_active !== false,
      };
      if (editingCollection) {
        await updateCollection({ ...payload, id: editingCollection.id });
        showToast('Coleção atualizada!', 'success');
      } else {
        await addCollection(payload);
        showToast('Coleção criada com sucesso!', 'success');
      }
      setEditingCollection(null);
      setIsAddingCollection(false);
      setFormCollection({ name: '', slug: '', description: '', image: '', banner: '', status: 'active', total_items: 3, display_order: 1, is_active: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar coleção';
      showToast('Erro ao salvar coleção: ' + msg, 'error');
    }
  };

  // Saint submission
  const handleSaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSaint.name) return;
    try {
      const slug = formSaint.slug || formSaint.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
      const digitalPage = `/santos/${slug}`;
      const payload: Omit<Saint, 'id' | 'created_at'> = { 
        name: formSaint.name,
        slug, 
        collection_id: formSaint.collection_id || undefined,
        collection_number: formSaint.collection_number || 1,
        subtitle: formSaint.subtitle || '',
        keywords: formSaint.keywords || '',
        history: formSaint.history || '',
        meaning: formSaint.meaning || '',
        curiosities: formSaint.curiosities || '',
        prayer: formSaint.prayer || '',
        image: formSaint.image || '',
        is_active: formSaint.is_active !== false,
        digital_page_url: digitalPage,
        qr_code_url: formSaint.qr_code_url || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`https://${settings.domain || siteConfig.domain}${digitalPage}`)}`
      };
      if (editingSaint) {
        await updateSaint({ ...payload, id: editingSaint.id });
        showToast('Santo atualizado!', 'success');
      } else {
        await addSaint(payload);
        showToast('Santo cadastrado com sucesso!', 'success');
      }
      setEditingSaint(null);
      setIsAddingSaint(false);
      setFormSaint({ name: '', slug: '', collection_id: '', collection_number: 1, subtitle: '', keywords: '', history: '', meaning: '', curiosities: '', prayer: '', image: '', qr_code_url: '', is_active: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar santo';
      showToast('Erro ao salvar santo: ' + msg, 'error');
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    try {
      if (editingCategory) {
        await updateCategory({ ...editingCategory, name: categoryName.trim() });
        showToast('Categoria atualizada!', 'success');
      } else {
        await addCategory(categoryName.trim());
        showToast('Categoria adicionada!', 'success');
      }
      setEditingCategory(null);
      setIsAddingCategory(false);
      setCategoryName('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar categoria';
      showToast('Erro ao salvar categoria: ' + msg, 'error');
    }
  };

  const handleOptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formOption.name?.trim()) return;
    try {
      if (editingOption) {
        await updateGlobalOption({
          ...editingOption,
          ...formOption,
          type: subTab === 'colors' ? 'color' : 'assembly'
        } as GlobalOption);
        showToast('Opção atualizada!', 'success');
      } else {
        await addGlobalOption({
          ...formOption,
          type: subTab === 'colors' ? 'color' : 'assembly'
        });
        showToast('Opção adicionada!', 'success');
      }
      setEditingOption(null);
      setIsAddingOption(false);
      setFormOption({ name: '', price: 0, image: '', categoryIds: [], group: 'Entremeio' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar opção';
      showToast('Erro ao salvar opção: ' + msg, 'error');
    }
  };

  const handleAcceptOrder = async (order: Order) => {
    try {
      await updateOrderStatus(order.id, 'approved');
      await updateOrderProductionStatus(order.id, 'in_production');
      await addTransaction({
        description: `Pedido de ${order.client_name}`,
        amount: order.total_price,
        type: 'income',
        category: 'Vendas',
        date: new Date().toISOString().split('T')[0]
      });
      showToast('Pedido aprovado e enviado para produção!', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao aceitar pedido';
      showToast('Erro ao aceitar pedido: ' + msg, 'error');
    }
  };

  const exportOrdersToCSV = () => {
    if (!orders || orders.length === 0) return;
    const headers = ['ID', 'Data', 'Cliente', 'CEP', 'Cidade/UF', 'Pagamento', 'Status', 'Produção', 'Total (BRL)'];
    const rows = orders.map(o => [
      o.id,
      o.created_at ? new Date(o.created_at).toLocaleString('pt-BR') : '',
      `"${(o.client_name || '').replace(/"/g, '""')}"`,
      o.cep,
      `"${(o.cidade_uf || '').replace(/"/g, '""')}"`,
      o.payment_method,
      o.status,
      o.production_status || 'pending',
      o.total_price ? o.total_price.toFixed(2) : '0.00'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `pedidos_fio_sagrado_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics for dashboard
  const totalRevenue = orders.filter(o => o.status === 'approved').reduce((sum, o) => sum + (o.total_price || 0), 0);
  const totalOrdersCount = orders.length;
  const inProductionCount = orders.filter(o => o.production_status === 'in_production' || o.production_status === 'awaiting_production').length;
  const lowStockProducts = products.filter(p => p.stock !== undefined && p.stock <= (p.min_stock || 1));
  const newQuotesCount = quotes.filter(q => q.status === 'new').length;

  if (!user) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gold/20 p-8 rounded-3xl max-w-md w-full shadow-premium">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-navy text-gold flex items-center justify-center border border-gold/20 shadow-md">
              <Lock size={28} />
            </div>
          </div>
          <h2 className="text-2xl font-serif font-bold text-center text-navy mb-1">Área Administrativa</h2>
          <p className="text-xs text-center text-navy/50 mb-6 uppercase tracking-widest font-bold">{settings.name || siteConfig.name}</p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl mb-4 text-center font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label-base">E-mail</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="admin@fiosagrado.com.br" 
                className="input-base" 
              />
            </div>
            <div>
              <label className="label-base">Senha</label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••" 
                className="input-base" 
              />
            </div>
            <button type="submit" disabled={loginLoading} className="btn-primary w-full justify-center mt-2 cursor-pointer">
              {loginLoading ? 'Verificando...' : 'Entrar no Painel'}
            </button>
            <div className="text-center pt-2">
              <Link to="/" className="text-xs text-navy/40 hover:text-navy transition-colors">
                <ArrowLeft size={12} className="inline mr-1" /> Voltar ao site
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream text-navy flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-navy text-white p-6 border-r border-gold/15 flex-shrink-0 min-h-screen">
        <div className="flex items-center gap-3 mb-8">
          <img
            src="/logo.png"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.endsWith('/logo.svg')) target.src = '/logo.svg';
            }}
            alt="Logo"
            className="h-10 w-auto object-contain bg-white/95 p-1 rounded-xl border border-gold/30 shadow-xs"
          />
          <div>
            <h2 className="font-serif font-bold text-base text-gold uppercase tracking-wider leading-none">Painel Admin</h2>
            <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-medium mt-1">{settings.name || siteConfig.name}</p>
          </div>
        </div>

        <nav className="space-y-1 flex-grow">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
            { id: 'products', label: 'Produtos', icon: <ShoppingBag size={18} /> },
            { id: 'customizer', label: 'Personalizador', icon: <Sparkles size={18} /> },
            { id: 'orders', label: 'Pedidos', icon: <Download size={18} />, badge: orders.filter(o => o.status === 'pending').length },
            { id: 'production', label: 'Produção (Kanban)', icon: <FolderKanban size={18} />, badge: inProductionCount },
            { id: 'quotes', label: 'Orçamentos (Leads)', icon: <MessageSquareQuote size={18} />, badge: newQuotesCount },
            { id: 'collections', label: 'Coleções', icon: <Layers size={18} /> },
            { id: 'saints', label: 'Santos / QR Code', icon: <BookOpen size={18} /> },
            { id: 'categories', label: 'Categorias', icon: <Grid size={18} /> },
            { id: 'colors', label: 'Opções Globais', icon: <Palette size={18} /> },
            { id: 'finance', label: 'Financeiro', icon: <LineChart size={18} /> },
            { id: 'settings', label: 'Configurações', icon: <Settings size={18} /> },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AdminTab)}
              className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === item.id ? 'bg-gold text-navy font-black shadow-md' : 'text-white/65 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge ? (
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${activeTab === item.id ? 'bg-navy text-white' : 'bg-gold text-navy'}`}>
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/10 space-y-2">
          <Link to="/" className="flex items-center gap-2 p-2 text-white/50 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">
            <ArrowLeft size={16} /> Ver Loja
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 p-2 text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-wider transition-colors w-full text-left">
            <LogOut size={16} /> Sair
          </button>
        </div>
      </aside>

      {/* Mobile Top Navigation */}
      <div className="md:hidden bg-navy text-white p-4 border-b border-gold/15 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-9 w-auto object-contain bg-white/95 p-0.5 rounded-lg border border-gold/30" />
          <span className="font-serif font-bold text-gold text-sm uppercase">Admin</span>
        </div>
        <select
          value={activeTab}
          onChange={e => setActiveTab(e.target.value as AdminTab)}
          className="bg-navy-light text-gold text-xs font-bold border border-gold/30 rounded-xl px-3 py-2 outline-none"
        >
          <option value="dashboard">Dashboard</option>
          <option value="products">Produtos</option>
          <option value="customizer">Personalizador (Terços 2D)</option>
          <option value="orders">Pedidos ({orders.filter(o => o.status === 'pending').length})</option>
          <option value="production">Produção ({inProductionCount})</option>
          <option value="quotes">Orçamentos ({newQuotesCount})</option>
          <option value="collections">Coleções</option>
          <option value="saints">Santos / QR Code</option>
          <option value="categories">Categorias</option>
          <option value="colors">Opções Globais</option>
          <option value="finance">Financeiro</option>
          <option value="settings">Configurações</option>
        </select>
        <button onClick={handleLogout} className="p-2 text-red-400">
          <LogOut size={18} />
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl">
        {/* TAB: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div>
              <h1 className="font-serif font-bold text-3xl text-navy mb-1">Visão Geral</h1>
              <p className="text-navy/50 text-sm">Acompanhe métricas reais de vendas, pedidos e produção.</p>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white border border-gold/15 rounded-3xl p-6 shadow-premium">
                <p className="text-[10px] text-navy/40 uppercase font-black tracking-widest mb-1">Faturamento Aprovado</p>
                <p className="text-3xl font-serif font-bold text-navy">
                  {totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
                <span className="text-[11px] text-emerald-600 font-bold mt-2 block">Vendas confirmadas</span>
              </div>

              <div className="bg-white border border-gold/15 rounded-3xl p-6 shadow-premium">
                <p className="text-[10px] text-navy/40 uppercase font-black tracking-widest mb-1">Pedidos no Total</p>
                <p className="text-3xl font-serif font-bold text-navy">{totalOrdersCount}</p>
                <span className="text-[11px] text-amber-600 font-bold mt-2 block">
                  {orders.filter(o => o.status === 'pending').length} aguardando aprovação
                </span>
              </div>

              <div className="bg-white border border-gold/15 rounded-3xl p-6 shadow-premium">
                <p className="text-[10px] text-navy/40 uppercase font-black tracking-widest mb-1">Em Produção Artesanal</p>
                <p className="text-3xl font-serif font-bold text-navy">{inProductionCount}</p>
                <span className="text-[11px] text-indigo-600 font-bold mt-2 block">Peças na bancada</span>
              </div>

              <div className="bg-white border border-gold/15 rounded-3xl p-6 shadow-premium">
                <p className="text-[10px] text-navy/40 uppercase font-black tracking-widest mb-1">Novos Orçamentos</p>
                <p className="text-3xl font-serif font-bold text-navy">{newQuotesCount}</p>
                <span className="text-[11px] text-blue-600 font-bold mt-2 block">Leads de eventos</span>
              </div>
            </div>

            {/* Alerts & Highlights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Low stock alert */}
              <div className="bg-white border border-gold/15 rounded-3xl p-6 shadow-premium">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={18} className="text-amber-500" />
                  <h3 className="font-serif font-bold text-lg text-navy">Alerta de Estoque Baixo</h3>
                </div>
                {lowStockProducts.length > 0 ? (
                  <div className="space-y-3">
                    {lowStockProducts.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-3 bg-amber-50/60 rounded-2xl border border-amber-200/50">
                        <div>
                          <p className="font-bold text-navy text-sm">{p.name}</p>
                          <p className="text-[10px] text-navy/40 uppercase">{p.sku || p.category}</p>
                        </div>
                        <span className="bg-amber-500 text-white font-black text-xs px-2.5 py-1 rounded-full">
                          {p.stock} un.
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-navy/40">Todos os produtos com estoque regular.</p>
                )}
              </div>

              {/* Quick links / shortcuts */}
              <div className="bg-white border border-gold/15 rounded-3xl p-6 shadow-premium">
                <h3 className="font-serif font-bold text-lg text-navy mb-4">Ações Rápidas</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { resetProductForm(); setEditingProduct(null); setIsAddingProduct(true); setActiveTab('products'); }} className="p-4 bg-cream/70 hover:bg-gold/10 border border-gold/15 rounded-2xl text-left transition-all">
                    <ShoppingBag size={20} className="text-gold-dark mb-2" />
                    <p className="font-bold text-xs text-navy">Novo Produto</p>
                  </button>
                  <button onClick={() => { setIsAddingCollection(true); setActiveTab('collections'); }} className="p-4 bg-cream/70 hover:bg-gold/10 border border-gold/15 rounded-2xl text-left transition-all">
                    <Layers size={20} className="text-gold-dark mb-2" />
                    <p className="font-bold text-xs text-navy">Nova Coleção</p>
                  </button>
                  <button onClick={() => { setIsAddingSaint(true); setActiveTab('saints'); }} className="p-4 bg-cream/70 hover:bg-gold/10 border border-gold/15 rounded-2xl text-left transition-all">
                    <BookOpen size={20} className="text-gold-dark mb-2" />
                    <p className="font-bold text-xs text-navy">Novo Santo/QR</p>
                  </button>
                  <button onClick={() => setActiveTab('production')} className="p-4 bg-cream/70 hover:bg-gold/10 border border-gold/15 rounded-2xl text-left transition-all">
                    <FolderKanban size={20} className="text-gold-dark mb-2" />
                    <p className="font-bold text-xs text-navy">Ver Produção</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PERSONALIZADOR (ROSARY BUILDER 2D) */}
        {activeTab === 'customizer' && <CustomizerAdmin />}

        {/* TAB: PRODUCTS */}
        {activeTab === 'products' && (() => {
          const filteredProducts = products.filter(p => {
            if (productCategoryFilter !== 'all') {
              const matchCat = p.category === productCategoryFilter || (p.categories || []).includes(productCategoryFilter);
              if (!matchCat) return false;
            }
            if (productSearch.trim()) {
              const q = productSearch.toLowerCase();
              const matchName = p.name.toLowerCase().includes(q);
              const matchSku = p.sku?.toLowerCase().includes(q);
              const matchCat = p.category?.toLowerCase().includes(q);
              if (!matchName && !matchSku && !matchCat) return false;
            }
            return true;
          });

          return (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="font-serif font-bold text-3xl text-navy">
                    Produtos ({products.length})
                  </h1>
                  <p className="text-navy/50 text-sm">Catálogo com controle de categorias, SKU, linhas e estoque.</p>
                </div>
                <button 
                  onClick={() => { resetProductForm(); setEditingProduct(null); setIsAddingProduct(true); }}
                  className="btn-primary"
                >
                  <Plus size={16} /> Novo Produto
                </button>
              </div>

              {/* Bar: Filter by Category + Search */}
              <div className="bg-white p-4 rounded-3xl border border-gold/15 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
                  {/* Category Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                    <button
                      type="button"
                      onClick={() => setProductCategoryFilter('all')}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        productCategoryFilter === 'all'
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-cream/60 border border-gold/20 text-navy/70 hover:border-gold/50'
                      }`}
                    >
                      Todas ({products.length})
                    </button>
                    {categories.map(c => {
                      const count = products.filter(p => p.category === c.id || (p.categories || []).includes(c.id)).length;
                      const isSelected = productCategoryFilter === c.id;
                      return (
                        <button
                          type="button"
                          key={c.id}
                          onClick={() => setProductCategoryFilter(c.id)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                            isSelected
                              ? 'bg-primary text-white border border-primary shadow-xs'
                              : 'bg-cream/60 border border-gold/20 text-navy/70 hover:border-gold/50'
                          }`}
                        >
                          {c.name} ({count})
                        </button>
                      );
                    })}
                  </div>

                  {/* Search Input */}
                  <div className="relative w-full sm:w-64 flex-shrink-0">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40" />
                    <input
                      type="text"
                      placeholder="Buscar por nome ou SKU..."
                      value={productSearch}
                      onChange={e => setProductSearch(e.target.value)}
                      className="input-base pl-8 py-2 text-xs"
                    />
                    {productSearch && (
                      <button
                        onClick={() => setProductSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>

                {productCategoryFilter !== 'all' && (
                  <div className="flex items-center gap-2 pt-1 border-t border-gold/10 text-xs text-navy/60">
                    <span>Filtrando por categoria:</span>
                    <span className="font-bold text-navy bg-gold/15 px-2 py-0.5 rounded-md border border-gold/25">
                      {categories.find(c => c.id === productCategoryFilter)?.name || productCategoryFilter}
                    </span>
                    <button
                      onClick={() => setProductCategoryFilter('all')}
                      className="text-gold-dark hover:underline font-bold ml-1 cursor-pointer"
                    >
                      Remover filtro
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-3xl border border-gold/15 overflow-hidden shadow-premium">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-cream/80 text-navy/40 text-[10px] uppercase font-black tracking-widest border-b border-gold/10">
                      <tr>
                        <th className="p-4">Produto & Categoria</th>
                        <th className="p-4">SKU / Linha</th>
                        <th className="p-4">Preço</th>
                        <th className="p-4">Disponibilidade</th>
                        <th className="p-4">Estoque</th>
                        <th className="p-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/10 text-sm">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-navy/50">
                            Nenhum produto encontrado nesta categoria ou pesquisa.
                            {(productCategoryFilter !== 'all' || productSearch) && (
                              <button
                                onClick={() => { setProductCategoryFilter('all'); setProductSearch(''); }}
                                className="block mx-auto mt-2 text-gold-dark hover:underline font-bold text-xs"
                              >
                                Limpar filtros
                              </button>
                            )}
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map(p => {
                          const primaryCat = categories.find(c => c.id === p.category)?.name || p.category || 'Sem Categoria';
                          const additionalCats = (p.categories || [])
                            .filter(cId => cId !== p.category)
                            .map(cId => categories.find(c => c.id === cId)?.name || cId);

                          return (
                            <tr key={p.id} className="hover:bg-cream/30 transition-colors">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <img src={p.image || '/logo.png'} alt={p.name} className="w-12 h-12 rounded-xl object-cover border border-gold/15 bg-cream" />
                                  <div>
                                    <p className="font-bold text-navy leading-snug">{p.name}</p>
                                    <div className="flex flex-wrap items-center gap-1 mt-1">
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gold/15 text-gold-dark border border-gold/25 uppercase tracking-wider">
                                        {primaryCat}
                                      </span>
                                      {additionalCats.map((catLabel, idx) => (
                                        <span key={idx} className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-navy/5 text-navy/60 border border-navy/10">
                                          +{catLabel}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <p className="font-mono text-xs font-bold text-navy/70">{p.sku || '—'}</p>
                                <span className="text-[10px] font-bold text-gold-dark uppercase">{p.line || 'devocionais'}</span>
                              </td>
                              <td className="p-4 font-bold text-navy">
                                {p.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </td>
                              <td className="p-4">
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                                  p.availability === 'made_to_order' ? 'bg-amber-100 text-amber-800' :
                                  p.availability === 'limited_edition' ? 'bg-purple-100 text-purple-800' :
                                  'bg-emerald-100 text-emerald-800'
                                }`}>
                                  {p.availability === 'made_to_order' ? 'Sob encomenda' :
                                   p.availability === 'limited_edition' ? 'Edição limitada' : 'Pronta entrega'}
                                </span>
                              </td>
                              <td className="p-4 font-bold">
                                <span className={p.stock !== undefined && p.stock <= (p.min_stock || 1) ? 'text-red-500' : 'text-navy'}>
                                  {p.stock ?? '—'} un.
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex justify-end gap-1.5">
                                  <button 
                                    type="button"
                                    onClick={() => openQuickCalc(p)} 
                                    className="p-2 hover:bg-primary/10 rounded-xl text-primary hover:text-primary-hover transition-colors cursor-pointer" 
                                    title="Calcular preço final (Custo + Despesas + Margem)"
                                  >
                                    <Calculator size={16} />
                                  </button>
                                  <button onClick={() => startEditProduct(p)} className="p-2 hover:bg-gold/10 rounded-xl text-gold-dark transition-colors cursor-pointer" title="Editar produto">
                                    <Edit2 size={16} />
                                  </button>
                                  <button onClick={() => deleteProduct(p.id)} className="p-2 hover:bg-red-50 rounded-xl text-red-500 transition-colors cursor-pointer" title="Excluir produto">
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

        {/* TAB: PRODUCTION KANBAN */}
        {activeTab === 'production' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-serif font-bold text-3xl text-navy">Produção Artesanal</h1>
              <p className="text-navy/50 text-sm">Acompanhe o fluxo de confecção das peças na bancada.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {[
                { id: 'awaiting_production', title: '1. Aguardando Produção', color: 'border-orange-200 bg-orange-50/40' },
                { id: 'in_production', title: '2. Em Produção', color: 'border-blue-200 bg-blue-50/40' },
                { id: 'finishing', title: '3. Finalização', color: 'border-purple-200 bg-purple-50/40' },
                { id: 'ready', title: '4. Pronto para Envio', color: 'border-emerald-200 bg-emerald-50/40' },
              ].map(column => {
                const columnOrders = orders.filter(o => (o.production_status || 'pending') === column.id);
                return (
                  <div key={column.id} className={`rounded-3xl border ${column.color} p-4 flex flex-col min-h-[450px]`}>
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-navy/10">
                      <h3 className="font-bold text-xs uppercase tracking-wider text-navy">{column.title}</h3>
                      <span className="bg-navy text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                        {columnOrders.length}
                      </span>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto">
                      {columnOrders.map(order => (
                        <div key={order.id} className="bg-white border border-gold/15 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-navy text-sm">{order.client_name}</span>
                            <span className="font-mono text-[10px] text-navy/40">#{order.id.slice(0, 6)}</span>
                          </div>
                          <div className="text-xs text-navy/60 space-y-1 mb-3">
                            {order.items.map((it, idx) => (
                              <p key={idx} className="line-clamp-1">• {it.quantity}x {it.name}</p>
                            ))}
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-gold/10">
                            <span className="font-bold text-xs text-navy">
                              {order.total_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                            {PRODUCTION_STATUS_LABELS[column.id]?.next && (
                              <button
                                onClick={() => updateOrderProductionStatus(order.id, PRODUCTION_STATUS_LABELS[column.id].next!)}
                                className="text-[10px] font-black bg-navy text-gold px-3 py-1 rounded-full uppercase tracking-wider hover:bg-navy-light transition-all cursor-pointer"
                              >
                                Avançar →
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      {columnOrders.length === 0 && (
                        <div className="flex items-center justify-center h-32 text-navy/30 text-xs font-bold uppercase">
                          Nenhum pedido
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: QUOTES (ORÇAMENTOS) */}
        {activeTab === 'quotes' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-serif font-bold text-3xl text-navy">Orçamentos & Leads ({quotes.length})</h1>
              <p className="text-navy/50 text-sm">Pedidos em quantidade e solicitações para eventos especiais.</p>
            </div>

            <div className="bg-white rounded-3xl border border-gold/15 overflow-hidden shadow-premium">
              {quotes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-cream/80 text-navy/40 text-[10px] uppercase font-black tracking-widest border-b border-gold/10">
                      <tr>
                        <th className="p-4">Cliente</th>
                        <th className="p-4">Evento / Produto</th>
                        <th className="p-4">Qtd. / Data</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/10 text-sm">
                      {quotes.map(q => (
                        <tr key={q.id} className="hover:bg-cream/30 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-navy">{q.name}</p>
                            <p className="text-xs text-navy/50">{q.whatsapp}</p>
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-navy">{q.product}</p>
                            <span className="text-[10px] text-gold-dark font-bold uppercase">{q.event_type}</span>
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-navy">{q.quantity ? `${q.quantity} un.` : '—'}</p>
                            <p className="text-xs text-navy/40">{q.event_date ? new Date(q.event_date).toLocaleDateString('pt-BR') : 'Data a definir'}</p>
                          </td>
                          <td className="p-4">
                            <select
                              value={q.status}
                              onChange={e => updateQuoteStatus(q.id, e.target.value as QuoteStatus)}
                              className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 outline-none cursor-pointer ${QUOTE_STATUS_LABELS[q.status]?.color || 'bg-gray-100'}`}
                            >
                              {Object.entries(QUOTE_STATUS_LABELS).map(([k, v]) => (
                                <option key={k} value={k}>{v.label}</option>
                              ))}
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <a
                                href={`https://wa.me/${q.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${q.name}! Aqui é da ${settings.name || siteConfig.name} referente ao seu orçamento de ${q.product}.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-[#25D366]/10 text-[#25D366] rounded-xl hover:bg-[#25D366]/20 transition-colors"
                                title="Conversar no WhatsApp"
                              >
                                <MessageCircle size={16} />
                              </a>
                              <button onClick={() => deleteQuote(q.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center text-navy/40 text-sm">
                  Nenhum orçamento registrado ainda. Novos leads aparecerão automaticamente aqui.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: COLLECTIONS */}
        {activeTab === 'collections' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-serif font-bold text-3xl text-navy">Coleções ({collections.length})</h1>
                <p className="text-navy/50 text-sm">Gerencie as linhas temáticas e peças colecionáveis.</p>
              </div>
              <button 
                onClick={() => { setEditingCollection(null); setFormCollection({ name: '', slug: '', description: '', image: '', banner: '', status: 'active', total_items: 3, display_order: 1, is_active: true }); setIsAddingCollection(true); }}
                className="btn-primary"
              >
                <Plus size={16} /> Nova Coleção
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {collections.map(col => (
                <div key={col.id} className="bg-white border border-gold/15 rounded-3xl overflow-hidden shadow-premium flex flex-col">
                  <div className="aspect-video bg-cream relative overflow-hidden">
                    {col.image ? (
                      <img src={col.image} alt={col.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">⚔️</div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full">
                          {col.status}
                        </span>
                        <span className="text-xs text-navy/40 font-bold">{col.total_items || 0} peças</span>
                      </div>
                      <h3 className="font-serif font-bold text-xl text-navy mb-2">{col.name}</h3>
                      <p className="text-xs text-navy/60 line-clamp-2 mb-4">{col.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gold/10">
                      <Link to={`/colecoes/${col.slug}`} target="_blank" className="text-xs font-bold text-gold-dark flex items-center gap-1 hover:underline">
                        Ver página <ExternalLink size={12} />
                      </Link>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingCollection(col); setFormCollection(col); setIsAddingCollection(true); }} className="p-2 text-gold-dark hover:bg-gold/10 rounded-xl">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => deleteCollection(col.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: SAINTS / DIGITAL CONTENT */}
        {activeTab === 'saints' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-serif font-bold text-3xl text-navy">Santos & Conteúdo Digital ({saints.length})</h1>
                <p className="text-navy/50 text-sm">Páginas de oração e histórias vinculadas aos QR Codes dos produtos.</p>
              </div>
              <button 
                onClick={() => { setEditingSaint(null); setFormSaint({ name: '', slug: '', collection_id: '', collection_number: 1, subtitle: '', keywords: '', history: '', meaning: '', curiosities: '', prayer: '', image: '', is_active: true }); setIsAddingSaint(true); }}
                className="btn-primary"
              >
                <Plus size={16} /> Novo Santo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {saints.map(saint => (
                <div key={saint.id} className="bg-white border border-gold/15 rounded-3xl p-6 shadow-premium flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center font-serif font-bold text-gold-dark">
                        Nº{saint.collection_number || 1}
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-lg text-navy">{saint.name}</h3>
                        <p className="text-[10px] text-navy/40 uppercase font-bold">{saint.keywords || 'Devoção'}</p>
                      </div>
                    </div>
                    {saint.history && <p className="text-xs text-navy/60 line-clamp-3 mb-4">{saint.history}</p>}
                  </div>

                  <div className="pt-4 border-t border-gold/10 flex items-center justify-between">
                    <Link to={`/santos/${saint.slug}`} target="_blank" className="text-xs font-bold text-gold-dark flex items-center gap-1 hover:underline">
                      <QrCode size={14} /> /santos/{saint.slug}
                    </Link>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingSaint(saint); setFormSaint(saint); setIsAddingSaint(true); }} className="p-2 text-gold-dark hover:bg-gold/10 rounded-xl">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => deleteSaint(saint.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-serif font-bold text-3xl text-navy">Categorias ({categories.length})</h1>
                <p className="text-navy/50 text-sm">Organize as categorias da loja.</p>
              </div>
              <button
                onClick={() => { setEditingCategory(null); setCategoryName(''); setIsAddingCategory(true); }}
                className="btn-primary"
              >
                <Plus size={16} /> Nova Categoria
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-gold/15 overflow-hidden shadow-premium">
              <div className="divide-y divide-gold/10">
                {categories.map(c => {
                  const linkedCount = products.filter(p => p.category === c.id || (p.categories || []).includes(c.id)).length;
                  return (
                    <div key={c.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-cream/30 transition-colors">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <p className="font-bold text-navy text-base">{c.name}</p>
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-navy/5 text-navy/50">{c.id}</span>
                        </div>
                        <p className="text-xs text-navy/50 mt-1">
                          {linkedCount} {linkedCount === 1 ? 'produto cadastrado' : 'produtos cadastrados'} nesta categoria
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setProductCategoryFilter(c.id);
                            setActiveTab('products');
                          }}
                          className="hidden sm:inline-flex px-3 py-1.5 rounded-xl border border-gold/25 text-xs font-bold text-gold-dark hover:bg-gold/10 transition-colors cursor-pointer"
                        >
                          Ver Produtos ({linkedCount})
                        </button>
                        <button onClick={() => { setEditingCategory(c); setCategoryName(c.name); setIsAddingCategory(true); }} className="p-2 text-gold-dark hover:bg-gold/10 rounded-xl" title="Editar categoria">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => deleteCategory(c.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl" title="Excluir categoria">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB: GLOBAL OPTIONS */}
        {activeTab === 'colors' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-serif font-bold text-3xl text-navy">Opções Globais & Cores ({globalOptions.length})</h1>
                <p className="text-navy/50 text-sm">Cores, entremeios e crucifixos para personalização.</p>
              </div>
              <button
                onClick={() => { setEditingOption(null); setFormOption({ name: '', price: 0, image: '', categoryIds: [], group: 'Entremeio' }); setIsAddingOption(true); }}
                className="btn-primary"
              >
                <Plus size={16} /> Nova Opção
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              {(['colors', 'entremeio', 'crucifixo', 'outros'] as const).map(tabKey => (
                <button
                  key={tabKey}
                  onClick={() => setSubTab(tabKey)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    subTab === tabKey ? 'bg-navy text-white' : 'bg-white border border-gold/15 text-navy/60'
                  }`}
                >
                  {tabKey === 'colors' ? 'Cores' : tabKey.charAt(0).toUpperCase() + tabKey.slice(1)}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {globalOptions
                .filter(o => subTab === 'colors' ? o.type === 'color' : o.type === 'assembly' && (o.group?.toLowerCase() === subTab || (subTab === 'outros' && o.group !== 'Entremeio' && o.group !== 'Crucifixo')))
                .map(opt => (
                  <div key={opt.id} className="bg-white border border-gold/15 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                    <div>
                      {opt.type === 'color' ? (
                        <div className="w-10 h-10 rounded-full border border-gold/25 mb-3" style={{ backgroundColor: getColorHex(opt.name) }} />
                      ) : opt.image ? (
                        <img src={opt.image} alt={opt.name} className="w-12 h-12 rounded-xl object-cover mb-3" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold-dark mb-3">✦</div>
                      )}
                      <p className="font-bold text-navy text-sm">{opt.name}</p>
                      {opt.price ? <p className="text-xs text-gold-dark font-bold">+ {opt.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p> : null}
                    </div>
                    <div className="flex justify-end gap-1 pt-3 border-t border-gold/10 mt-3">
                      <button onClick={() => { setEditingOption(opt); setFormOption(opt); setIsAddingOption(true); }} className="p-1.5 text-gold-dark hover:bg-gold/10 rounded-lg">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => deleteGlobalOption(opt.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB: ORDERS (PEDIDOS) */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif font-bold text-3xl text-navy">Histórico de Pedidos ({orders.length})</h1>
                <p className="text-navy/50 text-sm">Gerencie o status e exporte relatórios em CSV.</p>
              </div>
              <button onClick={exportOrdersToCSV} className="btn-primary flex items-center gap-2">
                <Download size={16} /> Exportar CSV
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-gold/15 overflow-hidden shadow-premium p-6">
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="border border-gold/15 rounded-2xl p-5 hover:border-gold/30 transition-all flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-serif font-bold text-navy text-base">{order.client_name}</span>
                        <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                          order.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status === 'approved' ? 'Aprovado' : order.status === 'cancelled' ? 'Cancelado' : 'Pendente'}
                        </span>
                      </div>
                      <p className="text-xs text-navy/50 mb-3">{order.cidade_uf || order.cep} • {order.payment_method}</p>
                      <div className="space-y-1">
                        {order.items.map((it, idx) => (
                          <span key={idx} className="inline-block bg-cream text-navy/70 text-xs px-2.5 py-1 rounded-lg mr-2 mb-1">
                            {it.quantity}x {it.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex md:flex-col justify-between items-end gap-3 border-t md:border-t-0 md:border-l border-gold/10 pt-3 md:pt-0 md:pl-6">
                      <span className="font-serif font-bold text-2xl text-navy">
                        {order.total_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <button onClick={() => handleAcceptOrder(order)} className="btn-primary text-xs py-2 px-4">
                            Aprovar Pedido
                          </button>
                        )}
                        <button onClick={() => deleteOrder(order.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl" title="Excluir">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: FINANCEIRO */}
        {activeTab === 'finance' && <FinancePanel />}

        {/* TAB: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h1 className="font-serif font-bold text-3xl text-navy mb-1">Configurações da Loja</h1>
              <p className="text-navy/50 text-sm">Personalize os dados institucionais e canais de contato.</p>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                await updateSettings(formSettings);
                showToast('Configurações atualizadas com sucesso!', 'success');
              } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : 'Erro ao atualizar configurações';
                showToast('Erro ao atualizar: ' + msg, 'error');
              }
            }} className="bg-white rounded-3xl border border-gold/15 p-8 shadow-premium space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-base">Nome da Loja</label>
                  <input type="text" value={formSettings.name} onChange={e => setFormSettings({...formSettings, name: e.target.value})} className="input-base" />
                </div>
                <div>
                  <label className="label-base">WhatsApp (com DDD)</label>
                  <input type="text" value={formSettings.whatsapp} onChange={e => setFormSettings({...formSettings, whatsapp: e.target.value})} className="input-base" />
                </div>
              </div>

              <div>
                <label className="label-base">Slogan Institucional</label>
                <input type="text" value={formSettings.slogan} onChange={e => setFormSettings({...formSettings, slogan: e.target.value})} className="input-base" />
              </div>

              <div>
                <label className="label-base">História do Ateliê (/nossa-historia)</label>
                <textarea rows={6} value={formSettings.about_text || ''} onChange={e => setFormSettings({...formSettings, about_text: e.target.value})} placeholder="Conte a história do Ateliê, processo artesanal e propósito..." className="input-base resize-none" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-base">Instagram (@)</label>
                  <input type="text" value={formSettings.instagram} onChange={e => setFormSettings({...formSettings, instagram: e.target.value})} className="input-base" />
                </div>
                <div>
                  <label className="label-base">Domínio Oficial</label>
                  <input type="text" value={formSettings.domain || ''} onChange={e => setFormSettings({...formSettings, domain: e.target.value})} placeholder={siteConfig.domain} className="input-base" />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full justify-center">
                <Save size={16} /> Salvar Configurações
              </button>
            </form>
          </div>
        )}
      </main>

      {/* MODAL: ADD / EDIT PRODUCT */}
      <AnimatePresence>
        {isAddingProduct && (
          <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl border border-gold/20 p-8 max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gold/15">
                <h2 className="font-serif font-bold text-2xl text-navy">{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
                <button onClick={() => setIsAddingProduct(false)} className="p-2 text-navy/40 hover:text-navy rounded-full">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleProductSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label-base">Nome do Produto *</label>
                    <input required type="text" value={formProduct.name} onChange={e => setFormProduct({...formProduct, name: e.target.value})} className="input-base" />
                  </div>
                  <div>
                    <label className="label-base">SKU (Ex: TER-APA-001)</label>
                    <input type="text" value={formProduct.sku || ''} onChange={e => setFormProduct({...formProduct, sku: e.target.value})} className="input-base" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="label-base mb-0">Categoria do Produto *</label>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCategory(null);
                          setCategoryName('');
                          setIsAddingCategory(true);
                        }}
                        className="text-[11px] text-gold-dark hover:underline font-bold cursor-pointer"
                      >
                        + Nova Categoria
                      </button>
                    </div>
                    <select
                      required
                      value={formProduct.category || ''}
                      onChange={e => {
                        const newCat = e.target.value;
                        setFormProduct(prev => {
                          const existingCats = prev.categories || [];
                          const updatedCats = existingCats.length > 0 
                            ? Array.from(new Set([newCat, ...existingCats])) 
                            : [newCat];
                          return {
                            ...prev,
                            category: newCat,
                            categories: updatedCats
                          };
                        });
                      }}
                      className="input-base font-semibold text-navy"
                    >
                      <option value="" disabled>Selecione a categoria...</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label-base">Linha de Negócio</label>
                    <select value={formProduct.line} onChange={e => setFormProduct({...formProduct, line: e.target.value as ProductLine})} className="input-base">
                      <option value="devocionais">Devocionais</option>
                      <option value="leve-sua-fe">Leve Sua Fé</option>
                      <option value="colecoes">Coleções</option>
                      <option value="personalizados">Personalizados</option>
                      <option value="momentos">Momentos de Fé</option>
                      <option value="presentes">Presentes</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label-base">Preço de Venda (R$) *</label>
                    <input required type="number" step="0.01" value={formProduct.price} onChange={e => setFormProduct({...formProduct, price: parseFloat(e.target.value) || 0})} className="input-base" />
                  </div>
                  <div>
                    <label className="label-base">Preço Promocional (Opcional)</label>
                    <input type="number" step="0.01" value={formProduct.promotional_price || ''} onChange={e => setFormProduct({...formProduct, promotional_price: parseFloat(e.target.value) || undefined})} placeholder="Deixe em branco se não houver" className="input-base" />
                  </div>
                </div>

                {/* CALCULADORA DE FORMAÇÃO DE PREÇO FINAL (CUSTO + DESPESAS + PORCENTAGEM) */}
                <div className="bg-gradient-to-br from-amber-50/70 via-cream to-white p-4 sm:p-5 rounded-2xl border border-gold/30 shadow-xs space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center text-primary border border-primary/30">
                        <Calculator size={15} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-2">
                          <span>Calculadora de Formação do Preço Final</span>
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-gold/20 text-gold-dark font-black">
                            Custo + Despesas + Lucro
                          </span>
                        </h4>
                        <p className="text-[10px] text-navy/55">
                          Defina o custo dos materiais, despesas e margem desejada para gerar o preço final automaticamente.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPricingCalc(!showPricingCalc)}
                      className="text-xs text-primary hover:underline font-bold cursor-pointer ml-2 flex-shrink-0"
                    >
                      {showPricingCalc ? 'Recolher' : 'Abrir'}
                    </button>
                  </div>

                  {showPricingCalc && (
                    <div className="space-y-3.5 pt-2 border-t border-gold/15">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* 1. Custo dos Materiais */}
                        <div>
                          <label className="block text-[11px] font-bold text-navy/70 mb-1">
                            1. Custo dos Materiais (R$)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-navy/40">R$</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0,00"
                              value={costPrice || ''}
                              onChange={e => setCostPrice(parseFloat(e.target.value) || 0)}
                              className="input-base pl-8 py-2 text-xs font-semibold"
                            />
                          </div>
                          <span className="text-[9px] text-navy/45 mt-0.5 block">Contas, cruz, entremeio, cordão</span>
                        </div>

                        {/* 2. Despesas Extras */}
                        <div>
                          <label className="block text-[11px] font-bold text-navy/70 mb-1">
                            2. Despesas & Embalagem (R$)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-navy/40">R$</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0,00"
                              value={expensesPrice || ''}
                              onChange={e => setExpensesPrice(parseFloat(e.target.value) || 0)}
                              className="input-base pl-8 py-2 text-xs font-semibold"
                            />
                          </div>
                          <span className="text-[9px] text-navy/45 mt-0.5 block">Saquinho de veludo, caixa, taxas</span>
                        </div>

                        {/* 3. Porcentagem de Lucro / Margem (%) */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-bold text-navy/70">
                              3. Margem / Lucro (%)
                            </label>
                            <span className="text-[10px] font-bold text-primary">{profitMargin}%</span>
                          </div>
                          <div className="relative">
                            <input
                              type="number"
                              step="1"
                              min="0"
                              placeholder="100"
                              value={profitMargin}
                              onChange={e => setProfitMargin(parseFloat(e.target.value) || 0)}
                              className="input-base pr-8 py-2 text-xs font-semibold"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-navy/40">%</span>
                          </div>
                          {/* Quick Margin Pills */}
                          <div className="flex gap-1 mt-1.5 overflow-x-auto">
                            {[30, 50, 100, 150, 200].map(pct => (
                              <button
                                type="button"
                                key={pct}
                                onClick={() => setProfitMargin(pct)}
                                className={`text-[9px] px-1.5 py-0.5 rounded font-bold transition-all cursor-pointer ${
                                  profitMargin === pct 
                                    ? 'bg-primary text-white' 
                                    : 'bg-white border border-gold/20 text-navy/60 hover:border-gold/40'
                                }`}
                              >
                                +{pct}%
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Resumo do Cálculo em Tempo Real */}
                      <div className="bg-white p-3.5 rounded-xl border border-gold/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-4 flex-wrap">
                          <div>
                            <span className="text-[10px] text-navy/50 uppercase block font-semibold">Custo Total Base</span>
                            <span className="font-mono font-bold text-navy">
                              {((costPrice || 0) + (expensesPrice || 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                          </div>
                          <div className="text-navy/30">+</div>
                          <div>
                            <span className="text-[10px] text-navy/50 uppercase block font-semibold">Lucro Estimado</span>
                            <span className="font-mono font-bold text-emerald-700">
                              {(((costPrice || 0) + (expensesPrice || 0)) * ((profitMargin || 0) / 100)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                          </div>
                          <div className="text-navy/30">=</div>
                          <div>
                            <span className="text-[10px] text-gold-dark uppercase block font-bold">Preço Final Sugerido</span>
                            <span className="font-mono font-black text-base text-primary">
                              {(((costPrice || 0) + (expensesPrice || 0)) * (1 + (profitMargin || 0) / 100)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                          </div>
                        </div>

                        {/* Botão de Aplicar Preço */}
                        <button
                          type="button"
                          onClick={() => {
                            const finalVal = Number((((costPrice || 0) + (expensesPrice || 0)) * (1 + (profitMargin || 0) / 100)).toFixed(2));
                            if (finalVal > 0) {
                              setFormProduct(prev => ({ ...prev, price: finalVal }));
                              showToast(`Preço de Venda atualizado para R$ ${finalVal.toFixed(2)}!`, 'success');
                            }
                          }}
                          disabled={((costPrice || 0) + (expensesPrice || 0)) <= 0}
                          className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save size={13} />
                          <span>Aplicar Preço Final</span>
                        </button>
                      </div>

                      {/* Margem Reversa se o Preço de Venda já foi digitado */}
                      {(formProduct.price || 0) > 0 && ((costPrice || 0) + (expensesPrice || 0)) > 0 && (
                        <div className="flex items-center justify-between text-[11px] text-navy/60 px-1 pt-1 border-t border-gold/10">
                          <span>
                            Preço no campo acima: <strong className="text-navy">R$ {(formProduct.price || 0).toFixed(2)}</strong>
                          </span>
                          <span>
                            Lucro real: <strong className="text-emerald-700">R$ {((formProduct.price || 0) - ((costPrice || 0) + (expensesPrice || 0))).toFixed(2)}</strong> ({((((formProduct.price || 0) - ((costPrice || 0) + (expensesPrice || 0))) / ((costPrice || 0) + (expensesPrice || 0))) * 100).toFixed(0)}% de margem)
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Categorias Secundárias / Adicionais */}
                {categories.length > 1 && (
                  <div className="bg-cream/40 p-3.5 rounded-2xl border border-gold/15">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-navy">Categorias Adicionais (Opcional)</label>
                      <span className="text-[10px] text-navy/50">Permite que o produto apareça em mais de uma categoria</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map(c => {
                        const isPrimary = formProduct.category === c.id;
                        const isSelected = isPrimary || (formProduct.categories || []).includes(c.id);
                        return (
                          <button
                            type="button"
                            key={c.id}
                            onClick={() => {
                              if (isPrimary) return;
                              const cur = formProduct.categories || [];
                              const updated = cur.includes(c.id)
                                ? cur.filter(id => id !== c.id)
                                : [...cur, c.id];
                              setFormProduct(prev => ({ ...prev, categories: updated }));
                            }}
                            className={`text-xs px-3 py-1 rounded-full border transition-all cursor-pointer ${
                              isPrimary
                                ? 'bg-gold-dark text-white border-gold-dark font-bold shadow-xs'
                                : isSelected
                                  ? 'bg-navy text-gold border-navy font-bold shadow-xs'
                                  : 'bg-white text-navy/70 border-gold/20 hover:border-gold/40'
                            }`}
                          >
                            {c.name} {isPrimary ? '★ Principal' : isSelected ? '✓' : '+'}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="label-base">Disponibilidade</label>
                    <select value={formProduct.availability} onChange={e => setFormProduct({...formProduct, availability: e.target.value as ProductAvailability})} className="input-base">
                      <option value="ready">Pronta entrega</option>
                      <option value="made_to_order">Sob encomenda</option>
                      <option value="limited_edition">Edição limitada</option>
                    </select>
                  </div>
                  <div>
                    <label className="label-base">Estoque Atual</label>
                    <input type="number" value={formProduct.stock ?? 10} onChange={e => setFormProduct({...formProduct, stock: parseInt(e.target.value) || 0})} className="input-base" />
                  </div>
                  <div>
                    <label className="label-base">Prazo de Produção (dias)</label>
                    <input type="number" value={formProduct.production_days ?? 5} onChange={e => setFormProduct({...formProduct, production_days: parseInt(e.target.value) || 5})} className="input-base" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="label-base mb-0">Descrição do Produto</label>
                    <button
                      type="button"
                      onClick={() => {
                        if (!formProduct.description) return;
                        const cleaned = formProduct.description
                          .replace(/\r\n/g, '\n')
                          .replace(/\r/g, '\n')
                          .split('\n')
                          .map((l: string) => l.trim())
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
                        setFormProduct(prev => ({ ...prev, description: cleaned }));
                        showToast('Espaços e quebras excessivas removidos!', 'success');
                      }}
                      className="text-[11px] text-primary hover:text-primary-hover font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Remove linhas em branco duplas e espaços extras automaticamente"
                    >
                      <Sparkles size={12} />
                      <span>Limpar Espaços Extras</span>
                    </button>
                  </div>
                  <textarea 
                    rows={4} 
                    value={formProduct.description} 
                    onChange={e => setFormProduct({...formProduct, description: e.target.value})} 
                    placeholder="Descreva a peça, materiais, acabamentos e especificações..."
                    className="input-base" 
                  />
                  <p className="text-[10px] text-navy/45 mt-1">
                    Dica: Você pode colar seu texto normalmente. O sistema limpa quebras excessivas e espaços vazios de forma inteligente.
                  </p>
                </div>

                <div>
                  <label className="label-base">Foto Principal (URL ou Upload)</label>
                  <div className="flex gap-2">
                    <input type="text" value={formProduct.image} onChange={e => setFormProduct({...formProduct, image: e.target.value})} placeholder="https://..." className="input-base" />
                    <input id="prod-file-upload" type="file" className="hidden" accept="image/*" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          setIsUploading(true);
                          const url = await uploadFile(file);
                          setFormProduct(prev => ({ ...prev, image: url, images: [url, ...(prev.images || [])] }));
                        } catch (err: unknown) {
                          const msg = err instanceof Error ? err.message : 'Erro ao carregar imagem';
                          showToast('Erro no upload: ' + msg, 'error');
                        } finally {
                          setIsUploading(false);
                        }
                      }
                    }} />
                    <button type="button" onClick={() => document.getElementById('prod-file-upload')?.click()} disabled={isUploading} className="btn-primary whitespace-nowrap">
                      {isUploading ? 'Enviando...' : 'Anexar'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formProduct.isFeatured} onChange={e => setFormProduct({...formProduct, isFeatured: e.target.checked})} className="w-4 h-4 rounded text-navy" />
                    <span className="text-xs font-bold text-navy">Destacar na Home (Mais Amados)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formProduct.isCustomizable} onChange={e => setFormProduct({...formProduct, isCustomizable: e.target.checked})} className="w-4 h-4 rounded text-navy" />
                    <span className="text-xs font-bold text-navy">Permite Personalização</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gold/15">
                  <button type="button" onClick={() => setIsAddingProduct(false)} className="px-6 py-3 border border-gold/25 rounded-full text-xs font-bold uppercase tracking-wider text-navy/60 hover:text-navy w-1/2">
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary w-1/2 justify-center">
                    <Save size={16} /> Salvar Produto
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD / EDIT COLLECTION */}
      <AnimatePresence>
        {isAddingCollection && (
          <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl border border-gold/20 p-8 max-w-lg w-full shadow-2xl">
              <h2 className="font-serif font-bold text-2xl text-navy mb-6">{editingCollection ? 'Editar Coleção' : 'Nova Coleção'}</h2>
              <form onSubmit={handleCollectionSubmit} className="space-y-4">
                <div>
                  <label className="label-base">Nome da Coleção *</label>
                  <input required type="text" value={formCollection.name} onChange={e => setFormCollection({...formCollection, name: e.target.value})} className="input-base" />
                </div>
                <div>
                  <label className="label-base">Descrição</label>
                  <textarea rows={3} value={formCollection.description || ''} onChange={e => setFormCollection({...formCollection, description: e.target.value})} className="input-base resize-none" />
                </div>
                <div>
                  <label className="label-base">URL da Imagem de Capa</label>
                  <input type="text" value={formCollection.image || ''} onChange={e => setFormCollection({...formCollection, image: e.target.value})} className="input-base" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsAddingCollection(false)} className="px-6 py-3 border border-gold/25 rounded-full text-xs font-bold uppercase tracking-wider text-navy/60 w-1/2">
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary w-1/2 justify-center">
                    Salvar Coleção
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD / EDIT SAINT */}
      <AnimatePresence>
        {isAddingSaint && (
          <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl border border-gold/20 p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <h2 className="font-serif font-bold text-2xl text-navy mb-6">{editingSaint ? 'Editar Santo' : 'Novo Santo / Conteúdo Digital'}</h2>
              <form onSubmit={handleSaintSubmit} className="space-y-4">
                <div>
                  <label className="label-base">Nome do Santo *</label>
                  <input required type="text" value={formSaint.name} onChange={e => setFormSaint({...formSaint, name: e.target.value})} className="input-base" />
                </div>
                <div>
                  <label className="label-base">Palavras-chave (Ex: Proteção • Fé • Perseverança)</label>
                  <input type="text" value={formSaint.keywords || ''} onChange={e => setFormSaint({...formSaint, keywords: e.target.value})} className="input-base" />
                </div>
                <div>
                  <label className="label-base">História</label>
                  <textarea rows={3} value={formSaint.history || ''} onChange={e => setFormSaint({...formSaint, history: e.target.value})} className="input-base resize-none" />
                </div>
                <div>
                  <label className="label-base">Oração</label>
                  <textarea rows={3} value={formSaint.prayer || ''} onChange={e => setFormSaint({...formSaint, prayer: e.target.value})} className="input-base resize-none" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsAddingSaint(false)} className="px-6 py-3 border border-gold/25 rounded-full text-xs font-bold uppercase tracking-wider text-navy/60 w-1/2">
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary w-1/2 justify-center">
                    Salvar Santo
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD / EDIT CATEGORY */}
      <AnimatePresence>
        {isAddingCategory && (
          <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl border border-gold/20 p-8 max-w-md w-full shadow-2xl">
              <h2 className="font-serif font-bold text-2xl text-navy mb-6">{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</h2>
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div>
                  <label className="label-base">Nome da Categoria *</label>
                  <input required type="text" value={categoryName} onChange={e => setCategoryName(e.target.value)} placeholder="Ex: Terços de Noiva" className="input-base" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsAddingCategory(false)} className="px-6 py-3 border border-gold/25 rounded-full text-xs font-bold uppercase tracking-wider text-navy/60 w-1/2">
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary w-1/2 justify-center">
                    Salvar Categoria
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD / EDIT GLOBAL OPTION */}
      <AnimatePresence>
        {isAddingOption && (
          <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl border border-gold/20 p-8 max-w-md w-full shadow-2xl">
              <h2 className="font-serif font-bold text-2xl text-navy mb-6">{editingOption ? 'Editar Opção' : 'Nova Opção Global'}</h2>
              <form onSubmit={handleOptionSubmit} className="space-y-4">
                <div>
                  <label className="label-base">Nome da Opção *</label>
                  <input required type="text" value={formOption.name || ''} onChange={e => setFormOption({...formOption, name: e.target.value})} placeholder="Ex: Pérola Branca" className="input-base" />
                </div>
                <div>
                  <label className="label-base">Preço Adicional (R$)</label>
                  <input type="number" step="0.01" value={formOption.price || 0} onChange={e => setFormOption({...formOption, price: parseFloat(e.target.value) || 0})} className="input-base" />
                </div>
                {subTab !== 'colors' && (
                  <div>
                    <label className="label-base">Grupo</label>
                    <select value={formOption.group || 'Entremeio'} onChange={e => setFormOption({...formOption, group: e.target.value})} className="input-base">
                      <option value="Entremeio">Entremeio</option>
                      <option value="Crucifixo">Crucifixo</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>
                )}
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsAddingOption(false)} className="px-6 py-3 border border-gold/25 rounded-full text-xs font-bold uppercase tracking-wider text-navy/60 w-1/2">
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary w-1/2 justify-center">
                    Salvar Opção
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: CALCULADORA RÁPIDA DE PREÇO (DIRETO DA TABELA) */}
      <AnimatePresence>
        {quickCalcProduct && (() => {
          const qTotalCost = (quickCost || 0) + (quickExpenses || 0);
          const qFinalPrice = qTotalCost > 0 
            ? Number((qTotalCost * (1 + (quickMargin || 0) / 100)).toFixed(2)) 
            : 0;
          const qProfit = qFinalPrice > 0 ? Number((qFinalPrice - qTotalCost).toFixed(2)) : 0;

          return (
            <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl border border-gold/20 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gold/15">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/15 text-primary flex items-center justify-center border border-primary/30">
                      <Calculator size={20} />
                    </div>
                    <div>
                      <h2 className="font-serif font-bold text-xl text-navy">
                        Cálculo do Preço Final
                      </h2>
                      <p className="text-xs text-navy/55 line-clamp-1">
                        {quickCalcProduct.name}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setQuickCalcProduct(null)} 
                    className="p-2 text-navy/40 hover:text-navy rounded-full hover:bg-navy/5 cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label-base mb-1">Custo dos Materiais (R$)</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-navy/40">R$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={quickCost || ''}
                          onChange={e => setQuickCost(parseFloat(e.target.value) || 0)}
                          className="input-base pl-9 text-sm font-semibold"
                        />
                      </div>
                      <span className="text-[10px] text-navy/40 mt-1 block">Contas, crucifixo, entremeio</span>
                    </div>

                    <div>
                      <label className="label-base mb-1">Despesas & Embalagem (R$)</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-navy/40">R$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={quickExpenses || ''}
                          onChange={e => setQuickExpenses(parseFloat(e.target.value) || 0)}
                          className="input-base pl-9 text-sm font-semibold"
                        />
                      </div>
                      <span className="text-[10px] text-navy/40 mt-1 block">Saquinho, caixa, taxas</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="label-base mb-0">Porcentagem de Lucro / Margem (%)</label>
                      <span className="font-mono font-bold text-sm text-primary">{quickMargin}%</span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        step="1"
                        min="0"
                        value={quickMargin}
                        onChange={e => setQuickMargin(parseFloat(e.target.value) || 0)}
                        className="input-base pr-8 font-semibold"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-navy/40">%</span>
                    </div>

                    <div className="flex gap-1.5 mt-2">
                      {[30, 50, 80, 100, 150, 200].map(pct => (
                        <button
                          type="button"
                          key={pct}
                          onClick={() => setQuickMargin(pct)}
                          className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            quickMargin === pct
                              ? 'bg-primary text-white'
                              : 'bg-cream border border-gold/20 text-navy/70 hover:border-gold/40'
                          }`}
                        >
                          +{pct}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Resumo da Precificação */}
                  <div className="bg-cream/60 p-4 rounded-2xl border border-gold/20 space-y-2">
                    <div className="flex justify-between text-xs text-navy/70">
                      <span>Custo Base (Materiais + Despesas):</span>
                      <strong className="text-navy">{qTotalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                    </div>
                    <div className="flex justify-between text-xs text-emerald-700">
                      <span>Lucro Bruto Estimado:</span>
                      <strong className="font-bold">+{qProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                    </div>
                    <div className="pt-2 border-t border-gold/20 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gold-dark block leading-tight">Preço Final Sugerido</span>
                        <span className="text-xs text-navy/50">Atual: {(quickCalcProduct.price || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                      </div>
                      <span className="font-mono font-black text-2xl text-primary">
                        {qFinalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setQuickCalcProduct(null)}
                    className="px-6 py-3.5 border border-gold/25 rounded-full text-xs font-bold uppercase tracking-wider text-navy/60 w-1/3 hover:bg-gold/5 cursor-pointer"
                  >
                    Fechar
                  </button>
                  <button
                    type="button"
                    disabled={qFinalPrice <= 0}
                    onClick={() => handleSaveQuickPrice(qFinalPrice)}
                    className="btn-primary w-2/3 justify-center text-xs font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Save size={15} />
                    <span>Salvar Preço Final</span>
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};
