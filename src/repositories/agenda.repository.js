const { db } = require("../config/firebase");
const { v4: uuid } = require("uuid");

async function criarConsulta(tenantId, data) {
  const id = uuid();
  const { Timestamp } = require("firebase-admin/firestore");
  await db
    .collection("tenants")
    .doc(tenantId)
    .collection("agenda")
    .doc(id)
    .set({
      id,
      ...data,
      data: Timestamp.fromDate(new Date(data.data)),
      createdAt: Timestamp.now()
    });
  return id;
}

async function listarConsultas(tenantId) {

  const snapshot = await db
    .collection("tenants")
    .doc(tenantId)
    .collection("agenda")
    .get();

  return snapshot.docs.map(doc => {

    const data = doc.data();

    function converter(valor) {

      if (!valor) return null;

      // Timestamp Firestore
      if (valor.toDate) {
        return valor.toDate().toISOString();
      }

      // number (timestamp JS)
      if (typeof valor === "number") {
        return new Date(valor).toISOString();
      }

      // string
      if (typeof valor === "string") {
        return new Date(valor).toISOString();
      }

      return valor;

    }

    return {
      id: doc.id,
      ...data,
      data: converter(data.data),
      createdAt: converter(data.createdAt),
      updatedAt: converter(data.updatedAt)
    };

  });

}

async function editarConsulta(tenantId, id, data) {
  const { Timestamp } = require("firebase-admin/firestore");
  await db
    .collection("tenants")
    .doc(tenantId)
    .collection("agenda")
    .doc(id)
    .update({
      ...data,
      updatedAt: Timestamp.now()
    });
}

async function deletarConsulta(tenantId, id) {
  await db
    .collection("tenants")
    .doc(tenantId)
    .collection("agenda")
    .doc(id)
    .delete();
}

module.exports = {
  criarConsulta,
  listarConsultas,
  editarConsulta,
  deletarConsulta
};