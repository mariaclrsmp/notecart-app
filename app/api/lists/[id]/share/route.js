import { NextResponse } from 'next/server';
import { shareList, unshareList, getSharedUserEmails } from '@/lib/server/firebase/listsService';
import { verifyAuth } from '@/lib/server/authMiddleware';
import { getDb } from '@/lib/server/firebase/admin';

export const runtime = 'nodejs';

export async function POST(request, { params }) {
  const userId = await verifyAuth(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const result = await shareList(id, email.trim().toLowerCase(), userId);

    if (!result) {
      return NextResponse.json({ error: 'List not found or unauthorized' }, { status: 404 });
    }

    if (result.error === 'USER_NOT_FOUND') {
      return NextResponse.json({ error: 'USER_NOT_FOUND' }, { status: 404 });
    }

    if (result.error === 'CANNOT_SHARE_WITH_SELF') {
      return NextResponse.json({ error: 'CANNOT_SHARE_WITH_SELF' }, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const userId = await verifyAuth(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { targetUserId } = await request.json();

    if (!targetUserId) {
      return NextResponse.json({ error: 'targetUserId is required' }, { status: 400 });
    }

    const result = await unshareList(id, targetUserId, userId);

    if (!result) {
      return NextResponse.json({ error: 'List not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function GET(request, { params }) {
  const userId = await verifyAuth(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const db = getDb();
    if (!db) return NextResponse.json({ error: 'DB error' }, { status: 500 });

    const doc = await db.collection('lists').doc(String(id)).get();
    if (!doc.exists || doc.data().userId !== userId) {
      return NextResponse.json({ error: 'List not found or unauthorized' }, { status: 404 });
    }

    const sharedWith = doc.data().sharedWith || [];
    const users = await getSharedUserEmails(sharedWith);

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
