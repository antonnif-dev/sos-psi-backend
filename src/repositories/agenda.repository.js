const { db } = require("../config/firebase");
const { v4: uuid } = require("uuid");

async function criarConsulta(tenantId, data) {
 const id = uuid();
 await db
  .collection("tenants")
  .doc(tenantId)
  .collection("agenda")
  .doc(id)
  .set({
   id,
   ...data,
   createdAt: new Date()
  });
 return id;
}

async function listarConsultas(tenantId) {
 const snapshot = await db
  .collection("tenants")
  .doc(tenantId)
  .collection("agenda")
  .get();

 return snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
 }));
}

async function editarConsulta(tenantId, id, data){
 await db
  .collection("tenants")
  .doc(tenantId)
  .collection("agenda")
  .doc(id)
  .update({
   ...data,
   updatedAt: new Date()
  });
}

async function deletarConsulta(tenantId, id){
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