const express = require("express");

const controller = require("../controllers/pacientes.controller");
const auth = require("../middlewares/auth.middleware");
const tenant = require("../middlewares/tenant.middleware");

const router = express.Router();

router.post(
 "/",
 auth,
 tenant,
 controller.criarPaciente
);

router.get(
 "/",
 auth,
 tenant,
 controller.listarPacientes
);

router.put(
 "/:id",
 auth,
 tenant,
 controller.editarPaciente
);

router.delete(
 "/:id",
 auth,
 tenant,
 controller.deletarPaciente
);

module.exports = router;