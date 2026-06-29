// ─── Environment Types ───────────────────────────────────
// Type definitions for the dynamic weather & time-of-day system.

export type TimeOfDay = 'dawn' | 'morning' | 'noon' | 'evening' | 'dusk' | 'night';

export type WeatherState = 'sunny' | 'rain' | 'snow' | 'cloudy';

export interface LightingPreset {
  /** Primary ambient color (CSS color) */
  ambientColor: string;
  /** Shadow color (CSS rgba) */
  shadowColor: string;
  /** Shadow direction in degrees (0 = top, 90 = right) */
  shadowAngle: number;
  /** Overall light intensity 0–1 */
  intensity: number;
  /** Color temperature: 0 = cool blue, 0.5 = neutral, 1 = warm gold */
  warmth: number;
  /** Sky gradient colors [top, middle, bottom] */
  skyGradient: [string, string, string];
  /** Sunlight beam color (CSS rgba) */
  sunlightColor: string;
  /** Whether the desk lamp should be on */
  lampOn: boolean;
  /** Lamp glow intensity 0–1 */
  lampIntensity: number;
}

export interface WeatherConfig {
  /** Rain particle density (0 = none, 1 = heavy) */
  rainDensity: number;
  /** Snow particle density (0 = none, 1 = heavy) */
  snowDensity: number;
  /** Cloud opacity 0–1 */
  cloudOpacity: number;
  /** Cloud coverage 0–1 */
  cloudCoverage: number;
  /** Wind strength 0–1 */
  windStrength: number;
  /** Whether lightning can occur */
  lightning: boolean;
  /** Fog density 0–1 */
  fogDensity: number;
}

export interface EnvironmentState {
  timeOfDay: TimeOfDay;
  /** Interpolation factor within current time period (0–1) */
  timeFactor: number;
  weather: WeatherState;
  /** Temperature in Celsius (for potential UI hints) */
  temperature: number;
  /** Computed lighting preset (may be interpolated between two presets) */
  lighting: LightingPreset;
  /** Computed weather config */
  weatherConfig: WeatherConfig;
  /** Convenience booleans */
  isNight: boolean;
  isDaytime: boolean;
  /** Whether environment data has loaded (false = using defaults) */
  isLoaded: boolean;
}

// ─── Lighting Presets ────────────────────────────────────

export const LIGHTING_PRESETS: Record<TimeOfDay, LightingPreset> = {
  dawn: {
    ambientColor: 'rgba(255, 180, 120, 0.12)',
    shadowColor: 'rgba(80, 40, 20, 0.15)',
    shadowAngle: 170,
    intensity: 0.5,
    warmth: 0.75,
    skyGradient: ['#2a1a3a', '#c47858', '#f0a870'],
    sunlightColor: 'rgba(255, 160, 80, 0.15)',
    lampOn: false,
    lampIntensity: 0,
  },
  morning: {
    ambientColor: 'rgba(255, 230, 180, 0.10)',
    shadowColor: 'rgba(60, 40, 20, 0.12)',
    shadowAngle: 150,
    intensity: 0.75,
    warmth: 0.55,
    skyGradient: ['#5a8ec0', '#8abce0', '#c8e0f0'],
    sunlightColor: 'rgba(255, 220, 140, 0.18)',
    lampOn: false,
    lampIntensity: 0,
  },
  noon: {
    ambientColor: 'rgba(255, 255, 240, 0.06)',
    shadowColor: 'rgba(50, 40, 30, 0.10)',
    shadowAngle: 135,
    intensity: 1.0,
    warmth: 0.45,
    skyGradient: ['#3a7cc0', '#68a8e0', '#a8d0f0'],
    sunlightColor: 'rgba(255, 250, 220, 0.12)',
    lampOn: false,
    lampIntensity: 0,
  },
  evening: {
    ambientColor: 'rgba(220, 140, 60, 0.16)',
    shadowColor: 'rgba(80, 40, 10, 0.20)',
    shadowAngle: 110,
    intensity: 0.65,
    warmth: 0.85,
    skyGradient: ['#4a3060', '#c87040', '#e8a050'],
    sunlightColor: 'rgba(255, 140, 40, 0.22)',
    lampOn: false,
    lampIntensity: 0.2,
  },
  dusk: {
    ambientColor: 'rgba(100, 80, 140, 0.12)',
    shadowColor: 'rgba(40, 30, 60, 0.18)',
    shadowAngle: 100,
    intensity: 0.4,
    warmth: 0.5,
    skyGradient: ['#1a1a40', '#4a3070', '#a06850'],
    sunlightColor: 'rgba(180, 120, 80, 0.08)',
    lampOn: true,
    lampIntensity: 0.6,
  },
  night: {
    ambientColor: 'rgba(30, 40, 80, 0.18)',
    shadowColor: 'rgba(10, 15, 40, 0.22)',
    shadowAngle: 90,
    intensity: 0.2,
    warmth: 0.2,
    skyGradient: ['#0a0a20', '#121830', '#1a2040'],
    sunlightColor: 'rgba(100, 130, 200, 0.06)',
    lampOn: true,
    lampIntensity: 1.0,
  },
};

