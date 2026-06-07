const service =
    require("../services/movimentacoes.service");

async function listar(
    req,
    res
) {

    try {

        const dados =
            await service.listar(
                req.tenantId,
                req.params.processoId
            );

        res.json(dados);

    } catch (error) {

        res.status(400).json({
            error: error.message
        });

    }
}

async function listarTodas(
    req,
    res
) {

    try {

        const dados =
            await service.listarTodas(
                req.tenantId
            );

        res.json(dados);

    } catch (error) {

        res.status(400).json({
            error: error.message
        });

    }

}

module.exports = {
    listar,
    listarTodas
};