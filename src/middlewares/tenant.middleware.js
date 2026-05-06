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

        if (snapshot.empty) {
            console.log("Usuário não encontrado em nenhum tenant");
            return res.status(403).json({ error: "Usuário não pertence a tenant" });
        }

        const userDoc = snapshot.docs[0];
        const user = userDoc.data();
        console.log("DADOS DO USER DOC:", user);
        console.log("USUÁRIO ENCONTRADO:", {
            uid: user.uid,
            tenantId: user.tenantId,
            role: user.role,
            plano: user.plano
        });

        const tenantDoc = await db
            .collection("tenants") // ⚠️ ou "tenant" se seu banco estiver no singular
            .doc(user.tenantId)
            .get();

        if (!tenantDoc.exists) {
            return res.status(404).json({ error: "Tenant não encontrada" });
        }

        const tenantData = tenantDoc.data();

        if (!user) {
            return res.status(403).json({ error: 'Usuário não cadastrado' });
        }

        req.userData = user;
        req.tenantId = user.tenantId;
        req.role = user.role;

        req.tenant = {
            plano: tenantData.plano || "basico"
        };

        console.log("TENANT FINAL:", {
            tenantId: req.tenantId,
            plano: req.tenant.plano,
            origemPlano: tenantData.plano ? "tenant" : "fallback_basico"
        });

        if (!req.tenant.plano) {
            console.warn("⚠️ TENANT SEM PLANO DEFINIDO!");
        }

        next();

    } catch (error) {

        console.error("ERRO NO TENANT MIDDLEWARE:", error);

        return res.status(500).json({
            error: "Erro ao identificar tenant"
        });

    }

}

module.exports = tenantMiddleware;