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
        cursorRef.current.style.transform =
          `translate(${current.current.x}px, ${current.current.y}px) translate(-50%,-50%) ${isClicking ? 'scale(0.82)' : isHovering ? 'scale(1.3) rotate(-15deg)' : 'scale(1)'}`;
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
      {/* Fountain pen nib SVG */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        {/* Pen body */}
        <path
          d="M12 2 L16 10 L12 22 L8 10 Z"
          fill={isHovering ? '#c9924a' : '#3a3530'}
          opacity={isHovering ? 0.9 : 0.75}
          style={{ transition: 'fill 0.2s ease, opacity 0.2s ease' }}
        />
        {/* Nib split */}
        <line x1="12" y1="14" x2="12" y2="22" stroke="#f5f0e8" strokeWidth="0.5" opacity="0.6"/>
        {/* Ink dot */}
        {isHovering && (
          <circle cx="12" cy="22" r="2" fill="#c9924a" opacity="0.4">
            <animate attributeName="r" values="2;3;2" dur="1s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.4;0.1;0.4" dur="1s" repeatCount="indefinite"/>
          </circle>
        )}
      </svg>
    </div>
  );
}
