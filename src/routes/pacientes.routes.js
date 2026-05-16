const express = require("express");

const controller = require("../controllers/pacientes.controller");
const auth = require("../middlewares/auth.middleware");
const tenant = require("../middlewares/tenant.middleware");
const role = require("../middlewares/role.middleware");

const { carregarUso } = require("../middlewares/carregarUso.middleware");
const { verificarLimite } = require("../middlewares/verificarLimite.middleware");

const router = express.Router();

router.post(
    "/",
    auth,
    tenant,
    role(["admin", "psicologo", "secretaria"]),
    carregarUso,
    verificarLimite("pacientes"),
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

router.put(
    "/:id/psicologo",
    auth,
    tenant,
    role(["admin", "psicologo", "secretaria"]),
    controller.alterarPsicologo
);

router.delete(
    "/:id",
    auth,
    tenant,
    role(["admin", "psicologo", "secretaria"]),
    controller.deletarPaciente
);

module.exports = router;