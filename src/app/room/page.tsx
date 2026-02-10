'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SCRIPTS } from '@/data/scripts';
import { Script } from '@/lib/types';

function RoomContent() {
  const searchParams = useSearchParams();
  const scriptId = searchParams.get('script');
  const roomData = searchParams.get('room');
  
  const [script, setScript] = useState<Script | null>(null);
  const [roomId, setRoomId] = useState<string>('');
  const [inviteLink, setInviteLink] = useState<string>('');
  const [players, setPlayers] = useState<{ name: string; ready: boolean }[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (scriptId) {
      const s = SCRIPTS.find(s => s.id === scriptId);
      setScript(s || null);
      
      // 生成房间ID
      const newRoomId = Math.random().toString(36).slice(2, 10);
      setRoomId(newRoomId);
    }
  }, [scriptId]);

  useEffect(() => {
    if (script && roomId) {
      // 跳转到授权
      window.location.href = `/api/auth/login?scriptId=${script.id}&roomId=${roomId}&role=host`;
    }
  }, [script, roomId]);

  if (!script) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">加载剧本中...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 flex items-center justify-center p-8">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-pulse">{script.cover}</div>
        <div className="text-white text-xl">正在创建房间...</div>
        <p className="text-gray-400 mt-2">即将跳转到授权页面</p>
      </div>
    </main>
  );
}

export default function RoomPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">加载中...</div>
      </main>
    }>
      <RoomContent />
    </Suspense>
  );
}
