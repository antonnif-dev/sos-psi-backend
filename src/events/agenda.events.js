const notificacoesService = require("../services/notificacoes.service");
const agendaNotificacaoService = require("../services/agendaNotificacao.service");
const { formatDateTimeBR, formatTimeBR } = require("../utils/dateUtils")

async function consultaCriada(tenantId, consulta) {
    if (!consulta.psicologoId) return
    await notificacoesService.createNotificacao(
        tenantId,
        consulta.psicologoId,
        "Nova consulta agendada",
        `Consulta agendada para ${formatDateTimeBR(consulta.data)}`,
        "/agenda",
        "agenda"
    )
}

async function consultaFinalizada(tenantId, consulta) {
    if (!consulta.psicologoId) return
    await notificacoesService.createNotificacao(
        tenantId,
        consulta.psicologoId,
        "Sessão finalizada",
        `A sessão das ${formatTimeBR(consulta.data)} foi finalizada`,
        "/agenda",
        "agenda"
    )

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
    await notificacoesService.createNotificacao(
        tenantId,
        consulta.psicologoId,
        "Consulta cancelada",
        `A consulta das ${formatTimeBR(consulta.data)} foi cancelada`,
        "/agenda",
        "agenda"
    )
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

async function verificarDiaSemAgenda() {
    const hoje = new Date().toISOString().split("T")[0]
    const consultas = await agendaRepository.listar()
    const hojeConsultas = consultas.filter(c =>
        c.data.startsWith(hoje)
    )

    if (hojeConsultas.length === 0) {
        const consulta = consultas[0]
        await notificacoesService.createNotificacao(
            consulta.tenantId,
            consulta.psicologoId,
            "Dia sem agenda",
            "Hoje você não possui sessões agendadas",
            "/agenda",
            "dia_sem_agenda"
        )
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