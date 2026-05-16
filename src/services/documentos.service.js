const repo = require("../repositories/documentos.repository");
const cloudinary = require("../config/cloudinary");

async function listarDocumentos(tenantId) {
    return repo.listarDocumentos(tenantId);
}

async function criarDocumento(tenantId, documento) {
    if (!documento) {
        throw new Error("Arquivo obrigatório");
    }
    const upload = await cloudinary.uploader.upload(
        `data:${documento.mimetype};base64,${documento.buffer.toString("base64")}`,
        { folder: "documentos" }
    );
    const tamanhoMb = documento.size / (1024 * 1024);

    const data = {
        nome: documento.originalname,
        url: upload.secure_url,
        tamanhoMb
    };
    return repo.criarDocumento(tenantId, data);
}

async function deletarDocumento(tenantId, id) {
    await repo.deletarDocumento(tenantId, id);
}

async function buscarPorId(tenantId, id) {
    return repo.buscarPorId(tenantId, id);
}

module.exports = {
    listarDocumentos,
    criarDocumento,
    deletarDocumento,
    buscarPorId
};