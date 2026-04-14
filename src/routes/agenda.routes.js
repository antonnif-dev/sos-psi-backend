const express = require("express");
const controller = require("../controllers/agenda.controller");
const auth = require("../middlewares/auth.middleware");
const tenant = require("../middlewares/tenant.middleware");
const role = require("../middlewares/role.middleware");

const router = express.Router();

router.post("/", auth, tenant, role(["admin", "psicologo", "secretaria"]), controller.criarConsulta);

router.get("/", auth, tenant, role(["admin", "psicologo", "secretaria"]), controller.listarConsultas);
router.get("/realizadas", auth, tenant, role(["admin", "psicologo", "secretaria"]), controller.listarRealizadas);

router.put("/:id", auth, tenant, role(["admin", "psicologo", "secretaria"]), controller.editarConsulta);

router.delete("/:id", auth, tenant, role(["admin"]), controller.deletarConsulta);

module.exports = router;