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
      .get();

    const lists = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    lists.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return lists;
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

    const isOwner = data.userId === userId;
    const isShared = (data.sharedWith || []).includes(userId);
    if (!isOwner && !isShared) return null;

    return { id: doc.id, ...data };
  } catch (error) {
    return null;
  }
}

export async function getListPublic(id) {
  try {
    const db = getDb();
    if (!db) return null;
    const doc = await db.collection(COLLECTION).doc(String(id)).get();
    if (!doc.exists) return null;
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      type: data.type,
      items: data.items || [],
      createdAt: data.createdAt,
    };
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
      userId: userId,
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

    if (!doc.exists) return null;
    const data = doc.data();
    const isOwner = data.userId === userId;
    const isShared = (data.sharedWith || []).includes(userId);
    if (!isOwner && !isShared) return null;

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

export async function shareList(id, targetUserEmail, userId) {
  try {
    const db = getDb();
    if (!db || !userId || !targetUserEmail) return null;

    const docRef = db.collection(COLLECTION).doc(String(id));
    const doc = await docRef.get();

    if (!doc.exists || doc.data().userId !== userId) return null;

    const admin = (await import('./admin')).default;
    let targetUser;
    try {
      targetUser = await admin.auth().getUserByEmail(targetUserEmail);
    } catch (error) {
      return { error: 'USER_NOT_FOUND' };
    }

    if (targetUser.uid === userId) return { error: 'CANNOT_SHARE_WITH_SELF' };

    const currentShared = doc.data().sharedWith || [];
    if (currentShared.includes(targetUser.uid)) {
      return { id: doc.id, ...doc.data() };
    }

    await docRef.update({
      sharedWith: [...currentShared, targetUser.uid]
    });

    const updated = await docRef.get();
    return { id: updated.id, ...updated.data() };
  } catch (error) {
    console.error('Error sharing list:', error);
    return null;
  }
}

export async function unshareList(id, targetUserId, userId) {
  try {
    const db = getDb();
    if (!db || !userId || !targetUserId) return null;

    const docRef = db.collection(COLLECTION).doc(String(id));
    const doc = await docRef.get();

    if (!doc.exists || doc.data().userId !== userId) return null;

    const currentShared = doc.data().sharedWith || [];
    await docRef.update({
      sharedWith: currentShared.filter(uid => uid !== targetUserId)
    });

    const updated = await docRef.get();
    return { id: updated.id, ...updated.data() };
  } catch (error) {
    console.error('Error unsharing list:', error);
    return null;
  }
}

export async function getSharedLists(userId) {
  try {
    const db = getDb();
    if (!db || !userId) return [];

    const snapshot = await db.collection(COLLECTION)
      .where('sharedWith', 'array-contains', userId)
      .get();

    const lists = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    lists.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const admin = (await import('./admin')).default;
    const ownerIds = [...new Set(lists.map(l => l.userId))];
    const ownerMap = {};
    for (const ownerId of ownerIds) {
      try {
        const ownerRecord = await admin.auth().getUser(ownerId);
        ownerMap[ownerId] = { email: ownerRecord.email, displayName: ownerRecord.displayName || null };
      } catch {
        ownerMap[ownerId] = { email: null, displayName: null };
      }
    }

    return lists.map(list => ({
      ...list,
      ownerEmail: ownerMap[list.userId]?.email || null,
      ownerName: ownerMap[list.userId]?.displayName || null
    }));
  } catch (error) {
    console.error('Error getting shared lists:', error);
    return [];
  }
}

export async function getSharedUserEmails(userIds) {
  try {
    if (!userIds || userIds.length === 0) return [];
    const admin = (await import('./admin')).default;
    const results = [];
    for (const uid of userIds) {
      try {
        const userRecord = await admin.auth().getUser(uid);
        results.push({ uid, email: userRecord.email, displayName: userRecord.displayName || null });
      } catch (error) {
        results.push({ uid, email: null, displayName: null });
      }
    }
    return results;
  } catch (error) {
    console.error('Error getting shared user emails:', error);
    return [];
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
