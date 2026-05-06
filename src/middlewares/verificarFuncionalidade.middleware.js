import { PLANOS } from "../config/planos.config.js";

export function verificarFuncionalidade(chave) {
    return (req, res, next) => {
        const plano = PLANOS[req.tenant.plano];

        if (!plano.funcionalidades[chave]) {
            return res.status(403).json({
                erro: "Funcionalidade não disponível no seu plano",
            });
        }

        next();
    };
}