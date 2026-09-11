import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import type { 
  RosaryModel, 
  CustomizationComponent, 
  ComponentType 
} from '../../types';
import { 
  Plus, Edit2, Trash2, X, Sparkles 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type CustomizerSubTab = 
  | 'models'
  | 'beads'
  | 'our_father'
  | 'centerpieces'
  | 'crucifixes'
  | 'extras'
  | 'builds';

export const CustomizerAdmin: React.FC = () => {
  const {
    rosaryModels,
    customizationComponents,
    customBuilds,
    addRosaryModel,
    updateRosaryModel,
    deleteRosaryModel,
    addCustomizationComponent,
    updateCustomizationComponent,
    deleteCustomizationComponent,
    uploadFile
  } = useData();
  const { showToast } = useToast();

  const [activeSubTab, setActiveSubTab] = useState<CustomizerSubTab>('models');

  // Model Modal State
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<RosaryModel | null>(null);
  const [formModel, setFormModel] = useState<Partial<RosaryModel>>({
    name: '',
    slug: '',
    description: '',
    image: '',
    base_price: 59.90,
    display_order: 1,
    is_active: true
  });

  // Component Modal State
  const [isCompModalOpen, setIsCompModalOpen] = useState(false);
  const [editingComp, setEditingComp] = useState<CustomizationComponent | null>(null);
  const [formComp, setFormComp] = useState<Partial<CustomizationComponent>>({
    component_type: 'bead',
    name: '',
    slug: '',
    description: '',
    image: '',
    color: '#D4AF37',
    material: '',
    size: '8mm',
    additional_price: 0,
    cost: 0,
    stock: 50,
    min_stock: 5,
    display_order: 1,
    is_active: true
  });

  const [isUploading, setIsUploading] = useState(false);

  // Filtered Component Lists
  const beads = customizationComponents.filter(c => c.component_type === 'bead');
  const ourFathers = customizationComponents.filter(c => c.component_type === 'our_father_bead');
  const centerpieces = customizationComponents.filter(c => c.component_type === 'centerpiece');
  const crucifixes = customizationComponents.filter(c => c.component_type === 'crucifix');
  const extras = customizationComponents.filter(c => ['medal', 'letter', 'packaging'].includes(c.component_type));

  // --- Handlers for Models ---
  const handleOpenModelModal = (model?: RosaryModel) => {
    if (model) {
      setEditingModel(model);
      setFormModel(model);
    } else {
      setEditingModel(null);
      setFormModel({
        name: '',
        slug: '',
        description: '',
        image: '',
        base_price: 59.90,
        display_order: rosaryModels.length + 1,
        is_active: true
      });
    }
    setIsModelModalOpen(true);
  };

  const handleSaveModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formModel.name || formModel.base_price === undefined) return;
    const slug = formModel.slug || formModel.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');

    try {
      if (editingModel) {
        await updateRosaryModel({ ...editingModel, ...formModel, slug } as RosaryModel);
        showToast('Modelo de terço atualizado!', 'success');
      } else {
        await addRosaryModel({
          name: formModel.name,
          slug,
          description: formModel.description || '',
          image: formModel.image || '',
          base_price: Number(formModel.base_price),
          display_order: Number(formModel.display_order) || 0,
          is_active: formModel.is_active !== false,
          layout: {}
        });
        showToast('Novo modelo de terço cadastrado!', 'success');
      }
      setIsModelModalOpen(false);
    } catch (err: any) {
      showToast('Erro ao salvar modelo: ' + err.message, 'error');
    }
  };

  const handleDeleteModel = async (id: string) => {
    if (!confirm('Deseja realmente remover este modelo?')) return;
    try {
      await deleteRosaryModel(id);
      showToast('Modelo removido.', 'info');
    } catch (err: any) {
      showToast('Erro ao remover modelo.', 'error');
    }
  };

  // --- Handlers for Components ---
  const handleOpenCompModal = (type: ComponentType, comp?: CustomizationComponent) => {
    if (comp) {
      setEditingComp(comp);
      setFormComp(comp);
    } else {
      setEditingComp(null);
      setFormComp({
        component_type: type,
        name: '',
        slug: '',
        description: '',
        image: '',
        color: '#D4AF37',
        material: '',
        size: type === 'bead' ? '8mm' : type === 'our_father_bead' ? '10mm' : type === 'crucifix' ? '45mm' : '22mm',
        additional_price: 0,
        cost: 0,
        stock: 50,
        min_stock: 5,
        display_order: customizationComponents.length + 1,
        is_active: true
      });
    }
    setIsCompModalOpen(true);
  };

  const handleSaveComp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formComp.name || !formComp.component_type) return;
    const slug = formComp.slug || formComp.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');

    try {
      if (editingComp) {
        await updateCustomizationComponent({ ...editingComp, ...formComp, slug } as CustomizationComponent);
        showToast('Componente atualizado com sucesso!', 'success');
      } else {
        await addCustomizationComponent({
          product_type: 'rosary',
          component_type: formComp.component_type as ComponentType,
          name: formComp.name,
          slug,
          description: formComp.description || '',
          image: formComp.image || '',
          color: formComp.color || '',
          material: formComp.material || '',
          size: formComp.size || '',
          additional_price: Number(formComp.additional_price) || 0,
          cost: Number(formComp.cost) || 0,
          stock: Number(formComp.stock) || 0,
          min_stock: Number(formComp.min_stock) || 0,
          display_order: Number(formComp.display_order) || 0,
          is_active: formComp.is_active !== false,
          compatibility: {},
          metadata: {}
        });
        showToast('Novo componente cadastrado!', 'success');
      }
      setIsCompModalOpen(false);
    } catch (err: any) {
      showToast('Erro ao salvar componente: ' + err.message, 'error');
    }
  };

  const handleDeleteComp = async (id: string) => {
    if (!confirm('Deseja realmente remover este componente?')) return;
    try {
      await deleteCustomizationComponent(id);
      showToast('Componente removido.', 'info');
    } catch (err: any) {
      showToast('Erro ao remover componente.', 'error');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isModel = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadFile(file);
      if (isModel) {
        setFormModel(prev => ({ ...prev, image: url }));
      } else {
        setFormComp(prev => ({ ...prev, image: url }));
      }
      showToast('Imagem carregada com sucesso!', 'success');
    } catch (err: any) {
      showToast('Erro no upload: ' + err.message, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const getComponentTypeForSubTab = (): ComponentType => {
    switch (activeSubTab) {
      case 'beads': return 'bead';
      case 'our_father': return 'our_father_bead';
      case 'centerpieces': return 'centerpiece';
      case 'crucifixes': return 'crucifix';
      case 'extras': return 'medal';
      default: return 'bead';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-gold/15 text-gold-dark">
              <Sparkles size={20} />
            </span>
            <h1 className="font-serif font-bold text-3xl text-navy">
              Personalizador de Terços
            </h1>
          </div>
          <p className="text-navy/50 text-xs sm:text-sm mt-1">
            Gerencie todos os modelos, contas, entremeios, crucifixos e preços adicionais do construtor visual 2D.
          </p>
        </div>

        {activeSubTab !== 'builds' && (
          <button
            type="button"
            onClick={() => {
              if (activeSubTab === 'models') {
                handleOpenModelModal();
              } else {
                handleOpenCompModal(getComponentTypeForSubTab());
              }
            }}
            className="btn-primary py-3 px-6 text-xs whitespace-nowrap shadow-md cursor-pointer"
          >
            <Plus size={16} />
            <span>Adicionar {activeSubTab === 'models' ? 'Modelo' : 'Opção'}</span>
          </button>
        )}
      </div>

      {/* Subtabs Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gold/15 scrollbar-hide">
        {[
          { id: 'models', label: `Modelos (${rosaryModels.length})` },
          { id: 'beads', label: `Ave-Marias (${beads.length})` },
          { id: 'our_father', label: `Pai-Nossos (${ourFathers.length})` },
          { id: 'centerpieces', label: `Entremeios (${centerpieces.length})` },
          { id: 'crucifixes', label: `Crucifixos (${crucifixes.length})` },
          { id: 'extras', label: `Extras (${extras.length})` },
          { id: 'builds', label: `Criações (${customBuilds.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id as CustomizerSubTab)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-navy text-gold shadow-sm font-black'
                : 'bg-white/80 text-navy/60 hover:text-navy hover:bg-gold/10 border border-gold/15'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content for: MODELS */}
      {activeSubTab === 'models' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rosaryModels.map((model) => (
            <div
              key={model.id}
              className="bg-white border border-gold/15 rounded-3xl p-6 shadow-premium flex flex-col justify-between group hover:border-gold/30 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-navy">{model.name}</h3>
                    <p className="text-[10px] text-navy/40 font-mono">slug: {model.slug}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    model.is_active !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {model.is_active !== false ? 'Ativo' : 'Inativo'}
                  </span>
                </div>

                <p className="text-xs text-navy/60 leading-relaxed mb-4 line-clamp-2">
                  {model.description || 'Sem descrição cadastrada.'}
                </p>

                <div className="flex items-center justify-between p-3 bg-cream rounded-2xl border border-gold/10 mb-4">
                  <span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Preço Base</span>
                  <span className="font-serif font-bold text-navy text-base">
                    {model.base_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gold/10">
                <button
                  type="button"
                  onClick={() => handleOpenModelModal(model)}
                  className="p-2 text-navy/60 hover:text-navy hover:bg-gold/10 rounded-xl transition-all cursor-pointer"
                  title="Editar modelo"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteModel(model.id)}
                  className="p-2 text-navy/30 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                  title="Excluir modelo"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content for: COMPONENTS (Beads, Our Fathers, Centerpieces, Crucifixes, Extras) */}
      {['beads', 'our_father', 'centerpieces', 'crucifixes', 'extras'].includes(activeSubTab) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeSubTab === 'beads' ? beads :
            activeSubTab === 'our_father' ? ourFathers :
            activeSubTab === 'centerpieces' ? centerpieces :
            activeSubTab === 'crucifixes' ? crucifixes : extras
          ).map((comp) => (
            <div
              key={comp.id}
              className="bg-white border border-gold/15 rounded-3xl p-5 shadow-premium flex flex-col justify-between group hover:border-gold/30 transition-all"
            >
              <div>
                <div className="flex items-start gap-4 mb-4">
                  {/* Swatch / Image */}
                  <div className="relative flex-shrink-0">
                    {comp.image ? (
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-cream border border-gold/20 flex items-center justify-center">
                        <img src={comp.image} alt={comp.name} className="w-full h-full object-cover" />
                      </div>
                    ) : comp.color ? (
                      <div
                        className="w-14 h-14 rounded-2xl border-2 border-white shadow-inner flex items-center justify-center"
                        style={{ backgroundColor: comp.color }}
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/25 flex items-center justify-center text-gold-dark font-bold">
                        ✦
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-serif font-bold text-sm text-navy truncate">{comp.name}</h4>
                    </div>
                    <p className="text-[10px] text-navy/40 font-mono mt-0.5">slug: {comp.slug}</p>
                    {(comp.material || comp.size) && (
                      <p className="text-[11px] text-navy/60 font-medium mt-1">
                        {[comp.material, comp.size].filter(Boolean).join(' • ')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Pricing & Stock Details */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-cream rounded-2xl border border-gold/10 mb-4 text-xs">
                  <div>
                    <span className="text-[9px] font-bold text-navy/40 uppercase tracking-widest block">Acréscimo</span>
                    <span className="font-bold text-gold-dark">
                      {comp.additional_price > 0 ? `+ R$ ${comp.additional_price.toFixed(2)}` : 'Incluso (R$ 0)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-navy/40 uppercase tracking-widest block">Estoque</span>
                    <span className={`font-bold ${
                      comp.stock !== undefined && comp.stock <= (comp.min_stock || 5) ? 'text-red-600' : 'text-navy'
                    }`}>
                      {comp.stock ?? 100} un
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gold/10 text-xs">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  comp.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {comp.is_active ? 'Ativo' : 'Inativo'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenCompModal(comp.component_type, comp)}
                    className="p-2 text-navy/60 hover:text-navy hover:bg-gold/10 rounded-xl transition-all cursor-pointer"
                    title="Editar componente"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteComp(comp.id)}
                    className="p-2 text-navy/30 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                    title="Excluir componente"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content for: CUSTOM BUILDS */}
      {activeSubTab === 'builds' && (
        <div className="space-y-4">
          <div className="bg-white border border-gold/15 rounded-3xl p-6 shadow-premium overflow-x-auto">
            {customBuilds.length === 0 ? (
              <p className="text-navy/50 text-sm py-8 text-center">Nenhuma criação personalizada registrada recentemente.</p>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gold/15 text-navy/40 uppercase tracking-widest text-[10px]">
                    <th className="py-3 px-4">Código</th>
                    <th className="py-3 px-4">Modelo</th>
                    <th className="py-3 px-4">Contas & Entremeio</th>
                    <th className="py-3 px-4">Valor Total</th>
                    <th className="py-3 px-4">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10">
                  {customBuilds.map((build) => {
                    const c = build.configuration || {};
                    return (
                      <tr key={build.id} className="hover:bg-cream/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-gold-dark text-sm">
                          {build.public_code}
                        </td>
                        <td className="py-3.5 px-4 font-serif font-bold text-navy">
                          {c.model?.name || 'Tradicional'}
                        </td>
                        <td className="py-3.5 px-4 text-navy/70">
                          <span>{c.bead?.name || 'Clássica'}</span> • <span>{c.centerpiece?.name || 'Aparecida'}</span>
                          {c.customName && <span className="block text-[10px] text-gold-dark font-medium">Nome: {c.customName}</span>}
                        </td>
                        <td className="py-3.5 px-4 font-serif font-bold text-navy">
                          {build.total_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                        <td className="py-3.5 px-4 text-navy/40">
                          {build.created_at ? new Date(build.created_at).toLocaleDateString('pt-BR') : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD/EDIT MODEL */}
      <AnimatePresence>
        {isModelModalOpen && (
          <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-gold/20 p-8 max-w-lg w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gold/15">
                <h3 className="font-serif font-bold text-2xl text-navy">
                  {editingModel ? 'Editar Modelo' : 'Novo Modelo de Terço'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModelModalOpen(false)}
                  className="p-2 text-navy/40 hover:text-navy rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveModel} className="space-y-4 text-left">
                <div>
                  <label className="label-base">Nome do Modelo *</label>
                  <input
                    required
                    type="text"
                    value={formModel.name || ''}
                    onChange={(e) => setFormModel({ ...formModel, name: e.target.value })}
                    placeholder="Ex: Tradicional, Noiva Especial..."
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="label-base">Slug (Identificador URL)</label>
                  <input
                    type="text"
                    value={formModel.slug || ''}
                    onChange={(e) => setFormModel({ ...formModel, slug: e.target.value })}
                    placeholder="Ex: tradicional, noiva"
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="label-base">Descrição</label>
                  <textarea
                    rows={2}
                    value={formModel.description || ''}
                    onChange={(e) => setFormModel({ ...formModel, description: e.target.value })}
                    placeholder="Detalhes sobre a montagem e estilo..."
                    className="input-base resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-base">Preço Base (R$) *</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={formModel.base_price || 0}
                      onChange={(e) => setFormModel({ ...formModel, base_price: parseFloat(e.target.value) || 0 })}
                      className="input-base"
                    />
                  </div>
                  <div>
                    <label className="label-base">Ordem de Exibição</label>
                    <input
                      type="number"
                      value={formModel.display_order || 1}
                      onChange={(e) => setFormModel({ ...formModel, display_order: parseInt(e.target.value) || 1 })}
                      className="input-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="label-base">Foto do Modelo</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                      className="text-xs text-navy/70"
                    />
                    {isUploading && <span className="text-xs text-gold-dark animate-pulse font-bold">Enviando...</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="model_is_active"
                    checked={formModel.is_active !== false}
                    onChange={(e) => setFormModel({ ...formModel, is_active: e.target.checked })}
                    className="rounded text-navy focus:ring-gold"
                  />
                  <label htmlFor="model_is_active" className="text-xs font-bold text-navy cursor-pointer">
                    Modelo Ativo no Construtor
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gold/10">
                  <button
                    type="button"
                    onClick={() => setIsModelModalOpen(false)}
                    className="px-6 py-3 border border-gold/25 rounded-full text-xs font-bold uppercase tracking-wider text-navy/60 w-1/2 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary w-1/2 justify-center cursor-pointer">
                    Salvar Modelo
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD/EDIT COMPONENT */}
      <AnimatePresence>
        {isCompModalOpen && (
          <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-gold/20 p-8 max-w-lg w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gold/15">
                <h3 className="font-serif font-bold text-2xl text-navy">
                  {editingComp ? 'Editar Componente' : 'Novo Componente'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCompModalOpen(false)}
                  className="p-2 text-navy/40 hover:text-navy rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveComp} className="space-y-4 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-base">Tipo de Componente *</label>
                    <select
                      value={formComp.component_type}
                      onChange={(e) => setFormComp({ ...formComp, component_type: e.target.value as ComponentType })}
                      className="input-base"
                    >
                      <option value="bead">Contas Ave-Marias</option>
                      <option value="our_father_bead">Contas Pai-Nossos</option>
                      <option value="centerpiece">Entremeio / Medalha</option>
                      <option value="crucifix">Crucifixo / Cruz</option>
                      <option value="medal">Medalha Adicional</option>
                      <option value="letter">Letras / Nome</option>
                      <option value="packaging">Embalagem de Presente</option>
                    </select>
                  </div>
                  <div>
                    <label className="label-base">Tamanho (Ex: 8mm)</label>
                    <input
                      type="text"
                      value={formComp.size || ''}
                      onChange={(e) => setFormComp({ ...formComp, size: e.target.value })}
                      placeholder="Ex: 8mm, 10mm, 25mm"
                      className="input-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="label-base">Nome do Insumo *</label>
                  <input
                    required
                    type="text"
                    value={formComp.name || ''}
                    onChange={(e) => setFormComp({ ...formComp, name: e.target.value })}
                    placeholder="Ex: Pérola Branca Clássica, Cristal Azul..."
                    className="input-base"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-base">Material</label>
                    <input
                      type="text"
                      value={formComp.material || ''}
                      onChange={(e) => setFormComp({ ...formComp, material: e.target.value })}
                      placeholder="Ex: Pérola, Cristal, Metal Dourado"
                      className="input-base"
                    />
                  </div>
                  <div>
                    <label className="label-base">Cor Hexadecimal (2D Preview)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formComp.color || '#D4AF37'}
                        onChange={(e) => setFormComp({ ...formComp, color: e.target.value })}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-gold/20"
                      />
                      <input
                        type="text"
                        value={formComp.color || ''}
                        onChange={(e) => setFormComp({ ...formComp, color: e.target.value })}
                        placeholder="#D4AF37"
                        className="input-base flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="label-base">Acréscimo (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formComp.additional_price || 0}
                      onChange={(e) => setFormComp({ ...formComp, additional_price: parseFloat(e.target.value) || 0 })}
                      className="input-base"
                    />
                  </div>
                  <div>
                    <label className="label-base">Estoque (un)</label>
                    <input
                      type="number"
                      value={formComp.stock || 0}
                      onChange={(e) => setFormComp({ ...formComp, stock: parseInt(e.target.value) || 0 })}
                      className="input-base"
                    />
                  </div>
                  <div>
                    <label className="label-base">Estoque Mínimo</label>
                    <input
                      type="number"
                      value={formComp.min_stock || 5}
                      onChange={(e) => setFormComp({ ...formComp, min_stock: parseInt(e.target.value) || 0 })}
                      className="input-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="label-base">Foto do Componente</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, false)}
                      className="text-xs text-navy/70"
                    />
                    {isUploading && <span className="text-xs text-gold-dark animate-pulse font-bold">Enviando...</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="comp_is_active"
                    checked={formComp.is_active !== false}
                    onChange={(e) => setFormComp({ ...formComp, is_active: e.target.checked })}
                    className="rounded text-navy focus:ring-gold"
                  />
                  <label htmlFor="comp_is_active" className="text-xs font-bold text-navy cursor-pointer">
                    Componente Ativo e Disponível
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gold/10">
                  <button
                    type="button"
                    onClick={() => setIsCompModalOpen(false)}
                    className="px-6 py-3 border border-gold/25 rounded-full text-xs font-bold uppercase tracking-wider text-navy/60 w-1/2 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary w-1/2 justify-center cursor-pointer">
                    Salvar Insumo
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
