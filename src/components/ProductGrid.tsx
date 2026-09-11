import React, { useState, useMemo } from 'react';
import { ProductCard } from './ProductCard';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';

export const ProductGrid: React.FC = () => {
  const { products, categories, loading } = useData();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchStatus = product.isActive !== false;
      const matchCategory = !selectedCategory || 
                            product.category === selectedCategory || 
                            (product.categories && product.categories.includes(selectedCategory));
      const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <section id="produtos" className="py-24 px-4 bg-transparent relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8 text-left">
          <div className="flex-grow">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy mb-4">Nossas Peças</h2>
            <p className="text-navy/60 max-w-xl">Artesanato feito à mão, com oração e dedicação. Cada detalhe é pensado para fortalecer sua jornada de fé.</p>
          </div>

          <div className="w-full md:w-80 group">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar por nome ou modelo..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full bg-white border border-gold/25 rounded-full p-4 pl-12 text-navy text-sm focus:border-gold outline-none transition-all placeholder:text-navy/30 focus:bg-white" 
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30 group-focus-within:text-navy transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/30 hover:text-navy transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Categorias Principais */}
        <div className="flex flex-wrap gap-2 mb-12 scrollbar-hide overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-8 py-3.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all border whitespace-nowrap active:scale-95 cursor-pointer ${
              selectedCategory === ''
                ? 'bg-primary text-white border-primary shadow-md'
                : 'bg-white text-navy/60 border-gold/20 hover:border-gold/40 hover:text-navy hover:bg-cream-light'
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
              }}
              className={`px-8 py-3.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all border whitespace-nowrap active:scale-95 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-white text-navy/60 border-gold/20 hover:border-gold/40 hover:text-navy hover:bg-cream-light'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-[32px] p-5 border border-gold/15 animate-pulse space-y-4">
                <div className="w-full h-64 bg-cream-light rounded-[20px]" />
                <div className="h-4 bg-cream-light rounded w-3/4" />
                <div className="h-3 bg-cream-light rounded w-1/2" />
                <div className="flex justify-between items-center pt-4">
                  <div className="h-6 bg-cream-light rounded w-1/3" />
                  <div className="h-10 bg-cream-light rounded-full w-24" />
                </div>
              </div>
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-navy/40 italic">Nenhum produto encontrado nesta categoria no momento.</p>
          </div>
        )}
      </div>
    </section>
  );
};
