const { db } = require("../src/config/firebase")

async function contar() {

  const snapshot = await db.collection("medicamentos").count().get()

  console.log("Total:", snapshot.data().count)

}

contar()