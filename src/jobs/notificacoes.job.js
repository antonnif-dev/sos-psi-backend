const cron = require("node-cron");
const { db } = require("../config/firebase");
const agendaRepository = require("../repositories/agenda.repository");
const { notify } = require("../services/notificationEngine.service");
const tenantService = require("../services/tenant.service");

console.log("Jobs de notificações iniciados");

const job = async () => {
    try {
        const tenantsSnap = await db.collection("tenants").get();

        for (const tenantDoc of tenantsSnap.docs) {
            const tenantId = tenantDoc.id;
            const tenant = await tenantService.buscarTenant(tenantId);
            const consultas = await agendaRepository.listarConsultas(tenantId);
            const agora = new Date();

            for (const consulta of consultas) {
                if (!consulta.psicologoId) continue;
                if (consulta.notificacaoEnviada) continue;
                if (!consulta.data) continue;

                const inicio = new Date(consulta.data);
                const diffMin = (inicio - agora) / 1000 / 60;


                if (diffMin <= 60 && diffMin > 59) {
                    await notify({
                        tenantId,
                        userId: consulta.psicologoId,
                        type: "SESSAO_PROXIMA",
                        data: {
                            nome: consulta.pacienteNome,
                            segmento: tenant.segmento
                        }
                    });

                    await db
                        .collection("tenants")
                        .doc(tenantId)
                        .collection("agenda")
                        .doc(consulta.id)
                        .update({
                            notificacaoEnviada: true
                        });
                }
            }
        }
    } catch (err) {
        console.error("Erro no job de notificações:", err);
    }
};

cron.schedule("* * * * *", job);

const {
    verificarSessoesDoDia,
    verificarDiaSemAgenda
} = require("../events/agenda.events");

const {
    verificarPacientesSemSessao,
    verificarPacientesSemSessaoMarcada
} = require("../events/paciente.events");

cron.schedule("0 6 * * *", async () => {
    console.log("⏰ CRON DAS 6H DISPAROU");

    const tenantsSnap = await db.collection("tenants").get();

    for (const tenantDoc of tenantsSnap.docs) {
        const tenantId = tenantDoc.id;

        await verificarPacientesSemSessao(tenantId);
        await verificarPacientesSemSessaoMarcada(tenantId);
        await verificarSessoesDoDia(tenantId);
        await verificarDiaSemAgenda(tenantId);
    }

});
