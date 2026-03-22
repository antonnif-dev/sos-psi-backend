const repo = require("../repositories/pacientes.repository");
const pacienteEvents = require("../events/paciente.events")

async function criarPaciente(tenantId, data, userId) {
    if (!data.nome) {
        throw new Error("Nome obrigatório");
    }
    const id = await repo.criarPaciente(tenantId, data);

    if (userId) {
        await pacienteEvents.pacienteCriado(tenantId, {
            ...data,
            psicologoId: userId
        });
    }

    return id;
}

async function listarPacientes(tenantId) {
    return await repo.listarPacientes(tenantId);
}

async function editarPaciente(tenantId, id, data) {
    if (!id) {
        throw new Error("Paciente inválido");
    }
    await repo.editarPaciente(tenantId, id, data);
}

async function deletarPaciente(tenantId, id) {
    if (!id) {
        throw new Error("Paciente inválido");
    }
    await repo.deletarPaciente(tenantId, id);
}

module.exports = {
    criarPaciente,
    listarPacientes,
    editarPaciente,
    deletarPaciente
};