const cron = require("node-cron");

const agendaNotificacaoService =
  require("../services/agendaNotificacao.service");

const processoRepo =
  require("../repositories/processos.repository");

const processoService =
  require("../services/processos.service");

const { db } =
  require("../config/firebase");

function iniciarScheduler() {

  // Lembretes agenda
  cron.schedule("* * * * *", async () => {

    await agendaNotificacaoService
      .enviarLembretes();

  });

  // DataJud 00:00
  cron.schedule("0 0 * * *", async () => {

    await sincronizarProcessos();

  });

  // DataJud 12:00
  cron.schedule("0 12 * * *", async () => {

    await sincronizarProcessos();

  });

}

async function sincronizarProcessos() {

  console.log(
    "\n=============================="
  );

  console.log(
    "🔄 SINCRONIZAÇÃO AUTOMÁTICA DATAJUD"
  );

  const tenantsSnapshot =
    await db.collection("tenants").get();

  console.log(
    "🏢 Total tenants:",
    tenantsSnapshot.size
  );

  for (const tenantDoc of tenantsSnapshot.docs) {

    const tenantId = tenantDoc.id;

    console.log(
      "\n🏢 Tenant:",
      tenantId
    );

    const processos =
      await processoRepo
        .listarProcessos(
          tenantId
        );

    console.log(
      "📂 Total processos:",
      processos.length
    );

    for (const processo of processos) {

      try {

        console.log(
          "🔍 Sincronizando:",
          processo.numeroProcesso
        );

        await processoService
          .sincronizarProcesso(
            tenantId,
            processo.id
          );

        console.log(
          "✅ Processo sincronizado"
        );

      } catch (error) {

        console.error(
          "❌ Erro processo:",
          processo.id
        );

        console.error(error);

      }

    }

  }

  console.log(
    "\n✅ FIM SINCRONIZAÇÃO AUTOMÁTICA"
  );

}

module.exports = {
  iniciarScheduler
};