const express = require("express");
const router = express.Router();
const role = require("../middlewares/role.middleware");

const { criarUsuario } = require("../controllers/user.controller");

router.post("/users", role(["admin"]), criarUsuario);

module.exports = router;