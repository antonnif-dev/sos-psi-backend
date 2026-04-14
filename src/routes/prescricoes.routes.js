const express = require("express");

const controller = require("../controllers/prescricoes.controller");
const auth = require("../middlewares/auth.middleware");
const tenant = require("../middlewares/tenant.middleware");
const role = require("../middlewares/role.middleware");

const router = express.Router();

router.post("/",
    auth,
    tenant,
    role(["admin", "psicologo"]),
    controller.criarPrescricao
);

router.get("/paciente/:pacienteId",
    auth,
    tenant,
    role(["admin", "psicologo"]),
    controller.listarPorPaciente
);

router.get("/templates",
    auth,
    tenant,
    role(["admin", "psicologo"]),
    controller.buscarTemplate
);

router.delete("/:id",
    auth,
    tenant,
    role(["admin", "psicologo"]),
    controller.deletarPrescricao
);

router.post("/:id/assinar",
    auth,
    tenant,
    role(["admin", "psicologo"]),
    controller.assinarPrescricao
);

router.post("/:id/enviar-assinatura",
    auth,
    tenant,
    role(["admin", "psicologo"]),
    controller.enviarParaAssinatura
);

module.exports = router;