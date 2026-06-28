'use client';
import { useEffect, useState } from 'react';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export function useTimeOfDay(): TimeOfDay {
  const [time, setTime] = useState<TimeOfDay>('afternoon');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTime('morning');
    else if (hour >= 12 && hour < 17) setTime('afternoon');
    else if (hour >= 17 && hour < 21) setTime('evening');
    else setTime('night');
  }, []);

  return time;
}
