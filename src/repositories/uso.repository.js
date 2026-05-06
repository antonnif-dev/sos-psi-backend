const { db, admin } = require("../config/firebase");

const COLLECTION_TENANT = "tenants";
const DOC_USO = "atual";

async function buscarUsoMesAtual(tenantId) {
    console.log("BUSCANDO USO PARA TENANT:", tenantId);
    const docRef = db
        .collection(COLLECTION_TENANT)
        .doc(tenantId)
        .collection("uso")
        .doc(DOC_USO);

    const doc = await docRef.get();
    console.log("USO ENCONTRADO?", doc.exists);
    console.log("DADOS DO USO:", doc.data());

    return doc.exists ? doc.data() : null;
}

async function incrementarUso(tenantId, campo, valor) {
    const docRef = db
        .collection(COLLECTION_TENANT)
        .doc(tenantId)
        .collection("uso")
        .doc("atual");

    await db.runTransaction(async (transaction) => {
        const doc = await transaction.get(docRef);

        if (!doc.exists) {
            console.log("🆕 CRIANDO DOCUMENTO DE USO");

            transaction.set(docRef, {
                [campo]: valor,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            return;
        }

        const atual = doc.data()[campo] || 0;

        console.log("📊 USO ANTES:", atual);

        transaction.update(docRef, {
            [campo]: atual + valor,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log("📊 USO DEPOIS:", atual + valor);
    });
}

async function resetarUsoMensal() {
    const tenantsSnapshot = await db.collection(COLLECTION_TENANT).get();

    const batch = db.batch();

    tenantsSnapshot.forEach((tenantDoc) => {
        const usoRef = tenantDoc.ref.collection("uso").doc(DOC_USO);

        batch.set(
            usoRef,
            {
                sessoesMesAtual: 0,
                uploadMbMesAtual: 0,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
        );
    });

    await batch.commit();
}

module.exports = {
    buscarUsoMesAtual,
    incrementarUso,
    resetarUsoMensal,
};