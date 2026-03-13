const { auth, db } = require("../config/firebase");
const { v4: uuid } = require("uuid");

async function registerAdmin(data) {

 const user = await auth.createUser({
  email: data.email,
  password: data.password
 });

 const tenantId = uuid();

 await db.collection("tenants").doc(tenantId).set({
  createdAt: new Date()
 });

 await db
  .collection("tenants")
  .doc(tenantId)
  .collection("usuarios")
  .doc(user.uid)
  .set({
   uid: user.uid,
   email: data.email,
   nome: data.nome,
   role: "ADMIN",
   tenantId
  });

 return {
  uid: user.uid,
  tenantId
 };

}

module.exports = {
 registerAdmin
};