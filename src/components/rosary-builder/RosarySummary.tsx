import React from 'react';
import type { RosaryConfiguration } from '../../types';
import { ShoppingBag, Edit3, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface RosarySummaryProps {
  configuration: RosaryConfiguration;
  basePrice: number;
  additionalPrice: number;
  totalPrice: number;
  publicCode: string;
  isAddingToCart: boolean;
  onAddToCart: () => void;
  onEditStep: (stepId: number) => void;
}

export const RosarySummary: React.FC<RosarySummaryProps> = ({
  configuration,
  basePrice,
  additionalPrice,
  totalPrice,
  publicCode,
  isAddingToCart,
  onAddToCart,
  onEditStep
}) => {
  const { model, bead, ourFather, centerpiece, crucifix, builderMode } = configuration;
  const isPulseira = builderMode === 'pulseira' || model?.product_type === 'bracelet' || model?.slug.includes('pulseira');

  return (
    <div className="space-y-6 text-left">
      <div>
        <span className="text-[10px] text-gold-dark font-black uppercase tracking-[0.2em] block mb-1">
          Etapa 5 de 5
        </span>
        <h3 className="font-serif font-bold text-3xl text-navy">
          {isPulseira ? 'Sua pulseira de terço ficou assim ✨' : 'Seu terço ficou assim ✨'}
        </h3>
        <p className="text-xs text-navy/60 leading-relaxed mt-1">
          {isPulseira
            ? 'Revise todos os detalhes da sua pulseira de terço artesanal com fecho regulável antes de enviar para confecção.'
            : 'Revise todos os detalhes da sua criação artesanal exclusiva antes de enviar para confecção.'}
        </p>
      </div>

      {/* Creation Code Pill */}
      <div className="bg-gradient-to-r from-navy via-navy-light to-navy text-gold p-4 rounded-2xl border border-gold/30 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center text-gold">
            <Sparkles size={20} />
          </div>
          <div>
            <span className="text-[9px] text-gold/60 uppercase font-black tracking-widest block">Código da Criação</span>
            <span className="font-mono text-lg font-bold text-white tracking-wider">{publicCode}</span>
          </div>
        </div>
        <span className="text-[10px] bg-gold/20 text-gold-light border border-gold/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
          Peça Única
        </span>
      </div>

      {/* Itemized Selection Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gold/20 rounded-3xl p-6 shadow-sm divide-y divide-gold/10 space-y-4"
      >
        {/* Model */}
        <div className="flex items-center justify-between pt-1 first:pt-0">
          <div>
            <span className="text-[10px] text-navy/40 font-bold uppercase tracking-widest block">Modelo</span>
            <span className="font-serif font-bold text-navy text-base">{model?.name || 'Tradicional'}</span>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(1)}
            className="text-xs font-bold text-gold-dark hover:text-navy flex items-center gap-1 p-2"
          >
            <Edit3 size={13} /> Alterar
          </button>
        </div>

        {/* Beads */}
        <div className="flex items-center justify-between pt-3">
          <div>
            <span className="text-[10px] text-navy/40 font-bold uppercase tracking-widest block">
              {isPulseira ? 'Contas da Dezena (10x)' : 'Contas das Ave-Marias (53x)'}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              {bead?.color && (
                <span className="w-3.5 h-3.5 rounded-full border border-gold/30 shadow-xs" style={{ backgroundColor: bead.color }} />
              )}
              <span className="font-medium text-navy text-sm">{bead?.name || 'Pérola Clássica'}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(2)}
            className="text-xs font-bold text-gold-dark hover:text-navy flex items-center gap-1 p-2"
          >
            <Edit3 size={13} /> Alterar
          </button>
        </div>

        {/* Our Father / Highlight */}
        <div className="flex items-center justify-between pt-3">
          <div>
            <span className="text-[10px] text-navy/40 font-bold uppercase tracking-widest block">
              {isPulseira ? 'Conta de Destaque / Pai-Nosso' : 'Contas dos Pai-Nossos (6x)'}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              {ourFather?.color && (
                <span className="w-3.5 h-3.5 rounded-full border border-gold/30 shadow-xs" style={{ backgroundColor: ourFather.color }} />
              )}
              <span className="font-medium text-navy text-sm">{ourFather?.name || bead?.name || 'Padrão'}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(3)}
            className="text-xs font-bold text-gold-dark hover:text-navy flex items-center gap-1 p-2"
          >
            <Edit3 size={13} /> Alterar
          </button>
        </div>

        {/* Centerpiece */}
        <div className="flex items-center justify-between pt-3">
          <div>
            <span className="text-[10px] text-navy/40 font-bold uppercase tracking-widest block">Medalha Central (Entremeio)</span>
            <span className="font-medium text-navy text-sm">{centerpiece?.name || 'N. Sra. Aparecida'}</span>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(4)}
            className="text-xs font-bold text-gold-dark hover:text-navy flex items-center gap-1 p-2"
          >
            <Edit3 size={13} /> Alterar
          </button>
        </div>

        {/* Crucifix */}
        <div className="flex items-center justify-between pt-3">
          <div>
            <span className="text-[10px] text-navy/40 font-bold uppercase tracking-widest block">
              {isPulseira ? 'Pingente Cruz / Mini Crucifixo' : 'Cruz / Crucifixo'}
            </span>
            <span className="font-medium text-navy text-sm">{crucifix?.name || (isPulseira ? 'Mini Cruz Inclusa' : 'Crucifixo Tradicional')}</span>
          </div>
          <span className="text-[10px] font-bold text-navy/50 bg-navy/5 px-2.5 py-1 rounded-full border border-gold/15">
            Padrão Incluso
          </span>
        </div>


        {/* Price Breakdown in Summary */}
        <div className="pt-4 space-y-2 border-t border-gold/15">
          <div className="flex justify-between text-xs text-navy/60">
            <span>Valor base ({model?.name || (isPulseira ? 'Pulseira Regulável' : 'Tradicional')})</span>
            <span className="font-medium">{basePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </div>
          {additionalPrice > 0 && (
            <div className="flex justify-between text-xs text-gold-dark font-medium">
              <span>Personalizações & Adicionais</span>
              <span>+ {additionalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
          )}
          <div className="flex justify-between items-baseline pt-2 border-t border-gold/10">
            <span className="font-bold text-navy text-sm uppercase tracking-wider">Total</span>
            <span className="font-serif font-bold text-navy text-2xl">
              {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Production Guarantee Pill */}
      <div className="flex items-center gap-3 p-4 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl text-emerald-900 text-xs">
        <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
        <div>
          <p className="font-bold">Garantia Artesanal Fio Sagrado</p>
          <p className="text-[11px] text-emerald-800/80">
            {isPulseira
              ? 'Sua pulseira de terço em crochê será produzida com fecho regulável adaptável a qualquer pulso, prazo de 5 a 7 dias úteis e embalada para presente.'
              : 'Sua peça será produzida sob encomenda ponto a ponto em crochê com prazo de 5 a 7 dias úteis e embalada para presente.'}
          </p>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onAddToCart}
          disabled={isAddingToCart}
          className="btn-primary w-full py-4 text-sm justify-center shadow-xl shadow-navy/15 hover:shadow-2xl transition-all cursor-pointer"
        >
          <ShoppingBag size={18} />
          {isAddingToCart 
            ? 'Guardando no carrinho...' 
            : isPulseira 
            ? 'Adicionar minha pulseira ao carrinho' 
            : 'Adicionar meu terço ao carrinho'}
        </button>
      </div>
    </div>
  );
};
