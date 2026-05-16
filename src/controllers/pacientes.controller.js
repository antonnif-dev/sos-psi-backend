const service = require("../services/pacientes.service");
const { incrementarUso, buscarUsoMesAtual } = require("../repositories/uso.repository");

async function criarPaciente(req, res) {
    console.log("CRIANDO PACIENTE PARA TENANT:", req.tenantId);
    try {
        const id = await service.criarPaciente(
            req.tenantId,
            req.body,
            req.user?.uid
        );
        console.log("PACIENTE CRIADO, ID:", id);
        console.log("INCREMENTANDO USO DE PACIENTES +1");
        await incrementarUso(req.tenantId, "pacientes", 1);
        console.log("USO INCREMENTADO COM SUCESSO");

        const usoDepois = await buscarUsoMesAtual(req.tenantId);
        console.log("🔥 USO APÓS INCREMENTO:", usoDepois);

        return res.status(201).json({ sucesso: true, id });

    } catch (error) {
        console.error("ERRO CRIAR PACIENTE:", error);
        return res.status(400).json({ error: error.message });
    }
}

async function listarPacientes(req, res) {
    const pacientes = await service.listarPacientes(req.tenantId);
    return res.json(pacientes);
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

async function alterarPsicologo(req, res) {

    try {

        const pacienteId = req.params.id;
        const { psicologoId } = req.body;

        await service.alterarPsicologo(
            req.tenantId,
            pacienteId,
            psicologoId
        );

        return res.json({
            success: true
        });

    } catch (error) {

        console.error("ERRO ALTERAR PSICOLOGO:");
        console.error(error);

        return res.status(400).json({
            error: error.message
        });
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
    alterarPsicologo,
    deletarPaciente
};