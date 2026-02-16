import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    // Attempt to parse FIREBASE_SERVICE_ACCOUNT if available (preferred for Vercel)
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) 
      : {
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Handle private key newlines
          privateKey: process.env.FIREBASE_PRIVATE_KEY 
            ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
            : undefined
        };

    if (serviceAccount.projectId) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } else {
        // Fallback or local dev (might fail if no creds)
        admin.initializeApp();
    }
  } catch (error) {
    console.error('Firebase Admin Init Error:', error.stack);
  }
}

const db = admin.firestore();
export { db };
