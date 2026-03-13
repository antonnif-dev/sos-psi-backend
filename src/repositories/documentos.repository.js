const { db } = require("../config/firebase");
const { v4: uuid } = require("uuid");

async function criarDocumento(tenantId,data){
 const id = uuid();
 await db
  .collection("tenants")
  .doc(tenantId)
  .collection("documentos")
  .doc(id)
  .set({
   id,
   ...data,
   createdAt:new Date()
  });
 return id;
}

async function listarDocumentos(tenantId){
 const snapshot = await db
  .collection("tenants")
  .doc(tenantId)
  .collection("documentos")
  .get();

 return snapshot.docs.map(doc => ({
  id:doc.id,
  ...doc.data()
 }));
}

async function editarDocumento(tenantId,id,data){
 await db
  .collection("tenants")
  .doc(tenantId)
  .collection("documentos")
  .doc(id)
  .update({
   ...data,
   updatedAt:new Date()
  });
}

async function deletarDocumento(tenantId,id){
 await db
  .collection("tenants")
  .doc(tenantId)
  .collection("documentos")
  .doc(id)
  .delete();
}

module.exports={
 criarDocumento,
 listarDocumentos,
 deletarDocumento
};