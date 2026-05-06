const notificacoesService = require("../services/notificacoes.service");
const agendaNotificacaoService = require("../services/agendaNotificacao.service");
const { formatDateTimeBR, formatTimeBR } = require("../utils/dateUtils");
const { notify } = require("../services/notificationEngine.service");
const financeiroRepo = require("../repositories/financeiro.repository");
const agendaRepository = require("../repositories/agenda.repository");

async function consultaCriada(tenantId, consulta) {

    if (!consulta.psicologoId) return

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
    if (!consulta.psicologoId) return

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
    if (!consulta.psicologoId) return

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

    await notify({
        tenantId,
        userId: sessao.psicologoId,
        type: "CONSULTA_CRIADA",
        data: {
            nome: sessao.pacienteNome,
            data: formatDateTimeBR(sessao.data)
        }
    });

    await agendaNotificacaoService.notificarCriacaoSessao(sessao);
}

async function verificarSessoesDoDia(tenantId) {

    const hoje = new Date().toISOString().split("T")[0];

    const consultas = await agendaRepository.listarConsultas(tenantId);

    const hojeConsultas = consultas.filter(c =>
        c.data.startsWith(hoje)
    );

    if (!hojeConsultas.length) return;

    const c = hojeConsultas[0];

    await notify({
        tenantId,
        userId: c.psicologoId,
        type: "SESSOES_DO_DIA",
        data: {
            total: hojeConsultas.length,
            segmento: tenant.segmento
        }
    });
}

async function verificarDiaSemAgenda(tenantId) {

    const hoje = new Date().toISOString().split("T")[0];

    const consultas = await agendaRepository.listarConsultas(tenantId);

    const hojeConsultas = consultas.filter(c =>
        c.data.startsWith(hoje)
    );

    if (hojeConsultas.length === 0 && consultas.length > 0) {

        const c = consultas[0];

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