const repo = require("../repositories/agenda.repository");

async function criarConsulta(tenantId, data) {
 if (!data.pacienteId) {
  throw new Error("Paciente obrigatório");
 }

 return repo.criarConsulta(tenantId, data);
}

async function listarConsultas(tenantId) {
 return repo.listarConsultas(tenantId);
}

async function editarConsulta(tenantId, id, data){
 if(!id){
  throw new Error("Consulta inválida");
 }
 await repo.editarConsulta(tenantId, id, data);
}

async function deletarConsulta(tenantId, id){
 if(!id){
  throw new Error("Consulta inválida");
 }
 await repo.deletarConsulta(tenantId, id);
}

module.exports = {
 criarConsulta,
 listarConsultas,
 editarConsulta,
 deletarConsulta
};