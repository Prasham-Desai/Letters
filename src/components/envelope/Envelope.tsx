'use client';
import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { PlacedEnvelope } from '@/types/letter';
import WaxSeal from './WaxSeal';
import Stamp from './Stamp';

const PAPER_COLORS: Record<string, { base: string; light: string; fold: string }> = {
  cream: { base: '#f5eedf', light: '#faf6ee', fold: 'rgba(120,98,60,0.08)' },
  ivory: { base: '#faf3e4', light: '#fefbf4', fold: 'rgba(130,105,65,0.07)' },
  warm:  { base: '#f2e6d4', light: '#f8f0e4', fold: 'rgba(110,88,55,0.09)' },
  aged:  { base: '#e6d8be', light: '#ede4d0', fold: 'rgba(100,78,45,0.10)' },
  soft:  { base: '#ede3d4', light: '#f4ece0', fold: 'rgba(115,92,58,0.08)' },
};

interface Props {
  data: PlacedEnvelope;
  isOpened: boolean;
  onClick: () => void;
  dropDelay?: number;
  isHidden?: boolean;
  isClone?: boolean;
}

const Envelope = memo(function Envelope({ data, isOpened, onClick, dropDelay = 0, isHidden = false, isClone = false }: Props) {
  const [hovered, setHovered] = useState(false);
  const colors = PAPER_COLORS[data.paper] ?? PAPER_COLORS.cream;

  return (
    <motion.div
      id={`envelope-${data.id}`}
      style={{
        position: 'absolute',
        left: data.x,
        top: data.y,
        width: data.width,
        height: data.height,
        rotate: isClone ? 0 : data.rotation,
        zIndex: hovered ? 20 : 10,
        transformOrigin: 'center bottom',
        cursor: 'pointer',
        opacity: isHidden ? 0 : 1,
        pointerEvents: isHidden ? 'none' : 'auto',
      }}
      whileHover={!isHidden && !isClone ? { 
        y: -8, 
        scale: 1.04, 
        rotate: data.rotation + 0.8,
        transition: { type: 'spring', stiffness: 280, damping: 18 } 
      } : {}}
      whileTap={!isHidden ? { scale: 0.97 } : {}}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={data.title}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          backgroundColor: colors.base,
          borderRadius: '4px',
          boxShadow: hovered
            ? `0 16px 44px rgba(50,38,24,0.24), 0 6px 14px rgba(50,38,24,0.15), 0 1px 3px rgba(50,38,24,0.10)`
            : `0 4px 16px rgba(50,38,24,0.14), 0 2px 6px rgba(50,38,24,0.10), 0 1px 2px rgba(50,38,24,0.08)`,
          transition: 'box-shadow 0.3s ease',
        }}
      >
        {/* Top flap — triangular fold with realistic shadow */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', borderRadius: '4px' }}
          preserveAspectRatio="none"
          viewBox={`0 0 ${data.width} ${data.height}`}
          fill="none"
          aria-hidden="true"
        >
          {/* Top V fold */}
          <path
            d={`M0,0 L${data.width/2},${data.height*0.44} L${data.width},0`}
            stroke={colors.fold} strokeWidth="1"
            fill={colors.fold}
          />
          {/* Top fold inner highlight */}
          <path
            d={`M1,0 L${data.width/2},${data.height*0.42} L${data.width - 1},0`}
            stroke="none"
            fill={colors.light} opacity="0.3"
          />
          
          {/* Bottom V fold */}
          <path
            d={`M0,${data.height} L${data.width/2},${data.height*0.56} L${data.width},${data.height}`}
            stroke={colors.fold} strokeWidth="0.8"
            fill={colors.fold}
          />
          
          {/* Side fold creases */}
          <line x1="0" y1="0" x2={data.width * 0.08} y2={data.height * 0.5} stroke={colors.fold} strokeWidth="0.5"/>
          <line x1={data.width} y1="0" x2={data.width * 0.92} y2={data.height * 0.5} stroke={colors.fold} strokeWidth="0.5"/>
          
          {/* Subtle paper edge — top */}
          <line x1="0" y1="0.5" x2={data.width} y2="0.5" stroke="rgba(255,240,220,0.5)" strokeWidth="0.5"/>
        </svg>

        {/* Stamp — top right */}
        <div style={{ position: 'absolute', top: 8, right: 8, transform: `rotate(${data.rotation * -0.25}deg)` }}>
          <Stamp type={data.stamp} size={24} />
        </div>

        {/* Wax seal — shifted slightly lower from flap intersection */}
        <div style={{
          position: 'absolute',
          top: `calc(${data.height * 0.44}px + 8px)`,
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 3,
        }}>
          <WaxSeal type={data.sealType} color={data.seal} cracked={isOpened} size={36} />
        </div>

        {/* Opened: letter peeking out */}
        {isOpened && (
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: -10 }}
            style={{
              position: 'absolute',
              top: 2,
              left: '50%',
              transform: 'translateX(-50%)',
              width: data.width * 0.55,
              height: 14,
              backgroundColor: '#faf6ee',
              border: '0.5px solid rgba(100,78,50,0.18)',
              borderRadius: '1px 1px 0 0',
              boxShadow: '0 -3px 10px rgba(0,0,0,0.06)',
            }}
          />
        )}

        {/* Paper grain texture overlay */}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 128 128\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.08\'/%3E%3C/svg%3E")',
            backgroundSize: '100px 100px',
            pointerEvents: 'none',
            borderRadius: 'inherit',
            mixBlendMode: 'multiply',
          }}
          aria-hidden="true"
        />

        {/* Edge thickness shadow — makes envelope feel like it has paper thickness */}
        <div
          style={{
            position: 'absolute', bottom: -1, left: 1, right: 1, height: 2,
            background: `linear-gradient(to bottom, transparent, rgba(80,60,30,0.08))`,
            borderRadius: '0 0 4px 4px',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />
      </div>
    </motion.div>
  );
});

export default Envelope;
