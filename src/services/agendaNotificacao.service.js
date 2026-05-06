const pacientesRepository = require("../repositories/pacientes.repository");
const agendaRepository = require("../repositories/agenda.repository");
const notificacoesService = require("./notificacoes.service");
const usuariosRepo = require("../repositories/user.repository");

async function notificarCriacaoSessao(sessao) {
    const paciente = await pacientesRepository.buscarPorId(sessao.tenantId, sessao.pacienteId);
    const psicologo = await usuariosRepo.buscarPorUid(sessao.tenantId, sessao.psicologoId);

    const mensagem = `
Nova sessão agendada

Paciente: ${paciente.nome}
Data: ${sessao.data}
Horário: ${sessao.horario}
`;

    await notificacoesService.enviar({
        telefone: paciente.telefone,
        mensagem,
    });

    await notificacoesService.enviar({
        telefone: psicologo.telefone,
        mensagem,
    });

    await notificacoesService.enviarEmail({
        email: paciente.email,
        assunto: "Sessão agendada",
        mensagem: `
  Olá ${paciente.nome}<br><br>
  Sua sessão foi agendada.<br><br>
  Data: ${sessao.data}<br>
  Horário: ${sessao.horario}
  `
    });

    await notificacoesService.enviarEmail({
        email: psicologo.email,
        assunto: "Nova sessão agendada",
        mensagem: `Sessão agendada para ${paciente.nome} em ${sessao.data}`
    });
    /*
        await notificacoesService.enviarEmail({
            email: paciente.email,
            assunto: "Lembrete de sessão",
            mensagem: mensagem
        });*/
}

async function enviarLembretes() {
    const agora = new Date();

    const sessoes = await agendaRepository.buscarSessoesFuturas();

    for (const sessao of sessoes) {
        //const dataSessao = new Date(sessao.dataHora);
        const dataSessao = new Date(sessao.data);

        const diff = dataSessao - agora;

        //const horas = diff / (1000 * 60 * 60);
        const horas = Math.floor(diff / (1000 * 60 * 60));
        if (!sessao.data) continue;
        if (horas <= 24 && horas > 23.5) {
            await enviarLembrete(sessao, "24h");
        }

        if (horas <= 1 && horas > 0.5) {
            await enviarLembrete(sessao, "1h");
        }
    }
}

async function enviarLembrete(sessao, tipo) {
    const paciente = await pacientesRepository.buscarPorId(sessao.tenantId, sessao.pacienteId);

    const mensagem =
        tipo === "24h"
            ? `Lembrete: você possui sessão amanhã às ${sessao.horario}`
            : `Lembrete: sua sessão começa em 1 hora`;

    await notificacoesService.enviar({
        telefone: paciente.telefone,
        mensagem,
    });
}

module.exports = {
    notificarCriacaoSessao,
    enviarLembretes,
};