export function verificarAssinatura(req, res, next) {
    if (req.tenant.statusAssinatura !== "ativo") {
        return res.status(403).json({
            erro: "Assinatura inativa",
        });
    }

    next();
}