import { NextResponse } from 'next/server';
import { getSharedLists } from '@/lib/server/firebase/listsService';
import { verifyAuth } from '@/lib/server/authMiddleware';
import admin from '@/lib/server/firebase/admin';

export const runtime = 'nodejs';

export async function GET(request) {
  const userId = await verifyAuth(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const lists = await getSharedLists(userId);

  const listsWithOwner = await Promise.all(
    lists.map(async (list) => {
      try {
        const ownerRecord = await admin.auth().getUser(list.userId);
        return {
          ...list,
          ownerEmail: ownerRecord.email,
          ownerName: ownerRecord.displayName || ownerRecord.email
        };
      } catch {
        return { ...list, ownerEmail: null, ownerName: null };
      }
    })
  );

  return NextResponse.json(listsWithOwner, { status: 200 });
}
