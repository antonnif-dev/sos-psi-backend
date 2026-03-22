const admin = require("firebase-admin")
const serviceAccount = require("../src/config/firebaseKey.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

async function teste() {

  console.log("tentando escrever")

  const ref = await db.collection("teste").add({a:1})

  console.log("escreveu:", ref.id)

}

teste()