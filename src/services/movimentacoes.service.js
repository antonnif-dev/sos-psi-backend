const repo =
    require("../repositories/movimentacoes.repository");

async function listar(
    tenantId,
    processoId
) {

    return repo.listarPorProcesso(
        tenantId,
        processoId
    );

}

async function listarTodas(
    tenantId
) {

    return repo.listarTodas(
        tenantId
    );

}

module.exports = {
    listar,
    listarTodas
};