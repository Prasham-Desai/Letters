'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LetterMeta } from '@/types/letter';
import { getLetterIndex } from '@/lib/letters';
import { useLetterState } from '@/hooks/useLetterState';
import { useTimeOfDay } from '@/hooks/useTimeOfDay';
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

  const {
    mailboxIds, deskIds, collectionIds,
    dropToDesk, moveToCollection,
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
    const toDrop = mailboxIds.slice(0, DROP_COUNT);
    if (toDrop.length > 0) dropToDesk(toDrop);
  }, [mailboxIds, dropToDesk]);

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
    if (activeLetter) moveToCollection(activeLetter.id);
    setActiveLetter(null);
    setActiveContent('');
    letterOpen.current = false;
  }, [activeLetter, moveToCollection]);

  const deskLetters       = letters.filter(l => deskIds.includes(l.id));
  const collectionLetters = letters.filter(l => collectionIds.includes(l.id));

  return (
    <main
      style={{
        position: 'fixed', inset: 0, overflow: 'hidden',
        // Single warm cream background
        backgroundColor: '#ece5d8',
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
          width: 'min(960px, 90vw)',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          willChange: 'transform',
          // Fade in after landing
          opacity: landingSeen ? 1 : 0,
          transition: 'opacity 0.8s ease',
        }}
      >
        {/* Floor shadow */}
        <div style={{
          position: 'absolute', bottom: -30, left: '6%', right: '6%',
          height: 30,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(60,38,12,0.25) 0%, transparent 78%)',
          filter: 'blur(8px)',
          zIndex: -1,
        }} aria-hidden="true" />

        {/* Desk legs */}
        {[7, 93].map(pct => (
          <div key={pct} style={{
            position: 'absolute',
            bottom: -50, left: `${pct}%`,
            transform: 'translateX(-50%)',
            width: 14, height: 52,
            background: 'linear-gradient(to bottom, #8a6228, #6a4a1c)',
            borderRadius: '0 0 4px 4px',
            zIndex: -1,
            boxShadow: '2px 0 6px rgba(0,0,0,0.12)',
          }} aria-hidden="true" />
        ))}

        {/* Desk front face */}
        <div style={{
          position: 'absolute', bottom: -30, left: 0, right: 0,
          height: 34,
          background: 'linear-gradient(175deg, #9a7438 0%, #7a5820 100%)',
          borderRadius: '0 0 6px 6px',
          boxShadow: '0 10px 28px rgba(40,22,6,0.38)',
          zIndex: 9,
        }} aria-hidden="true">
          {[7, 18, 26].map(y => (
            <div key={y} style={{
              position: 'absolute', left: '4%', right: '4%', top: y,
              height: 1, background: 'rgba(0,0,0,0.08)',
            }} aria-hidden="true" />
          ))}
        </div>

        {/* Desk surface */}
        <div style={{
          position: 'relative',
          height: 'min(580px, 68vh)',
          background: [
            'repeating-linear-gradient(92deg, transparent, transparent 3px, rgba(0,0,0,0.011) 3px, rgba(0,0,0,0.011) 4px)',
            'repeating-linear-gradient(2deg, transparent, transparent 52px, rgba(0,0,0,0.006) 52px, rgba(0,0,0,0.006) 53px)',
            'linear-gradient(158deg, #d8b472 0%, #c89850 22%, #b87e38 52%, #c49450 80%, #d0a05c 100%)',
          ].join(', '),
          borderRadius: '6px 6px 0 0',
          boxShadow: '0 -3px 0 0 rgba(255,215,130,0.15) inset',
          overflow: 'hidden',
        }}>
          {/* Top highlight */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 8,
            background: 'linear-gradient(to bottom, rgba(255,220,140,0.2), transparent)',
            zIndex: 0,
          }} aria-hidden="true" />

          {/* Vignette */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
            background: 'radial-gradient(ellipse 88% 80% at 50% 50%, transparent 42%, rgba(55,32,8,0.18) 100%)',
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

          {/* Desk content */}
          <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%' }}>
            <Desk
              deskLetters={deskLetters}
              mailboxCount={mailboxIds.length}
              collectionLetters={collectionLetters}
              onEnvelopeClick={openLetter}
              onMailboxDrop={handleMailboxDrop}
              onCollectionOpen={openLetter}
              openedLetterIds={collectionIds}
            />
          </div>
        </div>
      </div>

      {/* Title */}
      <div style={{
        position: 'fixed', top: 32, left: 40,
        fontFamily: 'var(--font-heading)', fontSize: '2.2rem',
        color: 'rgba(90,68,38,0.7)',
        textShadow: '0 2px 4px rgba(255,255,255,0.4)',
        zIndex: 5, pointerEvents: 'none', userSelect: 'none',
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
