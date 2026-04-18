const service = require("../services/notificacoes.service")

async function getNotificacoes(req, res) {
    try {

        console.log("TENANT:", req.tenantId)
        console.log("USER:", req.user)

        if (!req.user?.uid) {
            return res.status(400).json({ error: "User inválido" })
        }

        if (!req.tenantId) {
            return res.status(400).json({ error: "Tenant inválido" })
        }

        const data = await service.getNotificacoes(
            req.tenantId,
            req.user.uid
        )

        res.json(data)

    } catch (error) {
        console.error("ERRO REAL:", error)
        res.status(500).json({ error: error.message })
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