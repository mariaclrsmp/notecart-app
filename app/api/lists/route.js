import { NextResponse } from 'next/server';
import { getLists, addList } from '@/lib/server/stores/listsStore';

export async function GET() {
  const lists = await getLists();
  return NextResponse.json(lists, { status: 200 });
}

export async function POST(request) {
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
    
    await addList(newList);
    return NextResponse.json(newList, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
