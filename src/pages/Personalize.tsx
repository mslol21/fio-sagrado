import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, ChevronLeft, MessageCircle, Sparkles, ArrowRight } from 'lucide-react';
import { RosaryVectorIcon, BraceletVectorIcon, DezenaVectorIcon, PhoneCharmVectorIcon } from '../components/icons/ProductIcons';
import { useData } from '../context/DataContext';
import { siteConfig } from '../config/site';

const DEVOTIONS = [
  'Nossa Senhora Aparecida',
  'São Bento',
  'São Miguel Arcanjo',
  'São José',
  'Nossa Senhora Auxiliadora',
  'Sagrado Coração de Jesus',
  'Outro',
];

const COLORS = [
  { name: 'Branco', hex: '#FFFFFF' },
  { name: 'Nude', hex: '#E3C8B7' },
  { name: 'Rosa', hex: '#F4A0A0' },
  { name: 'Azul', hex: '#6A8CA6' },
  { name: 'Verde', hex: '#7B8E78' },
  { name: 'Dourado', hex: '#D4AF37' },
  { name: 'Preto', hex: '#1A1A1A' },
  { name: 'Areia', hex: '#E2DBD0' },
  { name: 'Terracota', hex: '#C06C53' },
  { name: 'Roxo', hex: '#8B5CF6' },
];

const steps = ['Devoção', 'Cores', 'Personalização', 'Resumo'];

