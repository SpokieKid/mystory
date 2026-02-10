/**
 * 游戏逻辑
 */

import { GameRoom, Player, Script, Dialogue } from './types';
import { generateDialogue } from './secondme';
import { getScriptById } from '@/data/scripts';

// 编码房间数据到 URL
export function encodeRoom(room: Partial<GameRoom>, script: Script, hostName: string): string {
  const data = {
    id: room.id,
    scriptId: script.id,
    hostName,
    createdAt: room.createdAt,
  };
  return Buffer.from(JSON.stringify(data)).toString('base64url');
}

// 解码房间数据
export function decodeRoom(encoded: string): any | null {
  try {
    return JSON.parse(Buffer.from(encoded, 'base64url').toString('utf-8'));
  } catch {
    return null;
  }
}

// 分配角色给玩家
export function assignCharacters(players: Player[], script: Script): Player[] {
  const characters = [...script.characters];
  
  // 随机打乱角色
  for (let i = characters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [characters[i], characters[j]] = [characters[j], characters[i]];
  }
  
  // 分配给玩家
  return players.map((player, index) => ({
    ...player,
    characterId: characters[index % characters.length].id,
  }));
}

// 执行一个场景的对话
export async function runScene(
  room: GameRoom,
  sceneIndex: number
): Promise<Dialogue[]> {
  const script = getScriptById(room.scriptId);
  if (!script) throw new Error('Script not found');
  
  const scene = script.scenes[sceneIndex];
  if (!scene) throw new Error('Scene not found');
  
  const dialogues: Dialogue[] = [];
  const previousDialogues: string[] = [];
  
  // 每个玩家轮流发言
  for (const player of room.players) {
    if (!player.characterId) continue;
    
    const character = script.characters.find(c => c.id === player.characterId);
    if (!character) continue;
    
    try {
      const content = await generateDialogue(
        player.accessToken,
        character.name,
        character.description,
        character.secretInfo,
        scene.prompt,
        previousDialogues
      );
      
      const dialogue: Dialogue = {
        id: `${room.id}-${sceneIndex}-${player.odId}`,
        odPlayerId: player.odId,
        characterId: character.id,
        content,
        timestamp: new Date().toISOString(),
        scene: sceneIndex,
      };
      
      dialogues.push(dialogue);
      previousDialogues.push(`${character.name}：${content}`);
    } catch (err) {
      console.error(`Failed to generate dialogue for ${player.userName}:`, err);
    }
  }
  
  return dialogues;
}

// 统计投票结果
export function countVotes(room: GameRoom): { characterId: string; votes: number }[] {
  const voteCounts: Record<string, number> = {};
  
  for (const vote of room.votes) {
    voteCounts[vote.suspectCharacterId] = (voteCounts[vote.suspectCharacterId] || 0) + 1;
  }
  
  return Object.entries(voteCounts)
    .map(([characterId, votes]) => ({ characterId, votes }))
    .sort((a, b) => b.votes - a.votes);
}

// 检查是否找到了真凶
export function checkWin(room: GameRoom, script: Script): { won: boolean; murdererId: string } {
  const voteResults = countVotes(room);
  const murderer = script.characters.find(c => c.isMurderer);
  
  if (!murderer || voteResults.length === 0) {
    return { won: false, murdererId: murderer?.id || '' };
  }
  
  const topVoted = voteResults[0].characterId;
  return {
    won: topVoted === murderer.id,
    murdererId: murderer.id,
  };
}
