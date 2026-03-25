const { db } = require("../config/firebase");

async function buscarTemplate(sintoma) {

    const snapshot = await db
        .collection("prescricao_templates")
        .get();

    if (snapshot.empty) return null;

    const templates = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    console.log("Templates carregados:", templates);
    console.log("Sintoma recebido:", sintoma);

    return templates.find(t =>
        t.sintoma?.toLowerCase() === sintoma.toLowerCase()
    ) || null;

}

module.exports = { buscarTemplate };