const express = require("express");

const controller = require("../controllers/prescricoes.controller");
const auth = require("../middlewares/auth.middleware");
const tenant = require("../middlewares/tenant.middleware");

const router = express.Router();

router.post(
    "/",
    auth,
    tenant,
    controller.criarPrescricao
);

router.get(
    "/paciente/:pacienteId",
    auth,
    tenant,
    controller.listarPorPaciente
);

router.get(
    "/templates",
    auth,
    tenant,
    controller.buscarTemplate
);

router.delete(
    "/:id",
    auth,
    tenant,
    controller.deletarPrescricao
);

router.post(
    "/:id/assinar",
    auth,
    tenant,
    controller.assinarPrescricao
);

router.post(
 "/:id/enviar-assinatura",
 auth,
 tenant,
 controller.enviarParaAssinatura
);

module.exports = router;