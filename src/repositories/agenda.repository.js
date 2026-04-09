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

async function buscarSessoesFuturas() {
  try {
    const agora = new Date();

    const sessoesRef = collection(db, 'agenda');

    const q = query(sessoesRef, where('dataHora', '>', agora));

    const snapshot = await getDocs(q);

    const sessoesFuturas = [];
    snapshot.forEach(doc => {
      sessoesFuturas.push({ id: doc.id, ...doc.data() });
    });

    return sessoesFuturas;
  } catch (error) {
    console.error('Erro ao buscar sessões futuras:', error);
    return [];
  }
}

module.exports = {
  criarConsulta,
  listarConsultas,
  editarConsulta,
  deletarConsulta,
  listarRealizadas,
  buscarSessoesFuturas
};