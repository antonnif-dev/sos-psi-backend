const express = require("express");

const controller = require("../controllers/pacientes.controller");
const auth = require("../middlewares/auth.middleware");
const tenant = require("../middlewares/tenant.middleware");
const role = require("../middlewares/role.middleware");

const router = express.Router();

router.post(
    "/",
    auth,
    tenant,
    role(["admin", "psicologo", "secretaria"]),
    controller.criarPaciente
);

router.get(
    "/",
    auth,
    tenant,
    role(["admin", "psicologo", "secretaria"]),
    controller.listarPacientes
);

router.put(
    "/:id",
    auth,
    tenant,
    role(["admin", "psicologo", "secretaria"]),
    controller.editarPaciente
);

router.delete(
    "/:id",
    auth,
    tenant,
    role(["admin", "psicologo", "secretaria"]),
    controller.deletarPaciente
);

module.exports = router;