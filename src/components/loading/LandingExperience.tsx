'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: () => void;
}

export default function LandingExperience({ onComplete }: Props) {
  const [stage, setStage] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const [done, setDone] = useState(false);

  // Stage timeline
  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 300),    // paper fades in
      setTimeout(() => setStage(2), 900),    // envelope lands
      setTimeout(() => setStage(3), 1800),   // envelope opens
      setTimeout(() => setStage(4), 2600),   // title writes
      setTimeout(() => setStage(5), 4200),   // subtitle
      setTimeout(() => setStage(6), 5400),   // desk reveals
      setTimeout(() => finish(), 6200),
    ];
    const skipTimer = setTimeout(() => setShowSkip(true), 2000);
    return () => { timers.forEach(clearTimeout); clearTimeout(skipTimer); };
  }, []);

  const finish = () => {
    setDone(true);
    setTimeout(onComplete, 600);
  };

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center"
          style={{ backgroundColor: 'var(--cream)' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
        >
          {/* Paper texture overlay */}
          <motion.div
            className="absolute inset-0 paper-texture"
            initial={{ opacity: 0 }}
            animate={{ opacity: stage >= 1 ? 1 : 0 }}
            transition={{ duration: 1.2 }}
          />

          {/* Main content */}
          <div className="relative flex flex-col items-center gap-4" style={{ zIndex: 10 }}>
            {/* Envelope animation */}
            <motion.div
              style={{ position: 'relative', width: 180, height: 120 }}
              initial={{ y: -80, opacity: 0 }}
              animate={stage >= 2 ? { y: 0, opacity: 1 } : {}}
              transition={{ type: 'spring', stiffness: 80, damping: 18, mass: 1.4 }}
            >
              {/* SVG 1: Back and Flap */}
              <svg width="180" height="120" viewBox="0 0 180 120" fill="none" style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
                {/* Body */}
                <rect x="2" y="2" width="176" height="116" rx="3" fill="#f0e8d8" stroke="rgba(100,85,65,0.3)" strokeWidth="1"/>
                
                {/* Flap & Wax Seal Group — opens at stage 3 */}
                <motion.g
                  animate={stage >= 3 ? { rotateX: -170 } : { rotateX: 0 }}
                  transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
                  style={{ transformOrigin: '90px 2px', transformStyle: 'preserve-3d' }}
                >
                  <path d="M2,2 L90,65 L178,2 L178,2 L2,2Z" fill="#e8ddd0" stroke="rgba(100,85,65,0.25)" strokeWidth="0.8"/>
                  {/* Wax seal attached to flap */}
                  <g>
                    <circle cx="90" cy="55" r="16" fill="#7a2840" opacity="0.95"/>
                    <circle cx="87" cy="52" r="13" fill="#9a3855" opacity="0.45"/>
                    {/* flower motif */}
                    {[0,60,120,180,240,300].map((a, i) => {
                      const rad = (a * Math.PI) / 180;
                      return (
                        <ellipse key={i}
                          cx={90 + Math.cos(rad) * 6} cy={55 + Math.sin(rad) * 6}
                          rx="3" ry="5"
                          transform={`rotate(${a} ${90 + Math.cos(rad)*6} ${55 + Math.sin(rad)*6})`}
                          fill="rgba(255,255,255,0.85)"
                        />
                      );
                    })}
                    <circle cx="90" cy="55" r="3.5" fill="rgba(255,255,255,0.95)"/>
                  </g>
                </motion.g>
              </svg>

              {/* Paper rising from envelope */}
              <motion.div
                style={{
                  position: 'absolute',
                  bottom: 20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 120,
                  backgroundColor: '#faf6ee',
                  borderRadius: '1px',
                  boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                  originY: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2 // Overlaps the back, but is behind the front folds
                }}
                initial={{ height: 0, opacity: 0 }}
                animate={stage >= 3 ? { height: 80, opacity: 1 } : {}}
                transition={{ duration: 0.9, delay: 0.4, ease: [0.2, 0.8, 0.3, 1] }}
              >
                {/* Hand-drawn heart */}
                <motion.svg
                  width="28" height="28" viewBox="0 0 24 24" fill="none"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={stage >= 3 ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.9, duration: 0.6 }}
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="#9a3855" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </motion.svg>
              </motion.div>

              {/* SVG 2: Front Folds */}
              <svg width="180" height="120" viewBox="0 0 180 120" fill="none" style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}>
                <path d="M2,2 L90,65 L178,2" stroke="rgba(100,85,65,0.2)" strokeWidth="1" fill="rgba(100,85,65,0.04)"/>
                <path d="M2,118 L90,55 L178,118" stroke="rgba(100,85,65,0.15)" strokeWidth="0.8" fill="rgba(100,85,65,0.02)"/>
              </svg>
            </motion.div>

            {/* Handwritten title */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={stage >= 4 ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h1
                className="font-heading text-center"
                style={{
                  fontSize: 'clamp(2.4rem, 6vw, 3.6rem)',
                  color: 'var(--ink)',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.1,
                }}
              >
                <TitleWrite text="When You Need Me" active={stage >= 4} />
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              className="font-ui text-center"
              style={{
                fontSize: '0.82rem',
                color: 'var(--warm-gray)',
                letterSpacing: '0.1em',
                textTransform: 'lowercase',
              }}
              initial={{ opacity: 0, y: 6 }}
              animate={stage >= 5 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              a small collection of notes · for every version of you
            </motion.p>
          </div>

          {/* Skip button */}
          <AnimatePresence>
            {showSkip && (
              <motion.button
                className="skip-btn absolute bottom-8 right-8 font-ui"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                onClick={finish}
              >
                skip
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Simulates handwriting by revealing characters one by one with SVG-like fade
function TitleWrite({ text, active }: { text: string; active: boolean }) {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (!active) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setRevealed(i);
      if (i >= text.length) clearInterval(interval);
    }, 55);
    return () => clearInterval(interval);
  }, [active, text]);

  return (
    <span>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: i < revealed ? 1 : 0 }}
          transition={{ duration: 0.18 }}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}
