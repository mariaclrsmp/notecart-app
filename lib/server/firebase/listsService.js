import { getDb } from './admin';

const COLLECTION = 'lists';

export async function getAllLists() {
  try {
    const db = getDb();
    if (!db) {
      console.log('⚠️ DB is null, returning empty array');
      return [];
    }
    const snapshot = await db.collection(COLLECTION).get();
    const lists = snapshot.docs.map(doc => {
      const data = doc.data();
      return { id: doc.id, ...data };
    });
    return lists.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    return [];
  }
}

export async function getListById(id) {
  try {
    const db = getDb();
    if (!db) return null;
    const doc = await db.collection(COLLECTION).doc(String(id)).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    return null;
  }
}

export async function createList(listData) {
  try {
    const db = getDb();
    if (!db) throw new Error('Firebase not initialized');
    const docRef = db.collection(COLLECTION).doc(String(listData.id));
    await docRef.set({
      name: listData.name,
      type: listData.type,
      createdAt: listData.createdAt,
      items: listData.items || []
    });
    return { id: docRef.id, ...listData };
  } catch (error) {
    throw error;
  }
}

export async function updateListData(id, updates) {
  try {
    const db = getDb();
    if (!db) return null;
    const docRef = db.collection(COLLECTION).doc(String(id));
    const doc = await docRef.get();
    
    if (!doc.exists) return null;
    
    const updateData = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.items !== undefined) updateData.items = updates.items;
    
    await docRef.update(updateData);
    
    const updated = await docRef.get();
    return { id: updated.id, ...updated.data() };
  } catch (error) {
    return null;
  }
}

export async function deleteListData(id) {
  try {
    const db = getDb();
    if (!db) return null;
    const docRef = db.collection(COLLECTION).doc(String(id));
    const doc = await docRef.get();
    
    if (!doc.exists) return null;
    
    const data = { id: doc.id, ...doc.data() };
    await docRef.delete();
    return data;
  } catch (error) {
    return null;
  }
}
