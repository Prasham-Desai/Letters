'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    // Tiny reactive wobble on the mailbox itself when clicked
    setTimeout(() => setWobbling(false), 300);
    onDrop(); // Trigger flight orchestrator
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
          y: [0, -2, 1, 0],
          transition: { duration: 0.3, ease: 'easeOut' },
        } : {}}
        onClick={handleClick}
        style={{ cursor: isEmpty ? 'default' : 'pointer', position: 'relative' }}
        whileHover={!isEmpty ? { scale: 1.05, y: -2 } : {}}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Mailbox SVG */}
        <svg width="70" height="88" viewBox="0 0 70 88" fill="none" aria-label="Mailbox">
          {/* Post */}
          <rect x="31" y="62" width="8" height="26" rx="2" fill="#8a6a3a" opacity="0.85"/>

          {/* Box body back */}
          <rect x="6" y="18" width="58" height="44" rx="5" fill="#a45b34" opacity="0.95"/>
          
          {/* Inner dark slot (visible when door opens) */}
          <rect x="10" y="24" width="50" height="32" rx="3" fill="#3a1e12" />

          {/* Hinging Door */}
          <motion.g
            animate={{ 
              rotateX: isMailboxOpening ? 160 : 0, // physically hinge downward
              y: isMailboxOpening ? 2 : 0, // tiny settling shift
            }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 14,
              mass: 0.8
            }}
            style={{ 
              transformOrigin: '50% 62px', // Hinge point at the bottom of the door
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Box front/door */}
            <rect x="6" y="18" width="58" height="44" rx="5" fill="#b87048" opacity="0.98"/>
            <path d="M6 28 Q6 18 35 18 Q64 18 64 28" fill="#c47c54" opacity="0.98"/>
            <rect x="6" y="18" width="58" height="6" rx="3" fill="rgba(255,255,255,0.12)"/>
            <rect x="6" y="50" width="58" height="12" rx="0" fill="rgba(0,0,0,0.08)"/>
            
            {/* Mail slot on door */}
            <rect x="14" y="35" width="30" height="5" rx="2" fill="rgba(0,0,0,0.4)"/>
            
            {/* Handle on door */}
            <circle cx="52" cy="40" r="4" fill="#8a6a3a" opacity="0.9"/>
            <circle cx="52" cy="40" r="2.5" fill="#c4a060" opacity="0.95"/>
            <path d="M50 40 Q52 44 54 40" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none"/>
          </motion.g>

          {/* Door seam (hinge axis overlay) */}
          <line x1="6" y1="62" x2="64" y2="62" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5"/>

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
        inbox
      </p>
    </div>
  );
}
