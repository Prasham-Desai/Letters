'use client';
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAnimation } from '@/contexts/AnimationContext';

interface Props {
  count: number;
  onDrop: () => void;
}

export default function Mailbox({ count, onDrop }: Props) {
  const [wobbling, setWobbling] = useState(false);
  const { mailboxRef, isMailboxOpening } = useAnimation();
  
  const handleClick = useCallback(() => {
    if (wobbling || count === 0) return;
    setWobbling(true);
    setTimeout(() => setWobbling(false), 350);
    onDrop();
  }, [wobbling, count, onDrop]);

  const isEmpty = count === 0;

  return (
    <div
      ref={mailboxRef}
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      title={isEmpty ? 'No more letters' : `${count} letter${count !== 1 ? 's' : ''} waiting`}
    >
      <motion.div
        animate={wobbling ? {
          y: [0, -3, 1, 0],
          rotate: [0, -1, 0.5, 0],
          transition: { duration: 0.35, ease: 'easeOut' },
        } : {}}
        onClick={handleClick}
        style={{ cursor: isEmpty ? 'default' : 'pointer', position: 'relative' }}
        whileHover={!isEmpty ? { scale: 1.04, y: -3 } : {}}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <svg width="80" height="100" viewBox="0 0 80 100" fill="none" aria-label="Mailbox">
          <defs>
            {/* Wood grain filter */}
            <filter id="mailbox-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.3 0.02" numOctaves="4" result="noise"/>
              <feColorMatrix type="saturate" values="0" in="noise" result="bw"/>
              <feBlend mode="multiply" in="SourceGraphic" in2="bw"/>
            </filter>
            {/* Metallic gradient for hardware */}
            <linearGradient id="brass-knob" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e8cc78"/>
              <stop offset="40%" stopColor="#c4a050"/>
              <stop offset="100%" stopColor="#8a7030"/>
            </linearGradient>
            <linearGradient id="brass-plate" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d4b868"/>
              <stop offset="50%" stopColor="#b89838"/>
              <stop offset="100%" stopColor="#9a7828"/>
            </linearGradient>
            {/* Wood body gradient */}
            <linearGradient id="mailbox-wood" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#c47c54"/>
              <stop offset="30%" stopColor="#b06838"/>
              <stop offset="70%" stopColor="#9a5828"/>
              <stop offset="100%" stopColor="#884e22"/>
            </linearGradient>
            {/* Interior shadow */}
            <radialGradient id="mailbox-interior" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#2a1408"/>
              <stop offset="100%" stopColor="#1a0c04"/>
            </radialGradient>
          </defs>

          {/* Post — turned wood with grain */}
          <rect x="34" y="70" width="12" height="30" rx="2" fill="#7a5828"/>
          <rect x="35" y="70" width="3" height="30" fill="rgba(255,200,100,0.06)"/>
          <rect x="34" y="72" width="12" height="2" rx="1" fill="rgba(0,0,0,0.08)"/>
          <rect x="34" y="78" width="12" height="1" rx="0.5" fill="rgba(0,0,0,0.05)"/>

          {/* Ground contact shadow */}
          <ellipse cx="40" cy="99" rx="20" ry="3" fill="rgba(40,20,8,0.25)"/>

          {/* Box body back — visible interior when door opens */}
          <rect x="6" y="18" width="68" height="52" rx="4" fill="url(#mailbox-wood)" opacity="0.98"/>
          {/* Interior darkness */}
          <rect x="10" y="22" width="60" height="44" rx="3" fill="url(#mailbox-interior)"/>
          {/* Letters inside hint */}
          {!isEmpty && (
            <g opacity="0.5">
              <rect x="14" y="36" width="24" height="14" rx="1" fill="#f0e4d0" transform="rotate(-6 14 36)"/>
              <rect x="22" y="34" width="24" height="14" rx="1" fill="#ede0cc" transform="rotate(3 22 34)"/>
            </g>
          )}

          {/* Hinged Door */}
          <motion.g
            animate={{ 
              rotateX: isMailboxOpening ? 75 : 0,
              opacity: isMailboxOpening ? 0.7 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 12,
              mass: 0.9
            }}
            style={{ 
              transformOrigin: '40px 70px',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Box front door face */}
            <rect x="6" y="18" width="68" height="52" rx="4" fill="url(#mailbox-wood)"/>
            {/* Dome top highlight */}
            <path d="M6 30 Q6 18 40 18 Q74 18 74 30" fill="#c8845c" opacity="0.95"/>
            {/* Top edge gleam */}
            <rect x="6" y="18" width="68" height="4" rx="2" fill="rgba(255,220,160,0.15)"/>
            {/* Bottom shadow band */}
            <rect x="6" y="58" width="68" height="12" rx="0" fill="rgba(0,0,0,0.10)"/>
            
            {/* Wood grain lines on door */}
            {[26, 34, 42, 50, 58].map(y => (
              <line key={y} x1="8" y1={y} x2="72" y2={y} stroke="rgba(80,48,16,0.06)" strokeWidth="0.8"/>
            ))}

            {/* Mail slot — brass plate with slot */}
            <rect x="16" y="36" width="28" height="8" rx="2" fill="url(#brass-plate)" opacity="0.9"/>
            <rect x="18" y="38" width="24" height="4" rx="1.5" fill="#1a0e06" opacity="0.85"/>
            {/* Slot highlight */}
            <line x1="18" y1="38" x2="42" y2="38" stroke="rgba(255,200,100,0.15)" strokeWidth="0.5"/>

            {/* Handle — brass knob with reflection */}
            <circle cx="58" cy="44" r="5.5" fill="url(#brass-knob)" opacity="0.95"/>
            <circle cx="58" cy="44" r="3.5" fill="url(#brass-knob)"/>
            {/* Handle specular highlight */}
            <ellipse cx="56.5" cy="42.5" rx="2" ry="1.2" fill="rgba(255,240,200,0.35)"/>
            {/* Mounting plate */}
            <circle cx="58" cy="44" r="7" fill="none" stroke="rgba(140,100,40,0.3)" strokeWidth="0.8"/>

            {/* Decorative corner brackets */}
            <path d="M10 22 L18 22 L18 24 L12 24 L12 30 L10 30 Z" fill="rgba(140,100,40,0.12)"/>
            <path d="M70 22 L62 22 L62 24 L68 24 L68 30 L70 30 Z" fill="rgba(140,100,40,0.12)"/>
          </motion.g>

          {/* Hinge hardware — small brass pins */}
          <circle cx="10" cy="69" r="2" fill="url(#brass-knob)" opacity="0.7"/>
          <circle cx="70" cy="69" r="2" fill="url(#brass-knob)" opacity="0.7"/>
          {/* Hinge line */}
          <line x1="6" y1="70" x2="74" y2="70" stroke="rgba(100,70,30,0.3)" strokeWidth="1"/>

          {/* Flag */}
          <motion.g
            animate={isEmpty ? { rotate: -8 } : { rotate: 40 }}
            style={{ transformOrigin: '68px 34px' }}
            transition={{ type: 'spring', stiffness: 100, damping: 14 }}
          >
            <line x1="68" y1="14" x2="68" y2="36" stroke="#7a5828" strokeWidth="2.5" strokeLinecap="round"/>
            <motion.path
              d="M68 14 L82 14 Q84 18 82 22 L68 22 Z"
              fill={isEmpty ? '#9a8878' : '#c45040'}
              opacity={0.9}
              animate={isEmpty ? { opacity: 0.35 } : { opacity: 0.9 }}
            />
            {/* Flag highlight */}
            {!isEmpty && <path d="M70 15 L80 15 Q81 17 80 19 L70 19 Z" fill="rgba(255,255,255,0.12)"/>}
          </motion.g>
        </svg>

        {/* Count badge */}
        {count > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            style={{
              position: 'absolute',
              top: 10,
              right: -2,
              width: 22,
              height: 22,
              borderRadius: '50%',
              backgroundColor: '#c47040',
              color: '#faf3e4',
              fontFamily: 'var(--font-ui)',
              fontSize: '10px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(150,60,20,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
              border: '1.5px solid rgba(255,200,140,0.25)',
            }}
          >
            {count}
          </motion.div>
        )}
      </motion.div>

      {/* Label */}
      <p style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '9px',
        letterSpacing: '0.14em',
        color: '#7a6850',
        textTransform: 'lowercase',
        marginTop: '6px',
        opacity: 0.6,
      }}>
        inbox
      </p>
    </div>
  );
}
