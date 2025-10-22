import fs from 'fs';
import path from 'path';
import * as firebaseService from '../firebase/listsService';

const dataDir = path.join(process.cwd(), 'data');
const dataFile = path.join(dataDir, 'lists.json');

const isFirebaseConfigured = () => {
  return process.env.FIREBASE_PROJECT_ID && 
         process.env.FIREBASE_CLIENT_EMAIL && 
         process.env.FIREBASE_PRIVATE_KEY;
};

function ensureLoaded() {
  if (!globalThis.__listsStore) {
    try {
      if (fs.existsSync(dataFile)) {
        const raw = fs.readFileSync(dataFile, 'utf-8');
        globalThis.__listsStore = raw ? JSON.parse(raw) : [];
      } else {
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(dataFile, '[]', 'utf-8');
        globalThis.__listsStore = [];
      }
    } catch (e) {
      globalThis.__listsStore = [];
    }
  }
}

function persist() {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(dataFile, JSON.stringify(globalThis.__listsStore), 'utf-8');
  } catch {}
}

const getStore = () => {
  ensureLoaded();
  return globalThis.__listsStore;
};

export async function getLists() {
  if (isFirebaseConfigured()) {
    return await firebaseService.getAllLists();
  }
  return getStore();
}

export async function addList(list) {
  if (isFirebaseConfigured()) {
    return await firebaseService.createList(list);
  }
  getStore().push(list);
  persist();
  return list;
}

export async function findListById(id) {
  if (isFirebaseConfigured()) {
    return await firebaseService.getListById(id);
  }
  return getStore().find((l) => l.id === id);
}

export async function updateList(id, updatedData) {
  if (isFirebaseConfigured()) {
    return await firebaseService.updateListData(id, updatedData);
  }
  const store = getStore();
  const index = store.findIndex((l) => l.id === id);
  if (index === -1) return null;
  store[index] = { ...store[index], ...updatedData };
  persist();
  return store[index];
}

export async function deleteList(id) {
  if (isFirebaseConfigured()) {
    return await firebaseService.deleteListData(id);
  }
  const store = getStore();
  const index = store.findIndex((l) => l.id === id);
  if (index === -1) return null;
  const deleted = store[index];
  store.splice(index, 1);
  persist();
  return deleted;
}
