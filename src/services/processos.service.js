const repo = require("../repositories/processos.repository");
const datajudService = require("./datajud.service");
const movimentacaoRepo = require("../repositories/movimentacoes.repository");
const prazoService = require("./prazo.service");
const { gerarPrazo } = require("./prazoDetector.service");
const prazoRepo = require("../repositories/prazo.repository");
const movimentacaoEvents = require("../events/movimentacoes.events");

async function listarProcessos(tenantId) {
    return repo.listarProcessos(tenantId);
}

async function criarProcesso(tenantId, data) {
    if (!data.titulo) {
        throw new Error("Título obrigatório");
    }

    console.log(
        "[CRIAR PROCESSO] Validando DataJud"
    );

    const numeroProcessoNormalizado =
        data.numeroProcesso
            .replace(/\D/g, "");

    console.log(
        "[CRIAR PROCESSO] Número original:",
        data.numeroProcesso
    );

    console.log(
        "[CRIAR PROCESSO] Número normalizado:",
        numeroProcessoNormalizado
    );

    const dados =
        await datajudService.buscarProcesso(
            numeroProcessoNormalizado,
            data.tribunal
        );

    if (!dados) {

        throw new Error(
            "Processo não encontrado no DataJud"
        );

    }

    data.classe =
        dados.classe?.nome;

    data.assunto =
        dados.assuntos?.[0]?.nome;

    data.ultimaMovimentacao =
        dados.movimentos?.[0]?.nome;

    console.log(
        "[CRIAR PROCESSO] Processo validado"
    );

    data.numeroProcesso =
        numeroProcessoNormalizado;

    return repo.criarProcesso(tenantId, data);
}

async function editarProcesso(tenantId, id, data) {
    if (!id) {
        throw new Error("Processo inválido");
    }

    await repo.editarProcesso(tenantId, id, data);
}

async function deletarProcesso(tenantId, id) {
    if (!id) {
        throw new Error("Processo inválido");
    }

    await repo.deletarProcesso(tenantId, id);
}

async function sincronizarProcesso(tenantId, processoId) {

    const processo =
        await repo.buscarPorId(
            tenantId,
            processoId
        );

    if (!processo) {
        throw new Error(
            "Processo não encontrado"
        );
    }

    if (
        !processo.numeroProcesso ||
        !processo.tribunal
    ) {
        throw new Error(
            "Processo sem número ou tribunal"
        );
    }

    const dados =
        await datajudService.buscarProcesso(
            processo.numeroProcesso,
            processo.tribunal
        );

    if (!dados) {
        throw new Error(
            "Processo não encontrado no DataJud"
        );
    }

    const movimentacoes =
        dados.movimentos || [];

    for (const mov of movimentacoes) {

        const existe =
            await movimentacaoRepo.existeMovimentacao(
                tenantId,
                processoId,
                mov.codigo,
                mov.dataHora
            );

        if (existe) {
            continue;
        }

        await movimentacaoRepo.criarMovimentacao(
            tenantId,
            processoId,
            mov
        );

        await movimentacaoEvents
            .movimentacaoCriada(
                tenantId,
                mov,
                processo
            );

        console.log(
            "MOVIMENTAÇÃO:",
            mov.nome
        );

        try {

            const prazo =
                gerarPrazo(
                    mov,
                    processo
                );

            if (!prazo) {

                console.log(
                    "[PRAZO] Nenhum prazo detectado"
                );

                continue;
            }

            const existePrazo =
                await prazoRepo
                    .existePrazo(
                        tenantId,
                        processo.id,
                        prazo.descricao
                    );

            if (existePrazo) {

                console.log(
                    "[PRAZO] Já existe"
                );

                continue;
            }

            console.log(
                "[PRAZO] Criando:",
                prazo
            );
            console.log(
                "[PRAZO] ANTES DE CRIAR"
            );
            console.log(
                prazo
            );
            await prazoService
                .criarPrazo(
                    tenantId,
                    prazo
                );
            console.log(
                "[PRAZO] DEPOIS DE CRIAR"
            );
            console.log(
                "[PRAZO] Criado com sucesso"
            );

        } catch (error) {

            console.error(
                "[PRAZO] ERRO:"
            );

            console.error(error);

        }

    }

    await repo
        .atualizarUltimaSincronizacao(
            tenantId,
            processoId
        );

    return {
        total:
            movimentacoes.length
    };
}

async function sincronizarTodosProcessos() {

    const tenants =
        await tenantRepo.listar();

    for (const tenant of tenants) {

        const processos =
            await processoRepo.listarAtivos(
                tenant.id
            );

        for (const processo of processos) {

            try {

                await sincronizarProcesso(
                    tenant.id,
                    processo.id
                );

            } catch (error) {

                console.error(error);

            }

        }

    }

}

module.exports = {
    listarProcessos,
    criarProcesso,
    editarProcesso,
    deletarProcesso,
    sincronizarProcesso,
    sincronizarTodosProcessos
};