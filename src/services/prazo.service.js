console.log("ARQUIVO CERTO");
const repo = require("../repositories/prazo.repository");

async function listarPrazos(tenantId) {
    return repo.listarPrazos(tenantId);
}

async function criarPrazo(tenantId, data) {
    if (!data.cliente) {
        throw new Error("Cliente obrigatório");
    }

    if (!data.descricao) {
        throw new Error("Descrição obrigatória");
    }

    if (!data.dataLimite) {
        throw new Error("Data limite obrigatória");
    }

    return repo.criarPrazo(tenantId, data);
}

async function editarPrazo(
    tenantId,
    id,
    data
) {
    if (!id) {
        throw new Error("Prazo inválido");
    }

    await repo.editarPrazo(
        tenantId,
        id,
        data
    );
}

async function deletarPrazo(
    tenantId,
    id
) {
    if (!id) {
        throw new Error("Prazo inválido");
    }

    await repo.deletarPrazo(
        tenantId,
        id
    );
}

module.exports = {
    listarPrazos,
    criarPrazo,
    editarPrazo,
    deletarPrazo
};