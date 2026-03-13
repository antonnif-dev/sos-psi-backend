const express = require("express");
const controller = require("../controllers/prontuario.controller");
const auth = require("../middlewares/auth.middleware");
const tenant = require("../middlewares/tenant.middleware");

const router = express.Router();

router.get(
 "/",
 auth,
 tenant,
 controller.listarProntuarios
);

router.post(
 "/",
 auth,
 tenant,
 controller.criarProntuario
);

router.put(
 "/:id",
 auth,
 tenant,
 controller.editarProntuario
);

router.delete(
 "/:id",
 auth,
 tenant,
 controller.deletarProntuario
);

module.exports = router;