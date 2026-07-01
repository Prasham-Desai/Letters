'use client';
import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const current = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  
  const [visible, setVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Only on pointer devices
    if (window.matchMedia('(hover: none)').matches) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      // Determine hovering by checking if target is clickable
      const target = e.target as HTMLElement;
      const clickable = target.closest('button, a, [role="button"], [class*="cursor-pointer"]');
      setIsHovering(!!clickable);
    };

    const onDown = () => setIsClicking(true);
    const onUp = () => setIsClicking(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    const animate = () => {
      const dx = pos.current.x - current.current.x;
      const dy = pos.current.y - current.current.y;
      current.current.x += dx * 0.18;
      current.current.y += dy * 0.18;
      if (cursorRef.current) {
        // Shorter (base scale 0.75) and natural holding angle
        const scale = isClicking ? '0.65' : isHovering ? '0.85' : '0.75';
        const rotate = isClicking ? '12.5deg' : isHovering ? '7.5deg' : '22.5deg';
        
        cursorRef.current.style.transform =
          `translate(${current.current.x}px, ${current.current.y}px) scaleY(-1) scale(${scale}) rotate(${rotate})`;
        cursorRef.current.style.transformOrigin = 'top left';
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(rafRef.current);
    };
  }, [visible, isHovering, isClicking]);

  if (!visible) return null;

  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
      style={{ position: 'fixed', top: 0, left: 0, zIndex: 99999, pointerEvents: 'none' }}
    >
      {/* Realistic Feather Quill */}
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ filter: 'drop-shadow(2px 6px 8px rgba(30,20,10,0.25))' }}>
        {/* Feather Back / Right side */}
        <path d="M5 5 C 25 -5, 60 20, 50 50 C 35 35, 20 20, 5 5 Z" fill={isHovering ? '#f4eedb' : '#ffffff'} />
        
        {/* Feather Front / Left side */}
        <path d="M5 5 C -5 25, 20 60, 50 50 C 35 35, 20 20, 5 5 Z" fill={isHovering ? '#d8cbb8' : '#e6dfce'} />
        
        {/* Detailed texture lines (feather vanes) */}
        <path d="M10 10 L22 3 M15 15 L30 5 M20 20 L38 9 M25 25 L45 15 M30 30 L48 22 M35 35 L52 28" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
        <path d="M10 10 L3 22 M15 15 L5 30 M20 20 L9 38 M25 25 L15 45 M30 30 L22 48 M35 35 L28 52" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
        
        {/* Central Shaft */}
        <path d="M1 1 Q 25 25 50 50" stroke="#fdfdfd" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M1 1 Q 25 25 50 50" stroke="#c8b598" strokeWidth="1" strokeLinecap="round" />
        
        {/* Metallic Gold Nib */}
        <path d="M0 0 L 6 1 L 7 7 L 1 6 Z" fill="#d4af37" />
        <path d="M0 0 L 3 0.5 L 3.5 3.5 L 0.5 3 Z" fill="#fff" opacity="0.6" />
        <line x1="0" y1="0" x2="5" y2="5" stroke="#8a6828" strokeWidth="0.5" />
        
        {/* Ink dot interaction */}
        {isHovering && (
          <circle cx="2" cy="2" r="1.5" fill="#2a1e10" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.5s" repeatCount="indefinite"/>
          </circle>
        )}
      </svg>
    </div>
  );
}
