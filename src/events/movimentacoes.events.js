const { notify } =
    require("../services/notificationEngine.service");

const tenantService =
    require("../services/tenant.service");

async function movimentacaoCriada(
    tenantId,
    movimentacao,
    processo
) {

    const tenant =
        await tenantService.buscarTenant(
            tenantId
        );

    await notify({

        tenantId,

        userId:
            processo.responsavelUid,

        type:
            "MOVIMENTACAO_PROCESSUAL",

        data: {

            processo:
                processo.numeroProcesso,

            descricao:
                movimentacao.nome,

            dataMovimentacao:
                movimentacao.dataHora,

            segmento:
                tenant.segmento

        }

    });

}

module.exports = {
    movimentacaoCriada
};