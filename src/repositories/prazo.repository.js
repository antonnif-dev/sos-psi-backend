const { db } = require("../config/firebase");
const { v4: uuid } = require("uuid");
const { Timestamp } = require("firebase-admin/firestore");

async function criarPrazo(
    tenantId,
    data
) {

    const id = uuid();

    const payload = {
        id,
        cliente: data.cliente || "",
        descricao: data.descricao || "",
        dataLimite: data.dataLimite || "",
        prioridade: data.prioridade || "Média",
        status: "Pendente",
        createdAt: new Date()
    };

    console.log("CRIANDO PRAZO");

    await db
        .collection("tenants")
        .doc(tenantId)
        .collection("prazos")
        .doc(id)
        .set(payload);

    console.log("CRIANDO EVENTO AGENDA");

    const agendaId = uuid();

    await db
        .collection("tenants")
        .doc(tenantId)
        .collection("agenda")
        .doc(agendaId)
        .set({

            id: agendaId,

            pacienteNome:
                data.cliente || "Cliente",

            observacoes:
                data.descricao || "",

            data: Timestamp.fromDate(
                new Date(`${data.dataLimite}T09:00:00`)
            ),

            status: "agendada",

            tipo: "prazo",

            prioridade:
                data.prioridade || "Média",

            psicologoId:
                data.psicologoId || null,

            psicologoNome:
                data.psicologoNome || "Profissional",

            createdAt: Timestamp.now()

        });

    console.log("EVENTO CRIADO");

    return id;
}

async function listarPrazos(
    tenantId
) {
    const snapshot = await db
        .collection("tenants")
        .doc(tenantId)
        .collection("prazos")
        .orderBy("dataLimite", "asc")
        .get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

async function editarPrazo(
    tenantId,
    id,
    data
) {
    await db
        .collection("tenants")
        .doc(tenantId)
        .collection("prazos")
        .doc(id)
        .update({
            ...data,
            updatedAt: new Date()
        });
}

async function deletarPrazo(
    tenantId,
    id
) {
    await db
        .collection("tenants")
        .doc(tenantId)
        .collection("prazos")
        .doc(id)
        .delete();
}

module.exports = {
    criarPrazo,
    listarPrazos,
    editarPrazo,
    deletarPrazo
};