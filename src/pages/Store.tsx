import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import { ProductCard } from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { SacredDoveIcon } from '../components/icons/ProductIcons';

const AVAILABILITY_LABELS: Record<string, string> = {
  'ready': 'Pronta entrega',
  'made_to_order': 'Sob encomenda',
  'limited_edition': 'Edição limitada',
};

export const Store: React.FC = () => {
  const { products, categories } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const activeCategory = searchParams.get('categoria') || '';
  const activeAvailability = searchParams.get('disponibilidade') || '';

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearch('');
  };

  const filtered = useMemo(() => {
    return products
      .filter(p => p.isActive !== false)
      .filter(p => {
        if (activeCategory) {
          return (p.categories || []).includes(activeCategory) || p.category === activeCategory;
        }
        return true;
      })
      .filter(p => activeAvailability ? p.availability === activeAvailability : true)
      .filter(p => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  }, [products, activeCategory, activeAvailability, search]);

  const hasFilters = activeCategory || activeAvailability || search;

  return (
    <div className="pt-[4.75rem] md:pt-[5.25rem] min-h-screen bg-[#FCFAF7]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#F5EEE5] via-[#FCFAF7] to-[#F5EEE5]/60 border-b border-[#C7A57F]/15 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <span className="text-[11px] font-bold text-[#9A7655] uppercase tracking-[0.25em] block mb-2">
            Catálogo Completo
          </span>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#4D4038] mb-2">
            Terços Artesanais & Peças de Fé
          </h1>
          <p className="text-[#786A61] text-sm max-w-xl">
            Explore nossos terços tecidos à mão ponto por ponto em crochê, dezenas e peças personalizadas com carinho.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#786A61]/50" />
            <input
              type="text"
              placeholder="Buscar por terço, santo, devoção ou material..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-base pl-10"
              id="store-search"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-[#C7A57F]/30 rounded-2xl text-[#4D4038] text-xs font-bold uppercase tracking-wider hover:border-[#CA9F53] transition-all shadow-xs cursor-pointer"
          >
            <SlidersHorizontal size={16} />
            <span>Filtros {hasFilters ? '• Ativos' : ''}</span>
          </button>
        </div>

        {/* Filters panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-[#F5EEE5]/70 border border-[#C7A57F]/25 rounded-3xl p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif font-bold text-lg text-[#4D4038]">Filtrar Terços</h3>
                  {hasFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-[#9A7655] hover:underline font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Limpar Filtros
                    </button>
                  )}
                </div>

                {/* Categories */}
                {categories.length > 0 && (
                  <div>
                    <p className="label-base">Categorias</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setFilter('categoria', '')}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          !activeCategory ? 'bg-[#9A7655] text-white shadow-xs' : 'bg-white border border-[#C7A57F]/30 text-[#786A61] hover:border-[#CA9F53]'
                        }`}
                      >
                        Todas
                      </button>
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setFilter('categoria', cat.id)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            activeCategory === cat.id ? 'bg-[#9A7655] text-white shadow-xs' : 'bg-white border border-[#C7A57F]/30 text-[#786A61] hover:border-[#CA9F53]'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Availability */}
                <div>
                  <p className="label-base">Disponibilidade</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilter('disponibilidade', '')}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        !activeAvailability ? 'bg-[#9A7655] text-white shadow-xs' : 'bg-white border border-[#C7A57F]/30 text-[#786A61] hover:border-[#CA9F53]'
                      }`}
                    >
                      Todos
                    </button>
                    {Object.entries(AVAILABILITY_LABELS).map(([k, v]) => (
                      <button
                        key={k}
                        onClick={() => setFilter('disponibilidade', k)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          activeAvailability === k ? 'bg-[#9A7655] text-white shadow-xs' : 'bg-white border border-[#C7A57F]/30 text-[#786A61] hover:border-[#CA9F53]'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active filters display */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-[#786A61] font-semibold">Filtros ativos:</span>
            {activeCategory && (
              <span className="inline-flex items-center gap-1.5 bg-[#F5EEE5] text-[#9A7655] px-3 py-1 rounded-full text-xs font-bold border border-[#C7A57F]/30">
                {categories.find(c => c.id === activeCategory)?.name || activeCategory}
                <button onClick={() => setFilter('categoria', '')} className="hover:opacity-75 cursor-pointer"><X size={12} /></button>
              </span>
            )}
            {activeAvailability && (
              <span className="inline-flex items-center gap-1.5 bg-[#F5EEE5] text-[#9A7655] px-3 py-1 rounded-full text-xs font-bold border border-[#C7A57F]/30">
                {AVAILABILITY_LABELS[activeAvailability] || activeAvailability}
                <button onClick={() => setFilter('disponibilidade', '')} className="hover:opacity-75 cursor-pointer"><X size={12} /></button>
              </span>
            )}
            {search && (
              <span className="inline-flex items-center gap-1.5 bg-[#F5EEE5] text-[#9A7655] px-3 py-1 rounded-full text-xs font-bold border border-[#C7A57F]/30">
                "{search}"
                <button onClick={() => setSearch('')} className="hover:opacity-75 cursor-pointer"><X size={12} /></button>
              </span>
            )}
          </div>
        )}

        {/* Product Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-white rounded-3xl border border-[#C7A57F]/20 max-w-2xl mx-auto shadow-soft space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#F5EEE5] text-[#9A7655] flex items-center justify-center mx-auto mb-3 border border-[#C7A57F]/20 shadow-sm">
              <SacredDoveIcon size={32} />
            </div>
            <h3 className="font-serif font-bold text-2xl text-[#4D4038]">
              {products.length === 0 ? 'Catálogo em Preparação' : 'Nenhum terço encontrado'}
            </h3>
            <p className="text-xs sm:text-sm text-[#786A61] max-w-md mx-auto leading-relaxed">
              {products.length === 0
                ? 'Nossos modelos prontos estão sendo confeccionados com muito carinho. Enquanto isso, você pode montar seu terço ou pulseira exclusiva ponto por ponto em nosso simulador 2D!'
                : 'Não encontramos peças com os filtros selecionados. Tente limpar os filtros para ver todo o catálogo.'}
            </p>

            <div className="pt-4 flex flex-wrap gap-3 justify-center">
              {products.length === 0 ? (
                <>
                  <Link
                    to="/monte-seu-terco"
                    className="btn-primary text-xs py-3 px-6 shadow-md"
                  >
                    Montar Terço no Simulador (2D)
                  </Link>
                  <Link
                    to="/monte-sua-pulseira"
                    className="btn-secondary text-xs py-3 px-6"
                  >
                    Montar Pulseira de Terço
                  </Link>
                </>
              ) : (
                <button onClick={clearFilters} className="btn-primary text-xs py-3 px-6 cursor-pointer">
                  Limpar Filtros
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
