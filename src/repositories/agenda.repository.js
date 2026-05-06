const { db } = require("../config/firebase");
const { v4: uuid } = require("uuid");
const { collection, query, where, getDocs } = require('firebase/firestore');

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
  if (!tenantId) return [];

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

async function listarRealizadas(tenantId) {
  const snapshot = await db
    .collection("tenants")
    .doc(tenantId)
    .collection("agenda")
    .where("status", "==", "realizada")
    .get();

  return snapshot.docs.map(doc => {
    const data = doc.data();

    function converter(valor) {
      if (!valor) return null;
      if (valor.toDate) {
        return valor.toDate().toISOString();
      }
      if (typeof valor === "number") {
        return new Date(valor).toISOString();
      }
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

async function buscarSessoesFuturas(tenantId, pacienteId) {
  try {
    if (!tenantId || !pacienteId) return [];
    const agora = new Date();

    const snapshot = await db
      .collection("tenants")
      .doc(tenantId)
      .collection("agenda")
      .where("pacienteId", "==", pacienteId)
      .where("data", ">", agora)
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

  } catch (error) {
    console.error("Erro ao buscar sessões futuras:", error);
    return [];
  }
}

async function buscarPorId(tenantId, id) {
  const doc = await db
    .collection("tenants")
    .doc(tenantId)
    .collection("agenda")
    .doc(id)
    .get();

  return doc.exists ? doc.data() : null;
}

async function listarPorPaciente(tenantId, pacienteId) {
  if (!tenantId || !pacienteId) return [];

  const snapshot = await db
    .collection("tenants")
    .doc(tenantId)
    .collection("agenda")
    .where("pacienteId", "==", pacienteId)
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

module.exports = {
  criarConsulta,
  listarConsultas,
  editarConsulta,
  deletarConsulta,
  listarRealizadas,
  buscarSessoesFuturas,
  buscarPorId,
  listarPorPaciente
};