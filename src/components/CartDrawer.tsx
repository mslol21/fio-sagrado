import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Minus, Plus, ShoppingBag, Sparkles } from 'lucide-react';
import { RosaryVectorIcon, PixShieldIcon, WhatsAppVectorIcon } from './icons/ProductIcons';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { siteConfig } from '../config/site';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart, step, setStep } = useCart();
  const { settings, addOrder } = useData();

  const [nome, setNome] = useState('');
  const [cep, setCep] = useState('');
  const [cidadeUf, setCidadeUf] = useState('');
  const pagamento = 'Pix';
  const [loadingCep, setLoadingCep] = useState(false);

  const brandName = settings.name || siteConfig.name;
  const whatsappNum = settings.whatsapp || siteConfig.whatsapp;

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 8);
    setCep(value);
    
    if (value.length === 8) {
      setLoadingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${value}/json/`);
        const data = await res.json();
        if (!data.erro) {
          const endereco = data.logradouro ? `${data.logradouro}, ${data.bairro} — ${data.localidade}/${data.uf}` : `${data.localidade}/${data.uf}`;
          setCidadeUf(endereco);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const handleCheckout = async () => {
    const formattedItems = cart.map(item => {
      let details = '';
      if (item.customization) {
        const s = item.customization.selections || {};
        const parts = [
          `Código: ${item.customization.code}`,
          `Modelo: ${item.customization.model || s.model?.name || 'Tradicional'}`,
          `Contas Ave-Marias: ${s.bead?.name || 'Clássicas'}`,
          `Contas Pai-Nossos: ${s.ourFather?.name || s.bead?.name || 'Padrão'}`,
          `Entremeio: ${s.centerpiece?.name || 'N. Sra. Aparecida'}`,
          `Crucifixo: ${s.crucifix?.name || 'Barroco'}`,
        ];
        if (s.extras && Array.isArray(s.extras) && s.extras.length > 0) {
          parts.push(`Extras: ${s.extras.map((e: any) => e.name).join(', ')}`);
        }
        if (s.customName) {
          parts.push(`Nome Personalizado: ${s.customName}`);
        }
        if (s.customMessage) {
          parts.push(`Cartão: "${s.customMessage}"`);
        }
        if (s.notes) {
          parts.push(`Obs: ${s.notes}`);
        }
        details = `\n   └─ *Configuração em Crochê / Personalização:*\n      • ` + parts.join('\n      • ');
      } else if (item.name.includes('(')) {
        details = item.name.replace(/\s*\(([^)]+)\)/, '\n   └─ Customização: $1');
      }

      const itemSubtotal = (item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const mainName = item.name.split('(')[0].trim();
      return `• *${item.quantity}x ${mainName}*${details}\n  Subtotal: ${itemSubtotal}`;
    }).join('\n\n');

    const totalFormatted = totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const message = `✨ *NOVO PEDIDO — ${brandName.toUpperCase()}* ✨\n` +
      `*${siteConfig.subtitle}*\n\n` +
      `👤 *DADOS DO CLIENTE*\n` +
      `• *Nome:* ${nome.trim()}\n` +
      `• *CEP:* ${cep.trim()}\n` +
      `• *Endereço/Cidade:* ${cidadeUf.trim()}\n` +
      `• *Forma de Pagamento:* ${pagamento} (Chave Pix no Atendimento)\n\n` +
      `📦 *ITENS DO PEDIDO*\n` +
      `${formattedItems}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💰 *VALOR TOTAL: ${totalFormatted}*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `🙏 *Muito obrigado pelo carinho e pela preferência! Que este terço abençoe sua vida e seus momentos de oração.*`;
    
    // Prepare items JSON list for database
    const itemsJson = cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      customization: item.customization || undefined
    }));

    try {
      await addOrder({
        client_name: nome.trim(),
        cep: cep.trim(),
        cidade_uf: cidadeUf.trim(),
        payment_method: pagamento,
        total_price: totalPrice,
        items: itemsJson
      });
    } catch (err) {
      console.error('Erro ao registrar pedido:', err);
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    setTimeout(() => {
      clearCart();
      setStep('cart');
      setNome('');
      setCep('');
      setCidadeUf('');
      onClose();
    }, 1000);
  };

  const handleCloseWrapper = () => {
    setStep('cart');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseWrapper}
            className="fixed inset-0 bg-[#4D4038]/50 backdrop-blur-xs z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#FCFAF7] z-50 shadow-2xl flex flex-col border-l border-[#C7A57F]/25"
          >
            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-[#C7A57F]/20 flex items-center justify-between bg-[#FCFAF7] sticky top-0 z-10">
              <div className="flex items-center gap-3.5">
                <div className="bg-[#F5EEE5] p-2.5 rounded-2xl text-[#9A7655] border border-[#C7A57F]/30 shadow-xs">
                  <ShoppingBag size={22} strokeWidth={2.2} />
                </div>
                <div className="text-left">
                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#4D4038] tracking-wide">
                    {step === 'cart' ? 'Meu Carrinho' : 'Finalizar Pedido'}
                  </h2>
                  <p className="text-[10px] text-[#786A61] uppercase tracking-[0.18em] font-semibold">
                    {step === 'cart' ? `${totalItems} ${totalItems === 1 ? 'item' : 'itens'} no carrinho` : 'Preencha seus dados'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseWrapper}
                className="p-2 hover:bg-[#F5EEE5] rounded-full transition-all text-[#786A61] hover:text-[#4D4038] cursor-pointer"
                aria-label="Fechar"
              >
                <X size={22} />
              </button>
            </div>

            {/* Items Area / Form Area */}
            <div className="flex-grow overflow-y-auto p-5 sm:p-6 space-y-4">
              {step === 'cart' ? (
                cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center px-6 py-12">
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-[#F5EEE5] p-8 rounded-full mb-6 border border-[#C7A57F]/25 shadow-xs relative"
                    >
                      <ShoppingBag size={48} className="text-[#9A7655]/40" strokeWidth={1.5} />
                    </motion.div>
                    <h3 className="text-[#4D4038] font-serif text-2xl mb-2">Carrinho Vazio</h3>
                    <p className="text-[#786A61] text-xs leading-relaxed max-w-xs mb-8">
                      Seu carrinho ainda está vazio. Conheça nossos terços feitos à mão em crochê.
                    </p>
                    <button
                      onClick={handleCloseWrapper}
                      className="btn-primary text-xs"
                    >
                      Explorar Terços
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {cart.map((item) => (
                      <motion.div 
                        key={`${item.id}-${item.name}-${item.customization?.code || ''}`}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col p-4 bg-white rounded-3xl border border-[#C7A57F]/20 shadow-soft"
                      >
                        <div className="flex gap-4 text-left">
                          <div className="w-20 h-20 bg-[#F5EEE5] rounded-2xl overflow-hidden flex-shrink-0 border border-[#C7A57F]/20 flex items-center justify-center">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <RosaryVectorIcon size={28} className="text-[#9A7655]" />
                            )}
                          </div>
                          <div className="flex-grow flex flex-col py-0.5 min-w-0">
                            <div className="flex justify-between items-start gap-2 mb-1">
                              <h4 className="font-bold text-[#4D4038] text-sm line-clamp-1 leading-tight">
                                {item.name.split('(')[0].trim()}
                              </h4>
                              <button
                                onClick={() => removeFromCart(item.id, item.name)}
                                className="text-[#786A61]/60 hover:text-red-500 transition-colors p-1 rounded-full cursor-pointer"
                                aria-label="Remover item"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>

                            {/* Customization Details Rendering */}
                            <div className="flex-grow">
                              {item.customization ? (
                                <div className="bg-[#F5EEE5]/60 p-2 rounded-xl border border-[#C7A57F]/20 mt-1 space-y-1 text-[10px] text-[#786A61]">
                                  <div className="flex items-center gap-1 font-mono font-bold text-[#4D4038] text-[11px]">
                                    <Sparkles size={11} className="text-[#9A7655]" />
                                    <span>{item.customization.code}</span>
                                    <span className="font-sans font-normal text-[#786A61]">• {item.customization.model}</span>
                                  </div>
                                  <p className="line-clamp-2 text-[#786A61]">
                                    {[
                                      item.customization.selections?.bead?.name && `Contas: ${item.customization.selections.bead.name}`,
                                      item.customization.selections?.centerpiece?.name && `Entremeio: ${item.customization.selections.centerpiece.name}`,
                                      item.customization.selections?.crucifix?.name && `Cruz: ${item.customization.selections.crucifix.name}`,
                                      item.customization.selections?.customName && `Nome: ${item.customization.selections.customName}`
                                    ].filter(Boolean).join(' • ')}
                                  </p>
                                </div>
                              ) : item.name.includes('(') ? (
                                <div className="bg-[#F5EEE5]/40 p-2 rounded-xl border border-[#C7A57F]/15 mt-1">
                                  <p className="text-[10px] text-[#786A61] leading-relaxed italic">
                                    {item.name.match(/\(([^)]+)\)/)?.[1]}
                                  </p>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#C7A57F]/15">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[#786A61] uppercase tracking-wider font-semibold">Qtd:</span>
                            <div className="flex items-center gap-3 bg-[#F5EEE5] px-3 py-1 rounded-full border border-[#C7A57F]/20">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1, item.name)}
                                className="text-[#4D4038] hover:text-[#9A7655] transition-all cursor-pointer"
                                aria-label="Diminuir quantidade"
                              >
                                <Minus size={12} strokeWidth={2.5} />
                              </button>
                              <span className="text-xs font-bold w-4 text-center text-[#4D4038] tabular-nums">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1, item.name)}
                                className="text-[#4D4038] hover:text-[#9A7655] transition-all cursor-pointer"
                                aria-label="Aumentar quantidade"
                              >
                                <Plus size={12} strokeWidth={2.5} />
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-[#4D4038] text-base tabular-nums">
                              {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )
              ) : (
                <div className="space-y-4 p-1 text-left">
                  <div>
                    <label className="label-base" htmlFor="nome">Seu Nome *</label>
                    <input
                      id="nome"
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Como gostaria de ser chamado?"
                      className="input-base"
                    />
                  </div>

                  <div>
                    <label className="label-base flex items-center justify-between" htmlFor="cep">
                      <span>CEP para Entrega *</span>
                      {loadingCep && <span className="text-xs text-[#9A7655] font-medium animate-pulse">Buscando endereço...</span>}
                    </label>
                    <input
                      id="cep"
                      type="text"
                      value={cep}
                      onChange={handleCepChange}
                      placeholder="00000-000"
                      maxLength={8}
                      className="input-base"
                    />
                  </div>

                  <div>
                    <label className="label-base" htmlFor="cidadeUf">Endereço Completo & Cidade/UF *</label>
                    <input
                      id="cidadeUf"
                      type="text"
                      value={cidadeUf}
                      onChange={(e) => setCidadeUf(e.target.value)}
                      placeholder="Rua, Número, Bairro — Cidade/UF"
                      className="input-base"
                    />
                  </div>

                  <div className="p-4 bg-[#F5EEE5] rounded-2xl border border-[#C7A57F]/25 text-xs text-[#4D4038] flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white text-[#00B495] flex items-center justify-center flex-shrink-0 shadow-xs border border-[#C7A57F]/15">
                      <PixShieldIcon size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-[#4D4038] mb-0.5">Pagamento Seguro via Pix</p>
                      <p className="text-[#786A61] leading-relaxed">Você confirmará os detalhes do pedido e receberá a chave Pix com total segurança diretamente no WhatsApp do Ateliê.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            {cart.length > 0 && (
              <div className="p-5 sm:p-6 bg-white border-t border-[#C7A57F]/20 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#786A61] uppercase tracking-wider">Total do Pedido</span>
                  <span className="text-2xl font-serif font-bold text-[#4D4038]">
                    {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>

                {step === 'cart' ? (
                  <button
                    onClick={() => setStep('checkout')}
                    className="btn-primary w-full py-4 text-xs font-bold uppercase tracking-widest justify-center shadow-md cursor-pointer"
                  >
                    Avançar para Dados de Entrega
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={handleCheckout}
                      disabled={!nome.trim() || !cep.trim() || !cidadeUf.trim()}
                      className="btn-whatsapp w-full py-4 text-xs font-bold uppercase tracking-widest justify-center shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <WhatsAppVectorIcon size={18} />
                      Confirmar Pedido via WhatsApp
                    </button>
                    <button
                      onClick={() => setStep('cart')}
                      className="w-full py-2.5 text-xs text-[#786A61] hover:text-[#4D4038] font-bold uppercase tracking-wider text-center cursor-pointer"
                    >
                      Voltar ao Carrinho
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
