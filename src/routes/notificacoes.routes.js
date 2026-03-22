const express = require("express")
const router = express.Router()

const controller = require("../controllers/notificacoes.controller")
const auth = require("../middlewares/auth.middleware")

router.get("/", auth, controller.getNotificacoes)

router.get("/unread-count", auth, controller.getUnreadCount)

router.patch("/:id/read", auth, controller.markAsRead)

module.exports = router