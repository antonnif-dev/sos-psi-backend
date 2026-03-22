const { db } = require("../config/firebase")

async function getNotificacoes(tenantId, userId) {

    const snapshot = await db
        .collection("tenants")
        .doc(tenantId)
        .collection("notificacoes")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .limit(20)
        .get()

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
}

async function getUnreadCount(tenantId, userId) {

    const snapshot = await db
        .collection("tenants")
        .doc(tenantId)
        .collection("notificacoes")
        .where("userId", "==", userId)
        .where("read", "==", false)
        .get()

    return snapshot.size
}

async function markAsRead(tenantId, id) {

    await db
        .collection("tenants")
        .doc(tenantId)
        .collection("notificacoes")
        .doc(id)
        .update({
            read: true
        })

}

async function createNotificacao(data) {

    const { tenantId } = data

    await db
        .collection("tenants")
        .doc(tenantId)
        .collection("notificacoes")
        .add({
            ...data,
            read: false,
            createdAt: new Date()
        })

}

module.exports = {
    getNotificacoes,
    getUnreadCount,
    markAsRead,
    createNotificacao
}