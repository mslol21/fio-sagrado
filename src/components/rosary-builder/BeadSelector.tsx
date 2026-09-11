import React, { useState, useMemo } from 'react';
import type { CustomizationComponent } from '../../types';
import { RosaryOptionCard } from './RosaryOptionCard';
import { BeadSizeComparison } from './BeadSizeComparison';
import { getBeadSizeClassification } from '../../utils/beadClassification';
import { motion } from 'framer-motion';

interface BeadSelectorProps {
  beads: CustomizationComponent[];
  selectedBead?: CustomizationComponent;
  builderMode?: 'terco' | 'pulseira';
  onSelectBead: (bead: CustomizationComponent) => void;
}

export const BeadSelector: React.FC<BeadSelectorProps> = ({
  beads,
  selectedBead,
  builderMode = 'terco',
  onSelectBead
}) => {
  const [sizeFilter, setSizeFilter] = useState<'all' | '6mm' | '8mm'>('all');

  const activeBeads = useMemo(() => {
    return beads
      .filter(b => b.component_type === 'bead' && b.is_active !== false)
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  }, [beads]);

  const count6mm = useMemo(() => {
    return activeBeads.filter(b => getBeadSizeClassification(b) === '6mm').length;
  }, [activeBeads]);

  const count8mm = useMemo(() => {
    return activeBeads.filter(b => getBeadSizeClassification(b) === '8mm').length;
  }, [activeBeads]);

  const displayedBeads = useMemo(() => {
    if (sizeFilter === 'all') return activeBeads;
    return activeBeads.filter(b => getBeadSizeClassification(b) === sizeFilter);
  }, [activeBeads, sizeFilter]);

  const isPulseira = builderMode === 'pulseira';

  return (
    <div className="space-y-5">
      <div>
        <span className="text-[10px] text-gold-dark font-black uppercase tracking-[0.2em] block mb-1">
          Etapa 2 de 5
        </span>
        <h3 className="font-serif font-bold text-2xl text-navy">
          {isPulseira ? 'Escolha as Contas da Dezena (10x)' : 'Escolha as Contas das Ave-Marias'}
        </h3>
        <p className="text-xs text-navy/60 leading-relaxed mt-1">
          {isPulseira
            ? 'As 10 contas que compõem a dezena de pulso em crochê. Escolha o tom e tamanho perfeito para o seu uso diário.'
            : 'As contas principais representam as 53 Ave-Marias do seu terço. Escolha entre o tamanho delicado de 6mm ou clássico de 8mm.'}
        </p>
      </div>

      {/* Guia Comparativo Visual de Imagem e Escala */}
      <BeadSizeComparison
        selectedSizeFilter={sizeFilter}
        onSelectSizeFilter={setSizeFilter}
        title="Guia Comparativo: Bolinhas 6mm vs 8mm"
      />

      {/* Abas de Classificação e Filtro */}
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
          Todas as Contas ({activeBeads.length})
        </button>

        <button
          type="button"
          onClick={() => setSizeFilter('6mm')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            sizeFilter === '6mm'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-white border border-gold/20 text-navy/70 hover:border-gold/50'
          }`}
        >
          <span>6mm • Delicadas</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
            sizeFilter === '6mm' ? 'bg-white/20 text-white' : 'bg-gold/20 text-navy'
          }`}>
            {count6mm}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSizeFilter('8mm')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            sizeFilter === '8mm'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-white border border-gold/20 text-navy/70 hover:border-gold/50'
          }`}
        >
          <span>8mm • Clássicas</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
            sizeFilter === '8mm' ? 'bg-white/20 text-white' : 'bg-gold/20 text-navy'
          }`}>
            {count8mm}
          </span>
        </button>
      </div>

      {/* Lista de Opções Classificadas */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3 pt-1"
      >
        {displayedBeads.map((bead) => {
          const sizeClass = getBeadSizeClassification(bead);
          const badgeLabel = sizeClass === '6mm' ? '6mm • Delicada' : '8mm • Clássica';

          return (
            <RosaryOptionCard
              key={bead.id}
              id={bead.id}
              name={bead.name}
              description={bead.description}
              image={bead.image}
              color={bead.color}
              material={bead.material}
              size={bead.size || (sizeClass === '6mm' ? '6mm' : '8mm')}
              badge={badgeLabel}
              additionalPrice={bead.additional_price}
              isSelected={selectedBead?.id === bead.id}
              isDisabled={bead.stock !== undefined && bead.stock <= 0}
              disabledReason={bead.stock !== undefined && bead.stock <= 0 ? 'Opção esgotada no momento' : undefined}
              onClick={() => onSelectBead(bead)}
            />
          );
        })}
      </motion.div>
    </div>
  );
};
