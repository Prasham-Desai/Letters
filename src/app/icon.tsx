import { ImageResponse } from 'next/og';

export const dynamic = "force-static";
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="4" width="20" height="16" rx="2" fill="#d8c8b8" stroke="#7a5a40" strokeWidth="2" />
          <path d="M2 6L12 14L22 6" stroke="#7a5a40" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="14" r="3" fill="#9a3855" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
