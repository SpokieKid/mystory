'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { SCRIPTS } from '@/data/scripts';
import { Script, Character } from '@/lib/types';

function decodeRoom(encoded: string): any | null {
  try {
    return JSON.parse(atob(encoded.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

export default function WaitingPage() {
  const params = useParams();
  const roomData = params.roomData as string;
  
  const [room, setRoom] = useState<any>(null);
  const [script, setScript] = useState<Script | null>(null);
  const [copied, setCopied] = useState(false);
  const [players, setPlayers] = useState<Array<{ name: string; characterId?: string; ready: boolean }>>([]);
  const [polling, setPolling] = useState(true);
  
  // 角色分配状态
  const [showCharacterSelect, setShowCharacterSelect] = useState(false);
  const [selectedCharacters, setSelectedCharacters] = useState<Record<string, string>>({}); // odPlayerId -> characterId
  const [mySelectedCharacter, setMySelectedCharacter] = useState<string | null>(null);
  
  const inviteLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/join/${roomData}`
    : '';

  // 轮询房间状态
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
      
      pollRoom(decoded.id);
      const interval = setInterval(() => {
        if (polling) pollRoom(decoded.id);
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [roomData, polling, pollRoom]);

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 计算未被选择的角色（给 AI）
  const getAICharacters = () => {
    if (!script) return [];
    const selectedIds = Object.values(selectedCharacters);
    if (mySelectedCharacter) selectedIds.push(mySelectedCharacter);
    return script.characters.filter(c => !selectedIds.includes(c.id));
  };

  const startGame = () => {
    // 构建角色分配信息
    const aiCharacterIds = getAICharacters().map(c => c.id);
    const playerCharacterIds = mySelectedCharacter ? [mySelectedCharacter] : [];
    
    // 跳转到游戏页面，带上角色分配信息
    const params = new URLSearchParams();
    if (playerCharacterIds.length > 0) {
      params.set('playerCharacters', playerCharacterIds.join(','));
    }
    if (aiCharacterIds.length > 0) {
      params.set('aiCharacters', aiCharacterIds.join(','));
    }
    
    window.location.href = `/play/${roomData}?${params.toString()}`;
  };

  const canStart = mySelectedCharacter !== null;

  if (!script) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">加载中...</div>
      </main>
    );
  }

  const aiCharacters = getAICharacters();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute top-20 left-20 w-72 h-72 bg-red-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="max-w-lg w-full text-center relative z-10">
        <div className="text-6xl mb-4">{script.cover}</div>
        
        <h1 className="text-3xl font-bold text-white mb-2">
          {script.title}
        </h1>
        <p className="text-gray-400 mb-6">
          {showCharacterSelect ? '选择你要扮演的角色' : '房间已创建'}
        </p>

        {!showCharacterSelect ? (
          <>
            {/* 玩家列表 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/10">
              <h3 className="text-white font-medium mb-3">已加入的玩家</h3>
              <div className="space-y-2 mb-4">
                {players.map((player, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{i === 0 ? '👑' : '🎮'}</span>
                      <span className="text-white">{player.name}</span>
                    </div>
                    {player.ready && <span className="text-green-400 text-sm">✓ 已准备</span>}
                  </div>
                ))}
              </div>
              
              <p className="text-gray-500 text-sm">
                剧本需要 {script.playerCount.min}-{script.playerCount.max} 名角色
                {players.length < script.characters.length && (
                  <span className="text-yellow-500 ml-1">
                    （不足的角色由 AI 扮演）
                  </span>
                )}
              </p>
            </div>

            {/* 邀请链接 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
              <p className="text-white/60 text-sm mb-3">邀请链接</p>
              <div className="bg-black/30 rounded-xl p-3 mb-4 break-all text-xs text-red-400 max-h-20 overflow-auto">
                {inviteLink}
              </div>
              
              <button
                onClick={copyLink}
                className="w-full bg-white/10 text-white font-bold py-3 rounded-full hover:bg-white/20 transition-all mb-3"
              >
                {copied ? '✅ 已复制' : '📋 复制邀请链接'}
              </button>

              <button
                onClick={() => setShowCharacterSelect(true)}
                className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-3 rounded-full hover:from-red-500 hover:to-red-400 transition-all"
              >
                🎭 选择角色并开始
              </button>
            </div>
          </>
        ) : (
          <>
            {/* 角色选择 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/10">
              <h3 className="text-white font-medium mb-4">选择你的角色</h3>
              <div className="space-y-3">
                {script.characters.map((char) => {
                  const isSelected = mySelectedCharacter === char.id;
                  const isTakenByOther = Object.values(selectedCharacters).includes(char.id);
                  
                  return (
                    <button
                      key={char.id}
                      onClick={() => !isTakenByOther && setMySelectedCharacter(char.id)}
                      disabled={isTakenByOther}
                      className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                        isSelected
                          ? 'bg-red-500/30 border-red-500'
                          : isTakenByOther
                            ? 'bg-gray-500/20 border-gray-600 opacity-50 cursor-not-allowed'
                            : 'bg-white/5 border-transparent hover:border-red-500/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{char.avatar}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-white font-medium">{char.name}</span>
                            {isSelected && (
                              <span className="text-xs bg-red-500 px-2 py-1 rounded text-white">你的角色</span>
                            )}
                            {isTakenByOther && (
                              <span className="text-xs bg-gray-600 px-2 py-1 rounded text-white">其他玩家</span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm mt-1">{char.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI 角色预览 */}
            {mySelectedCharacter && aiCharacters.length > 0 && (
              <div className="bg-purple-500/10 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-purple-500/30">
                <h3 className="text-purple-300 font-medium mb-3">🤖 AI 将扮演</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {aiCharacters.map(char => (
                    <div key={char.id} className="bg-white/5 rounded-lg px-3 py-2 flex items-center gap-2">
                      <span className="text-xl">{char.avatar}</span>
                      <span className="text-white text-sm">{char.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={startGame}
              disabled={!canStart}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-4 rounded-full hover:from-red-500 hover:to-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              🎬 开始游戏
            </button>

            <button
              onClick={() => {
                setShowCharacterSelect(false);
                setMySelectedCharacter(null);
              }}
              className="text-gray-500 hover:text-white transition-colors"
            >
              ← 返回
            </button>
          </>
        )}

        <a href="/" className="block mt-6 text-gray-500 hover:text-white">
          ← 返回首页
        </a>
      </div>
    </main>
  );
}
