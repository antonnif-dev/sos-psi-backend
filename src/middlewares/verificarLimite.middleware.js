const { PLANOS } = require("../config/planos.config");

function verificarLimite(chave, quantidade = 1) {
    return (req, res, next) => {
        const planoNome = req.tenant?.plano;

        if (!planoNome) {
            return res.status(403).json({ erro: "Plano não definido" });
        }

        const plano = PLANOS[planoNome];
        console.log("PLANO:", planoNome);
        console.log("LIMITES DO PLANO:", plano.limites);

        if (!plano) {
            return res.status(403).json({ erro: "Plano inválido" });
        }

        const limite = plano.limites[chave];

        if (limite === Infinity) return next();

        const usoAtual = Number(req.uso[chave] || 0);
        console.log("VERIFICANDO LIMITE:");
        console.log("CHAVE:", chave);
        console.log("USO ATUAL:", usoAtual);
        console.log("LIMITE:", limite);
        console.log("TENTANDO ADICIONAR:", quantidade);
        console.log("TIPO USO:", typeof usoAtual);

        if (usoAtual + quantidade > limite) {
            console.log("🚫 BLOQUEADO: limite atingido");
            return res.status(403).json({
                erro: `Limite de ${chave} atingido no plano ${planoNome}`,
            });
        }
        console.log("✅ LIMITE OK, pode continuar");

        next();
    };
}

module.exports = { verificarLimite };