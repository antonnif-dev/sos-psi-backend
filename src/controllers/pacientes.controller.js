const service = require("../services/pacientes.service");

async function criarPaciente(req, res) {

    try {
        const id = await service.criarPaciente(
            req.tenantId,
            req.body,
            req.user?.uid
        );

        res.json({ id });
    } catch (error) {
        console.error("ERRO CRIAR PACIENTE:", error);
        res.status(400).json({ error: error.message });
    }
}

async function listarPacientes(req, res) {
    const pacientes = await service.listarPacientes(req.tenantId);
    res.json(pacientes);
}

async function editarPaciente(req, res) {
    try {
        await service.editarPaciente(
            req.tenantId,
            req.params.id,
            req.body
        );

        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function deletarPaciente(req, res) {
    try {
        await service.deletarPaciente(
            req.tenantId,
            req.params.id
        );
        res.json({ success: true });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    criarPaciente,
    listarPacientes,
    editarPaciente,
    deletarPaciente
};