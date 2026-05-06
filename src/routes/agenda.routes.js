const express = require("express");
const controller = require("../controllers/agenda.controller");
const auth = require("../middlewares/auth.middleware");
const tenant = require("../middlewares/tenant.middleware");
const role = require("../middlewares/role.middleware");

const router = express.Router();

const { carregarUso } = require("../middlewares/carregarUso.middleware");
const { verificarLimite } = require("../middlewares/verificarLimite.middleware");

//router.post("/", auth, tenant, (["admin", "psicologo", "secretaria"]), controller.criarConsulta);

router.post(
    "/",
    auth,
    tenant,
    role(["admin", "psicologo", "secretaria"]),
    carregarUso,
    verificarLimite("sessoesMesAtual"),
    controller.criarConsulta
);

router.get("/",
    auth,
    tenant,
    role(["admin", "psicologo", "secretaria"]),
    controller.listarConsultas
);

router.get("/realizadas", auth, tenant, role(["admin", "psicologo", "secretaria"]), controller.listarRealizadas);

router.put("/:id", auth, tenant, role(["admin", "psicologo", "secretaria"]), controller.editarConsulta);

/* rota onde ganhar status realizada ganha +1 no contador
router.put(
    "/:id",
    auth,
    tenant,
    role(["admin", "psicologo", "secretaria"]),
    carregarUso,
    verificarLimite("sessoesMesAtual"),
    controller.editarConsulta
);*/

router.delete("/:id", auth, tenant, role(["admin"]), controller.deletarConsulta);

module.exports = router;