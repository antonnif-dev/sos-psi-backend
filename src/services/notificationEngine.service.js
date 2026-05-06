const notificacoesService = require("./notificacoes.service");
const templates = require("../config/notificationTemplates");
const repo = require("../repositories/notificacoes.repository");

async function jaExiste({ tenantId, userId, type }) {
    if (!tenantId || !userId || !type) return false;

    const lista = await repo.getNotificacoes(tenantId, userId);

    return lista.some(n => n.type === type && !n.read);
}

async function notify({ tenantId, userId, type, data }) {
    try {
        const template = templates[type];

        if (!template) {
            console.warn("Template não encontrado:", type);
            return;
        }

        const title = template.title(data);
        const message = template.message(data);
        const link = template.link(data);
        console.log("DATA ENVIADA:", data);

        await notificacoesService.createNotificacao(
            tenantId,
            userId,
            title,
            message,
            link,
            type
        );

        console.log("Notificação criada com sucesso");

    } catch (error) {
        console.error("Erro ao disparar notificação:", error);
    }
}

module.exports = { notify }