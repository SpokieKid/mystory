import { NextRequest, NextResponse } from 'next/server';
import { getAuthorizationUrl } from '@/lib/secondme';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const scriptId = searchParams.get('scriptId') || '';
  const roomId = searchParams.get('roomId') || '';
  const role = searchParams.get('role') || 'player';
  const roomData = searchParams.get('roomData') || '';

  const state = crypto.randomUUID();
  
  const cookieStore = await cookies();
  
  cookieStore.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 10,
    sameSite: 'lax',
  });
  
  cookieStore.set('game_context', JSON.stringify({ scriptId, roomId, role, roomData }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 10,
    sameSite: 'lax',
  });

  const authUrl = getAuthorizationUrl(state);
  return NextResponse.redirect(authUrl);
}
