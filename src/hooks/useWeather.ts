'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { WeatherState, WeatherConfig, WEATHER_CONFIGS } from '@/types/environment';

interface WeatherData {
  weather: WeatherState;
  weatherConfig: WeatherConfig;
  temperature: number;
  isLoaded: boolean;
}

interface GeoLocation {
  lat: number;
  lon: number;
  timezone: string;
}

/**
 * Fetches approximate location from IP geolocation (no API key needed).
 * Falls back to a default location if unavailable.
 */
async function fetchLocationByIP(): Promise<GeoLocation> {
  try {
    const res = await fetch('https://ip-api.com/json/?fields=lat,lon,timezone', {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error('IP geolocation failed');
    const data = await res.json();
    return { lat: data.lat, lon: data.lon, timezone: data.timezone };
  } catch {
    // Default: pleasant location (no specific city — just a temperate zone)
    return { lat: 28.6, lon: 77.2, timezone: 'Asia/Kolkata' };
  }
}

/**
 * Maps WMO weather codes from Open-Meteo to our simplified weather states.
 * Reference: https://open-meteo.com/en/docs#weathervariables
 */
function mapWeatherCode(code: number): WeatherState {
  // Clear / Mainly clear / Partly cloudy
  if (code <= 1) return 'sunny';
  // Overcast / Foggy
  if (code <= 48) return 'cloudy';
  // Drizzle / Rain / Freezing rain / Showers / Thunderstorm
  if (code <= 67 || (code >= 80 && code <= 82) || (code >= 95 && code <= 99)) return 'rain';
  // Snow / Snow grains / Snow showers
  if ((code >= 70 && code <= 77) || (code >= 85 && code <= 86)) return 'snow';
  // Fallback
  return 'cloudy';
}

/**
 * Fetches current weather from Open-Meteo (free, no API key).
 */
async function fetchWeather(lat: number, lon: number): Promise<{ weather: WeatherState; temperature: number }> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=weather_code,temperature_2m&timezone=auto`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error('Weather API failed');
    const data = await res.json();
    const code = data.current?.weather_code ?? 0;
    const temp = data.current?.temperature_2m ?? 22;
    return { weather: mapWeatherCode(code), temperature: temp };
  } catch {
    return { weather: 'sunny', temperature: 22 };
  }
}

/** Refresh interval: 20 minutes */
const REFRESH_MS = 20 * 60 * 1000;

export function useWeather(): WeatherData {
  const [data, setData] = useState<WeatherData>({
    weather: 'sunny',
    weatherConfig: WEATHER_CONFIGS.sunny,
    temperature: 22,
    isLoaded: false,
  });
  const locationRef = useRef<GeoLocation | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const loadWeather = useCallback(async () => {
    // Get location once, then reuse
    if (!locationRef.current) {
      locationRef.current = await fetchLocationByIP();
    }
    const loc = locationRef.current;
    const result = await fetchWeather(loc.lat, loc.lon);

    setData({
      weather: result.weather,
      weatherConfig: WEATHER_CONFIGS[result.weather],
      temperature: result.temperature,
      isLoaded: true,
    });
  }, []);

  useEffect(() => {
    loadWeather();
    intervalRef.current = setInterval(loadWeather, REFRESH_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [loadWeather]);

  return data;
}
