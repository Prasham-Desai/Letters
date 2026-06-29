'use client';
import { memo, useEffect, useState } from 'react';
import { useEnvironment } from '@/contexts/EnvironmentContext';

const Cat = memo(function Cat() {
  const env = useEnvironment();
  const [earTwitch, setEarTwitch] = useState(false);
  const [tailFlick, setTailFlick] = useState(false);

  useEffect(() => {
    // Ear twitch interval
    const earInterval = setInterval(() => {
      if (Math.random() > 0.5 && !env.isNight) {
        setEarTwitch(true);
        setTimeout(() => setEarTwitch(false), 300);
      }
    }, 25000);

    // Tail flick interval
    const tailInterval = setInterval(() => {
      if (Math.random() > 0.3) {
        setTailFlick(true);
        setTimeout(() => setTailFlick(false), 2000); // Wait for animation to finish
      }
    }, 45000);

    return () => {
      clearInterval(earInterval);
      clearInterval(tailInterval);
    };
  }, [env.isNight]);

  return (
    <div
      style={{
        width: '90px',
        height: '50px',
        pointerEvents: 'none',
        position: 'relative',
        filter: env.isNight ? 'brightness(0.6) sepia(0.2) hue-rotate(-20deg)' : 'none',
        transition: 'filter 3s ease',
      }}
      role="img"
      aria-label="A cat sleeping peacefully on the windowsill"
    >
      <svg width="100%" height="100%" viewBox="0 0 100 60" fill="none" style={{ animation: 'cat-breathe 4s infinite ease-in-out' }}>
        <defs>
          <linearGradient id="cat-fur" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d89868" />
            <stop offset="50%" stopColor="#c4885a" />
            <stop offset="100%" stopColor="#a06838" />
          </linearGradient>
          <linearGradient id="cat-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(100,50,20,0.4)" />
          </linearGradient>
        </defs>

        {/* Drop shadow */}
        <ellipse cx="50" cy="54" rx="42" ry="6" fill="rgba(40,20,10,0.3)" />

        {/* Tail */}
        <g style={{
          transformOrigin: '80px 48px',
          animation: tailFlick ? 'tail-flick 2s ease-in-out' : 'none'
        }}>
          <path d="M 75 48 C 95 48, 100 35, 90 25 C 85 20, 75 25, 80 32" stroke="url(#cat-fur)" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M 75 48 C 95 48, 100 35, 90 25 C 85 20, 75 25, 80 32" stroke="url(#cat-shadow)" strokeWidth="8" strokeLinecap="round" fill="none" />
          {/* Tail stripes */}
          <path d="M 85 30 L 93 25 M 88 38 L 96 32 M 82 45 L 90 40" stroke="#a06838" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />
        </g>

        {/* Body */}
        <ellipse cx="48" cy="38" rx="36" ry="16" fill="url(#cat-fur)" />
        <ellipse cx="48" cy="38" rx="36" ry="16" fill="url(#cat-shadow)" />

        {/* Body stripes */}
        <path d="M 30 25 Q 35 35 32 45 M 40 23 Q 45 35 42 48 M 50 22 Q 55 35 52 50 M 60 23 Q 65 35 62 48 M 70 26 Q 75 35 72 45" stroke="#a06838" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.4" />

        {/* Head */}
        <circle cx="28" cy="32" r="14" fill="url(#cat-fur)" />
        <circle cx="28" cy="32" r="14" fill="url(#cat-shadow)" opacity="0.5" />

        {/* Ears */}
        <g style={{
          transformOrigin: '28px 32px',
          transform: earTwitch ? 'rotate(-5deg)' : 'none',
          transition: 'transform 0.1s ease-in-out'
        }}>
          {/* Left ear */}
          <path d="M 16 26 L 14 12 L 24 20 Z" fill="url(#cat-fur)" />
          <path d="M 17 24 L 16 16 L 22 21 Z" fill="#d4a090" opacity="0.7" />
          {/* Right ear */}
          <path d="M 32 20 L 40 10 L 40 24 Z" fill="url(#cat-fur)" />
          <path d="M 34 21 L 38 14 L 38 23 Z" fill="#d4a090" opacity="0.7" />
        </g>

        {/* Head stripes */}
        <path d="M 24 20 Q 28 25 32 20 M 26 22 L 28 26 L 30 22" stroke="#a06838" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />

        {/* Eyes (closed) */}
        <path d="M 18 34 Q 21 36 24 34 M 32 34 Q 35 36 38 34" stroke="#5a3828" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        
        {/* Nose */}
        <circle cx="28" cy="38" r="1.5" fill="#d4a090" />

        {/* Paws tucked in */}
        <ellipse cx="22" cy="48" rx="6" ry="4" fill="url(#cat-fur)" />
        <ellipse cx="22" cy="48" rx="6" ry="4" fill="rgba(100,50,20,0.3)" />
      </svg>
    </div>
  );
});

export default Cat;
