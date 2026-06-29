'use client';
import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useTimeOfDay } from '@/hooks/useTimeOfDay';
import { useWeather } from '@/hooks/useWeather';
import { EnvironmentState } from '@/types/environment';

const EnvironmentContext = createContext<EnvironmentState | null>(null);

export function EnvironmentProvider({ children }: { children: ReactNode }) {
  const time = useTimeOfDay();
  const weather = useWeather();

  const state = useMemo<EnvironmentState>(() => ({
    timeOfDay: time.timeOfDay,
    timeFactor: time.timeFactor,
    weather: weather.weather,
    temperature: weather.temperature,
    lighting: time.lighting,
    weatherConfig: weather.weatherConfig,
    isNight: time.isNight,
    isDaytime: time.isDaytime,
    isLoaded: weather.isLoaded,
  }), [time, weather]);

  return (
    <EnvironmentContext.Provider value={state}>
      {children}
    </EnvironmentContext.Provider>
  );
}

export function useEnvironment(): EnvironmentState {
  const ctx = useContext(EnvironmentContext);
  if (!ctx) throw new Error('useEnvironment must be used within EnvironmentProvider');
  return ctx;
}
