const service = require("../services/documentos.service");
const { incrementarUso } = require("../repositories/uso.repository");
const { uploadToCloudinary } = require("../services/cloudinary.service");

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

const uploadDocumento = async (req, res) => {
    try {
        if (!req.tenantId) {

            return res.status(400).json({
                erro: "Tenant não identificado"
            });

        }
        if (!req.file) {
            return res.status(400).json({
                erro: "Arquivo não enviado",
            });
        }

        const data = new Date();

        const ano = data.getFullYear();

        const mes = String(
            data.getMonth() + 1
        ).padStart(2, "0");

        const pastaCloudinary =
            `tenants/${req.tenantId}/documentos/${ano}/${mes}`;

        const resultado =
            await uploadToCloudinary(
                req.file.buffer,
                pastaCloudinary
            );

        const documento = {
            nome:
                req.body.nome?.trim() ||
                req.file.originalname,

            url: resultado.secure_url,

            publicId:
                resultado.public_id,

            tipo:
                req.file.mimetype,

            tamanho:
                req.file.size,

            criadoPor: {

                uid: req.user.uid,

                nome:
                    req.user.name ||
                    req.user.nome ||
                    "Usuário",

                email:
                    req.user.email || ""

            },

            criadoEm: new Date()

        };

        const id =
            await service.criarDocumento(
                req.tenantId,
                documento
            );

        return res.status(201).json({
            id,
            ...documento
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            erro: "Erro ao fazer upload",
        });
    }

};

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
    uploadDocumento,
    deletarDocumento
};