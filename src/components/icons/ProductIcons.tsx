import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// -------------------------------------------------------------------
// 1. ÍCONES DE PRODUTOS PRINCIPAIS (TERÇO, PULSEIRA, DEZENA)
// -------------------------------------------------------------------

/** Terço Completo em Crochê (5 Dezenas, Entremeio e Crucifixo Nobre) */
export const RosaryVectorIcon: React.FC<IconProps> = ({ className = 'text-[#9A7655]', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Rosary Loop Strand */}
    <ellipse cx="24" cy="17" rx="14" ry="11" stroke="currentColor" strokeWidth="1.2" strokeDasharray="1.5 2.5" opacity="0.4" />

    {/* Ave-Maria Beads (Loop) */}
    {[
      { cx: 10, cy: 17 },
      { cx: 12, cy: 11 },
      { cx: 17, cy: 7 },
      { cx: 24, cy: 6 },
      { cx: 31, cy: 7 },
      { cx: 36, cy: 11 },
      { cx: 38, cy: 17 },
      { cx: 35, cy: 22 },
      { cx: 29, cy: 25 },
      { cx: 19, cy: 25 },
      { cx: 13, cy: 22 },
    ].map((b, i) => (
      <circle key={i} cx={b.cx} cy={b.cy} r="2.2" fill="currentColor" />
    ))}

    {/* Centerpiece Medal */}
    <circle cx="24" cy="28" r="3.6" fill="currentColor" />
    <circle cx="24" cy="28" r="2.4" fill="#FCFAF7" />
    <path d="M24 26.5V29.5M22.5 28H25.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />

    {/* Dangling Drop Beads */}
    <line x1="24" y1="31.6" x2="24" y2="38" stroke="currentColor" strokeWidth="1" strokeDasharray="1 1.5" opacity="0.6" />
    <circle cx="24" cy="34" r="1.6" fill="currentColor" />
    <circle cx="24" cy="37.5" r="1.6" fill="currentColor" />

    {/* Baroque Cross */}
    <path
      d="M22.5 40H25.5V42H27.5V44H25.5V47.5H22.5V44H20.5V42H22.5V40Z"
      fill="currentColor"
    />
    <circle cx="24" cy="43" r="0.75" fill="#FCFAF7" />
  </svg>
);

