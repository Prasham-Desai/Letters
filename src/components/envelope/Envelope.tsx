'use client';
import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { PlacedEnvelope } from '@/types/letter';
import WaxSeal from './WaxSeal';
import Stamp from './Stamp';

const PAPER_COLORS: Record<string, string> = {
  cream: '#f5eedf',
  ivory: '#faf3e4',
  warm:  '#f2e6d4',
  aged:  '#e6d8be',
  soft:  '#ede3d4',
};

interface Props {
  data: PlacedEnvelope;
  isOpened: boolean;
  onClick: () => void;
  dropDelay?: number;
  isHidden?: boolean;
}

const Envelope = memo(function Envelope({ data, isOpened, onClick, dropDelay = 0, isHidden = false }: Props) {
  const [hovered, setHovered] = useState(false);
  const paperColor = PAPER_COLORS[data.paper] ?? '#f5eedf';

  return (
    <motion.div
      id={`envelope-${data.id}`}
      style={{
        position: 'absolute',
        left: data.x,
        top: data.y,
        width: data.width,
        height: data.height,
        rotate: data.rotation,
        zIndex: hovered ? 20 : 10,
        transformOrigin: 'center bottom',
        cursor: 'pointer',
        opacity: isHidden ? 0 : 1, // Completely invisible when FlightLayer is animating it
        pointerEvents: isHidden ? 'none' : 'auto',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isHidden ? 0 : 1 }}
      transition={{ opacity: { duration: 0.15 } }}
      whileHover={!isHidden ? { 
        y: -6, 
        scale: 1.03, 
        rotate: data.rotation + 1,
        transition: { type: 'spring', stiffness: 300, damping: 20 } 
      } : {}}
      whileTap={!isHidden ? { scale: 0.98 } : {}}
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
          backgroundColor: paperColor,
          borderRadius: '3px',
          boxShadow: hovered
            ? '0 14px 40px rgba(50,38,24,0.22), 0 4px 12px rgba(50,38,24,0.14)'
            : '0 5px 18px rgba(50,38,24,0.16), 0 2px 6px rgba(50,38,24,0.10)',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        {/* Envelope fold lines */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', borderRadius: '3px' }}
          preserveAspectRatio="none"
          viewBox={`0 0 ${data.width} ${data.height}`}
          fill="none"
          aria-hidden="true"
        >
          <path
            d={`M0,0 L${data.width/2},${data.height*0.46} L${data.width},0`}
            stroke="rgba(100,78,50,0.16)" strokeWidth="0.8"
            fill="rgba(100,78,50,0.03)"
          />
          <path
            d={`M0,${data.height} L${data.width/2},${data.height*0.54} L${data.width},${data.height}`}
            stroke="rgba(100,78,50,0.13)" strokeWidth="0.7"
            fill="rgba(100,78,50,0.025)"
          />
        </svg>

        {/* Stamp — top right */}
        <div style={{ position: 'absolute', top: 8, right: 8, transform: `rotate(${data.rotation * -0.25}deg)` }}>
          <Stamp type={data.stamp} size={32} />
        </div>

        {/* Title — larger, clearer */}
        <div
          style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            right: '48px',
            fontFamily: 'var(--font-heading)',
            fontSize: '15px',
            fontWeight: 500,
            lineHeight: 1.25,
            color: '#2e2318',
            opacity: 0.88,
            letterSpacing: '0.01em',
          }}
        >
          {data.title}
        </div>

        {/* Wax seal — center bottom area */}
        <div style={{
          position: 'absolute',
          bottom: `${data.height * 0.18}px`,
          left: '50%',
          transform: 'translateX(-50%)',
        }}>
          <WaxSeal type={data.sealType} color={data.seal} cracked={isOpened} size={hovered ? 40 : 36} />
        </div>

        {/* Opened: letter peeking out */}
        {isOpened && (
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: -8 }}
            style={{
              position: 'absolute',
              top: 3,
              left: '50%',
              transform: 'translateX(-50%)',
              width: data.width * 0.58,
              height: 12,
              backgroundColor: '#faf3e4',
              border: '0.5px solid rgba(100,78,50,0.22)',
              borderRadius: '1px 1px 0 0',
              boxShadow: '0 -2px 8px rgba(0,0,0,0.05)',
            }}
          />
        )}

        {/* Paper texture */}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.025\'/%3E%3C/svg%3E")',
            backgroundSize: '100px 100px',
            pointerEvents: 'none',
            borderRadius: 'inherit',
          }}
          aria-hidden="true"
        />
      </div>
    </motion.div>
  );
});

export default Envelope;
