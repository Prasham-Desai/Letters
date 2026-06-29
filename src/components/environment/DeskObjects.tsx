'use client';

import React, { memo, useMemo, useEffect, useState } from 'react';
import { useEnvironment } from '@/contexts/EnvironmentContext';

// ─── Palette ────────────────────────────────────────────
const P = {
  brass:      '#c4a050',
  brassLight: '#e8cc78',
  brassDark:  '#8a7030',
  wood:       '#b08848',
  woodDark:   '#8a6828',
  sage:       '#8a9e8a',
  sageDark:   '#6a7e6a',
  terracotta: '#c4785a',
  cream:      '#f5f0e8',
  ink:        '#2e2820',
  inkBlue:    '#1a2838',
  burgundy:   '#7a2828',
  leather:    '#5a3828',
  leatherDk:  '#3a2418',
};

// ─── Unique ID prefix (SSR-safe) ────────────────────────
let idCounter = 0;
function useUniqueId(prefix: string) {
  const [id] = useState(() => `${prefix}-${++idCounter}`);
  return id;
}

// ─── Brass Alarm Clock ──────────────────────────────────
function BrassAlarmClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hours   = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const hourAngle   = hours * 30 + minutes * 0.5;
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  const clockId = useUniqueId('clock');

  return (
    <svg width="40" height="45" viewBox="0 0 40 45" fill="none" aria-hidden="true">
      <style>{`
        @keyframes tick-${clockId} {
          0%, 90% { transform: rotate(0deg); }
          95% { transform: rotate(3deg); }
          100% { transform: rotate(0deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .second-hand-${clockId} { animation: none !important; }
        }
      `}</style>
      {/* Bells */}
      <ellipse cx="12" cy="6" rx="6" ry="4" fill={P.brassDark} />
      <ellipse cx="28" cy="6" rx="6" ry="4" fill={P.brassDark} />
      {/* Bell connector */}
      <rect x="18" y="2" width="4" height="6" rx="2" fill={P.brassDark} />
      {/* Feet */}
      <rect x="10" y="40" width="4" height="5" rx="1" fill={P.brassDark} transform="rotate(-10 12 42)" />
      <rect x="26" y="40" width="4" height="5" rx="1" fill={P.brassDark} transform="rotate(10 28 42)" />
      {/* Body */}
      <circle cx="20" cy="24" r="16" fill={P.brass} />
      <circle cx="20" cy="24" r="14.5" fill={P.cream} />
      <circle cx="20" cy="24" r="14" fill="#f8f4ec" />
      {/* Hour marks */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x1 = 20 + Math.cos(angle) * 11.5;
        const y1 = 24 + Math.sin(angle) * 11.5;
        const x2 = 20 + Math.cos(angle) * 13;
        const y2 = 24 + Math.sin(angle) * 13;
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={P.brassDark}
            strokeWidth={i % 3 === 0 ? 1.2 : 0.6}
            strokeLinecap="round"
          />
        );
      })}
      {/* Hour hand */}
      <line
        x1="20" y1="24"
        x2={20 + Math.cos((hourAngle - 90) * Math.PI / 180) * 7}
        y2={24 + Math.sin((hourAngle - 90) * Math.PI / 180) * 7}
        stroke={P.ink}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Minute hand */}
      <line
        x1="20" y1="24"
        x2={20 + Math.cos((minuteAngle - 90) * Math.PI / 180) * 10}
        y2={24 + Math.sin((minuteAngle - 90) * Math.PI / 180) * 10}
        stroke={P.ink}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Second hand */}
      <line
        className={`second-hand-${clockId}`}
        x1="20" y1="24"
        x2={20 + Math.cos((secondAngle - 90) * Math.PI / 180) * 11}
        y2={24 + Math.sin((secondAngle - 90) * Math.PI / 180) * 11}
        stroke={P.terracotta}
        strokeWidth="0.5"
        strokeLinecap="round"
        style={{ transformOrigin: '20px 24px' }}
      />
      {/* Center pin */}
      <circle cx="20" cy="24" r="1.2" fill={P.brass} />
    </svg>
  );
}

