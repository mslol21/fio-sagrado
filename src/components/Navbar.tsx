import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, ChevronDown, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { siteConfig } from '../config/site';
import { motion, AnimatePresence } from 'framer-motion';

import { WhatsAppVectorIcon } from './icons/ProductIcons';

const WHATSAPP_ICON = () => <WhatsAppVectorIcon size={18} className="text-[#25D366]" />;

export const Navbar: React.FC<{ onCartClick: () => void }> = ({ onCartClick }) => {
  const { totalItems } = useCart();
  const { settings } = useData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLojaOpen, setIsLojaOpen] = useState(false);
  const location = useLocation();

  const handleNavClose = () => {
    setIsMenuOpen(false);
    setIsLojaOpen(false);
  };

  const lojaLinks = [
    { label: 'Todos os Terços & Peças', to: '/loja' },
    { label: 'Terços Artesanais em Crochê', to: '/loja?categoria=tercos-artesanais' },
    { label: 'Terços Personalizados', to: '/loja?categoria=tercos-personalizados' },
    { label: 'Nossa Senhora & Devoções', to: '/loja?categoria=nossa-senhora' },
    { label: 'Batizado & Ocasiões Especiais', to: '/loja?categoria=batizado' },
    { label: 'Casamento & Noivas', to: '/loja?categoria=casamento' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#FCFAF7]/95 backdrop-blur-md border-b border-[#C7A57F]/25 shadow-xs transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 h-[4.75rem] md:h-[5.25rem] flex items-center justify-between gap-4">

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-[#4D4038] hover:text-[#9A7655] transition-colors cursor-pointer"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" onClick={handleNavClose} className="flex items-center gap-3.5 flex-shrink-0 group py-1">
            <img 
              src="/logo.png" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.endsWith('/logo.svg')) {
                  target.src = '/logo.svg';
                }
              }}
              alt={settings.name || siteConfig.name} 
              className="h-10 sm:h-12 md:h-14 w-auto max-w-[220px] object-contain group-hover:scale-102 transition-transform duration-300" 
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1.5">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'nav-link-active' : ''}`}>
              Início
            </Link>

            {/* Loja dropdown */}
            <div className="relative" onMouseEnter={() => setIsLojaOpen(true)} onMouseLeave={() => setIsLojaOpen(false)}>
              <Link to="/loja" className={`nav-link flex items-center gap-1 ${location.pathname.startsWith('/loja') ? 'nav-link-active' : ''}`}>
                Loja <ChevronDown size={13} className={`transition-transform text-[#9A7655] ${isLojaOpen ? 'rotate-180' : ''}`} />
              </Link>
              <AnimatePresence>
                {isLojaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-64 bg-[#FCFAF7] border border-[#C7A57F]/30 rounded-2xl shadow-xl py-2.5 z-50"
                  >
                    {lojaLinks.map(l => (
                      <Link key={l.label} to={l.to} onClick={handleNavClose}
                        className="block px-4 py-2.5 text-xs font-semibold text-[#4D4038]/80 hover:text-[#9A7655] hover:bg-[#F5EEE5] transition-colors uppercase tracking-wider">
                        {l.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Monte seu Terço / Pulseira — Featured Nav Button */}
            <Link
              to="/monte-seu-terco"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                location.pathname === '/monte-seu-terco' || location.pathname === '/monte-sua-pulseira'
                  ? 'bg-[#9A7655] text-white shadow-md'
                  : 'bg-[#9A7655]/10 text-[#9A7655] hover:bg-[#9A7655] hover:text-white'
              }`}
            >
              <Sparkles size={13} className={location.pathname === '/monte-seu-terco' ? 'text-[#F5EEE5]' : 'text-[#CA9F53]'} />
              <span>Monte seu Terço / Pulseira</span>
            </Link>

            <Link to="/nossa-historia" className={`nav-link ${location.pathname === '/nossa-historia' ? 'nav-link-active' : ''}`}>
              Nossa História
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* WhatsApp */}
            {(settings.whatsapp || siteConfig.whatsapp) && (
              <a
                href={`https://wa.me/${settings.whatsapp || siteConfig.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 text-[#25D366] hover:bg-[#F5EEE5] rounded-full transition-all text-xs font-bold uppercase tracking-wider border border-[#25D366]/20"
                aria-label="WhatsApp"
              >
                <WHATSAPP_ICON />
                <span className="hidden lg:inline text-[#4D4038]">Falar conosco</span>
              </a>
            )}

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="relative p-2.5 text-[#4D4038] hover:text-[#9A7655] hover:bg-[#F5EEE5] rounded-full transition-all active:scale-90 group cursor-pointer"
              aria-label="Carrinho"
            >
              <ShoppingCart size={22} className="group-hover:rotate-6 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#9A7655] text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white min-w-[18px] min-h-[18px] px-1 shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleNavClose}
              className="fixed inset-0 bg-[#4D4038]/50 backdrop-blur-xs z-[45] md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed left-0 top-0 bottom-0 w-[84%] max-w-[320px] bg-[#FCFAF7] text-[#4D4038] z-[50] md:hidden flex flex-col overflow-y-auto border-r border-[#C7A57F]/25 shadow-2xl"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-5 border-b border-[#C7A57F]/20 bg-[#F5EEE5]/40">
                <Link to="/" onClick={handleNavClose} className="flex items-center gap-3">
                  <img
                    src="/logo.png"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.endsWith('/logo.svg')) {
                        target.src = '/logo.svg';
                      }
                    }}
                    alt={settings.name || siteConfig.name}
                    className="h-9 w-auto max-w-[180px] object-contain"
                  />
                </Link>
                <button onClick={handleNavClose} className="p-2 text-[#786A61] hover:text-[#4D4038] rounded-full hover:bg-[#F5EEE5] cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Featured CTA */}
              <div className="p-4 pb-2 space-y-2">
                <Link
                  to="/monte-seu-terco"
                  onClick={handleNavClose}
                  className="flex items-center justify-between p-3.5 bg-[#9A7655] text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md hover:bg-[#836243]"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-[#F5EEE5]" />
                    <span>Monte seu Terço</span>
                  </div>
                  <span className="text-[10px] bg-white text-[#9A7655] px-2 py-0.5 rounded-full font-bold">2D</span>
                </Link>

                <Link
                  to="/monte-sua-pulseira"
                  onClick={handleNavClose}
                  className="flex items-center justify-between p-3.5 bg-[#F5EEE5] text-[#9A7655] border border-[#C7A57F]/30 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-[#FCFAF7]"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-[#CA9F53]" />
                    <span>Monte sua Pulseira</span>
                  </div>
                  <span className="text-[10px] bg-[#9A7655] text-white px-2 py-0.5 rounded-full font-bold">Novo</span>
                </Link>
              </div>

              {/* Mobile Links */}
              <nav className="flex-1 p-4 space-y-1">
                {[
                  { label: 'Início', to: '/' },
                  { label: 'Loja Completa', to: '/loja' },
                  { label: 'Nossa História', to: '/nossa-historia' },
                ].map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={handleNavClose}
                    className={`flex items-center p-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
                      location.pathname === item.to
                        ? 'bg-[#F5EEE5] text-[#9A7655] font-black'
                        : 'text-[#4D4038]/80 hover:text-[#9A7655] hover:bg-[#F5EEE5]/50'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Footer */}
              <div className="p-5 border-t border-[#C7A57F]/20 space-y-3 bg-[#F5EEE5]/30">
                {(settings.whatsapp || siteConfig.whatsapp) && (
                  <a
                    href={`https://wa.me/${settings.whatsapp || siteConfig.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleNavClose}
                    className="flex items-center gap-3 p-3.5 bg-[#25D366]/10 text-[#25D366] rounded-2xl font-bold text-xs uppercase tracking-wider"
                  >
                    <WHATSAPP_ICON />
                    <span>Falar pelo WhatsApp</span>
                  </a>
                )}
                {(settings.instagram || siteConfig.instagram) && (
                  <a
                    href={`https://instagram.com/${settings.instagram || siteConfig.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleNavClose}
                    className="flex items-center gap-3 p-3.5 text-[#786A61] hover:text-[#4D4038] rounded-2xl hover:bg-[#F5EEE5] transition-all font-semibold text-xs"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                    <span>@{settings.instagram || siteConfig.instagram}</span>
                  </a>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
