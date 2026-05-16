const express = require("express");
const router = express.Router();
const role = require("../middlewares/role.middleware");

const auth = require("../middlewares/auth.middleware");
const tenant = require("../middlewares/tenant.middleware");
const { carregarUso } = require("../middlewares/carregarUso.middleware");
const { verificarLimite } = require("../middlewares/verificarLimite.middleware");

const { criarUsuario, listarUsuarios } = require("../controllers/user.controller");

//router.post("/users", role(["admin"]), criarUsuario);

router.post(
    "/users",
    auth,
    tenant,
    role(["admin"]),
    carregarUso,
    verificarLimite("usuariosEquipe"),
    criarUsuario
);
console.log("REGISTRANDO ROTA GET /users");
router.get(
    "/users",
    auth,
    tenant,
    role(["admin", "psicologo", "secretaria"]),
    listarUsuarios
);

module.exports = router;