const notificacoesService = require("../services/notificacoes.service");
const labelsConfig = require("../config/labels");
const tenantService = require("../services/tenant.service");
const { notify } = require("../services/notificationEngine.service");

const pacientesRepository = require("../repositories/pacientes.repository");
const agendaRepository = require("../repositories/agenda.repository");
const financeiroRepository = require("../repositories/financeiro.repository");

async function pacienteCriado(tenantId, paciente) {
    console.log("🔥 pacienteCriado disparado:", paciente.nome);
    if (!paciente.psicologoId) return;

    const tenant = await tenantService.buscarTenant(tenantId);
    const labels = labelsConfig[tenant.segmento];

    await notify({
        tenantId,
        userId: paciente.psicologoId,
        type: "PACIENTE_CRIADO",
        data: {
            nome: paciente.nome,
            segmento: tenant.segmento
        }
    });
}

async function verificarPacientesSemSessao(tenantId) {
    const pacientes = await pacientesRepository.listar(tenantId);

    for (const paciente of pacientes) {

        if (!paciente.frequencia) continue;

        const consultas = await agendaRepository.listarPorPaciente(
            tenantId,
            paciente.id
        );

        if (!consultas.length) continue;

        const ultima = consultas.sort(
            (a, b) => new Date(b.data) - new Date(a.data)
        )[0];

        const dias = parseInt(paciente.frequencia);

        const limite = new Date(ultima.data);
        limite.setDate(limite.getDate() + dias);

        if (new Date() > limite) {

            await notify({
                tenantId,
                userId: paciente.psicologoId,
                type: "PACIENTE_SEM_SESSAO",
                data: {
                    nome: paciente.nome,
                    dias,
                    id: paciente.id
                }
            });

        }
    }
}

async function verificarPacientesSemSessaoMarcada(tenantId) {
    const pacientes = await pacientesRepository.listar(tenantId);

    for (const paciente of pacientes) {

        const consultas = await agendaRepository.listarPorPaciente(
            tenantId,
            paciente.id
        );

        if (consultas.length === 0) {

            await notify({
                tenantId,
                userId: paciente.psicologoId,
                type: "PACIENTE_SEM_SESSAO_MARCADA",
                data: {
                    nome: paciente.nome,
                    id: paciente.id
                }
            });

        }
    }
}

module.exports = {
    pacienteCriado,
    verificarPacientesSemSessao,
    verificarPacientesSemSessaoMarcada,
}