'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';
import { PlacedEnvelope } from '@/types/letter';
import { motion, AnimatePresence, Easing } from 'framer-motion';
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
  triggerMailboxOpen: (ms: number) => void;
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

  const triggerMailboxOpen = useCallback((ms: number) => {
    setIsMailboxOpening(true);
    setTimeout(() => {
      setIsMailboxOpening(false);
    }, ms);
  }, []);

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

  const handleFlightComplete = useCallback((completedFlightId: string, envelopeId: string) => {
    setActiveFlights(prev => {
      const flight = prev.find(f => f.id === completedFlightId);
      if (!flight) return prev;

      const next = prev.filter(f => f.id !== completedFlightId);

      // Handle closing boxes only if this is a standard queued flight
      if (next.length === 0 && isProcessing.current) {
        if (flight.type === 'MAILBOX_TO_DESK') setIsMailboxOpening(false);
        else if (flight.type === 'DESK_TO_COLLECTION') setIsCollectionOpening(false);
      }

      if (next.length === 0 && isProcessing.current) {
        setTimeout(() => {
          isProcessing.current = false;
          processQueue();
        }, 150);
      }

      return next;
    });

    setHiddenEnvelopeIds(hprev => {
      const hnext = new Set(hprev);
      hnext.delete(envelopeId);
      return hnext;
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
      hiddenEnvelopeIds,
      triggerMailboxOpen
    }}>
      {children}
      {/* FLIGHT LAYER */}
      <AnimatePresence>
        {activeFlights.map(flight => (
          <FlightEnvelope
            key={flight.id}
            flight={flight}
            mailboxRef={mailboxRef}
            collectionBoxRef={collectionBoxRef}
            onComplete={(envId) => handleFlightComplete(flight.id, envId)}
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

// ---------------------------------------------------------------------------
// FlightEnvelope
//
// Renders the flying clone. Motion is a single continuous arc built from
// exactly 3 keyframes (start -> apex -> destination). We let Framer Motion's
// own eased interpolation carry the value between those 3 points instead of
// hand-sampling the curve into dozens of linear steps - that's what was
// producing the "lands, then jitters into place" artifact, since position,
// scale, rotation and opacity were being stepped independently and could
// drift out of sync with each other frame-to-frame. With 3 shared keyframes
// and one eased transition per channel, every property reaches the
// destination at the exact same instant, so the clone simply *arrives* -
// no separate settle/plop phase.
// ---------------------------------------------------------------------------

const MAILBOX_SLOT_INSET_RATIO = 0.18;    // where letters emerge from on the mailbox
const COLLECTION_SLOT_INSET_RATIO = 0.18; // where letters vanish into on the collection box

function slotCenter(rect: DOMRect, insetRatio: number) {
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height * insetRatio,
  };
}

function rectCenter(rect: DOMRect) {
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

function FlightEnvelope({
  flight,
  mailboxRef,
  collectionBoxRef,
  onComplete,
}: {
  flight: Flight;
  mailboxRef: React.RefObject<HTMLDivElement | null>;
  collectionBoxRef: React.RefObject<HTMLDivElement | null>;
  onComplete: (envelopeId: string) => void;
}) {
  const { startRect, endRect, type, envelope } = flight;

  const isMailboxType = type === 'MAILBOX_TO_DESK';
  const isReturnType = type === 'COLLECTION_TO_MAILBOX';
  const isCollectionType = type === 'DESK_TO_COLLECTION';

  const envWidth = envelope.width;
  const envHeight = envelope.height;

  // --- Resolve exact start point -------------------------------------------------
  // MAILBOX_TO_DESK always launches from the mailbox slot itself (never from
  // whatever rect happened to be passed in), so letters never appear to start
  // "below" the mailbox.
  const start = (() => {
    if (isMailboxType && mailboxRef.current) {
      return slotCenter(mailboxRef.current.getBoundingClientRect(), MAILBOX_SLOT_INSET_RATIO);
    }
    return rectCenter(startRect);
  })();

  // --- Resolve exact end point -----------------------------------------------------
  // DESK_TO_COLLECTION ends right at the collection box's slot opening (not its
  // vertical center - it should vanish at the top, not visibly drop inside).
  // COLLECTION_TO_MAILBOX returns to the mailbox slot for the same reason.
  const end = (() => {
    if (isCollectionType) {
      const rect = collectionBoxRef.current ? collectionBoxRef.current.getBoundingClientRect() : endRect;
      return slotCenter(rect, COLLECTION_SLOT_INSET_RATIO);
    }
    if (isReturnType && mailboxRef.current) {
      return slotCenter(mailboxRef.current.getBoundingClientRect(), MAILBOX_SLOT_INSET_RATIO);
    }
    return rectCenter(endRect);
  })();

  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;

  const baseRotation = envelope.rotation;

  // Per-type animation values.
  let startScale = 1, endScale = 1;
  let rotStart = baseRotation, rotEnd = baseRotation;
  let duration = 0.85;
  let fadeAt = 1; // fraction of duration at which opacity begins dropping to 0 (1 = never fades)

  if (isMailboxType) {
    startScale = 0.35; endScale = 1.0;
    rotStart = 0; rotEnd = baseRotation;
    duration = 1.0;
  } else if (isCollectionType) {
    startScale = 1.0; endScale = 0.3;
    rotStart = baseRotation; rotEnd = baseRotation + 15;
    fadeAt = 0.7; // stay fully visible, then vanish right into the slot
    duration = 0.85;
  } else if (isReturnType) {
    startScale = 0.3; endScale = 0.3;
    rotStart = baseRotation; rotEnd = baseRotation - 45;
    fadeAt = 0.7;
    duration = 0.5;
  }

  // Opacity: either constant, or a simple two-point fade near the very end.
  const opacityKeyframes = fadeAt >= 1 ? [1, 1] : [1, 1, 0];
  const opacityTimes = fadeAt >= 1 ? [0, 1] : [0, fadeAt, 1];
  const opacityTransition = { duration, times: opacityTimes, ease: 'easeOut' as Easing };

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: start.x,
        top: start.y,
        width: envWidth,
        height: envHeight,
        margin: `${-envHeight / 2}px 0 0 ${-envWidth / 2}px`,
        zIndex: 9999,
        pointerEvents: 'none',
        transformOrigin: 'center bottom',
        filter: 'drop-shadow(0 12px 24px rgba(40,24,8,0.3))',
      }}
      initial={{
        x: 0,
        y: 0,
        scale: startScale,
        rotate: rotStart,
        opacity: opacityKeyframes[0],
      }}
      animate={{
        x: deltaX,
        y: deltaY,
        scale: endScale,
        rotate: rotEnd,
        opacity: opacityKeyframes,
      }}
      transition={{
        duration,
        ease: 'easeInOut',
        opacity: { duration, times: opacityTimes, ease: 'easeOut' }
      }}
      onAnimationComplete={() => {
        flight.onComplete();
        onComplete(flight.envelope.id);
      }}
    >
      <Envelope
        data={{ ...envelope, x: 0, y: 0 }}
        isOpened={false}
        onClick={() => { }}
        isClone={true}
      />
    </motion.div>
  );
}