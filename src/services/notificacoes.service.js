const repository = require("../repositories/notificacoes.repository")

async function createNotificacao(userId, title, message, link, type){

  return await repository.create({
    user_id: userId,
    title,
    message,
    link,
    type,
    read: false
  })
}

async function getNotificacoes(userId){
  return await repository.getByUser(userId)
}

async function getUnreadCount(userId){
  return await repository.getUnreadCount(userId)
}

async function markAsRead(id){
  return await repository.markAsRead(id)
}

module.exports = {
  createNotificacao,
  getNotificacoes,
  getUnreadCount,
  markAsRead
}