import { NextResponse } from 'next/server';
import { getAllLists, createList } from '@/lib/server/firebase/listsService';
import { verifyAuth } from '@/lib/server/authMiddleware';

export async function GET(request) {
  const userId = await verifyAuth(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const lists = await getAllLists(userId);
  return NextResponse.json(lists, { status: 200 });
}

export async function POST(request) {
  const userId = await verifyAuth(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, type, items } = await request.json();

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      );
    }

    const newList = {
      id: Date.now(),
      name,
      type,
      createdAt: new Date().toISOString(),
      items: items || []
    };

    const savedList = await createList(newList, userId);
    return NextResponse.json(savedList, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
