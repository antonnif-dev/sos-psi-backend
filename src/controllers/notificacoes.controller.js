const service = require("../services/notificacoes.service")

async function getNotificacoes(req, res){
  const userId = req.user.uid
  const notificacoes = await service.getNotificacoes(userId)
  res.json(notificacoes)
}

async function getUnreadCount(req, res){
  const userId = req.user.uid
  const count = await service.getUnreadCount(userId)
  res.json({ count })
}

async function markAsRead(req, res){
  const { id } = req.params
  await service.markAsRead(id)
  res.json({ success: true })
}

module.exports = {
  getNotificacoes,
  getUnreadCount,
  markAsRead
}