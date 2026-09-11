import React, { useState, useMemo } from 'react';
import type { CustomizationComponent } from '../../types';
import { RosaryOptionCard } from './RosaryOptionCard';
import { BeadSizeComparison } from './BeadSizeComparison';
import { motion } from 'framer-motion';

interface OurFatherSelectorProps {
  ourFatherBeads: CustomizationComponent[];
  selectedOurFather?: CustomizationComponent;
  builderMode?: 'terco' | 'pulseira';
  onSelectOurFather: (component: CustomizationComponent) => void;
}

export const OurFatherSelector: React.FC<OurFatherSelectorProps> = ({
  ourFatherBeads,
  selectedOurFather,
  builderMode = 'terco',
  onSelectOurFather
}) => {
  const [sizeFilter, setSizeFilter] = useState<'all' | '6mm' | '8mm'>('all');

  const activeOurFathers = useMemo(() => {
    return ourFatherBeads
      .filter(b => b.component_type === 'our_father_bead' && b.is_active !== false)
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  }, [ourFatherBeads]);

  const displayedOurFathers = useMemo(() => {
    if (sizeFilter === 'all') return activeOurFathers;
    return activeOurFathers.filter(item => {
      const sizeStr = `${item.size || ''} ${item.name || ''}`.toLowerCase();
      if (sizeFilter === '6mm') {
        return sizeStr.includes('6mm') || sizeStr.includes('6 mm');
      }
      return sizeStr.includes('8mm') || sizeStr.includes('8 mm') || sizeStr.includes('10mm');
    });
  }, [activeOurFathers, sizeFilter]);

  const isPulseira = builderMode === 'pulseira';

  return (
    <div className="space-y-5">
      <div>
        <span className="text-[10px] text-gold-dark font-black uppercase tracking-[0.2em] block mb-1">
          Etapa 3 de 5
        </span>
        <h3 className="font-serif font-bold text-2xl text-navy">
          {isPulseira ? 'Conta de Destaque / Pai-Nosso' : 'Escolha as Contas dos Pai-Nossos'}
        </h3>
        <p className="text-xs text-navy/60 leading-relaxed mt-1">
          {isPulseira
            ? 'A conta especial de abertura da oração ou detalhe de destaque junto ao fecho e medalha central.'
            : 'As 6 contas maiores que separam as dezenas e abrem as orações. Veja abaixo o comparativo visual de proporção das bolinhas.'}
        </p>
      </div>

      {/* Guia Comparativo Visual */}
      <BeadSizeComparison
        selectedSizeFilter={sizeFilter}
        onSelectSizeFilter={setSizeFilter}
        title="Escala e Proporção das Contas (6mm vs 8mm)"
      />

      {/* Abas de Filtro de Tamanho */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide pt-1">
        <button
          type="button"
          onClick={() => setSizeFilter('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            sizeFilter === 'all'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-white border border-gold/20 text-navy/70 hover:border-gold/50'
          }`}
        >
          Todas as Opções ({activeOurFathers.length})
        </button>

        <button
          type="button"
          onClick={() => setSizeFilter('8mm')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            sizeFilter === '8mm'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-white border border-gold/20 text-navy/70 hover:border-gold/50'
          }`}
        >
          8mm / 10mm (Destaque Maior)
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3 pt-1"
      >
        {displayedOurFathers.map((item) => (
          <RosaryOptionCard
            key={item.id}
            id={item.id}
            name={item.name}
            description={item.description}
            image={item.image}
            color={item.color}
            material={item.material}
            size={item.size || '8mm'}
            badge={item.size || 'Destaque'}
            additionalPrice={item.additional_price}
            isSelected={selectedOurFather?.id === item.id}
            isDisabled={item.stock !== undefined && item.stock <= 0}
            disabledReason={item.stock !== undefined && item.stock <= 0 ? 'Opção esgotada no momento' : undefined}
            onClick={() => onSelectOurFather(item)}
          />
        ))}
      </motion.div>
    </div>
  );
};
