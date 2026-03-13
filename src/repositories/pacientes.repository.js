const { db } = require("../config/firebase");
const { v4: uuid } = require("uuid");

async function criarPaciente(tenantId, data) {
    const id = uuid();
    await db
        .collection("tenants")
        .doc(tenantId)
        .collection("pacientes")
        .doc(id)
        .set({
            id,
            ...data,
            createdAt: new Date()
        });
    return id;
}

async function listarPacientes(tenantId) {
    const snapshot = await db
        .collection("tenants")
        .doc(tenantId)
        .collection("pacientes")
        .get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

async function editarPaciente(tenantId, id, data) {
    await db
        .collection("tenants")
        .doc(tenantId)
        .collection("pacientes")
        .doc(id)
        .update({
            ...data,
            updatedAt: new Date()
        });
}

async function deletarPaciente(tenantId, id) {
    await db
        .collection("tenants")
        .doc(tenantId)
        .collection("pacientes")
        .doc(id)
        .delete();
}

module.exports = {
    criarPaciente,
    listarPacientes,
    editarPaciente,
    deletarPaciente
};