const { db } = require("../config/firebase");
const { v4: uuid } = require("uuid");

async function criarPrescricao(tenantId, data) {

  const id = uuid();

  await db
    .collection("tenants")
    .doc(tenantId)
    .collection("prescricoes")
    .doc(id)
    .set({
      id,
      ...data,
      createdAt: new Date()
    });

  return id;
}

async function listarPorPaciente(tenantId, pacienteId) {

  const snapshot = await db
    .collection("tenants")
    .doc(tenantId)
    .collection("prescricoes")
    .where("pacienteId", "==", pacienteId)
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

async function deletarPrescricao(tenantId, id) {

  await db
    .collection("tenants")
    .doc(tenantId)
    .collection("prescricoes")
    .doc(id)
    .delete();

}

module.exports = {
  criarPrescricao,
  listarPorPaciente,
  deletarPrescricao
};