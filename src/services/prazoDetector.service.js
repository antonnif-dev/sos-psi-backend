function gerarPrazo(movimentacao, processo) {
    console.log(
        "DATA MOVIMENTO:",
        movimentacao.dataHora
    );

    console.log(
        "MOVIMENTAÇÃO COMPLETA:"
    );

    console.log(
        JSON.stringify(
            movimentacao,
            null,
            2
        )
    );

    try {

        console.log(
            "[PRAZO DETECTOR] Iniciando análise"
        );

        console.log(
            "[PRAZO DETECTOR] Processo:",
            processo.id
        );

        console.log(
            "[PRAZO DETECTOR] Movimentação:",
            movimentacao.nome
        );

        const descricao =
            (
                movimentacao.nome || ""
            ).toLowerCase();

        const regras = [

            {
                termo: "distribuição",
                titulo: "Distribuição",
                dias: 15
            },

            {
                termo: "intimação",
                titulo: "Responder Intimação",
                dias: 15
            },

            {
                termo: "citação",
                titulo: "Prazo de Contestação",
                dias: 15
            },

            {
                termo: "audiência",
                titulo: "Audiência Designada",
                dias: 0
            },

            {
                termo: "sentença",
                titulo: "Analisar Sentença",
                dias: 15
            },

            {
                termo: "despacho",
                titulo: "Analisar Despacho",
                dias: 5
            }

        ];

        for (const regra of regras) {

            if (
                descricao.includes(
                    regra.termo
                )
            ) {

                console.log(
                    "[PRAZO DETECTOR] Regra encontrada:",
                    regra.termo
                );
                /*
                                const data =
                                    new Date();
                
                                data.setDate(
                                    data.getDate() +
                                    regra.dias
                                );
                */

                const data =
                    movimentacao.dataHora
                        ? new Date(movimentacao.dataHora)
                        : new Date();

                data.setDate(
                    data.getDate() +
                    regra.dias
                );

                return {

                    processoId:
                        processo.id,

                    cliente:
                        processo.titulo,

                    descricao:
                        `${regra.titulo} - ${processo.numeroProcesso}`,

                    dataLimite:
                        data
                            .toISOString()
                            .split("T")[0],

                    prioridade:
                        "Alta"

                };

            }

        }

        console.log(
            "[PRAZO DETECTOR] Nenhuma regra encontrada"
        );

        return null;

    } catch (error) {

        console.error(
            "[PRAZO DETECTOR] ERRO:",
            error
        );

        throw error;

    }

}

module.exports = {
    gerarPrazo
};