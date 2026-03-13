const service = require("../services/prontuario.service");

async function listarProntuarios(req, res) {
    try {
        const prontuarios = await service.listarProntuarios(req.tenantId);
        res.json(prontuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function criarProntuario(req, res) {
    try {
        const id = await service.criarProntuario(
            req.tenantId,
            req.body
        );
        res.json({ id });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
}

async function editarProntuario(req, res) {
    try {
        await service.editarProntuario(
            req.tenantId,
            req.params.id,
            req.body
        );
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function deletarProntuario(req, res) {
    try {
        await service.deletarProntuario(
            req.tenantId,
            req.params.id
        );
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    listarProntuarios,
    criarProntuario,
    editarProntuario,
    deletarProntuario
};