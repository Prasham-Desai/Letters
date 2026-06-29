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
  onEnvelopeClick: (letter: LetterMeta) => void;
  openedLetterIds: string[];
  activeLetterId?: string;
}

const Desk = memo(function Desk({
  deskLetters,
  onEnvelopeClick,
  openedLetterIds,
  activeLetterId,
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
        const mailboxRect = mailboxRef.current!.getBoundingClientRect();
        
        // Find the actual DOM node of the envelope to get its screen-space rect after 3D transforms
        const envElement = document.getElementById(`envelope-${letter.id}`);
        let endRect = new DOMRect(0, 0, p.width, p.height);
        if (envElement) {
          endRect = envElement.getBoundingClientRect();
        } else {
          // Fallback if not mounted for some reason
          const deskRect = surfaceRef.current!.getBoundingClientRect();
          endRect = new DOMRect(deskRect.left + p.x, deskRect.top + p.y, p.width, p.height);
        }
        
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
  }, [deskLetters, placed, flyEnvelope, mailboxRef, flyMultiple]);
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
            isHidden={hiddenEnvelopeIds.has(env.id) || localHidden.has(env.id) || env.id === activeLetterId}
          />
        ))}
      </AnimatePresence>
    </div>
  );
});

export default Desk;
