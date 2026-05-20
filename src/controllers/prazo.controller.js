const service = require("../services/prazo.service");

async function listar(req, res) {
    try {
        const prazos = await service.listarPrazos(
            req.tenantId
        );

        res.json(prazos);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

async function criar(req, res) {
    try {
        const id = await service.criarPrazo(
            req.tenantId,
            req.body
        );

        res.json({ id });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}

async function editar(req, res) {
    try {
        await service.editarPrazo(
            req.tenantId,
            req.params.id,
            req.body
        );

        res.json({
            success: true
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}

async function deletar(req, res) {
    try {
        await service.deletarPrazo(
            req.tenantId,
            req.params.id
        );

        res.json({
            success: true
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}

module.exports = {
    listar,
    criar,
    editar,
    deletar
};