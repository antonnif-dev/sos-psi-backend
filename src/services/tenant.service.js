const { db } = require("../config/firebase");

async function buscarTenant(tenantId) {
    try {
        const snap = await db.collection("tenants").doc(tenantId).get();

        if (!snap.exists) {
            throw new Error("Tenant não encontrado");
        }

        return {
            id: snap.id,
            ...snap.data()
        };
    } catch (error) {
        console.error("Erro ao buscar tenant:", error);
        throw error;
    }
}

module.exports = {
    buscarTenant
};