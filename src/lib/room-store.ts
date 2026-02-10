/**
 * 房间状态存储
 * 生产环境应该用 Redis/数据库
 */

export interface RoomPlayer {
  name: string;
  token: string;
  characterId?: string;
  ready: boolean;
}

export interface Room {
  id: string;
  scriptId: string;
  players: RoomPlayer[];
  status: 'waiting' | 'playing' | 'ended';
  createdAt: string;
}

// 内存存储
const rooms = new Map<string, Room>();

export function createRoom(roomId: string, scriptId: string, hostName: string, hostToken: string): Room {
  const room: Room = {
    id: roomId,
    scriptId,
    players: [{
      name: hostName,
      token: hostToken,
      ready: false,
    }],
    status: 'waiting',
    createdAt: new Date().toISOString(),
  };
  rooms.set(roomId, room);
  return room;
}

export function getRoom(roomId: string): Room | undefined {
  return rooms.get(roomId);
}

export function joinRoom(roomId: string, playerName: string, playerToken: string): Room | null {
  const room = rooms.get(roomId);
  if (!room) return null;
  
  // 检查是否已满（2人剧本）
  if (room.players.length >= 2) return null;
  
  // 检查是否已加入
  if (!room.players.find(p => p.name === playerName)) {
    room.players.push({
      name: playerName,
      token: playerToken,
      ready: false,
    });
  }
  
  return room;
}

export function selectCharacter(roomId: string, playerName: string, characterId: string): boolean {
  const room = rooms.get(roomId);
  if (!room) return false;
  
  const player = room.players.find(p => p.name === playerName);
  if (!player) return false;
  
  // 检查角色是否已被选
  if (room.players.some(p => p.characterId === characterId && p.name !== playerName)) {
    return false;
  }
  
  player.characterId = characterId;
  return true;
}

export function setPlayerReady(roomId: string, playerName: string, ready: boolean): boolean {
  const room = rooms.get(roomId);
  if (!room) return false;
  
  const player = room.players.find(p => p.name === playerName);
  if (!player) return false;
  
  player.ready = ready;
  return true;
}

export function startGame(roomId: string): boolean {
  const room = rooms.get(roomId);
  if (!room) return false;
  
  room.status = 'playing';
  return true;
}

export function getPlayerToken(roomId: string, characterId: string): string | null {
  const room = rooms.get(roomId);
  if (!room) return null;
  
  const player = room.players.find(p => p.characterId === characterId);
  return player?.token || null;
}

export function getRoomPublic(room: Room) {
  return {
    ...room,
    players: room.players.map(p => ({
      name: p.name,
      characterId: p.characterId,
      ready: p.ready,
    })),
  };
}
