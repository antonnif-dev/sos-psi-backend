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

module.exports = {
    buscarPorUid
};