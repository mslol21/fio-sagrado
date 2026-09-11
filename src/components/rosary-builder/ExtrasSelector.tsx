import React from 'react';
import type { CustomizationComponent } from '../../types';
import { motion } from 'framer-motion';
import { Check, Gift, Heart, Sparkles } from 'lucide-react';

interface ExtrasSelectorProps {
  extrasComponents: CustomizationComponent[];
  selectedExtras: CustomizationComponent[];
  onToggleExtra: (component: CustomizationComponent) => void;
  customName: string;
  onChangeCustomName: (name: string) => void;
  customMessage: string;
  onChangeCustomMessage: (msg: string) => void;
  notes: string;
  onChangeNotes: (notes: string) => void;
}

export const ExtrasSelector: React.FC<ExtrasSelectorProps> = ({
  extrasComponents,
  selectedExtras,
  onToggleExtra,
  customName,
  onChangeCustomName,
  customMessage,
  onChangeCustomMessage,
  notes,
  onChangeNotes
}) => {
  const activeExtras = extrasComponents
    .filter(e => ['medal', 'letter', 'packaging'].includes(e.component_type) && e.is_active !== false)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  return (
    <div className="space-y-6 text-left">
      <div>
        <span className="text-[10px] text-gold-dark font-black uppercase tracking-[0.2em] block mb-1">
          Etapa 6 de 7
        </span>
        <h3 className="font-serif font-bold text-2xl text-navy">
          Adicione Toques Especiais & Extras
        </h3>
        <p className="text-xs text-navy/60 leading-relaxed mt-1">
          Personalize com nomes, medalhas de proteção adicionais e embalagem especial para presente. Todos os itens são opcionais.
        </p>
      </div>

      {/* Extras Selection Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        {activeExtras.map((item) => {
          const isSelected = selectedExtras.some(e => e.id === item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggleExtra(item)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 cursor-pointer ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-gold/15 bg-white hover:border-gold/40 hover:bg-gold/5'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    isSelected ? 'bg-primary border-primary text-white' : 'border-gold/30 bg-white'
                  }`}
                >
                  {isSelected && <Check size={14} strokeWidth={3} />}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm text-navy truncate">
                      {item.name}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-xs text-navy/60 line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-xs font-black text-gold-dark bg-gold/10 px-2.5 py-1 rounded-full border border-gold/20">
                  + {item.additional_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </button>
          );
        })}
      </motion.div>

      {/* Name Input Field if Letter/Name is selected or optional */}
      <div className="bg-cream/60 border border-gold/20 rounded-2xl p-5 space-y-4">
        <div>
          <label className="label-base flex items-center gap-1.5" htmlFor="customName">
            <Sparkles size={14} className="text-gold-dark" />
            <span>Nome ou Iniciais para Gravação / Letras (Opcional)</span>
          </label>
          <input
            id="customName"
            type="text"
            value={customName}
            onChange={(e) => onChangeCustomName(e.target.value)}
            placeholder="Ex: Maria Clara, J & M, 12/10/2026..."
            className="input-base"
          />
          <p className="text-[11px] text-navy/50 mt-1">
            As letras serão posicionadas com delicadeza ao longo da primeira dezena ou na ponta da criação.
          </p>
        </div>

        <div>
          <label className="label-base flex items-center gap-1.5" htmlFor="customMessage">
            <Gift size={14} className="text-gold-dark" />
            <span>Dedicatória para Cartão de Presente (Opcional)</span>
          </label>
          <textarea
            id="customMessage"
            rows={2}
            value={customMessage}
            onChange={(e) => onChangeCustomMessage(e.target.value)}
            placeholder="Escreva uma bênção ou mensagem carinhosa para acompanhar o terço..."
            className="input-base resize-none"
          />
        </div>

        <div>
          <label className="label-base flex items-center gap-1.5" htmlFor="notes">
            <Heart size={14} className="text-gold-dark" />
            <span>Observações Especiais para o Ateliê</span>
          </label>
          <textarea
            id="notes"
            rows={2}
            value={notes}
            onChange={(e) => onChangeNotes(e.target.value)}
            placeholder="Algum detalhe adicional sobre o comprimento, cor do cordão ou data comemorativa..."
            className="input-base resize-none"
          />
        </div>
      </div>
    </div>
  );
};
