const { db } = require("../config/firebase");
const { v4: uuid } = require("uuid");

const COLLECTION = "processos";

async function criarProcesso(tenantId, data) {
    const id = uuid();

    await db
        .collection("tenants")
        .doc(tenantId)
        .collection(COLLECTION)
        .doc(id)
        .set({
            id,
            ...data,
            createdAt: new Date()
        });

    return id;
}

async function listarProcessos(tenantId) {
    const snapshot = await db
        .collection("tenants")
        .doc(tenantId)
        .collection(COLLECTION)
        .get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

async function editarProcesso(tenantId, id, data) {
    await db
        .collection("tenants")
        .doc(tenantId)
        .collection(COLLECTION)
        .doc(id)
        .update({
            ...data,
            updatedAt: new Date()
        });
}

async function deletarProcesso(tenantId, id) {
    await db
        .collection("tenants")
        .doc(tenantId)
        .collection(COLLECTION)
        .doc(id)
        .delete();
}

async function buscarPorId(
    tenantId,
    id
) {

    const doc = await db
        .collection("tenants")
        .doc(tenantId)
        .collection(COLLECTION)
        .doc(id)
        .get();

    if (!doc.exists) {
        return null;
    }

    return doc.data();
}

async function atualizarUltimaSincronizacao(
    tenantId,
    processoId
) {

    await db
        .collection("tenants")
        .doc(tenantId)
        .collection(COLLECTION)
        .doc(processoId)
        .update({

            ultimaSincronizacao:
                new Date()

        });

}

module.exports = {
    criarProcesso,
    listarProcessos,
    editarProcesso,
    deletarProcesso,
    buscarPorId,
    atualizarUltimaSincronizacao
};