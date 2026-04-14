const express = require("express");
const controller = require("../controllers/documentos.controller");
const auth = require("../middlewares/auth.middleware");
const tenant = require("../middlewares/tenant.middleware");
const upload = require("../middlewares/upload.middleware");
const role = require("../middlewares/role.middleware");

const router = express.Router();

router.get("/", auth, tenant, role(["admin", "psicologo", "secretaria"]), controller.listar);

router.post(
    "/",
    auth,
    tenant,
    role(["admin", "psicologo", "secretaria"]),
    upload.single("file"),
    controller.criarDocumento
);

router.delete(
    "/:id",
    auth,
    tenant,
    role(["admin", "psicologo", "secretaria"]),
    controller.deletarDocumento
);

module.exports = router;