const repo = require("../repositories/financeiro.repository");

async function listarPagamentos(tenantId) {
 return repo.listarPagamentos(tenantId);
}

async function criarPagamento(tenantId, data) {
 if(!data.valor){
  throw new Error("Valor obrigatório");
 }
 return repo.criarPagamento(tenantId, data);
}

async function editarPagamento(tenantId,id,data){
 if(!id){
  throw new Error("Pagamento inválido");
 }
 await repo.editarPagamento(tenantId,id,data);
}

async function deletarPagamento(tenantId,id){
 if(!id){
  throw new Error("Pagamento inválido");
 }
 await repo.deletarPagamento(tenantId,id);
}

module.exports = {
 listarPagamentos,
 criarPagamento,
 editarPagamento,
 deletarPagamento
};