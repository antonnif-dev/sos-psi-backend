const { auth, db } = require("../config/firebase");
const { incrementarUso } = require("../repositories/uso.repository");

async function criarUsuario(req, res) {
    try {
        const tenantId = req.tenantId;
        console.log("BODY RECEBIDO:", req.body);
        const {
            nome,
            email,
            senha,
            role,
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

        if (role !== "cliente") {
            await incrementarUso(tenantId, "usuariosEquipe", 1);
        }

        res.json({ ok: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

module.exports = { criarUsuario };