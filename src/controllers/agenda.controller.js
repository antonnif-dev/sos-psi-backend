const service = require("../services/agenda.service");

async function criarConsulta(req, res) {
    try {
        const id = await service.criarConsulta(
            req.tenantId,
            req.body,
            req.user?.uid
        );

        res.json({ id });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function listarConsultas(req, res) {
    const consultas = await service.listarConsultas(req.tenantId);
    res.json(consultas);
}

async function editarConsulta(req, res) {
    try {
        await service.editarConsulta(
            req.tenantId,
            req.params.id,
            req.body
        );
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function deletarConsulta(req, res) {
    try {
        await service.deletarConsulta(
            req.tenantId,
            req.params.id
        );
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function listarRealizadas(req, res) {
    try {
        const consultas = await service.listarRealizadas(req.tenantId);
        res.json(consultas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    criarConsulta,
    listarConsultas,
    editarConsulta,
    deletarConsulta,
    listarRealizadas
};