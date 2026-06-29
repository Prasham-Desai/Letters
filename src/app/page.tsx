'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LetterMeta } from '@/types/letter';
import { getLetterIndex } from '@/lib/letters';
import { useLetterState } from '@/hooks/useLetterState';
import { useAnimation } from '@/contexts/AnimationContext';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import LandingExperience from '@/components/loading/LandingExperience';
import Desk from '@/components/desk/Desk';
import Mailbox from '@/components/mailbox/Mailbox';
import CollectionBox from '@/components/collection/CollectionBox';
import LetterReader from '@/components/letter/LetterReader';
import CustomCursor from '@/components/cursor/CustomCursor';
import DustParticles from '@/components/ambience/DustParticles';
import AmbientEvents from '@/components/ambience/AmbientEvents';
import Doodles from '@/components/doodles/Doodle';
import RoomScene from '@/components/environment/RoomScene';

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

  const env = useEnvironment();
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
      const x = (e.clientX / window.innerWidth  - 0.5) * 6;
      const y = (e.clientY / window.innerHeight - 0.5) * 3;
      deskRef.current.style.transform = `translate(${x}px, ${y}px)`;
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
      deskRef.current.style.transform = 'translate(0px, 0px)';
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
      onComplete: () => {},
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

      {/* ── ROOM SCENE — immersive environment ── */}
      <RoomScene visible={landingSeen}>
        {/* This is the envelope area inside the desk surface */}
        <div
          ref={deskRef}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            willChange: 'transform',
          }}
        >
          {letters.length > 0 && (
            <Desk
              deskLetters={deskLetters}
              onEnvelopeClick={openLetter}
              openedLetterIds={collectionIds}
              activeLetterId={activeLetter?.id}
            />
          )}
        </div>
      </RoomScene>

      {/* Ambient layers (above room, below UI) */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 8 }}>
        <DustParticles />
      </div>
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 9 }}>
        <AmbientEvents />
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 9 }}>
        <Doodles />
      </div>

      {/* Mailbox — desk-integrated, left side */}
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

      {/* Collection Box — desk-integrated, right side */}
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

      {/* Title — integrated into the room */}
      <div style={{
        position: 'fixed', top: 32, left: 40,
        fontFamily: 'var(--font-heading)', fontSize: '2.8rem',
        color: env.isNight ? '#d4c8b0' : '#4a3622',
        textShadow: env.isNight
          ? '0 2px 10px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.4)'
          : '0 2px 10px rgba(255,255,255,0.9), 0 1px 3px rgba(255,255,255,0.8), 0 4px 20px rgba(255,255,255,0.5)',
        letterSpacing: '0.02em',
        zIndex: 12, pointerEvents: 'none', userSelect: 'none',
        opacity: 0.95,
        transition: 'color 3s ease, text-shadow 3s ease',
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
