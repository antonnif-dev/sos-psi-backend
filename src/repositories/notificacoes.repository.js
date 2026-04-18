const { db } = require("../config/firebase");

async function migrarReadAt(tenantId) {

    const snapshot = await db
        .collection("tenants")
        .doc(tenantId)
        .collection("notificacoes")
        .get()

    const batch = db.batch()

    snapshot.docs.forEach(doc => {
        const data = doc.data()

        // se NÃO tem readAt
        if (data.readAt === undefined) {

            let readAt = null

            // se já estava lida → assume createdAt
            if (data.read === true) {
                readAt = data.createdAt || new Date()
            }

            batch.update(doc.ref, { readAt })
        }
    })

    await batch.commit()

    console.log("✅ Migração de readAt concluída")
}

/*
async function limparNotificacoesAntigas(tenantId) {

    const tresDiasAtras = new Date()
    // limitar os dias
    tresDiasAtras.setDate(tresDiasAtras.getDate() - 3)

    const snapshot = await db
        .collection("tenants")
        .doc(tenantId)
        .collection("notificacoes")
        .where("read", "==", true)
        .where("readAt", "<=", tresDiasAtras)
        .get()

    const batch = db.batch()

    snapshot.docs.forEach(doc => {
        batch.delete(doc.ref)
    })

    await batch.commit()

    console.log(`🧹 ${snapshot.size} notificações removidas`)
}
*/
async function getNotificacoes(tenantId, userId) {
    //await limparNotificacoesAntigas(tenantId)

    const snapshot = await db
        .collection("tenants")
        .doc(tenantId)
        .collection("notificacoes")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .limit(50)
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
            read: true,
            readAt: new Date()
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
            readAt: null,
            createdAt: new Date()
        })

}

module.exports = {
    getNotificacoes,
    getUnreadCount,
    markAsRead,
    createNotificacao
}