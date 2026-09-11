import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { siteConfig } from '../config/site';

const categories = [
  {
    id: 'tercos-artesanais',
    title: 'Terços em Crochê',
    description: 'Modelos clássicos e delicados com 5 dezenas completas para acompanhar seus momentos de oração.',
    image: 'https://images.unsplash.com/photo-1544161515-4af6b1d4b1c2?q=80&w=800',
    to: '/loja?categoria=tercos-artesanais',
    cta: 'Explorar Terços',
    accent: 'from-[#4D4038]/80 via-[#4D4038]/40 to-transparent',
  },
  {
    id: 'monte-seu-terco',
    title: 'Monte seu Terço (2D)',
    description: 'Escolha a cor do fio de crochê, contas e medalhas marianas com visualização em tempo real.',
    image: 'https://images.unsplash.com/photo-1544161515-4af6b1d4b1c2?q=80&w=800',
    to: '/monte-seu-terco',
    cta: 'Criar no Simulador',
    accent: 'from-[#9A7655]/85 via-[#9A7655]/40 to-transparent',
  },
  {
    id: 'monte-sua-pulseira',
    title: 'Pulseiras de Terço (2D)',
    description: 'Dezenas de pulso reguláveis em macramê com medalhas marianas e mini cruz delicada.',
    image: 'https://images.unsplash.com/photo-1544161515-4af6b1d4b1c2?q=80&w=800',
    to: '/monte-sua-pulseira',
    cta: 'Montar Pulseira',
    accent: 'from-[#4D4038]/80 via-[#4D4038]/40 to-transparent',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export const CategoryCards: React.FC = () => {
  const { settings } = useData();
  const brandName = settings.name || siteConfig.name;

  return (
    <section className="py-16 md:py-20 px-4 bg-[#FCFAF7]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[11px] text-[#9A7655] uppercase tracking-[0.3em] font-bold mb-2">Linhas do Ateliê</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#4D4038]">Descubra a {brandName}</h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {categories.map((cat) => (
            <motion.div key={cat.id} variants={itemVariants}>
              <Link
                to={cat.to}
                className="group block relative rounded-3xl overflow-hidden aspect-[3/4] sm:aspect-auto sm:h-[400px] border border-[#C7A57F]/20 shadow-soft hover:shadow-warm transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.accent}`} />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="font-serif font-bold text-2xl mb-2 leading-tight text-white">{cat.title}</h3>
                  <p className="text-[#F5EEE5]/90 text-xs leading-relaxed mb-4 font-normal">{cat.description}</p>
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white group-hover:gap-3 transition-all">
                    <span>{cat.cta}</span>
                    <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
