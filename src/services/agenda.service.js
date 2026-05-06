const repo = require("../repositories/agenda.repository");
const agendaEvents = require("../events/agenda.events");

async function criarConsulta(tenantId, data, psicologoId) {
    const pacientesRepo = require("../repositories/pacientes.repository");
    if (!data.pacienteId) {
        throw new Error("Paciente obrigatório");
    }

    if (!data.data) {
        throw new Error("Data obrigatória");
    }

    const consultas = await repo.listarConsultas(tenantId);

    const novaData = new Date(data.data).getTime();

    const conflito = consultas.find(c => {
        const existente = new Date(c.data).getTime();
        return existente === novaData;
    });

    if (conflito) {
        throw new Error("Já existe consulta neste horário");
    }

    const paciente = await pacientesRepo.buscarPorId(
        tenantId,
        data.pacienteId
    );

    data.pacienteNome = paciente.nome;
    data.status = "agendada";
    data.psicologoId = psicologoId;

    const id = await repo.criarConsulta(tenantId, data)

    await agendaEvents.consultaCriada(
        tenantId,
        { id, ...data }
    )

    return id
}

async function listarConsultas(tenantId) {
    if (!tenantId) return [];
    const consultas = await repo.listarConsultas(tenantId);
    const agora = new Date();

    for (const consulta of consultas) {
        if (consulta.status === "agendada") {
            const dataConsulta = new Date(new Date(consulta.data).getTime());
            const fimConsulta = new Date(dataConsulta.getTime() + 50 * 60000);
            if (agora >= fimConsulta) {
                await repo.editarConsulta(
                    tenantId,
                    consulta.id,
                    { status: "realizada" }
                );

                await agendaEvents.consultaFinalizada(
                    tenantId,
                    consulta
                )
                consulta.status = "realizada";
            }
        }
    }

    return consultas;
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

    const consultas = await repo.listarConsultas(tenantId)
    const consulta = consultas.find(c => c.id === id)

    await repo.deletarConsulta(tenantId, id)

    if (consulta) {
        await agendaEvents.consultaCancelada(
            tenantId,
            consulta
        )
    }
}

async function listarRealizadas(tenantId) {
    return await repo.listarRealizadas(tenantId);
}

async function buscarPorId(tenantId, id) {
    return await repo.buscarPorId(tenantId, id);
}

module.exports = {
    criarConsulta,
    listarConsultas,
    editarConsulta,
    deletarConsulta,
    listarRealizadas,
    buscarPorId
};