const repo = require("../repositories/notificacoes.repository")

async function getNotificacoes(tenantId, userId) {
    return await repo.getNotificacoes(tenantId, userId)
}

async function getUnreadCount(tenantId, userId) {
    return await repo.getUnreadCount(tenantId, userId)
}

async function markAsRead(tenantId, id) {
    return await repo.markAsRead(tenantId, id)
}

async function createNotificacao(tenantId, userId, title, message, link, type) {

    return await repo.createNotificacao({
        tenantId,
        userId,
        title,
        message,
        link,
        type
    })

}

module.exports = {
    getNotificacoes,
    getUnreadCount,
    markAsRead,
    createNotificacao
}