// ─── Pencil Holder ──────────────────────────────────────
function PencilHolder() {
  return (
    <svg width="35" height="50" viewBox="0 0 35 50" fill="none" aria-hidden="true">
      {/* Cup body */}
      <path
        d="M6 16 L5 46 Q5 49 8 49 L27 49 Q30 49 30 46 L29 16 Z"
        fill={P.sage}
        stroke={P.sageDark}
        strokeWidth="0.5"
      />
      {/* Cup rim */}
      <ellipse cx="17.5" cy="16" rx="12" ry="3" fill={P.sageDark} />
      <ellipse cx="17.5" cy="16" rx="11" ry="2.5" fill={P.sage} />
      {/* Pencil 1 — yellow */}
      <line x1="11" y1="4" x2="13" y2="16" stroke="#d4b050" strokeWidth="2" strokeLinecap="round" />
      <line x1="11" y1="4" x2="11.3" y2="6" stroke="#e8d888" strokeWidth="2" strokeLinecap="round" />
      <polygon points="10.7,2 11.3,2 11.1,4" fill={P.wood} />
      {/* Pencil 2 — red */}
      <line x1="18" y1="2" x2="19" y2="16" stroke={P.terracotta} strokeWidth="2" strokeLinecap="round" />
      <polygon points="17.7,0 18.3,0 18.1,2" fill={P.wood} />
      {/* Pencil 3 — green */}
      <line x1="24" y1="6" x2="23" y2="16" stroke="#6a8a5a" strokeWidth="2" strokeLinecap="round" />
      <polygon points="23.7,4 24.3,4 24.1,6" fill={P.wood} />
      {/* Brush */}
      <line x1="15" y1="8" x2="16" y2="16" stroke={P.woodDark} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14.5 3 Q15 2 15.5 3 L16.2 8 L14 8 Z" fill="#3a3028" />
    </svg>
  );
}

// ─── Ink Bottle ─────────────────────────────────────────
function InkBottle() {
  const inkId = useUniqueId('ink');
  return (
    <svg width="25" height="30" viewBox="0 0 50 60" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${inkId}-glass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(200,210,220,0.35)" />
          <stop offset="100%" stopColor="rgba(160,180,200,0.2)" />
        </linearGradient>
      </defs>
      {/* Bottle body */}
      <path
        d="M12 20 L10 50 Q10 55 15 55 L30 55 Q35 55 35 50 L33 20 Z"
        fill={`url(#${inkId}-glass)`}
        stroke="rgba(120,140,160,0.4)"
        strokeWidth="0.8"
      />
      {/* Ink fill */}
      <path
        d="M11 32 L10 50 Q10 55 15 55 L30 55 Q35 55 35 50 L34 32 Z"
        fill={P.inkBlue}
        opacity="0.85"
      />
      {/* Bottle neck */}
      <rect x="17" y="14" width="11" height="8" rx="1" fill={`url(#${inkId}-glass)`} stroke="rgba(120,140,160,0.4)" strokeWidth="0.6" />
      {/* Cork */}
      <rect x="18" y="10" width="9" height="5" rx="2" fill="#c4a070" />
      <line x1="19" y1="12" x2="26" y2="12" stroke="#b09060" strokeWidth="0.5" />
      {/* Glass highlight */}
      <line x1="14" y1="22" x2="13" y2="38" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Fountain pen beside bottle */}
      <line x1="38" y1="12" x2="46" y2="55" stroke="#2a2420" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M46 55 L47.5 60 L44.5 60 Z" fill={P.brass} />
      {/* Pen clip */}
      <rect x="37.5" y="14" width="3" height="8" rx="0.5" fill={P.brass} opacity="0.7" />
    </svg>
  );
}