const Personalize: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { settings } = useData();

  const productParam = searchParams.get('produto');
  const [selectedProduct, setSelectedProduct] = useState<string>(productParam || '');
  const [step, setStep] = useState(0);
  const [selectedDevotion, setSelectedDevotion] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [customization, setCustomization] = useState({
    name: '',
    initial: '',
    date: '',
    message: '',
    notes: '',
  });

  useEffect(() => {
    if (productParam) {
      setSelectedProduct(productParam);
    }
  }, [productParam]);

  const canProceed = [
    !!selectedDevotion,
    selectedColors.length > 0,
    true, // customization is optional
    true,
  ][step];

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const buildWhatsAppMessage = () => {
    const brandTitle = settings.name || siteConfig.name;
    const parts = [
      `✨ *PERSONALIZAÇÃO — ${brandTitle.toUpperCase()}* ✨`,
      ``,
      `📦 *Peça / Terço:* ${selectedProduct}`,
      `🙏 *Devoção:* ${selectedDevotion}`,
      `🎨 *Cores:* ${selectedColors.join(', ')}`,
    ];
    if (customization.name) parts.push(`✏️ *Nome:* ${customization.name}`);
    if (customization.initial) parts.push(`🔤 *Inicial:* ${customization.initial}`);
    if (customization.date) parts.push(`📅 *Data:* ${customization.date}`);
    if (customization.message) parts.push(`💬 *Mensagem:* ${customization.message}`);
    if (customization.notes) parts.push(`📝 *Observações:* ${customization.notes}`);
    parts.push(``, `🙏 Gostaria de combinar detalhes, prazos e valores com o ateliê!`);
    return parts.join('\n');
  };

  const handleFinish = () => {
    const whatsappNum = settings.whatsapp || siteConfig.whatsapp;
    const message = buildWhatsAppMessage();
    const url = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleSelectProductCard = (productName: string) => {
    setSelectedProduct(productName);
    setSearchParams({ produto: productName });
    setStep(0);
    const el = document.getElementById('wizard-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const StepIndicator = () => (
    <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
      {steps.map((s, idx) => (
        <React.Fragment key={s}>
          <button
            type="button"
            onClick={() => idx < step && setStep(idx)}
            className={`flex-shrink-0 flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all ${
              idx === step
                ? 'text-navy'
                : idx < step
                ? 'text-gold-dark cursor-pointer'
                : 'text-navy/30'
            }`}
          >
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all ${
              idx < step
                ? 'bg-gold border-gold text-navy'
                : idx === step
                ? 'bg-navy border-navy text-white'
                : 'bg-transparent border-navy/20 text-navy/30'
            }`}>
              {idx < step ? <Check size={12} strokeWidth={3} /> : idx + 1}
            </span>
            <span className="hidden sm:inline">{s}</span>
          </button>
          {idx < steps.length - 1 && (
            <div className={`flex-1 h-px ${idx < step ? 'bg-gold' : 'bg-navy/10'} min-w-[16px]`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const stepContent = [
    // Step 0: Devoção
    <div key="devotion" className="space-y-4">
      <h2 className="font-serif font-bold text-2xl text-navy mb-1">Escolha a devoção para sua {selectedProduct}</h2>
      <p className="text-navy/55 text-xs mb-6">Selecione o santo de devoção ou intercessão especial.</p>
      <div className="space-y-2">
        {DEVOTIONS.map(d => (
          <button
            key={d}
            type="button"
            onClick={() => setSelectedDevotion(d)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left font-medium transition-all cursor-pointer ${
              selectedDevotion === d
                ? 'border-navy bg-navy text-white shadow-md'
                : 'border-gold/15 bg-white text-navy hover:border-gold/40 hover:bg-gold/5'
            }`}
          >
            <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              selectedDevotion === d ? 'border-white bg-white' : 'border-navy/30'
            }`}>
              {selectedDevotion === d && <Check size={12} strokeWidth={3} className="text-navy" />}
            </span>
            <span className="font-serif font-bold text-sm">{d}</span>
          </button>
        ))}
      </div>
    </div>,

    // Step 1: Cores
    <div key="colors" className="space-y-4">
      <h2 className="font-serif font-bold text-2xl text-navy mb-1">Escolha a paleta de cores</h2>
      <p className="text-navy/55 text-xs mb-6">Selecione uma ou mais cores para a confecção da sua peça.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {COLORS.map(color => (
          <button
            key={color.name}
            type="button"
            onClick={() => toggleColor(color.name)}
            className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedColors.includes(color.name)
                ? 'border-navy bg-navy/5 shadow-sm'
                : 'border-gold/15 bg-white hover:border-gold/40 hover:bg-gold/5'
            }`}
          >
            <span
              className="w-8 h-8 rounded-full border border-navy/10 flex-shrink-0 shadow-inner"
              style={{ backgroundColor: color.hex }}
            />
            <span className="text-xs font-bold text-navy">{color.name}</span>
            {selectedColors.includes(color.name) && (
              <Check size={14} strokeWidth={3} className="ml-auto text-navy" />
            )}
          </button>
        ))}
      </div>
    </div>,

    // Step 2: Personalização
    <div key="personalization" className="space-y-5">
      <h2 className="font-serif font-bold text-2xl text-navy mb-1">Detalhes & Personalização</h2>
      <p className="text-navy/55 text-xs mb-6">Todos os campos são opcionais. Preencha conforme desejar.</p>
      {[
        { label: 'Nome ou Iniciais', field: 'name', placeholder: 'Ex: Maria Clara, J & M...' },
        { label: 'Letra / Inicial de Destaque', field: 'initial', placeholder: 'Ex: M, J...' },
        { label: 'Data Comemorativa', field: 'date', placeholder: 'Ex: 12/10/2026' },
        { label: 'Mensagem para Cartão ou Lembrança', field: 'message', placeholder: 'Uma frase especial ou dedicatória...' },
        { label: 'Observações Adicionais para a Artesã', field: 'notes', placeholder: 'Detalhes sobre tamanho do pulso, cordão...' },
      ].map(f => (
        <div key={f.field}>
          <label className="label-base" htmlFor={f.field}>{f.label}</label>
          {f.field === 'message' || f.field === 'notes' ? (
            <textarea
              id={f.field}
              value={customization[f.field as keyof typeof customization]}
              onChange={e => setCustomization(prev => ({ ...prev, [f.field]: e.target.value }))}
              placeholder={f.placeholder}
              rows={3}
              className="input-base resize-none"
            />
          ) : (
            <input
              id={f.field}
              type="text"
              value={customization[f.field as keyof typeof customization]}
              onChange={e => setCustomization(prev => ({ ...prev, [f.field]: e.target.value }))}
              placeholder={f.placeholder}
              className="input-base"
            />
          )}
        </div>
      ))}
    </div>,

    // Step 3: Resumo
    <div key="summary" className="space-y-5">
      <h2 className="font-serif font-bold text-2xl text-navy mb-2">Resumo da sua Solicitação</h2>
      <div className="bg-cream/60 border border-gold/20 rounded-2xl p-6 space-y-4">
        {[
          { label: 'Produto', value: selectedProduct },
          { label: 'Devoção', value: selectedDevotion },
          { label: 'Cores', value: selectedColors.join(', ') },
          ...(customization.name ? [{ label: 'Nome', value: customization.name }] : []),
          ...(customization.initial ? [{ label: 'Inicial', value: customization.initial }] : []),
          ...(customization.date ? [{ label: 'Data', value: customization.date }] : []),
          ...(customization.message ? [{ label: 'Mensagem', value: customization.message }] : []),
          ...(customization.notes ? [{ label: 'Observações', value: customization.notes }] : []),
        ].map(item => (
          <div key={item.label} className="flex justify-between gap-4 text-sm border-b border-gold/10 pb-3 last:border-0 last:pb-0">
            <span className="text-navy/50 font-medium flex-shrink-0">{item.label}:</span>
            <span className="font-bold text-navy text-right">{item.value}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-navy/55 leading-relaxed">
        Ao clicar em "Enviar pelo WhatsApp", você será redirecionado para o atendimento oficial do Ateliê com todos os detalhes organizados. O prazo e valor serão confirmados no atendimento.
      </p>
    </div>,
  ];

  return (
    <div className="pt-[4.75rem] md:pt-[5.25rem] min-h-screen bg-[#FCFAF7]">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#F5EEE5] via-[#FCFAF7] to-[#F5EEE5]/60 py-14 px-4 relative overflow-hidden border-b border-[#C7A57F]/15">
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="text-[11px] text-[#9A7655] uppercase tracking-[0.3em] font-bold mb-3">
            {settings.name || siteConfig.name}
          </p>
          <h1 className="font-serif font-bold text-4xl sm:text-5xl text-[#4D4038] mb-4">
            Central de Personalização
          </h1>
          <p className="text-[#786A61] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Crie terços e peças exclusivas em crochê com significado. Escolha abaixo a experiência que deseja criar para você ou para presentear.
          </p>
        </div>
      </div>

      {/* Main Hub Showcase */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Featured 2D Builders (Monte seu Terço & Monte sua Pulseira) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Card 1: Monte seu Terço */}
          <div className="bg-gradient-to-br from-white via-amber-50/40 to-cream border-2 border-gold/30 hover:border-gold/60 rounded-3xl p-8 shadow-premium hover:shadow-gold transition-all duration-300 relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 border border-gold/35 text-gold-dark text-[10px] font-black uppercase tracking-wider mb-4">
                <Sparkles size={12} />
                <span>Simulador 2D Interativo</span>
              </div>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-navy mb-3">
                Monte seu Terço
              </h2>
              <p className="text-navy/70 text-xs sm:text-sm leading-relaxed mb-6">
                Personalize o terço completo em crochê: modelo de 5 dezenas ou 1 dezena, contas das Ave-Marias, Pai-Nossos, entremeio sagrado e crucifixo com visualização 2D em tempo real.
              </p>
            </div>

            <div className="pt-4 border-t border-gold/15 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center text-gold-dark border border-gold/25 shadow-xs">
                  <RosaryVectorIcon size={28} className="text-gold-dark" />
                </div>
                <div>
                  <span className="text-[10px] text-navy/40 font-bold uppercase tracking-wider block">A partir de</span>
                  <span className="font-serif font-bold text-navy text-lg">R$ 59,90</span>
                </div>
              </div>
              <Link
                to="/monte-seu-terco"
                className="btn-primary py-3 px-6 text-xs shadow-lg flex items-center gap-2 hover:gap-3 transition-all"
              >
                <span>Montar Terço</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Card 2: Monte sua Pulseira de Terço */}
          <div className="bg-gradient-to-br from-white via-rose-50/20 to-cream border-2 border-gold/30 hover:border-gold/60 rounded-3xl p-8 shadow-premium hover:shadow-gold transition-all duration-300 relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 border border-gold/35 text-gold-dark text-[10px] font-black uppercase tracking-wider mb-4">
                <Sparkles size={12} />
                <span>Simulador 2D • Novo</span>
              </div>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-navy mb-3">
                Monte sua Pulseira de Terço
              </h2>
              <p className="text-navy/70 text-xs sm:text-sm leading-relaxed mb-6">
                Crie sua dezena de pulso em crochê com fecho regulável em macramê, contas nobres de 6mm ou 8mm, medalha do seu santo de devoção e mini cruz delicada.
              </p>
            </div>

            <div className="pt-4 border-t border-gold/15 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center text-gold-dark border border-gold/25 shadow-xs">
                  <BraceletVectorIcon size={28} className="text-gold-dark" />
                </div>
                <div>
                  <span className="text-[10px] text-navy/40 font-bold uppercase tracking-wider block">A partir de</span>
                  <span className="font-serif font-bold text-navy text-lg">R$ 34,90</span>
                </div>
              </div>
              <Link
                to="/monte-sua-pulseira"
                className="btn-primary py-3 px-6 text-xs shadow-lg flex items-center gap-2 hover:gap-3 transition-all"
              >
                <span>Montar Pulseira</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Other Customization Cards (WhatsApp Assisted) */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="font-serif font-bold text-2xl text-navy mb-2">Outras Peças & Pedidos Especiais</h3>
            <p className="text-xs text-navy/60">Selecione uma peça abaixo para iniciar o pedido personalizado pelo WhatsApp.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {[
              { id: 'Dezena', iconComponent: <DezenaVectorIcon size={36} className="text-gold-dark" />, title: 'Personalize sua Dezena', desc: 'Dezenas para retrovisor de carro, bolsa ou oração de bolso.' },
              { id: 'Phone Charm', iconComponent: <PhoneCharmVectorIcon size={36} className="text-gold-dark" />, title: 'Personalize seu Phone Charm', desc: 'Acessório de celular com contas e medalhas de proteção diária.' },
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectProductCard(item.id)}
                className={`p-6 rounded-3xl border-2 text-left flex flex-col justify-between transition-all cursor-pointer group ${
                  selectedProduct === item.id
                    ? 'border-navy bg-navy/5 shadow-md ring-2 ring-navy/10'
                    : 'border-gold/15 bg-white hover:border-gold/40 hover:bg-gold/5 shadow-sm'
                }`}
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-amber-100/40 flex items-center justify-center mb-4 border border-gold/30 shadow-xs group-hover:scale-105 transition-transform">
                    {item.iconComponent}
                  </div>
                  <h4 className="font-serif font-bold text-lg text-navy mb-2">{item.title}</h4>
                  <p className="text-xs text-navy/60 leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-gold/10 flex items-center justify-between text-xs font-bold text-gold-dark">
                  <span>{selectedProduct === item.id ? 'Selecionado' : 'Personalizar'}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Wizard Form Area if a product is chosen */}
        {selectedProduct && selectedProduct !== 'Terço' && (
          <motion.div
            id="wizard-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto bg-white border border-gold/20 rounded-3xl p-8 sm:p-12 shadow-premium"
          >
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gold/15">
              <div>
                <span className="text-[10px] text-gold-dark font-black uppercase tracking-widest block">Personalizando</span>
                <h3 className="font-serif font-bold text-2xl text-navy">{selectedProduct}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct('')}
                className="text-xs text-navy/40 hover:text-navy font-bold uppercase tracking-wider"
              >
                Trocar Peça
              </button>
            </div>

            <StepIndicator />

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {stepContent[step]}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10 pt-8 border-t border-gold/10">
              <button
                type="button"
                onClick={() => setStep(s => Math.max(0, s - 1))}
                disabled={step === 0}
                className="flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider text-navy/50 hover:text-navy disabled:opacity-0 transition-all cursor-pointer"
              >
                <ChevronLeft size={16} /> Voltar
              </button>

              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(s => s + 1)}
                  disabled={!canProceed}
                  className="btn-primary py-3.5 px-8 text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>Continuar</span>
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={!settings.whatsapp}
                  className="btn-whatsapp py-3.5 px-8 text-xs cursor-pointer shadow-lg"
                >
                  <MessageCircle size={16} />
                  <span>Enviar pelo WhatsApp</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Personalize;
