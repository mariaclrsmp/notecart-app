import { NextResponse } from 'next/server';
import { getListPublic } from '@/lib/server/firebase/listsService';

export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const list = await getListPublic(id);

    if (!list) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    return NextResponse.json(list, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
