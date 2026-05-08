const notificacoesService = require("../services/notificacoes.service");
const { notify } = require("../services/notificationEngine.service");
const agendaNotificacaoService = require("../services/agendaNotificacao.service");
const tenantService = require("../services/tenant.service");
const financeiroRepo = require("../repositories/financeiro.repository");
const agendaRepository = require("../repositories/agenda.repository");
const { formatDateTimeBR, formatTimeBR } = require("../utils/dateUtils");

async function consultaCriada(tenantId, consulta) {
    const tenant = await tenantService.buscarTenant(tenantId);
    if (!consulta.psicologoId) return;

    await notify({
        tenantId,
        userId: consulta.psicologoId,
        type: "CONSULTA_CRIADA",
        data: {
            nome: consulta.pacienteNome,
            data: formatDateTimeBR(consulta.data),
            segmento: tenant.segmento
        }
    })
}

async function consultaFinalizada(tenantId, consulta) {
    if (!consulta.psicologoId) return;
    const tenant = await tenantService.buscarTenant(tenantId);

    await notify({
        tenantId,
        userId: consulta.psicologoId,
        type: "CONSULTA_FINALIZADA",
        data: {
            hora: formatTimeBR(consulta.data),
            segmento: tenant.segmento
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
    if (!consulta.psicologoId) return;
    const tenant = await tenantService.buscarTenant(tenantId);

    await notify({
        tenantId,
        userId: consulta.psicologoId,
        type: "CONSULTA_CANCELADA",
        data: {
            hora: formatTimeBR(consulta.data),
            segmento: tenant.segmento
        }
    })
}

async function sessaoCriada(tenantId, sessao) {

    if (!sessao.psicologoId) return;
    const tenant = await tenantService.buscarTenant(tenantId);

    await notify({
        tenantId,
        userId: sessao.psicologoId,
        type: "CONSULTA_CRIADA",
        data: {
            nome: sessao.pacienteNome,
            data: formatDateTimeBR(sessao.data),
            segmento: tenant.segmento
        }
    });

    await agendaNotificacaoService.notificarCriacaoSessao(sessao);
}

async function verificarSessoesDoDia(tenantId) {

    console.log("\n==============================");
    console.log("🔔 verificarSessoesDoDia");
    console.log("TENANT:", tenantId);

    const hoje = new Date().toISOString().split("T")[0];

    console.log("DATA HOJE:", hoje);

    const consultas = await agendaRepository.listarConsultas(tenantId);

    console.log("CONSULTAS ENCONTRADAS:", consultas.length);

    consultas.forEach((c, i) => {
        console.log(`CONSULTA ${i + 1}:`, {
            id: c.id,
            data: c.data,
            psicologoId: c.psicologoId,
            pacienteNome: c.pacienteNome
        });
    });

    const hojeConsultas = consultas.filter(c => {

        console.log("VALIDANDO DATA:", c.data);

        if (!c.data) return false;

        const dataConsulta =
            c.data.toDate
                ? c.data.toDate().toISOString().split("T")[0]
                : new Date(c.data).toISOString().split("T")[0];

        console.log("DATA FORMATADA:", dataConsulta);

        return dataConsulta === hoje;
    });

    console.log("CONSULTAS DE HOJE:", hojeConsultas.length);

    if (!hojeConsultas.length) {
        console.log("❌ Nenhuma consulta hoje");
        return;
    }

    const c = hojeConsultas[0];

    console.log("CONSULTA ESCOLHIDA:", c);

    const tenant = await tenantService.buscarTenant(tenantId);

    console.log("TENANT ENCONTRADO:", tenant);

    console.log("ENVIANDO NOTIFICAÇÃO...");

    await notify({
        tenantId,
        userId: c.psicologoId,
        type: "SESSOES_DO_DIA",
        data: {
            total: hojeConsultas.length,
            segmento: tenant.segmento
        }
    });

    console.log("✅ NOTIFICAÇÃO ENVIADA");
}

async function verificarDiaSemAgenda(tenantId) {

    const hoje = new Date().toISOString().split("T")[0];

    const consultas = await agendaRepository.listarConsultas(tenantId);

    const hojeConsultas = consultas.filter(c =>
        c.data.startsWith(hoje)
    );

    if (hojeConsultas.length === 0 && consultas.length > 0) {

        const c = consultas[0];
        const tenant = await tenantService.buscarTenant(tenantId);

        await notify({
            tenantId,
            userId: c.psicologoId,
            type: "DIA_SEM_AGENDA",
            data: {
                segmento: tenant.segmento
            }
        });
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