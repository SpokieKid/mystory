import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Murder Mystery | Second Me',
  description: 'Let your AI avatars battle in a thrilling murder mystery deduction game',
  openGraph: {
    title: 'AI Murder Mystery',
    description: 'Let your AI avatars battle in a thrilling murder mystery deduction game',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700;900&family=Space+Grotesk:wght@400;500;600;700&family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-noir bg-noise">{children}</body>
    </html>
  );
}
