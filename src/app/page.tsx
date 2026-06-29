'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LetterMeta } from '@/types/letter';
import { getLetterIndex } from '@/lib/letters';
import { useLetterState } from '@/hooks/useLetterState';
import { useTimeOfDay } from '@/hooks/useTimeOfDay';
import { useAnimation } from '@/contexts/AnimationContext';
import LandingExperience from '@/components/loading/LandingExperience';
import Desk from '@/components/desk/Desk';
import Mailbox from '@/components/mailbox/Mailbox';
import CollectionBox from '@/components/collection/CollectionBox';
import LetterReader from '@/components/letter/LetterReader';
import CustomCursor from '@/components/cursor/CustomCursor';
import DustParticles from '@/components/ambience/DustParticles';
import AmbientEvents from '@/components/ambience/AmbientEvents';
import Doodles from '@/components/doodles/Doodle';

const DROP_COUNT = 5;

export default function Home() {
  const [letters, setLetters]     = useState<LetterMeta[]>([]);
  const [allIds, setAllIds]       = useState<string[]>([]);
  const [activeLetter, setActiveLetter] = useState<LetterMeta | null>(null);
  const [activeContent, setActiveContent] = useState('');
  const [landingSeen, setLandingSeen] = useState(false);

  // Use ref for desk parallax — avoids React re-renders on every mousemove
  const deskRef  = useRef<HTMLDivElement>(null);
  const letterOpen = useRef(false);

  const timeOfDay = useTimeOfDay();
  const { flyEnvelope, collectionBoxRef, mailboxRef, flyMultiple } = useAnimation();

  const {
    mailboxIds, deskIds, collectionIds,
    dropToDesk, moveToCollection, resetLetters,
  } = useLetterState(allIds);

  useEffect(() => {
    getLetterIndex().then(data => {
      setLetters(data);
      setAllIds(data.map(l => l.id));
    });
  }, []);

  // Parallax via direct DOM — zero React re-renders
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!deskRef.current || letterOpen.current) return;
      const x = (e.clientX / window.innerWidth  - 0.5) * 9;
      const y = (e.clientY / window.innerHeight - 0.5) * 5;
      deskRef.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);



  const handleLandingComplete = useCallback(() => setLandingSeen(true), [setLandingSeen]);

  const handleMailboxDrop = useCallback(() => {
    const spaceLeft = Math.max(0, DROP_COUNT - deskIds.length);
    const toDrop = mailboxIds.slice(0, spaceLeft);
    if (toDrop.length > 0) dropToDesk(toDrop);
  }, [mailboxIds, deskIds.length, dropToDesk]);

  const openLetter = useCallback(async (letter: LetterMeta) => {
    letterOpen.current = true;
    // Freeze desk parallax at center
    if (deskRef.current) {
      deskRef.current.style.transform = 'translate(-50%, -50%)';
    }
    const file = letter.file.replace('.md', '');
    const res  = await fetch(`/letters/${file}.md`);
    const text = res.ok ? await res.text() : '';
    setActiveContent(text);
    setActiveLetter(letter);
  }, []);

  const handleClose = useCallback(() => {
    if (activeLetter) {
      if (collectionBoxRef.current) {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const startRect = new DOMRect(cx - 80, cy - 55, 160, 110);
        const endRect = collectionBoxRef.current.getBoundingClientRect();
        
        // We simulate a PlacedEnvelope just for rendering the flight clone
        const pEnv = { 
          ...activeLetter, 
          x: 0, y: 0, deskW: 0, deskH: 0, width: 160, height: 110, 
          rotation: (Math.random() - 0.5) * 20 
        };

        flyEnvelope(pEnv as any, startRect, endRect, 'DESK_TO_COLLECTION', () => {
          moveToCollection(activeLetter.id);
        });
      } else {
        moveToCollection(activeLetter.id);
      }
    }
    setActiveLetter(null);
    setActiveContent('');
    letterOpen.current = false;
  }, [activeLetter, moveToCollection, flyEnvelope, collectionBoxRef]);

  const deskLetters       = letters.filter(l => deskIds.includes(l.id));
  const collectionLetters = letters.filter(l => collectionIds.includes(l.id));

  const handleReturnAllTrigger = useCallback(() => {
    if (!collectionBoxRef.current || !mailboxRef.current) {
      resetLetters();
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
      resetLetters();
    });
  }, [collectionLetters, collectionBoxRef, mailboxRef, flyMultiple, resetLetters]);

  return (
    <main
      style={{
        position: 'fixed', inset: 0, overflow: 'hidden',
      }}
    >
      <CustomCursor />

      {/* Landing — only first visit */}
      {!landingSeen && <LandingExperience onComplete={handleLandingComplete} />}

      {/* Ambient layers */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <DustParticles />
      </div>
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
        <AmbientEvents />
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        <Doodles />
      </div>

      {/* ── DESK — parallax via direct DOM, no React state ── */}
      <div
        ref={deskRef}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 'calc(100vw + 60px)',
          height: 'calc(100vh + 60px)',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          willChange: 'transform',
          opacity: landingSeen ? 1 : 0,
          transition: 'opacity 0.8s ease',
        }}
      >
        {/* Desk surface (Full bleed sleek tray) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: [
            /* Fine walnut grain */
            'repeating-linear-gradient(88deg, transparent, transparent 2px, rgba(90,60,20,0.05) 2px, rgba(90,60,20,0.05) 3px)',
            /* Medium grain variation */
            'repeating-linear-gradient(91deg, transparent, transparent 8px, rgba(60,40,12,0.035) 8px, rgba(60,40,12,0.035) 9px)',
            /* Primary walnut tone */
            'linear-gradient(162deg, #c89850 0%, #b88838 18%, #a87828 38%, #b08040 58%, #b88c48 75%, #c49858 100%)',
          ].join(', '),
          boxShadow: 'inset 0 0 120px rgba(40,20,8,0.3)',
          overflow: 'hidden',
        }}>
          {/* Top-left directional light highlight */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
            background: 'radial-gradient(ellipse 70% 60% at 20% 15%, rgba(255,220,140,0.18) 0%, transparent 60%)',
          }} aria-hidden="true" />

          {/* Vignette */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
            background: 'radial-gradient(ellipse 85% 78% at 50% 50%, transparent 40%, rgba(30,15,5,0.3) 100%)',
          }} aria-hidden="true" />

          {/* Time-of-day warm tint */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
            background: timeOfDay === 'night'
              ? 'rgba(30,40,80,0.14)'
              : timeOfDay === 'evening'
              ? 'rgba(180,100,40,0.10)'
              : timeOfDay === 'morning'
              ? 'rgba(255,200,100,0.07)'
              : 'transparent',
            transition: 'background 3s ease',
          }} aria-hidden="true" />

          {/* Paper texture noise overlay */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.02\'/%3E%3C/svg%3E")',
            backgroundSize: '200px 200px',
          }} aria-hidden="true" />

          {/* Desk content */}
          <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%' }}>
            {letters.length > 0 && (
              <Desk
                deskLetters={deskLetters}
                onEnvelopeClick={openLetter}
                openedLetterIds={collectionIds}
                activeLetterId={activeLetter?.id}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mailbox (Fixed Left) */}
      <div style={{
        position: 'fixed',
        left: 20,
        bottom: 20,
        zIndex: 15,
        opacity: landingSeen ? 1 : 0,
        transition: 'opacity 1.2s ease 0.5s',
      }}>
        <Mailbox count={mailboxIds.length} onDrop={handleMailboxDrop} />
      </div>

      {/* Collection Box (Fixed Right) */}
      <div style={{
        position: 'fixed',
        right: 20,
        bottom: 20,
        zIndex: 15,
        opacity: landingSeen ? 1 : 0,
        transition: 'opacity 1.2s ease 0.5s',
      }}>
        <CollectionBox
          count={collectionLetters.length}
          letters={collectionLetters}
          onOpen={openLetter}
          mailboxCount={mailboxIds.length}
          deskCount={deskLetters.length}
          onReturnAll={handleReturnAllTrigger}
        />
      </div>

      {/* Title */}
      <div style={{
        position: 'fixed', top: 32, left: 40,
        fontFamily: 'var(--font-heading)', fontSize: '2.8rem',
        color: '#4a3622',
        textShadow: '0 2px 10px rgba(255,255,255,0.9), 0 1px 3px rgba(255,255,255,0.8), 0 4px 20px rgba(255,255,255,0.5)',
        letterSpacing: '0.02em',
        zIndex: 5, pointerEvents: 'none', userSelect: 'none',
        opacity: 0.95,
      }} aria-hidden="true">
        when you need me
      </div>

      {/* Letter reader */}
      <LetterReader
        letter={activeLetter}
        content={activeContent}
        onClose={handleClose}
      />
    </main>
  );
}
