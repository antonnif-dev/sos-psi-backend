const repo = require("../repositories/prescricoes.repository");
const templateRepo = require("../repositories/prescricoesTemplates.repository");
const pdfService = require("./pdfPrescricao.service");
const zapSign = require("./zapsign.service");

async function buscarTemplate(sintoma) {
    if (!sintoma) {
        throw new Error("Sintoma obrigatório");
    }
    return await templateRepo.buscarTemplate(sintoma);
}

async function criarPrescricao(tenantId, data) {

    if (!data.pacienteId) {
        throw new Error("Paciente obrigatório");
    }

    if (!data.medicamentos || data.medicamentos.length === 0) {
        throw new Error("Adicione pelo menos um medicamento");
    }

    return await repo.criarPrescricao(tenantId, data);
}

async function listarPorPaciente(tenantId, pacienteId) {

    if (!pacienteId) {
        throw new Error("Paciente inválido");
    }

    return await repo.listarPorPaciente(tenantId, pacienteId);
}

async function deletarPrescricao(tenantId, id) {

    if (!id) {
        throw new Error("Prescrição inválida");
    }

    await repo.deletarPrescricao(tenantId, id);
}

async function assinarPrescricao(tenantId, id, imagem) {

    if (!id) throw new Error("Prescrição inválida")
    if (!imagem) throw new Error("Assinatura inválida")

    await repo.salvarAssinatura(tenantId, id, imagem)

    return { success: true }

}

async function enviarParaAssinatura(tenantId, id) {
    const prescricao = await repo.buscarPorId(tenantId, id)

    if (!prescricao) {
        throw new Error("Prescrição não encontrada")
    }

    const pdfBase64 = await pdfService.gerarPdfPrescricao(prescricao)
    /*
        const doc = await zapSign.criarDocumento(
            pdfBase64,
            prescricao.profissionalNome,
            prescricao.profissionalEmail
        )
    */
    const doc = await zapSign.criarDocumento(
        pdfBase64,
        "Doutor João",
        "administrador@gmail.com"
    )

    await repo.salvarAssinatura(
        tenantId,
        id,
        {
            provider: "zapsign",
            token: doc.token,
            status: "pending",
            signUrl: doc.sign_url
        }
    )
    return doc.sign_url
}

module.exports = {
    criarPrescricao,
    listarPorPaciente,
    deletarPrescricao,
    buscarTemplate,
    assinarPrescricao,
    enviarParaAssinatura
};