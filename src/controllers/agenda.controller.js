const service = require("../services/agenda.service");

async function criarConsulta(req, res) {
 try {
  const id = await service.criarConsulta(
   req.tenantId,
   req.body
  );

  res.json({ id });
 } catch (error) {
  res.status(400).json({ error: error.message });
 }
}

async function listarConsultas(req, res) {
 const consultas = await service.listarConsultas(req.tenantId);
 res.json(consultas);

}

async function editarConsulta(req, res){
 try{
  await service.editarConsulta(
   req.tenantId,
   req.params.id,
   req.body
  );
  res.json({ success: true });
 }catch(error){
  res.status(400).json({ error: error.message });
 }
}

async function deletarConsulta(req, res){
 try{
  await service.deletarConsulta(
   req.tenantId,
   req.params.id
  );
  res.json({ success: true });
 }catch(error){
  res.status(400).json({ error: error.message });
 }
}

module.exports = {
 criarConsulta,
 listarConsultas,
 editarConsulta,
 deletarConsulta
};