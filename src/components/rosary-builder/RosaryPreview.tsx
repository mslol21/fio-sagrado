import React, { useMemo, useState } from 'react';
import type { RosaryConfiguration } from '../../types';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw, Sparkles, Crown, Feather } from 'lucide-react';

interface RosaryPreviewProps {
  configuration: RosaryConfiguration;
}

export const RosaryPreview: React.FC<RosaryPreviewProps> = ({ configuration }) => {
  const { model, bead, ourFather, centerpiece, crucifix, extras, customName, builderMode } = configuration;
  const [zoomLevel, setZoomLevel] = useState(1);

  const modelSlug = model?.slug || 'tradicional';
  const isPulseira = builderMode === 'pulseira' || model?.product_type === 'bracelet' || modelSlug.includes('pulseira');
  const isDezena = !isPulseira && modelSlug === 'dezena';
  const isNoiva = modelSlug.includes('noiva');
  const isPremium = modelSlug.includes('premium') || modelSlug.includes('sao-bento');
  const isDelicado = modelSlug.includes('delicado') || modelSlug.includes('delicada');
  const isInfantil = modelSlug.includes('infantil');

  // Compute colors & finishes
  const beadColor = bead?.color || '#F8F8F6';
  const ourFatherColor = ourFather?.color || (isNoiva ? '#FFFDF0' : beadColor);
  
  const getMetalFinish = (compColor?: string, compName?: string): { base: string; highlight: string; shadow: string; accent: string } => {
    const str = `${compColor || ''} ${compName || ''}`.toLowerCase();
    if (str.includes('prata') || str.includes('prateado') || str.includes('silver') || str.includes('#cf') || str.includes('#fff')) {
      return { base: '#C0C0C0', highlight: '#FFFFFF', shadow: '#707070', accent: '#E8E8E8' };
    }
    if (str.includes('ouro velho') || str.includes('envelhecido') || str.includes('vintage') || str.includes('#a68')) {
      return { base: '#A68A56', highlight: '#D1B880', shadow: '#5C4824', accent: '#8C7030' };
    }
    if (str.includes('madeira') || str.includes('#664') || str.includes('#8c6')) {
      return { base: '#7A4A28', highlight: '#A66B3E', shadow: '#4A2A12', accent: '#D4AF37' };
    }
    // Default Gold
    return { base: '#D4AF37', highlight: '#FFF0A0', shadow: '#8C701E', accent: '#FFE680' };
  };

  const centerpieceFinish = getMetalFinish(centerpiece?.color, centerpiece?.name);
  const crucifixFinish = getMetalFinish(crucifix?.color, crucifix?.name);

  // Model-specific bead sizing & geometry reacting to 6mm vs 8mm
  const beadIs6mm = (bead?.size || bead?.name || '').includes('6mm') || (bead?.size || bead?.name || '').includes('6 mm');
  const baseAveMariaRadius = isDelicado ? 4.2 : isPremium ? 6.2 : isNoiva ? 5.8 : isInfantil ? 5.4 : 5.4;
  const aveMariaRadius = beadIs6mm ? baseAveMariaRadius * 0.8 : baseAveMariaRadius;

  const ourFatherIs8mm = (ourFather?.size || ourFather?.name || '').includes('8mm') || (ourFather?.size || ourFather?.name || '').includes('8 mm');
  const baseOurFatherRadius = isDelicado ? 6.0 : isPremium ? 8.8 : isNoiva ? 8.0 : isInfantil ? 7.2 : 7.5;
  const ourFatherRadius = ourFatherIs8mm ? baseOurFatherRadius * 0.85 : baseOurFatherRadius;

  // Generate coordinates for loop beads according to model
  const loopBeads = useMemo(() => {
    const points: Array<{ x: number; y: number; type: 'ave_maria' | 'our_father'; decade: number; index: number }> = [];
    const centerX = 250;

    if (isPulseira) {
      // Pulseira de Terço: 10 Ave-Maria beads distributed symmetrically on the wrist loop
      const centerY = 240;
      const radiusX = 110;
      const radiusY = 100;
      
      // 5 beads on left arm (from 135° to 225°)
      for (let i = 0; i < 5; i++) {
        const progress = i / 4;
        const angle = Math.PI * 0.72 + progress * Math.PI * 0.52; // ~130° to 223°
        const x = centerX + radiusX * Math.cos(angle);
        const y = centerY + radiusY * Math.sin(angle);
        points.push({ x, y, type: 'ave_maria', decade: 1, index: i + 1 });
      }

      // 5 beads on right arm (from 45° to -45°)
      for (let i = 0; i < 5; i++) {
        const progress = i / 4;
        const angle = Math.PI * 0.28 - progress * Math.PI * 0.52; // ~50° to -43°
        const x = centerX + radiusX * Math.cos(angle);
        const y = centerY + radiusY * Math.sin(angle);
        points.push({ x, y, type: 'ave_maria', decade: 1, index: i + 6 });
      }

      return points;
    }

    if (isDezena) {
      // Single decade arc: 10 Ave-Maria beads in a gentle top horseshoe arc
      const centerY = 195;
      const radiusX = 115;
      const radiusY = 95;
      const totalBeads = 10;

      for (let b = 1; b <= totalBeads; b++) {
        // Map 1..10 across arc from 110 deg to 430 deg
        const progress = (b - 1) / (totalBeads - 1);
        const angle = Math.PI * 0.65 + progress * Math.PI * 1.70;
        const x = centerX + radiusX * Math.cos(angle);
        const y = centerY + radiusY * Math.sin(angle);
        points.push({ x, y, type: 'ave_maria', decade: 1, index: b });
      }
      return points;
    }

    // 5 Decades (Tradicional, Delicado, Premium, Noiva, Infantil)
    const centerY = isNoiva ? 185 : 195;
    const radiusX = isNoiva ? 140 : isPremium ? 152 : isDelicado ? 138 : isInfantil ? 136 : 145;
    const radiusY = isNoiva ? 145 : isPremium ? 130 : isDelicado ? 118 : isInfantil ? 118 : 125;

    let pointIndex = 0;

    for (let decade = 1; decade <= 5; decade++) {
      // 10 Ave-Maria beads per decade
      for (let b = 1; b <= 10; b++) {
        const progress = pointIndex / 54;
        const angle = Math.PI * 0.58 + progress * Math.PI * 1.84;
        const x = centerX + radiusX * Math.cos(angle);
        const y = centerY + radiusY * Math.sin(angle);

        points.push({ x, y, type: 'ave_maria', decade, index: b });
        pointIndex++;
      }

      // 1 Our Father bead between decades 1-4
      if (decade < 5) {
        const progress = pointIndex / 54;
        const angle = Math.PI * 0.58 + progress * Math.PI * 1.84;
        const x = centerX + radiusX * Math.cos(angle);
        const y = centerY + radiusY * Math.sin(angle);

        points.push({ x, y, type: 'our_father', decade, index: 1 });
        pointIndex++;
      }
    }

    return points;
  }, [isPulseira, isDezena, isNoiva, isPremium, isDelicado, isInfantil]);

  // Drop pendant coordinates below centerpiece
  const dropBeads = useMemo(() => {
    if (isPulseira) {
      // Pulseira has a delicate mini charm or single accent bead under the centerpiece
      return [
        { x: 250, y: 165, type: 'our_father' as const, label: 'Conta de Destaque' }
      ];
    }

    if (isDezena) {
      // Dezena has only 1 Our-Father on the drop
      return [
        { x: 250, y: 345, type: 'our_father' as const, label: 'Pai-Nosso' }
      ];
    }

    // Standard 5-decade drop: 1 Our Father, 3 Ave-Marias, 1 Our Father
    const startY = isNoiva ? 362 : 360;
    const spacing = isDelicado ? 18 : isNoiva ? 23 : 20;

    return [
      { x: 250, y: startY, type: 'our_father' as const, label: 'Pai-Nosso 1' },
      { x: 250, y: startY + spacing * 1.3, type: 'ave_maria' as const, label: 'Ave-Maria 1' },
      { x: 250, y: startY + spacing * 2.2, type: 'ave_maria' as const, label: 'Ave-Maria 2' },
      { x: 250, y: startY + spacing * 3.1, type: 'ave_maria' as const, label: 'Ave-Maria 3' },
      { x: 250, y: startY + spacing * 4.4, type: 'our_father' as const, label: 'Pai-Nosso 2' },
    ];
  }, [isPulseira, isDezena, isNoiva, isDelicado]);

  // Centerpiece Y position
  const centerpieceY = isPulseira ? 140 : isDezena ? 285 : 325;
  // Crucifix Y position
  const crucifixY = isPulseira ? 205 : isDezena ? 420 : isNoiva ? 515 : 495;

  return (
    <div className="relative w-full h-full min-h-[460px] md:min-h-[620px] flex flex-col items-center justify-center bg-gradient-to-b from-cream-light via-white to-amber-50/40 rounded-3xl border border-gold/20 shadow-premium p-4 select-none overflow-hidden group">
      
      {/* Floating Badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-col sm:flex-row gap-2 pointer-events-none">
        <span className="bg-navy/90 backdrop-blur-xs text-gold border border-gold/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1.5">
          <Sparkles size={12} className="text-gold" />
          {model?.name || (isPulseira ? 'Pulseira de Terço' : 'Terço Personalizado')}
        </span>
        {isPulseira && (
          <span className="bg-emerald-100/90 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-full text-[10px] font-bold shadow-xs flex items-center gap-1">
            ✨ Fecho Regulável em Macramê
          </span>
        )}
        {isDezena && (
          <span className="bg-amber-100/90 text-amber-900 border border-amber-300 px-3 py-1 rounded-full text-[10px] font-bold shadow-xs">
            1 Dezena (10 Contas)
          </span>
        )}
        {isNoiva && (
          <span className="bg-rose-50/90 text-rose-900 border border-rose-200 px-3 py-1 rounded-full text-[10px] font-bold shadow-xs flex items-center gap-1.5">
            <Sparkles size={11} className="text-rose-600" /> Nupcial & Zircônias
          </span>
        )}
        {isPremium && (
          <span className="bg-[#CA9F53]/15 text-[#9A7655] border border-[#CA9F53]/30 px-3 py-1 rounded-full text-[10px] font-bold shadow-xs flex items-center gap-1.5">
            <Crown size={11} className="text-[#CA9F53]" /> Com Tulipas & Resplendor
          </span>
        )}
        {isDelicado && (
          <span className="bg-slate-100/90 text-slate-800 border border-slate-300 px-3 py-1 rounded-full text-[10px] font-bold shadow-xs flex items-center gap-1.5">
            <Feather size={11} className="text-slate-600" /> Contas Finas 6mm
          </span>
        )}
        {customName && (
          <span className="bg-white/90 backdrop-blur-xs text-navy border border-gold/30 px-3 py-1 rounded-full text-[10px] font-bold shadow-sm">
            Nome: {customName}
          </span>
        )}
      </div>

      {/* Zoom / Reset Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-gold/20 rounded-full p-1 shadow-sm">
        <button
          type="button"
          onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.15))}
          className="p-1.5 hover:bg-navy/5 text-navy/60 hover:text-navy rounded-full transition-colors cursor-pointer"
          title="Aproximar"
          aria-label="Aproximar visualização"
        >
          <ZoomIn size={16} />
        </button>
        <button
          type="button"
          onClick={() => setZoomLevel(prev => Math.max(0.8, prev - 0.15))}
          className="p-1.5 hover:bg-navy/5 text-navy/60 hover:text-navy rounded-full transition-colors cursor-pointer"
          title="Afastar"
          aria-label="Afastar visualização"
        >
          <ZoomOut size={16} />
        </button>
        <button
          type="button"
          onClick={() => setZoomLevel(1)}
          className="p-1.5 hover:bg-navy/5 text-navy/60 hover:text-navy rounded-full transition-colors cursor-pointer"
          title="Restaurar tamanho"
          aria-label="Restaurar tamanho padrão"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Reactive 2D SVG Rosary Canvas */}
      <motion.div
        animate={{ scale: zoomLevel }}
        transition={{ type: 'spring', stiffness: 260, damping: 25 }}
        className="w-full max-w-[480px] aspect-[5/6] flex items-center justify-center relative cursor-grab active:cursor-grabbing"
      >
        <svg
          viewBox="0 0 500 580"
          className="w-full h-full filter drop-shadow-md overflow-visible"
        >
          <defs>
            {/* Shaders & Filters */}
            <filter id="bead-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#0A1128" floodOpacity="0.25" />
            </filter>
            <filter id="metal-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="1.5" dy="3" stdDeviation="2.5" floodColor="#0A1128" floodOpacity="0.35" />
            </filter>
            <filter id="glow-filter" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Ave-Maria Bead Radial Gradient */}
            <radialGradient id="bead-grad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity={isNoiva ? 0.95 : 0.9} />
              <stop offset="45%" stopColor={beadColor} />
              <stop offset="90%" stopColor={beadColor} stopOpacity="0.95" />
              <stop offset="100%" stopColor="#2A2A2A" stopOpacity="0.35" />
            </radialGradient>

            {/* Our Father Bead Radial Gradient */}
            <radialGradient id="of-bead-grad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="40%" stopColor={ourFatherColor} />
              <stop offset="85%" stopColor={ourFatherColor} />
              <stop offset="100%" stopColor="#1A1A1A" stopOpacity="0.45" />
            </radialGradient>

            {/* Centerpiece Metallic Linear Gradient */}
            <linearGradient id="centerpiece-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={centerpieceFinish.highlight} />
              <stop offset="45%" stopColor={centerpieceFinish.base} />
              <stop offset="100%" stopColor={centerpieceFinish.shadow} />
            </linearGradient>

            {/* Crucifix Metallic Linear Gradient */}
            <linearGradient id="crucifix-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={crucifixFinish.highlight} />
              <stop offset="35%" stopColor={crucifixFinish.base} />
              <stop offset="100%" stopColor={crucifixFinish.shadow} />
            </linearGradient>

            {/* Cord / Chain Gradient */}
            <linearGradient id="cord-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E2DBD0" />
              <stop offset="50%" stopColor={centerpieceFinish.base} />
              <stop offset="100%" stopColor={centerpieceFinish.shadow} />
            </linearGradient>

            {/* Tulipas (Bead Caps) Gradient for Premium */}
            <linearGradient id="tulip-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF8D6" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#8C701E" />
            </linearGradient>
          </defs>

          {/* ============================================================ */}
          {/* BACKGROUND CORD / CHAIN LINES */}
          {/* ============================================================ */}

          {isPulseira ? (
            // Pulseira de Terço: Wrist loop + Sliding Macramê knot + Dangling cords
            <>
              {/* Main Wrist Loop Cords (Left & Right curves) */}
              <path
                d="M 238 140 C 120 150 125 330 240 345"
                fill="none"
                stroke="url(#cord-grad)"
                strokeWidth={isDelicado ? "2.2" : "3.0"}
                strokeLinecap="round"
                opacity="0.85"
              />
              <path
                d="M 262 140 C 380 150 375 330 260 345"
                fill="none"
                stroke="url(#cord-grad)"
                strokeWidth={isDelicado ? "2.2" : "3.0"}
                strokeLinecap="round"
                opacity="0.85"
              />

              {/* Mini Charm Jump Ring / Drop Cord under Centerpiece */}
              <line
                x1="250"
                y1="152"
                x2="250"
                y2={crucifixY - 14}
                stroke="url(#cord-grad)"
                strokeWidth="1.8"
                strokeLinecap="round"
                opacity="0.9"
              />
              <circle cx="250" cy="158" r="2.5" fill="none" stroke={centerpieceFinish.base} strokeWidth="1.2" />

              {/* ============================================================ */}
              {/* SLIDING MACRAMÊ CLASP (FECHO REGULÁVEL DESLIZANTE) */}
              {/* ============================================================ */}
              <g filter="url(#metal-shadow)">
                {/* Woven Macramê Sliding Knot Cylinder */}
                <rect
                  x="237"
                  y="338"
                  width="26"
                  height="14"
                  rx="4"
                  fill="url(#centerpiece-grad)"
                  stroke={centerpieceFinish.highlight}
                  strokeWidth="1.2"
                />
                {/* Texture Weave lines on Knot */}
                <line x1="243" y1="340" x2="243" y2="350" stroke={centerpieceFinish.shadow} strokeWidth="1" strokeDasharray="1.5 1.5" />
                <line x1="248" y1="340" x2="248" y2="350" stroke={centerpieceFinish.shadow} strokeWidth="1" strokeDasharray="1.5 1.5" />
                <line x1="253" y1="340" x2="253" y2="350" stroke={centerpieceFinish.shadow} strokeWidth="1" strokeDasharray="1.5 1.5" />
                <line x1="258" y1="340" x2="258" y2="350" stroke={centerpieceFinish.shadow} strokeWidth="1" strokeDasharray="1.5 1.5" />

                {/* Left Dangling Adjustable Cord */}
                <path
                  d="M 242 352 Q 230 385 218 430"
                  fill="none"
                  stroke="url(#cord-grad)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                {/* Left Terminal Bead */}
                <circle cx="218" cy="430" r="4.2" fill="url(#bead-grad)" stroke={centerpieceFinish.base} strokeWidth="0.8" filter="url(#bead-shadow)" />
                <circle cx="216.5" cy="428.5" r="1.2" fill="#FFFFFF" opacity="0.8" />

                {/* Right Dangling Adjustable Cord */}
                <path
                  d="M 258 352 Q 270 385 282 430"
                  fill="none"
                  stroke="url(#cord-grad)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                {/* Right Terminal Bead */}
                <circle cx="282" cy="430" r="4.2" fill="url(#bead-grad)" stroke={centerpieceFinish.base} strokeWidth="0.8" filter="url(#bead-shadow)" />
                <circle cx="280.5" cy="428.5" r="1.2" fill="#FFFFFF" opacity="0.8" />

                {/* Label text under clasp */}
                <text x="250" y="367" textAnchor="middle" fontSize="7.5" fill="#4D4038" opacity="0.6" fontWeight="bold">
                  Fecho Regulável
                </text>
              </g>
            </>
          ) : isDezena ? (
            // Dezena Loop & Top Clasp
            <>
              {/* Top Ring / Clasp for Car mirror / key ring */}
              <circle cx="250" cy="100" r="8" fill="none" stroke="url(#cord-grad)" strokeWidth="2.5" />
              <path d="M 245 92 L 255 108" stroke={centerpieceFinish.highlight} strokeWidth="1.5" />
              <line x1="250" y1="108" x2="250" y2="135" stroke="url(#cord-grad)" strokeWidth="2" />
              
              {/* Semicircle Arc of Beads */}
              <path
                d="M 235 285 C 120 250 120 135 250 135 C 380 135 380 250 265 285"
                fill="none"
                stroke="url(#cord-grad)"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.7"
              />
              {/* Drop Cord Path */}
              <line
                x1="250"
                y1={centerpieceY}
                x2="250"
                y2={crucifixY - 20}
                stroke="url(#cord-grad)"
                strokeWidth={isDelicado ? "1.4" : "2.2"}
                strokeLinecap="round"
                opacity="0.85"
              />
            </>
          ) : (
            // 5-Decade Main Loop
            <>
              <path
                d={isNoiva 
                  ? "M 235 320 C 80 290 90 90 250 65 C 410 90 420 290 265 320" 
                  : "M 235 320 C 95 290 85 110 250 80 C 415 110 405 290 265 320"
                }
                fill="none"
                stroke="url(#cord-grad)"
                strokeWidth={isDelicado ? "1.2" : isPremium ? "2.5" : "2.0"}
                strokeDasharray={isDelicado ? "2 2" : "none"}
                strokeLinecap="round"
                opacity="0.75"
              />
              {/* Drop Cord Path */}
              <line
                x1="250"
                y1={centerpieceY}
                x2="250"
                y2={crucifixY - 20}
                stroke="url(#cord-grad)"
                strokeWidth={isDelicado ? "1.4" : "2.2"}
                strokeLinecap="round"
                opacity="0.85"
              />
            </>
          )}

          {/* ============================================================ */}
          {/* LOOP BEADS (AVE-MARIAS & OUR-FATHERS) */}
          {/* ============================================================ */}
          {loopBeads.map((pt, i) => {
            const isOurFather = pt.type === 'our_father';
            const radius = isOurFather ? ourFatherRadius : aveMariaRadius;

            return (
              <g key={`loop-${i}`} className="transition-all duration-300">
                {/* Premium Model: Tulipas / Metal Bead Caps on Our Father beads */}
                {isOurFather && isPremium && (
                  <g>
                    {/* Top Tulip Cap */}
                    <path
                      d={`M ${pt.x - radius * 0.9} ${pt.y - radius * 0.4} Q ${pt.x} ${pt.y - radius * 1.3} ${pt.x + radius * 0.9} ${pt.y - radius * 0.4} Q ${pt.x} ${pt.y - radius * 0.8} ${pt.x - radius * 0.9} ${pt.y - radius * 0.4}`}
                      fill="url(#tulip-grad)"
                      stroke={centerpieceFinish.highlight}
                      strokeWidth="0.5"
                      filter="url(#bead-shadow)"
                    />
                    {/* Bottom Tulip Cap */}
                    <path
                      d={`M ${pt.x - radius * 0.9} ${pt.y + radius * 0.4} Q ${pt.x} ${pt.y + radius * 1.3} ${pt.x + radius * 0.9} ${pt.y + radius * 0.4} Q ${pt.x} ${pt.y + radius * 0.8} ${pt.x - radius * 0.9} ${pt.y + radius * 0.4}`}
                      fill="url(#tulip-grad)"
                      stroke={centerpieceFinish.highlight}
                      strokeWidth="0.5"
                      filter="url(#bead-shadow)"
                    />
                  </g>
                )}

                {/* Noiva Model: Shimmering crystal halo on Our-Father beads */}
                {isOurFather && isNoiva && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={radius + 3}
                    fill="none"
                    stroke="#FFEAA7"
                    strokeWidth="0.8"
                    strokeDasharray="1.5 2"
                    opacity="0.8"
                  />
                )}

                {/* Main Bead Sphere */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={radius}
                  fill={isOurFather ? 'url(#of-bead-grad)' : 'url(#bead-grad)'}
                  stroke={isOurFather ? centerpieceFinish.base : '#E2DBD0'}
                  strokeWidth={isOurFather ? 1.2 : 0.6}
                  filter="url(#bead-shadow)"
                />

                {/* Specular Highlight dot */}
                <circle
                  cx={pt.x - radius * 0.35}
                  cy={pt.y - radius * 0.35}
                  r={radius * 0.28}
                  fill="#FFFFFF"
                  opacity={isNoiva ? 0.9 : 0.75}
                />
              </g>
            );
          })}

          {/* ============================================================ */}
          {/* DROP PENDANT BEADS */}
          {/* ============================================================ */}
          {dropBeads.map((pt, i) => {
            const isOurFather = pt.type === 'our_father';
            const radius = isOurFather ? ourFatherRadius : aveMariaRadius;

            return (
              <g key={`drop-${i}`} className="transition-all duration-300">
                {/* Premium Model: Tulipas on Drop Our-Father beads */}
                {isOurFather && isPremium && (
                  <g>
                    <path
                      d={`M ${pt.x - radius * 0.9} ${pt.y - radius * 0.4} Q ${pt.x} ${pt.y - radius * 1.3} ${pt.x + radius * 0.9} ${pt.y - radius * 0.4} Q ${pt.x} ${pt.y - radius * 0.8} ${pt.x - radius * 0.9} ${pt.y - radius * 0.4}`}
                      fill="url(#tulip-grad)"
                      stroke={centerpieceFinish.highlight}
                      strokeWidth="0.5"
                    />
                    <path
                      d={`M ${pt.x - radius * 0.9} ${pt.y + radius * 0.4} Q ${pt.x} ${pt.y + radius * 1.3} ${pt.x + radius * 0.9} ${pt.y + radius * 0.4} Q ${pt.x} ${pt.y + radius * 0.8} ${pt.x - radius * 0.9} ${pt.y + radius * 0.4}`}
                      fill="url(#tulip-grad)"
                      stroke={centerpieceFinish.highlight}
                      strokeWidth="0.5"
                    />
                  </g>
                )}

                {/* Noiva Model: Shimmering crystal halo */}
                {isOurFather && isNoiva && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={radius + 3}
                    fill="none"
                    stroke="#FFEAA7"
                    strokeWidth="0.8"
                    strokeDasharray="1.5 2"
                    opacity="0.8"
                  />
                )}

                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={radius}
                  fill={isOurFather ? 'url(#of-bead-grad)' : 'url(#bead-grad)'}
                  stroke={isOurFather ? centerpieceFinish.base : '#E2DBD0'}
                  strokeWidth={isOurFather ? 1.2 : 0.6}
                  filter="url(#bead-shadow)"
                />
                <circle
                  cx={pt.x - radius * 0.35}
                  cy={pt.y - radius * 0.35}
                  r={radius * 0.28}
                  fill="#FFFFFF"
                  opacity={isNoiva ? 0.9 : 0.75}
                />
              </g>
            );
          })}

          {/* ============================================================ */}
          {/* CENTERPIECE MEDAL (ENTREMEIO) */}
          {/* ============================================================ */}
          
          {/* Premium Model: Sunburst Resplendor Aureole behind centerpiece */}
          {isPremium && (
            <g opacity="0.85" filter="url(#glow-filter)">
              {Array.from({ length: 16 }).map((_, rIdx) => {
                const rayAngle = (rIdx * 360) / 16;
                const rad = (rayAngle * Math.PI) / 180;
                const x1 = 250 + 17 * Math.cos(rad);
                const y1 = centerpieceY + 17 * Math.sin(rad);
                const x2 = 250 + (rIdx % 2 === 0 ? 27 : 23) * Math.cos(rad);
                const y2 = centerpieceY + (rIdx % 2 === 0 ? 27 : 23) * Math.sin(rad);
                return (
                  <line
                    key={`ray-${rIdx}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={centerpieceFinish.highlight}
                    strokeWidth={rIdx % 2 === 0 ? 1.8 : 1.0}
                    strokeLinecap="round"
                  />
                );
              })}
            </g>
          )}

          {/* Noiva Model: Pavé Crystal Zircônias ring around centerpiece */}
          {isNoiva && (
            <g>
              <circle cx="250" cy={centerpieceY} r="20" fill="none" stroke={centerpieceFinish.highlight} strokeWidth="1" opacity="0.6" />
              {Array.from({ length: 12 }).map((_, zIdx) => {
                const zAngle = (zIdx * 360) / 12;
                const zRad = (zAngle * Math.PI) / 180;
                const zx = 250 + 20 * Math.cos(zRad);
                const zy = centerpieceY + 20 * Math.sin(zRad);
                return (
                  <circle
                    key={`zircon-${zIdx}`}
                    cx={zx}
                    cy={zy}
                    r="1.8"
                    fill="#FFFFFF"
                    stroke={centerpieceFinish.base}
                    strokeWidth="0.5"
                    filter="url(#bead-shadow)"
                  />
                );
              })}
            </g>
          )}

          {/* Centerpiece Main Disc */}
          <g filter="url(#metal-shadow)" className="transition-transform duration-500 hover:scale-105 origin-[250px_325px]">
            {/* Outer Ring */}
            <circle
              cx="250"
              cy={centerpieceY}
              r={isDelicado ? 13 : isPremium ? 17 : 15}
              fill="url(#centerpiece-grad)"
              stroke={centerpieceFinish.highlight}
              strokeWidth="1.5"
            />
            {/* Inner Border */}
            <circle
              cx="250"
              cy={centerpieceY}
              r={isDelicado ? 10.5 : isPremium ? 14 : 12}
              fill="none"
              stroke={centerpieceFinish.shadow}
              strokeWidth="0.8"
              strokeDasharray="1 2"
            />
            
            {/* Centerpiece Icon/Saint Content */}
            {centerpiece?.image ? (
              <>
                <clipPath id="centerpiece-clip">
                  <circle cx="250" cy={centerpieceY} r={isDelicado ? 10 : 12} />
                </clipPath>
                <image
                  href={centerpiece.image}
                  x={isDelicado ? 240 : 238}
                  y={centerpieceY - (isDelicado ? 10 : 12)}
                  width={isDelicado ? 20 : 24}
                  height={isDelicado ? 20 : 24}
                  clipPath="url(#centerpiece-clip)"
                  preserveAspectRatio="xMidYMid slice"
                />
              </>
            ) : (
              // Saint / Devotional Emblem
              <g>
                <path
                  d={`M 250 ${centerpieceY - 7} L 250 ${centerpieceY + 7} M 244 ${centerpieceY - 2} L 256 ${centerpieceY - 2}`}
                  stroke="#FFFFFF"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  opacity="0.9"
                />
                {/* Subtle halo */}
                <circle cx="250" cy={centerpieceY - 3} r="4" fill="none" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.6" />
              </g>
            )}

            {/* Connection loops */}
            <circle cx="237" cy={centerpieceY - 9} r="2.2" fill="none" stroke={centerpieceFinish.base} strokeWidth="1" />
            <circle cx="263" cy={centerpieceY - 9} r="2.2" fill="none" stroke={centerpieceFinish.base} strokeWidth="1" />
            <circle cx="250" cy={centerpieceY + 14} r="2.2" fill="none" stroke={centerpieceFinish.base} strokeWidth="1" />
          </g>

          {/* Extra Medals attached to Centerpiece (if selected) */}
          {extras.some(e => e.component_type === 'medal') && (
            <g filter="url(#metal-shadow)">
              <line x1="263" y1={centerpieceY + 3} x2="277" y2={centerpieceY + 15} stroke="url(#cord-grad)" strokeWidth="1.2" />
              <circle cx="280" cy={centerpieceY + 18} r="9" fill="url(#centerpiece-grad)" stroke={centerpieceFinish.highlight} strokeWidth="1" />
              <text x="280" y={centerpieceY + 21} textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">✝</text>
            </g>
          )}

          {/* ============================================================ */}
          {/* CRUCIFIX (AT BOTTOM) */}
          {/* ============================================================ */}
          <g filter="url(#metal-shadow)" className="transition-transform duration-500 hover:scale-105 origin-[250px_500px]">
            
            {/* 1. DELICADO MODEL: Slim cross with sparkling zircon crystal in center */}
            {isDelicado ? (
              <g>
                <line x1="250" y1={crucifixY - 22} x2="250" y2={crucifixY + 26} stroke="url(#crucifix-grad)" strokeWidth="3.2" strokeLinecap="round" />
                <line x1="237" y1={crucifixY - 8} x2="263" y2={crucifixY - 8} stroke="url(#crucifix-grad)" strokeWidth="3.2" strokeLinecap="round" />
                {/* Central Ponto de Luz (Crystal Gem) */}
                <circle cx="250" cy={crucifixY - 8} r="3.2" fill="#FFFFFF" stroke={crucifixFinish.base} strokeWidth="0.8" />
                <polygon points={`250,${crucifixY - 12} 251.5,${crucifixY - 8} 255.5,${crucifixY - 8} 252,${crucifixY - 5.5} 253.5,${crucifixY - 1.5} 250,${crucifixY - 4} 246.5,${crucifixY - 1.5} 248,${crucifixY - 5.5} 244.5,${crucifixY - 8} 248.5,${crucifixY - 8}`} fill="#FFFFFF" opacity="0.9" />
              </g>
            ) : isInfantil ? (
              // 2. INFANTIL MODEL: Rounded gentle cross without sharp points
              <g>
                <rect x="244" y={crucifixY - 24} width="12" height="52" rx="6" fill="url(#crucifix-grad)" stroke={crucifixFinish.highlight} strokeWidth="1" />
                <rect x="232" y={crucifixY - 12} width="36" height="12" rx="6" fill="url(#crucifix-grad)" stroke={crucifixFinish.highlight} strokeWidth="1" />
                {/* Cute heart or dove emblem in center */}
                <circle cx="250" cy={crucifixY - 6} r="4.5" fill="#FFFFFF" opacity="0.9" />
                <path d={`M 250 ${crucifixY - 8} L 250 ${crucifixY - 4} M 248 ${crucifixY - 6} L 252 ${crucifixY - 6}`} stroke={crucifixFinish.base} strokeWidth="1.2" strokeLinecap="round" />
              </g>
            ) : isNoiva ? (
              // 3. NOIVA MODEL: Ornate pavé-encrusted bridal cross with crystal flares
              <g>
                <path
                  d={`M 243 ${crucifixY - 26} H 257 V ${crucifixY - 12} H 272 V ${crucifixY} H 257 V ${crucifixY + 34} H 243 V ${crucifixY} H 228 V ${crucifixY - 12} H 243 Z`}
                  fill="url(#crucifix-grad)"
                  stroke={crucifixFinish.highlight}
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                {/* 5 Pavé stones on tips & intersection */}
                {[
                  { cx: 250, cy: crucifixY - 6 }, // Center
                  { cx: 250, cy: crucifixY - 20 }, // Top
                  { cx: 250, cy: crucifixY + 26 }, // Bottom
                  { cx: 234, cy: crucifixY - 6 }, // Left
                  { cx: 266, cy: crucifixY - 6 }, // Right
                ].map((st, sIdx) => (
                  <circle key={`stone-${sIdx}`} cx={st.cx} cy={st.cy} r="2.4" fill="#FFFFFF" stroke={crucifixFinish.base} strokeWidth="0.6" />
                ))}
                {/* Center Star Flare */}
                <path d={`M 250 ${crucifixY - 10} L 250 ${crucifixY - 2} M 246 ${crucifixY - 6} L 254 ${crucifixY - 6}`} stroke="#FFFFFF" strokeWidth="1.2" />
              </g>
            ) : isPremium ? (
              // 4. PREMIUM / BARROCO MODEL: Fleur-de-lis ornate tips & high relief
              <g>
                <path
                  d={`M 242 ${crucifixY - 28} Q 250 ${crucifixY - 33} 258 ${crucifixY - 28} V ${crucifixY - 14} Q 275 ${crucifixY - 14} 275 ${crucifixY - 6} Q 275 ${crucifixY + 2} 258 ${crucifixY + 2} V ${crucifixY + 32} Q 250 ${crucifixY + 37} 242 ${crucifixY + 32} V ${crucifixY + 2} Q 225 ${crucifixY + 2} 225 ${crucifixY - 6} Q 225 ${crucifixY - 14} 242 ${crucifixY - 14} Z`}
                  fill="url(#crucifix-grad)"
                  stroke={crucifixFinish.highlight}
                  strokeWidth="1.4"
                />
                {/* Corpus Christi Relief */}
                <path
                  d={`M 250 ${crucifixY - 14} L 250 ${crucifixY + 16} M 241 ${crucifixY - 8} L 259 ${crucifixY - 8}`}
                  stroke="#FFFFFF"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  opacity="0.9"
                />
                {/* INRI Scroll */}
                <rect x="246" y={crucifixY - 25} width="8" height="4" rx="1" fill={crucifixFinish.highlight} opacity="0.9" />
              </g>
            ) : (
              // 5. TRADICIONAL / STANDARD MODEL
              <g>
                <path
                  d={`M 243 ${crucifixY - 24} H 257 V ${crucifixY - 11} H 272 V ${crucifixY + 1} H 257 V ${crucifixY + 34} H 243 V ${crucifixY + 1} H 228 V ${crucifixY - 11} H 243 Z`}
                  fill="url(#crucifix-grad)"
                  stroke={crucifixFinish.highlight}
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                {/* Inner Border */}
                <path
                  d={`M 245 ${crucifixY - 21} H 255 V ${crucifixY - 9} H 269 V ${crucifixY - 1} H 255 V ${crucifixY + 31} H 245 V ${crucifixY - 1} H 231 V ${crucifixY - 9} H 245 Z`}
                  fill="none"
                  stroke={crucifixFinish.shadow}
                  strokeWidth="0.8"
                />
                {/* Corpus Christi Silhouette */}
                <path
                  d={`M 250 ${crucifixY - 12} L 250 ${crucifixY + 14} M 242 ${crucifixY - 6} L 258 ${crucifixY - 6}`}
                  stroke="#FFFFFF"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                {/* INRI Banner */}
                <rect x="246" y={crucifixY - 22} width="8" height="4" rx="1" fill={crucifixFinish.highlight} opacity="0.9" />
              </g>
            )}

            {/* Top connection loop */}
            <circle cx="250" cy={crucifixY - (isPremium ? 29 : 25)} r="2.8" fill="none" stroke={crucifixFinish.base} strokeWidth="1.2" />
          </g>

          {/* Devotional Halo Circles */}
          <circle cx="250" cy={centerpieceY} r="34" fill="none" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="2 6" opacity="0.35" />
        </svg>
      </motion.div>

      {/* Helper caption */}
      <div className="text-center pt-2">
        <p className="text-[11px] text-navy/50 font-medium">
          {isPulseira
            ? 'Visualização de Pulseira de Terço artesanal com fecho regulável em macramê, 10 contas e medalha de proteção'
            : isDezena 
            ? 'Visualização de Dezena Compacta (10 contas + pingente)' 
            : isNoiva 
            ? 'Visualização de Terço Nupcial com halo de zircônias e crucifixo cravejado'
            : isPremium
            ? 'Visualização Premium com tulipas metálicas nos Pai-Nossos e resplendor'
            : isDelicado
            ? 'Visualização Delicada com contas finas 6mm e ponto de luz'
            : isInfantil
            ? 'Visualização Infantil com acabamento suave e seguro'
            : 'Visualização Tradicional com 5 dezenas completas em escala'}
        </p>
      </div>
    </div>
  );
};
