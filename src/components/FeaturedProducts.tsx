import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { useData } from '../context/DataContext';
import { ProductCard } from './ProductCard';

export const FeaturedProducts: React.FC = () => {
  const { products } = useData();

  const featured = products
    .filter(p => p.isFeatured && p.isActive !== false)
    .slice(0, 8);

  if (featured.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-white/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Star size={14} className="text-gold fill-gold" />
              <p className="text-[11px] text-gold-dark uppercase tracking-[0.3em] font-bold">Destaque</p>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy">Mais amados</h2>
          </div>
          <Link
            to="/loja"
            className="inline-flex items-center gap-2 text-sm font-bold text-navy/60 hover:text-navy transition-colors uppercase tracking-wider group"
          >
            Ver todos
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {featured.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.07 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
