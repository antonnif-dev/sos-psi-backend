const express = require("express");
const controller = require("../controllers/prontuario.controller");
const auth = require("../middlewares/auth.middleware");
const tenant = require("../middlewares/tenant.middleware");
const role = require("../middlewares/role.middleware");

const router = express.Router();

router.get(
    "/",
    auth,
    tenant,
    role(["admin", "psicologo"]),
    controller.listarProntuarios
);

router.post(
    "/",
    auth,
    tenant,
    role(["admin", "psicologo"]),
    controller.criarProntuario
);

router.put(
    "/:id",
    auth,
    tenant,
    role(["admin", "psicologo"]),
    controller.editarProntuario
);

router.delete(
    "/:id",
    auth,
    tenant,
    role(["admin", "psicologo"]),
    controller.deletarProntuario
);

module.exports = router;