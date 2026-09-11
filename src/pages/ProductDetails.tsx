import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, Share2, Download, ShoppingBag, MessageCircle, Clock, 
  Minus, Plus, ArrowLeft, Settings2, Check, ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { siteConfig } from '../config/site';
import type { Product, Variation, GlobalOption } from '../types';

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

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, globalOptions, categories, loading, settings } = useData();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<Variation | GlobalOption | null>(null);
  const [customOptions, setCustomOptions] = useState<Record<string, string>>({});
  const [isAdded, setIsAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const product = products.find(p => p.id === id);
  const productImages = product?.images && product.images.length > 0 ? product.images.slice(0, 5) : (product?.image ? [product.image] : []);

  useEffect(() => {
    if (id) {
      const favorites = JSON.parse(localStorage.getItem('fs_favorites') || localStorage.getItem('es_favorites') || '[]');
      setIsFavorite(favorites.includes(id));
      window.scrollTo(0, 0);
    }
  }, [id]);

  useEffect(() => {
    if (product) {
      const schemaData = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.image,
        description: product.description,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'BRL',
          price: product.price,
          availability: 'https://schema.org/InStock',
        },
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'product-jsonld';
      script.text = JSON.stringify(schemaData);
      
      const existing = document.getElementById('product-jsonld');
      if (existing) existing.remove();
      document.head.appendChild(script);

      return () => {
        const el = document.getElementById('product-jsonld');
        if (el) el.remove();
      };
    }
  }, [product]);

  const toggleFavorite = () => {
    if (!id) return;
    const favorites = JSON.parse(localStorage.getItem('fs_favorites') || localStorage.getItem('es_favorites') || '[]');
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter((fid: string) => fid !== id);
      setIsFavorite(false);
    } else {
      updated = [...favorites, id];
      setIsFavorite(true);
    }
    localStorage.setItem('fs_favorites', JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-navy border-t-transparent rounded-full animate-spin" />
          <p className="text-navy font-serif animate-pulse">Preparando tudo com carinho...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center gap-4">
        <h2 className="font-serif text-2xl text-navy">Produto não encontrado</h2>
        <Link to="/" className="btn-primary">Voltar para a Loja</Link>
      </div>
    );
  }

  const isCustomizable = !!product.isCustomizable;
  const hasColorOption = isCustomizable && !!product.hasColorOption;

  const relevantColors = hasColorOption ? globalOptions.filter(o => o.type === 'color' && o.categoryIds?.includes(product.category || '')) : [];
  const relevantAssembly = isCustomizable ? globalOptions.filter(o => o.type === 'assembly' && o.categoryIds?.includes(product.category || '')) : [];

  const colorList = hasColorOption && product.availableColors 
    ? product.availableColors.split(',').map(c => c.trim()).filter(c => c !== '') 
    : [];

  const hasVariations = (product.variations && product.variations.length > 0) || (isCustomizable && product.customizationLists && product.customizationLists.length > 0);

  const needsCustomizer = isCustomizable || hasVariations || relevantColors.length > 0 || relevantAssembly.length > 0;

  const getBasePrice = () => {
    if (selectedVariation && !('type' in (selectedVariation as any))) return (selectedVariation as any).price || 0;
    return product.price;
  };

  const getAddonsPrice = () => {
    let total = 0;
    if (selectedVariation && 'type' in (selectedVariation as any)) {
      total += (selectedVariation as any).price || 0;
    }
    relevantAssembly.forEach(opt => {
      if (customOptions[`${opt.group}_id`] === opt.id) {
        total += opt.price || 0;
      }
    });
    if (customOptions.nome && product.namePrice) {
      total += product.namePrice;
    }
    return total;
  };

  const displayPrice = getBasePrice() + getAddonsPrice();
  const displayImage = selectedVariation ? selectedVariation.image : (productImages[selectedImageIndex] || product?.image || '');

  // Estratégia de limpeza e remoção de espaços/linhas vazias excessivas na descrição
  const descriptionParagraphs = useMemo(() => {
    if (!product.description) return [];
    
    // 1. Unificar quebras de linha e limpar espaços em branco repetidos
    const rawLines = product.description
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .split('\n')
      .map(line => line.trim());

    // 2. Colapsar múltiplas linhas vazias consecutivas (máximo 1 linha vazia de separador)
    const collapsedLines: string[] = [];
    for (const line of rawLines) {
      if (line === '') {
        if (collapsedLines.length > 0 && collapsedLines[collapsedLines.length - 1] !== '') {
          collapsedLines.push('');
        }
      } else {
        collapsedLines.push(line);
      }
    }

    // 3. Agrupar em blocos de parágrafos consistentes
    const rawBlocks = collapsedLines.join('\n').split(/\n\s*\n/);

    return rawBlocks
      .map(block => block.trim())
      .filter(Boolean);
  }, [product.description]);

  const handleAddToCart = () => {
    let customName = product.name;
    const details = [];
    
    if (selectedVariation) {
      details.push(`${selectedVariation.name}`);
    } else if (customOptions.cor) {
      details.push(`Cor: ${customOptions.cor}`);
    }

    if (customOptions.nome) details.push(`Nome: ${customOptions.nome}`);
    
    if (product.customizationLists) {
      product.customizationLists.forEach(list => {
        if (customOptions[list.id]) {
          details.push(`${list.title}: ${customOptions[list.id]}`);
        }
      });
    }

    relevantAssembly.forEach(opt => {
      if (opt.group && customOptions[`${opt.group}_id`] === opt.id) {
        details.push(`${opt.group}: ${opt.name}`);
      }
    });

    if (details.length > 0) {
      customName = `${product.name} (${details.join(', ')})`;
    }
    
    addToCart({ 
      ...product, 
      name: customName, 
      price: displayPrice, 
      image: displayImage || product.image,
      selectedVariation: selectedVariation || undefined
    } as Product, quantity);
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWhatsAppRequest = () => {
    if (!product) return;

    const brandTitle = settings.name || siteConfig.name;
    const whatsappNum = settings.whatsapp || siteConfig.whatsapp;
    const currentUrl = window.location.href;

    const details: string[] = [];
    if (selectedVariation) {
      details.push(`Variação: ${selectedVariation.name}`);
    } else if (customOptions.cor) {
      details.push(`Cor do Fio / Contas: ${customOptions.cor}`);
    }
    if (customOptions.nome) details.push(`Nome Personalizado: ${customOptions.nome}`);
    
    if (product.customizationLists) {
      product.customizationLists.forEach(list => {
        if (customOptions[list.id]) {
          details.push(`${list.title}: ${customOptions[list.id]}`);
        }
      });
    }

    relevantAssembly.forEach(opt => {
      if (opt.group && customOptions[`${opt.group}_id`] === opt.id) {
        details.push(`${opt.group}: ${opt.name}`);
      }
    });

    const customBlock = details.length > 0 ? `\n• *Personalizações:*\n   - ` + details.join('\n   - ') : '';
    const totalCalc = (displayPrice * quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const message = `✨ *SOLICITAÇÃO DE TERÇO — ${brandTitle.toUpperCase()}* ✨\n\n` +
      `Olá! Gostaria de encomendar a seguinte peça artesanal em crochê:\n\n` +
      `📿 *Produto:* ${product.name}\n` +
      `🔢 *Quantidade:* ${quantity}\n` +
      `💰 *Valor:* ${totalCalc}` +
      `${customBlock}\n\n` +
      `🔗 *URL do Produto:* ${currentUrl}\n\n` +
      `Poderia me confirmar o prazo de produção e valor do envio?`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNum}?text=${encoded}`, '_blank');
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: product.name, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copiado para a área de transferência!');
    }
  };

  const categoryData = categories.find(c => c.id === product.category);

  return (
    <div className="pt-24 pb-20 md:pb-28 min-h-screen bg-transparent text-navy font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation & Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy/60 hover:text-navy transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
          
          <div className="flex items-center gap-2 text-xs text-navy/40 uppercase tracking-widest">
            <Link to="/" className="hover:text-navy transition-colors">Início</Link>
            <span>/</span>
            <span className="hover:text-navy transition-colors">{categoryData?.name || product.category}</span>
            <span>/</span>
            <span className="text-navy/70 truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Media Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-square max-w-[300px] md:max-w-md lg:max-w-none mx-auto rounded-2xl md:rounded-[32px] overflow-hidden bg-white border border-gold/15 shadow-premium group">
              <img 
                src={displayImage || product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                {isCustomizable && (
                  <span className="badge-custom flex items-center gap-1 bg-gold text-navy font-black">
                    <Settings2 size={10} strokeWidth={3} />
                    Personalizável
                  </span>
                )}
              </div>

              {/* Floating Action Buttons */}
              <div className="absolute top-6 right-6 flex flex-col gap-3 z-10">
                <button 
                  onClick={toggleFavorite}
                  className={`w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${isFavorite ? 'text-red-500' : 'text-navy/60'}`}
                >
                  <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
                </button>
                <button 
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-navy/60 hover:text-navy transition-transform hover:scale-110 active:scale-95"
                >
                  <Share2 size={18} />
                </button>
                <a 
                  href={displayImage || product.image}
                  download={`${product.name}.jpg`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-navy/60 hover:text-navy transition-transform hover:scale-110 active:scale-95"
                >
                  <Download size={18} />
                </a>
              </div>
            </div>

            {/* Gallery Thumbnails (Up to 5 photos) */}
            {productImages.length > 1 && (
              <div className="flex items-center justify-center gap-3 pt-2 overflow-x-auto pb-2 scrollbar-hide">
                {productImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedImageIndex(idx);
                      setSelectedVariation(null);
                    }}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 ${
                      selectedImageIndex === idx && !selectedVariation
                        ? 'border-gold shadow-md scale-105'
                        : 'border-gold/20 opacity-70 hover:opacity-100 hover:border-gold/50'
                    }`}
                  >
                    <img src={imgUrl} alt={`${product.name} - Foto ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Title, Metadata, Customizer & CTAs */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div>
              <span className="text-[11px] text-gold-dark uppercase tracking-[0.25em] font-black block mb-2">
                {categoryData?.name || product.category}
              </span>
              <h1 className="font-serif font-bold text-3xl md:text-4xl text-navy leading-tight mb-4">
                {product.name}
              </h1>
              
              {descriptionParagraphs.length > 0 && (
                <div className="bg-white/95 backdrop-blur-xs p-5 sm:p-6 rounded-2xl md:rounded-3xl border border-gold/20 shadow-xs space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold-dark block mb-1">
                    Sobre a Peça
                  </span>
                  
                  {descriptionParagraphs.map((block, bIdx) => {
                    const isSpecsTitle = /^especifica[çc][õo]es/i.test(block.trim());
                    if (isSpecsTitle) {
                      return (
                        <div key={bIdx} className="pt-3 border-t border-gold/15 mt-2">
                          <span className="text-xs font-serif font-bold text-navy uppercase tracking-wider block">
                            {block}
                          </span>
                        </div>
                      );
                    }

                    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
                    if (lines.length > 1) {
                      return (
                        <div key={bIdx} className="space-y-1.5">
                          {lines.map((line, lIdx) => (
                            <p key={lIdx} className="text-sm sm:text-[15px] text-navy/80 font-medium leading-relaxed">
                              {line}
                            </p>
                          ))}
                        </div>
                      );
                    }

                    return (
                      <p key={bIdx} className="text-sm sm:text-[15px] text-navy/80 font-medium leading-relaxed">
                        {block}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Price section */}
            <div className="py-4 border-t border-b border-gold/15 flex items-baseline gap-4">
              <span className="text-3xl font-serif font-bold text-navy">
                {displayPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
              {getBasePrice() > 0 && displayPrice !== product.price && (
                <span className="text-[10px] font-black uppercase tracking-wider text-gold-dark bg-gold/10 px-2.5 py-1 rounded-full">
                  Com personalizações
                </span>
              )}
            </div>

            {/* Availability and Production info */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-navy/70 py-1">
              {product.availability === 'made_to_order' ? (
                <div className="flex items-center gap-2 bg-amber-50 text-amber-800 border border-amber-200/60 px-3.5 py-1.5 rounded-full">
                  <Clock size={14} className="text-amber-600" />
                  <span>Produzido sob encomenda • Prazo: {product.production_days || 5} dias úteis</span>
                </div>
              ) : product.availability === 'limited_edition' ? (
                <div className="flex items-center gap-2 bg-purple-50 text-purple-900 border border-purple-200/60 px-3.5 py-1.5 rounded-full">
                  <Sparkles size={14} className="text-purple-600" />
                  <span>Edição Limitada {product.edition_quantity ? `(Tiragem: ${product.edition_quantity} un.)` : ''}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-3.5 py-1.5 rounded-full">
                  <Check size={14} className="text-emerald-600" />
                  <span>Pronta entrega • Envio para todo o Brasil</span>
                </div>
              )}
            </div>

            {/* Customizer Panel */}
            {needsCustomizer && (
              <div className="bg-cream-light rounded-[24px] border border-gold/15 p-6 space-y-5">
                <div className="flex items-center gap-2 text-navy border-b border-gold/10 pb-3">
                  <Settings2 size={16} strokeWidth={2.5} className="text-gold" />
                  <span className="font-serif font-bold text-sm tracking-wider uppercase">Opções de Personalização</span>
                </div>

                {/* Colors Swatches Option */}
                {relevantColors.length > 0 && (
                  <div className="space-y-2">
                    <label className="label-base">Selecione a Cor</label>
                    <div className="flex flex-wrap gap-2.5">
                      {relevantColors.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            if (customOptions.cor === opt.name) {
                              setCustomOptions(prev => {
                                const next = { ...prev };
                                delete next.cor;
                                return next;
                              });
                              setSelectedVariation(null);
                            } else {
                              setCustomOptions(prev => ({ ...prev, cor: opt.name }));
                              setSelectedVariation(opt);
                            }
                          }}
                          className={`w-10 h-10 rounded-full border-2 transition-all duration-300 hover:scale-110 flex items-center justify-center relative overflow-hidden ${
                            customOptions.cor === opt.name
                              ? 'border-gold scale-110 shadow-lg ring-2 ring-gold/20'
                              : 'border-navy/10 hover:border-navy/40'
                          }`}
                          style={opt.image ? {} : { backgroundColor: getColorHex(opt.name) }}
                          title={opt.name}
                        >
                          {opt.image ? (
                            <>
                              <img src={opt.image} className="w-full h-full object-cover rounded-full" />
                              {customOptions.cor === opt.name && (
                                <div className="absolute inset-0 bg-navy/40 rounded-full flex items-center justify-center">
                                  <Check size={16} strokeWidth={3} className="text-white" />
                                </div>
                              )}
                            </>
                          ) : (
                            customOptions.cor === opt.name && (
                              <Check size={14} strokeWidth={3} className={opt.name.toLowerCase().includes('branco') ? 'text-navy' : 'text-white'} />
                            )
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Legacy String Colors Option */}
                {hasColorOption && relevantColors.length === 0 && colorList.length > 0 && (
                  <div className="space-y-2">
                    <label className="label-base">Opções de Cor</label>
                    <div className="flex flex-wrap gap-2.5">
                      {colorList.map((color) => (
                        <button
                          key={color}
                          onClick={() => setCustomOptions(prev => ({ ...prev, cor: color }))}
                          className={`w-9 h-9 rounded-full border-2 transition-all duration-300 hover:scale-110 flex items-center justify-center ${
                            customOptions.cor === color
                              ? 'border-gold scale-110 shadow-lg'
                              : 'border-navy/10 hover:border-navy/40'
                          }`}
                          style={{ backgroundColor: getColorHex(color) }}
                          title={color}
                        >
                          {customOptions.cor === color && (
                            <Check size={14} strokeWidth={3} className={color.toLowerCase().includes('branco') ? 'text-navy' : 'text-white'} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Variations (Fabric/Finish/Size) as Pill Buttons */}
                {product.variations && product.variations.length > 0 && (
                  <div className="space-y-2">
                    <label className="label-base">Escolha uma Variação</label>
                    <div className="flex flex-wrap gap-2">
                      {product.variations.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => {
                            if (selectedVariation?.id === v.id) {
                              setSelectedVariation(null);
                            } else {
                              setSelectedVariation(v);
                            }
                          }}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                            selectedVariation?.id === v.id
                              ? 'bg-navy text-white border-navy shadow-md'
                              : 'bg-white text-navy/70 border-navy/15 hover:border-navy/40'
                          }`}
                        >
                          {v.name} (+{v.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assembly Options (Crucifixos, Entremeios, etc.) */}
                {relevantAssembly.length > 0 && (
                  <div className="space-y-4 pt-2 border-t border-gold/10">
                    {Array.from(new Set(relevantAssembly.map(a => a.group))).map(group => {
                      if (!group) return null;
                      const optsInGroup = relevantAssembly.filter(a => a.group === group);
                      return (
                        <div key={group} className="space-y-2">
                          <label className="label-base">Escolha o {group}</label>
                          <div className="grid grid-cols-2 gap-2">
                            {optsInGroup.map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => {
                                  setCustomOptions(prev => {
                                    const next = { ...prev };
                                    if (next[`${group}_id`] === opt.id) {
                                      delete next[group];
                                      delete next[`${group}_id`];
                                    } else {
                                      next[group] = opt.name;
                                      next[`${group}_id`] = opt.id;
                                    }
                                    return next;
                                  });
                                }}
                                className={`p-2 rounded-2xl text-left text-xs font-bold border flex items-center gap-3 transition-all ${
                                  customOptions[`${group}_id`] === opt.id
                                    ? 'bg-navy text-white border-navy shadow-md'
                                    : 'bg-white text-navy/70 border-navy/15 hover:border-navy/40'
                                }`}
                              >
                                {opt.image && (
                                  <img 
                                    src={opt.image} 
                                    alt={opt.name} 
                                    className="w-12 h-12 rounded-xl object-cover border border-gold/10 flex-shrink-0"
                                  />
                                )}
                                <div className="flex flex-col">
                                  <span>{opt.name}</span>
                                  {opt.price && opt.price > 0 ? (
                                    <span className={customOptions[`${group}_id`] === opt.id ? 'text-gold' : 'text-gold-dark'}>
                                      +{opt.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </span>
                                  ) : null}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Text fields customization (e.g. Engraving Name) */}
                {needsCustomizer && (
                  <div className="space-y-1">
                    <label className="label-base" htmlFor="nome-personalizacao">
                      ✏️ Nome para personalização
                    </label>
                    <input 
                      type="text" 
                      id="nome-personalizacao"
                      placeholder="Digite o nome aqui..."
                      value={customOptions.nome || ''}
                      onChange={(e) => setCustomOptions(prev => ({ ...prev, nome: e.target.value }))}
                      className="input-base"
                    />
                  </div>
                )}

                {/* Customization Lists (e.g. Fabrics/Acabamentos defined on product) */}
                {product.customizationLists && product.customizationLists.map(list => (
                  <div key={list.id} className="space-y-2">
                    <label className="label-base">{list.title}</label>
                    <div className="flex flex-wrap gap-2">
                      {list.options.split(',').map(opt => opt.trim()).map(option => (
                        <button
                          key={option}
                          onClick={() => setCustomOptions(prev => ({ ...prev, [list.id]: option }))}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                            customOptions[list.id] === option
                              ? 'bg-primary text-white border-primary shadow-md'
                              : 'bg-white text-navy/70 border-navy/15 hover:border-navy/40'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="label-base">Quantidade</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-10 h-10 rounded-full border border-navy/15 flex items-center justify-center text-navy/60 hover:text-navy hover:border-navy/40 active:scale-95 transition-all"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center text-lg font-serif font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="w-10 h-10 rounded-full border border-navy/15 flex items-center justify-center text-navy/60 hover:text-navy hover:border-navy/40 active:scale-95 transition-all"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={(!selectedVariation && !customOptions.cor && colorList.length > 0) || (relevantAssembly.some(opt => opt.group && opt.group !== 'Outros' && !customOptions[opt.group]))}
                className="w-full btn-primary py-4 font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 disabled:opacity-30 disabled:grayscale transition-all shadow-md active:scale-[0.98] hover:scale-[1.01]"
              >
                {isAdded ? <Check size={16} strokeWidth={2.5} /> : <ShoppingBag size={16} strokeWidth={2} />}
                {isAdded ? 'Adicionado ao Carrinho!' : `Quero este terço — ${(displayPrice * quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
              </button>

              <button
                onClick={handleWhatsAppRequest}
                disabled={(!selectedVariation && !customOptions.cor && colorList.length > 0) || (relevantAssembly.some(opt => opt.group && opt.group !== 'Outros' && !customOptions[opt.group]))}
                className="w-full btn-whatsapp py-4 font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 disabled:opacity-30 disabled:grayscale transition-all shadow-md active:scale-[0.98] hover:scale-[1.01]"
              >
                <MessageCircle size={16} strokeWidth={2} />
                Solicitar via WhatsApp
              </button>
            </div>
            
          </div>

        </div>

        {/* ===== Product Carousel ===== */}
        <ProductCarousel currentProductId={product.id} products={products} />

      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   ProductCarousel – draggable carousel of other products
───────────────────────────────────────────────────────── */

interface ProductCarouselProps {
  currentProductId: string;
  products: Product[];
}

const CARD_WIDTH = 280;
const CARD_GAP = 20;
const CARD_STEP = CARD_WIDTH + CARD_GAP;

const ProductCarousel: React.FC<ProductCarouselProps> = ({ currentProductId, products }) => {
  const navigate = useNavigate();
  const others = products.filter(p => p.id !== currentProductId && p.isActive !== false);

  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const x = useMotionValue(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const maxIndex = Math.max(0, others.length - 1);

  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(i, maxIndex));
    setIndex(clamped);
    animate(x, -(clamped * CARD_STEP), { type: 'spring', stiffness: 300, damping: 35 });
  };

  const handleDragEnd = (_: any, info: any) => {
    setDragging(false);
    const threshold = CARD_STEP / 3;
    if (info.offset.x < -threshold) goTo(index + 1);
    else if (info.offset.x > threshold) goTo(index - 1);
    else goTo(index);
  };

  if (others.length === 0) return null;

  return (
    <section className="mt-20 mb-4">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#9A7655] mb-2">Fio Sagrado</p>
          <h2 className="font-serif font-bold text-2xl md:text-3xl text-[#4D4038] leading-tight">
            Outras Peças Artesanais
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Anterior"
            className="w-10 h-10 rounded-full border border-gold/25 flex items-center justify-center text-navy/60 hover:text-navy hover:border-gold/60 hover:bg-gold/5 disabled:opacity-25 disabled:cursor-not-allowed active:scale-95 transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => goTo(index + 1)}
            disabled={index >= maxIndex}
            aria-label="Próximo"
            className="w-10 h-10 rounded-full border border-gold/25 flex items-center justify-center text-navy/60 hover:text-navy hover:border-gold/60 hover:bg-gold/5 disabled:opacity-25 disabled:cursor-not-allowed active:scale-95 transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Carousel Track */}
      <div
        ref={trackRef}
        className="overflow-hidden"
        style={{ cursor: dragging ? 'grabbing' : 'grab' }}
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: -(maxIndex * CARD_STEP), right: 0 }}
          dragElastic={0.12}
          style={{ x, display: 'flex', gap: CARD_GAP }}
          onDragStart={() => setDragging(true)}
          onDragEnd={handleDragEnd}
        >
          {others.map((p) => (
            <CarouselCard key={p.id} product={p} dragging={dragging} onClick={() => navigate(`/produto/${p.id}`)} />
          ))}
        </motion.div>
      </div>

      {/* Dot indicators */}
      {others.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-6">
          {others.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Ir para produto ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === index
                  ? 'w-6 h-2 bg-gold'
                  : 'w-2 h-2 bg-navy/15 hover:bg-navy/30'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

interface CarouselCardProps {
  product: Product;
  dragging: boolean;
  onClick: () => void;
}

const CarouselCard: React.FC<CarouselCardProps> = ({ product, dragging, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const isCustomizable = !!product.isCustomizable;

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -4 }}
      onClick={() => { if (!dragging) onClick(); }}
      className="flex-shrink-0 rounded-[24px] overflow-hidden bg-white border border-gold/15 hover:border-gold/40 shadow-premium hover:shadow-gold transition-all duration-300"
      style={{ width: CARD_WIDTH, userSelect: 'none' }}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-cream-light" style={{ height: 220 }}>
        {product.image ? (
          <motion.img
            src={product.image}
            alt={product.name}
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-navy/20">
            <ShoppingBag size={40} />
          </div>
        )}

        {/* Badge */}
        {isCustomizable && (
          <div className="absolute top-3 left-3 bg-gold text-navy px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] flex items-center gap-1 shadow-md">
            <Settings2 size={9} strokeWidth={3} />
            Personalizável
          </div>
        )}

        {/* Hover overlay */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent"
        />
      </div>

      {/* Info */}
      <div className="p-5">
        <span className="text-[9px] text-gold-dark uppercase tracking-[0.25em] font-black block mb-1">
          {product.category}
        </span>
        <h3 className="font-serif font-bold text-base text-navy leading-snug line-clamp-2 mb-3">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-navy tabular-nums">
            {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
          <motion.span
            animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 6 }}
            className="text-[9px] font-black uppercase tracking-wider text-gold-dark flex items-center gap-1"
          >
            <Sparkles size={10} />
            Ver peça
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};
