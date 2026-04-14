const express = require("express");
const router = express.Router();
const role = require("../middlewares/role.middleware");

const medicamentosController = require("../controllers/medicamentos.controller")

router.get("/", role(["admin", "psicologo"]), medicamentosController.buscar)

module.exports = router