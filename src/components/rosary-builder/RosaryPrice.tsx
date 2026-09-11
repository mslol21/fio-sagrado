import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface RosaryPriceProps {
  basePrice: number;
  additionalPrice: number;
  totalPrice: number;
  compact?: boolean;
}

export const RosaryPrice: React.FC<RosaryPriceProps> = ({
  basePrice,
  additionalPrice,
  totalPrice,
  compact = false
}) => {
  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex flex-col text-right">
          <span className="text-[9px] text-navy/40 font-bold uppercase tracking-widest">Valor do Terço</span>
          <span className="text-xl font-serif font-bold text-navy">
            {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gold/20 rounded-2xl p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between text-xs text-navy/60 pb-2 border-b border-gold/10">
        <span>Modelo Base</span>
        <span className="font-bold text-navy">
          {basePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
      </div>

      {additionalPrice > 0 && (
        <div className="flex items-center justify-between text-xs text-navy/60 pb-2 border-b border-gold/10">
          <span className="flex items-center gap-1 text-gold-dark font-medium">
            <Sparkles size={12} />
            Personalizações e Adicionais
          </span>
          <span className="font-bold text-gold-dark">
            + {additionalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>
      )}

      <div className="flex items-baseline justify-between pt-1">
        <div>
          <span className="text-[10px] text-navy/40 font-black uppercase tracking-[0.2em] block">
            Total da sua Criação
          </span>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium mt-0.5">
            <ShieldCheck size={12} />
            <span>Feito artesanalmente à mão</span>
          </div>
        </div>

        <motion.span
          key={totalPrice}
          initial={{ scale: 1.1, color: '#D4AF37' }}
          animate={{ scale: 1, color: '#0A1128' }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-serif font-bold text-navy"
        >
          {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </motion.span>
      </div>
    </div>
  );
};
