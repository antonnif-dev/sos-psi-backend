const { auth, db } = require("../config/firebase");

async function criarUsuario(req, res) {
    try {
        console.log("BODY RECEBIDO:", req.body);
        const {
            nome,
            email,
            senha,
            role,
            tenantId,
            telefone = "",
            profissionalId = ""
        } = req.body;

        const userRecord = await auth.createUser({
            email,
            password: senha,
            displayName: nome
        });

        const uid = userRecord.uid;

        await db
            .collection("tenants")
            .doc(tenantId)
            .collection("usuarios")
            .doc(uid)
            .set({
                uid,
                tenantId,
                nome,
                email,
                telefone,
                profissionalId,
                role,
                createdAt: new Date()
            });

        res.json({ ok: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

module.exports = { criarUsuario };