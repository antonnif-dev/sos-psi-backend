const notificacoesService = require("../services/notificacoes.service");
const agendaNotificacaoService = require("../services/agendaNotificacao.service");

async function consultaCriada(tenantId, consulta) {
    if (!consulta.psicologoId) return
    await notificacoesService.createNotificacao(
        tenantId,
        consulta.psicologoId,
        "Nova consulta agendada",
        `Consulta agendada para ${new Date(consulta.data).toLocaleString("pt-BR")}`,
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
        `A sessão das ${new Date(consulta.data).toLocaleTimeString("pt-BR")} foi finalizada`,
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
        `A consulta das ${new Date(consulta.data).toLocaleTimeString("pt-BR")} foi cancelada`,
        "/agenda",
        "agenda"
    )
}

async function sessaoCriada(sessao) {
  await agendaNotificacaoService.notificarCriacaoSessao(sessao);
}

module.exports = {
    consultaCriada,
    consultaFinalizada,
    consultaCancelada,
    sessaoCriada
}