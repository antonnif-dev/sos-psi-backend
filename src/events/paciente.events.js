const notificacoesService = require("../services/notificacoes.service");
const labelsConfig = require("../config/labels");
const tenantService = require("../services/tenant.service");

async function pacienteCriado(tenantId, paciente) {
    console.log("🔥 pacienteCriado EXECUTOU");
    console.log("TENANT:", tenant);
    console.log("SEGMENTO:", tenant.segmento);
    console.log("LABEL USADO:", labelsConfig[tenant.segmento]);
    if (!paciente.psicologoId) return;

    const tenant = await tenantService.buscarTenant(tenantId);

    const labels = labelsConfig[tenant.segmento];

    await notificacoesService.createNotificacao(
        tenantId,
        paciente.psicologoId,
        "XXXXX TESTE XXXXX",
        `${paciente.nome} foi cadastrado no sistema`,
        "/pacientes",
        "paciente"
    );
}

async function verificarPacientesSemSessao() {
    const pacientes = await pacientesRepository.listar()

    for (const paciente of pacientes) {
        const consultas = await agendaRepository.listarPorPaciente(paciente.id)
        if (!consultas.length) continue
        const ultimaConsulta = consultas.sort(
            (a, b) => new Date(b.data) - new Date(a.data)
        )[0]
        const dias = parseInt(paciente.frequencia)
        const limite = new Date(ultimaConsulta.data)
        limite.setDate(limite.getDate() + dias)

        if (new Date() > limite) {
            await notificacoesService.createNotificacao(
                paciente.tenantId,
                paciente.psicologoId,
                "Paciente sem sessão",
                `${paciente.nome} está sem sessão há ${dias} dias`,
                `/pacientes/${paciente.id}`,
                "paciente_sem_sessao"
            )
        }
    }
}

async function verificarPacientesSemSessaoMarcada() {
    const pacientes = await pacientesRepository.listar()
    for (const paciente of pacientes) {
        const consultas = await agendaRepository.listarPorPaciente(paciente.id)
        if (consultas.length === 0) {
            await notificacoesService.createNotificacao(
                paciente.tenantId,
                paciente.psicologoId,
                "Paciente sem sessão",
                `${paciente.nome} não possui sessão agendada`,
                `/pacientes/${paciente.id}`,
                "paciente_sem_sessao_marcada"
            )
        }
    }
}

module.exports = {
    pacienteCriado,
    verificarPacientesSemSessao,
    verificarPacientesSemSessaoMarcada,
}