const { db } = require("../config/firebase");
const { v4: uuid } = require("uuid");

async function criarPagamento(tenantId, data) {
 const id = uuid();
 await db
  .collection("tenants")
  .doc(tenantId)
  .collection("financeiro")
  .doc(id)
  .set({
   id,
   ...data,
   createdAt: new Date()
  });
 return id;
}

async function listarPagamentos(tenantId){
 const snapshot = await db
  .collection("tenants")
  .doc(tenantId)
  .collection("financeiro")
  .get();
 return snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
 }));
}

async function editarPagamento(tenantId,id,data){
 await db
  .collection("tenants")
  .doc(tenantId)
  .collection("financeiro")
  .doc(id)
  .update({
   ...data,
   updatedAt:new Date()
  });
}

async function deletarPagamento(tenantId,id){
 await db
  .collection("tenants")
  .doc(tenantId)
  .collection("financeiro")
  .doc(id)
  .delete();
}

module.exports = {
 criarPagamento,
 listarPagamentos,
 editarPagamento,
 deletarPagamento
};