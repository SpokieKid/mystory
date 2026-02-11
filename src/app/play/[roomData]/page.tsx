'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { SCRIPTS } from '@/data/scripts';
import { Script, Character, Dialogue } from '@/lib/types';
import html2canvas from 'html2canvas';

function decodeRoom(encoded: string): any | null {
  try {
    return JSON.parse(atob(encoded.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

function PlayContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomData = params.roomData as string;
  
  // 单人模式参数
  const isSoloMode = searchParams.get('solo') === 'true';
  const myCharacterId = searchParams.get('myCharacter');
  
  const [script, setScript] = useState<Script | null>(null);
  const [currentScene, setCurrentScene] = useState(0);
  const [dialogues, setDialogues] = useState<Dialogue[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ won: boolean; murdererId: string } | null>(null);
  const [showMyInfo, setShowMyInfo] = useState(false);

  const myCharacter = script?.characters.find(c => c.id === myCharacterId);
  const aiCharacter = script?.characters.find(c => c.id !== myCharacterId);

  useEffect(() => {
    const decoded = decodeRoom(roomData);
    if (decoded) {
      const s = SCRIPTS.find(s => s.id === decoded.scriptId);
      setScript(s || null);
    }
    setLoading(false);
  }, [roomData]);

  // 生成当前场景的对话
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
          soloMode: isSoloMode,
          myCharacterId: myCharacterId,
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

  // 进入下一场景
  const nextScene = () => {
    if (!script) return;
    
    if (currentScene < script.scenes.length - 1) {
      setCurrentScene(prev => prev + 1);
    } else {
      setGameEnded(true);
    }
  };

  // 投票
  const handleVote = (characterId: string) => {
    if (!script) return;
    
    const newVotes: Record<string, string> = {};
    script.characters.forEach(char => {
      newVotes[char.id] = characterId;
    });
    setVotes(newVotes);

    const murderer = script.characters.find(c => c.isMurderer);
    setResult({
      won: characterId === murderer?.id,
      murdererId: murderer?.id || '',
    });
  };

  // 保存结果图片
  const saveResult = async () => {
    const el = document.getElementById('result-card');
    if (!el) return;
    
    const canvas = await html2canvas(el, { backgroundColor: null, scale: 2 });
    const link = document.createElement('a');
    link.download = 'ai-murder-mystery-result.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (loading || !script) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">🔪 加载剧本中...</div>
      </main>
    );
  }

  const currentSceneData = script.scenes[currentScene];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-4xl">{script.cover}</span>
            <h1 className="text-2xl font-bold text-white">{script.title}</h1>
            {isSoloMode && (
              <span className="text-xs bg-purple-500 px-2 py-1 rounded-full">单人模式</span>
            )}
          </div>
          {!gameEnded && (
            <p className="text-gray-400">
              场景 {currentScene + 1}/{script.scenes.length}：{currentSceneData?.title}
            </p>
          )}
        </div>

        <div className="flex gap-6">
          {/* 左侧：角色信息（单人模式） */}
          {isSoloMode && myCharacter && !gameEnded && (
            <div className="w-80 flex-shrink-0">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 sticky top-4">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{myCharacter.avatar}</span>
                  <div>
                    <p className="text-white font-medium">{myCharacter.name}</p>
                    <p className="text-xs text-purple-400">你的角色</p>
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mb-4">{myCharacter.description}</p>
                
                <button
                  onClick={() => setShowMyInfo(!showMyInfo)}
                  className="w-full text-left text-sm text-red-400 hover:text-red-300 mb-2"
                >
                  🔒 {showMyInfo ? '隐藏' : '查看'}秘密信息
                </button>
                
                {showMyInfo && (
                  <div className="bg-red-500/10 rounded-lg p-3 text-sm text-gray-300 border border-red-500/30">
                    {myCharacter.secretInfo}
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <span>🤖</span>
                    <span>AI 扮演：{aiCharacter?.name}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 主内容区 */}
          <div className="flex-1">
            {!gameEnded ? (
              <>
                {/* 场景描述 */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/10">
                  <p className="text-gray-300">{currentSceneData?.description}</p>
                </div>

                {/* 对话区域 */}
                <div className="space-y-4 mb-6 max-h-[50vh] overflow-y-auto">
                  {dialogues
                    .filter(d => d.scene === currentScene)
                    .map((dialogue, i) => {
                      const char = script.characters.find(c => c.id === dialogue.characterId);
                      const isMyCharacter = char?.id === myCharacterId;
                      
                      return (
                        <div 
                          key={i} 
                          className={`bg-white/5 backdrop-blur-sm rounded-xl p-4 border ${
                            isMyCharacter ? 'border-purple-500/50' : 'border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{char?.avatar}</span>
                            <span className="text-white font-medium">{char?.name}</span>
                            {isMyCharacter && (
                              <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded">你</span>
                            )}
                            {!isMyCharacter && isSoloMode && (
                              <span className="text-xs bg-gray-500/30 text-gray-400 px-2 py-0.5 rounded">AI</span>
                            )}
                          </div>
                          <p className="text-gray-300 pl-10">{dialogue.content}</p>
                        </div>
                      );
                    })}
                  
                  {generating && (
                    <div className="text-center text-gray-400 py-4 animate-pulse">
                      🎭 AI 正在发言...
                    </div>
                  )}
                </div>

                {/* 控制按钮 */}
                <div className="flex gap-4 justify-center">
                  {dialogues.filter(d => d.scene === currentScene).length === 0 ? (
                    <button
                      onClick={generateSceneDialogues}
                      disabled={generating}
                      className="bg-gradient-to-r from-red-600 to-red-500 text-white font-bold px-8 py-3 rounded-full hover:from-red-500 hover:to-red-400 transition-all disabled:opacity-50"
                    >
                      {generating ? '生成中...' : '🎬 开始这一幕'}
                    </button>
                  ) : (
                    <button
                      onClick={nextScene}
                      className="bg-gradient-to-r from-red-600 to-red-500 text-white font-bold px-8 py-3 rounded-full hover:from-red-500 hover:to-red-400 transition-all"
                    >
                      {currentScene < script.scenes.length - 1 ? '下一幕 →' : '🗳️ 进入投票'}
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* 投票/结果 */
              <div id="result-card" className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                {!result ? (
                  <>
                    <h2 className="text-xl font-bold text-white text-center mb-6">
                      🗳️ 谁是凶手？
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      {script.characters.map((char) => (
                        <button
                          key={char.id}
                          onClick={() => handleVote(char.id)}
                          className="bg-white/10 hover:bg-red-500/30 rounded-xl p-4 text-center transition-all border border-transparent hover:border-red-500"
                        >
                          <div className="text-4xl mb-2">{char.avatar}</div>
                          <div className="text-white font-medium">{char.name}</div>
                        </button>
                      ))}
                      {/* 第三方选项 */}
                      <button
                        onClick={() => handleVote('other')}
                        className="bg-white/10 hover:bg-red-500/30 rounded-xl p-4 text-center transition-all border border-transparent hover:border-red-500 col-span-2"
                      >
                        <div className="text-4xl mb-2">👤</div>
                        <div className="text-white font-medium">另有其人</div>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">
                      {result.won ? '🎉 找到真凶！' : '😈 推理失败！'}
                    </h2>
                    
                    <div className="bg-white/10 rounded-xl p-6 mb-6">
                      <p className="text-gray-400 mb-2">真正的凶手是</p>
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-5xl">
                          {script.characters.find(c => c.id === result.murdererId)?.avatar || '👤'}
                        </span>
                        <span className="text-2xl font-bold text-red-500">
                          {script.characters.find(c => c.id === result.murdererId)?.name || '第三方'}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-6">
                      {script.characters.find(c => c.id === result.murdererId)?.secretInfo || '凶手另有其人，不在嫌疑人之列！'}
                    </p>

                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={saveResult}
                        className="bg-white text-gray-900 font-bold px-6 py-3 rounded-full hover:bg-gray-100 transition-all"
                      >
                        📥 保存结果
                      </button>
                      <a
                        href="/"
                        className="bg-white/10 text-white font-bold px-6 py-3 rounded-full hover:bg-white/20 transition-all"
                      >
                        🏠 返回首页
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
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">🔪 加载中...</div>
      </main>
    }>
      <PlayContent />
    </Suspense>
  );
}
