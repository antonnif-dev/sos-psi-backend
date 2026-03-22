const repo = require("../repositories/agenda.repository");

async function criarConsulta(tenantId, data) {
    const notificacoes = require("./notificacoes.service")
    if (!data.pacienteId) {
        throw new Error("Paciente obrigatório");
    }
    if (!data.data) {
        throw new Error("Data obrigatória");
    }
    const consultas = await repo.listarConsultas(tenantId);
    const conflito = consultas.find(c => c.data === data.data);
    if (conflito) {
        throw new Error("Já existe consulta neste horário");
    }
    await notificacoes.createNotificacao(
        psicologoUid,
        "Nova consulta agendada",
        `Consulta com ${paciente.nome}`,
        `/agenda`,
        "appointment"
    )
    return repo.criarConsulta(tenantId, data);
}

async function listarConsultas(tenantId) {
    return repo.listarConsultas(tenantId);
}

async function editarConsulta(tenantId, id, data) {
    if (!id) {
        throw new Error("Consulta inválida");
    }
    await repo.editarConsulta(tenantId, id, data);
}

async function deletarConsulta(tenantId, id) {
    if (!id) {
        throw new Error("Consulta inválida");
    }
    await repo.deletarConsulta(tenantId, id);
}

module.exports = {
    criarConsulta,
    listarConsultas,
    editarConsulta,
    deletarConsulta
};