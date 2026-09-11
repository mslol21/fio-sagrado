import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useData } from '../context/DataContext';
import { siteConfig } from '../config/site';
import { ProductCard } from '../components/ProductCard';
import { SacredDoveIcon } from '../components/icons/ProductIcons';

const SaintPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { saints, collections, products, settings } = useData();
  const brandName = settings.name || siteConfig.name;

  const saint = saints.find(s => s.slug === slug);

  // Products related to this saint
  const relatedProducts = saint
    ? products.filter(p => p.saint_id === saint.id && p.isActive !== false)
    : [];

  // Collection
  const collection = saint?.collection_id
    ? collections.find(c => c.id === saint.collection_id)
    : null;

  if (!saint) {
    return (
      <div className="pt-[4.75rem] md:pt-[5.25rem] min-h-screen flex items-center justify-center bg-[#FCFAF7]">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 rounded-3xl bg-[#F5EEE5] text-[#9A7655] flex items-center justify-center mx-auto mb-4 border border-[#C7A57F]/20 shadow-sm">
            <SacredDoveIcon size={40} />
          </div>
          <h1 className="font-serif font-bold text-2xl text-[#4D4038] mb-3">Página de Devoção não encontrada</h1>
          <p className="text-[#786A61] text-sm mb-6">
            Esta página ainda está sendo preparada ou o endereço foi alterado.
          </p>
          <Link to="/" className="btn-primary inline-flex text-xs">Voltar ao início</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[4.75rem] md:pt-[5.25rem] min-h-screen bg-[#FCFAF7]">
      {/* Breadcrumb */}
      <div className="bg-[#F5EEE5]/40 border-b border-[#C7A57F]/15 py-4 px-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link to="/colecoes" className="inline-flex items-center gap-2 text-xs font-bold text-[#786A61] hover:text-[#4D4038] uppercase tracking-wider transition-colors">
            <ArrowLeft size={14} /> Coleções
          </Link>
          {collection && (
            <>
              <span className="text-[#C7A57F]/50">/</span>
              <Link to={`/colecoes/${collection.slug}`} className="text-xs font-bold text-[#786A61] hover:text-[#4D4038] transition-colors">
                {collection.name}
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#F5EEE5] via-[#FCFAF7] to-[#F5EEE5]/60 py-16 px-4 border-b border-[#C7A57F]/15">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            {/* Image */}
            <div className="w-44 h-44 md:w-56 md:h-56 rounded-full border-4 border-[#C7A57F]/30 overflow-hidden bg-[#F5EEE5] flex-shrink-0 flex items-center justify-center shadow-warm text-[#9A7655]">
              {saint.image ? (
                <img src={saint.image} alt={saint.name} className="w-full h-full object-cover" />
              ) : (
                <SacredDoveIcon size={56} />
              )}
            </div>

            {/* Info */}
            <div className="text-center md:text-left">
              {saint.collection_number && (
                <p className="text-[11px] text-[#9A7655] uppercase tracking-[0.3em] font-bold mb-2">
                  {collection?.name || `Coleção ${brandName}`} — Nº {String(saint.collection_number).padStart(2, '0')}
                </p>
              )}
              <h1 className="font-serif font-bold text-4xl sm:text-5xl text-[#4D4038] mb-2">
                {saint.name}
              </h1>
              {saint.subtitle && (
                <p className="text-[#786A61] text-base mb-3">{saint.subtitle}</p>
              )}
              {saint.keywords && (
                <div className="inline-block bg-[#F5EEE5] text-[#9A7655] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-[#C7A57F]/25">
                  {saint.keywords}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {saint.history && (
              <div className="bg-white p-8 rounded-3xl border border-[#C7A57F]/20 shadow-soft">
                <h2 className="font-serif font-bold text-2xl text-[#4D4038] mb-4">História & Devoção</h2>
                <p className="text-[#4D4038]/85 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{saint.history}</p>
              </div>
            )}

            {saint.meaning && (
              <div className="bg-white p-8 rounded-3xl border border-[#C7A57F]/20 shadow-soft">
                <h2 className="font-serif font-bold text-2xl text-[#4D4038] mb-4">Significado Espiritual</h2>
                <p className="text-[#4D4038]/85 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{saint.meaning}</p>
              </div>
            )}

            {saint.prayer && (
              <div className="bg-[#F5EEE5]/70 p-8 rounded-3xl border border-[#C7A57F]/25 shadow-soft">
                <div className="flex items-center gap-2 text-[#9A7655] font-bold text-xs uppercase tracking-widest mb-3">
                  <BookOpen size={16} />
                  <span>Oração Oficial</span>
                </div>
                <h2 className="font-serif font-bold text-2xl text-[#4D4038] mb-4">Oração a {saint.name}</h2>
                <p className="font-serif italic text-[#4D4038] text-base leading-relaxed whitespace-pre-wrap bg-white p-6 rounded-2xl border border-[#C7A57F]/20 shadow-xs">{saint.prayer}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* QR Code card */}
            {saint.qr_code_url && (
              <div className="bg-white p-6 rounded-3xl border border-[#C7A57F]/20 shadow-soft text-center">
                <p className="font-serif font-bold text-lg text-[#4D4038] mb-2">Cartão de Oração Digital</p>
                <p className="text-xs text-[#786A61] mb-4">Escaneie para abrir esta oração no celular:</p>
                <div className="w-40 h-40 mx-auto rounded-2xl overflow-hidden border border-[#C7A57F]/20 p-2 bg-[#F5EEE5] shadow-xs">
                  <img src={saint.qr_code_url} alt={`QR Code ${saint.name}`} className="w-full h-full object-contain" />
                </div>
              </div>
            )}

            {/* Related products */}
            {relatedProducts.length > 0 && (
              <div>
                <h3 className="font-serif font-bold text-lg text-[#4D4038] mb-4">
                  Terços Dedicados a {saint.name}
                </h3>
                <div className="space-y-4">
                  {relatedProducts.map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaintPage;
