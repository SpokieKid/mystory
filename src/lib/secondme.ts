/**
 * SecondMe OAuth2 & API 封装
 */

const SECONDME_BASE_URL = 'https://app.mindos.com/gate/lab';
const SECONDME_AUTH_URL = 'https://go.second.me/oauth/';
const SECONDME_TOKEN_URL = 'https://app.mindos.com/gate/lab/api/oauth/token/code';

export interface SecondMeUser {
  id?: string;
  name: string;
  bio?: string;
  avatar?: string;
}

export interface SecondMeTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: string;
}

export function getAuthorizationUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.SECONDME_CLIENT_ID!,
    redirect_uri: process.env.SECONDME_REDIRECT_URI!,
    response_type: 'code',
    scope: 'user.info user.info.shades user.info.softmemory chat voice',
    state,
  });
  return `${SECONDME_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForTokens(code: string): Promise<SecondMeTokens> {
  const response = await fetch(SECONDME_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.SECONDME_CLIENT_ID!,
      client_secret: process.env.SECONDME_CLIENT_SECRET!,
      redirect_uri: process.env.SECONDME_REDIRECT_URI!,
      grant_type: 'authorization_code',
      code,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Token exchange failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  if (data.code !== 0) throw new Error(`Token exchange failed: ${data.message}`);
  return data.data;
}

export async function getUserInfo(accessToken: string): Promise<SecondMeUser> {
  const response = await fetch(`${SECONDME_BASE_URL}/api/secondme/user/info`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) throw new Error(`Failed to fetch user: ${response.statusText}`);

  const data = await response.json();
  if (data.code !== 0) throw new Error(`Failed to fetch user: ${data.message}`);
  return data.data;
}

/**
 * 让用户的 AI 以特定角色发言
 */
export async function generateDialogue(
  accessToken: string,
  characterName: string,
  characterDescription: string,
  secretInfo: string,
  scenePrompt: string,
  previousDialogues: string[]
): Promise<string> {
  const prompt = `你现在在玩剧本杀游戏，你扮演的角色是「${characterName}」。

【角色设定】
${characterDescription}

【你知道的秘密】
${secretInfo}

【当前场景】
${scenePrompt}

【之前的对话】
${previousDialogues.length > 0 ? previousDialogues.join('\n') : '（这是第一轮发言）'}

【要求】
1. 完全进入角色，用第一人称发言
2. 根据你的性格特点和秘密信息来表达
3. 发言控制在50-100字
4. 可以表达情绪、提出质疑或为自己辩护
5. 不要暴露你是不是凶手

请直接输出你的发言内容，不要加任何前缀。`;

  const response = await fetch(`${SECONDME_BASE_URL}/api/secondme/chat/stream`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: prompt }),
  });

  if (!response.ok) throw new Error(`Chat failed: ${response.statusText}`);

  const text = await response.text();
  let content = '';
  
  for (const line of text.split('\n')) {
    if (line.startsWith('data: ') && !line.includes('[DONE]')) {
      try {
        const data = JSON.parse(line.slice(6));
        if (data.choices?.[0]?.delta?.content) {
          content += data.choices[0].delta.content;
        }
      } catch {}
    }
  }

  return content.trim();
}

/**
 * 生成语音 - 使用用户的 Second Me 声音
 */
export async function generateVoice(
  accessToken: string,
  text: string
): Promise<string | null> {
  try {
    const response = await fetch(`${SECONDME_BASE_URL}/api/secondme/voice`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      console.error('Voice generation failed:', response.status);
      return null;
    }

    const data = await response.json();
    if (data.code !== 0) {
      console.error('Voice generation error:', data.message);
      return null;
    }

    // 返回音频 URL
    return data.data?.url || data.data?.audioUrl || null;
  } catch (err) {
    console.error('Voice generation error:', err);
    return null;
  }
}

/**
 * 生成对话 + 语音
 */
export async function generateDialogueWithVoice(
  accessToken: string,
  characterName: string,
  characterDescription: string,
  secretInfo: string,
  scenePrompt: string,
  previousDialogues: string[]
): Promise<{ text: string; audioUrl: string | null }> {
  // 先生成文本
  const text = await generateDialogue(
    accessToken,
    characterName,
    characterDescription,
    secretInfo,
    scenePrompt,
    previousDialogues
  );

  // 再生成语音
  const audioUrl = await generateVoice(accessToken, text);

  return { text, audioUrl };
}
