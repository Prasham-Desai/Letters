'use client';
import { memo } from 'react';
import { useEnvironment } from '@/contexts/EnvironmentContext';

const DeskObjects = memo(function DeskObjects() {
  const env = useEnvironment();

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden="true">
      {/* 1. Pencil Holder & Ink Bottle (Top Left) */}
      <div style={{ position: 'absolute', top: '15%', left: '10%' }}>
        {/* Shadow */}
        <div style={{ position: 'absolute', bottom: -5, left: 10, width: 40, height: 10, background: 'rgba(0,0,0,0.3)', borderRadius: '50%', filter: 'blur(3px)' }} />
        {/* Ink Bottle */}
        <svg width="25" height="30" viewBox="0 0 25 30" style={{ position: 'absolute', left: 45, top: 20 }}>
          <path d="M 5 30 L 20 30 L 22 15 L 18 10 L 18 5 L 7 5 L 7 10 L 3 15 Z" fill="rgba(100,120,130,0.4)" stroke="#fff" strokeWidth="0.5" />
          <path d="M 4 29 L 21 29 L 21 16 L 4 16 Z" fill="#2e2820" opacity="0.9" />
          <rect x="8" y="2" width="9" height="4" fill="#a08050" />
          {/* Label */}
          <rect x="7" y="20" width="11" height="6" fill="#f5f0e8" opacity="0.8" />
        </svg>
        {/* Pencil Holder */}
        <svg width="35" height="50" viewBox="0 0 35 50" style={{ position: 'relative', zIndex: 2 }}>
          {/* Pencils */}
          <g transform="rotate(15 15 20)">
            <rect x="15" y="-10" width="4" height="40" fill="#e8cc78" />
            <polygon points="15,-10 19,-10 17,-15" fill="#d4b080" />
            <polygon points="16.5,-15 17.5,-15 17,-17" fill="#3a3530" />
          </g>
          <g transform="rotate(-10 15 20)">
            <rect x="10" y="-5" width="4" height="35" fill="#8a6828" />
            <rect x="10" y="-8" width="4" height="3" fill="#3a3530" />
          </g>
          {/* Cup */}
          <path d="M 5 50 L 30 50 Q 32 50 32 48 L 35 15 Q 35 12 32 12 L 3 12 Q 0 12 0 15 L 3 48 Q 3 50 5 50 Z" fill="#8a9e8a" />
          <path d="M 5 50 L 30 50 Q 32 50 32 48 L 35 15 Q 35 12 32 12 L 3 12 Q 0 12 0 15 L 3 48 Q 3 50 5 50 Z" fill="linear-gradient(to right, transparent, rgba(0,0,0,0.2))" />
        </svg>
      </div>

      {/* 2. Brass Alarm Clock (Top Right) */}
      <div style={{ position: 'absolute', top: '12%', right: '15%' }}>
        <div style={{ position: 'absolute', bottom: -5, left: 5, width: 30, height: 8, background: 'rgba(0,0,0,0.3)', borderRadius: '50%', filter: 'blur(3px)' }} />
        <svg width="40" height="45" viewBox="0 0 40 45">
          {/* Bells */}
          <path d="M 5 15 Q 10 5 20 10" fill="none" stroke="#c4a050" strokeWidth="3" strokeLinecap="round" />
          <path d="M 35 15 Q 30 5 20 10" fill="none" stroke="#c4a050" strokeWidth="3" strokeLinecap="round" />
          {/* Handle */}
          <path d="M 15 5 Q 20 0 25 5" fill="none" stroke="#c4a050" strokeWidth="2" />
          {/* Body */}
          <circle cx="20" cy="25" r="16" fill="#c4a050" />
          <circle cx="20" cy="25" r="14" fill="#f5f0e8" />
          {/* Hands */}
          <line x1="20" y1="25" x2="20" y2="15" stroke="#3a3530" strokeWidth="2" strokeLinecap="round" />
          <line x1="20" y1="25" x2="28" y2="28" stroke="#3a3530" strokeWidth="2" strokeLinecap="round" />
          <line x1="20" y1="25" x2="15" y2="20" stroke="#c4785a" strokeWidth="1" strokeLinecap="round" />
          {/* Feet */}
          <line x1="12" y1="40" x2="8" y2="45" stroke="#c4a050" strokeWidth="3" strokeLinecap="round" />
          <line x1="28" y1="40" x2="32" y2="45" stroke="#c4a050" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      {/* 3. Coffee Mug (Bottom Left) */}
      <div style={{ position: 'absolute', bottom: '20%', left: '8%' }}>
        <div style={{ position: 'absolute', bottom: -5, left: 5, width: 25, height: 8, background: 'rgba(0,0,0,0.3)', borderRadius: '50%', filter: 'blur(3px)' }} />
        {env.isDaytime && (
          <svg width="30" height="20" viewBox="0 0 30 20" style={{ position: 'absolute', top: -15, left: 0, animation: 'steam-rise 3s infinite ease-in-out' }}>
            <path d="M 10 20 Q 5 10 12 5 Q 15 0 10 -5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" />
            <path d="M 20 20 Q 25 10 18 5 Q 15 0 20 -5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
        <svg width="35" height="35" viewBox="0 0 35 35">
          {/* Handle */}
          <path d="M 25 10 Q 35 10 35 20 Q 35 28 25 28" fill="none" stroke="#c4785a" strokeWidth="4" />
          {/* Mug */}
          <rect x="5" y="5" width="22" height="28" rx="3" fill="#c4785a" />
          {/* Inside/Coffee */}
          <ellipse cx="16" cy="5" rx="11" ry="4" fill="#6b4c30" />
          <ellipse cx="16" cy="5" rx="9" ry="2" fill="#3a2210" />
        </svg>
      </div>

      {/* 4. Reading Glasses (Top Right, near clock) */}
      <div style={{ position: 'absolute', top: '15%', right: '28%', transform: 'rotate(15deg)' }}>
        <div style={{ position: 'absolute', bottom: -2, left: 2, width: 40, height: 8, background: 'rgba(0,0,0,0.2)', borderRadius: '50%', filter: 'blur(2px)' }} />
        <svg width="45" height="20" viewBox="0 0 45 20">
          <circle cx="12" cy="10" r="8" fill="rgba(255,255,255,0.2)" stroke="#e8cc78" strokeWidth="2" />
          <circle cx="32" cy="10" r="8" fill="rgba(255,255,255,0.2)" stroke="#e8cc78" strokeWidth="2" />
          <path d="M 20 10 Q 22 5 24 10" fill="none" stroke="#e8cc78" strokeWidth="2" />
          <path d="M 4 10 L -2 5" fill="none" stroke="#8a7030" strokeWidth="2" strokeLinecap="round" />
          <path d="M 40 10 L 46 5" fill="none" stroke="#8a7030" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* 5. Sealing Wax & Stamp (Bottom Right) */}
      <div style={{ position: 'absolute', bottom: '15%', right: '12%', transform: 'rotate(-25deg)' }}>
        <div style={{ position: 'absolute', bottom: 5, left: 0, width: 35, height: 6, background: 'rgba(0,0,0,0.2)', borderRadius: '50%', filter: 'blur(2px)' }} />
        <svg width="40" height="20" viewBox="0 0 40 20">
          {/* Wax stick */}
          <rect x="2" y="8" width="25" height="6" rx="2" fill="#7a2840" />
          <rect x="2" y="8" width="25" height="2" rx="1" fill="rgba(255,255,255,0.2)" />
          {/* Wick */}
          <line x1="2" y1="11" x2="-2" y2="11" stroke="#3a3530" strokeWidth="1" />
          {/* Brass stamp handle */}
          <path d="M 32 2 L 36 2 L 35 10 L 33 10 Z" fill="#b08848" />
          <path d="M 31 10 L 37 10 L 38 18 L 30 18 Z" fill="#c4a050" />
          <path d="M 30 18 L 38 18 L 38 20 L 30 20 Z" fill="#8a7030" />
        </svg>
      </div>

      {/* 6. Candle Holder (Mid Right Edge) */}
      <div style={{ position: 'absolute', top: '45%', right: '5%' }}>
        <div style={{ position: 'absolute', bottom: -5, left: 2, width: 20, height: 6, background: 'rgba(0,0,0,0.3)', borderRadius: '50%', filter: 'blur(3px)' }} />
        {(env.isNight || env.lighting.lampOn) && (
          <div style={{ position: 'absolute', top: -15, left: 10, width: 4, height: 10, background: '#ffcc66', borderRadius: '50%', animation: 'flame-flicker 2s infinite', boxShadow: '0 0 15px 5px rgba(255,200,100,0.6)' }} />
        )}
        <svg width="24" height="40" viewBox="0 0 24 40">
          {/* Candle */}
          <rect x="8" y="10" width="8" height="20" fill="#f5f0e8" />
          <rect x="8" y="10" width="4" height="20" fill="rgba(0,0,0,0.05)" />
          {/* Wick */}
          <line x1="12" y1="10" x2="12" y2="7" stroke="#3a3530" strokeWidth="1" />
          {/* Holder base */}
          <path d="M 6 30 L 18 30 L 16 35 L 4 35 Z" fill="#c4a050" />
          <path d="M 4 35 L 20 35 L 22 40 L 2 40 Z" fill="#8a7030" />
          {/* Holder handle */}
          <path d="M 20 35 Q 26 30 20 28" fill="none" stroke="#c4a050" strokeWidth="2" />
        </svg>
      </div>

    </div>
  );
});

export default DeskObjects;
