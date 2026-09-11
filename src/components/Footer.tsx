import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { siteConfig } from '../config/site';
import { Lock } from 'lucide-react';
import { WhatsAppVectorIcon } from './icons/ProductIcons';

export const Footer: React.FC = () => {
  const { settings } = useData();

  const brandName = settings.name || siteConfig.name;
  const brandSlogan = settings.slogan || siteConfig.slogan;
  const whatsappNum = settings.whatsapp || siteConfig.whatsapp;
  const instagramHandle = settings.instagram || siteConfig.instagram;

  return (
    <footer className="bg-[#4D4038] text-[#F5EEE5] py-16 px-4 border-t border-[#9A7655]/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-3.5 mb-4 group">
              <div className="bg-[#FCFAF7] p-2.5 rounded-2xl border border-[#C7A57F]/30 shadow-md">
                <img 
                  src="/logo.png" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.endsWith('/logo.svg')) {
                      target.src = '/logo.svg';
                    }
                  }}
                  alt={brandName} 
                  className="h-10 w-auto max-w-[190px] object-contain group-hover:scale-102 transition-transform" 
                />
              </div>
            </Link>
            <p className="text-[#C7A57F] text-xs uppercase tracking-widest font-semibold mb-2">
              {brandSlogan}
            </p>
            <p className="text-[#F5EEE5]/70 text-xs leading-relaxed mb-6 max-w-xs">
              Terços e pulseiras artesanais em crochê criados para acompanhar momentos de oração, devoção e presentes cheios de afeto.
            </p>
            <div className="flex gap-2.5">
              {instagramHandle && (
                <a
                  href={`https://instagram.com/${instagramHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#9A7655] hover:text-white transition-all border border-white/10 text-[#F5EEE5]"
                  aria-label="Instagram"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
              )}
              {whatsappNum && (
                <a
                  href={`https://wa.me/${whatsappNum}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all border border-white/10 text-[#F5EEE5]"
                  aria-label="WhatsApp"
                >
                  <WhatsAppVectorIcon size={16} />
                </a>
              )}
              <Link
                to="/admin"
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#9A7655] hover:text-white transition-all border border-white/10 text-[#F5EEE5]/40"
                title="Área Administrativa"
                aria-label="Admin"
              >
                <Lock size={14} />
              </Link>
            </div>
          </div>

          {/* Categorias */}
          <div>
            <h4 className="font-serif font-bold mb-4 text-xs uppercase tracking-[0.25em] text-[#C7A57F]">Categorias</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Loja Completa', to: '/loja' },
                { label: 'Terços Artesanais', to: '/loja?categoria=tercos-artesanais' },
                { label: 'Monte seu Terço (2D)', to: '/monte-seu-terco' },
                { label: 'Monte sua Pulseira (2D)', to: '/monte-sua-pulseira' },
                { label: 'Pulseiras & Dezenas', to: '/loja?categoria=pulseiras' },
                { label: 'Casamento & Noivas', to: '/loja?categoria=casamento' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="text-[#F5EEE5]/75 hover:text-[#CA9F53] text-xs transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Atendimento & Encomendas */}
          <div>
            <h4 className="font-serif font-bold mb-4 text-xs uppercase tracking-[0.25em] text-[#C7A57F]">Atendimento</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Monte seu Terço (2D)', to: '/monte-seu-terco' },
                { label: 'Monte sua Pulseira (2D)', to: '/monte-sua-pulseira' },
                { label: 'Nossa História', to: '/nossa-historia' },
                { label: 'Catálogo de Produtos', to: '/loja' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="text-[#F5EEE5]/75 hover:text-[#CA9F53] text-xs transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sobre o Ateliê */}
          <div>
            <h4 className="font-serif font-bold mb-4 text-xs uppercase tracking-[0.25em] text-[#C7A57F]">Ateliê</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Nossa História & Propósito', to: '/nossa-historia' },
                { label: 'Trabalho Manual em Crochê', to: '/nossa-historia' },
                { label: 'Guia de Devoção e Oração', to: '/loja' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="text-[#F5EEE5]/75 hover:text-[#CA9F53] text-xs transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            {whatsappNum && (
              <div className="mt-4 pt-3 border-t border-white/10">
                <a
                  href={`https://wa.me/${whatsappNum}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#25D366] hover:underline flex items-center gap-1.5 font-semibold"
                >
                  <WhatsAppVectorIcon size={14} />
                  <span>WhatsApp do Ateliê</span>
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#F5EEE5]/40">
          <p>
            © {new Date().getFullYear()} {brandName}. {siteConfig.subtitle}. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <span className="text-[#F5EEE5]/60">Feito à mão ponto por ponto com fé e carinho</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
