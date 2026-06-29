'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import {
  TimeOfDay,
  TIME_ORDER,
  TIME_BOUNDARIES,
  LIGHTING_PRESETS,
  LightingPreset,
  interpolateLighting,
  getNextTimePeriod,
} from '@/types/environment';

interface TimeState {
  timeOfDay: TimeOfDay;
  /** 0–1 interpolation within current period (0 = start, 1 = transitioning to next) */
  timeFactor: number;
  /** Interpolated lighting preset */
  lighting: LightingPreset;
  isNight: boolean;
  isDaytime: boolean;
}

/**
 * Determines the current time of day and interpolation factor
 * from a given hour (0–23) with fractional minutes.
 */
function computeTimeState(hourFrac: number): { timeOfDay: TimeOfDay; timeFactor: number } {
  // Handle the night wrap-around (20–5 spans midnight)
  for (const period of TIME_ORDER) {
    const [start, end] = TIME_BOUNDARIES[period];
    if (period === 'night') {
      // Night wraps: 20–24 and 0–5
      if (hourFrac >= start || hourFrac < end) {
        const totalDuration = (24 - start) + end; // 9 hours
        const elapsed = hourFrac >= start ? hourFrac - start : (24 - start) + hourFrac;
        return { timeOfDay: 'night', timeFactor: Math.min(1, elapsed / totalDuration) };
      }
    } else {
      if (hourFrac >= start && hourFrac < end) {
        const duration = end - start;
        const elapsed = hourFrac - start;
        return { timeOfDay: period, timeFactor: Math.min(1, elapsed / duration) };
      }
    }
  }
  return { timeOfDay: 'noon', timeFactor: 0.5 };
}

export function useTimeOfDay(): TimeState {
  const [state, setState] = useState<TimeState>(() => {
    const now = new Date();
    const hourFrac = now.getHours() + now.getMinutes() / 60;
    const { timeOfDay, timeFactor } = computeTimeState(hourFrac);
    const nextPeriod = getNextTimePeriod(timeOfDay);
    const lighting = interpolateLighting(
      LIGHTING_PRESETS[timeOfDay],
      LIGHTING_PRESETS[nextPeriod],
      timeFactor
    );
    return {
      timeOfDay,
      timeFactor,
      lighting,
      isNight: timeOfDay === 'night' || timeOfDay === 'dusk',
      isDaytime: timeOfDay === 'morning' || timeOfDay === 'noon',
    };
  });

  const update = useCallback(() => {
    const now = new Date();
    const hourFrac = now.getHours() + now.getMinutes() / 60;
    const { timeOfDay, timeFactor } = computeTimeState(hourFrac);
    const nextPeriod = getNextTimePeriod(timeOfDay);
    const lighting = interpolateLighting(
      LIGHTING_PRESETS[timeOfDay],
      LIGHTING_PRESETS[nextPeriod],
      timeFactor
    );
    setState({
      timeOfDay,
      timeFactor,
      lighting,
      isNight: timeOfDay === 'night' || timeOfDay === 'dusk',
      isDaytime: timeOfDay === 'morning' || timeOfDay === 'noon',
    });
  }, []);

  useEffect(() => {
    // Update every 2 minutes for smooth transitions
    const interval = setInterval(update, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [update]);

  return state;
}
