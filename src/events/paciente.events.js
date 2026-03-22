const notificacoesService = require("../services/notificacoes.service")

async function pacienteCriado(tenantId, paciente) {
    if (!paciente.psicologoId) return
    
    await notificacoesService.createNotificacao(
        tenantId,
        paciente.psicologoId,
        "Novo paciente cadastrado",
        `${paciente.nome} foi cadastrado no sistema`,
        "/pacientes",
        "paciente"
    )
}

module.exports = {
    pacienteCriado
}