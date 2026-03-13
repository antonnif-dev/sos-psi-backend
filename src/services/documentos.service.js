const repo = require("../repositories/documentos.repository");
const cloudinary = require("../config/cloudinary");

async function listarDocumentos(tenantId) {
    return repo.listarDocumentos(tenantId);
}

async function criarDocumento(tenantId, file) {
    if (!file) {
        throw new Error("Arquivo obrigatório");
    }
    const upload = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        { folder: "documentos" }
    );
    const data = {
        nome: file.originalname,
        url: upload.secure_url
    };
    return repo.criarDocumento(tenantId, data);
}

async function deletarDocumento(tenantId, id) {
    await repo.deletarDocumento(tenantId, id);
}

module.exports = {
    listarDocumentos,
    criarDocumento,
    deletarDocumento
};