import React from 'react';
import { Heart } from 'lucide-react';
import { useData } from '../context/DataContext';
import { siteConfig } from '../config/site';
import {
  SpoolThreadIcon,
  HandmadeHandsIcon,
  SacredDoveIcon,
  DevotionHeartIcon,
  WhatsAppVectorIcon,
} from '../components/icons/ProductIcons';

const OurStory: React.FC = () => {
  const { settings } = useData();
  const brandName = settings.name || siteConfig.name;
  const whatsappNum = settings.whatsapp || siteConfig.whatsapp;

  const hasAboutContent = settings.about_text || settings.about_image;

  return (
    <div className="pt-[4.75rem] md:pt-[5.25rem] min-h-screen bg-[#FCFAF7]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#F5EEE5] via-[#FCFAF7] to-[#F5EEE5]/60 border-b border-[#C7A57F]/15 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[11px] text-[#9A7655] uppercase tracking-[0.3em] font-bold mb-3">O Ateliê</p>
          <h1 className="font-serif font-bold text-4xl sm:text-5xl text-[#4D4038] mb-4">Nossa História</h1>
          <p className="text-[#786A61] text-base leading-relaxed max-w-xl mx-auto">
            Conheça o propósito, a devoção e o carinho por trás de cada terço artesanal em crochê da {brandName}.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {hasAboutContent ? (
          <div className="space-y-12">
            {settings.about_image && (
              <div className="rounded-3xl overflow-hidden aspect-video border border-[#C7A57F]/20 shadow-warm">
                <img src={settings.about_image} alt={brandName} className="w-full h-full object-cover" />
              </div>
            )}
            {settings.about_text && (
              <div className="prose prose-neutral max-w-none text-[#4D4038] bg-white p-8 rounded-3xl border border-[#C7A57F]/20 shadow-soft">
                <p className="text-[#4D4038] leading-relaxed text-base whitespace-pre-wrap">{settings.about_text}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Sections about the brand */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { 
                  icon: <SpoolThreadIcon size={26} />, 
                  title: 'Como tudo começou', 
                  desc: 'A Fio Sagrado nasceu do desejo de unir a oração do Santo Rosário à beleza acolhedora do trabalho manual em crochê, transformando fios e contas em instrumentos de profunda devoção.' 
                },
                { 
                  icon: <HandmadeHandsIcon size={26} />, 
                  title: 'O Trabalho Artesanal', 
                  desc: 'Cada terço é tecido à mão, ponto por ponto, com fios nobres de algodão selecionados, garantindo suavidade ao toque, leveza e durabilidade para acompanhar a rotina diária de fé.' 
                },
                { 
                  icon: <SacredDoveIcon size={26} />, 
                  title: 'Nosso Propósito', 
                  desc: 'Proporcionar momentos de paz, contemplação e proximidade com Deus e Nossa Senhora através de peças criadas com afeto, delicadeza e respeito às tradições da fé.' 
                },
                { 
                  icon: <DevotionHeartIcon size={26} />, 
                  title: 'Nossos Valores', 
                  desc: 'Amor pelo trabalho manual, respeito à espiritualidade de cada pessoa, acabamento refinado e compromisso com um atendimento próximo, humano e carinhoso.' 
                },
              ].map(s => (
                <div key={s.title} className="bg-white border border-[#C7A57F]/20 rounded-3xl p-7 shadow-soft hover:shadow-warm transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-[#F5EEE5] text-[#9A7655] flex items-center justify-center mb-4 border border-[#C7A57F]/20 group-hover:bg-[#9A7655] group-hover:text-white transition-all duration-300">
                    {s.icon}
                  </div>
                  <h3 className="font-serif font-bold text-xl text-[#4D4038] mb-2">{s.title}</h3>
                  <p className="text-[#786A61] text-xs sm:text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center pt-4">
              <p className="text-[#786A61] text-sm mb-4">Deseja conhecer mais ou encomendar um terço personalizado?</p>
              {whatsappNum && (
                <a
                  href={`https://wa.me/${(whatsappNum || siteConfig.whatsapp).replace(/\D/g, '').startsWith('55') ? (whatsappNum || siteConfig.whatsapp).replace(/\D/g, '') : `55${(whatsappNum || siteConfig.whatsapp).replace(/\D/g, '')}`}?text=${encodeURIComponent('Olá! Gostaria de conversar com o ateliê Fio Sagrado.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp inline-flex items-center gap-2"
                >
                  <WhatsAppVectorIcon size={18} />
                  <span>Falar pelo WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Values Banner */}
        <div className="mt-16 bg-[#4D4038] rounded-3xl p-10 text-center text-[#F5EEE5] shadow-warm">
          <Heart size={32} className="text-[#CA9F53] mx-auto mb-4" />
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#F5EEE5] mb-3">
            {siteConfig.slogan}
          </h2>
          <p className="text-[#F5EEE5]/75 max-w-lg mx-auto text-xs sm:text-sm leading-relaxed">
            Terços artesanais em crochê criados para oração pessoal, celebrações religiosas e presentes inesquecíveis que tocam o coração.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OurStory;
