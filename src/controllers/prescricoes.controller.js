const service = require("../services/prescricoes.service");

async function buscarTemplate(req, res) {
    try {
        console.log("Sintoma recebido:", req.query.sintoma);
        const { sintoma } = req.query
        const template = await service.buscarTemplate(sintoma)
        console.log("Template encontrado:", template);
        res.json(template)

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

async function criarPrescricao(req, res) {
    try {

        const id = await service.criarPrescricao(
            req.tenantId,
            req.body
        );

        res.json({ id });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function listarPorPaciente(req, res) {

    try {

        const prescricoes = await service.listarPorPaciente(
            req.tenantId,
            req.params.pacienteId
        );

        res.json(prescricoes);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function deletarPrescricao(req, res) {

    try {

        await service.deletarPrescricao(
            req.tenantId,
            req.params.id
        );

        res.json({ success: true });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function assinarPrescricao(req, res) {
    try {

        const result = await service.assinarPrescricao(
            req.tenantId,
            req.params.id,
            req.body.imagem
        );

        res.json(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function enviarParaAssinatura(req, res) {
    try {

        console.log("REQ PARAMS:", req.params)

        const { id } = req.params
        const tenantId = req.user.tenantId

        console.log("TENANT:", tenantId)
        console.log("PRESCRICAO ID:", id)

        const link = await service.enviarParaAssinatura(tenantId, id)

        return res.json({ link })

    } catch (error) {

        console.error("ERRO ASSINATURA CONTROLLER:", error)

        return res.status(400).json({
            error: error.message
        })
    }
}

module.exports = {
    criarPrescricao,
    listarPorPaciente,
    deletarPrescricao,
    buscarTemplate,
    assinarPrescricao,
    enviarParaAssinatura
};