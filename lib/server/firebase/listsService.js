import { getDb } from './admin';

const COLLECTION = 'lists';

export async function getAllLists(userId) {
  try {
    const db = getDb();
    if (!db || !userId) {
      return [];
    }
    const snapshot = await db.collection(COLLECTION)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting lists:', error);
    return [];
  }
}

export async function getListById(id, userId) {
  try {
    const db = getDb();
    if (!db || !userId) return null;
    const doc = await db.collection(COLLECTION).doc(String(id)).get();

    if (!doc.exists) return null;
    const data = doc.data();

    // Security check: only allow if it belongs to the user
    if (data.userId !== userId) return null;

    return { id: doc.id, ...data };
  } catch (error) {
    return null;
  }
}

export async function createList(listData, userId) {
  try {
    const db = getDb();
    if (!db || !userId) throw new Error('Auth required');

    const docRef = db.collection(COLLECTION).doc(String(listData.id));
    const dataToSave = {
      name: listData.name,
      type: listData.type,
      userId: userId, // Associate list with user
      createdAt: listData.createdAt || new Date().toISOString(),
      items: listData.items || []
    };

    await docRef.set(dataToSave);
    return { id: docRef.id, ...dataToSave };
  } catch (error) {
    throw error;
  }
}

export async function updateListData(id, updates, userId) {
  try {
    const db = getDb();
    if (!db || !userId) return null;

    const docRef = db.collection(COLLECTION).doc(String(id));
    const doc = await docRef.get();

    if (!doc.exists || doc.data().userId !== userId) return null;

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

export async function deleteListData(id, userId) {
  try {
    const db = getDb();
    if (!db || !userId) return null;

    const docRef = db.collection(COLLECTION).doc(String(id));
    const doc = await docRef.get();

    if (!doc.exists || doc.data().userId !== userId) return null;

    const data = { id: doc.id, ...doc.data() };
    await docRef.delete();
    return data;
  } catch (error) {
    return null;
  }
}
