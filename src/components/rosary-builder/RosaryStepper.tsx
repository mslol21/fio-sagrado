import React from 'react';
import { 
  Check, Layers, CircleDot, Sparkles, Shield, 
  CheckCircle2 
} from 'lucide-react';

export interface StepItem {
  id: number;
  label: string;
  shortLabel: string;
  iconComponent: React.ReactNode;
}

const getSteps = (builderMode: 'terco' | 'pulseira' = 'terco'): StepItem[] => [
  { id: 1, label: builderMode === 'pulseira' ? 'Modelo da Pulseira' : 'Modelo', shortLabel: 'Modelo', iconComponent: <Layers size={13} /> },
  { id: 2, label: builderMode === 'pulseira' ? 'Contas da Dezena (10x)' : 'Contas (Ave-Marias)', shortLabel: 'Contas', iconComponent: <CircleDot size={13} /> },
  { id: 3, label: builderMode === 'pulseira' ? 'Conta de Destaque' : 'Pai-Nossos', shortLabel: builderMode === 'pulseira' ? 'Destaque' : 'Pai-Nosso', iconComponent: <Sparkles size={13} /> },
  { id: 4, label: builderMode === 'pulseira' ? 'Entremeio & Mini Cruz' : 'Entremeio', shortLabel: 'Entremeio', iconComponent: <Shield size={13} /> },
  { id: 5, label: builderMode === 'pulseira' ? 'Resumo da Pulseira' : 'Resumo Final', shortLabel: 'Resumo', iconComponent: <CheckCircle2 size={13} /> },
];

interface RosaryStepperProps {
  currentStep: number;
  onStepClick: (stepId: number) => void;
  maxReachedStep: number;
  builderMode?: 'terco' | 'pulseira';
}

export const RosaryStepper: React.FC<RosaryStepperProps> = ({
  currentStep,
  onStepClick,
  maxReachedStep,
  builderMode = 'terco'
}) => {
  const steps = getSteps(builderMode);

  return (
    <div className="w-full">
      {/* Mobile Stepper: Horizontal Scrolling Pills */}
      <div className="flex md:hidden items-center gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar -mx-2 px-2">
        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isClickable = step.id <= maxReachedStep;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => isClickable && onStepClick(step.id)}
              disabled={!isClickable}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                isCurrent
                  ? 'bg-primary text-white shadow-md'
                  : isCompleted
                  ? 'bg-gold/15 text-navy border border-gold/30 hover:bg-gold/25'
                  : 'bg-white/60 text-navy/40 border border-gold/10 opacity-60'
              }`}
            >
              <span className={isCurrent ? 'text-gold-light' : isCompleted ? 'text-gold-dark' : 'text-navy/40'}>
                {step.iconComponent}
              </span>
              <span>{step.shortLabel}</span>
              {isCompleted && <Check size={12} strokeWidth={3} className="text-gold-dark ml-0.5" />}
            </button>
          );
        })}
      </div>

      {/* Desktop Stepper: Elegant Progress Bar + Step Markers */}
      <div className="hidden md:flex items-center justify-between relative py-2">
        {steps.map((step, idx) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isClickable = step.id <= maxReachedStep;

          return (
            <React.Fragment key={step.id}>
              <button
                type="button"
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                className={`group flex flex-col items-center text-center transition-all ${
                  isClickable ? 'cursor-pointer' : 'cursor-default opacity-50'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2 ${
                    isCurrent
                      ? 'bg-primary border-primary text-gold shadow-md scale-110'
                      : isCompleted
                      ? 'bg-gold border-gold text-navy shadow-sm'
                      : 'bg-white border-gold/20 text-navy/40 group-hover:border-gold/50'
                  }`}
                >
                  {isCompleted ? (
                    <Check size={14} strokeWidth={3} />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                <span
                  className={`text-[10px] uppercase tracking-wider font-bold mt-1.5 transition-colors ${
                    isCurrent
                      ? 'text-navy'
                      : isCompleted
                      ? 'text-navy/70'
                      : 'text-navy/35'
                  }`}
                >
                  {step.shortLabel}
                </span>
              </button>

              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 rounded-full transition-all ${
                    idx + 1 < currentStep ? 'bg-gold' : 'bg-gold/15'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
