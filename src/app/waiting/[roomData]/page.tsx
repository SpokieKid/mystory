'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { SCRIPTS } from '@/data/scripts';
import { Script } from '@/lib/types';

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
      
      // 开始轮询
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

  const startGame = () => {
    // 开始游戏 - 跳转到演绎页面
    window.location.href = `/play/${roomData}`;
  };

  if (!script) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">加载中...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute top-20 left-20 w-72 h-72 bg-red-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="max-w-md w-full text-center relative z-10">
        <div className="text-6xl mb-4">{script.cover}</div>
        
        <h1 className="text-3xl font-bold text-white mb-2">
          {script.title}
        </h1>
        <p className="text-gray-400 mb-8">房间已创建，邀请好友加入</p>

        {/* 角色列表 */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/10">
          <h3 className="text-white font-medium mb-3">角色列表</h3>
          <div className="grid grid-cols-2 gap-2">
            {script.characters.map((char) => (
              <div key={char.id} className="bg-white/5 rounded-xl p-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{char.avatar}</span>
                  <span className="text-white text-sm">{char.name}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-xs mt-3">
            需要 {script.playerCount.min}-{script.playerCount.max} 名玩家
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
            className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-3 rounded-full hover:from-red-500 hover:to-red-400 transition-all mb-3"
          >
            {copied ? '✅ 已复制' : '📋 复制邀请链接'}
          </button>

          <button
            onClick={startGame}
            className="w-full bg-white/10 text-white font-bold py-3 rounded-full hover:bg-white/20 transition-all"
          >
            🎬 直接开始（AI 自动分配角色）
          </button>
        </div>

        <p className="text-gray-500 text-sm">
          好友加入后会自动分配角色，也可以直接开始让 AI 演绎
        </p>

        <a href="/" className="block mt-6 text-gray-500 hover:text-white">
          ← 返回首页
        </a>
      </div>
    </main>
  );
}
