'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LetterMeta } from '@/types/letter';
import lettersData from '@/data/letters.json';
import { useLetterState } from '@/hooks/useLetterState';
import { useTimeOfDay } from '@/hooks/useTimeOfDay';
import { useAnimation } from '@/contexts/AnimationContext';
import LandingExperience from '@/components/loading/LandingExperience';
import Desk from '@/components/desk/Desk';
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
  const { flyEnvelope, collectionBoxRef } = useAnimation();

  const {
    mailboxIds, deskIds, collectionIds,
    dropToDesk, moveToCollection, resetLetters,
  } = useLetterState(allIds);

  useEffect(() => {
    // Load static data instead of calling a Node.js server action
    const data = lettersData as LetterMeta[];
    setLetters(data);
    setAllIds(data.map(l => l.id));
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

  return (
    <main
      style={{
        position: 'fixed', inset: 0, overflow: 'hidden',
      }}
    >
      <style>{`
        .responsive-title {
          position: fixed;
          top: 32px;
          left: 40px;
          font-family: var(--font-heading);
          font-size: 2.8rem;
          color: #4a3622;
          text-shadow: 0 2px 10px rgba(255,255,255,0.9), 0 1px 3px rgba(255,255,255,0.8), 0 4px 20px rgba(255,255,255,0.5);
          letter-spacing: 0.02em;
          z-index: 5;
          pointer-events: none;
          user-select: none;
          opacity: 0.95;
        }
        .desk-wrapper {
          position: absolute;
          left: 50%;
          top: 50%;
          width: min(960px, 90vw);
          transform: translate(-50%, -50%);
          z-index: 10;
          will-change: transform;
          transition: opacity 0.8s ease;
        }
        .desk-surface {
          position: relative;
          height: min(580px, 68vh);
          background-color: #4a3726;
          border: 3px solid #140d0a;
          border-radius: 8px 12px 0 0;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .responsive-title {
            top: 16px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 2.2rem;
            width: 100%;
            text-align: center;
          }
          .desk-wrapper {
            width: 95vw;
            top: 55%;
          }
          .desk-surface {
            height: min(650px, 75vh);
          }
        }
      `}</style>
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
        className="desk-wrapper"
        style={{
          opacity: landingSeen ? 1 : 0,
        }}
      >
        {/* Doodle Desk shadow */}
        <div style={{
          position: 'absolute', bottom: -44, left: '6%', right: '4%',
          height: 20,
          backgroundColor: 'rgba(0,0,0,0.08)',
          borderRadius: '50%',
          zIndex: -2,
        }} aria-hidden="true" />

        {/* Doodle Desk legs */}
        {[8, 92].map(pct => (
          <div key={pct} style={{
            position: 'absolute',
            bottom: -50, left: `${pct}%`,
            transform: 'translateX(-50%)',
            width: 14, height: 50,
            backgroundColor: '#38281c',
            border: '3px solid #140d0a',
            borderRadius: '2px 2px 8px 12px',
            zIndex: -1,
          }} aria-hidden="true" />
        ))}

        {/* Doodle Desk front face */}
        <div style={{
          position: 'absolute', bottom: -30, left: -2, right: -2,
          height: 34,
          backgroundColor: '#302217',
          border: '3px solid #140d0a',
          borderRadius: '0 0 6px 14px',
          zIndex: 9,
        }} aria-hidden="true">
          {/* Doodle detail line */}
          <div style={{
            position: 'absolute', bottom: 6, left: 8, right: 12, height: 3,
            backgroundColor: '#140d0a', opacity: 0.15,
            borderRadius: '5px',
          }} />
        </div>

        {/* Doodle Desk surface */}
        <div className="desk-surface">


          {/* Desk content */}
          <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%' }}>
            {letters.length > 0 && (
              <Desk
                deskLetters={deskLetters}
                mailboxCount={mailboxIds.length}
                collectionLetters={collectionLetters}
                onEnvelopeClick={openLetter}
                onMailboxDrop={handleMailboxDrop}
                onCollectionOpen={openLetter}
                onReturnAll={resetLetters}
                openedLetterIds={collectionIds}
                activeLetterId={activeLetter?.id}
              />
            )}
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="responsive-title" aria-hidden="true">
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
