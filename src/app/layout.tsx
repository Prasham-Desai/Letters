import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "When You Need Me",
  description: "A small collection of notes. For every version of you.",
  openGraph: {
    title: "When You Need Me",
    description: "A small collection of notes. For every version of you.",
    type: "website",
  },
};

import { AnimationProvider } from '@/contexts/AnimationContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600&family=Kalam:wght@300;400;700&family=Nunito:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <AnimationProvider>
          {children}
        </AnimationProvider>
      </body>
    </html>
  );
}
