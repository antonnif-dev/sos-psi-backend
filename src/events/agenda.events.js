const notificacoesService = require("../services/notificacoes.service");
const agendaNotificacaoService = require("../services/agendaNotificacao.service");
const { formatDateTimeBR, formatTimeBR } = require("../utils/dateUtils");
const { notify } = require("../services/notificationEngine.service");

async function consultaCriada(tenantId, consulta) {

    if (!consulta.psicologoId) return

    await notify({
        tenantId,
        userId: consulta.psicologoId,
        type: "CONSULTA_CRIADA",
        data: {
            nome: consulta.pacienteNome,
            data: formatDateTimeBR(consulta.data)
        }
    })
}

async function consultaFinalizada(tenantId, consulta) {
    if (!consulta.psicologoId) return

    await notify({
        tenantId,
        userId: consulta.psicologoId,
        type: "CONSULTA_FINALIZADA",
        data: {
            hora: formatTimeBR(consulta.data)
        }
    })

    const pagamentos = await financeiroRepo.listarPagamentos(tenantId)

    const jaExiste = pagamentos.find(
        p => p.consultaId === consulta.id
    )
    if (jaExiste) return
    await financeiroRepo.criarPagamento(tenantId, {
        consultaId: consulta.id,
        pacienteId: consulta.pacienteId,
        pacienteNome: consulta.pacienteNome,
        dataSessao: consulta.data,
        valor: consulta.valor || 0,
        status: "em_aberto",
        origem: "consulta"
    })
}

async function consultaCancelada(tenantId, consulta) {
    if (!consulta.psicologoId) return

    await notify({
        tenantId,
        userId: consulta.psicologoId,
        type: "CONSULTA_CANCELADA",
        data: {
            hora: formatTimeBR(consulta.data)
        }
    })
}

async function sessaoCriada(sessao) {
    await agendaNotificacaoService.notificarCriacaoSessao(sessao);
}

async function verificarSessoesDoDia() {
    const hoje = new Date().toISOString().split("T")[0]
    const consultas = await agendaRepository.listar()
    const consultasHoje = consultas.filter(c =>
        c.data.startsWith(hoje)
    )
    if (!consultasHoje.length) return

    const consulta = consultasHoje[0]
    await notificacoesService.createNotificacao(
        consulta.tenantId,
        consulta.psicologoId,
        "Sessões de hoje",
        `Você possui ${consultasHoje.length} sessões hoje`,
        "/agenda",
        "sessoes_do_dia"
    )
}

async function verificarSessoesDoDia() {

    const hoje = new Date().toISOString().split("T")[0]
    const consultas = await agendaRepository.listar()

    const hojeConsultas = consultas.filter(c =>
        c.data.startsWith(hoje)
    )

    if (!hojeConsultas.length) return

    const c = hojeConsultas[0]

    await notify({
        tenantId: c.tenantId,
        userId: c.psicologoId,
        type: "SESSOES_DO_DIA",
        data: {
            total: hojeConsultas.length
        }
    })
}

async function verificarDiaSemAgenda() {

    const hoje = new Date().toISOString().split("T")[0]
    const consultas = await agendaRepository.listar()

    const hojeConsultas = consultas.filter(c =>
        c.data.startsWith(hoje)
    )

    if (hojeConsultas.length === 0 && consultas.length > 0) {

        const c = consultas[0]

        await notify({
            tenantId: c.tenantId,
            userId: c.psicologoId,
            type: "DIA_SEM_AGENDA",
            data: {}
        })
    }
}

module.exports = {
    consultaCriada,
    consultaFinalizada,
    consultaCancelada,
    sessaoCriada,
    verificarSessoesDoDia,
    verificarDiaSemAgenda,
}