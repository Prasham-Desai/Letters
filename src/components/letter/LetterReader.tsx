'use client';
import { useEffect, useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LetterMeta } from '@/types/letter';
import WaxSeal from '../envelope/WaxSeal';

interface Props {
  letter: LetterMeta | null;
  content: string;
  onClose: () => void;
}

// Parses raw markdown into line segments
function parseLines(raw: string): string[] {
  return raw.trim().split('\n').map(l => l.trim()).filter(Boolean);
}

function LineReveal({ lines, active, onCalculateDelay }: { lines: string[]; active: boolean; onCalculateDelay: (delay: number) => void }) {
  const words = lines.flatMap((line, lineIndex) => [
    ...line.split(' ').map(text => ({ text, lineIndex })),
    { text: '\n', lineIndex }
  ]);

  useEffect(() => {
    // Notify parent when to show signature (total words * 0.18 + 0.5s duration)
    onCalculateDelay(words.length * 0.18 + 0.5);
  }, [words.length, onCalculateDelay]);

  return (
    <div style={{ width: '100%', textAlign: 'left', padding: '0 10%' }}>
      {words.map((w, i) => (
        w.text === '\n' ? (
          <div key={i} style={{ height: '0.5em' }} /> // Paragraph spacing
        ) : (
          <motion.span
            key={i}
            initial={{ opacity: 0, clipPath: 'inset(-20% 100% -20% -20%)' }}
            animate={active ? { opacity: 1, clipPath: 'inset(-20% -20% -20% -20%)' } : { opacity: 0, clipPath: 'inset(-20% 100% -20% -20%)' }}
            transition={{
              delay: active ? i * 0.18 : 0,
              duration: 0.4,
              ease: "linear",
            }}
            style={{
              display: 'inline-block',
              marginRight: '0.28em',
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.5rem, 4.2vw, 2rem)',
              lineHeight: 1.3,
              color: '#2a1e10',
              letterSpacing: '0.012em',
            }}
          >
            {w.text}
          </motion.span>
        )
      ))}
    </div>
  );
}

const LetterReader = memo(function LetterReader({ letter, content, onClose }: Props) {
  const [textActive, setTextActive] = useState(false);
  const [signatureDelay, setSignatureDelay] = useState(1);
  const lines = parseLines(content);

  useEffect(() => {
    if (!letter) { setTextActive(false); return; }
    // Small delay after paper opens before text starts
    const t = setTimeout(() => setTextActive(true), 500);
    return () => clearTimeout(t);
  }, [letter]);

  return (
    <AnimatePresence>
      {letter && (
        <>
          {/* Overlay — no blur, just a semi-transparent tint */}
          <motion.div
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 50,
              backgroundColor: 'rgba(22, 14, 6, 0.52)',
              // NO backdropFilter — it causes GPU lag
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            aria-label="Close letter"
          />

          {/* Paper */}
          <motion.div
            style={{
              position: 'fixed', inset: 0, zIndex: 51,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <motion.div
              style={{
                pointerEvents: 'auto',
                width: 'min(440px, 88vw)',
                position: 'relative',
              }}
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.5, ease: [0.2, 0.9, 0.2, 1] }}
            >
              {/* Paper card — no animated background, static */}
              <div
                style={{
                  backgroundColor: '#faf3e4',
                  borderRadius: '4px',
                  boxShadow: '0 22px 56px rgba(22,14,6,0.30), 0 4px 16px rgba(22,14,6,0.14)',
                  padding: 'clamp(32px, 6vw, 52px) clamp(24px, 6vw, 48px)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Subtle top worn edge */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                  background: 'linear-gradient(90deg, transparent, rgba(160,128,78,0.18) 25%, rgba(160,128,78,0.14) 75%, transparent)',
                }} aria-hidden="true" />

                {/* Faded wax seal watermark at top */}
                <div style={{
                  position: 'absolute', top: -10, left: '50%',
                  transform: 'translateX(-50%)',
                  opacity: 0.22, pointerEvents: 'none',
                }}>
                  <WaxSeal type={letter.sealType} color={letter.seal} cracked size={24} />
                </div>

                {/* "Open when..." label */}
                <p style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '9px',
                  letterSpacing: '0.18em',
                  textTransform: 'lowercase',
                  color: '#9a8470',
                  textAlign: 'center',
                  marginBottom: '28px',
                  opacity: 0.9,
                }}>
                  {letter.title}
                </p>

                {/* Letter text with word-by-word reveal */}
                <LineReveal lines={lines} active={textActive} onCalculateDelay={setSignatureDelay} />

                {/* Divider + signature */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: textActive ? 0.65 : 0 }}
                  transition={{ delay: signatureDelay, duration: 0.6 }}
                  style={{
                    marginTop: '28px',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(139,110,72,0.18)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.05rem',
                    color: '#7a6448',
                    textAlign: 'right',
                  }}
                >
                  — always, yours
                </motion.div>

                {/* Bottom worn edge */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
                  background: 'linear-gradient(90deg, transparent, rgba(160,128,78,0.16) 25%, rgba(160,128,78,0.12) 75%, transparent)',
                }} aria-hidden="true" />
              </div>

              {/* Close action — below paper, clean */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: textActive ? 1 : 0 }}
                transition={{ delay: signatureDelay + 0.3, duration: 0.5 }}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '20px',
                }}
              >
                <button
                  onClick={onClose}
                  aria-label="Close letter"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '11px',
                    fontWeight: 300,
                    letterSpacing: '0.14em',
                    textTransform: 'lowercase',
                    color: '#9a8470',
                    background: 'rgba(250,243,228,0.9)',
                    border: '1px solid rgba(139,110,72,0.3)',
                    borderRadius: '20px',
                    padding: '7px 20px',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease, border-color 0.2s ease, background 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    (e.target as HTMLButtonElement).style.color = '#3a2c1a';
                    (e.target as HTMLButtonElement).style.borderColor = 'rgba(139,110,72,0.6)';
                    (e.target as HTMLButtonElement).style.background = 'rgba(250,243,228,1)';
                  }}
                  onMouseLeave={e => {
                    (e.target as HTMLButtonElement).style.color = '#9a8470';
                    (e.target as HTMLButtonElement).style.borderColor = 'rgba(139,110,72,0.3)';
                    (e.target as HTMLButtonElement).style.background = 'rgba(250,243,228,0.9)';
                  }}
                >
                  fold it back
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

export default LetterReader;
