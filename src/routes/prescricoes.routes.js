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

router.delete(
 "/:id",
 auth,
 tenant,
 controller.deletarPrescricao
);

module.exports = router;