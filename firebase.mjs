import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

// Access environment variables
const serviceAccountKey = JSON.parse(process.env.FIREBASE_ADMIN_KEY);

admin.initializeApp({
	credential: admin.credential.cert(serviceAccountKey),
});

const db = admin.firestore();

// Export the db variable so that it can be used in other modules
export { db };
