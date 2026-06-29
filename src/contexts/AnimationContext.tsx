'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';
import { PlacedEnvelope } from '@/types/letter';
import { motion, AnimatePresence } from 'framer-motion';
import Envelope from '@/components/envelope/Envelope';

type FlightType = 'MAILBOX_TO_DESK' | 'DESK_TO_COLLECTION' | 'COLLECTION_TO_MAILBOX';

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
  flyMultiple: (flights: Omit<Flight, 'id'>[], staggerMs: number, onAllComplete: () => void) => void;
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
  const [activeFlights, setActiveFlights] = useState<Flight[]>([]);
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
    
    if (flight.type === 'MAILBOX_TO_DESK') {
      setIsMailboxOpening(true);
      setTimeout(() => {
        setActiveFlights([flight]);
      }, 300);
    } else if (flight.type === 'DESK_TO_COLLECTION') {
      setIsCollectionOpening(true);
      setActiveFlights([flight]);
    } else {
      setActiveFlights([flight]);
    }
  }, []);

  const flyEnvelope = useCallback((envelope: PlacedEnvelope, startRect: DOMRect, endRect: DOMRect, type: FlightType, onComplete: () => void) => {
    const flightId = Math.random().toString(36).substr(2, 9);
    
    setHiddenEnvelopeIds(prev => {
      const next = new Set(prev);
      next.add(envelope.id);
      return next;
    });

    flightQueue.current.push({ id: flightId, envelope, startRect, endRect, type, onComplete });
    processQueue();
  }, [processQueue]);

  const flyMultiple = useCallback((flightsInput: Omit<Flight, 'id'>[], staggerMs: number, onAllComplete: () => void) => {
    if (flightsInput.length === 0) return;
    
    const flights: Flight[] = flightsInput.map(f => ({ ...f, id: Math.random().toString(36).substr(2, 9) }));
    
    // Add all to hidden immediately
    setHiddenEnvelopeIds(prev => {
      const next = new Set(prev);
      flights.forEach(f => next.add(f.envelope.id));
      return next;
    });
    
    // Open all relevant doors for mass flights
    setIsCollectionOpening(true);
    setIsMailboxOpening(true);

    let completedCount = 0;

    setTimeout(() => {
      flights.forEach((flight, i) => {
        setTimeout(() => {
          const originalOnComplete = flight.onComplete;
          flight.onComplete = () => {
            originalOnComplete();
            completedCount++;
            if (completedCount === flights.length) {
              setIsCollectionOpening(false);
              setIsMailboxOpening(false);
              onAllComplete();
            }
          };

          setActiveFlights(prev => [...prev, flight]);
        }, i * staggerMs);
      });
    }, 300);
  }, []);

  const handleFlightComplete = useCallback((completedFlightId: string) => {
    setActiveFlights(prev => {
      const flight = prev.find(f => f.id === completedFlightId);
      if (!flight) return prev;

      const next = prev.filter(f => f.id !== completedFlightId);
      
      // Handle closing boxes only if this is a standard queued flight
      if (next.length === 0 && isProcessing.current) {
        if (flight.type === 'MAILBOX_TO_DESK') setIsMailboxOpening(false);
        else if (flight.type === 'DESK_TO_COLLECTION') setIsCollectionOpening(false);
      }

      flight.onComplete();
      
      setHiddenEnvelopeIds(hprev => {
        const hnext = new Set(hprev);
        hnext.delete(flight.envelope.id);
        return hnext;
      });
      
      if (next.length === 0 && isProcessing.current) {
        setTimeout(() => {
          isProcessing.current = false;
          processQueue();
        }, 150);
      }
      
      return next;
    });
  }, [processQueue]);

  return (
    <AnimationContext.Provider value={{
      isAnimating: activeFlights.length > 0 || isProcessing.current,
      flyEnvelope,
      flyMultiple,
      mailboxRef,
      collectionBoxRef,
      isMailboxOpening,
      isCollectionOpening,
      hiddenEnvelopeIds
    }}>
      {children}
      {/* FLIGHT LAYER */}
      <AnimatePresence>
        {activeFlights.map(flight => (
          <FlightEnvelope 
            key={flight.id}
            flight={flight}
            onComplete={() => handleFlightComplete(flight.id)}
          />
        ))}
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
  const isReturn = type === 'COLLECTION_TO_MAILBOX';

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
  // Lower arc for moving to collection so it feels more like sliding in than jumping
  const isToCollection = type === 'DESK_TO_COLLECTION';
  const arcHeight = isToCollection
    ? Math.min(80, Math.max(40, distance * 0.15))
    : Math.min(180, Math.max(80, distance * 0.35));

  const yPeak = Math.min(0, deltaY) - arcHeight;
  
  // Custom trajectories based on flight type
  const yKeyframes = isMailbox
    ? [0, -40, -50, yPeak, deltaY] // Extraction, Suspension, Flight, Landing
    : isToCollection
    ? [0, yPeak, deltaY] // Smoother 3-point
    : [0, yPeak, deltaY];

  const xKeyframes = isMailbox
    ? [0, 0, deltaX * 0.05, deltaX * 0.6, deltaX]
    : [0, deltaX * 0.5, deltaX];

  // Momentum-based rotation — banking in the direction of travel
  const travelAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  const baseRotation = envelope.rotation;
  
  const rotKeyframes = isMailbox
    ? [0, 0, travelAngle * 0.3, baseRotation + (travelAngle * 0.2), baseRotation]
    : isReturn
    ? [baseRotation, baseRotation - 30, baseRotation - 45]
    : [baseRotation, baseRotation - 10, baseRotation + 15]; // Gentle tilt when going to collection

  // Depth scaling — strictly 0.3 in boxes, 1.0 on desk
  const scaleKeyframes = isMailbox
    ? [0.3, 0.35, 0.4, 0.85, 1.0]
    : isReturn
    ? [0.3, 0.6, 0.3]
    : [1.0, 0.8, 0.3]; // Fade size more gracefully

  // Opacity: stays fully visible until the very end of collection drop
  const opacityKeyframes = isMailbox
    ? [1, 1, 1, 1, 1]
    : isReturn
    ? [1, 0.9, 0]
    : [1, 1, 0.5]; // Fade out as it enters box

  const times = isMailbox 
    ? [0, 0.15, 0.25, 0.8, 1.0] 
    : isToCollection
    ? [0, 0.4, 1.0]
    : [0, 0.5, 1.0];
    
  const ease = isMailbox
    ? ["easeOut", "easeInOut", "easeOut", "easeIn"] // 4 segments
    : isToCollection
    ? ["easeOut", "easeInOut"] // Smoother float into the box
    : ["easeOut", "easeIn"]; // 2 segments
    
  const duration = isMailbox 
    ? 0.95 
    : isReturn 
    ? 0.5 
    : 0.85; // Slightly longer for smoother slide

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
        duration,
        ease: ease as any,
        times,
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