// ─── Coffee Mug ─────────────────────────────────────────
function CoffeeMug({ showSteam }: { showSteam: boolean }) {
  const mugId = useUniqueId('mug');
  return (
    <svg width="30" height="35" viewBox="0 0 30 35" fill="none" aria-hidden="true">
      <style>{`
        @keyframes steam-${mugId}-1 {
          0%   { opacity: 0; transform: translateY(0); }
          30%  { opacity: 0.5; }
          100% { opacity: 0; transform: translateY(-8px); }
        }
        @keyframes steam-${mugId}-2 {
          0%   { opacity: 0; transform: translateY(0); }
          40%  { opacity: 0.45; }
          100% { opacity: 0; transform: translateY(-9px); }
        }
        @keyframes steam-${mugId}-3 {
          0%   { opacity: 0; transform: translateY(0); }
          35%  { opacity: 0.35; }
          100% { opacity: 0; transform: translateY(-7px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .steam-${mugId} { animation: none !important; opacity: 0 !important; }
        }
      `}</style>
      {/* Steam wisps */}
      {showSteam && (
        <g className={`steam-${mugId}`}>
          <path
            d="M9 9 Q7 5 9 2"
            stroke="rgba(200,190,175,0.5)"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            style={{ animation: `steam-${mugId}-1 3.5s ease-in-out infinite` }}
          />
          <path
            d="M13 8 Q15 4 13 1"
            stroke="rgba(200,190,175,0.4)"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
            style={{ animation: `steam-${mugId}-2 4s ease-in-out 0.8s infinite` }}
          />
          <path
            d="M17 9 Q16 5 18 2"
            stroke="rgba(200,190,175,0.35)"
            strokeWidth="0.7"
            fill="none"
            strokeLinecap="round"
            style={{ animation: `steam-${mugId}-3 3.8s ease-in-out 1.5s infinite` }}
          />
        </g>
      )}
      {/* Mug body */}
      <path
        d="M3 10 L2 30 Q2 33 5 33 L19 33 Q22 33 22 30 L21 10 Z"
        fill={P.terracotta}
      />
      {/* Handle */}
      <path
        d="M22 14 Q28 14 28 21 Q28 28 22 28"
        fill="none"
        stroke={P.terracotta}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Rim */}
      <ellipse cx="12" cy="10" rx="9.5" ry="2.5" fill="#d08a6a" />
      {/* Coffee surface */}
      <ellipse cx="12" cy="10.5" rx="8.5" ry="2" fill="#3a2818" opacity="0.8" />
      {/* Highlight */}
      <line x1="5" y1="14" x2="5" y2="28" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Candle Holder ──────────────────────────────────────
function CandleHolder({ lit }: { lit: boolean }) {
  const candleId = useUniqueId('candle');
  return (
    <svg width="20" height="40" viewBox="0 0 20 40" fill="none" aria-hidden="true">
      <style>{`
        @keyframes flame-${candleId} {
          0%, 100% { transform: scaleX(1) scaleY(1); }
          25%  { transform: scaleX(0.85) scaleY(1.1); }
          50%  { transform: scaleX(1.05) scaleY(0.92); }
          75%  { transform: scaleX(0.9) scaleY(1.06); }
        }
        @media (prefers-reduced-motion: reduce) {
          .flame-${candleId} { animation: none !important; }
        }
      `}</style>
      {/* Base plate */}
      <ellipse cx="10" cy="37" rx="8" ry="2.5" fill={P.brassDark} />
      {/* Stem */}
      <rect x="8" y="26" width="4" height="12" rx="1" fill={P.brass} />
      {/* Drip tray */}
      <ellipse cx="10" cy="26" rx="6" ry="2" fill={P.brass} />
      {/* Candle */}
      <rect x="7" y="10" width="6" height="17" rx="1" fill={P.cream} />
      <rect x="7" y="10" width="6" height="17" rx="1" fill="rgba(220,210,190,0.4)" />
      {/* Wick */}
      <line x1="10" y1="7" x2="10" y2="10" stroke="#3a3028" strokeWidth="0.6" />
      {/* Flame (when lit) */}
      {lit && (
        <g
          className={`flame-${candleId}`}
          style={{ transformOrigin: '10px 7px', animation: `flame-${candleId} 0.8s ease-in-out infinite` }}
        >
          <ellipse cx="10" cy="5" rx="2.5" ry="4" fill="rgba(255,180,50,0.7)" />
          <ellipse cx="10" cy="5.5" rx="1.5" ry="2.8" fill="rgba(255,220,100,0.8)" />
          <ellipse cx="10" cy="6" rx="0.8" ry="1.5" fill="rgba(255,255,200,0.9)" />
          {/* Glow */}
          <circle cx="10" cy="6" r="7" fill="rgba(255,180,60,0.08)" />
        </g>
      )}
      {/* Wax drip */}
      <path d="M8 12 Q7.5 14 8 15" stroke={P.cream} strokeWidth="1" fill="none" opacity="0.7" />
    </svg>
  );
}

// ─── Tiny Plant ─────────────────────────────────────────
function TinyPlant() {
  const plantId = useUniqueId('plant');
  return (
    <svg width="30" height="35" viewBox="0 0 30 35" fill="none" aria-hidden="true">
      <style>{`
        @keyframes sway-${plantId} {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(2deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .plant-sway-${plantId} { animation: none !important; }
        }
      `}</style>
      {/* Pot */}
      <path d="M7 20 L5 33 Q5 35 8 35 L22 35 Q25 35 25 33 L23 20 Z" fill={P.terracotta} />
      {/* Pot rim */}
      <rect x="6" y="18" width="18" height="3" rx="1" fill="#d08a6a" />
      {/* Soil */}
      <ellipse cx="15" cy="20" rx="8" ry="2" fill="#4a3820" />
      {/* Leaves — with sway */}
      <g
        className={`plant-sway-${plantId}`}
        style={{ transformOrigin: '15px 20px', animation: `sway-${plantId} 8s ease-in-out infinite` }}
      >
        {/* Central rosette */}
        <ellipse cx="15" cy="14" rx="3" ry="5" fill="#6a8a5a" />
        <ellipse cx="15" cy="15" rx="2" ry="4" fill="#7a9a6a" />
        {/* Left leaves */}
        <ellipse cx="10" cy="15" rx="4" ry="2.5" fill="#6a8a5a" transform="rotate(-30 10 15)" />
        <ellipse cx="11" cy="13" rx="3" ry="2" fill="#7a9a6a" transform="rotate(-45 11 13)" />
        {/* Right leaves */}
        <ellipse cx="20" cy="15" rx="4" ry="2.5" fill="#6a8a5a" transform="rotate(30 20 15)" />
        <ellipse cx="19" cy="13" rx="3" ry="2" fill="#7a9a6a" transform="rotate(45 19 13)" />
        {/* Leaf veins */}
        <line x1="15" y1="10" x2="15" y2="18" stroke="#5a7a4a" strokeWidth="0.4" opacity="0.5" />
      </g>
    </svg>
  );
}

// ─── Reading Glasses ────────────────────────────────────
function ReadingGlasses() {
  return (
    <svg width="45" height="20" viewBox="0 0 45 20" fill="none" aria-hidden="true">
      {/* Left lens */}
      <circle cx="12" cy="10" r="7" fill="none" stroke={P.brass} strokeWidth="0.8" />
      <circle cx="12" cy="10" r="7" fill="rgba(200,210,220,0.08)" />
      {/* Right lens */}
      <circle cx="32" cy="11" r="7" fill="none" stroke={P.brass} strokeWidth="0.8" />
      <circle cx="32" cy="11" r="7" fill="rgba(200,210,220,0.08)" />
      {/* Bridge */}
      <path d="M19 10 Q22 8 25 11" fill="none" stroke={P.brass} strokeWidth="0.8" />
      {/* Left temple (arm) — folded */}
      <path d="M5 8 Q2 7 1 4" fill="none" stroke={P.brass} strokeWidth="0.8" strokeLinecap="round" />
      {/* Right temple — folded under */}
      <path d="M39 10 Q42 9 44 7" fill="none" stroke={P.brass} strokeWidth="0.8" strokeLinecap="round" />
      {/* Nose pads */}
      <circle cx="18" cy="12" r="0.8" fill={P.brassLight} />
      <circle cx="26" cy="12.5" r="0.8" fill={P.brassLight} />
      {/* Highlight on lenses */}
      <path d="M8 7 Q10 5 12 6" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" fill="none" />
      <path d="M28 8 Q30 6 32 7" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" fill="none" />
    </svg>
  );
}

// ─── Scattered Paper Clips ──────────────────────────────
function ScatteredPaperClips() {
  return (
    <svg width="50" height="15" viewBox="0 0 50 15" fill="none" aria-hidden="true">
      {/* Clip 1 — horizontal */}
      <g transform="rotate(-15 10 7)">
        <path d="M3 5 L15 5 Q17 5 17 7 Q17 9 15 9 L5 9 Q3 9 3 7 L3 5" fill="none" stroke={P.brass} strokeWidth="0.8" />
        <line x1="5" y1="7" x2="14" y2="7" stroke={P.brass} strokeWidth="0.6" />
      </g>
      {/* Clip 2 — angled */}
      <g transform="translate(20 2) rotate(25 8 5)">
        <path d="M2 3 L12 3 Q14 3 14 5 Q14 7 12 7 L4 7 Q2 7 2 5 L2 3" fill="none" stroke={P.brassLight} strokeWidth="0.7" />
        <line x1="4" y1="5" x2="11" y2="5" stroke={P.brassLight} strokeWidth="0.5" />
      </g>
      {/* Clip 3 — flat */}
      <g transform="translate(33 4) rotate(-5 7 4)">
        <path d="M2 2 L11 2 Q13 2 13 4 Q13 6 11 6 L4 6 Q2 6 2 4 L2 2" fill="none" stroke={P.brass} strokeWidth="0.7" />
        <line x1="4" y1="4" x2="10" y2="4" stroke={P.brass} strokeWidth="0.5" />
      </g>
      {/* Clip 4 — small, diagonal */}
      <g transform="translate(42 0) rotate(50 4 6)">
        <path d="M1 3 L7 3 Q8 3 8 4.5 Q8 6 7 6 L2 6 Q1 6 1 4.5 L1 3" fill="none" stroke={P.brassDark} strokeWidth="0.6" />
      </g>
    </svg>
  );
}

// ─── Sealing Wax ────────────────────────────────────────
function SealingWax() {
  return (
    <svg width="35" height="15" viewBox="0 0 70 30" fill="none" aria-hidden="true">
      {/* Wax stick */}
      <rect x="2" y="10" width="40" height="7" rx="3" fill={P.burgundy} />
      <rect x="2" y="10" width="40" height="3.5" rx="2" fill="#8a3232" opacity="0.6" />
      {/* Melted tip */}
      <ellipse cx="42" cy="13.5" rx="3" ry="3.5" fill="#6a2020" />
      {/* Wax drip on tip */}
      <path d="M41 16 Q42 19 43 16" fill={P.burgundy} opacity="0.7" />
      {/* Stamp */}
      <rect x="50" y="6" width="6" height="18" rx="1" fill={P.brass} />
      <rect x="48" y="22" width="10" height="4" rx="1" fill={P.brassDark} />
      {/* Stamp face detail */}
      <circle cx="53" cy="25" r="2.5" fill={P.brassDark} stroke={P.brass} strokeWidth="0.4" />
      <circle cx="53" cy="25" r="1" fill={P.brass} />
      {/* Stamp handle knob */}
      <ellipse cx="53" cy="5" rx="4" ry="2" fill={P.brass} />
    </svg>
  );
}

// ─── Small Notebook ─────────────────────────────────────
function SmallNotebook() {
  return (
    <svg width="35" height="45" viewBox="0 0 35 45" fill="none" aria-hidden="true">
      {/* Back cover shadow */}
      <rect x="4" y="3" width="27" height="39" rx="2" fill="rgba(40,25,15,0.3)" />
      {/* Back cover */}
      <rect x="3" y="2" width="27" height="39" rx="2" fill={P.leatherDk} />
      {/* Front cover */}
      <rect x="2" y="1" width="27" height="39" rx="2" fill={P.leather} />
      {/* Cover texture lines */}
      <line x1="5" y1="4" x2="5" y2="37" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      <line x1="26" y1="4" x2="26" y2="37" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      {/* Spine */}
      <rect x="2" y="1" width="3" height="39" rx="1" fill={P.leatherDk} />
      {/* Cover border emboss */}
      <rect x="7" y="6" width="19" height="29" rx="1" fill="none" stroke="rgba(255,220,160,0.12)" strokeWidth="0.5" />
      {/* Ribbon bookmark */}
      <path
        d="M20 1 L20 42 L18 39 L16 42 L16 1"
        fill="#8a2828"
        opacity="0.8"
      />
      {/* Page edges visible at bottom */}
      <line x1="5" y1="39" x2="28" y2="39" stroke={P.cream} strokeWidth="1.5" />
      <line x1="5" y1="38" x2="28" y2="38" stroke="rgba(240,235,225,0.6)" strokeWidth="0.5" />
    </svg>
  );
}

// ─── Main DeskObjects Component ─────────────────────────
const DeskObjects = memo(function DeskObjects() {
  const { isDaytime, isNight, lighting } = useEnvironment();

  const candleLit = isNight || lighting.lampOn;

  // Reduced motion check
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Randomize paper clip position slightly on mount
  const clipOffset = useMemo(() => ({
    x: Math.random() * 4 - 2,
    y: Math.random() * 3 - 1.5,
  }), []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 3,
      }}
      aria-hidden="true"
    >
      {/* Upper-left: Pencil holder + Ink bottle */}
      <div style={{ position: 'absolute', top: '6%', left: '5%', display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
        <PencilHolder />
        <InkBottle />
      </div>

      {/* Upper-right: Alarm clock + Reading glasses */}
      <div style={{ position: 'absolute', top: '5%', right: '7%', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
        <BrassAlarmClock />
        <div style={{ transform: 'rotate(5deg)', marginTop: '2px' }}>
          <ReadingGlasses />
        </div>
      </div>

      {/* Upper area: Tiny plant */}
      <div style={{ position: 'absolute', top: '4%', left: '38%' }}>
        <TinyPlant />
      </div>

      {/* Lower-left: Coffee mug */}
      <div style={{ position: 'absolute', bottom: '12%', left: '6%' }}>
        <CoffeeMug showSteam={isDaytime && !reducedMotion} />
      </div>

      {/* Left edge: Candle */}
      <div style={{ position: 'absolute', top: '30%', left: '2%' }}>
        <CandleHolder lit={candleLit} />
      </div>

      {/* Scattered paper clips — near center-bottom */}
      <div style={{ position: 'absolute', bottom: '18%', left: '30%', transform: `translate(${clipOffset.x}px, ${clipOffset.y}px)` }}>
        <ScatteredPaperClips />
      </div>

      {/* Lower-right: Sealing wax + Notebook */}
      <div style={{ position: 'absolute', bottom: '8%', right: '5%', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
        <SmallNotebook />
        <div style={{ transform: 'rotate(-3deg)' }}>
          <SealingWax />
        </div>
      </div>
    </div>
  );
});

export default DeskObjects;
