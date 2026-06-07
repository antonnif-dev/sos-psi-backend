const axios = require("axios");

class DatajudService {

    async buscarProcesso(numeroProcesso, tribunal) {
        console.log("CONSULTANDO:", numeroProcesso);
        console.log("TRIBUNAL:", tribunal);
        const response = await axios.post(
            `https://api-publica.datajud.cnj.jus.br/api_publica_${tribunal}/_search`,
            {
                query: {
                    match: {
                        numeroProcesso
                    }
                }
            },
            {
                headers: {
                    Authorization: `APIKey ${process.env.DATAJUD_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );
        console.log(
            "RESPOSTA DATAJUD:"
        );

        console.log(
            JSON.stringify(
                response.data,
                null,
                2
            )
        );

        return response.data.hits.hits[0]?._source || null;
        console.log(response.data);
    }

    async buscarMovimentacoes(numeroProcesso, tribunal) {

        const processo =
            await this.buscarProcesso(
                numeroProcesso,
                tribunal
            );

        return processo?.movimentos || [];
    }

    async buscarProcessoFormatado(
        numeroProcesso,
        tribunal
    ) {

        const processo =
            await this.buscarProcesso(
                numeroProcesso,
                tribunal
            );

        return {

            numeroProcesso:
                processo.numeroProcesso,

            tribunal:
                processo.tribunal,

            classe:
                processo.classe?.nome,

            assunto:
                processo.assuntos?.[0]?.nome,

            ultimaAtualizacao:
                processo.dataHoraUltimaAtualizacao,

            movimentacoes:
                processo.movimentos || []
        };
    }
}

module.exports = new DatajudService();