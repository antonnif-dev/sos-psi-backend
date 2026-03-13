const express = require("express");
const controller = require("../controllers/agenda.controller");
const auth = require("../middlewares/auth.middleware");
const tenant = require("../middlewares/tenant.middleware");

const router = express.Router();

router.post("/", auth, tenant, controller.criarConsulta);
router.get("/", auth, tenant, controller.listarConsultas);

router.put("/:id", auth, tenant, controller.editarConsulta);

router.delete("/:id", auth, tenant, controller.deletarConsulta);

module.exports = router;