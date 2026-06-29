'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Envelope from '../envelope/Envelope';
import { PlacedEnvelope } from '@/types/letter';

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
              <Envelope
                data={{
                  id: 'splash',
                  title: '',
                  file: '',
                  x: 0,
                  y: 0,
                  deskW: 180,
                  deskH: 120,
                  width: 180,
                  height: 120,
                  rotation: 0,
                  stamp: 'moon',
                  seal: 'burgundy',
                  sealType: 'flower',
                  paper: 'cream',
                  category: 'love'
                } as PlacedEnvelope}
                isOpened={false}
                onClick={() => {}}
                isHidden={false}
              />
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
