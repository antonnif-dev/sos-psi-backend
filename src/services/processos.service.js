const repo = require("../repositories/processos.repository");

async function listarProcessos(tenantId) {
    return repo.listarProcessos(tenantId);
}

async function criarProcesso(tenantId, data) {
    if (!data.titulo) {
        throw new Error("Título obrigatório");
    }

    return repo.criarProcesso(tenantId, data);
}

async function editarProcesso(tenantId, id, data) {
    if (!id) {
        throw new Error("Processo inválido");
    }

    await repo.editarProcesso(tenantId, id, data);
}

async function deletarProcesso(tenantId, id) {
    if (!id) {
        throw new Error("Processo inválido");
    }

    await repo.deletarProcesso(tenantId, id);
}

module.exports = {
    listarProcessos,
    criarProcesso,
    editarProcesso,
    deletarProcesso
};