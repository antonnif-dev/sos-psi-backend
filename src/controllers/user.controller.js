const { auth, db } = require("../config/firebase");
const { incrementarUso } = require("../repositories/uso.repository");
const service = require("../services/user.service");

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

async function listarUsuarios(req, res) {

    console.log("ENTROU EM listarUsuarios");

    try {

        const tenantId = req.tenantId;

        console.log("TENANT:", tenantId);

        const usuarios = await service.listarUsuarios(tenantId);

        console.log("USUARIOS:", usuarios.length);

        res.json(usuarios);

    } catch (err) {

        console.error("ERRO CONTROLLER:", err);

        res.status(500).json({
            error: "Erro ao listar usuários"
        });
    }
}

module.exports = { criarUsuario, listarUsuarios };