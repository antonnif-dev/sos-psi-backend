const express = require("express");
const controller = require("../controllers/documentos.controller");
const auth = require("../middlewares/auth.middleware");
const tenant = require("../middlewares/tenant.middleware");
const upload = require("../middlewares/upload.middleware");
const { uploadDocumento } = require("../controllers/documentos.controller");
const role = require("../middlewares/role.middleware");

const router = express.Router();

const { carregarUso } = require("../middlewares/carregarUso.middleware");
const { verificarLimite } = require("../middlewares/verificarLimite.middleware");

router.get("/", auth, tenant, role(["admin", "psicologo", "secretaria"]), controller.listar);
/*
router.post(
    "/",
    auth,
    tenant,
    role(["admin", "psicologo", "secretaria"]),
    upload.single("file"),
    controller.criarDocumento
);
*/

router.post(
  "/",
  auth,
  tenant,
  role(["admin", "psicologo", "secretaria"]),
  upload.single("file"),
  carregarUso,
  (req, res, next) => {
    const tamanhoMb = req.file.size / (1024 * 1024);

    console.log("📦 TAMANHO DO ARQUIVO (MB):", tamanhoMb);

    return verificarLimite("uploadMbMesAtual", tamanhoMb)(req, res, next);
  },
  controller.criarDocumento
);

router.post(
  "/upload",
  upload.single("arquivo"),
  uploadDocumento
);

router.delete(
  "/:id",
  auth,
  tenant,
  role(["admin", "psicologo", "secretaria"]),
  controller.deletarDocumento
);

module.exports = router;