const { db } = require("../config/firebase");
const { v4: uuid } = require("uuid");

const COLLECTION = "movimentacoes";

async function criarMovimentacao(
    tenantId,
    processoId,
    movimentacao
) {

    const id = uuid();

    await db
        .collection("tenants")
        .doc(tenantId)
        .collection(COLLECTION)
        .doc(id)
        .set({
            id,
            processoId,
            codigo: movimentacao.codigo,
            descricao: movimentacao.nome,
            dataMovimentacao: movimentacao.dataHora,
            origem: "datajud",
            createdAt: new Date()
        });

    return id;
}

async function existeMovimentacao(
    tenantId,
    processoId,
    codigo,
    dataMovimentacao
) {

    const snapshot = await db
        .collection("tenants")
        .doc(tenantId)
        .collection(COLLECTION)
        .where(
            "processoId",
            "==",
            processoId
        )
        .where(
            "codigo",
            "==",
            codigo
        )
        .where(
            "dataMovimentacao",
            "==",
            dataMovimentacao
        )
        .limit(1)
        .get();

    return !snapshot.empty;
}

async function listarPorProcesso(
    tenantId,
    processoId
) {
    console.log(
        "PROCESSO RECEBIDO:",
        processoId
    );

    const snapshot = await db
        .collection("tenants")
        .doc(tenantId)
        .collection(COLLECTION)
        .where(
            "processoId",
            "==",
            processoId
        )
        .get();
    console.log(
        "TOTAL:",
        snapshot.size
    );

    return snapshot.docs.map(
        doc => doc.data()
    );
}

async function listarTodas(
    tenantId
) {

    const snapshot = await db
        .collection("tenants")
        .doc(tenantId)
        .collection(COLLECTION)
        .get();

    return snapshot.docs.map(
        doc => doc.data()
    );

}

module.exports = {
    criarMovimentacao,
    existeMovimentacao,
    listarPorProcesso,
    listarTodas
};