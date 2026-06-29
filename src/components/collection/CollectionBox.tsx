'use client';
import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LetterMeta } from '@/types/letter';
import WaxSeal from '../envelope/WaxSeal';
import { useAnimation } from '@/contexts/AnimationContext';

interface Props {
  count: number;
  letters: LetterMeta[];
  onOpen: (letter: LetterMeta) => void;
}

const CollectionBox = memo(function CollectionBox({ count, letters, onOpen }: Props) {
  const [panelOpen, setPanelOpen] = useState(false);
  const { collectionBoxRef, isCollectionOpening } = useAnimation();

  const isLidOpen = panelOpen || isCollectionOpening;

  return (
    <div ref={collectionBoxRef} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Keepsake Chest */}
      <motion.div
        onClick={() => count > 0 && setPanelOpen(v => !v)}
        style={{ cursor: count > 0 ? 'pointer' : 'default', position: 'relative' }}
        whileHover={count > 0 ? { scale: 1.04, y: -3 } : {}}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <svg width="84" height="86" viewBox="0 0 84 86" fill="none" aria-label="Keepsake collection">
          <defs>
            {/* Wood gradient for chest body */}
            <linearGradient id="chest-wood" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9a7438"/>
              <stop offset="40%" stopColor="#8a6428"/>
              <stop offset="100%" stopColor="#6a4818"/>
            </linearGradient>
            {/* Lid wood gradient */}
            <linearGradient id="chest-lid" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#b08840"/>
              <stop offset="50%" stopColor="#9a7438"/>
              <stop offset="100%" stopColor="#8a6428"/>
            </linearGradient>
            {/* Brass hardware */}
            <linearGradient id="chest-brass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e8cc78"/>
              <stop offset="40%" stopColor="#c4a050"/>
              <stop offset="100%" stopColor="#8a7030"/>
            </linearGradient>
            {/* Interior dark lining */}
            <linearGradient id="chest-interior" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2a1408"/>
              <stop offset="100%" stopColor="#3a1e12"/>
            </linearGradient>
          </defs>

          {/* Ground contact shadow */}
          <ellipse cx="42" cy="84" rx="28" ry="4" fill="rgba(40,20,8,0.22)"/>

          {/* Box body — layered wood construction */}
          <rect x="6" y="34" width="72" height="46" rx="3" fill="url(#chest-wood)"/>
          {/* Interior visible above body */}
          <rect x="8" y="34" width="68" height="10" rx="2" fill="url(#chest-interior)" opacity="0.9"/>

          {/* Wood grain on body */}
          {[44, 52, 60, 68, 74].map(y => (
            <line key={y} x1="8" y1={y} x2="76" y2={y} stroke="rgba(60,36,12,0.06)" strokeWidth="0.8"/>
          ))}
          
          {/* Side edge shadow — gives thickness */}
          <rect x="6" y="34" width="3" height="46" rx="1" fill="rgba(0,0,0,0.08)"/>
          <rect x="75" y="34" width="3" height="46" rx="1" fill="rgba(0,0,0,0.04)"/>

          {/* Bottom edge bead */}
          <rect x="6" y="76" width="72" height="4" rx="2" fill="rgba(0,0,0,0.06)"/>
          <rect x="6" y="76" width="72" height="1" rx="0.5" fill="rgba(255,200,100,0.06)"/>

          {/* Corner brass brackets */}
          <path d="M8 36 L16 36 L16 38 L10 38 L10 44 L8 44 Z" fill="url(#chest-brass)" opacity="0.35"/>
          <path d="M76 36 L68 36 L68 38 L74 38 L74 44 L76 44 Z" fill="url(#chest-brass)" opacity="0.35"/>
          <path d="M8 74 L16 74 L16 72 L10 72 L10 66 L8 66 Z" fill="url(#chest-brass)" opacity="0.25"/>
          <path d="M76 74 L68 74 L68 72 L74 72 L74 66 L76 66 Z" fill="url(#chest-brass)" opacity="0.25"/>

          {/* Letters peeking out */}
          {count > 0 && (
            <g opacity="0.55">
              <rect x="14" y="26" width="24" height="14" rx="1" fill="#faf3e4" transform="rotate(-7 14 26)"/>
              <rect x="34" y="24" width="24" height="14" rx="1" fill="#f2e6d4" transform="rotate(4 34 24)"/>
            </g>
          )}

          {/* Lid — hinges at back */}
          <motion.g
            animate={{ rotate: isLidOpen ? -50 : 0 }}
            style={{ transformOrigin: '42px 34px' }}
            transition={{ type: 'spring', stiffness: 120, damping: 12, mass: 0.9 }}
          >
            <rect x="4" y="24" width="76" height="14" rx="4" fill="url(#chest-lid)"/>
            {/* Lid top highlight */}
            <rect x="4" y="24" width="76" height="3" rx="2" fill="rgba(255,220,140,0.12)"/>
            {/* Lid edge shadow */}
            <rect x="4" y="34" width="76" height="4" rx="2" fill="rgba(0,0,0,0.10)"/>
            {/* Lid wood grain */}
            <line x1="8" y1="28" x2="76" y2="28" stroke="rgba(60,36,12,0.05)" strokeWidth="0.8"/>
            <line x1="8" y1="32" x2="76" y2="32" stroke="rgba(60,36,12,0.04)" strokeWidth="0.6"/>
            
            {/* Clasp — brass plate */}
            <rect x="32" y="32" width="20" height="7" rx="2.5" fill="url(#chest-brass)" opacity="0.85"/>
            {/* Clasp keyhole */}
            <circle cx="42" cy="35.5" r="2.5" fill="#6a4818" opacity="0.8"/>
            <ellipse cx="42" cy="34" rx="1" ry="0.6" fill="rgba(255,220,160,0.3)"/>
          </motion.g>

          {/* Hinge hardware */}
          <rect x="16" y="33" width="8" height="3" rx="1" fill="url(#chest-brass)" opacity="0.4"/>
          <rect x="60" y="33" width="8" height="3" rx="1" fill="url(#chest-brass)" opacity="0.4"/>

          {/* Front clasp catch */}
          <rect x="34" y="52" width="16" height="7" rx="2.5" fill="url(#chest-brass)" opacity="0.6"/>
          <circle cx="42" cy="55.5" r="2" fill="#7a5828" opacity="0.7"/>
          {/* Clasp highlight */}
          <ellipse cx="41" cy="54" rx="1.5" ry="0.8" fill="rgba(255,220,160,0.25)"/>

          {/* Leather handle strap */}
          <path d="M32 24 Q32 18 42 16 Q52 18 52 24" stroke="#5a3820" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M32 24 Q32 19 42 17 Q52 19 52 24" stroke="#7a5030" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          {/* Handle stitching */}
          {[34, 38, 42, 46, 50].map((x, i) => {
            const y = 24 - (i < 2 ? i * 2 : i === 2 ? 5 : (4 - i) * 2);
            return <circle key={x} cx={x} cy={y + 1} r="0.5" fill="rgba(255,220,160,0.25)"/>;
          })}
        </svg>

        {/* Count badge */}
        {count > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            style={{
              position: 'absolute', top: 10, right: -2,
              width: 22, height: 22, borderRadius: '50%',
              backgroundColor: '#6a8a6a',
              color: '#faf3e4',
              fontFamily: 'var(--font-ui)',
              fontSize: '10px', fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(60,90,60,0.35), inset 0 1px 0 rgba(255,255,255,0.12)',
              border: '1.5px solid rgba(180,210,180,0.25)',
            }}
          >
            {count}
          </motion.div>
        )}
      </motion.div>

      <p style={{
        fontFamily: 'var(--font-ui)', fontSize: '9px',
        letterSpacing: '0.14em', color: '#7a6850',
        textTransform: 'lowercase', marginTop: '6px', opacity: 0.6,
      }}>
        {count === 0 ? 'collection' : 'your letters'}
      </p>

      {/* Collection panel */}
      <AnimatePresence>
        {panelOpen && (
          <>
            <motion.div
              className="fixed inset-0" style={{ zIndex: 48 }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setPanelOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              style={{
                position: 'fixed',
                right: 'clamp(12px, 4vw, 40px)',
                bottom: 'clamp(120px, 20vh, 200px)',
                width: 'min(340px, 88vw)',
                backgroundColor: '#f5eedf',
                borderRadius: '8px',
                boxShadow: '0 24px 80px rgba(30,20,10,0.32), 0 4px 12px rgba(30,20,10,0.12)',
                zIndex: 49,
                overflow: 'hidden',
                border: '1px solid rgba(180,160,120,0.15)',
              }}
              initial={{ scale: 0.85, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 10 }}
              transition={{ duration: 0.35, ease: [0.2, 0.9, 0.2, 1] }}
            >
              {/* Panel header */}
              <div style={{
                padding: '16px 20px 12px',
                borderBottom: '1px solid rgba(139,118,90,0.15)',
                background: 'linear-gradient(to bottom, rgba(255,240,200,0.06), transparent)',
              }}>
                <p style={{
                  fontFamily: 'var(--font-heading)', fontSize: '1.3rem',
                  color: '#2a1e10', opacity: 0.85,
                }}>Your collection</p>
                <p style={{
                  fontFamily: 'var(--font-ui)', fontSize: '10px',
                  color: '#9a8a78', letterSpacing: '0.1em', marginTop: '2px',
                }}>
                  {count} letter{count !== 1 ? 's' : ''} read
                </p>
              </div>

              {/* Letters list */}
              <div style={{ maxHeight: '280px', overflowY: 'auto', padding: '8px 0' }} className="letter-scroll">
                {letters.map((letter, i) => (
                  <motion.div
                    key={letter.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => { onOpen(letter); setPanelOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                    }}
                    whileHover={{ backgroundColor: 'rgba(139,118,90,0.08)' }}
                  >
                    <WaxSeal type={letter.sealType} color={letter.seal} cracked size={28} />
                    <p style={{
                      fontFamily: 'var(--font-heading)', fontSize: '1rem',
                      color: '#2a1e10', opacity: 0.82,
                      lineHeight: 1.3,
                    }}>
                      {letter.title}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
});

export default CollectionBox;
