const { buscarUsoMesAtual } = require("../repositories/uso.repository");

async function carregarUso(req, res, next) {
    try {
        const uso = await buscarUsoMesAtual(req.tenantId);
        console.log("USO BRUTO DO FIRESTORE:", uso);

        req.uso = uso || {
            pacientes: 0,
            usuariosEquipe: 0,
            sessoesMesAtual: 0,
            uploadMbMesAtual: 0,
        };
        console.log("USO FINAL NO REQ:", req.uso);

        next();
    } catch (error) {
        console.error("Erro ao carregar uso:", error);
        return res.status(500).json({ erro: "Erro ao carregar uso" });
    }
    console.log("USO FINAL (ANTES DO LIMITE):", {
        pacientes: req.uso.pacientes
    });
}

module.exports = { carregarUso };