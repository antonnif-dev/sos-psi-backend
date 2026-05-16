const { db } = require("../config/firebase");

async function buscarPorUid(tenantId, uid) {
    const doc = await db
        .collection("tenants")
        .doc(tenantId)
        .collection("usuarios")
        .doc(uid)
        .get();

    if (!doc.exists) return null;

    return {
        id: doc.id,
        ...doc.data()
    };
}

async function listarUsuarios(tenantId) {

    const snapshot = await db
        .collection("tenants")
        .doc(tenantId)
        .collection("usuarios")
        .get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

module.exports = {
    buscarPorUid,
    listarUsuarios
};