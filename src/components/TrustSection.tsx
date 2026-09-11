import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { siteConfig } from '../config/site';
import {
  WhatsAppVectorIcon,
  SpoolThreadIcon,
  DevotionHeartIcon,
  GiftBoxIcon,
  ChatBubbleVectorIcon,
} from './icons/ProductIcons';

export const TrustSection: React.FC = () => {
  const { settings } = useData();
  const brandName = settings.name || siteConfig.name;
  const whatsappNum = settings.whatsapp || siteConfig.whatsapp;

  const pillars = [
    {
      icon: <SpoolThreadIcon size={26} />,
      title: 'Ponto a ponto em crochê',
      description: 'Cada terço é tecido à mão com fios nobres de algodão, dedicação e clima de oração.',
    },
    {
      icon: <DevotionHeartIcon size={26} />,
      title: 'Personalização sob medida',
      description: 'Monte seu terço escolhendo cores do fio, contas, entremeios marianos e gravação de nome.',
    },
    {
      icon: <GiftBoxIcon size={26} />,
      title: 'Embalagem especial',
      description: 'Enviamos para todo o Brasil com caixinha protetora, aroma acolhedor e cartão para presente.',
    },
    {
      icon: <ChatBubbleVectorIcon size={26} />,
      title: 'Atendimento afetuoso',
      description: 'Estamos disponíveis pelo WhatsApp para orientar, tirar dúvidas e acompanhar cada detalhe da sua encomenda.',
    },
  ];

  return (
    <section className="py-16 md:py-20 px-4 bg-[#FCFAF7] border-t border-[#C7A57F]/15">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[11px] font-bold text-[#9A7655] uppercase tracking-[0.25em] block mb-2">
            Nossos Valores
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#4D4038] mb-2">
            Por que escolher a {brandName}?
          </h2>
          <p className="text-[#786A61] max-w-md mx-auto text-xs sm:text-sm">
            Mais do que um produto, uma peça com intenção, oração e carinho.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((p, idx) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-white border border-[#C7A57F]/20 rounded-3xl p-6 hover:border-[#CA9F53]/50 hover:shadow-warm transition-all shadow-soft text-left group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#F5EEE5] text-[#9A7655] flex items-center justify-center mb-4 border border-[#C7A57F]/20 shadow-xs group-hover:bg-[#9A7655] group-hover:text-white transition-all duration-300">
                {p.icon}
              </div>
              <h3 className="font-serif font-bold text-[#4D4038] mb-2 text-base">{p.title}</h3>
              <p className="text-[#786A61] text-xs leading-relaxed">{p.description}</p>
            </motion.div>
          ))}
        </div>

        {whatsappNum && (
          <div className="text-center mt-10">
            <a
              href={`https://wa.me/${(whatsappNum || siteConfig.whatsapp).replace(/\D/g, '').startsWith('55') ? (whatsappNum || siteConfig.whatsapp).replace(/\D/g, '') : `55${(whatsappNum || siteConfig.whatsapp).replace(/\D/g, '')}`}?text=${encodeURIComponent('Olá! Gostaria de conversar sobre as peças da Fio Sagrado.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp inline-flex items-center gap-2 text-xs"
            >
              <WhatsAppVectorIcon size={16} />
              <span>Falar pelo WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};
