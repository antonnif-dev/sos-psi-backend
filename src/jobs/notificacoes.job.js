const cron = require("node-cron")

const notificacoesService = require("../services/notificacoes.service");
const agendaRepository = require("../repositories/agenda.repository");
const pacientesRepository = require("../repositories/pacientes.repository");

console.log("Jobs de notificações iniciados");

cron.schedule("* * * * *", async () => {
    const consultas = await agendaRepository.listar()
    const agora = new Date()

    for (const consulta of consultas) {
        const inicio = new Date(consulta.data)
        const diffMin = (inicio - agora) / 1000 / 60

        if (diffMin <= 60 && diffMin > 59) {
            await notificacoesService.createNotificacao(
                consulta.tenantId,
                consulta.psicologoId,
                "Sessão em breve",
                `Sessão com ${consulta.pacienteNome} começa em 1 hora`,
                "/agenda",
                "sessao_proxima"
            )
        }
    }
})

cron.schedule("0 6 * * *", async () => {
    await verificarPacientesSemSessao()
    await verificarPacientesSemSessaoMarcada()
    await verificarSessoesDoDia()
    await verificarDiaSemAgenda()
})
