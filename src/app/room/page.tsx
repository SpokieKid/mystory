'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SCRIPTS } from '@/data/scripts';
import { Script } from '@/lib/types';
import { useTranslation } from '@/i18n';

function LoadingSpinner() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="w-12 h-12 rounded-full border-2 border-red-500/30 border-t-red-500 animate-spin mx-auto mb-4" />
        <p className="text-zinc-500 text-sm">{t('room.loading')}</p>
      </div>
    </main>
  );
}

function RoomContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const scriptId = searchParams.get('script');

  const [script, setScript] = useState<Script | null>(null);
  const [roomId, setRoomId] = useState<string>('');

  useEffect(() => {
    if (scriptId) {
      const s = SCRIPTS.find(s => s.id === scriptId);
      setScript(s || null);

      const newRoomId = Math.random().toString(36).slice(2, 10);
      setRoomId(newRoomId);
    }
  }, [scriptId]);

  useEffect(() => {
    if (script && roomId) {
      window.location.href = `/api/auth/login?scriptId=${script.id}&roomId=${roomId}&role=host`;
    }
  }, [script, roomId]);

  if (!script) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Atmospheric orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-900/15 rounded-full blur-[150px] animate-breathe pointer-events-none" />

      <div className="relative z-10 text-center animate-fade-in">
        {/* Script cover with glow */}
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl scale-150 animate-breathe" />
          <div className="relative text-7xl animate-float">{script.cover}</div>
        </div>

        {/* Loading spinner */}
        <div className="w-10 h-10 rounded-full border-2 border-red-500/30 border-t-red-500 animate-spin mx-auto mb-6" />

        <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {t('room.creating')}
        </h2>
        <p className="text-zinc-500 text-sm">
          {t('room.redirecting')}
        </p>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1 mt-6">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </main>
  );
}

export default function RoomPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RoomContent />
    </Suspense>
  );
}
