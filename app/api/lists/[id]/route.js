import { NextResponse } from 'next/server';
import { getListById, updateListData, deleteListData } from '@/lib/server/firebase/listsService';
import { verifyAuth } from '@/lib/server/authMiddleware';

export async function GET(request, { params }) {
  const userId = await verifyAuth(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const list = await getListById(id, userId);

  if (!list) {
    return NextResponse.json(
      { error: 'List not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(list, { status: 200 });
}

export async function PUT(request, { params }) {
  const userId = await verifyAuth(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { name, type, items } = await request.json();

    const updatedList = await updateListData(id, { name, type, items }, userId);

    if (!updatedList) {
      return NextResponse.json(
        { error: 'List not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedList, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

export async function DELETE(request, { params }) {
  const userId = await verifyAuth(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const deletedList = await deleteListData(id, userId);

  if (!deletedList) {
    return NextResponse.json(
      { error: 'List not found or unauthorized' },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { message: 'List deleted successfully', list: deletedList },
    { status: 200 }
  );
}
