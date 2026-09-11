import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';
import { siteConfig } from '../config/site';
import { ProductCard } from '../components/ProductCard';
import { SacredDoveIcon } from '../components/icons/ProductIcons';

const CollectionDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { collections, products, settings } = useData();
  const brandName = settings.name || siteConfig.name;

  const collection = collections.find(c => c.slug === slug);
  const collectionProducts = products.filter(p => p.collection_id === collection?.id);

  const title = collection?.name || 'Coleção';
  const description = collection?.description || '';
  const totalItems = collection?.total_items || collectionProducts.length;
  const availableCount = collectionProducts.filter(p => p.isActive !== false).length;

  return (
    <div className="pt-[4.75rem] md:pt-[5.25rem] min-h-screen bg-[#FCFAF7]">
      {/* Breadcrumb */}
      <div className="bg-[#F5EEE5]/40 border-b border-[#C7A57F]/15 py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <Link to="/colecoes" className="inline-flex items-center gap-2 text-xs font-bold text-[#786A61] hover:text-[#4D4038] uppercase tracking-wider transition-colors">
            <ArrowLeft size={14} /> Voltar para Coleções
          </Link>
        </div>
      </div>

      {/* Hero da coleção */}
      <div className="bg-gradient-to-br from-[#F5EEE5] via-[#FCFAF7] to-[#F5EEE5]/60 py-16 px-4 border-b border-[#C7A57F]/15">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {collection?.banner ? (
              <div className="lg:w-1/2 rounded-3xl overflow-hidden aspect-video border border-[#C7A57F]/20 shadow-warm">
                <img src={collection.banner} alt={title} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="lg:w-1/2 rounded-3xl aspect-video bg-[#F5EEE5] border border-[#C7A57F]/20 flex items-center justify-center text-[#9A7655]">
                <SacredDoveIcon size={64} />
              </div>
            )}
            <div className="lg:w-1/2 text-center lg:text-left">
              <p className="text-[11px] text-[#9A7655] uppercase tracking-[0.3em] font-bold mb-3">
                Coleção {brandName}
              </p>
              <h1 className="font-serif font-bold text-4xl sm:text-5xl text-[#4D4038] mb-4">{title}</h1>
              {description && (
                <p className="text-[#786A61] text-sm sm:text-base leading-relaxed mb-6">{description}</p>
              )}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-xs font-bold">
                <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-[#C7A57F]/20 text-[#4D4038]">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span>{availableCount} disponíveis</span>
                </div>
                {totalItems > availableCount && (
                  <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-[#C7A57F]/20 text-[#4D4038]">
                    <span className="w-2 h-2 bg-[#CA9F53] rounded-full" />
                    <span>{totalItems - availableCount} em breve</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de produtos da coleção */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {collectionProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {collectionProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#C7A57F]/20 p-8 shadow-soft max-w-md mx-auto">
            <Sparkles size={40} className="text-[#9A7655] mx-auto mb-4" />
            <h3 className="font-serif font-bold text-xl text-[#4D4038] mb-2">Peças em Produção</h3>
            <p className="text-xs text-[#786A61] mb-6">
              Os terços desta coleção estão sendo confeccionados artesanalmente no ateliê.
            </p>
            <Link to="/loja" className="btn-primary text-xs">
              Ver Todos os Terços
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionDetail;
