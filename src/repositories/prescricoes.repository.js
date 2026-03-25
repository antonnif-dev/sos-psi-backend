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

async function salvarAssinatura(
  tenantId,
  id,
  imagem
) {

  await db
    .collection("tenants")
    .doc(tenantId)
    .collection("prescricoes")
    .doc(id)
    .update({
      assinatura: {
        imagem,
        data: new Date()
      }
    })
}

async function buscarPorId(tenantId, id) {
  const doc = await db
    .collection("tenants")
    .doc(tenantId)
    .collection("prescricoes")
    .doc(id)
    .get()

  if (!doc.exists) return null
  return doc.data()
}

async function marcarComoAssinado(token) {
  const snapshot = await db
    .collectionGroup("prescricoes")
    .where("assinatura.token", "==", token)
    .get()

  snapshot.forEach(doc => {
    doc.ref.update({
      "assinatura.status": "signed"
    })
  })
}

module.exports = {
  criarPrescricao,
  listarPorPaciente,
  deletarPrescricao,
  salvarAssinatura,
  buscarPorId,
  marcarComoAssinado
};