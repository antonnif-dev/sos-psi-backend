const service = require("../services/prescricoes.service");

async function criarPrescricao(req, res) {
    try {

        const id = await service.criarPrescricao(
            req.tenantId,
            req.body
        );

        res.json({ id });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function listarPorPaciente(req, res) {

    try {

        const prescricoes = await service.listarPorPaciente(
            req.tenantId,
            req.params.pacienteId
        );

        res.json(prescricoes);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function deletarPrescricao(req, res) {

    try {

        await service.deletarPrescricao(
            req.tenantId,
            req.params.id
        );

        res.json({ success: true });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

module.exports = {
    criarPrescricao,
    listarPorPaciente,
    deletarPrescricao
};