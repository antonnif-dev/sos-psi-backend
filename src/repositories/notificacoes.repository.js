//const db = require("../config/database")

async function create(notificacao) {
  const result = await db("notificacoes")
    .insert(notificacao)
    .returning("*")
  return result[0]
}

async function getByUser(userId){
  return await db("notificacoes")
    .where({ user_id: userId })
    .orderBy("read", "asc")
    .orderBy("created_at", "desc")
    .limit(20)
}

async function getUnreadCount(userId){
  const result = await db("notificacoes")
    .where({ user_id: userId, read: false })
    .count()
  return result[0].count
}

async function markAsRead(id){
  return await db("notificacoes")
    .where({ id })
    .update({ read: true })
}

module.exports = {
  create,
  getByUser,
  getUnreadCount,
  markAsRead
}