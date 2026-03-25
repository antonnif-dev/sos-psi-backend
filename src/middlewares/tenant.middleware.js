const { db } = require("../config/firebase");

async function tenantMiddleware(req, res, next) {

    try {
        const uid = req.user.uid;
        console.log("UID recebido:", uid);

        const snapshot = await db
            .collectionGroup("usuarios")
            .where("uid", "==", uid)
            .limit(1)
            .get();

        console.log("Query executada");

        if (snapshot.empty) {
            console.log("Usuário não encontrado em nenhum tenant");
            return res.status(403).json({ error: "Usuário não pertence a tenant" });
        }

        const userDoc = snapshot.docs[0].data();

        console.log("Usuário encontrado:", userDoc);

        req.tenantId = userDoc.tenantId;
        req.role = userDoc.role;
        req.user = userDoc;

        next();

    } catch (error) {

        console.error("ERRO NO TENANT MIDDLEWARE:", error);

        return res.status(500).json({
            error: "Erro ao identificar tenant"
        });

    }

}

module.exports = tenantMiddleware;