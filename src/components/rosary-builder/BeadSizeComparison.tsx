import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ruler, Check, Maximize2, X } from 'lucide-react';

interface BeadSizeComparisonProps {
  selectedSizeFilter?: 'all' | '6mm' | '8mm';
  onSelectSizeFilter?: (size: 'all' | '6mm' | '8mm') => void;
  title?: string;
}

export const BeadSizeComparison: React.FC<BeadSizeComparisonProps> = ({
  selectedSizeFilter = 'all',
  onSelectSizeFilter,
  title = 'Guia Visual de Tamanho: Bolinhas 6mm vs 8mm'
}) => {
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);

  return (
    <div className="bg-white/95 rounded-3xl border border-gold/25 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-gold-dark text-[11px] font-black uppercase tracking-widest mb-1">
            <Ruler size={13} />
            <span>Comparativo de Tamanhos</span>
          </div>
          <h4 className="font-serif font-bold text-navy text-base sm:text-lg">
            {title}
          </h4>
          <p className="text-xs text-navy/60 leading-relaxed mt-0.5">
            Compare a escala real das contas para escolher o toque e a presença ideal para sua oração.
          </p>
        </div>
      </div>

      {/* Comparative Image Card */}
      <div className="relative rounded-2xl overflow-hidden border border-gold/20 shadow-xs group bg-cream-light">
        <img
          src="/bead-size-guide.jpg"
          alt="Comparativo de tamanho de contas 6mm e 8mm com escala milimétrica"
          className="w-full h-44 sm:h-52 object-cover object-center group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          onClick={() => setIsPhotoOpen(true)}
        />
        
        {/* Overlay Badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-black/20 pointer-events-none" />

        {/* Labels directly over the beads in the photo */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="bg-navy/85 backdrop-blur-xs text-white px-3 py-1.5 rounded-xl border border-gold/40 shadow-md flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-xs font-bold font-serif">6 mm</span>
            <span className="text-[10px] text-gold-light uppercase tracking-wider hidden sm:inline">• Delicada</span>
          </div>

          <div className="bg-navy/85 backdrop-blur-xs text-white px-3 py-1.5 rounded-xl border border-gold/40 shadow-md flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-xs font-bold font-serif">8 mm</span>
            <span className="text-[10px] text-gold-light uppercase tracking-wider hidden sm:inline">• Clássica</span>
          </div>
        </div>

        {/* Click to expand button */}
        <button
          type="button"
          onClick={() => setIsPhotoOpen(true)}
          className="absolute top-3 right-3 bg-white/90 hover:bg-white text-navy p-1.5 rounded-full shadow-md transition-all cursor-pointer"
          title="Ampliar foto comparativa"
        >
          <Maximize2 size={14} />
        </button>
      </div>

      {/* Interactive Size Cards & Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* 6mm Card */}
        <div
          onClick={() => onSelectSizeFilter && onSelectSizeFilter(selectedSizeFilter === '6mm' ? 'all' : '6mm')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedSizeFilter === '6mm'
              ? 'bg-primary/10 border-primary shadow-sm ring-1 ring-primary'
              : 'bg-cream/40 hover:bg-white border-gold/20 hover:border-gold/50'
          }`}
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-black text-navy uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-gold/30 border border-gold flex items-center justify-center text-[9px] text-navy font-bold">
                  6
                </span>
                Bolinhas de 6mm
              </span>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                Delicada & Leve
              </span>
            </div>
            <p className="text-[11px] text-navy/70 leading-snug">
              Ideal para quem prefere uma peça sutil, discreta e leve. Cabe confortavelmente na bolsa ou bolso com proporções graciosas.
            </p>
          </div>

          {onSelectSizeFilter && (
            <div className="pt-2 mt-2 border-t border-gold/10 flex items-center justify-between text-[11px] font-bold">
              <span className={selectedSizeFilter === '6mm' ? 'text-primary' : 'text-navy/50'}>
                {selectedSizeFilter === '6mm' ? '✓ Filtrando 6mm' : 'Ver opções 6mm'}
              </span>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                selectedSizeFilter === '6mm' ? 'bg-primary border-primary text-white' : 'border-navy/20'
              }`}>
                {selectedSizeFilter === '6mm' && <Check size={10} strokeWidth={3} />}
              </div>
            </div>
          )}
        </div>

        {/* 8mm Card */}
        <div
          onClick={() => onSelectSizeFilter && onSelectSizeFilter(selectedSizeFilter === '8mm' ? 'all' : '8mm')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedSizeFilter === '8mm'
              ? 'bg-primary/10 border-primary shadow-sm ring-1 ring-primary'
              : 'bg-cream/40 hover:bg-white border-gold/20 hover:border-gold/50'
          }`}
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-black text-navy uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-gold/30 border border-gold flex items-center justify-center text-[9px] text-navy font-bold">
                  8
                </span>
                Bolinhas de 8mm
              </span>
              <span className="text-[10px] font-bold text-gold-dark bg-gold/15 px-2 py-0.5 rounded-full">
                Clássica & Tradicional
              </span>
            </div>
            <p className="text-[11px] text-navy/70 leading-snug">
              Tamanho tradicional mais amado. Excelente firmeza ao tato na contagem das Ave-Marias, com presença marcante e peso oracional nobre.
            </p>
          </div>

          {onSelectSizeFilter && (
            <div className="pt-2 mt-2 border-t border-gold/10 flex items-center justify-between text-[11px] font-bold">
              <span className={selectedSizeFilter === '8mm' ? 'text-primary' : 'text-navy/50'}>
                {selectedSizeFilter === '8mm' ? '✓ Filtrando 8mm' : 'Ver opções 8mm'}
              </span>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                selectedSizeFilter === '8mm' ? 'bg-primary border-primary text-white' : 'border-navy/20'
              }`}>
                {selectedSizeFilter === '8mm' && <Check size={10} strokeWidth={3} />}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Zoom for Full Image Inspection */}
      <AnimatePresence>
        {isPhotoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPhotoOpen(false)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="relative max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-2 border border-gold/40" onClick={e => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setIsPhotoOpen(false)}
                className="absolute top-4 right-4 z-10 bg-navy/80 text-white hover:text-gold p-2 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
              <img
                src="/bead-size-guide.jpg"
                alt="Comparativo ampliado de contas 6mm e 8mm"
                className="w-full rounded-2xl object-contain max-h-[75vh]"
              />
              <div className="p-4 text-center">
                <h5 className="font-serif font-bold text-navy text-lg">
                  Comparação em Escala Real: 6mm vs 8mm
                </h5>
                <p className="text-xs text-navy/60 mt-1">
                  À esquerda: conta de 6mm com escala de 6mm na régua. À direita: conta de 8mm com escala de 8mm.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
