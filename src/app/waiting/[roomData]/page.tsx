'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { SCRIPTS } from '@/data/scripts';
import { Script } from '@/lib/types';
import { useTranslation } from '@/i18n';

function decodeRoom(encoded: string): Record<string, unknown> | null {
  try {
    return JSON.parse(atob(encoded.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

function LoadingScreen() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="w-12 h-12 rounded-full border-2 border-red-500/30 border-t-red-500 animate-spin mx-auto mb-4" />
        <p className="text-zinc-500 text-sm">{t('waiting.loading')}</p>
      </div>
    </main>
  );
}

export default function WaitingPage() {
  const { t } = useTranslation();
  const params = useParams();
  const roomData = params.roomData as string;

  const [room, setRoom] = useState<Record<string, unknown> | null>(null);
  const [script, setScript] = useState<Script | null>(null);
  const [copied, setCopied] = useState(false);
  const [players, setPlayers] = useState<Array<{ name: string; characterId?: string; ready: boolean }>>([]);
  const [polling, setPolling] = useState(true);

  // Character selection state
  const [showCharacterSelect, setShowCharacterSelect] = useState(false);
  const [selectedCharacters, setSelectedCharacters] = useState<Record<string, string>>({});
  const [mySelectedCharacter, setMySelectedCharacter] = useState<string | null>(null);

  const inviteLink = typeof window !== 'undefined'
    ? `${window.location.origin}/join/${roomData}`
    : '';

  // Poll room status
  const pollRoom = useCallback(async (roomId: string) => {
    try {
      const res = await fetch(`/api/game/room?roomId=${roomId}`);
      if (res.ok) {
        const data = await res.json();
        setPlayers(data.room.players);
      }
    } catch (err) {
      console.error('Poll error:', err);
    }
  }, []);

  useEffect(() => {
    const decoded = decodeRoom(roomData);
    if (decoded) {
      setRoom(decoded);
      const s = SCRIPTS.find(s => s.id === decoded.scriptId);
      setScript(s || null);

      pollRoom(decoded.id as string);
      const interval = setInterval(() => {
        if (polling) pollRoom(decoded.id as string);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [roomData, polling, pollRoom]);

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getAICharacters = () => {
    if (!script) return [];
    const selectedIds = Object.values(selectedCharacters);
    if (mySelectedCharacter) selectedIds.push(mySelectedCharacter);
    return script.characters.filter(c => !selectedIds.includes(c.id));
  };

  const startGame = () => {
    const aiCharacterIds = getAICharacters().map(c => c.id);
    const playerCharacterIds = mySelectedCharacter ? [mySelectedCharacter] : [];

    const searchParams = new URLSearchParams();
    if (playerCharacterIds.length > 0) {
      searchParams.set('playerCharacters', playerCharacterIds.join(','));
    }
    if (aiCharacterIds.length > 0) {
      searchParams.set('aiCharacters', aiCharacterIds.join(','));
    }

    window.location.href = `/play/${roomData}?${searchParams.toString()}`;
  };

  const canStart = mySelectedCharacter !== null;

  if (!script) {
    return <LoadingScreen />;
  }

  const aiCharacters = getAICharacters();
  const scriptTitle = t(`script.${script.id}.title`);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Atmospheric orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-red-900/15 rounded-full blur-[120px] animate-breathe pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-900/10 rounded-full blur-[140px] animate-breathe pointer-events-none" style={{ animationDelay: '2s' }} />

      <div className="max-w-lg w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4 animate-fade-in-down">
            <div className="absolute inset-0 bg-red-500/15 rounded-full blur-xl scale-150" />
            <div className="relative text-6xl animate-float">{script.cover}</div>
          </div>

          <h1 className="text-3xl font-black text-white mb-2 animate-fade-in-up delay-100" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {scriptTitle}
          </h1>
          <p className="text-zinc-400 text-sm animate-fade-in-up delay-200">
            {showCharacterSelect ? t('waiting.choose-character') : t('waiting.room-created')}
          </p>
        </div>

        {!showCharacterSelect ? (
          <>
            {/* Player list */}
            <div className="glass-card p-5 mb-5 animate-fade-in-up delay-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs uppercase tracking-[0.15em] text-zinc-500 font-medium">{t('waiting.players')}</h3>
                <span className="text-xs text-zinc-600">
                  {players.length}/{script.playerCount.max}
                </span>
              </div>
              <div className="space-y-2">
                {players.map((player, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-white/[0.03] rounded-xl p-3 border border-white/5 hover:border-white/10 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/20 to-purple-500/20 flex items-center justify-center text-sm border border-white/10">
                        {i === 0 ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5.09 20h13.82"/></svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-400"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
                        )}
                      </div>
                      <span className="text-white text-sm font-medium">{player.name}</span>
                    </div>
                    {player.ready && (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 rounded-full px-2.5 py-1">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        {t('waiting.ready')}
                      </span>
                    )}
                  </div>
                ))}

                {/* Empty slots */}
                {Array.from({ length: Math.max(0, script.playerCount.min - players.length) }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="flex items-center gap-3 rounded-xl p-3 border border-dashed border-white/10"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/[0.02] flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-700"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                    </div>
                    <span className="text-zinc-600 text-sm">{t('waiting.waiting-player')}</span>
                  </div>
                ))}
              </div>

              <p className="text-zinc-600 text-xs mt-4 text-center">
                {t('waiting.needs-roles', { min: script.playerCount.min, max: script.playerCount.max })}
                {players.length < script.characters.length && (
                  <span className="text-amber-500/80 ml-1">{t('waiting.ai-fills')}</span>
                )}
              </p>
            </div>

            {/* Invite section */}
            <div className="glass-card-strong p-5 mb-5 animate-fade-in-up delay-400">
              <p className="text-xs uppercase tracking-[0.15em] text-zinc-500 font-medium mb-3">{t('waiting.invite-link')}</p>
              <div className="bg-black/40 rounded-xl p-3 mb-4 font-mono text-xs text-red-400/80 break-all max-h-16 overflow-auto border border-white/5">
                {inviteLink}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={copyLink}
                  className="btn-secondary text-sm py-3"
                >
                  <span className="relative z-10">
                    {copied ? (
                      <span className="inline-flex items-center gap-1.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-400"><polyline points="20 6 9 17 4 12"/></svg>
                        {t('waiting.copied')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                        {t('waiting.copy')}
                      </span>
                    )}
                  </span>
                </button>

                <button
                  onClick={() => setShowCharacterSelect(true)}
                  className="btn-primary text-sm py-3"
                >
                  <span>{t('waiting.choose-role')}</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Character selection */}
            <div className="glass-card p-5 mb-5 animate-scale-in">
              <h3 className="text-xs uppercase tracking-[0.15em] text-zinc-500 font-medium mb-5 text-center">{t('waiting.select-character')}</h3>
              <div className="space-y-3">
                {script.characters.map((char, i) => {
                  const isSelected = mySelectedCharacter === char.id;
                  const isTakenByOther = Object.values(selectedCharacters).includes(char.id);
                  const charName = t(`script.${script.id}.char.${char.id}.name`);
                  const charDescription = t(`script.${script.id}.char.${char.id}.description`);

                  return (
                    <button
                      key={char.id}
                      onClick={() => !isTakenByOther && setMySelectedCharacter(isSelected ? null : char.id)}
                      disabled={isTakenByOther}
                      className={`w-full text-left transition-all duration-300 rounded-xl border-2 p-4 ${
                        isSelected
                          ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_20px_rgba(220,38,38,0.15)]'
                          : isTakenByOther
                            ? 'bg-zinc-900/50 border-zinc-800 opacity-40 cursor-not-allowed'
                            : 'bg-white/[0.02] border-transparent hover:border-white/15 hover:bg-white/[0.04]'
                      }`}
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-all duration-300 ${
                          isSelected ? 'bg-red-500/20 border border-red-500/30' : 'bg-white/5 border border-white/10'
                        }`}>
                          {char.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`font-semibold transition-colors duration-300 ${isSelected ? 'text-red-400' : 'text-white'}`}>
                              {charName}
                            </span>
                            {isSelected && (
                              <span className="text-[10px] uppercase tracking-wider bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
                                {t('waiting.your-role')}
                              </span>
                            )}
                            {isTakenByOther && (
                              <span className="text-[10px] uppercase tracking-wider bg-zinc-700 text-zinc-400 px-2 py-0.5 rounded-full font-bold">
                                {t('waiting.taken')}
                              </span>
                            )}
                          </div>
                          <p className="text-zinc-500 text-sm mt-1 leading-relaxed">{charDescription}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI roles preview */}
            {mySelectedCharacter && aiCharacters.length > 0 && (
              <div className="glass-card p-4 mb-5 border-purple-500/20 animate-fade-in-up" style={{ background: 'rgba(139, 92, 246, 0.05)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-400"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                  <h3 className="text-xs uppercase tracking-[0.15em] text-purple-400 font-medium">{t('waiting.ai-controlled')}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aiCharacters.map(char => {
                    const charName = t(`script.${script.id}.char.${char.id}.name`);

                    return (
                      <div key={char.id} className="inline-flex items-center gap-2 bg-white/[0.03] rounded-lg px-3 py-2 border border-purple-500/10">
                        <span className="text-lg">{char.avatar}</span>
                        <span className="text-zinc-300 text-sm">{charName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <button
              onClick={startGame}
              disabled={!canStart}
              className="btn-primary w-full text-lg py-4 mb-4 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none animate-fade-in-up delay-200"
            >
              <span>{t('waiting.start-game')}</span>
            </button>

            <button
              onClick={() => {
                setShowCharacterSelect(false);
                setMySelectedCharacter(null);
              }}
              className="w-full text-center text-zinc-500 hover:text-zinc-300 transition-colors text-sm py-2"
            >
              <svg className="inline-block w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
              {t('waiting.back-lobby')}
            </button>
          </>
        )}

        <a href="/" className="block mt-8 text-center text-zinc-600 hover:text-zinc-400 transition-colors text-sm animate-fade-in delay-600">
          <svg className="inline-block w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          {t('waiting.home')}
        </a>
      </div>
    </main>
  );
}
