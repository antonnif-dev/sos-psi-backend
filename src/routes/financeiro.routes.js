const express = require("express");
const controller = require("../controllers/financeiro.controller");
const auth = require("../middlewares/auth.middleware");
const tenant = require("../middlewares/tenant.middleware");
const role = require("../middlewares/role.middleware");

const router = express.Router();
router.get("/", auth, tenant, role(["admin", "psicologo", "secretaria"]), controller.listar);
router.post("/", auth, tenant, role(["admin", "psicologo", "secretaria"]), controller.criarPagamento);

router.put("/:id", auth, tenant, role(["admin", "psicologo", "secretaria"]), controller.editarPagamento);

router.delete("/:id", auth, tenant, role(["admin", "psicologo", "secretaria"]), controller.deletarPagamento);

module.exports = router;