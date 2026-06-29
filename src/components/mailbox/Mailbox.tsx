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
        {/* Desktop Wooden In-Tray */}
        <svg width="100" height="85" viewBox="0 0 100 85" fill="none" aria-label="Inbox Tray">
          <defs>
            <linearGradient id="tray-wood" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9a6838"/>
              <stop offset="50%" stopColor="#8a5828"/>
              <stop offset="100%" stopColor="#6a4818"/>
            </linearGradient>
            <linearGradient id="tray-wood-dark" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7a4828"/>
              <stop offset="100%" stopColor="#4a2808"/>
            </linearGradient>
            <linearGradient id="tray-interior" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3a2414"/>
              <stop offset="100%" stopColor="#2a1408"/>
            </linearGradient>
            <linearGradient id="brass-tray" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4b868"/>
              <stop offset="50%" stopColor="#b89838"/>
              <stop offset="100%" stopColor="#8a6020"/>
            </linearGradient>
          </defs>
          {/* 2D Contact shadow */}
          <ellipse cx="50" cy="72" rx="42" ry="7" fill="rgba(0,0,0,0.3)" filter="blur(2px)"/>

          {/* Back panel */}
          <rect x="10" y="20" width="80" height="50" rx="3" fill="url(#tray-wood-dark)"/>
          
          {/* Stack of letters in the tray */}
          {!isEmpty && (
            <motion.g
              animate={isMailboxOpening ? { y: -10, opacity: 0 } : { y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <rect x="18" y="38" width="60" height="35" rx="2" fill="#f0e4d0" transform="rotate(-2 48 55)" />
              <rect x="16" y="35" width="60" height="35" rx="2" fill="#ede0cc" transform="rotate(1 46 52)" />
              <line x1="20" y1="52" x2="70" y2="52" stroke="#d4c8b0" strokeWidth="1" transform="rotate(1 45 52)" />
              {/* Wax seal hint */}
              <circle cx="46" cy="52" r="4" fill="#7a2840" />
            </motion.g>
          )}

          {/* Side panels */}
          <path d="M 10 20 L 20 40 L 20 70 L 10 70 Z" fill="url(#tray-wood)"/>
          <path d="M 90 20 L 80 40 L 80 70 L 90 70 Z" fill="url(#tray-wood)"/>

          {/* Front panel (lowered for easy access) */}
          <rect x="10" y="55" width="80" height="15" rx="2" fill="url(#tray-wood)"/>
          <rect x="10" y="55" width="80" height="3" rx="1.5" fill="rgba(255,255,255,0.1)"/>

          {/* Brass corner brackets */}
          <path d="M 10 55 L 18 55 L 18 60 L 10 60 Z" fill="url(#brass-tray)" opacity="0.8"/>
          <path d="M 90 55 L 82 55 L 82 60 L 90 60 Z" fill="url(#brass-tray)" opacity="0.8"/>

          {/* Label plate */}
          <rect x="40" y="60" width="20" height="6" rx="1" fill="url(#brass-tray)"/>
          <rect x="42" y="61.5" width="16" height="3" fill="#f5f0e8" opacity="0.9"/>
          
          {/* Wood grain lines */}
          <line x1="12" y1="58" x2="88" y2="58" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5"/>
          <line x1="12" y1="64" x2="88" y2="64" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5"/>
        </svg>

        {/* Count badge */}
        {count > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            style={{
              position: 'absolute',
              top: 5,
              right: 5,
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
        marginTop: '2px',
        opacity: 0.8,
        textShadow: '0 1px 2px rgba(255,255,255,0.2)',
      }}>
        inbox
      </p>
    </div>
  );
}
