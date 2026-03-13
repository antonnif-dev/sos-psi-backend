const { db } = require("../config/firebase");
const { v4: uuid } = require("uuid");

async function criarProntuario(tenantId, data) {
  const id = uuid();
  await db
    .collection("tenants")
    .doc(tenantId)
    .collection("prontuario")
    .doc(id)
    .set({
      id,
      ...data,
      createdAt: new Date()
    });

  return id;
}

async function listarProntuarios(tenantId) {
  const snapshot = await db
    .collection("tenants")
    .doc(tenantId)
    .collection("prontuario")
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

async function editarProntuario(tenantId, id, data) {

  await db
    .collection("tenants")
    .doc(tenantId)
    .collection("prontuario")
    .doc(id)
    .update({
      ...data,
      updatedAt: new Date()
    });
}

async function deletarProntuario(tenantId, id) {

  await db
    .collection("tenants")
    .doc(tenantId)
    .collection("prontuario")
    .doc(id)
    .delete();
}

module.exports = {
  criarProntuario,
  listarProntuarios,
  editarProntuario,
  deletarProntuario
};