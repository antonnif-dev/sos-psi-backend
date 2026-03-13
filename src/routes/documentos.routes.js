const express = require("express");
const controller = require("../controllers/documentos.controller");
const auth = require("../middlewares/auth.middleware");
const tenant = require("../middlewares/tenant.middleware");
const upload = require("../middlewares/upload.middleware");

const router = express.Router();

router.get("/", auth, tenant, controller.listar);

router.post(
 "/",
 auth,
 tenant,
 upload.single("file"),
 controller.criarDocumento
);

router.delete(
 "/:id",
 auth,
 tenant,
 controller.deletarDocumento
);

module.exports = router;