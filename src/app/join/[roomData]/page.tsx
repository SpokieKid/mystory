'use client';

import { useEffect, useState } from 'react';
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

export default function JoinPage() {
  const params = useParams();
  const roomData = params.roomData as string;
  
  const [room, setRoom] = useState<any>(null);
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
        <p className="text-gray-400 mb-2">{room.hostName} 邀请你加入</p>
        <p className="text-gray-500 text-sm mb-8">{script.description}</p>

        {/* 角色预览 */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/10">
          <h3 className="text-white font-medium mb-3">可选角色</h3>
          <div className="flex justify-center gap-2 flex-wrap">
            {script.characters.map((char) => (
              <div key={char.id} className="bg-white/5 rounded-xl p-3 text-center">
                <div className="text-3xl mb-1">{char.avatar}</div>
                <div className="text-white text-xs">{char.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 加入按钮 */}
        <button
          onClick={joinGame}
          className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-4 rounded-full text-lg hover:from-red-500 hover:to-red-400 transition-all"
        >
          🎭 加入游戏
        </button>

        <p className="text-gray-500 text-sm mt-4">
          授权后，你的 AI 将扮演一个角色
        </p>

        <a href="/" className="block mt-6 text-gray-500 hover:text-white">
          或者自己创建房间 →
        </a>
      </div>
    </main>
  );
}
