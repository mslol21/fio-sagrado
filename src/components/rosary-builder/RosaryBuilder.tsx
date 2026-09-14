import React, { useState, useMemo } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import type { 
  RosaryModel, 
  CustomizationComponent, 
  RosaryConfiguration, 
  Product 
} from '../../types';
import { RosaryPreview } from './RosaryPreview';
import { RosaryStepper } from './RosaryStepper';
import { RosaryPrice } from './RosaryPrice';
import { ModelSelector } from './ModelSelector';
import { BeadSelector } from './BeadSelector';
import { OurFatherSelector } from './OurFatherSelector';
import { CenterpieceSelector } from './CenterpieceSelector';
import { RosarySummary } from './RosarySummary';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { RosaryVectorIcon, BraceletVectorIcon } from '../icons/ProductIcons';

export const RosaryBuilder: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { rosaryModels, customizationComponents, saveCustomBuild, products } = useData();
  const { addToCart, setIsCartOpen } = useCart();
  const { showToast } = useToast();

  // Mode: 'terco' or 'pulseira'
  const initialMode = useMemo(() => {
    const typeParam = searchParams.get('tipo');
    if (typeParam === 'pulseira' || location.pathname.includes('pulseira')) return 'pulseira';
    return 'terco';
  }, [searchParams, location.pathname]);

  const [builderMode, setBuilderMode] = useState<'terco' | 'pulseira'>(initialMode);
  const [currentStep, setCurrentStep] = useState(1);
  const [maxReachedStep, setMaxReachedStep] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Sync mode with URL param if it changes externally during render
  const typeParam = searchParams.get('tipo');
  const expectedMode = (typeParam === 'pulseira' || location.pathname.includes('pulseira')) ? 'pulseira' : 'terco';
  if (typeParam && (typeParam === 'pulseira' || typeParam === 'terco') && builderMode !== expectedMode) {
    setBuilderMode(expectedMode);
  }

  // Model selection
  const matchingModel = useMemo(() => {
    const modelParam = searchParams.get('modelo') || searchParams.get('produto');
    if (modelParam && rosaryModels.length > 0) {
      const found = rosaryModels.find(m => 
        m.slug.toLowerCase() === modelParam.toLowerCase() ||
        m.name.toLowerCase().includes(modelParam.toLowerCase())
      );
      if (found) return found;
    }
    return rosaryModels.find(m => {
      if (m.is_active === false) return false;
      const isP = m.product_type === 'bracelet' || m.slug.includes('pulseira');
      return builderMode === 'pulseira' ? isP : !isP;
    });
  }, [rosaryModels, searchParams, builderMode]);

  const [selectedModelOverride, setSelectedModel] = useState<RosaryModel | undefined>(undefined);
  const selectedModel = selectedModelOverride && (
    (builderMode === 'pulseira' && (selectedModelOverride.product_type === 'bracelet' || selectedModelOverride.slug.includes('pulseira'))) ||
    (builderMode === 'terco' && selectedModelOverride.product_type !== 'bracelet' && !selectedModelOverride.slug.includes('pulseira'))
  ) ? selectedModelOverride : matchingModel;

  const defaultBead = useMemo(() => customizationComponents.find(c => c.component_type === 'bead' && c.is_active), [customizationComponents]);
  const defaultCenterpiece = useMemo(() => customizationComponents.find(c => c.component_type === 'centerpiece' && c.is_active), [customizationComponents]);
  const defaultCrucifix = useMemo(() => customizationComponents.find(c => c.component_type === 'crucifix' && c.is_active), [customizationComponents]);

  const [selectedBeadOverride, setSelectedBead] = useState<CustomizationComponent | undefined>(undefined);
  const [selectedOurFather, setSelectedOurFather] = useState<CustomizationComponent | undefined>(undefined);
  const [selectedCenterpieceOverride, setSelectedCenterpiece] = useState<CustomizationComponent | undefined>(undefined);
  const [selectedCrucifixOverride] = useState<CustomizationComponent | undefined>(undefined);

  const selectedBead = selectedBeadOverride || defaultBead;
  const selectedCenterpiece = selectedCenterpieceOverride || defaultCenterpiece;
  const selectedCrucifix = selectedCrucifixOverride || defaultCrucifix;

  const [selectedExtras] = useState<CustomizationComponent[]>([]);
  const customName = '';
  const customMessage = '';
  const notes = '';
  const [publicCode, setPublicCode] = useState(() => 
    `${initialMode === 'pulseira' ? 'FS-PUL' : 'FS-TER'}-${Math.floor(10000 + Math.random() * 90000)}`
  );

  // Handle switching between Terço and Pulseira
  const handleSwitchMode = (newMode: 'terco' | 'pulseira') => {
    if (newMode === builderMode) return;
    setBuilderMode(newMode);
    setCurrentStep(1);
    setMaxReachedStep(1);
    setSearchParams({ tipo: newMode });
    setPublicCode(`${newMode === 'pulseira' ? 'FS-PUL' : 'FS-TER'}-${Math.floor(10000 + Math.random() * 90000)}`);
    setSelectedModel(undefined);
  };

  // Price calculations
  const basePrice = selectedModel?.base_price ?? (builderMode === 'pulseira' ? 39.90 : 59.90);

  const additionalPrice = useMemo(() => {
    let total = 0;
    if (selectedBead?.additional_price) total += selectedBead.additional_price;
    if (selectedOurFather?.additional_price) total += selectedOurFather.additional_price;
    if (selectedCenterpiece?.additional_price) total += selectedCenterpiece.additional_price;
    return total;
  }, [selectedBead, selectedOurFather, selectedCenterpiece]);

  const totalPrice = basePrice + additionalPrice;

  // Build Configuration Object
  const configuration: RosaryConfiguration = useMemo(() => ({
    model: selectedModel,
    bead: selectedBead,
    ourFather: selectedOurFather,
    centerpiece: selectedCenterpiece,
    crucifix: selectedCrucifix,
    extras: selectedExtras,
    customName,
    customMessage,
    notes,
    builderMode,
  }), [selectedModel, selectedBead, selectedOurFather, selectedCenterpiece, selectedCrucifix, selectedExtras, customName, customMessage, notes, builderMode]);

  // Step Navigation Validation
  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 1: return !!selectedModel;
      case 2: return !!selectedBead;
      case 3: return true; // Optional (falls back to selectedBead)
      case 4: return !!selectedCenterpiece;
      case 5: return true;
      default: return false;
    }
  }, [currentStep, selectedModel, selectedBead, selectedCenterpiece]);

  const handleNextStep = () => {
    if (!canProceed) return;
    const next = currentStep + 1;
    setCurrentStep(next);
    setMaxReachedStep(prev => Math.max(prev, next));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Add to Cart handler
  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      // 1. Save build to Supabase or get unique reference
      const saved = await saveCustomBuild({
        product_type: builderMode === 'pulseira' ? 'bracelet' : 'rosary',
        model_id: selectedModel?.id,
        configuration,
        base_price: basePrice,
        additional_price: additionalPrice,
        total_price: totalPrice
      });

      const finalCode = saved.public_code || publicCode;
      setPublicCode(finalCode);

      // 2. Find base catalog product or create custom representation
      const targetCategory = builderMode === 'pulseira' ? 'pulseiras' : 'tercos';
      const baseCatalogProduct = products.find(p => p.category === targetCategory) || products[0];

      const itemTitle = builderMode === 'pulseira'
        ? `Pulseira de Terço Personalizada — ${finalCode}`
        : `Terço Personalizado — ${finalCode}`;

      const itemDescription = builderMode === 'pulseira'
        ? `Modelo ${selectedModel?.name || 'Pulseira Regulável'} em crochê artesanal com Contas ${selectedBead?.name || 'Clássicas'} (10x), Entremeio ${selectedCenterpiece?.name || 'N. Sra. Aparecida'} e Fecho Regulável.`
        : `Modelo ${selectedModel?.name || 'Tradicional'} com Contas ${selectedBead?.name || 'Clássicas'}, Entremeio ${selectedCenterpiece?.name || 'N. Sra. Aparecida'} e Crucifixo ${selectedCrucifix?.name || 'Barroco'}.`;

      const customRosaryProduct: Product = {
        id: baseCatalogProduct ? baseCatalogProduct.id : `custom-${builderMode}-item`,
        name: itemTitle,
        description: itemDescription,
        price: totalPrice,
        image: selectedBead?.image || baseCatalogProduct?.image || '/logo.png',
        category: targetCategory,
        line: 'personalizados',
        availability: 'made_to_order',
        production_days: 5,
        isCustomizable: true,
      };

      // 3. Add to Cart with structured customization details
      addToCart({
        ...customRosaryProduct,
        customization: {
          buildId: saved.id,
          code: finalCode,
          model: selectedModel?.name || (builderMode === 'pulseira' ? 'Pulseira Regulável' : 'Tradicional'),
          selections: {
            model: selectedModel,
            bead: selectedBead,
            ourFather: selectedOurFather || selectedBead,
            centerpiece: selectedCenterpiece,
            crucifix: selectedCrucifix,
            extras: selectedExtras,
            customName: customName || undefined,
            customMessage: customMessage || undefined,
            notes: notes || undefined
          }
        }
      }, 1);

      showToast(
        builderMode === 'pulseira'
          ? `Pulseira de Terço ${finalCode} adicionada ao carrinho!`
          : `Terço ${finalCode} adicionado ao carrinho!`,
        'success'
      );
      setIsCartOpen(true);
    } catch (err: unknown) {
      console.error('Erro ao adicionar ao carrinho:', err);
      showToast('Erro ao salvar sua criação. Tente novamente.', 'error');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Mode Segmented Switcher */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1.5 bg-sand/80 border border-gold/30 rounded-2xl shadow-xs backdrop-blur-sm">
          <button
            type="button"
            onClick={() => handleSwitchMode('terco')}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
              builderMode === 'terco'
                ? 'bg-primary text-white shadow-md'
                : 'text-navy/70 hover:text-navy hover:bg-white/40'
            }`}
          >
            <RosaryVectorIcon size={20} className={builderMode === 'terco' ? 'text-gold' : 'text-gold-dark'} />
            <span>Monte seu Terço</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchMode('pulseira')}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
              builderMode === 'pulseira'
                ? 'bg-primary text-white shadow-md'
                : 'text-navy/70 hover:text-navy hover:bg-white/40'
            }`}
          >
            <BraceletVectorIcon size={20} className={builderMode === 'pulseira' ? 'text-gold' : 'text-gold-dark'} />
            <span>Monte sua Pulseira de Terço</span>
            <span className="hidden sm:inline text-[10px] bg-gold/25 text-gold-dark border border-gold/40 px-2 py-0.5 rounded-full font-black uppercase">
              Novo
            </span>
          </button>
        </div>
      </div>

      {/* Top Stepper */}
      <div className="mb-8">
        <RosaryStepper
          currentStep={currentStep}
          builderMode={builderMode}
          onStepClick={(stepId) => setCurrentStep(stepId)}
          maxReachedStep={maxReachedStep}
        />
      </div>

      {/* Main 2-Column Split Layout (55% Desktop Preview / 45% Configurator) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column (55% on Desktop): 2D Rosary Reactive Preview */}
        <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-4">
          <RosaryPreview configuration={configuration} />
          
          {/* Desktop Real-time Price Breakdown Card */}
          <div className="hidden lg:block">
            <RosaryPrice
              basePrice={basePrice}
              additionalPrice={additionalPrice}
              totalPrice={totalPrice}
            />
          </div>
        </div>

        {/* Right Column (45% on Desktop): Step Configurator & Form */}
        <div className="lg:col-span-5 flex flex-col justify-between min-h-[500px] space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${builderMode}-${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {currentStep === 1 && (
                <ModelSelector
                  models={rosaryModels}
                  selectedModel={selectedModel}
                  builderMode={builderMode}
                  onSelectModel={(model) => {
                    setSelectedModel(model);
                    showToast(`Modelo ${model.name} selecionado.`, 'info');
                  }}
                />
              )}

              {currentStep === 2 && (
                <BeadSelector
                  beads={customizationComponents}
                  selectedBead={selectedBead}
                  builderMode={builderMode}
                  onSelectBead={(bead) => {
                    setSelectedBead(bead);
                    showToast(`Contas ${bead.name} adicionadas à criação.`, 'info');
                  }}
                />
              )}

              {currentStep === 3 && (
                <OurFatherSelector
                  ourFatherBeads={customizationComponents}
                  selectedOurFather={selectedOurFather}
                  builderMode={builderMode}
                  onSelectOurFather={(item) => {
                    setSelectedOurFather(item);
                    showToast(`Destaque ${item.name} selecionado.`, 'info');
                  }}
                />
              )}

              {currentStep === 4 && (
                <CenterpieceSelector
                  centerpieces={customizationComponents}
                  selectedCenterpiece={selectedCenterpiece}
                  builderMode={builderMode}
                  onSelectCenterpiece={(item) => {
                    setSelectedCenterpiece(item);
                    showToast(`Entremeio ${item.name} adicionado.`, 'info');
                  }}
                />
              )}

              {currentStep === 5 && (
                <RosarySummary
                  configuration={configuration}
                  basePrice={basePrice}
                  additionalPrice={additionalPrice}
                  totalPrice={totalPrice}
                  publicCode={publicCode}
                  isAddingToCart={isAddingToCart}
                  onAddToCart={handleAddToCart}
                  onEditStep={(stepId) => setCurrentStep(stepId)}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Mobile Price Summary Pill */}
          <div className="lg:hidden">
            <RosaryPrice
              basePrice={basePrice}
              additionalPrice={additionalPrice}
              totalPrice={totalPrice}
            />
          </div>

          {/* Navigation Controls (Voltar / Continuar) */}
          {currentStep < 5 && (
            <div className="flex items-center justify-between pt-6 border-t border-gold/15 sticky bottom-0 bg-cream/95 backdrop-blur-md py-4 z-10">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-navy/50 hover:text-navy disabled:opacity-0 transition-all cursor-pointer"
              >
                <ArrowLeft size={16} /> Voltar
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                disabled={!canProceed}
                className="btn-primary py-3.5 px-8 text-xs disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-navy/10 cursor-pointer"
              >
                <span>Continuar</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
