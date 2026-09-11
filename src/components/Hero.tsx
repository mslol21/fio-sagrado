import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, MessageCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { siteConfig } from '../config/site';

export const Hero: React.FC = () => {
  const { settings } = useData();
  const whatsappNumber = settings.whatsapp || siteConfig.whatsapp;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F5EEE5]/60 via-[#FCFAF7] to-[#FCFAF7] border-b border-[#C7A57F]/15 py-12 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Text Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-[#F5EEE5] text-[#9A7655] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.18em] border border-[#C7A57F]/30"
            >
              <Sparkles size={13} className="text-[#CA9F53]" />
              <span>Artesanato Religioso & Oração</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#4D4038] leading-[1.12] tracking-tight"
            >
              Terços feitos à mão, <span className="text-[#9A7655] italic font-normal">ponto por ponto</span>, com fé e carinho.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#786A61] text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal"
            >
              Peças artesanais em crochê criadas para acompanhar momentos de oração, devoção e presente.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start pt-2"
            >
              <Link
                to="/loja"
                className="btn-primary group"
              >
                <span>Conhecer os terços</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá! Gostaria de conhecer os terços artesanais em crochê da Fio Sagrado.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex items-center justify-center gap-2 group"
                >
                  <MessageCircle size={16} className="text-[#25D366]" />
                  <span>Falar pelo WhatsApp</span>
                </a>
              )}
            </motion.div>

            {/* Trust Chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-x-5 gap-y-2 justify-center lg:justify-start pt-4 border-t border-[#C7A57F]/15 text-xs text-[#786A61]"
            >
              <span className="flex items-center gap-1.5 font-medium">
                <span className="text-[#CA9F53]">✦</span> 100% feito à mão em crochê
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="text-[#CA9F53]">✦</span> Peças personalizadas sob medida
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="text-[#CA9F53]">✦</span> Embalagem para presente
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="text-[#CA9F53]">✦</span> Envio para todo o Brasil
              </span>
            </motion.div>
          </div>

          {/* Visual Column (5 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Card Frame */}
              <div className="relative aspect-[4/3] sm:aspect-[4/3] rounded-3xl overflow-hidden border border-[#C7A57F]/30 shadow-warm bg-white p-2">
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#F5EEE5]">
                  <img
                    src="https://images.unsplash.com/photo-1544161515-4af6b1d4b1c2?q=80&w=1000"
                    alt="Fio Sagrado — Terços Artesanais em Crochê"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#4D4038]/60 via-transparent to-transparent" />
                  
                  {/* Floating badge inside image */}
                  <div className="absolute bottom-4 left-4 right-4 bg-[#FCFAF7]/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#C7A57F]/30 shadow-md">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#F5EEE5] text-[#9A7655] flex items-center justify-center font-serif text-sm border border-[#C7A57F]/30">
                          ✦
                        </div>
                        <div>
                          <p className="text-xs font-serif font-bold text-[#4D4038]">Ponto por ponto com afeto</p>
                          <p className="text-[10px] text-[#786A61]">Acabamento manual nobre</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F5EEE5] text-[#9A7655] px-2.5 py-1 rounded-full border border-[#C7A57F]/30">
                        Crochê
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative subtle background blurs */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#C7A57F]/15 rounded-full blur-2xl -z-10 pointer-events-none" />
              <div className="absolute -bottom-6 -left-6 w-36 h-36 bg-[#D3A49B]/15 rounded-full blur-3xl -z-10 pointer-events-none" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
