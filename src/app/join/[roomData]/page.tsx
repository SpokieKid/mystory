'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { SCRIPTS } from '@/data/scripts';
import { Script } from '@/lib/types';

function decodeRoom(encoded: string): Record<string, unknown> | null {
  try {
    return JSON.parse(atob(encoded.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

function LoadingScreen() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="w-12 h-12 rounded-full border-2 border-red-500/30 border-t-red-500 animate-spin mx-auto mb-4" />
        <p className="text-zinc-500 text-sm">Loading invitation...</p>
      </div>
    </main>
  );
}

export default function JoinPage() {
  const params = useParams();
  const roomData = params.roomData as string;

  const [room, setRoom] = useState<Record<string, unknown> | null>(null);
  const [script, setScript] = useState<Script | null>(null);

  useEffect(() => {
    const decoded = decodeRoom(roomData);
    if (decoded) {
      setRoom(decoded);
      const s = SCRIPTS.find(s => s.id === decoded.scriptId);
      setScript(s || null);
    }
  }, [roomData]);

  const joinGame = () => {
    window.location.href = `/api/auth/login?role=player&roomData=${roomData}`;
  };

  if (!script || !room) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Atmospheric orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-red-900/15 rounded-full blur-[120px] animate-breathe pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-900/10 rounded-full blur-[140px] animate-breathe pointer-events-none" style={{ animationDelay: '2s' }} />

      <div className="max-w-md w-full text-center relative z-10">
        {/* Script cover with glow */}
        <div className="relative inline-block mb-6 animate-fade-in-down">
          <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl scale-150" />
          <div className="relative text-7xl animate-float">{script.cover}</div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-black text-white mb-3 animate-fade-in-up delay-100" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {script.title}
        </h1>

        {/* Host invitation */}
        <div className="inline-flex items-center gap-2 bg-white/5 rounded-full px-4 py-2 mb-3 animate-fade-in-up delay-200">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-zinc-400 text-sm">
            <span className="text-white font-medium">{room.hostName as string}</span> invited you
          </span>
        </div>

        <p className="text-zinc-500 text-sm mb-8 animate-fade-in-up delay-300 leading-relaxed max-w-xs mx-auto">
          {script.description}
        </p>

        {/* Character preview */}
        <div className="glass-card p-5 mb-8 animate-fade-in-up delay-400">
          <h3 className="text-xs uppercase tracking-[0.15em] text-zinc-500 font-medium mb-4">Available Roles</h3>
          <div className="flex justify-center gap-3 flex-wrap">
            {script.characters.map((char, i) => (
              <div
                key={char.id}
                className="group relative"
                style={{ animationDelay: `${500 + i * 100}ms` }}
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-300 cursor-default">
                  {char.avatar}
                </div>
                <div className="text-zinc-400 text-[11px] mt-2 font-medium">{char.name}</div>
                {/* Tooltip */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-zinc-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-zinc-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                  {char.description.slice(0, 30)}...
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Join button */}
        <button
          onClick={joinGame}
          className="btn-primary w-full text-lg py-4 animate-fade-in-up delay-500"
        >
          <span>Join the Game</span>
        </button>

        <p className="text-zinc-600 text-xs mt-4 animate-fade-in delay-600">
          Your AI will take on a character role after authorization
        </p>

        <a href="/" className="inline-block mt-8 text-zinc-600 hover:text-zinc-400 transition-colors text-sm animate-fade-in delay-700">
          Or create your own room
          <svg className="inline-block ml-1 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
      </div>
    </main>
  );
}
