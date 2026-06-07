const service = require("../services/processos.service");

async function listar(req, res) {
    try {
        const processos = await service.listarProcessos(req.tenantId);
        res.json(processos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function criar(req, res) {
    try {
        const id = await service.criarProcesso(req.tenantId, req.body);
        res.json({ id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function editar(req, res) {
    try {
        await service.editarProcesso(
            req.tenantId,
            req.params.id,
            req.body
        );
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function deletar(req, res) {
    try {
        await service.deletarProcesso(
            req.tenantId,
            req.params.id
        );
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function sincronizar(req, res) {
    try {

        const resultado =
            await service.sincronizarProcesso(
                req.tenantId,
                req.params.id
            );

        res.json(resultado);

    } catch (error) {

        console.error(
            "ERRO SINCRONIZAR:"
        );

        console.error(error);

        console.error(
            error.stack
        );

        res.status(400).json({
            error: error.message
        });

    }
}

module.exports = {
    listar,
    criar,
    editar,
    deletar,
    sincronizar
};