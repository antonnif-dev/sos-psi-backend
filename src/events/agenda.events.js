const notificacoesService = require("../services/notificacoes.service")

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

module.exports = {
    consultaCriada,
    consultaFinalizada,
    consultaCancelada
}