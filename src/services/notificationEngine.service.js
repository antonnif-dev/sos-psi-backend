const notificacoesService = require("./notificacoes.service");
const templates = require("../config/notificationTemplates");
const repo = require("../repositories/notificacoes.repository");

async function jaExiste({ tenantId, userId, type }) {

    const lista = await repo.getNotificacoes(tenantId, userId)

    return lista.some(n => n.type === type)
}

async function notify({ tenantId, userId, type, data }) {

    const template = templates[type]

    if (!template) {
        console.warn("❌ [2] TEMPLATE NÃO ENCONTRADO:", type)
        return
    }

    const title = template.title(data)
    const message = template.message(data)
    const link = template.link(data)

    console.log("🔵 [5] MONTADO:", { title, message, link })

    await notificacoesService.createNotificacao(
        tenantId,
        userId,
        title,
        message,
        link,
        type
    )
    /*
        console.log("✅ [6] SALVO NO FIRESTORE")
    
        if (template.channels?.includes("email")) {
            console.log("📧 [7] ENVIANDO EMAIL")
            await notificacoesService.enviarEmail({
                email: data.email,
                assunto: title,
                mensagem: message
            })
        }
    
        if (template.channels?.includes("whatsapp")) {
            console.log("📱 [8] ENVIANDO WHATSAPP")
            await notificacoesService.enviarWhatsapp(
                data.telefone,
                message
            )
        }
            */
}

module.exports = { notify }