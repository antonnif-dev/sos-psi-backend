const express = require("express")
const router = express.Router()

const medicamentosController = require("../controllers/medicamentos.controller")

router.get("/", medicamentosController.buscar)

module.exports = router