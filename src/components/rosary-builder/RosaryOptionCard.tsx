import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface RosaryOptionCardProps {
  id: string;
  name: string;
  description?: string;
  image?: string;
  color?: string;
  material?: string;
  size?: string;
  badge?: string;
  icon?: React.ReactNode;
  additionalPrice?: number;
  basePrice?: number;
  isSelected: boolean;
  isDisabled?: boolean;
  disabledReason?: string;
  onClick: () => void;
}

export const RosaryOptionCard: React.FC<RosaryOptionCardProps> = ({
  name,
  description,
  image,
  color,
  material,
  size,
  badge,
  icon,
  additionalPrice,
  basePrice,
  isSelected,
  isDisabled,
  disabledReason,
  onClick
}) => {
  return (
    <motion.button
      type="button"
      whileHover={isDisabled ? {} : { y: -2 }}
      whileTap={isDisabled ? {} : { scale: 0.98 }}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      className={`relative w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4 group cursor-pointer ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/15'
          : isDisabled
          ? 'border-gray-200 bg-gray-50/70 opacity-60 cursor-not-allowed'
          : 'border-gold/15 bg-white hover:border-gold/50 hover:bg-gold/5'
      }`}
    >
      {/* Visual Indicator (Color Swatch / Image / Icon) */}
      <div className="relative flex-shrink-0">
        {image ? (
          <div className="w-14 h-14 rounded-xl border border-gold/20 flex items-center justify-center overflow-hidden bg-cream">
            <img src={image} alt={name} className="w-full h-full object-cover" />
          </div>
        ) : color ? (
          <div
            className="w-14 h-14 rounded-xl border-2 border-white shadow-inner flex items-center justify-center"
            style={{
              backgroundColor: color,
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.1)'
            }}
          >
            {color.toLowerCase() === '#ffffff' && (
              <div className="w-full h-full border border-gold/20 rounded-xl" />
            )}
          </div>
        ) : icon ? (
          <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center text-gold-dark shadow-xs">
            {icon}
          </div>
        ) : (
          <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center text-gold-dark font-serif font-bold text-lg">
            ✦
          </div>
        )}

        {/* Selected Checkmark overlay on icon */}
        {isSelected && (
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
            <Check size={12} strokeWidth={3} />
          </div>
        )}
      </div>

      {/* Info & Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <h4 className={`font-serif font-bold text-sm truncate ${isSelected ? 'text-navy' : 'text-navy/90'}`}>
            {name}
          </h4>
          {badge && (
            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              isSelected 
                ? 'bg-gold text-navy border-gold-dark' 
                : 'bg-gold/10 text-gold-dark border-gold/25'
            }`}>
              {badge}
            </span>
          )}
        </div>

        {(material || size) && (
          <p className="text-[11px] text-navy/55 font-medium mb-1">
            {[material, size].filter(Boolean).join(' • ')}
          </p>
        )}

        {description && (
          <p className="text-xs text-navy/60 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {disabledReason && (
          <p className="text-[10px] text-amber-700 font-medium mt-1">
            {disabledReason}
          </p>
        )}
      </div>

      {/* Price tag */}
      <div className="text-right flex-shrink-0">
        {basePrice !== undefined ? (
          <span className="font-serif font-bold text-sm text-navy block">
            {basePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        ) : additionalPrice !== undefined ? (
          additionalPrice > 0 ? (
            <span className="text-xs font-black text-gold-dark bg-gold/10 px-2.5 py-1 rounded-full border border-gold/20">
              + {additionalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Incluso
            </span>
          )
        ) : null}
      </div>
    </motion.button>
  );
};
