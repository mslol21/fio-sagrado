import React from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { RosaryBuilder } from '../components/rosary-builder/RosaryBuilder';
import { ArrowLeft, Sparkles, Heart } from 'lucide-react';
import { GiftBoxIcon } from '../components/icons/ProductIcons';

const RosaryBuilderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const isPulseira = searchParams.get('tipo') === 'pulseira' || location.pathname.includes('pulseira');

  return (
    <div className="pt-[4.75rem] md:pt-[5.25rem] min-h-screen bg-[#FCFAF7]">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#F5EEE5] via-[#FCFAF7] to-[#F5EEE5]/60 py-12 px-4 relative overflow-hidden border-b border-[#C7A57F]/15">
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#9A7655] hover:text-[#836243] uppercase tracking-wider font-bold transition-colors"
            >
              <ArrowLeft size={13} /> Voltar ao Início
            </Link>
          </div>

          <p className="text-[11px] text-[#9A7655] uppercase tracking-[0.3em] font-bold mb-2">
            Simulador 2D Interativo • Fio Sagrado
          </p>
          <h1 className="font-serif font-bold text-3xl sm:text-5xl text-[#4D4038] mb-3">
            {isPulseira ? 'Monte sua Pulseira de Terço em Crochê' : 'Monte seu Terço ou Pulseira em Crochê'}
          </h1>
          <p className="text-[#786A61] max-w-xl mx-auto text-xs sm:text-sm leading-relaxed">
            {isPulseira
              ? 'Personalize sua dezena de oração para o pulso com fecho regulável macramê, contas nobres e medalha central. Visualize cada ponto em tempo real no simulador.'
              : 'Escolha cada detalhe — modelo tradicional ou pulseira regulável, contas, entremeio sagrado e crucifixo. Acompanhe a montagem em tempo real e receba uma peça artesanal exclusiva.'}
          </p>
        </div>
      </div>

      {/* Main Builder Container */}
      <RosaryBuilder />

      {/* Trust & Craftsmanship Footer Info */}
      <div className="bg-white/80 border-t border-[#C7A57F]/15 py-8 px-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-8 text-xs text-[#786A61] font-medium">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#CA9F53]" />
            <span>Feito artesanalmente à mão ponto por ponto</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-[#CA9F53]" />
            <span>Fios de algodão nobre & acabamento refinado</span>
          </div>
          <div className="flex items-center gap-2">
            <GiftBoxIcon size={16} className="text-[#CA9F53]" />
            <span>Embalagem especial com cartão dedicatória</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RosaryBuilderPage;
