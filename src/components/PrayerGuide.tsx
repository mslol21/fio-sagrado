import React, { useState } from 'react';
import { Compass, BookOpen, Sparkles, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Step {
  number: number;
  title: string;
  desc: string;
}

interface Prayer {
  id: string;
  title: string;
  text: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Sinal da Cruz e Oferecimento",
    desc: "Inicie segurando a cruz do terço. Faça o sinal da cruz e reze a oração de oferecimento, consagrando o seu dia e suas intenções."
  },
  {
    number: 2,
    title: "Credo (Creio)",
    desc: "Ainda segurando a cruz, professe sua fé rezando o Credo, declarando sua crença em Deus, no Filho, no Espírito Santo e na Igreja."
  },
  {
    number: 3,
    title: "Pai Nosso e 3 Ave-Marias",
    desc: "Na primeira conta isolada, reze um Pai Nosso. Nas próximas três contas pequenas, reze três Ave-Marias (pedindo aumento da Fé, Esperança e Caridade), seguidas de um Glória."
  },
  {
    number: 4,
    title: "Dezenas e Mistérios",
    desc: "Para cada uma das 5 dezenas: anuncie o mistério do dia, reze um Pai Nosso na conta grande isolada, dez Ave-Marias nas dez contas menores, e conclua com o Glória e a Jaculatória de Fátima."
  },
  {
    number: 5,
    title: "Salve Rainha (Encerramento)",
    desc: "Ao final das cinco dezenas, reze a oração da Salve Rainha na medalha/entremeio central, concluindo com agradecimento e devoção."
  }
];

const prayers: Prayer[] = [
  {
    id: "sinal",
    title: "Sinal da Cruz",
    text: "Pelo sinal da Santa Cruz, livrai-nos, Deus, nosso Senhor, dos nossos inimigos. Em nome do Pai, do Filho e do Espírito Santo. Amém."
  },
  {
    id: "credo",
    title: "Credo (Creio)",
    text: "Creio em Deus Pai Todo-Poderoso, Criador do céu e da terra. E em Jesus Cristo, seu único Filho, nosso Senhor, que foi concebido pelo poder do Espírito Santo, nasceu da Virgem Maria, padeceu sob Pôncio Pilatos, foi crucificado, morto e sepultado; desceu à mansão dos mortos; ressuscitou ao terceiro dia; subiu aos céus, está sentado à direita de Deus Pai Todo-Poderoso, donde há de vir a julgar os vivos e os mortos. Creio no Espírito Santo, na Santa Igreja Católica, na comunhão dos santos, na remissão dos pecados, na ressurreição da carne, na vida eterna. Amém."
  },
  {
    id: "painosso",
    title: "Pai Nosso",
    text: "Pai nosso, que estais nos céus, santificado seja o vosso nome; venha a nós o vosso reino, seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém."
  },
  {
    id: "avemaria",
    title: "Ave Maria",
    text: "Ave Maria, cheia de graça, o Senhor é convosco, bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós, pecadores, agora e na hora da nossa morte. Amém."
  },
  {
    id: "gloria",
    title: "Glória ao Pai",
    text: "Glória ao Pai, ao Filho e ao Espírito Santo. Como era no princípio, agora e sempre. Amém."
  },
  {
    id: "fatima",
    title: "Oração de Fátima (Jaculatória)",
    text: "Ó meu Jesus, perdoai-nos, livrai-nos do fogo do inferno, levai as almas todas para o céu e socorrei principalmente as que mais precisarem. Amém."
  },
  {
    id: "salverainha",
    title: "Salve Rainha",
    text: "Salve, Rainha, Mãe de misericórdia, vida, doçura e esperança nossa, salve! A vós bradamos, os degredados filhos de Eva. A vós suspiramos, gemendo e chorando neste vale de lágrimas. Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei, e depois deste desterro mostrai-nos Jesus, bendito fruto do vosso ventre. Ó clemente, ó piedosa, ó doce sempre Virgem Maria. Rogai por nós, Santa Mãe de Deus, para que sejamos dignos das promessas de Cristo. Amém."
  }
];

