import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, CheckCircle2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { siteConfig } from '../config/site';
import { 
  BaptismVectorIcon, 
  CommunionVectorIcon, 
  CrismaVectorIcon, 
  WeddingVectorIcon, 
  RetiroVectorIcon 
} from '../components/icons/ProductIcons';

const MOMENTS = [
  {
    id: 'batismo',
    label: 'Batismo',
    iconComponent: <BaptismVectorIcon size={26} className="text-[#9A7655]" />,
    description: 'Terços delicados em crochê e lembrancinhas especiais para celebrar o sacramento do Batismo.',
    suggestions: ['Terço infantil em crochê', 'Dezena para berço', 'Lembrancinhas com cartão'],
  },
  {
    id: 'primeira_comunhao',
    label: 'Primeira Eucaristia',
    iconComponent: <CommunionVectorIcon size={26} className="text-[#9A7655]" />,
    description: 'Peças em crochê branco e champagne para marcar o primeiro sacramento eucarístico.',
    suggestions: ['Terço branco em crochê', 'Dezena personalizada com nome', 'Kit oração'],
  },
  {
    id: 'crisma',
    label: 'Crisma & Confirmação',
    iconComponent: <CrismaVectorIcon size={26} className="text-[#9A7655]" />,
    description: 'Terços especiais e medalhas do Espírito Santo para os jovens que confirmam sua fé.',
    suggestions: ['Terço personalizado com nome', 'Dezena de bolso', 'Medalha do Espírito Santo'],
  },
  {
    id: 'casamento',
    label: 'Casamento & Noivas',
    iconComponent: <WeddingVectorIcon size={26} className="text-[#9A7655]" />,
    description: 'Terços nobres em fio acetinado, pérolas e cristais para o altar e bênção matrimonial.',
    suggestions: ['Terço de noiva em crochê', 'Kits lembrança padrinhos', 'Dezenas personalizadas'],
  },
  {
    id: 'retiro',
    label: 'Encontros & Retiros',
    iconComponent: <RetiroVectorIcon size={26} className="text-[#9A7655]" />,
    description: 'Lembranças artesanais em quantidade para grupos em retiros e encontros de fé.',
    suggestions: ['Dezenas em crochê em quantidade', 'Chaveiros de fé', 'Kits com oração'],
  },
];

