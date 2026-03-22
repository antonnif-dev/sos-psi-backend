const { db } = require("../config/firebase")

class MedicamentosRepository {
  async buscarPorNome(search) {
    const searchLower = search.toLowerCase()
    const snapshot = await db
      .collection("medicamentos")
      .orderBy("nomeLower")
      .startAt(searchLower)
      .endAt(searchLower + "\uf8ff")
      .limit(10)
      .get()

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  }
}

module.exports = new MedicamentosRepository()