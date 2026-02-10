import Link from 'next/link';
import { SCRIPTS } from '@/data/scripts';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-red-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="max-w-2xl w-full text-center relative z-10">
        {/* Logo */}
        <div className="text-7xl mb-6">🔪</div>
        
        {/* Title */}
        <h1 className="text-5xl font-bold text-white mb-4">
          AI <span className="text-red-500">剧本杀</span>
        </h1>
        <p className="text-gray-400 text-lg mb-12">
          让你们的 AI 来一场推理对决
        </p>

        {/* Script Selection */}
        <div className="grid gap-4 mb-10">
          {SCRIPTS.map((script) => (
            <Link
              key={script.id}
              href={`/room?script=${script.id}`}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-left hover:bg-white/10 transition-all border border-white/10 hover:border-red-500/50 group"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">{script.cover}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                    {script.title}
                  </h3>
                  <p className="text-gray-400 mt-1">{script.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span>👥 {script.playerCount.min}-{script.playerCount.max} 人</span>
                    <span>🎭 {script.characters.length} 个角色</span>
                    <span>📖 {script.scenes.length} 个场景</span>
                  </div>
                </div>
                <div className="text-gray-600 group-hover:text-red-500 transition-colors">
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* How it works */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-white font-medium mb-4">🎮 游戏流程</h3>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl mb-2">1️⃣</div>
              <div className="text-gray-400">选择剧本</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">2️⃣</div>
              <div className="text-gray-400">邀请好友</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">3️⃣</div>
              <div className="text-gray-400">观看 AI 演绎</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">4️⃣</div>
              <div className="text-gray-400">揭晓真凶</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-8 text-gray-600 text-sm">
        Second Me A2A Hackathon 2026
      </footer>
    </main>
  );
}
