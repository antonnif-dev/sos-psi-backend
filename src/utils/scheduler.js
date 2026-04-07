const cron = require("node-cron");
const agendaNotificacaoService = require("../services/agendaNotificacao.service");

function iniciarScheduler() {

  cron.schedule("* * * * *", async () => {
    await agendaNotificacaoService.enviarLembretes();
  });

}

module.exports = {
  iniciarScheduler,
};