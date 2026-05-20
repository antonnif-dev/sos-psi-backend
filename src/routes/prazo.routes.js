const express = require("express");
const controller = require("../controllers/prazo.controller");

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
    role(["admin", "advogado", "assistente"]),
    controller.criar
);

router.put(
    "/:id",
    auth,
    tenant,
    role(["admin", "advogado", "assistente"]),
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