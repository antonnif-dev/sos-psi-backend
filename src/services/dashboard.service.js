const { db } = require("../config/firebase");

async function getDashboard(tenantId) {

 const pacientes = await db
  .collection("tenants")
  .doc(tenantId)
  .collection("pacientes")
  .get();

 const consultas = await db
  .collection("tenants")
  .doc(tenantId)
  .collection("agenda")
  .get();

 return {
  totalPacientes: pacientes.size,
  totalConsultas: consultas.size
 };

}

module.exports = {
 getDashboard
};