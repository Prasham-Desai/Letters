'use client';
import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LetterMeta } from '@/types/letter';
import WaxSeal from '../envelope/WaxSeal';

interface Props {
  count: number;
  letters: LetterMeta[];
  onOpen: (letter: LetterMeta) => void;
}

const CollectionBox = memo(function CollectionBox({ count, letters, onOpen }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Box */}
      <motion.div
        onClick={() => count > 0 && setOpen(v => !v)}
        style={{ cursor: count > 0 ? 'pointer' : 'default', position: 'relative' }}
        whileHover={count > 0 ? { scale: 1.06, y: -2 } : {}}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <svg width="72" height="76" viewBox="0 0 72 76" fill="none" aria-label="Opened letters collection">
          {/* Box body */}
          <rect x="4" y="30" width="64" height="40" rx="4" fill="#8a6a3a" opacity="0.88"/>
          {/* Box interior shadow */}
          <rect x="4" y="30" width="64" height="10" rx="4" fill="rgba(0,0,0,0.12)"/>

          {/* Lid (open state tilts back) */}
          <motion.g
            animate={{ rotate: open ? -40 : 0 }}
            style={{ transformOrigin: '36px 30px' }}
            transition={{ type: 'spring', stiffness: 140, damping: 18 }}
          >
            <rect x="2" y="22" width="68" height="12" rx="4" fill="#a07840" opacity="0.92"/>
            {/* Lid clasp */}
            <rect x="30" y="28" width="12" height="6" rx="2" fill="#c4a060" opacity="0.8"/>
            <circle cx="36" cy="31" r="2" fill="#8a6a3a" opacity="0.7"/>
          </motion.g>

          {/* Letters peeking out when there are collected letters */}
          {count > 0 && (
            <>
              <rect x="12" y="22" width="22" height="12" rx="1" fill="#faf3e4" opacity="0.7"
                transform="rotate(-8 12 22)"/>
              <rect x="30" y="20" width="22" height="12" rx="1" fill="#f2e6d4" opacity="0.6"
                transform="rotate(4 30 20)"/>
            </>
          )}

          {/* Wood grain lines */}
          {[38, 46, 54, 62].map(y => (
            <line key={y} x1="4" y1={y} x2="68" y2={y} stroke="rgba(0,0,0,0.06)" strokeWidth="0.8"/>
          ))}

          {/* Front latch */}
          <rect x="29" y="46" width="14" height="8" rx="3" fill="#c4a060" opacity="0.75"/>
          <circle cx="36" cy="50" r="2.5" fill="#8a6a3a" opacity="0.7"/>
        </svg>

        {/* Count badge */}
        {count > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute', top: 16, right: 0,
              width: 20, height: 20, borderRadius: '50%',
              backgroundColor: '#8a9e8a',
              color: '#faf3e4',
              fontFamily: 'var(--font-ui)',
              fontSize: '10px', fontWeight: 500,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
            }}
          >
            {count}
          </motion.div>
        )}
      </motion.div>

      <p style={{
        fontFamily: 'var(--font-ui)', fontSize: '9px',
        letterSpacing: '0.12em', color: '#7a6850',
        textTransform: 'lowercase', marginTop: '4px', opacity: 0.7,
      }}>
        {count === 0 ? 'collection' : 'your letters'}
      </p>

      {/* Collection panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0" style={{ zIndex: 48 }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              style={{
                position: 'fixed',
                right: 'clamp(12px, 4vw, 40px)',
                bottom: 'clamp(120px, 20vh, 200px)',
                width: 'min(340px, 88vw)',
                backgroundColor: '#f5eedf',
                borderRadius: '6px',
                boxShadow: '0 20px 60px rgba(30,20,10,0.28)',
                zIndex: 49,
                overflow: 'hidden',
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
              <div style={{ maxHeight: '280px', overflowY: 'auto', padding: '8px 0' }}>
                {letters.map((letter, i) => (
                  <motion.div
                    key={letter.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => { onOpen(letter); setOpen(false); }}
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
