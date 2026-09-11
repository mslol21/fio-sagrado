import React from 'react';
import type { CustomizationComponent } from '../../types';
import { RosaryOptionCard } from './RosaryOptionCard';
import { motion } from 'framer-motion';

interface CrucifixSelectorProps {
  crucifixes: CustomizationComponent[];
  selectedCrucifix?: CustomizationComponent;
  onSelectCrucifix: (component: CustomizationComponent) => void;
}

export const CrucifixSelector: React.FC<CrucifixSelectorProps> = ({
  crucifixes,
  selectedCrucifix,
  onSelectCrucifix
}) => {
  const activeCrucifixes = crucifixes
    .filter(c => c.component_type === 'crucifix' && c.is_active !== false)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  return (
    <div className="space-y-4">
      <div>
        <span className="text-[10px] text-gold-dark font-black uppercase tracking-[0.2em] block mb-1">
          Etapa 5 de 7
        </span>
        <h3 className="font-serif font-bold text-2xl text-navy">
          Escolha a Cruz / Crucifixo
        </h3>
        <p className="text-xs text-navy/60 leading-relaxed mt-1">
          O símbolo maior de redenção que encerra o terço com beleza, detalhe e espiritualidade.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3 pt-2"
      >
        {activeCrucifixes.map((item) => (
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
            isSelected={selectedCrucifix?.id === item.id}
            isDisabled={item.stock !== undefined && item.stock <= 0}
            disabledReason={item.stock !== undefined && item.stock <= 0 ? 'Opção esgotada no momento' : undefined}
            onClick={() => onSelectCrucifix(item)}
          />
        ))}
      </motion.div>
    </div>
  );
};
