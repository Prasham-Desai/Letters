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

// Internal Component to render the flying clone
function FlightEnvelope({ flight, onComplete }: { flight: Flight, onComplete: () => void }) {
  const { startRect, endRect, type, envelope } = flight;
  
  // Calculate exact delta in absolute screen space
  const deltaX = endRect.left - startRect.left;
  const deltaY = endRect.top - startRect.top;
  
  // Parabolic peak height (curves upward based on horizontal travel)
  const peakY = deltaY < 0 ? deltaY - 120 : -120; 

  const isMailbox = type === 'MAILBOX_TO_DESK';

  // Bezier trajectory
  // Mailbox -> Desk: Lifts vertically, then arcs to destination
  // Desk -> Collection: Arcs and scales down

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: startRect.left,
        top: startRect.top,
        width: startRect.width, // Match exact DOM size
        height: startRect.height,
        zIndex: 9999, // Fly over everything
        pointerEvents: 'none', // Ignore clicks mid-flight
        transformOrigin: 'center center',
      }}
      initial={{ 
        x: 0, 
        y: isMailbox ? 40 : 0, // start slightly hidden inside mailbox
        scale: isMailbox ? 0.6 : 1, 
        rotate: isMailbox ? envelope.rotation - 45 : envelope.rotation 
      }}
      animate={{ 
        x: deltaX, 
        y: [isMailbox ? 40 : 0, peakY, deltaY], // Parabolic arc keyframes
        scale: isMailbox ? [0.6, 1.15, 1] : [1, 1.15, 0.4], // Scale up for depth illusion
        rotate: [
          isMailbox ? envelope.rotation - 45 : envelope.rotation, 
          isMailbox ? envelope.rotation + 15 : envelope.rotation - 15, // Banking in air
          isMailbox ? envelope.rotation : envelope.rotation + 45
        ],
      }}
      transition={{
        duration: 0.65,
        ease: "easeInOut",
        times: [0, 0.5, 1], // Map the 3 keyframes
      }}
      onAnimationComplete={onComplete}
    >
      {/* 
        Render a non-interactive clone of the envelope.
        We pass x=0, y=0 because the outer motion.div handles translation!
      */}
      <Envelope 
        data={{...envelope, x: 0, y: 0}} 
        isOpened={false}
        onClick={() => {}} // Disabled
      />
    </motion.div>
  );
}
