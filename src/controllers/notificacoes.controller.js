const service = require("../services/notificacoes.service")

async function getNotificacoes(req, res) {
    console.log("TENANT:", req.tenantId)
    console.log("USER:", req.user?.uid)
    console.log("TOKEN COMPLETO:", req.user)
    try {

        const data = await service.getNotificacoes(
            req.tenantId,
            req.user.uid
        )

        res.json(data)

    } catch (error) {
        console.error("erro notificacoes:", error)
        res.status(500).json({ error: "Erro ao buscar notificações" })
    }
}

async function getUnreadCount(req, res) {

    try {

        const count = await service.getUnreadCount(
            req.tenantId,
            req.user.uid
        )

        res.json({ count })

    } catch (error) {
        console.error("erro unread count:", error)
        res.status(500).json({ error: "Erro unread count" })
    }
}

async function markAsRead(req, res) {

    try {

        await service.markAsRead(
            req.tenantId,
            req.params.id
        )

        res.json({ success: true })

    } catch (error) {
        console.error("erro mark read:", error)
        res.status(500).json({ error: "Erro atualizar notificação" })
    }
}

module.exports = {
    getNotificacoes,
    getUnreadCount,
    markAsRead
}