'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';
import { PlacedEnvelope } from '@/types/letter';
import { motion, AnimatePresence } from 'framer-motion';
import Envelope from '@/components/envelope/Envelope';

type FlightType = 'MAILBOX_TO_DESK' | 'DESK_TO_COLLECTION';

interface Flight {
  id: string; // unique flight ID
  envelope: PlacedEnvelope;
  startRect: DOMRect;
  endRect: DOMRect;
  type: FlightType;
  onComplete: () => void;
}

interface AnimationContextValue {
  isAnimating: boolean;
  flyEnvelope: (envelope: PlacedEnvelope, startRect: DOMRect, endRect: DOMRect, type: FlightType, onComplete: () => void) => void;
  // Refs for dynamic DOM measurement
  mailboxRef: React.RefObject<HTMLDivElement | null>;
  collectionBoxRef: React.RefObject<HTMLDivElement | null>;
  // States to trigger physical box lid openings
  isMailboxOpening: boolean;
  isCollectionOpening: boolean;
  hiddenEnvelopeIds: Set<string>;
}

const AnimationContext = createContext<AnimationContextValue | null>(null);

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [activeFlight, setActiveFlight] = useState<Flight | null>(null);
  const [isMailboxOpening, setIsMailboxOpening] = useState(false);
  const [isCollectionOpening, setIsCollectionOpening] = useState(false);
  const [hiddenEnvelopeIds, setHiddenEnvelopeIds] = useState<Set<string>>(new Set());
  
  const mailboxRef = useRef<HTMLDivElement | null>(null);
  const collectionBoxRef = useRef<HTMLDivElement | null>(null);

  const flightQueue = useRef<Flight[]>([]);
  const isProcessing = useRef(false);

  const processQueue = useCallback(() => {
    if (isProcessing.current || flightQueue.current.length === 0) return;
    
    isProcessing.current = true;
    const flight = flightQueue.current.shift()!;
    
    setHiddenEnvelopeIds(prev => {
      const next = new Set(prev);
      next.add(flight.envelope.id);
      return next;
    });

    if (flight.type === 'MAILBOX_TO_DESK') {
      setIsMailboxOpening(true);
    } else if (flight.type === 'DESK_TO_COLLECTION') {
      setIsCollectionOpening(true);
    }

    setTimeout(() => {
      setActiveFlight(flight);
    }, 300);

  }, []);

  const flyEnvelope = useCallback((envelope: PlacedEnvelope, startRect: DOMRect, endRect: DOMRect, type: FlightType, onComplete: () => void) => {
    const flightId = Math.random().toString(36).substr(2, 9);
    flightQueue.current.push({ id: flightId, envelope, startRect, endRect, type, onComplete });
    processQueue();
  }, [processQueue]);

  const handleFlightComplete = useCallback(() => {
    if (!activeFlight) return;
    
    if (activeFlight.type === 'MAILBOX_TO_DESK') {
      setIsMailboxOpening(false);
    } else if (activeFlight.type === 'DESK_TO_COLLECTION') {
      setIsCollectionOpening(false);
    }

    activeFlight.onComplete();
    
    setHiddenEnvelopeIds(prev => {
      const next = new Set(prev);
      next.delete(activeFlight.envelope.id);
      return next;
    });
    
    setActiveFlight(null);

    setTimeout(() => {
      isProcessing.current = false;
      processQueue();
    }, 150);
  }, [activeFlight, processQueue]);

  return (
    <AnimationContext.Provider value={{
      isAnimating: activeFlight !== null || isProcessing.current,
      flyEnvelope,
      mailboxRef,
      collectionBoxRef,
      isMailboxOpening,
      isCollectionOpening,
      hiddenEnvelopeIds
    }}>
      {children}
      {/* FLIGHT LAYER */}
      <AnimatePresence>
        {activeFlight && (
          <FlightEnvelope 
            key={activeFlight.id}
            flight={activeFlight}
            onComplete={handleFlightComplete}
          />
        )}
      </AnimatePresence>
    </AnimationContext.Provider>
  );
}

