import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI 剧本杀 | Second Me',
  description: '让你们的 AI 来一场推理对决',
  openGraph: {
    title: 'AI 剧本杀',
    description: '让你们的 AI 来一场推理对决',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
