import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, X, Sparkles, ArrowRight, Star, CheckCircle2
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { siteConfig } from '../config/site';
import { ProductCard } from '../components/ProductCard';
import { TrustSection } from '../components/TrustSection';
import { 
  RosaryVectorIcon, 
  BraceletVectorIcon,
  WhatsAppVectorIcon,
  SpoolThreadIcon,
  SacredDoveIcon,
  GiftBoxIcon,
  HandmadeHandsIcon
} from '../components/icons/ProductIcons';

export const Home: React.FC = () => {
  const { products, settings } = useData();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('featured');

  const whatsappNumber = settings.whatsapp || siteConfig.whatsapp;
  const instagramHandle = settings.instagram || siteConfig.instagram;

  // Filtragem de produtos para a vitrine
  const displayedProducts = useMemo(() => {
    let list = products.filter(p => p.isActive !== false);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }

    if (activeTab === 'featured') {
      const featured = list.filter(p => p.isFeatured);
      return featured.length > 0 ? featured.slice(0, 8) : list.slice(0, 8);
    }

    if (activeTab === 'ready') {
      return list.filter(p => p.availability === 'ready').slice(0, 8);
    }

    if (activeTab === 'customizable') {
      return list.filter(p => p.isCustomizable).slice(0, 8);
    }

    return list.filter(p => 
      p.category === activeTab || (p.categories || []).includes(activeTab)
    ).slice(0, 8);
  }, [products, searchQuery, activeTab]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/loja?busca=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="pt-[4.75rem] md:pt-[5.25rem] min-h-screen space-y-0">
      
      {/* 1. CATEGORIAS & EXPERIÊNCIAS PRINCIPAIS */}
      <section className="py-12 md:py-16 px-4 bg-[#FCFAF7] border-b border-[#C7A57F]/15">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-bold text-[#9A7655] uppercase tracking-[0.25em] block mb-2">
              Ateliê Fio Sagrado
            </span>
            <h1 className="font-serif font-bold text-3xl sm:text-5xl text-[#4D4038]">
              Terços Artesanais em Crochê
            </h1>
            <p className="text-xs sm:text-sm text-[#786A61] mt-2.5 max-w-xl mx-auto leading-relaxed">
              Peças exclusivas tecidas à mão ponto por ponto para oração, devoção e presentes cheios de fé e afeto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Card 1: Terços em Crochê */}
            <Link
              to="/loja?categoria=tercos-artesanais"
              className="group p-8 rounded-3xl bg-white border border-[#C7A57F]/25 shadow-soft hover:border-[#CA9F53]/60 hover:shadow-warm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#F5EEE5] text-[#9A7655] flex items-center justify-center mb-5 border border-[#C7A57F]/20 group-hover:scale-105 transition-transform">
                  <RosaryVectorIcon size={28} className="text-[#9A7655]" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-[#4D4038] mb-2 group-hover:text-[#9A7655] transition-colors">
                  Terços em Crochê
                </h3>
                <p className="text-xs sm:text-sm text-[#786A61] leading-relaxed">
                  Modelos clássicos e delicados em crochê com 5 dezenas completas para oração diária e momentos sagrados.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#C7A57F]/15 flex items-center justify-between text-xs font-bold text-[#9A7655]">
                <span>Ver Catálogo</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2: Monte seu Terço 2D */}
            <Link
              to="/monte-seu-terco"
              className="group p-8 rounded-3xl bg-gradient-to-br from-[#9A7655] to-[#836243] text-white border border-[#CA9F53]/40 shadow-warm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-white/15 text-white flex items-center justify-center border border-white/20 group-hover:scale-105 transition-transform">
                    <Sparkles size={26} className="text-[#F5EEE5]" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/20 text-[#FCFAF7] text-[10px] font-bold uppercase tracking-wider">
                    Simulador 2D
                  </span>
                </div>
                <h3 className="font-serif font-bold text-2xl text-white mb-2">
                  Monte seu Terço
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                  Escolha o modelo, contas, medalha devocional e crucifixo com visualização 2D em tempo real.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between text-xs font-bold text-[#FCFAF7]">
                <span>Personalizar Terço</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3: Monte sua Pulseira de Terço 2D */}
            <Link
              to="/monte-sua-pulseira"
              className="group p-8 rounded-3xl bg-white border border-[#C7A57F]/25 shadow-soft hover:border-[#CA9F53]/60 hover:shadow-warm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#F5EEE5] text-[#9A7655] flex items-center justify-center border border-[#C7A57F]/20 group-hover:scale-105 transition-transform">
                    <BraceletVectorIcon size={28} className="text-[#9A7655]" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#CA9F53]/15 text-[#9A7655] text-[10px] font-bold uppercase tracking-wider">
                    Novo
                  </span>
                </div>
                <h3 className="font-serif font-bold text-2xl text-[#4D4038] mb-2 group-hover:text-[#9A7655] transition-colors">
                  Pulseiras de Terço
                </h3>
                <p className="text-xs sm:text-sm text-[#786A61] leading-relaxed">
                  Dezenas de pulso reguláveis em macramê com medalhas de devoção, mini cruz e contas exclusivas.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#C7A57F]/15 flex items-center justify-between text-xs font-bold text-[#9A7655]">
                <span>Montar Pulseira</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. VITRINE DE PRODUTOS (Exibida dinamicamente quando houver produtos cadastrados) */}
      {(products.length > 0 || searchQuery) && (
        <section className="py-14 md:py-20 px-4 bg-[#F5EEE5]/40 border-b border-[#C7A57F]/15">
          <div className="max-w-7xl mx-auto space-y-8">
            
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Star size={14} className="text-[#CA9F53] fill-[#CA9F53]" />
                  <span className="text-[11px] text-[#9A7655] font-bold uppercase tracking-[0.25em]">
                    {searchQuery ? 'Resultados da Pesquisa' : 'Vitrine do Ateliê'}
                  </span>
                </div>
                <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#4D4038]">
                  {searchQuery ? `Resultados para "${searchQuery}"` : 'Peças em Destaque'}
                </h2>
              </div>

              {/* Campo de Busca Rápida */}
              <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80 flex-shrink-0">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#786A61]/60" />
                <input
                  type="text"
                  placeholder="Buscar terço, santo, devoção..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#C7A57F]/30 rounded-2xl text-xs sm:text-sm font-medium text-[#4D4038] placeholder:text-[#786A61]/50 focus:outline-none focus:border-[#9A7655] focus:ring-2 focus:ring-[#9A7655]/15 shadow-xs transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#786A61] hover:text-[#4D4038] p-1 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </form>
            </div>

            {/* Abas Rápidas de Filtragem */}
            {!searchQuery && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {[
                  { id: 'featured', label: 'Mais Amados' },
                  { id: 'tercos-artesanais', label: 'Terços em Crochê' },
                  { id: 'ready', label: 'Pronta Entrega' },
                  { id: 'customizable', label: 'Personalizáveis' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-[#9A7655] text-white shadow-xs'
                        : 'bg-white border border-[#C7A57F]/30 text-[#786A61] hover:text-[#4D4038] hover:border-[#CA9F53]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            {/* Grade de Produtos */}
            {displayedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#C7A57F]/20 p-12 text-center shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-[#F5EEE5] text-[#9A7655] flex items-center justify-center mx-auto mb-3 border border-[#C7A57F]/20">
                  <SacredDoveIcon size={26} />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#4D4038] mb-1">Nenhum produto encontrado</h3>
                <p className="text-xs text-[#786A61] max-w-sm mx-auto mb-4">
                  Não localizamos peças para esta pesquisa. Explore nosso configurador para montar seu terço sob medida.
                </p>
                <Link
                  to="/monte-seu-terco"
                  className="btn-primary text-xs py-2 px-6 inline-flex"
                >
                  Montar Terço no Simulador
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {displayedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Botão Ver Catálogo Completo */}
            {displayedProducts.length > 0 && (
              <div className="pt-4 text-center">
                <Link
                  to="/loja"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-white border border-[#C7A57F]/35 rounded-full text-xs font-bold text-[#4D4038] hover:bg-[#9A7655] hover:text-white hover:border-[#9A7655] transition-all shadow-sm group uppercase tracking-wider"
                >
                  <span>Ver catálogo completo na Loja</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}

          </div>
        </section>
      )}

      {/* 3. SEÇÃO: O PROCESSO ARTESANAL EM CROCHÊ */}
      <section className="py-16 md:py-24 px-4 bg-[#FCFAF7] border-b border-[#C7A57F]/15">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[11px] font-bold text-[#9A7655] uppercase tracking-[0.25em]">
                O Trabalho Manual
              </span>
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#4D4038] leading-snug">
                Cada laçada, uma prece.<br />
                Cada peça, uma história de fé.
              </h2>
              <p className="text-sm text-[#786A61] leading-relaxed">
                Na Fio Sagrado, o crochê transcende a técnica: é um momento de oração, concentração e carinho. Cada conta é cuidadosamente entrelaçada ponto por ponto com fios nobres selecionados, resultando em terços leves, acolhedores e duradouros.
              </p>
              
              <div className="space-y-3.5 pt-2">
                {[
                  'Fios 100% de algodão com toque suave e acabamento acetinado',
                  'Entremeios e crucifixos detalhados em banho nobre',
                  'Montagem manual com atenção a cada acabamento e nó',
                  'Embalados com delicadeza e aroma suave para presentear'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#4D4038] font-medium">
                    <CheckCircle2 size={18} className="text-[#9A7655] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link to="/nossa-historia" className="btn-secondary inline-flex items-center gap-2">
                  <span>Conheça nossa história</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="p-6 rounded-3xl bg-[#F5EEE5] border border-[#C7A57F]/20 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-2xl bg-white text-[#9A7655] flex items-center justify-center mb-2 border border-[#C7A57F]/20 shadow-xs">
                      <HandmadeHandsIcon size={24} />
                    </div>
                    <span className="text-2xl font-serif font-bold text-[#9A7655] block mb-0.5">100% Manual</span>
                    <span className="text-xs font-semibold text-[#4D4038]">Ponto a ponto em crochê</span>
                  </div>
                  <div className="p-6 rounded-3xl bg-white border border-[#C7A57F]/25 shadow-soft text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#F5EEE5] text-[#9A7655] flex items-center justify-center mb-2 border border-[#C7A57F]/20">
                      <SpoolThreadIcon size={24} />
                    </div>
                    <span className="text-xs font-bold text-[#4D4038] block mb-0.5">Fios Nobres</span>
                    <span className="text-[11px] text-[#786A61]">Algodão e toque acetinado</span>
                  </div>
                </div>

                <div className="space-y-4 pt-6">
                  <div className="p-6 rounded-3xl bg-white border border-[#C7A57F]/25 shadow-soft text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#F5EEE5] text-[#9A7655] flex items-center justify-center mb-2 border border-[#C7A57F]/20">
                      <SacredDoveIcon size={24} />
                    </div>
                    <span className="text-xs font-bold text-[#4D4038] block mb-0.5">Fé & Devoção</span>
                    <span className="text-[11px] text-[#786A61]">Feito em clima de oração</span>
                  </div>
                  <div className="p-6 rounded-3xl bg-[#F5EEE5] border border-[#C7A57F]/20 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-2xl bg-white text-[#9A7655] flex items-center justify-center mb-2 border border-[#C7A57F]/20 shadow-xs">
                      <GiftBoxIcon size={24} />
                    </div>
                    <span className="text-xs font-bold text-[#4D4038] block mb-0.5">Presente Especial</span>
                    <span className="text-[11px] text-[#786A61]">Caixa e cartão dedicatória</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. CONSTRUTOR 2D TEASER */}
      <section className="py-16 md:py-20 px-4 bg-[#FCFAF7]">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-[#F5EEE5] via-white to-[#F5EEE5] border border-[#C7A57F]/30 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 shadow-warm">
            <div className="md:flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FCFAF7] border border-[#C7A57F]/30 text-[#9A7655] text-[10px] font-bold uppercase tracking-wider mb-3">
                <Sparkles size={12} className="text-[#CA9F53]" />
                <span>Simulador Exclusivo</span>
              </div>
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#4D4038] mb-3">
                Monte seu Terço ou Pulseira
              </h2>
              <p className="text-[#786A61] text-sm leading-relaxed mb-6 max-w-md">
                Experimente nosso simulador 2D interativo: escolha o formato, modelo de contas, entremeio do seu santo protetor e crucifixo ideal para criar uma peça única tecida à mão.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Link to="/monte-seu-terco" className="btn-primary inline-flex items-center gap-2">
                  <span>Montar Terço (2D)</span>
                  <ArrowRight size={15} />
                </Link>
                <Link to="/monte-sua-pulseira" className="btn-secondary inline-flex items-center gap-2">
                  <span>Montar Pulseira de Terço</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
            
            <div className="md:w-72 w-full flex flex-col gap-3">
              <div className="p-4 bg-white rounded-2xl border border-[#C7A57F]/20 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F5EEE5] text-[#9A7655] flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <p className="text-xs font-bold text-[#4D4038]">Escolha o Modelo</p>
                  <p className="text-[10px] text-[#786A61]">Terço ou pulseira regulável</p>
                </div>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-[#C7A57F]/20 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F5EEE5] text-[#9A7655] flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <p className="text-xs font-bold text-[#4D4038]">Contas & Cores do Fio</p>
                  <p className="text-[10px] text-[#786A61]">Pérolas, cristais ou pedras</p>
                </div>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-[#C7A57F]/20 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F5EEE5] text-[#9A7655] flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <p className="text-xs font-bold text-[#4D4038]">Medalha & Crucifixo</p>
                  <p className="text-[10px] text-[#786A61]">Sua devoção predileta</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ATENDIMENTO WHATSAPP & REDES SOCIAIS */}
      {whatsappNumber && (
        <section className="py-14 px-4 bg-[#F5EEE5] border-t border-b border-[#C7A57F]/20">
          <div className="max-w-4xl mx-auto text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-white text-[#25D366] flex items-center justify-center mx-auto shadow-sm border border-[#C7A57F]/20">
              <WhatsAppVectorIcon size={28} />
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#4D4038]">
              Deseja uma peça sob medida ou tem alguma dúvida?
            </h2>
            <p className="text-sm text-[#786A61] max-w-lg mx-auto">
              Fale diretamente com nossa artesã pelo WhatsApp. Atendemos com muito carinho para encomendas especiais e terços personalizados.
            </p>
            <div className="pt-2 flex flex-wrap gap-3 justify-center">
              <a
                href={`https://wa.me/${(whatsappNumber || siteConfig.whatsapp).replace(/\D/g, '').startsWith('55') ? (whatsappNumber || siteConfig.whatsapp).replace(/\D/g, '') : `55${(whatsappNumber || siteConfig.whatsapp).replace(/\D/g, '')}`}?text=${encodeURIComponent('Olá! Gostaria de tirar dúvidas sobre os terços em crochê da Fio Sagrado.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <WhatsAppVectorIcon size={18} />
                <span>Conversar no WhatsApp</span>
              </a>
              {instagramHandle && (
                <a
                  href={`https://instagram.com/${instagramHandle.replace('@', '')}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex items-center gap-2"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                  <span>Siga no Instagram</span>
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 6. GARANTIA & CONFIANÇA */}
      <TrustSection />

    </div>
  );
};

export default Home;