export const PrayerGuide: React.FC = () => {
  const [activePrayerId, setActivePrayerId] = useState<string>("sinal");

  return (
    <section id="como-rezar" className="py-24 px-4 bg-transparent border-y border-gold/15 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold-dark px-4 py-2 rounded-full font-medium text-xs mb-4 border border-gold/25 uppercase tracking-widest">
            <Compass size={14} />
            <span>Espiritualidade & Fé</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy mb-4">Como Rezar o Terço</h2>
          <p className="text-navy/60 max-w-xl mx-auto">
            Um guia simples e devocional para orientar sua oração diária. Fortaleça sua fé através do santo Rosário.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left: Step by step timeline */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <h3 className="text-2xl font-serif font-bold text-navy mb-6 flex items-center gap-3">
              <Sparkles className="text-gold-dark" size={20} />
              Passo a Passo
            </h3>
            
            <div className="space-y-4">
              {steps.map((step) => (
                <div 
                  key={step.number} 
                  className="flex gap-4 p-5 rounded-3xl bg-white/80 border border-gold/15 shadow-premium backdrop-blur-sm transition-all hover:border-gold/30 hover:shadow-gold"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold/15 border border-gold/35 flex items-center justify-center text-gold-dark font-serif font-bold text-sm">
                    {step.number}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-navy text-lg mb-1">{step.title}</h4>
                    <p className="text-sm text-navy/70 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Interactive Prayer Book */}
          <div className="lg:col-span-5 text-left">
            <h3 className="text-2xl font-serif font-bold text-navy mb-6 flex items-center gap-3">
              <BookOpen className="text-gold-dark" size={20} />
              Guia de Orações
            </h3>

            <div className="bg-white/80 border border-gold/15 rounded-[32px] p-6 shadow-premium backdrop-blur-sm space-y-6">
              
              {/* Prayer Selection list (horizontal/scrollable buttons) */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
                {prayers.map((prayer) => (
                  <button
                    key={prayer.id}
                    onClick={() => setActivePrayerId(prayer.id)}
                    className={`px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all border snap-center cursor-pointer ${
                      activePrayerId === prayer.id
                        ? 'bg-[#9A7655] text-white border-[#9A7655] shadow-xs'
                        : 'bg-white text-[#786A61] border-[#C7A57F]/25 hover:border-[#CA9F53] hover:text-[#4D4038]'
                    }`}
                  >
                    {prayer.title}
                  </button>
                ))}
              </div>

              {/* Display Active Prayer Content with fade animation */}
              <div className="min-h-[220px] bg-cream-light/60 rounded-2xl p-6 border border-gold/10 relative overflow-hidden flex flex-col justify-center">
                <div className="absolute top-2 right-3 text-gold-dark/10 pointer-events-none">
                  <BookOpen size={100} />
                </div>
                <AnimatePresence mode="wait">
                  {prayers.map((prayer) => (
                    prayer.id === activePrayerId && (
                      <motion.div
                        key={prayer.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="relative z-10"
                      >
                        <h4 className="font-serif font-bold text-lg text-gold-dark mb-3">
                          {prayer.title}
                        </h4>
                        <p className="font-serif italic text-navy/80 leading-relaxed text-sm md:text-base whitespace-pre-line">
                          {prayer.text}
                        </p>
                      </motion.div>
                    )
                  ))}
                </AnimatePresence>
              </div>

              {/* Devotional Advice Card */}
              <div className="p-4 bg-gold/5 rounded-2xl border border-gold/15 flex items-start gap-3">
                <HelpCircle className="text-gold-dark flex-shrink-0 mt-0.5" size={16} />
                <p className="text-[11px] text-navy/60 leading-relaxed">
                  <strong>Dica de Oração:</strong> O terço é um caminho contemplativo. Procure rezar devagar, meditando no mistério correspondente ao dia da semana (Gozosos, Luminosos, Dolorosos ou Gloriosos).
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
