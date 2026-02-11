'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { SCRIPTS } from '@/data/scripts';
import { Script, Character, Dialogue } from '@/lib/types';
import html2canvas from 'html2canvas';

function decodeRoom(encoded: string): Record<string, unknown> | null {
  try {
    return JSON.parse(atob(encoded.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

/* ============================================
   Sub-components
   ============================================ */

function SceneProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 rounded-full transition-all duration-500 ${
            i < current
              ? 'bg-red-500 w-6'
              : i === current
                ? 'bg-red-400 w-8 animate-pulse'
                : 'bg-white/10 w-4'
          }`}
        />
      ))}
    </div>
  );
}

function DialogueBubble({
  dialogue,
  character,
  isPlayer,
  hasPlayerCharacter,
  index,
}: {
  dialogue: Dialogue;
  character: Character | undefined;
  isPlayer: boolean;
  hasPlayerCharacter: boolean;
  index: number;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = () => {
    if (dialogue.audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(dialogue.audioUrl);
      audioRef.current = audio;
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onpause = () => setIsPlaying(false);
      audio.play();
    }
  };

  return (
    <div
      className={`animate-fade-in-up dialogue-bubble ${isPlayer ? 'is-player' : ''} ${!isPlayer && hasPlayerCharacter ? 'is-ai' : ''}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center gap-3 mb-2.5">
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
          isPlayer
            ? 'bg-purple-500/15 border border-purple-500/30'
            : 'bg-white/5 border border-white/10'
        }`}>
          {character?.avatar}
        </div>

        {/* Name + badges */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className={`font-semibold text-sm ${isPlayer ? 'text-purple-300' : 'text-white'}`}>
            {character?.name}
          </span>
          {isPlayer && (
            <span className="text-[9px] uppercase tracking-wider bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-bold">
              You
            </span>
          )}
          {!isPlayer && hasPlayerCharacter && (
            <span className="text-[9px] uppercase tracking-wider bg-white/5 text-zinc-500 px-1.5 py-0.5 rounded font-bold">
              AI
            </span>
          )}
        </div>

        {/* Audio controls */}
        {dialogue.audioUrl ? (
          <button
            onClick={playAudio}
            className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full transition-all duration-200 ${
              isPlaying
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'bg-white/5 text-zinc-400 hover:bg-emerald-500/10 hover:text-emerald-400'
            }`}
          >
            {isPlaying ? (
              <>
                <span className="flex gap-0.5">
                  <span className="w-0.5 h-3 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="w-0.5 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                  <span className="w-0.5 h-3.5 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                </span>
                Playing
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Voice
              </>
            )}
          </button>
        ) : (
          <span className="text-[10px] text-zinc-700">no voice</span>
        )}
      </div>

      <p className="text-zinc-300 text-sm leading-relaxed pl-[52px]">{dialogue.content}</p>

      {dialogue.audioUrl && (
        <audio
          src={dialogue.audioUrl}
          controls
          className="mt-3 ml-[52px] h-7 w-full max-w-xs opacity-50 hover:opacity-80 transition-opacity"
        />
      )}
    </div>
  );
}

function GeneratingIndicator() {
  return (
    <div className="flex items-center justify-center gap-3 py-8 animate-fade-in">
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-zinc-500 text-sm">AI characters are speaking...</span>
    </div>
  );
}

function VoteCard({
  character,
  onVote,
}: {
  character: Character;
  onVote: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onVote(character.id)}
      className="group glass-card p-5 text-center hover:border-red-500/40 hover:bg-red-500/5 active:scale-95 transition-all duration-300"
    >
      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{character.avatar}</div>
      <div className="text-white font-semibold text-sm">{character.name}</div>
    </button>
  );
}

/* ============================================
   Main Play Content
   ============================================ */

function PlayContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomData = params.roomData as string;
  const dialogueEndRef = useRef<HTMLDivElement>(null);

  // Character assignment params
  const playerCharacterIds = searchParams.get('playerCharacters')?.split(',').filter(Boolean) || [];
  const aiCharacterIdsParam = searchParams.get('aiCharacters')?.split(',').filter(Boolean) || [];

  // Legacy solo mode compat
  const legacyMyCharacter = searchParams.get('myCharacter');

  const [script, setScript] = useState<Script | null>(null);
  const [currentScene, setCurrentScene] = useState(0);
  const [dialogues, setDialogues] = useState<Dialogue[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ won: boolean; murdererId: string } | null>(null);
  const [showMyInfo, setShowMyInfo] = useState(false);
  const [sceneTransition, setSceneTransition] = useState(false);

  // Determine player & AI characters
  const myCharacterIds = playerCharacterIds.length > 0
    ? playerCharacterIds
    : (legacyMyCharacter ? [legacyMyCharacter] : []);

  const myCharacters = script?.characters.filter(c => myCharacterIds.includes(c.id)) || [];
  const aiCharacters = script?.characters.filter(c =>
    aiCharacterIdsParam.includes(c.id) ||
    (myCharacterIds.length > 0 && !myCharacterIds.includes(c.id))
  ) || [];

  const hasPlayerCharacter = myCharacterIds.length > 0;

  // Auto-scroll to bottom of dialogues
  useEffect(() => {
    if (dialogueEndRef.current) {
      dialogueEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [dialogues, generating]);

  useEffect(() => {
    const decoded = decodeRoom(roomData);
    if (decoded) {
      const s = SCRIPTS.find(s => s.id === decoded.scriptId);
      setScript(s || null);
    }
    setLoading(false);
  }, [roomData]);

  // Generate scene dialogues
  const generateSceneDialogues = async () => {
    if (!script) return;

    setGenerating(true);

    const decoded = decodeRoom(roomData);
    const roomId = decoded?.id;

    try {
      const res = await fetch('/api/game/dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scriptId: script.id,
          sceneIndex: currentScene,
          roomId,
          playerCharacterIds: myCharacterIds,
          aiCharacterIds: aiCharacters.map(c => c.id),
          previousDialogues: dialogues.map(d => {
            const char = script.characters.find(c => c.id === d.characterId);
            return `${char?.name || '???'}：${d.content}`;
          }),
        }),
      });

      const data = await res.json();

      if (data.dialogues) {
        setDialogues(prev => [...prev, ...data.dialogues]);
      }
    } catch (err) {
      console.error('Failed to generate dialogues:', err);
    } finally {
      setGenerating(false);
    }
  };

  // Next scene with cinematic transition
  const nextScene = () => {
    if (!script) return;

    setSceneTransition(true);
    setTimeout(() => {
      if (currentScene < script.scenes.length - 1) {
        setCurrentScene(prev => prev + 1);
      } else {
        setGameEnded(true);
      }
      setSceneTransition(false);
    }, 800);
  };

  // Vote handler
  const handleVote = (characterId: string) => {
    if (!script) return;

    const newVotes: Record<string, string> = {};
    script.characters.forEach(char => {
      newVotes[char.id] = characterId;
    });
    setVotes(newVotes);

    const murderer = script.characters.find(c => c.isMurderer);
    const isCorrect = characterId === murderer?.id ||
      (characterId === 'other' && !murderer);

    // Dramatic delay before reveal
    setTimeout(() => {
      setResult({
        won: isCorrect,
        murdererId: murderer?.id || 'other',
      });
    }, 1500);
  };

  // Save result as image
  const saveResult = async () => {
    const el = document.getElementById('result-card');
    if (!el) return;

    const canvas = await html2canvas(el, { backgroundColor: '#0a0a0f', scale: 2 });
    const link = document.createElement('a');
    link.download = 'ai-murder-mystery-result.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (loading || !script) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-12 h-12 rounded-full border-2 border-red-500/30 border-t-red-500 animate-spin mx-auto mb-4" />
          <p className="text-zinc-500 text-sm">Loading script...</p>
        </div>
      </main>
    );
  }

  const currentSceneData = script.scenes[currentScene];
  const sceneDialogues = dialogues.filter(d => d.scene === currentScene);
  const hasDialogues = sceneDialogues.length > 0;

  return (
    <>
      {/* Scene transition overlay */}
      {sceneTransition && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center animate-fade-in">
          <div className="text-center">
            <div className="w-8 h-[1px] bg-red-500/50 mx-auto mb-4" />
            <p className="text-zinc-500 text-xs uppercase tracking-[0.3em]">Next Scene</p>
            <div className="w-8 h-[1px] bg-red-500/50 mx-auto mt-4" />
          </div>
        </div>
      )}

      {/* Voting reveal overlay */}
      {gameEnded && !result && Object.keys(votes).length > 0 && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center animate-fade-in">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full border-2 border-red-500/30 border-t-red-500 animate-spin mx-auto mb-6" />
            <p className="text-zinc-400 text-sm">Revealing the truth...</p>
          </div>
        </div>
      )}

      <main className="min-h-screen p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="text-center mb-6 animate-fade-in-down">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-3xl">{script.cover}</span>
              <h1 className="text-xl md:text-2xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {script.title}
              </h1>
            </div>

            {!gameEnded && (
              <div className="flex flex-col items-center gap-2">
                <SceneProgressBar current={currentScene} total={script.scenes.length} />
                <p className="text-zinc-500 text-xs">
                  Scene {currentScene + 1}: <span className="text-zinc-400">{currentSceneData?.title}</span>
                </p>
              </div>
            )}

            {hasPlayerCharacter && aiCharacters.length > 0 && !gameEnded && (
              <div className="inline-flex items-center gap-1.5 mt-2 text-xs text-purple-400/80 bg-purple-500/10 rounded-full px-3 py-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                AI controls {aiCharacters.length} role{aiCharacters.length > 1 ? 's' : ''}
              </div>
            )}
          </header>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar: Player character info */}
            {hasPlayerCharacter && !gameEnded && (
              <aside className="lg:w-72 flex-shrink-0 space-y-4 animate-slide-in-left delay-200">
                {myCharacters.map(char => (
                  <div key={char.id} className="glass-card-strong p-4 lg:sticky lg:top-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-2xl">
                        {char.avatar}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{char.name}</p>
                        <p className="text-[10px] uppercase tracking-wider text-purple-400">Your Character</p>
                      </div>
                    </div>

                    <p className="text-zinc-500 text-xs leading-relaxed mb-4">{char.description}</p>

                    <button
                      onClick={() => setShowMyInfo(!showMyInfo)}
                      className="w-full text-left text-xs flex items-center gap-2 text-red-400/80 hover:text-red-400 transition-colors mb-2 group"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform duration-200 group-hover:scale-110">
                        {showMyInfo ? (
                          <><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>
                        ) : (
                          <><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>
                        )}
                      </svg>
                      {showMyInfo ? 'Hide' : 'View'} Secret Info
                    </button>

                    {showMyInfo && (
                      <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 text-xs text-zinc-300 leading-relaxed animate-scale-in">
                        {char.secretInfo}
                      </div>
                    )}
                  </div>
                ))}

                {/* AI character list */}
                {aiCharacters.length > 0 && (
                  <div className="glass-card p-3">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-600 font-medium mb-2">AI Roles</p>
                    <div className="space-y-1.5">
                      {aiCharacters.map(char => (
                        <div key={char.id} className="flex items-center gap-2 text-xs">
                          <span className="text-base">{char.avatar}</span>
                          <span className="text-zinc-400">{char.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </aside>
            )}

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {!gameEnded ? (
                <>
                  {/* Scene description */}
                  <div className="glass-card-strong p-5 mb-6 animate-fade-in-up delay-100">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.15em] text-zinc-500 font-medium mb-1.5">Scene Description</p>
                        <p className="text-zinc-300 text-sm leading-relaxed">{currentSceneData?.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Dialogue area */}
                  <div className="space-y-3 mb-6 max-h-[55vh] overflow-y-auto pr-1 scroll-smooth">
                    {sceneDialogues.map((dialogue, i) => {
                      const char = script.characters.find(c => c.id === dialogue.characterId);
                      const isMyChar = myCharacterIds.includes(char?.id || '');

                      return (
                        <DialogueBubble
                          key={dialogue.id || i}
                          dialogue={dialogue}
                          character={char}
                          isPlayer={isMyChar}
                          hasPlayerCharacter={hasPlayerCharacter}
                          index={i}
                        />
                      );
                    })}

                    {generating && <GeneratingIndicator />}
                    <div ref={dialogueEndRef} />
                  </div>

                  {/* Control buttons */}
                  <div className="flex gap-3 justify-center animate-fade-in-up delay-300">
                    {!hasDialogues ? (
                      <button
                        onClick={generateSceneDialogues}
                        disabled={generating}
                        className="btn-primary px-10 py-3.5 text-base disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        <span>{generating ? 'Generating...' : 'Begin This Scene'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={nextScene}
                        disabled={generating}
                        className="btn-primary px-10 py-3.5 text-base"
                      >
                        <span>
                          {currentScene < script.scenes.length - 1 ? (
                            <span className="inline-flex items-center gap-2">
                              Next Scene
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                            </span>
                          ) : (
                            'Cast Your Vote'
                          )}
                        </span>
                      </button>
                    )}
                  </div>
                </>
              ) : (
                /* Voting / Result */
                <div id="result-card" className="animate-scale-in">
                  {!result ? (
                    <div className="glass-card-strong p-8">
                      <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-4">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-red-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          Who is the Killer?
                        </h2>
                        <p className="text-zinc-500 text-sm">Choose wisely. There is only one chance.</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {script.characters.map((char) => (
                          <VoteCard key={char.id} character={char} onVote={handleVote} />
                        ))}
                      </div>

                      {/* Third-party option */}
                      <button
                        onClick={() => handleVote('other')}
                        className="w-full glass-card p-4 text-center hover:border-red-500/40 hover:bg-red-500/5 active:scale-[0.98] transition-all duration-300"
                      >
                        <div className="flex items-center justify-center gap-3">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-500"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                          <span className="text-white font-semibold text-sm">Someone Else</span>
                        </div>
                      </button>
                    </div>
                  ) : (
                    /* Result reveal */
                    <div className="glass-card-strong p-8 text-center">
                      {/* Result header */}
                      <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 ${
                        result.won
                          ? 'bg-emerald-500/10 border border-emerald-500/30'
                          : 'bg-red-500/10 border border-red-500/30 animate-pulse-glow'
                      }`}>
                        {result.won ? (
                          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        ) : (
                          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                        )}
                      </div>

                      <h2 className="text-3xl font-black text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {result.won ? 'Case Solved!' : 'Wrong Deduction!'}
                      </h2>
                      <p className="text-zinc-500 text-sm mb-8">
                        {result.won ? 'Your reasoning was flawless.' : 'The real killer slipped through your fingers.'}
                      </p>

                      {/* True murderer reveal */}
                      <div className="glass-card p-6 mb-6 inline-block">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-3">The Real Killer</p>
                        <div className="flex items-center justify-center gap-4">
                          <div className="avatar-ring is-murderer w-16 h-16 text-4xl">
                            {script.characters.find(c => c.id === result.murdererId)?.avatar || '?'}
                          </div>
                          <span className="text-2xl font-black text-red-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            {script.characters.find(c => c.id === result.murdererId)?.name || 'Unknown'}
                          </span>
                        </div>
                      </div>

                      <p className="text-zinc-500 text-sm leading-relaxed max-w-md mx-auto mb-8">
                        {script.characters.find(c => c.id === result.murdererId)?.secretInfo || 'The killer was someone else entirely!'}
                      </p>

                      {/* Action buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                          onClick={saveResult}
                          className="btn-secondary px-6 py-3"
                        >
                          <span className="relative z-10 inline-flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                            Save Result
                          </span>
                        </button>
                        <a
                          href="/"
                          className="btn-primary px-6 py-3"
                        >
                          <span className="inline-flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                            Play Again
                          </span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-12 h-12 rounded-full border-2 border-red-500/30 border-t-red-500 animate-spin mx-auto mb-4" />
          <p className="text-zinc-500 text-sm">Preparing the game...</p>
        </div>
      </main>
    }>
      <PlayContent />
    </Suspense>
  );
}
