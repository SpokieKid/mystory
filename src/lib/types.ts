/**
 * AI 剧本杀 类型定义
 */

// 角色定义
export interface Character {
  id: string;
  name: string;
  avatar: string;  // emoji
  description: string;
  secretInfo: string;  // 只有这个角色知道的信息
  isMurderer: boolean;
}

// 剧本定义
export interface Script {
  id: string;
  title: string;
  cover: string;  // emoji
  description: string;
  playerCount: { min: number; max: number };
  characters: Character[];
  scenes: Scene[];
  background: string;  // 故事背景
}

// 场景/回合
export interface Scene {
  id: string;
  title: string;
  description: string;
  prompt: string;  // 给 AI 的提示
}

// 玩家
export interface Player {
  odId: string;
  odName: string;
  userName: string;
  userAvatar?: string;
  accessToken: string;
  characterId?: string;
  isHost: boolean;
  joinedAt: string;
}

// 游戏房间
export interface GameRoom {
  id: string;
  scriptId: string;
  hostId: string;
  players: Player[];
  status: 'waiting' | 'playing' | 'voting' | 'ended';
  currentScene: number;
  dialogues: Dialogue[];
  votes: Vote[];
  createdAt: string;
}

// 对话
export interface Dialogue {
  id: string;
  odPlayerId: string;
  characterId: string;
  content: string;
  audioUrl?: string | null;  // 语音 URL
  timestamp: string;
  scene: number;
}

// 投票
export interface Vote {
  odVoterId: string;
  suspectCharacterId: string;
}

// 编码后的房间数据（用于 URL 传递）
export interface EncodedRoom {
  id: string;
  scriptId: string;
  hostName: string;
  players: { name: string; odCharacterId?: string }[];
}
