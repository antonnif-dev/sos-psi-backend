const express = require("express");

const router = express.Router();

const datajudController =
    require("../controllers/datajud.controller");

router.get(
    "/processo/:tribunal/:numeroProcesso",
    datajudController.buscar
);

router.get(
    "/movimentacoes/:tribunal/:numeroProcesso",
    datajudController.movimentacoes
);

module.exports = router;