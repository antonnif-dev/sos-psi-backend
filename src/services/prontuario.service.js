const repo = require("../repositories/prontuario.repository");

async function listarProntuarios(tenantId) {

    return repo.listarProntuarios(tenantId);

}

async function criarProntuario(tenantId, data) {
    if (!data.paciente) {
        throw new Error("Paciente obrigatório");
    }
    if (!data.observacoes) {
        throw new Error("Observações obrigatórias");
    }
    return repo.criarProntuario(tenantId, data);
}

async function editarProntuario(tenantId, id, data) {
    if (!id) {
        throw new Error("Prontuário inválido");
    }
    await repo.editarProntuario(tenantId, id, data);
}

async function deletarProntuario(tenantId, id) {

    if (!id) {
        throw new Error("Prontuário inválido");
    }

    await repo.deletarProntuario(tenantId, id);

}

module.exports = {
    listarProntuarios,
    criarProntuario,
    editarProntuario,
    deletarProntuario
};