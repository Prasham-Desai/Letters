'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useEnvironment } from '@/contexts/EnvironmentContext';

type Event = 'leaf' | 'butterfly' | 'airplane' | 'lightning' | 'firefly';

export default function AmbientEvents() {
  const [active, setActive] = useState<Event | null>(null);
  const reduced = useReducedMotion();
  const env = useEnvironment();

  useEffect(() => {
    if (reduced) return;
    const schedule = () => {
      const delay = 30000 + Math.random() * 90000; // 30–120 seconds
      return setTimeout(() => {
        const events: Event[] = [];
        // Weather/Time aware event selection
        if (env.weather === 'sunny' && env.isDaytime) events.push('butterfly', 'airplane');
        if (env.weather === 'rain') events.push('lightning', 'leaf');
        if (env.weather === 'cloudy' || env.weather === 'snow') events.push('leaf');
        if (env.isNight && env.weather === 'sunny') events.push('firefly');
        
        // Fallback if none match
        if (events.length === 0) events.push('leaf');

        setActive(events[Math.floor(Math.random() * events.length)]);
        setTimeout(() => { setActive(null); schedule(); }, 5000);
      }, delay);
    };
    const t = schedule();
    return () => clearTimeout(t);
  }, [reduced, env.weather, env.isDaytime, env.isNight]);

  return (
    <AnimatePresence>
      {active === 'leaf' && <LeafEvent key="leaf" />}
      {active === 'butterfly' && <ButterflyEvent key="butterfly" />}
      {active === 'airplane' && <AirplaneEvent key="airplane" />}
      {active === 'lightning' && <LightningEvent key="lightning" />}
      {active === 'firefly' && <FireflyEvent key="firefly" />}
    </AnimatePresence>
  );
}

function LeafEvent() {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ top: '-20px', left: `${20 + Math.random() * 60}%`, zIndex: 5 }}
      initial={{ y: 0, x: 0, rotate: 0, opacity: 0.7 }}
      animate={{ y: '110vh', x: 80, rotate: 360, opacity: [0.7, 0.7, 0] }}
      exit={{}}
      transition={{ duration: 4, ease: 'linear' }}
    >
      <svg width="18" height="24" viewBox="0 0 18 24" fill="none">
        <path d="M9 1 C4 6 1 12 3 18 C5 22 9 23 9 23 C9 23 13 22 15 18 C17 12 14 6 9 1Z" fill="#8a9e8a" opacity="0.6"/>
        <line x1="9" y1="4" x2="9" y2="22" stroke="#6a7e6a" strokeWidth="0.8" opacity="0.4"/>
      </svg>
    </motion.div>
  );
}

function ButterflyEvent() {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ top: `${20 + Math.random() * 40}%`, left: '-40px', zIndex: 5 }}
      initial={{ x: 0, y: 0 }}
      animate={{ x: '110vw', y: [0, -30, 20, -15, 0] }}
      exit={{}}
      transition={{ duration: 5, ease: 'easeInOut' }}
    >
      <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
        <ellipse cx="7" cy="8" rx="7" ry="5" fill="#b5c4b1" opacity="0.55" transform="rotate(-20 7 8)"/>
        <ellipse cx="21" cy="8" rx="7" ry="5" fill="#b5c4b1" opacity="0.55" transform="rotate(20 21 8)"/>
        <ellipse cx="7" cy="13" rx="5" ry="3.5" fill="#8a9e8a" opacity="0.4" transform="rotate(-10 7 13)"/>
        <ellipse cx="21" cy="13" rx="5" ry="3.5" fill="#8a9e8a" opacity="0.4" transform="rotate(10 21 13)"/>
        <line x1="14" y1="3" x2="14" y2="18" stroke="#3a3530" strokeWidth="0.8" opacity="0.4"/>
      </svg>
    </motion.div>
  );
}

function AirplaneEvent() {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ top: `${15 + Math.random() * 35}%`, right: '-40px', zIndex: 5 }}
      initial={{ x: 0, rotate: 180 }}
      animate={{ x: '-110vw' }}
      exit={{}}
      transition={{ duration: 3.5, ease: 'easeIn' }}
    >
      <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
        <path d="M30 10 L4 2 L8 10 L4 18 Z" fill="#b8b0a4" opacity="0.55"/>
        <path d="M8 10 L14 5 L20 10 L14 12 Z" fill="#a0917b" opacity="0.4"/>
      </svg>
    </motion.div>
  );
}

function LightningEvent() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 4 }}
      initial={{ backgroundColor: 'rgba(255,255,255,0)' }}
      animate={{ backgroundColor: ['rgba(255,255,255,0)', 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0)'] }}
      transition={{ duration: 0.8, ease: 'linear' }}
    />
  );
}

function FireflyEvent() {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ top: `${40 + Math.random() * 20}%`, left: `${20 + Math.random() * 60}%`, zIndex: 5 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 1, 0, 1, 0],
        scale: [0, 1.5, 0.5, 1.5, 0],
        x: [0, 15, -15, 10, 0],
        y: [0, -10, -20, 5, -30]
      }}
      transition={{ duration: 6, ease: 'easeInOut' }}
    >
      <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#c8ffb0', boxShadow: '0 0 8px 3px rgba(200,255,150,0.6)' }} />
    </motion.div>
  );
}
