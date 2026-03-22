const express = require("express");

const authMiddleware = require("../middlewares/auth.middleware");
const controller = require("../controllers/notificacoes.controller");
const auth = require("../middlewares/auth.middleware");
const tenant = require("../middlewares/tenant.middleware");

const router = express.Router();

router.get(
    "/",
    auth,
    tenant,
    controller.getNotificacoes
);

router.get(
    "/unread-count",
    auth,
    tenant,
    controller.getUnreadCount
);

router.patch(
    "/:id/read",
    auth,
    tenant,
    controller.markAsRead
);

router.put(
    "/:id/read",
    auth,
    tenant,
    controller.markAsRead
);

module.exports = router