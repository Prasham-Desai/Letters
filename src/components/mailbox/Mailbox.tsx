'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  count: number;
  onDrop: () => void;
}

export default function Mailbox({ count, onDrop }: Props) {
  const [shaking, setShaking] = useState(false);
  const [dropping, setDropping] = useState(false);

  const handleClick = useCallback(() => {
    if (shaking || count === 0) return;
    setShaking(true);
    setTimeout(() => {
      setShaking(false);
      setDropping(true);
      onDrop();
      setTimeout(() => setDropping(false), 800);
    }, 600);
  }, [shaking, count, onDrop]);

  const isEmpty = count === 0;

  return (
    <div
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      title={isEmpty ? 'No more letters' : `${count} letter${count !== 1 ? 's' : ''} waiting`}
    >
      <motion.div
        animate={shaking ? {
          rotate: [0, -10, 10, -8, 8, -5, 5, -2, 2, 0],
          transition: { duration: 0.6, ease: 'easeInOut' },
        } : {}}
        onClick={handleClick}
        style={{ cursor: isEmpty ? 'default' : 'pointer', position: 'relative' }}
        whileHover={!isEmpty ? { scale: 1.06, y: -2 } : {}}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Mailbox SVG */}
        <svg width="70" height="88" viewBox="0 0 70 88" fill="none" aria-label="Mailbox">
          {/* Post */}
          <rect x="31" y="62" width="8" height="26" rx="2" fill="#8a6a3a" opacity="0.85"/>

          {/* Box body */}
          <rect x="6" y="18" width="58" height="44" rx="5" fill="#b87048" opacity="0.92"/>
          {/* Box top dome */}
          <path d="M6 28 Q6 18 35 18 Q64 18 64 28" fill="#c47c54" opacity="0.9"/>
          {/* Box shading */}
          <rect x="6" y="18" width="58" height="6" rx="3" fill="rgba(255,255,255,0.12)"/>
          <rect x="6" y="50" width="58" height="12" rx="0" fill="rgba(0,0,0,0.08)"/>

          {/* Mail slot */}
          <rect x="14" y="35" width="30" height="5" rx="2" fill="rgba(0,0,0,0.35)"/>

          {/* Door seam */}
          <line x1="6" y1="36" x2="64" y2="36" stroke="rgba(0,0,0,0.12)" strokeWidth="0.8"/>

          {/* Handle */}
          <circle cx="52" cy="40" r="4" fill="#8a6a3a" opacity="0.7"/>
          <circle cx="52" cy="40" r="2.5" fill="#c4a060" opacity="0.8"/>

          {/* Flag */}
          <motion.g
            animate={isEmpty ? { rotate: -5 } : { rotate: 35 }}
            style={{ transformOrigin: '58px 30px' }}
            transition={{ type: 'spring', stiffness: 120, damping: 16 }}
          >
            <line x1="58" y1="16" x2="58" y2="32" stroke="#8a6a3a" strokeWidth="2.5" strokeLinecap="round"/>
            <motion.rect
              x="58" y="16" width="14" height="9" rx="1"
              fill={isEmpty ? '#9a8878' : '#c47050'}
              opacity={0.9}
              animate={isEmpty ? { opacity: 0.4 } : { opacity: 0.9 }}
            />
          </motion.g>

          {/* Drop animation letters */}
          <AnimatePresence>
            {dropping && [0,1,2].map(i => (
              <motion.rect
                key={i}
                x={20 + i * 12}
                y={30}
                width={14}
                height={10}
                rx={1}
                fill="#faf3e4"
                opacity={0.9}
                stroke="rgba(100,78,50,0.3)"
                strokeWidth={0.5}
                initial={{ y: 30, opacity: 0.9 }}
                animate={{ y: 90, opacity: 0, rotate: (i - 1) * 20 }}
                exit={{}}
                transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeIn' }}
              />
            ))}
          </AnimatePresence>
        </svg>

        {/* Count badge */}
        {count > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute',
              top: 14,
              right: 2,
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: '#c9924a',
              color: '#faf3e4',
              fontFamily: 'var(--font-ui)',
              fontSize: '10px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
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
        letterSpacing: '0.12em',
        color: '#7a6850',
        textTransform: 'lowercase',
        marginTop: '4px',
        opacity: 0.7,
      }}>
        {isEmpty ? 'all read' : 'tap to open'}
      </p>
    </div>
  );
}
