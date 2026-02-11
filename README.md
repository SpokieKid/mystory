# 🔪 AI 剧本杀 - Second Me A2A Demo

> 让你的 AI 分身来一场推理对决！

**Live Demo:** https://mystory-lime.vercel.app

## 🎮 项目简介

AI 剧本杀是一款基于 **Second Me A2A (Agent-to-Agent)** 的互动推理游戏。玩家授权自己的 Second Me AI，让 AI 分身扮演剧本中的角色，进行一场沉浸式的推理对决。

### ✨ 核心特点

- **🤖 A2A 对话** - 每个玩家的 Second Me AI 扮演不同角色，AI 之间互相质问、辩护
- **🎭 多剧本支持** - 内置多个经典推理剧本，支持 2-4 人游戏
- **🔊 AI 语音** - 使用玩家自己的 Second Me 声音生成角色台词（开发中）
- **👤 灵活人数** - 玩家不足时，AI 自动接管剩余角色

## 🎬 游戏流程

```
1️⃣ 选择剧本 → 2️⃣ 创建房间 → 3️⃣ 邀请好友 / AI 补位 → 4️⃣ 选择角色
     ↓
5️⃣ 观看 AI 演绎 → 6️⃣ 分析线索 → 7️⃣ 投票指认凶手 → 8️⃣ 揭晓真相
```

## 🛠️ 技术栈

- **Frontend:** Next.js 16 + React 19 + Tailwind CSS
- **Backend:** Next.js API Routes
- **AI:** Second Me / Maitch OAuth2 + Chat API + Voice API
- **Deploy:** Vercel

## 🔑 Second Me 集成

### OAuth2 授权
```typescript
// 授权 scope
scope: 'user.info chat voice'

// 获取用户 AI 对话
POST /api/secondme/chat/stream
Authorization: Bearer {access_token}
Body: { message: "角色扮演 prompt" }
```

### A2A 对话机制
```
玩家A 的 Second Me ──┐
                      ├──→ 角色对话 ──→ 推理游戏
玩家B 的 Second Me ──┘
```

每个角色的台词由对应玩家的 Second Me AI 生成，保持了每个 AI 的独特人格和表达方式。

## 📂 项目结构

```
ai-murder-mystery/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/          # OAuth2 认证
│   │   │   └── game/          # 游戏逻辑 API
│   │   ├── play/              # 游戏界面
│   │   ├── waiting/           # 等待房间
│   │   └── join/              # 加入房间
│   ├── data/
│   │   └── scripts.ts         # 剧本数据
│   └── lib/
│       ├── secondme.ts        # Second Me API 封装
│       ├── room-store.ts      # 房间状态管理
│       └── types.ts           # 类型定义
```

## 🎭 内置剧本

| 剧本 | 人数 | 简介 |
|------|------|------|
| 👯 双生谜案 | 2人 | 双胞胎兄弟的复仇之夜 |
| 🏰 午夜庄园 | 3-4人 | 暴风雨夜的庄园谋杀 |
| 🏢 办公室惊魂 | 3-4人 | CEO 深夜被害案 |

## 🚀 本地开发

```bash
# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env.local
# 填入 Second Me OAuth 凭证

# 启动开发服务器
pnpm dev
```

### 环境变量
```env
SECONDME_CLIENT_ID=your_client_id
SECONDME_CLIENT_SECRET=your_client_secret
SECONDME_REDIRECT_URI=http://localhost:3000/api/auth/callback
```

## 🎯 Hackathon 亮点

1. **真正的 A2A** - 不是单一 AI，而是多个用户的 AI 分身互相对话
2. **角色扮演** - AI 根据角色设定和秘密信息生成个性化台词
3. **社交游戏** - 朋友间可以比拼谁的 AI 更会推理/狡辩
4. **可扩展** - 易于添加新剧本、新角色

## 👥 团队

Second Me A2A Hackathon 2026

---

**🔗 Links**
- Demo: https://mystory-lime.vercel.app
- GitHub: https://github.com/SpokieKid/mystory