export function useAnimation() {
  const ctx = useContext(AnimationContext);
  if (!ctx) throw new Error("useAnimation must be used within AnimationProvider");
  return ctx;
}

// Internal Component to render the flying clone with physical motion
function FlightEnvelope({ flight, onComplete }: { flight: Flight, onComplete: () => void }) {
  const { startRect, endRect, type, envelope } = flight;
  
  const isMailbox = type === 'MAILBOX_TO_DESK';

  // Always use the physical dimensions of the envelope for the wrapper
  const envWidth = envelope.width;
  const envHeight = envelope.height;

  // Calculate center points of start and end rects
  const startCenterX = startRect.left + startRect.width / 2;
  const startCenterY = startRect.top + startRect.height / 2;
  
  const endCenterX = endRect.left + endRect.width / 2;
  const endCenterY = endRect.top + endRect.height / 2;

  // Delta distance from start center to end center
  const deltaX = endCenterX - startCenterX;
  const deltaY = endCenterY - startCenterY;
  
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  
  // Dynamic arc height — proportional to distance, clamped
  const arcHeight = Math.min(180, Math.max(80, distance * 0.35));

  // 5-point trajectory for natural curved path
  const yKeyframes = isMailbox
    ? [0, -arcHeight * 0.4, -arcHeight, deltaY * 0.3 - arcHeight * 0.2, deltaY]
    : [0, -arcHeight * 0.3, -arcHeight * 0.6, deltaY * 0.4 - arcHeight * 0.15, deltaY];
  
  const xKeyframes = isMailbox
    ? [0, deltaX * 0.1, deltaX * 0.4, deltaX * 0.75, deltaX]
    : [0, deltaX * 0.15, deltaX * 0.45, deltaX * 0.8, deltaX];

  // Momentum-based rotation — banking in the direction of travel
  const travelAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  const baseRotation = envelope.rotation;
  
  // Smooth rotation during flight
  const rotKeyframes = isMailbox
    ? [baseRotation - 30, baseRotation - 10, baseRotation + 5, baseRotation + 2, baseRotation]
    : [baseRotation, baseRotation - 5, baseRotation - 15, baseRotation + travelAngle * 0.1, baseRotation + 30];

  // Depth scaling — smooth transition per user requirements
  // Mailbox to Desk: 0.75 -> 1.0
  // Desk to Collection: 1.0 -> 0.75
  const scaleKeyframes = isMailbox
    ? [0.75, 0.8, 0.88, 0.95, 1.0]
    : [1.0, 0.95, 0.88, 0.8, 0.75];

  // Opacity: stays fully visible until the very end of collection drop
  const opacityKeyframes = isMailbox
    ? [1, 1, 1, 1, 1]
    : [1, 1, 1, 1, 0.9];

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: startCenterX,
        top: startCenterY,
        width: envWidth,
        height: envHeight,
        margin: `${-envHeight / 2}px 0 0 ${-envWidth / 2}px`, // Perfect mathematical center
        zIndex: 9999,
        pointerEvents: 'none',
        transformOrigin: 'center center',
        filter: 'drop-shadow(0 12px 24px rgba(40,24,8,0.3))',
      }}
      initial={{ 
        x: xKeyframes[0], 
        y: yKeyframes[0],
        scale: scaleKeyframes[0], 
        rotate: rotKeyframes[0],
        opacity: opacityKeyframes[0],
      }}
      animate={{ 
        x: xKeyframes, 
        y: yKeyframes,
        scale: scaleKeyframes,
        rotate: rotKeyframes,
        opacity: opacityKeyframes,
      }}
      transition={{
        duration: 0.75, // Slightly longer for smoother, less abrupt flight
        ease: [0.25, 0.1, 0.25, 1], // Smooth cubic ease — fast start, gentle landing
        times: [0, 0.25, 0.5, 0.75, 1],
      }}
      onAnimationComplete={onComplete}
    >
      <Envelope 
        data={{...envelope, x: 0, y: 0}} 
        isOpened={false}
        onClick={() => {}}
      />
    </motion.div>
  );
}
