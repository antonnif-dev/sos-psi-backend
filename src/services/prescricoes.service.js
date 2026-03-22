const repo = require("../repositories/prescricoes.repository");

async function criarPrescricao(tenantId, data) {

    if (!data.pacienteId) {
        throw new Error("Paciente obrigatório");
    }

    if (!data.medicamentos || data.medicamentos.length === 0) {
        throw new Error("Adicione pelo menos um medicamento");
    }

    return await repo.criarPrescricao(tenantId, data);
}

async function listarPorPaciente(tenantId, pacienteId) {

    if (!pacienteId) {
        throw new Error("Paciente inválido");
    }

    return await repo.listarPorPaciente(tenantId, pacienteId);
}

async function deletarPrescricao(tenantId, id) {

    if (!id) {
        throw new Error("Prescrição inválida");
    }

    await repo.deletarPrescricao(tenantId, id);
}

module.exports = {
    criarPrescricao,
    listarPorPaciente,
    deletarPrescricao
};