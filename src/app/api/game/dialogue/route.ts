import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getScriptById } from '@/data/scripts';
import { generateDialogueWithVoice } from '@/lib/secondme';
import { getRoom, getPlayerToken } from '@/lib/room-store';
import { Dialogue } from '@/lib/types';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { 
    scriptId, 
    sceneIndex, 
    previousDialogues, 
    roomId, 
    playerCharacterIds = [],
    aiCharacterIds = [],
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

  const room = roomId ? getRoom(roomId) : null;

  const effectivePlayerCharacterIds = playerCharacterIds.length > 0 
    ? playerCharacterIds 
    : (myCharacterId ? [myCharacterId] : []);

  const dialogues: Dialogue[] = [];

  for (const character of script.characters) {
    const isPlayerCharacter = effectivePlayerCharacterIds.includes(character.id);
    const isAICharacter = aiCharacterIds.includes(character.id) || 
      (effectivePlayerCharacterIds.length > 0 && !isPlayerCharacter);

    let token: string | null = null;

    if (isPlayerCharacter) {
      token = room ? getPlayerToken(roomId, character.id) : null;
      if (!token) token = userToken;
    } else {
      token = userToken;
    }

    if (!token) {
      console.error(`No token available for character ${character.name}`);
      dialogues.push({
        id: `${scriptId}-${sceneIndex}-${character.id}-${Date.now()}`,
        odPlayerId: 'ai',
        characterId: character.id,
        content: `（${character.name}沉默不语...）`,
        audioUrl: null,
        timestamp: new Date().toISOString(),
        scene: sceneIndex,
      });
      continue;
    }

    try {
      let extraPrompt = '';
      if (isAICharacter) {
        extraPrompt = '\n\n【重要】你是 AI 扮演的角色，请积极推进剧情，表现出怀疑、质问或自我辩护。保持角色特点，让对话更加精彩。';
      }

      // 生成文本 + 语音
      const { text, audioUrl } = await generateDialogueWithVoice(
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
        content: text,
        audioUrl,
        timestamp: new Date().toISOString(),
        scene: sceneIndex,
      });

      previousDialogues.push(`${character.name}：${text}`);

      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      console.error(`Failed to generate dialogue for ${character.name}:`, err);
      
      dialogues.push({
        id: `${scriptId}-${sceneIndex}-${character.id}-${Date.now()}`,
        odPlayerId: 'ai',
        characterId: character.id,
        content: `（${character.name}似乎在思考着什么...）`,
        audioUrl: null,
        timestamp: new Date().toISOString(),
        scene: sceneIndex,
      });
    }
  }

  return NextResponse.json({ dialogues });
}
