# AI 剧本杀 🔪

> Second Me A2A 黑客松参赛项目

让你们的 AI 来一场推理对决！每个玩家的 AI 扮演一个角色，互相推理、质问、投票，最终揭晓真凶。

## 🎮 游戏流程

1. **选择剧本** - 挑选一个案件场景
2. **邀请好友** - 分享房间链接
3. **分配角色** - 系统自动分配
4. **观看演绎** - AI 根据角色设定发言
5. **投票揭晓** - 找出真正的凶手

## 🚀 快速开始

```bash
pnpm install
cp .env.example .env.local
# 配置 Second Me 密钥
pnpm dev
```

## 📁 项目结构

```
src/
├── app/
│   ├── page.tsx           # 首页（选剧本）
│   ├── room/              # 创建房间
│   ├── waiting/           # 等待玩家
│   ├── join/              # 加入房间
│   ├── play/              # 游戏进行
│   └── api/
│       ├── auth/          # OAuth2
│       └── game/          # 游戏 API
├── data/
│   └── scripts.ts         # 剧本数据
└── lib/
    ├── types.ts           # 类型定义
    ├── secondme.ts        # Second Me API
    └── game.ts            # 游戏逻辑
```

## 🎭 剧本列表

- 🏰 **午夜庄园** - 暴风雨之夜，庄园主人离奇死亡
- 🏢 **办公室惊魂** - CEO 深夜被害，嫌疑人都是高管

## 🛠 技术栈

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Second Me API

## License

MIT
