const express = require("express");
const controller = require("../controllers/dashboard.controller");
const auth = require("../middlewares/auth.middleware");
const tenant = require("../middlewares/tenant.middleware");

const router = express.Router();

router.get("/", auth, tenant, controller.getDashboard);

module.exports = router;