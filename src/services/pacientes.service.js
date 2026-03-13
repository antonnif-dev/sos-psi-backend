const repo = require("../repositories/pacientes.repository");

async function criarPaciente(tenantId, data) {

    if (!data.nome) {
        throw new Error("Nome obrigatório");
    }

    return await repo.criarPaciente(tenantId, data);
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