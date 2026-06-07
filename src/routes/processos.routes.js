const express = require("express");
const controller = require("../controllers/processos.controller");
const auth = require("../middlewares/auth.middleware");
const tenant = require("../middlewares/tenant.middleware");
const role = require("../middlewares/role.middleware");

const router = express.Router();

router.get(
    "/",
    auth,
    tenant,
    role(["admin", "advogado", "assistente"]),
    controller.listar
);

router.post(
    "/",
    auth,
    tenant,
    role(["admin", "advogado"]),
    controller.criar
);

router.post(
    "/:id/sincronizar",
    auth,
    tenant,
    role(["admin", "advogado"]),
    controller.sincronizar
);

router.put(
    "/:id",
    auth,
    tenant,
    role(["admin", "advogado"]),
    controller.editar
);

router.delete(
    "/:id",
    auth,
    tenant,
    role(["admin", "advogado"]),
    controller.deletar
);

module.exports = router;