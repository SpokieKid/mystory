import { NextRequest, NextResponse } from 'next/server';
import { 
  createRoom, 
  getRoom, 
  joinRoom, 
  selectCharacter, 
  setPlayerReady, 
  startGame,
  getRoomPublic 
} from '@/lib/room-store';

// 创建房间
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { roomId, scriptId, playerName, playerToken } = body;

  const room = createRoom(roomId, scriptId, playerName, playerToken);

  return NextResponse.json({ 
    success: true, 
    room: getRoomPublic(room)
  });
}

// 获取房间信息
export async function GET(request: NextRequest) {
  const roomId = request.nextUrl.searchParams.get('roomId');
  
  if (!roomId) {
    return NextResponse.json({ error: 'Missing roomId' }, { status: 400 });
  }

  const room = getRoom(roomId);
  
  if (!room) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }

  return NextResponse.json({ room: getRoomPublic(room) });
}

// 加入房间 / 更新玩家状态
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { roomId, action, playerName, playerToken, characterId, ready } = body;

  let room = getRoom(roomId);
  if (!room) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }

  let success = false;

  switch (action) {
    case 'join':
      const joined = joinRoom(roomId, playerName, playerToken);
      success = !!joined;
      room = joined || room;
      break;
      
    case 'select-character':
      success = selectCharacter(roomId, playerName, characterId);
      room = getRoom(roomId) || room;
      break;
      
    case 'ready':
      success = setPlayerReady(roomId, playerName, ready);
      room = getRoom(roomId) || room;
      break;
      
    case 'start':
      success = startGame(roomId);
      room = getRoom(roomId) || room;
      break;
      
    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }

  if (!success) {
    return NextResponse.json({ error: 'Action failed' }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    room: getRoomPublic(room),
  });
}
