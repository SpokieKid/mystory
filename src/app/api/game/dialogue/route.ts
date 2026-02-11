import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getScriptById } from '@/data/scripts';
import { generateDialogue } from '@/lib/secondme';
import { getRoom, getPlayerToken } from '@/lib/room-store';
import { Dialogue } from '@/lib/types';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { 
    scriptId, 
    sceneIndex, 
    previousDialogues, 
    roomId, 
    playerCharacterIds = [],  // 玩家扮演的角色
    aiCharacterIds = [],      // AI 扮演的角色
    // 兼容旧参数
    soloMode,
    myCharacterId 
  } = body;

  const script = getScriptById(scriptId);
  if (!script) {
    return NextResponse.json({ error: 'Script not found' }, { status: 404 });
  }

  const scene = script.scenes[sceneIndex];
  if (!scene) {
    return NextResponse.json({ error: 'Scene not found' }, { status: 404 });
  }

  const cookieStore = await cookies();
  const userToken = cookieStore.get('user_token')?.value || null;

  // 获取房间信息
  const room = roomId ? getRoom(roomId) : null;

  // 兼容旧的单人模式参数
  const effectivePlayerCharacterIds = playerCharacterIds.length > 0 
    ? playerCharacterIds 
    : (myCharacterId ? [myCharacterId] : []);

  const dialogues: Dialogue[] = [];

  // 为每个角色生成对话
  for (const character of script.characters) {
    const isPlayerCharacter = effectivePlayerCharacterIds.includes(character.id);
    const isAICharacter = aiCharacterIds.includes(character.id) || 
      (effectivePlayerCharacterIds.length > 0 && !isPlayerCharacter);

    let token: string | null = null;

    if (isPlayerCharacter) {
      // 玩家角色：使用玩家的 token
      token = room ? getPlayerToken(roomId, character.id) : null;
      if (!token) token = userToken;
    } else {
      // AI 角色：也使用玩家的 token（让 Second Me 扮演不同角色）
      token = userToken;
    }

    if (!token) {
      console.error(`No token available for character ${character.name}`);
      dialogues.push({
        id: `${scriptId}-${sceneIndex}-${character.id}-${Date.now()}`,
        odPlayerId: 'ai',
        characterId: character.id,
        content: `（${character.name}沉默不语...）`,
        timestamp: new Date().toISOString(),
        scene: sceneIndex,
      });
      continue;
    }

    try {
      // AI 角色添加额外提示
      let extraPrompt = '';
      if (isAICharacter) {
        extraPrompt = '\n\n【重要】你是 AI 扮演的角色，请积极推进剧情，表现出怀疑、质问或自我辩护。保持角色特点，让对话更加精彩。';
      }

      const content = await generateDialogue(
        token,
        character.name,
        character.description,
        character.secretInfo,
        scene.prompt + extraPrompt,
        previousDialogues
      );

      dialogues.push({
        id: `${scriptId}-${sceneIndex}-${character.id}-${Date.now()}`,
        odPlayerId: isPlayerCharacter ? 'player' : 'ai',
        characterId: character.id,
        content,
        timestamp: new Date().toISOString(),
        scene: sceneIndex,
      });

      // 更新 previousDialogues 供下一个角色参考
      previousDialogues.push(`${character.name}：${content}`);

      // 添加小延迟避免 API 限制
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      console.error(`Failed to generate dialogue for ${character.name}:`, err);
      
      dialogues.push({
        id: `${scriptId}-${sceneIndex}-${character.id}-${Date.now()}`,
        odPlayerId: 'ai',
        characterId: character.id,
        content: `（${character.name}似乎在思考着什么...）`,
        timestamp: new Date().toISOString(),
        scene: sceneIndex,
      });
    }
  }

  return NextResponse.json({ dialogues });
}
