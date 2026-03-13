const service = require("../services/financeiro.service");

async function listar(req, res) {
 try {
  const pagamentos = await service.listarPagamentos(req.tenantId);
  res.json(pagamentos);
 } catch (error) {
  res.status(500).json({ error: error.message });
 }
}

async function criarPagamento(req, res) {
 try {
  const id = await service.criarPagamento(
   req.tenantId,
   req.body
  );
  res.json({ id });
 } catch (error) {
  res.status(400).json({ error: error.message });
 }
}

async function editarPagamento(req,res){
 try{
  await service.editarPagamento(
   req.tenantId,
   req.params.id,
   req.body
  );
  res.json({ success:true });
 }catch(error){
  res.status(400).json({ error:error.message });
 }
}

async function deletarPagamento(req,res){
 try{
  await service.deletarPagamento(
   req.tenantId,
   req.params.id
  );
  res.json({ success:true });
 }catch(error){
  res.status(400).json({ error:error.message });
 }
}

module.exports = {
 listar,
 criarPagamento,
 editarPagamento,
 deletarPagamento
};