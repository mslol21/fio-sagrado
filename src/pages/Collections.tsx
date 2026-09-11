import React from 'react';
import { Link } from 'react-router-dom';
import { GalleryHorizontal, ArrowRight, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';
import { siteConfig } from '../config/site';
import { motion } from 'framer-motion';

const STATUS_MAP = {
  active: { label: 'Disponível', dot: 'bg-emerald-500' },
  coming_soon: { label: 'Em breve', dot: 'bg-[#CA9F53]' },
  ended: { label: 'Encerrada', dot: 'bg-[#786A61]' },
};

const Collections: React.FC = () => {
  const { collections, settings } = useData();
  const brandName = settings.name || siteConfig.name;

  const sorted = [...collections]
    .filter(c => c.is_active)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  return (
    <div className="pt-[4.75rem] md:pt-[5.25rem] min-h-screen bg-[#FCFAF7]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#F5EEE5] via-[#FCFAF7] to-[#F5EEE5]/60 py-16 px-4 border-b border-[#C7A57F]/15">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[11px] text-[#9A7655] uppercase tracking-[0.3em] font-bold mb-3">Linhas Especiais</p>
          <h1 className="font-serif font-bold text-4xl sm:text-5xl text-[#4D4038] mb-4">
            Coleções {brandName}
          </h1>
          <p className="text-[#786A61] max-w-lg mx-auto text-sm leading-relaxed">
            Histórias de fé, devoções marianas e santos celebrados em terços de crochê com acabamento primoroso.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {sorted.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sorted.map((col, idx) => {
              const status = STATUS_MAP[col.status] || STATUS_MAP.active;
              return (
                <motion.div
                  key={col.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Link
                    to={`/colecoes/${col.slug}`}
                    className="group block bg-white border border-[#C7A57F]/20 hover:border-[#CA9F53]/50 rounded-3xl overflow-hidden shadow-soft hover:shadow-warm transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative aspect-video overflow-hidden bg-[#F5EEE5]">
                      {col.image ? (
                        <img
                          src={col.image}
                          alt={col.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#9A7655]/40">
                          <GalleryHorizontal size={40} />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider text-[#4D4038] border border-[#C7A57F]/20">
                        <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                        {status.label}
                      </div>
                    </div>

                    <div className="p-6">
                      <h2 className="font-serif font-bold text-xl text-[#4D4038] mb-2 group-hover:text-[#9A7655] transition-colors">
                        {col.name}
                      </h2>
                      {col.description && (
                        <p className="text-[#786A61] text-xs line-clamp-2 leading-relaxed mb-4">
                          {col.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between pt-3 border-t border-[#C7A57F]/15 text-xs font-bold text-[#9A7655]">
                        <span>Ver Peças da Coleção</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#C7A57F]/20 p-8 shadow-soft max-w-md mx-auto">
            <Sparkles size={40} className="text-[#9A7655] mx-auto mb-4" />
            <h3 className="font-serif font-bold text-xl text-[#4D4038] mb-2">Coleções em Preparação</h3>
            <p className="text-xs text-[#786A61] mb-6">
              Estamos tecendo novas coleções especiais com muito carinho. Enquanto isso, conheça todos os terços disponíveis na loja.
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

export default Collections;
