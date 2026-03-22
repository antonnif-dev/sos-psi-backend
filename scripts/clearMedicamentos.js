const { db } = require("../src/config/firebase")

async function clear() {
  const snapshot = await db.collection("medicamentos").get()

  console.log("Deletando:", snapshot.size)

  let batch = db.batch()
  let count = 0

  for (const doc of snapshot.docs) {
    batch.delete(doc.ref)
    count++

    if (count === 400) {
      await batch.commit()
      batch = db.batch()
      count = 0
    }
  }

  if (count > 0) {
    await batch.commit()
  }

  console.log("Coleção limpa!")
}

clear()