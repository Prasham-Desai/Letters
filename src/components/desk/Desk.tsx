'use client';
import { useEffect, useRef, useState, useCallback, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LetterMeta } from '@/types/letter';
import { placeEnvelopes } from '@/utils/placement';
import { PlacedEnvelope } from '@/types/letter';
import Envelope from '../envelope/Envelope';
import Doodles from '../doodles/Doodle';
import Mailbox from '../mailbox/Mailbox';
import CollectionBox from '../collection/CollectionBox';

import { useAnimation } from '@/contexts/AnimationContext';

interface Props {
  deskLetters: LetterMeta[];
  mailboxCount: number;
  collectionLetters: LetterMeta[];
  onEnvelopeClick: (letter: LetterMeta) => void;
  onMailboxDrop: () => void;
  onCollectionOpen: (letter: LetterMeta) => void;
  onReturnAll: () => void;
  openedLetterIds: string[];
}

const Desk = memo(function Desk({
  deskLetters,
  mailboxCount,
  collectionLetters,
  onEnvelopeClick,
  onMailboxDrop,
  onCollectionOpen,
  onReturnAll,
  openedLetterIds,
}: Props) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [deskDimensions, setDeskDimensions] = useState({ W: 0, H: 0 });
  const { hiddenEnvelopeIds, flyEnvelope, flyMultiple, mailboxRef, collectionBoxRef } = useAnimation();
  
  const [prevLetters, setPrevLetters] = useState(deskLetters);
  const [localHidden, setLocalHidden] = useState<Set<string>>(new Set());

  // Render-phase state update to hide new letters before they paint!
  if (deskLetters !== prevLetters) {
    const newLetters = deskLetters.filter(l => !prevLetters.find(p => p.id === l.id));
    if (newLetters.length > 0) {
      setLocalHidden(prev => {
        const next = new Set(prev);
        newLetters.forEach(l => next.add(l.id));
        return next;
      });
    }
    setPrevLetters(deskLetters);
  }

  useEffect(() => {
    const ro = new ResizeObserver(entries => {
      if (entries[0]) {
        setDeskDimensions({
          W: entries[0].contentRect.width,
          H: entries[0].contentRect.height,
        });
      }
    });
    if (surfaceRef.current) ro.observe(surfaceRef.current);
    return () => ro.disconnect();
  }, []);

  const placed = useMemo(() => {
    if (deskDimensions.W === 0) return [];
    const usableW = deskDimensions.W - 160;
    const usableH = deskDimensions.H - 40;
    const isMobile = deskDimensions.W < 500;
    const newPlaced = placeEnvelopes(deskLetters, usableW, usableH, isMobile);
    return newPlaced.map(p => ({ ...p, x: p.x + 80, y: p.y + 16, deskW: deskDimensions.W, deskH: deskDimensions.H }));
  }, [deskLetters, deskDimensions]);

  const prevDeskLettersRef = useRef<LetterMeta[]>(deskLetters);

  useEffect(() => {
    // Detect newly dropped letters (from mailbox to desk)
    const newLetters = deskLetters.filter(l => !prevDeskLettersRef.current.find(p => p.id === l.id));
    
    // `placed` is already synchronously updated, so we can check it immediately
    const allPlaced = newLetters.every(l => placed.find(p => p.id === l.id));
    
    if (newLetters.length > 0 && allPlaced) {
      const flights = newLetters.map(letter => {
        const p = placed.find(p => p.id === letter.id)!;
        const deskRect = surfaceRef.current!.getBoundingClientRect();
        const mailboxRect = mailboxRef.current!.getBoundingClientRect();
        const endRect = new DOMRect(deskRect.left + p.x, deskRect.top + p.y, p.width, p.height);
        
        return {
          envelope: p,
          startRect: mailboxRect,
          endRect,
          type: 'MAILBOX_TO_DESK' as const,
          onComplete: () => {}
        };
      });

      flyMultiple(flights, 150, () => {});

      prevDeskLettersRef.current = deskLetters;
      // Clear local hidden state since AnimationContext's hiddenEnvelopeIds will have taken over
      setLocalHidden(new Set());
    }
  }, [deskLetters, placed, flyEnvelope, mailboxRef]);

  // Empty desk hint
  const isEmpty = deskLetters.length === 0;

  const handleReturnAllTrigger = useCallback(() => {
    if (!collectionBoxRef.current || !mailboxRef.current) {
      onReturnAll();
      return;
    }

    const startRect = collectionBoxRef.current.getBoundingClientRect();
    const endRect = mailboxRef.current.getBoundingClientRect();

    const flights = collectionLetters.map(letter => ({
      envelope: { 
        ...letter, 
        x: 0, y: 0, deskW: 0, deskH: 0, 
        width: 160, height: 110, 
        rotation: (Math.random() - 0.5) * 20 
      },
      startRect,
      endRect,
      type: 'COLLECTION_TO_MAILBOX' as const,
      onComplete: () => {}, // individual completion callback
    }));

    flyMultiple(flights, 80, () => {
      onReturnAll();
    });
  }, [collectionLetters, collectionBoxRef, mailboxRef, flyMultiple, onReturnAll]);

  return (
    <div
      ref={surfaceRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'visible',
      }}
    >
      {/* Envelopes */}
      <AnimatePresence>
        {placed.map((env, i) => (
          <Envelope
            key={env.id}
            data={env}
            isOpened={openedLetterIds.includes(env.id)}
            onClick={() => onEnvelopeClick(env)}
            isHidden={hiddenEnvelopeIds.has(env.id) || localHidden.has(env.id)}
          />
        ))}
      </AnimatePresence>

      {/* Empty state hint */}
      <AnimatePresence>
        {isEmpty && mailboxCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <p style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.15rem',
              color: 'rgba(100,78,50,0.4)',
              textAlign: 'center',
              letterSpacing: '0.01em',
            }}>
              tap the mailbox to begin
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mailbox — left side */}
      <div
        style={{
          position: 'absolute',
          left: 8,
          bottom: 0,
          zIndex: 15,
        }}
      >
        <Mailbox count={mailboxCount} onDrop={onMailboxDrop} />
      </div>

      {/* Collection box — right side */}
      <div
        style={{
          position: 'absolute',
          right: 8,
          bottom: 0,
          zIndex: 15,
        }}
      >
        <CollectionBox
          count={collectionLetters.length}
          letters={collectionLetters}
          onOpen={onCollectionOpen}
          mailboxCount={mailboxCount}
          deskCount={deskLetters.length}
          onReturnAll={handleReturnAllTrigger}
        />
      </div>

      {/* Decorative: fountain pen */}
      <div style={{
        position: 'absolute', left: '38%', bottom: 12,
        transform: 'rotate(-20deg)', opacity: 0.45, zIndex: 3, pointerEvents: 'none',
      }}>
        <svg width="12" height="64" viewBox="0 0 12 64" fill="none" aria-hidden="true">
          <rect x="3" y="3" width="6" height="42" rx="3" fill="#2e2318"/>
          <path d="M3 45 L6 58 L9 45Z" fill="#c9924a"/>
          <rect x="2" y="1" width="8" height="7" rx="4" fill="#4a3828"/>
        </svg>
      </div>

      {/* Pressed flower */}
      <div style={{
        position: 'absolute', right: '34%', bottom: 14,
        transform: 'rotate(18deg)', opacity: 0.35, zIndex: 3, pointerEvents: 'none',
      }}>
        <svg width="20" height="24" viewBox="0 0 20 24" fill="none" aria-hidden="true">
          <line x1="10" y1="24" x2="10" y2="12" stroke="#8a9e8a" strokeWidth="0.9"/>
          {[0,45,90,135,180,225,270,315].map((a,i) => (
            <ellipse key={i}
              cx={10 + Math.cos(a*Math.PI/180)*4}
              cy={12 + Math.sin(a*Math.PI/180)*4}
              rx="2" ry="3.5"
              transform={`rotate(${a} ${10+Math.cos(a*Math.PI/180)*4} ${12+Math.sin(a*Math.PI/180)*4})`}
              fill="#c4907a" opacity="0.5"
            />
          ))}
          <circle cx="10" cy="12" r="2.5" fill="#c9924a" opacity="0.55"/>
        </svg>
      </div>
    </div>
  );
});

export default Desk;