// ─── Weather Configs ─────────────────────────────────────

export const WEATHER_CONFIGS: Record<WeatherState, WeatherConfig> = {
  sunny: {
    rainDensity: 0,
    snowDensity: 0,
    cloudOpacity: 0.2,
    cloudCoverage: 0.15,
    windStrength: 0.1,
    lightning: false,
    fogDensity: 0,
  },
  rain: {
    rainDensity: 0.7,
    snowDensity: 0,
    cloudOpacity: 0.85,
    cloudCoverage: 0.9,
    windStrength: 0.4,
    lightning: true,
    fogDensity: 0.15,
  },
  snow: {
    rainDensity: 0,
    snowDensity: 0.6,
    cloudOpacity: 0.7,
    cloudCoverage: 0.8,
    windStrength: 0.2,
    lightning: false,
    fogDensity: 0.25,
  },
  cloudy: {
    rainDensity: 0,
    snowDensity: 0,
    cloudOpacity: 0.6,
    cloudCoverage: 0.6,
    windStrength: 0.2,
    lightning: false,
    fogDensity: 0.05,
  },
};

// ─── Time Boundaries (hours) ─────────────────────────────
// Each entry: [startHour, endHour]
export const TIME_BOUNDARIES: Record<TimeOfDay, [number, number]> = {
  dawn:    [5, 7],
  morning: [7, 11],
  noon:    [11, 14],
  evening: [14, 18],
  dusk:    [18, 20],
  night:   [20, 5], // wraps around midnight
};

// ─── Helpers ─────────────────────────────────────────────

/** Order of time periods for interpolation */
export const TIME_ORDER: TimeOfDay[] = ['dawn', 'morning', 'noon', 'evening', 'dusk', 'night'];

/** Get the next time period in cycle */
export function getNextTimePeriod(current: TimeOfDay): TimeOfDay {
  const idx = TIME_ORDER.indexOf(current);
  return TIME_ORDER[(idx + 1) % TIME_ORDER.length];
}

/** Linearly interpolate between two numbers */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Linearly interpolate between two CSS color strings (rgba format) */
export function lerpColor(a: string, b: string, t: number): string {
  const parseRgba = (c: string) => {
    const match = c.match(/[\d.]+/g);
    if (!match) return [0, 0, 0, 1];
    return match.map(Number);
  };
  const ca = parseRgba(a);
  const cb = parseRgba(b);
  const r = Math.round(lerp(ca[0], cb[0], t));
  const g = Math.round(lerp(ca[1], cb[1], t));
  const b2 = Math.round(lerp(ca[2], cb[2], t));
  const al = lerp(ca[3] ?? 1, cb[3] ?? 1, t);
  return `rgba(${r}, ${g}, ${b2}, ${al.toFixed(3)})`;
}

/** Interpolate between two lighting presets */
export function interpolateLighting(a: LightingPreset, b: LightingPreset, t: number): LightingPreset {
  return {
    ambientColor: lerpColor(a.ambientColor, b.ambientColor, t),
    shadowColor: lerpColor(a.shadowColor, b.shadowColor, t),
    shadowAngle: lerp(a.shadowAngle, b.shadowAngle, t),
    intensity: lerp(a.intensity, b.intensity, t),
    warmth: lerp(a.warmth, b.warmth, t),
    skyGradient: [
      lerpColor(a.skyGradient[0], b.skyGradient[0], t),
      lerpColor(a.skyGradient[1], b.skyGradient[1], t),
      lerpColor(a.skyGradient[2], b.skyGradient[2], t),
    ],
    sunlightColor: lerpColor(a.sunlightColor, b.sunlightColor, t),
    lampOn: t > 0.5 ? b.lampOn : a.lampOn,
    lampIntensity: lerp(a.lampIntensity, b.lampIntensity, t),
  };
}
