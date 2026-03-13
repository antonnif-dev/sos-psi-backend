const { db } = require("../config/firebase");

exports.getDashboard = async (req,res)=>{

 try{

  const tenantId = req.tenantId;

  const pacientesRef = db
   .collection("tenants")
   .doc(tenantId)
   .collection("pacientes");

  const agendaRef = db
   .collection("tenants")
   .doc(tenantId)
   .collection("agenda");

  const pacientes = await pacientesRef.get();
  const agenda = await agendaRef.get();

  res.json({
   totalPacientes: pacientes.size,
   totalConsultas: agenda.size
  });

 }catch(error){
  console.error(error);
  res.status(500).json({
   error:"Erro ao carregar dashboard"
  });
 }
};