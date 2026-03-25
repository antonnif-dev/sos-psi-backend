async function webhookZapSign(req, res) {
    const event = req.body
    if (event.event === "doc_signed") {
        const token = event.doc_token
        await repo.marcarComoAssinado(token)
    }

    res.sendStatus(200)
}

