const express = require("express");

const router = express.Router();

const auth =
    require("../middlewares/auth.middleware");

const tenant =
    require("../middlewares/tenant.middleware");

const role =
    require("../middlewares/role.middleware");

const controller =
    require("../controllers/movimentacoes.controller");

router.get(
    "/",
    auth,
    tenant,
    role([
        "admin",
        "advogado",
        "assistente"
    ]),
    controller.listarTodas
);

router.get(
    "/:processoId",
    auth,
    tenant,
    role([
        "admin",
        "advogado",
        "assistente"
    ]),
    controller.listar
);

module.exports = router;