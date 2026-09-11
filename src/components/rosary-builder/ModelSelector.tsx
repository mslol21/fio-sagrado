import React from 'react';
import type { RosaryModel } from '../../types';
import { RosaryOptionCard } from './RosaryOptionCard';
import { motion } from 'framer-motion';
import { 
  TradicionalModelIcon,
  DelicadoModelIcon,
  PremiumModelIcon,
  NoivaModelIcon,
  InfantilModelIcon,
  DezenaVectorIcon,
  BraceletVectorIcon
} from '../icons/ProductIcons';

interface ModelSelectorProps {
  models: RosaryModel[];
  selectedModel?: RosaryModel;
  builderMode?: 'terco' | 'pulseira';
  onSelectModel: (model: RosaryModel) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModel,
  builderMode = 'terco',
  onSelectModel
}) => {
  const activeModels = models
    .filter(m => {
      if (m.is_active === false) return false;
      const isPulseiraModel = m.product_type === 'bracelet' || m.slug.includes('pulseira');
      if (builderMode === 'pulseira') return isPulseiraModel;
      return !isPulseiraModel;
    })
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  const getModelBadge = (slug: string): string => {
    switch (slug) {
      case 'pulseira-croche-regulavel': return 'Fecho Macramê';
      case 'pulseira-croche-delicada': return 'Mini 6mm';
      case 'pulseira-croche-sao-bento': return 'São Bento';
      case 'pulseira-croche-noiva': return 'Pérolas & Zircônia';
      case 'croche-delicado':
      case 'delicado': return 'Contas Finas 6mm';
      case 'croche-noiva':
      case 'noiva': return 'Nupcial & Zircônias';
      case 'croche-infantil':
      case 'infantil': return 'Acabamento Suave';
      case 'croche-dezena':
      case 'dezena': return '1 Dezena Compacta';
      case 'croche-colecao':
      case 'premium': return 'Coleção Ouro';
      case 'croche-tradicional':
      case 'tradicional': 
      default: 
        return builderMode === 'pulseira' ? 'Ajustável' : '5 Dezenas Clássicas';
    }
  };

  const getModelIcon = (slug: string): React.ReactNode => {
    if (slug.includes('pulseira')) {
      return <BraceletVectorIcon size={30} className="text-gold-dark" />;
    }
    switch (slug) {
      case 'croche-dezena':
      case 'dezena':
        return <DezenaVectorIcon size={30} className="text-gold-dark" />;
      case 'croche-delicado':
      case 'delicado':
        return <DelicadoModelIcon size={30} className="text-gold-dark" />;
      case 'croche-colecao':
      case 'premium':
        return <PremiumModelIcon size={30} className="text-gold-dark" />;
      case 'croche-noiva':
      case 'noiva':
        return <NoivaModelIcon size={30} className="text-gold-dark" />;
      case 'croche-infantil':
      case 'infantil':
        return <InfantilModelIcon size={30} className="text-rose-500" />;
      case 'croche-tradicional':
      case 'tradicional':
      default:
        return <TradicionalModelIcon size={30} className="text-gold-dark" />;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <span className="text-[10px] text-gold-dark font-black uppercase tracking-[0.2em] block mb-1">
          Etapa 1 de 5
        </span>
        <h3 className="font-serif font-bold text-2xl text-navy">
          {builderMode === 'pulseira' ? 'Escolha o Modelo da sua Pulseira' : 'Escolha o Modelo do seu Terço'}
        </h3>
        <p className="text-xs text-navy/60 leading-relaxed mt-1">
          {builderMode === 'pulseira'
            ? 'Selecione o estilo da dezena de pulso em crochê. O simulador 2D ao lado se adapta em tempo real à estrutura escolhida.'
            : 'Selecione o formato da sua peça. O simulador 2D ao lado se adapta em tempo real à estrutura escolhida.'}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3 pt-2"
      >
        {activeModels.map((model) => (
          <RosaryOptionCard
            key={model.id}
            id={model.id}
            name={model.name}
            description={model.description}
            image={model.image}
            badge={getModelBadge(model.slug)}
            icon={getModelIcon(model.slug)}
            basePrice={model.base_price}
            isSelected={selectedModel?.id === model.id}
            onClick={() => onSelectModel(model)}
          />
        ))}
      </motion.div>
    </div>
  );
};
