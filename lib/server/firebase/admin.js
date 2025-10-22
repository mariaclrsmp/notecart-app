import admin from 'firebase-admin';

let isInitialized = false;

if (!admin.apps.length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
      isInitialized = true;
    } else {
    }
  } catch (error) {
    isInitialized = false;
  }
}

export const getDb = () => {
  if (!admin.apps.length) {
    return null;
  }
  try {
    return admin.firestore();
  } catch (error) {
    return null;
  }
};

export default admin;
