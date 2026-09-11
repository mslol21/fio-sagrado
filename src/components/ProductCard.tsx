import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Settings2, Check, ShoppingBag } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { globalOptions } = useData();
  const [isAdded, setIsAdded] = useState(false);

  const isCustomizable = !!product.isCustomizable;
  const hasColorOption = isCustomizable && !!product.hasColorOption;

  const relevantColors = hasColorOption ? globalOptions.filter(o => o.type === 'color' && o.categoryIds?.includes(product.category || '')) : [];
  const relevantAssembly = isCustomizable ? globalOptions.filter(o => o.type === 'assembly' && o.categoryIds?.includes(product.category || '')) : [];

  const hasVariations = (product.variations && product.variations.length > 0) || (product.customizationLists && product.customizationLists.length > 0);

  const needsCustomizer = isCustomizable || hasVariations || relevantColors.length > 0 || relevantAssembly.length > 0;

  const handleDirectAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const renderMedia = () => {
    const url = product.image;
    if (!url) return <div className="w-full h-full bg-cream-light flex items-center justify-center text-navy/20"><ShoppingBag size={48} /></div>;

    const isVideo = url.match(/\.(mp4|webm|ogg)$/i) || url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');

    if (isVideo) {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop();
        return (
          <iframe 
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1`}
            className="w-full h-full object-cover pointer-events-none scale-150"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        );
      }
      return (
        <video 
          src={url} 
          autoPlay muted loop playsInline
          className="w-full h-full object-cover"
        />
      );
    }

    return (
      <img
        src={url}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
      />
    );
  };

  return (
    <Link to={`/produto/${product.id}`} className="card-premium group flex flex-col h-full relative overflow-hidden text-left bg-white border border-gold/15 hover:border-gold/35 rounded-3xl shadow-premium hover:shadow-gold text-navy transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-cream-light">
        {renderMedia()}
        <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
          {isCustomizable && (
            <span className="bg-navy/85 backdrop-blur-xs text-gold px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.12em] flex items-center gap-1 shadow-sm border border-gold/20">
              <Settings2 size={10} strokeWidth={2.5} />
              Personalizável
            </span>
          )}
          {product.availability === 'made_to_order' && (
            <span className="bg-amber-500/85 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.12em] shadow-sm">
              Sob encomenda
            </span>
          )}
          {product.availability === 'limited_edition' && (
            <span className="bg-purple-900/85 backdrop-blur-xs text-amber-200 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.12em] shadow-sm border border-amber-300/30">
              Edição limitada
            </span>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-2">
          <span className="text-[10px] text-gold-dark uppercase tracking-[0.25em] font-black">
            {product.category}
          </span>
        </div>
        <h3 className="font-serif font-bold text-xl text-navy mb-2 group-hover:text-gold transition-colors line-clamp-2 leading-tight">
          {product.name}
        </h3>
        <p className="text-xs text-navy/60 mb-6 line-clamp-2 flex-grow leading-relaxed font-medium">
          {product.description}
        </p>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-auto pt-4 border-t border-gold/10 gap-4">
          <div className="flex flex-col">
            <span className="text-[9px] text-navy/40 block mb-0.5 uppercase tracking-widest font-black">Preço</span>
            <span className="text-xl font-bold text-navy tabular-nums leading-none">
              {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <AnimatePresence>
              {isAdded && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute -top-12 right-0 bg-green-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 z-10"
                >
                  <Check size={12} strokeWidth={4} />
                  Adicionado!
                </motion.div>
              )}
            </AnimatePresence>

            {needsCustomizer ? (
              <span className="w-full sm:w-auto bg-primary text-white px-5 py-3 rounded-full hover:bg-primary-hover hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center gap-1.5 font-medium">
                <Settings2 size={16} strokeWidth={2.5} />
                <span className="text-[10px] font-black uppercase tracking-wider">Opções</span>
              </span>
            ) : (
              <button
                onClick={handleDirectAdd}
                className={`w-full sm:w-auto px-5 py-3 rounded-full transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
                  isAdded 
                  ? 'bg-green-500 text-white border-green-500' 
                  : 'bg-gold/10 text-gold-dark border border-gold/30 hover:bg-gold hover:text-navy'
                }`}
              >
                {isAdded ? <Check size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={2.5} />}
                <span className="text-[10px] font-black uppercase tracking-wider">{isAdded ? 'No Carrinho' : 'Add'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
