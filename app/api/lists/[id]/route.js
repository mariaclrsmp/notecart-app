import { NextResponse } from 'next/server';
import { findListById, updateList, deleteList } from '@/lib/server/stores/listsStore';

export async function GET(request, { params }) {
  const listId = parseInt(params.id);
  const list = await findListById(listId);
  
  if (!list) {
    return NextResponse.json(
      { error: 'List not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(list, { status: 200 });
}

export async function PUT(request, { params }) {
  try {
    const listId = parseInt(params.id);
    const { name, type, items } = await request.json();
    
    const updatedList = await updateList(listId, { name, type, items });
    
    if (!updatedList) {
      return NextResponse.json(
        { error: 'List not found' },
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
  const listId = parseInt(params.id);
  const deletedList = await deleteList(listId);
  
  if (!deletedList) {
    return NextResponse.json(
      { error: 'List not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(
    { message: 'List deleted successfully', list: deletedList },
    { status: 200 }
  );
}
