const repo = require("../repositories/notificacoes.repository");
const emailService = require("./email.service");

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

async function enviar({ telefone, mensagem }) {
    console.log("Enviando mensagem para:", telefone);
    console.log(mensagem);
}

async function enviarWhatsapp(telefone, mensagem) {
    console.log("WHATSAPP ->", telefone);
    console.log(mensagem);
}

async function enviarEmail({ email, assunto, mensagem }) {
  await emailService.enviarEmail({
    para: email,
    assunto: assunto,
    html: `<p>${mensagem}</p>`
  });
}

module.exports = {
    getNotificacoes,
    getUnreadCount,
    markAsRead,
    createNotificacao,
    enviar,
    enviarWhatsapp,
    enviarEmail
}