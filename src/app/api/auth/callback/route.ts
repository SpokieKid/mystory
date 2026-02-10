import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens, getUserInfo } from '@/lib/secondme';
import { encodeRoom } from '@/lib/game';
import { getScriptById } from '@/data/scripts';
import { createRoom, joinRoom } from '@/lib/room-store';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(error)}`, request.url));
  }

  const cookieStore = await cookies();
  const savedState = cookieStore.get('oauth_state')?.value;
  const contextStr = cookieStore.get('game_context')?.value;
  
  if (!state || state !== savedState) {
    return NextResponse.redirect(new URL('/?error=invalid_state', request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?error=missing_code', request.url));
  }

  const context = contextStr ? JSON.parse(contextStr) : {};

  try {
    const tokens = await exchangeCodeForTokens(code);
    const user = await getUserInfo(tokens.accessToken);

    cookieStore.delete('oauth_state');
    cookieStore.delete('game_context');

    // 保存用户 token
    cookieStore.set('user_token', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 2,
      sameSite: 'lax',
    });

    cookieStore.set('user_info', JSON.stringify({ name: user.name, avatar: user.avatar }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 2,
      sameSite: 'lax',
    });

    if (context.role === 'host') {
      // 房主：创建房间，跳转到等待页面
      const script = getScriptById(context.scriptId);
      if (!script) {
        return NextResponse.redirect(new URL('/?error=invalid_script', request.url));
      }

      // 在 room-store 中创建房间
      createRoom(context.roomId, script.id, user.name, tokens.accessToken);

      const roomData = encodeRoom(
        { id: context.roomId, scriptId: script.id, createdAt: new Date().toISOString() },
        script,
        user.name
      );

      // 保存房间信息
      cookieStore.set('host_room', JSON.stringify({
        id: context.roomId,
        scriptId: script.id,
        hostName: user.name,
        hostToken: tokens.accessToken,
      }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60,
        sameSite: 'lax',
      });

      return NextResponse.redirect(new URL(`/waiting/${roomData}`, request.url));
    } else {
      // 玩家：加入房间
      // 解码 roomData 获取 roomId
      let roomId = '';
      try {
        const decoded = JSON.parse(atob(context.roomData.replace(/-/g, '+').replace(/_/g, '/')));
        roomId = decoded.id;
        // 在 room-store 中加入房间
        joinRoom(roomId, user.name, tokens.accessToken);
      } catch (e) {
        console.error('Failed to decode room data:', e);
      }

      cookieStore.set('player_token', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60,
        sameSite: 'lax',
      });

      cookieStore.set('player_info', JSON.stringify({ name: user.name }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60,
        sameSite: 'lax',
      });

      cookieStore.set('room_data', context.roomData, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60,
        sameSite: 'lax',
      });

      return NextResponse.redirect(new URL(`/play/${context.roomData}`, request.url));
    }
  } catch (err) {
    console.error('OAuth callback error:', err);
    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(String(err))}`, request.url));
  }
}
