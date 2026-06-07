const datajudService = require("../services/datajud.service");

class DatajudController {

    async buscar(req, res) {

        try {

            const { numeroProcesso, tribunal } = req.params;

            const dados =
                await datajudService.buscarProcesso(
                    numeroProcesso,
                    tribunal
                );

            return res.json(dados);

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                erro: error.message
            });
        }
    }

    async movimentacoes(req, res) {

        const {
            numeroProcesso,
            tribunal
        } = req.params;

        const movimentacoes =
            await datajudService.buscarMovimentacoes(
                numeroProcesso,
                tribunal
            );

        return res.json(movimentacoes);
    }
}

module.exports = new DatajudController();