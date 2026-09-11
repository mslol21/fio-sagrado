import React from 'react';
import type { CustomizationComponent } from '../../types';
import { RosaryOptionCard } from './RosaryOptionCard';
import { motion } from 'framer-motion';

interface CenterpieceSelectorProps {
  centerpieces: CustomizationComponent[];
  selectedCenterpiece?: CustomizationComponent;
  builderMode?: 'terco' | 'pulseira';
  onSelectCenterpiece: (component: CustomizationComponent) => void;
}

export const CenterpieceSelector: React.FC<CenterpieceSelectorProps> = ({
  centerpieces,
  selectedCenterpiece,
  builderMode = 'terco',
  onSelectCenterpiece
}) => {
  const activeCenterpieces = centerpieces
    .filter(c => c.component_type === 'centerpiece' && c.is_active !== false)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  const isPulseira = builderMode === 'pulseira';

  return (
    <div className="space-y-4">
      <div>
        <span className="text-[10px] text-gold-dark font-black uppercase tracking-[0.2em] block mb-1">
          Etapa 4 de 5
        </span>
        <h3 className="font-serif font-bold text-2xl text-navy">
          {isPulseira ? 'Escolha a Medalha Central da Pulseira' : 'Escolha a Medalha Central (Entremeio)'}
        </h3>
        <p className="text-xs text-navy/60 leading-relaxed mt-1">
          {isPulseira
            ? 'O pingente devocional central que acompanha a mini cruz inclusa na sua pulseira.'
            : 'O coração devocional da sua peça. Selecione a intercessão do seu santo de devoção ou título mariano.'}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3 pt-2"
      >
        {activeCenterpieces.map((item) => (
          <RosaryOptionCard
            key={item.id}
            id={item.id}
            name={item.name}
            description={item.description}
            image={item.image}
            color={item.color}
            material={item.material}
            size={item.size}
            additionalPrice={item.additional_price}
            isSelected={selectedCenterpiece?.id === item.id}
            isDisabled={item.stock !== undefined && item.stock <= 0}
            disabledReason={item.stock !== undefined && item.stock <= 0 ? 'Opção esgotada no momento' : undefined}
            onClick={() => onSelectCenterpiece(item)}
          />
        ))}
      </motion.div>
    </div>
  );
};