const MomentsFaith: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { settings, addQuote } = useData();
  const brandName = settings.name || siteConfig.name;
  const whatsappNum = settings.whatsapp || siteConfig.whatsapp;

  const initialMoment = MOMENTS.find(m =>
    searchParams.get('evento')?.toLowerCase().includes(m.label.toLowerCase())
  );
  const [selectedMoment, setSelectedMoment] = useState(initialMoment || null);
  const [formSent, setFormSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    whatsapp: '',
    email: '',
    event_type: initialMoment?.id || '',
    product: '',
    quantity: '',
    event_date: '',
    customization: '',
    notes: '',
  });

  const updateForm = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleMomentSelect = (moment: typeof MOMENTS[0]) => {
    setSelectedMoment(moment);
    updateForm('event_type', moment.id);
  };

  const buildWhatsAppMessage = () => {
    const parts = [
      `✨ *ORÇAMENTO — ${brandName.toUpperCase()}* ✨`,
      ``,
      `📅 *Ocasião/Evento:* ${selectedMoment?.label || form.event_type}`,
      `👤 *Nome:* ${form.name}`,
      `📱 *WhatsApp:* ${form.whatsapp}`,
      form.email ? `📧 *E-mail:* ${form.email}` : '',
      `📦 *Peça / Terço desejado:* ${form.product}`,
      form.quantity ? `🔢 *Quantidade aproximada:* ${form.quantity}` : '',
      form.event_date ? `📅 *Data do evento:* ${form.event_date}` : '',
      form.customization ? `✏️ *Personalização (cor do fio, nome, medalha):* ${form.customization}` : '',
      form.notes ? `📝 *Observações:* ${form.notes}` : '',
      ``,
      `🙏 Gostaria de receber informações sobre disponibilidade e orçamento.`,
    ].filter(Boolean);
    return parts.join('\n');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addQuote({
        name: form.name,
        whatsapp: form.whatsapp,
        email: form.email || undefined,
        event_type: form.event_type,
        product: form.product,
        quantity: form.quantity ? parseInt(form.quantity) : undefined,
        event_date: form.event_date || undefined,
        customization: form.customization || undefined,
        notes: form.notes || undefined,
      });
      setFormSent(true);
    } catch (err) {
      console.error('Erro ao salvar orçamento:', err);
      setFormSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const message = buildWhatsAppMessage();
    const url = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="pt-[4.75rem] md:pt-[5.25rem] min-h-screen bg-[#FCFAF7]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#F5EEE5] via-[#FCFAF7] to-[#F5EEE5]/60 border-b border-[#C7A57F]/15 py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[11px] text-[#9A7655] uppercase tracking-[0.3em] font-bold mb-3">Celebrações de Fé</p>
          <h1 className="font-serif font-bold text-4xl sm:text-5xl text-[#4D4038] mb-3">Ocasiões Especiais</h1>
          <p className="text-[#786A61] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            A {brandName} cria terços e lembranças artesanais em crochê para os momentos mais significativos da sua vida de fé, com pedidos personalizados e sob medida.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Momento cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {MOMENTS.map((moment, idx) => (
            <motion.button
              key={moment.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.06 }}
              onClick={() => handleMomentSelect(moment)}
              className={`flex flex-col items-center gap-3 p-5 rounded-3xl border transition-all text-center cursor-pointer ${
                selectedMoment?.id === moment.id
                  ? 'border-[#9A7655] bg-[#9A7655] text-white shadow-md scale-102'
                  : 'border-[#C7A57F]/20 bg-white text-[#4D4038] hover:border-[#CA9F53]/60 hover:bg-[#F5EEE5]/50 shadow-soft'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                selectedMoment?.id === moment.id ? 'bg-white/20 text-white' : 'bg-[#F5EEE5]'
              }`}>
                {moment.iconComponent}
              </div>
              <div>
                <span className="font-serif font-bold text-sm block leading-tight">{moment.label}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Selected moment details */}
        {selectedMoment && (
          <div className="bg-[#F5EEE5] border border-[#C7A57F]/25 rounded-3xl p-6 mb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#4D4038] mb-1">
                  {selectedMoment.label}
                </h3>
                <p className="text-xs sm:text-sm text-[#786A61] max-w-xl">
                  {selectedMoment.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedMoment.suggestions.map(s => (
                  <span key={s} className="text-xs bg-white text-[#4D4038] px-3 py-1.5 rounded-full border border-[#C7A57F]/20 font-medium">
                    ✦ {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Form section */}
        <div className="bg-white border border-[#C7A57F]/20 rounded-3xl p-6 sm:p-10 shadow-soft max-w-2xl mx-auto">
          {formSent ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-[#F5EEE5] text-[#9A7655] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="font-serif font-bold text-2xl text-[#4D4038]">Orçamento Enviado com Sucesso!</h3>
              <p className="text-[#786A61] text-sm max-w-md mx-auto">
                Recebemos sua solicitação. Para um atendimento ainda mais rápido, você pode enviar a mensagem diretamente pelo WhatsApp:
              </p>
              <div className="pt-2">
                <button
                  onClick={handleWhatsApp}
                  className="btn-whatsapp inline-flex items-center gap-2"
                >
                  <MessageCircle size={18} />
                  <span>Conversar no WhatsApp</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="text-center mb-6">
                <h3 className="font-serif font-bold text-2xl text-[#4D4038] mb-1">Solicitar Orçamento Personalizado</h3>
                <p className="text-xs text-[#786A61]">Preencha os dados abaixo e entraremos em contato com todos os detalhes.</p>
              </div>

              <div>
                <label className="label-base" htmlFor="mf-name">Seu Nome *</label>
                <input
                  id="mf-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={e => updateForm('name', e.target.value)}
                  placeholder="Como podemos te chamar?"
                  className="input-base"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-base" htmlFor="mf-whatsapp">WhatsApp com DDD *</label>
                  <input
                    id="mf-whatsapp"
                    type="tel"
                    required
                    value={form.whatsapp}
                    onChange={e => updateForm('whatsapp', e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="label-base" htmlFor="mf-email">E-mail (opcional)</label>
                  <input
                    id="mf-email"
                    type="email"
                    value={form.email}
                    onChange={e => updateForm('email', e.target.value)}
                    placeholder="seu@email.com"
                    className="input-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-base" htmlFor="mf-product">Peça Desejada *</label>
                  <input
                    id="mf-product"
                    type="text"
                    required
                    value={form.product}
                    onChange={e => updateForm('product', e.target.value)}
                    placeholder="Ex: Terço de Noiva, 30 Dezenas em Crochê..."
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="label-base" htmlFor="mf-quantity">Quantidade</label>
                  <input
                    id="mf-quantity"
                    type="number"
                    min="1"
                    value={form.quantity}
                    onChange={e => updateForm('quantity', e.target.value)}
                    placeholder="1, 10, 50..."
                    className="input-base"
                  />
                </div>
              </div>

              <div>
                <label className="label-base" htmlFor="mf-customization">Personalização (cores do fio, nome, medalha)</label>
                <textarea
                  id="mf-customization"
                  rows={2}
                  value={form.customization}
                  onChange={e => updateForm('customization', e.target.value)}
                  placeholder="Ex: Fio champagne com pérolas brancas, medalha de N. Sra. Aparecida e nome gravado..."
                  className="input-base"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-4 text-xs font-bold uppercase tracking-widest justify-center shadow-md cursor-pointer"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Solicitação de Orçamento'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default MomentsFaith;
