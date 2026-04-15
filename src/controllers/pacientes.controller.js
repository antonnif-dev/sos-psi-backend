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
    console.log("CHEGOU NO CONTROLLER");
    const pacientes = await service.listarPacientes(req.tenantId);
    console.log("PACIENTES:", pacientes);
    res.json(pacientes);
    console.log("REQ.TENANT NO CONTROLLER:", req.tenantId);
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