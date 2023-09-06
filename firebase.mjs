const admin = require('firebase-admin');

const serviceAccount = require('./etc/secrets/image-api-6ad47-firebase-adminsdk-q470c-4086d8e815.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Export the db variable so that it can be used in other modules
export { db };