/** Pulseira de Terço em Crochê (Dezena com Fecho Regulável Macramê) */
export const BraceletVectorIcon: React.FC<IconProps> = ({ className = 'text-[#9A7655]', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Oval Wrist Loop */}
    <ellipse cx="24" cy="21" rx="15" ry="12" stroke="currentColor" strokeWidth="1.2" strokeDasharray="1.5 2" opacity="0.35" />

    {/* 10 Ave-Maria Beads */}
    {[
      { cx: 9, cy: 21 },
      { cx: 11, cy: 15 },
      { cx: 16, cy: 11 },
      { cx: 24, cy: 9 },
      { cx: 32, cy: 11 },
      { cx: 37, cy: 15 },
      { cx: 39, cy: 21 },
      { cx: 36, cy: 27 },
      { cx: 30, cy: 31 },
      { cx: 18, cy: 31 },
    ].map((b, i) => (
      <circle key={i} cx={b.cx} cy={b.cy} r={i === 3 ? 2.8 : 2.2} fill="currentColor" />
    ))}

    {/* Centerpiece Medal Charm */}
    <circle cx="12" cy="27" r="3.2" fill="currentColor" />
    <circle cx="12" cy="27" r="2.2" fill="#FCFAF7" />
    <path d="M12 25.8V28.2M10.8 27H13.2" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />

    {/* Macramé Sliding Knot (Fecho Regulável) at bottom */}
    <rect x="21" y="31.5" width="6" height="3" rx="1.5" fill="currentColor" />
    {/* Two dangling adjustable cord tails */}
    <path d="M22.5 34.5C22 38 20 41 18 43" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <path d="M25.5 34.5C26 38 28 41 30 43" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <circle cx="18" cy="43.5" r="1.4" fill="currentColor" />
    <circle cx="30" cy="43.5" r="1.4" fill="currentColor" />

    {/* Mini Cross Charm */}
    <path d="M8 32V38M6 34H10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/** Dezena de Bolso / Carro em Crochê */
export const DezenaVectorIcon: React.FC<IconProps> = ({ className = 'text-[#9A7655]', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Top Car Clasp / Ring */}
    <circle cx="24" cy="8" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    <path d="M22 6L26 10" stroke="currentColor" strokeWidth="1" opacity="0.5" />

    {/* 10 Ave-Maria Beads */}
    {[
      { cx: 12, cy: 22 },
      { cx: 13, cy: 16 },
      { cx: 17, cy: 12 },
      { cx: 24, cy: 14 },
      { cx: 31, cy: 12 },
      { cx: 35, cy: 16 },
      { cx: 36, cy: 22 },
      { cx: 32, cy: 26 },
      { cx: 16, cy: 26 },
    ].map((b, i) => (
      <circle key={i} cx={b.cx} cy={b.cy} r="2.2" fill="currentColor" />
    ))}

    {/* Entremeio */}
    <circle cx="24" cy="28" r="3.6" fill="currentColor" />
    <circle cx="24" cy="28" r="2.4" fill="#FCFAF7" />
    <path d="M24 26.5V29.5M22.5 28H25.5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />

    {/* 1 Pai Nosso */}
    <circle cx="24" cy="34.5" r="2" fill="currentColor" />

    {/* Crucifixo */}
    <path
      d="M22.5 38.5H25.5V40.5H27.5V42.5H25.5V46.5H22.5V42.5H20.5V40.5H22.5V38.5Z"
      fill="currentColor"
    />
  </svg>
);

/** Phone Charm Devocional */
export const PhoneCharmVectorIcon: React.FC<IconProps> = ({ className = 'text-[#9A7655]', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Loop Cord */}
    <path d="M24 4C19 4 19 12 24 15C29 12 29 4 24 4Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="24" cy="15" r="2" fill="currentColor" />

    {/* Beaded String */}
    {[
      { y: 20, r: 2.2 },
      { y: 25, r: 1.8 },
      { y: 29, r: 2.4 },
      { y: 34, r: 2.0 },
    ].map((b, i) => (
      <circle key={i} cx="24" cy={b.y} r={b.r} fill="currentColor" />
    ))}

    {/* Star Charm */}
    <path
      d="M24 38L25.2 41L28.5 41.3L26 43.2L26.8 46.5L24 44.8L21.2 46.5L22 43.2L19.5 41.3L22.8 41L24 38Z"
      fill="currentColor"
    />
  </svg>
);

// -------------------------------------------------------------------
// 2. MODELOS DO CONFIGURADOR (MODEL SELECTOR)
// -------------------------------------------------------------------

export const TradicionalModelIcon: React.FC<IconProps> = ({ className = 'text-[#9A7655]', size = 28 }) => (
  <RosaryVectorIcon className={className} size={size} />
);

export const DelicadoModelIcon: React.FC<IconProps> = ({ className = 'text-[#9A7655]', size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="18" cy="13" rx="11" ry="8" stroke="currentColor" strokeWidth="1.1" strokeDasharray="1.5 2" opacity="0.6" />
    <circle cx="18" cy="21" r="2.2" fill="currentColor" />
    <line x1="18" y1="23" x2="18" y2="27" stroke="currentColor" strokeWidth="1.1" />
    <path d="M18 27V33M15 29H21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="18" cy="29" r="1.1" fill="#FFFFFF" />
  </svg>
);

export const PremiumModelIcon: React.FC<IconProps> = ({ className = 'text-[#9A7655]', size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Halo Rays */}
    {Array.from({ length: 8 }).map((_, i) => {
      const angle = (i * 45 * Math.PI) / 180;
      const x1 = 18 + 4 * Math.cos(angle);
      const y1 = 19 + 4 * Math.sin(angle);
      const x2 = 18 + 6.5 * Math.cos(angle);
      const y2 = 19 + 6.5 * Math.sin(angle);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.7" />;
    })}
    <ellipse cx="18" cy="11" rx="11" ry="7.5" stroke="currentColor" strokeWidth="1.3" strokeDasharray="1.5 2" />
    <circle cx="18" cy="19" r="3" fill="currentColor" />
    <path
      d="M16.5 25H19.5V27H21.5V29H19.5V33H16.5V29H14.5V27H16.5V25Z"
      fill="currentColor"
    />
  </svg>
);

export const NoivaModelIcon: React.FC<IconProps> = ({ className = 'text-[#9A7655]', size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M18 4C10 12 10 17 18 21C26 17 26 12 18 4Z" stroke="currentColor" strokeWidth="1.2" strokeDasharray="1.5 2" />
    <circle cx="18" cy="21" r="2.8" fill="currentColor" />
    <line x1="18" y1="24" x2="18" y2="33" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="14" y1="27" x2="22" y2="27" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="18" cy="27" r="1.2" fill="#FFFFFF" />
    <circle cx="18" cy="33" r="0.9" fill="#FFFFFF" />
    <circle cx="14" cy="27" r="0.9" fill="#FFFFFF" />
    <circle cx="22" cy="27" r="0.9" fill="#FFFFFF" />
  </svg>
);

export const InfantilModelIcon: React.FC<IconProps> = ({ className = 'text-[#D3A49B]', size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="18" cy="13" rx="10" ry="7.5" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2 2.5" />
    <circle cx="18" cy="21" r="3" fill="currentColor" opacity="0.85" />
    <rect x="16.5" y="24" width="3" height="9" rx="1.5" fill="currentColor" />
    <rect x="13.5" y="26" width="9" height="3" rx="1.5" fill="currentColor" />
  </svg>
);

// -------------------------------------------------------------------
// 3. ÍCONES ARTESANAIS & DEVOCIONAIS REFINADOS
// -------------------------------------------------------------------

/** Agulha e Fios Nobres de Crochê */
export const SpoolThreadIcon: React.FC<IconProps> = ({ className = 'text-[#9A7655]', size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Yarn Spool Outline */}
    <ellipse cx="16" cy="7" rx="9" ry="3.5" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.4" />
    <path d="M7 7V23C7 25 11 27 16 27C21 27 25 25 25 23V7" stroke="currentColor" strokeWidth="1.4" />
    {/* Woven Thread Textures */}
    <path d="M7 12C10 14 22 14 25 12" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    <path d="M7 17C10 19 22 19 25 17" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    <path d="M7 22C10 24 22 24 25 22" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    {/* Flowing Artisan Thread */}
    <path d="M25 21C28 22 30 26 27 29C24 32 20 29 18 30" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

/** Pomba da Paz & Espírito Santo (Fé e Devoção) */
export const SacredDoveIcon: React.FC<IconProps> = ({ className = 'text-[#9A7655]', size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M26 6C21 9 16 12 11 12C8 12 5 15 5 18.5C5 22.5 8.5 25 13.5 25C19.5 25 25 20 27.5 13.5C28 11 27.5 7.5 26 6Z"
      fill="currentColor"
      fillOpacity="0.15"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Wing Arc */}
    <path d="M15 13C16 8 20 5 24 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Olive Sprig */}
    <path d="M5.5 19C4 18 3 19 3 20.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="8" cy="18" r="0.9" fill="currentColor" />
  </svg>
);

/** Caixa Especial de Presente com Laço */
export const GiftBoxIcon: React.FC<IconProps> = ({ className = 'text-[#9A7655]', size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Gift Box Body */}
    <rect x="5" y="13" width="22" height="15" rx="3" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.5" />
    {/* Box Lid */}
    <rect x="3.5" y="9" width="25" height="4.5" rx="2" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.5" />
    {/* Ribbon Vertical */}
    <line x1="16" y1="9" x2="16" y2="28" stroke="currentColor" strokeWidth="1.5" />
    {/* Ribbon Bows */}
    <path d="M16 9C13 5 10 5 12 8C13.5 10 16 9 16 9Z" stroke="currentColor" strokeWidth="1.3" fill="currentColor" fillOpacity="0.3" />
    <path d="M16 9C19 5 22 5 20 8C18.5 10 16 9 16 9Z" stroke="currentColor" strokeWidth="1.3" fill="currentColor" fillOpacity="0.3" />
  </svg>
);

/** Mãos Artesanais / Feito à Mão */
export const HandmadeHandsIcon: React.FC<IconProps> = ({ className = 'text-[#9A7655]', size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M10 17L14 13C15 12 16.5 12 17.5 13C18.5 14 18.5 15.5 17.5 16.5L14 20M13 10C13 8.5 14.5 7.5 16 8.5L24 14.5C26 16 26.5 18.5 25 20.5L21 26C20 27.5 18 28 16.5 27L8 22C6.5 21 6 19 7 17.5L10 13"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Sparkle of blessing */}
    <path d="M22 6L23 8.5L25.5 9.5L23 10.5L22 13L21 10.5L18.5 9.5L21 8.5L22 6Z" fill="currentColor" />
  </svg>
);

/** Ícone de Cruz Latina com Glória */
export const CrossVectorIcon: React.FC<IconProps> = ({ className = 'text-[#9A7655]', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2V22M6 8H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="8" r="1" fill="#FFFFFF" />
  </svg>
);

/** Coração Devocional & Sagrado com Resplendor */
export const DevotionHeartIcon: React.FC<IconProps> = ({ className = 'text-[#9A7655]', size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Heart Outline */}
    <path
      d="M16 27.5L5.5 16.5C2.5 13.5 2.5 8.5 5.5 5.5C8.5 2.5 13.5 2.5 16 6.5C18.5 2.5 23.5 2.5 26.5 5.5C29.5 8.5 29.5 13.5 26.5 16.5L16 27.5Z"
      fill="currentColor"
      fillOpacity="0.15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Small Center Cross inside heart */}
    <path d="M16 11V18M13.5 13.5H18.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

/** Brilho / Sparkle Nobre */
export const SparkleVectorIcon: React.FC<IconProps> = ({ className = 'text-[#CA9F53]', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z"
      fill="currentColor"
    />
  </svg>
);

/** Selo / Escudo de Pagamento Seguro Pix */
export const PixShieldIcon: React.FC<IconProps> = ({ className = 'text-[#00B495]', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M12 2L4 5.5V11.5C4 16.5 7.5 21 12 22C16.5 21 20 16.5 20 11.5V5.5L12 2Z"
      fill="currentColor"
      fillOpacity="0.15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Checkmark or Pix diamond */}
    <path d="M9 12L11 14L15 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Balão de Mensagem / Atendimento Afetuoso */
export const ChatBubbleVectorIcon: React.FC<IconProps> = ({ className = 'text-[#9A7655]', size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M26 15C26 20.5 21.5 25 16 25C14 25 12 24.4 10.3 23.4L5 25L6.6 19.8C5.6 18.4 5 16.8 5 15C5 9.5 9.5 5 16 5C21.5 5 26 9.5 26 15Z"
      fill="currentColor"
      fillOpacity="0.15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="11.5" cy="15" r="1.2" fill="currentColor" />
    <circle cx="16" cy="15" r="1.2" fill="currentColor" />
    <circle cx="20.5" cy="15" r="1.2" fill="currentColor" />
  </svg>
);

/** WhatsApp Authentic Vector Icon */
export const WhatsAppVectorIcon: React.FC<IconProps> = ({ className = 'text-[#25D366]', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M20.52 3.48C18.26 1.22 15.24 0 12.04 0C5.46 0 0.1 5.36 0.1 11.94C0.1 14.04 0.65 16.08 1.69 17.89L0 24.08L6.34 22.42C8.08 23.37 10.04 23.88 12.04 23.88C18.62 23.88 23.98 18.52 23.98 11.94C23.98 8.74 22.78 5.74 20.52 3.48Z"
      fill="currentColor"
    />
    <path
      d="M17.84 14.39C17.52 14.23 15.96 13.46 15.67 13.35C15.38 13.25 15.17 13.2 14.96 13.51C14.75 13.82 14.15 14.53 13.97 14.73C13.79 14.94 13.61 14.96 13.29 14.81C12.98 14.65 11.97 14.32 10.77 13.25C9.84 12.42 9.21 11.39 9.03 11.08C8.85 10.77 9.01 10.6 9.17 10.45C9.31 10.31 9.48 10.09 9.64 9.91C9.8 9.73 9.85 9.6 9.95 9.39C10.06 9.19 10 9.01 9.92 8.85C9.85 8.7 9.22 7.15 8.96 6.53C8.71 5.92 8.45 6.01 8.26 6C8.08 6 7.87 6 7.66 6C7.45 6 7.11 6.08 6.83 6.39C6.54 6.7 5.73 7.47 5.73 9.03C5.73 10.59 6.86 12.1 7.02 12.31C7.18 12.52 9.25 15.7 12.42 17.07C13.18 17.4 13.76 17.59 14.22 17.74C14.98 17.98 15.67 17.95 16.22 17.86C16.83 17.77 18.1 17.09 18.36 16.35C18.62 15.61 18.62 14.99 18.54 14.86C18.46 14.73 18.25 14.65 17.84 14.39Z"
      fill="#FFFFFF"
    />
  </svg>
);

// -------------------------------------------------------------------
// 4. ÍCONES SACRAMENTAIS & OCASIÕES ESPECIAIS
// -------------------------------------------------------------------

/** Batismo (Concha Batismal, Água Benta e Cruz) */
export const BaptismVectorIcon: React.FC<IconProps> = ({ className = 'text-[#9A7655]', size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M14 4C8 4 4 9 4 14C4 19 8.5 24 14 24C19.5 24 24 19 24 14C24 9 20 4 14 4Z"
      fill="currentColor"
      fillOpacity="0.12"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <path d="M14 4V24M8 7C11 11 11 17 8 21M20 7C17 11 17 17 20 21" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    <circle cx="14" cy="14" r="1.5" fill="currentColor" />
  </svg>
);

/** Primeira Eucaristia (Hóstia Sagrada e Cálice) */
export const CommunionVectorIcon: React.FC<IconProps> = ({ className = 'text-[#9A7655]', size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Host */}
    <circle cx="14" cy="8" r="4.5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.3" />
    <path d="M14 6V10M12 8H16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    {/* Chalice */}
    <path
      d="M9 13H19C19 17.5 16.5 20 14 20C11.5 20 9 17.5 9 13Z"
      fill="currentColor"
      fillOpacity="0.2"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <path d="M14 20V24M10 24H18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

/** Crisma / Confirmação (Pomba e Chamas do Espírito Santo) */
export const CrismaVectorIcon: React.FC<IconProps> = ({ className = 'text-[#9A7655]', size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M22 6C18 8 14 11 10 11C7 11 5 13 5 16C5 19 8 21 12 21C17 21 21 17 23 12C23.5 10 23 7 22 6Z"
      fill="currentColor"
      fillOpacity="0.15"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Flame of the Holy Spirit */}
    <path d="M14 4C14 4 16 6 15 8C16.5 7 17 5 17 5C17 5 18 7.5 16.5 9C15 10.5 13 10.5 12 9C11 7.5 13 5 14 4Z" fill="currentColor" />
  </svg>
);

/** Matrimônio / Noivas (Alianças Entrelaçadas e Amor de Deus) */
export const WeddingVectorIcon: React.FC<IconProps> = ({ className = 'text-[#9A7655]', size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="11" cy="15" r="5.5" stroke="currentColor" strokeWidth="1.4" fill="currentColor" fillOpacity="0.1" />
    <circle cx="17" cy="15" r="5.5" stroke="currentColor" strokeWidth="1.4" fill="currentColor" fillOpacity="0.1" />
    <path d="M14 5V10M11.5 7.5H16.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/** Retiro & Oração (Bíblia Aberta e Luz) */
export const RetiroVectorIcon: React.FC<IconProps> = ({ className = 'text-[#9A7655]', size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M5 8C8.5 7 12 8.5 14 10C16 8.5 19.5 7 23 8V21C19.5 20 16 21.5 14 23C12 21.5 8.5 20 5 21V8Z"
      fill="currentColor"
      fillOpacity="0.12"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M14 10V23" stroke="currentColor" strokeWidth="1.4" />
    <path d="M14 4V6M11 5L12 6M17 5L16 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>
);
