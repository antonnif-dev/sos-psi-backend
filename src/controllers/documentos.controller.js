const service = require("../services/documentos.service");
const { incrementarUso } = require("../repositories/uso.repository");

async function listar(req, res) {
    try {
        const documentos = await service.listarDocumentos(req.tenantId);
        res.json(documentos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function criarDocumento(req, res) {
    try {
        const tamanhoMb = req.file.size / (1024 * 1024);

        const id = await service.criarDocumento(
            req.tenantId,
            req.file
        );

        console.log("📦 SOMANDO USO DE UPLOAD:", tamanhoMb, "MB");

        await incrementarUso(req.tenantId, "uploadMbMesAtual", tamanhoMb);

        res.json({ id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function deletarDocumento(req, res) {
    try {
        await service.deletarDocumento(
            req.tenantId,
            req.params.id
        );
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    listar,
    criarDocumento,
    deletarDocumento
};