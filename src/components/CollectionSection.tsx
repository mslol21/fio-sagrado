import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, GalleryHorizontal } from 'lucide-react';
import { useData } from '../context/DataContext';
import { siteConfig } from '../config/site';

const STATUS_MAP = {
  active: { label: 'Disponível', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  coming_soon: { label: 'Em breve', color: 'bg-[#F5EEE5] text-[#9A7655] border-[#C7A57F]/30' },
  ended: { label: 'Encerrada', color: 'bg-gray-100 text-gray-500 border-gray-200' },
};

export const CollectionSection: React.FC = () => {
  const { collections, settings } = useData();
  const brandName = settings.name || siteConfig.name;

  const activeCollections = collections
    .filter(c => c.is_active)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .slice(0, 3);

  if (activeCollections.length === 0) {
    return <GuardioesFallback brandName={brandName} />;
  }

  return (
    <section className="py-16 md:py-20 px-4 bg-[#FCFAF7]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[11px] text-[#9A7655] uppercase tracking-[0.3em] font-bold mb-2">Linhas Especiais</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#4D4038] mb-3">Coleções {brandName}</h2>
          <p className="text-[#786A61] max-w-lg mx-auto text-xs sm:text-sm leading-relaxed">
            Histórias de fé transformadas em terços de crochê para carregar, presentear e colecionar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeCollections.map((col, idx) => {
            const statusInfo = STATUS_MAP[col.status] || STATUS_MAP.active;
            return (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Link
                  to={`/colecoes/${col.slug}`}
                  className="group block bg-white border border-[#C7A57F]/20 hover:border-[#CA9F53]/50 rounded-3xl overflow-hidden shadow-soft hover:shadow-warm transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#F5EEE5]">
                    {col.image ? (
                      <img
                        src={col.image}
                        alt={col.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#F5EEE5]">
                        <GalleryHorizontal size={40} className="text-[#9A7655]/40" />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                      {col.total_items && col.total_items > 0 && (
                        <span className="text-[9px] text-[#786A61] font-bold uppercase tracking-widest">
                          {col.total_items} peças
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif font-bold text-xl text-[#4D4038] mb-2 group-hover:text-[#9A7655] transition-colors">
                      {col.name}
                    </h3>
                    {col.description && (
                      <p className="text-[#786A61] text-xs leading-relaxed mb-4 line-clamp-2">
                        {col.description}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-2 text-xs font-bold text-[#9A7655] group-hover:text-[#836243] uppercase tracking-widest transition-colors">
                      Conhecer a coleção <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link to="/colecoes" className="btn-primary inline-flex">
            Ver todas as coleções
          </Link>
        </div>
      </div>
    </section>
  );
};

const GuardioesFallback: React.FC<{ brandName: string }> = ({ brandName }) => {
  const guardians = [
    { n: '01', name: 'São Bento', keywords: 'Proteção • Fé • Firmeza' },
    { n: '02', name: 'São Miguel Arcanjo', keywords: 'Coragem • Defesa • Fé' },
    { n: '03', name: 'Nossa Senhora Aparecida', keywords: 'Amor Materno • Esperança • Devoção' },
  ];

  return (
    <section className="py-16 md:py-20 px-4 bg-[#FCFAF7]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-[11px] text-[#9A7655] uppercase tracking-[0.3em] font-bold mb-2">Linhas Especiais</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#4D4038] mb-3">Coleções {brandName}</h2>
          <p className="text-[#786A61] max-w-lg mx-auto text-xs sm:text-sm leading-relaxed">
            Histórias de fé transformadas em terços de crochê para oração, presente e devoção.
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#F5EEE5] via-white to-[#F5EEE5] border border-[#C7A57F]/25 rounded-3xl p-8 md:p-12 shadow-soft">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="md:flex-1">
              <span className="text-[9px] text-[#9A7655] font-bold uppercase tracking-[0.3em] bg-[#F5EEE5] px-3 py-1 rounded-full border border-[#C7A57F]/30">
                Destaque
              </span>
              <h3 className="font-serif font-bold text-3xl sm:text-4xl text-[#4D4038] mt-4 mb-4">
                Guardiões da Fé
              </h3>
              <p className="text-[#786A61] text-xs sm:text-sm leading-relaxed mb-6 max-w-md">
                Uma coleção de terços artesanais em crochê dedicados aos santos protetores e devoções marianas. Cada peça celebra a intercessão divina com acabamentos nobres.
              </p>
              <Link to="/colecoes" className="btn-primary inline-flex items-center gap-2 text-xs">
                <span>Conhecer a coleção</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="md:flex-1 w-full">
              <div className="space-y-3">
                {guardians.map(g => (
                  <div key={g.n} className="flex items-center gap-4 bg-white border border-[#C7A57F]/20 rounded-2xl p-4 shadow-xs">
                    <div className="w-10 h-10 rounded-full bg-[#F5EEE5] border border-[#C7A57F]/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-[#9A7655]">Nº{g.n}</span>
                    </div>
                    <div>
                      <p className="font-serif font-bold text-[#4D4038] text-sm">{g.name}</p>
                      <p className="text-[11px] text-[#786A61]">{g.keywords}</p>
                    </div>
                    <span className="ml-auto text-[9px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Disponível
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
