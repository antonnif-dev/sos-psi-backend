const admin = require("firebase-admin");

const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };