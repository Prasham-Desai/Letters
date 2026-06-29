'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LetterMeta } from '@/types/letter';
import { getLetterIndex } from '@/lib/letters';
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
      const envelopeEl = document.getElementById(`envelope-${activeLetter.id}`);
      if (envelopeEl && collectionBoxRef.current) {
        const startRect = envelopeEl.getBoundingClientRect();
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
          opacity: landingSeen ? 1 : 0,
          transition: 'opacity 0.8s ease',
        }}
      >
        {/* Deep floor shadow — makes the desk feel grounded */}
        <div style={{
          position: 'absolute', bottom: -40, left: '4%', right: '4%',
          height: 45,
          background: 'radial-gradient(ellipse 90% 100% at 50% 0%, rgba(40,24,8,0.35) 0%, transparent 75%)',
          filter: 'blur(12px)',
          zIndex: -1,
        }} aria-hidden="true" />

        {/* Desk legs — turned wood legs with subtle taper */}
        {[7, 93].map(pct => (
          <div key={pct} style={{
            position: 'absolute',
            bottom: -58, left: `${pct}%`,
            transform: 'translateX(-50%)',
            width: 16, height: 60,
            background: 'linear-gradient(175deg, #8a6428 0%, #6a4a1c 40%, #5a3a14 100%)',
            borderRadius: '2px 2px 6px 6px',
            zIndex: -1,
            boxShadow: '3px 2px 8px rgba(0,0,0,0.18), inset -2px 0 4px rgba(0,0,0,0.08)',
          }} aria-hidden="true">
            {/* Turned groove detail */}
            <div style={{
              position: 'absolute', top: 8, left: 2, right: 2, height: 3,
              background: 'linear-gradient(to bottom, rgba(255,200,100,0.12), rgba(0,0,0,0.08))',
              borderRadius: 1,
            }} />
            <div style={{
              position: 'absolute', top: 16, left: 2, right: 2, height: 2,
              background: 'rgba(0,0,0,0.06)',
              borderRadius: 1,
            }} />
          </div>
        ))}

        {/* Desk front face — carved apron with edge detail */}
        <div style={{
          position: 'absolute', bottom: -36, left: 0, right: 0,
          height: 40,
          background: 'linear-gradient(178deg, #9a7438 0%, #7a5820 50%, #6a4818 100%)',
          borderRadius: '0 0 8px 8px',
          boxShadow: '0 12px 36px rgba(40,22,6,0.42), inset 0 1px 0 rgba(255,200,120,0.12)',
          zIndex: 9,
        }} aria-hidden="true">
          {/* Carved edge groove */}
          <div style={{
            position: 'absolute', top: 4, left: '3%', right: '3%', height: 2,
            background: 'linear-gradient(to right, transparent 0%, rgba(255,200,120,0.10) 20%, rgba(255,200,120,0.10) 80%, transparent 100%)',
            borderRadius: 1,
          }} />
          {/* Wood grain lines on front face */}
          {[12, 20, 28].map(y => (
            <div key={y} style={{
              position: 'absolute', left: '3%', right: '3%', top: y,
              height: 1, background: 'rgba(0,0,0,0.06)',
            }} aria-hidden="true" />
          ))}
          {/* Bottom carved bead */}
          <div style={{
            position: 'absolute', bottom: 5, left: '3%', right: '3%', height: 2,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.08), rgba(255,200,120,0.06))',
            borderRadius: 1,
          }} />
        </div>

        {/* Desk surface */}
        <div style={{
          position: 'relative',
          height: 'min(580px, 68vh)',
          background: [
            /* Fine walnut grain */
            'repeating-linear-gradient(88deg, transparent, transparent 2px, rgba(90,60,20,0.05) 2px, rgba(90,60,20,0.05) 3px)',
            /* Medium grain variation */
            'repeating-linear-gradient(91deg, transparent, transparent 8px, rgba(60,40,12,0.035) 8px, rgba(60,40,12,0.035) 9px)',
            /* Broad plank joins */
            'repeating-linear-gradient(89deg, transparent, transparent 60px, rgba(40,24,8,0.02) 60px, rgba(40,24,8,0.02) 62px)',
            /* Cross-grain subtle knots */
            'repeating-linear-gradient(4deg, transparent, transparent 100px, rgba(80,50,18,0.012) 100px, rgba(80,50,18,0.012) 102px)',
            /* Primary walnut tone */
            'linear-gradient(162deg, #c89850 0%, #b88838 18%, #a87828 38%, #b08040 58%, #b88c48 75%, #c49858 100%)',
          ].join(', '),
          borderRadius: '8px 8px 0 0',
          boxShadow: [
            '0 -3px 0 0 rgba(255,215,130,0.12) inset', /* Top rim highlight */
            'inset 0 0 60px rgba(60,38,16,0.10)',       /* Subtle inner shadow */
            '0 -1px 0 0 rgba(0,0,0,0.08)',              /* Top edge line */
          ].join(', '),
          overflow: 'hidden',
        }}>
          {/* Top-left directional light highlight */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
            background: 'radial-gradient(ellipse 70% 60% at 20% 15%, rgba(255,220,140,0.14) 0%, transparent 60%)',
          }} aria-hidden="true" />

          {/* Edge highlight — left */}
          <div style={{
            position: 'absolute', top: 0, left: 0, bottom: 0, width: 3,
            background: 'linear-gradient(to right, rgba(255,210,130,0.10), transparent)',
            zIndex: 0,
          }} aria-hidden="true" />

          {/* Vignette */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
            background: 'radial-gradient(ellipse 85% 78% at 50% 50%, transparent 40%, rgba(50,30,8,0.20) 100%)',
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
                mailboxCount={mailboxIds.length}
                collectionLetters={collectionLetters}
                onEnvelopeClick={openLetter}
                onMailboxDrop={handleMailboxDrop}
                onCollectionOpen={openLetter}
                onReturnAll={resetLetters}
                openedLetterIds={collectionIds}
              />
            )}
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
