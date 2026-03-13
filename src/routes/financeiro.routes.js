const express = require("express");
const controller = require("../controllers/financeiro.controller");
const auth = require("../middlewares/auth.middleware");
const tenant = require("../middlewares/tenant.middleware");

const router = express.Router();
router.get("/", auth, tenant, controller.listar);
router.post("/", auth, tenant, controller.criarPagamento);

router.put("/:id", auth, tenant, controller.editarPagamento);

router.delete("/:id", auth, tenant, controller.deletarPagamento);

module.exports = router;