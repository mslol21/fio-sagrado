import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface FixedFooterProps {
  onClick: () => void;
}

export const FixedFooter: React.FC<FixedFooterProps> = ({ onClick }) => {
  const { totalItems, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-4 right-4 z-40 md:hidden"
        >
          <button
            onClick={onClick}
            className="w-full gold-bg-gradient text-white p-4 sm:p-5 rounded-full flex items-center justify-between shadow-2xl active:scale-95 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/15 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white shadow-inner group-hover:scale-110 transition-transform">
                <ShoppingBag size={22} strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase font-black text-white/70 tracking-widest leading-none mb-1">Ver Carrinho</p>
                <p className="font-black text-base sm:text-lg leading-none">{totalItems} {totalItems === 1 ? 'item' : 'itens'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-lg sm:text-xl font-black tabular-nums">
                {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
              <div className="bg-white/15 p-2 rounded-full group-hover:translate-x-1 transition-transform">
                <ArrowRight size={18} strokeWidth={3} />
              </div>
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
