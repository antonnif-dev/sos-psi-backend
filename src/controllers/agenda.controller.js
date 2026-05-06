const service = require("../services/agenda.service");
const { incrementarUso } = require("../repositories/uso.repository");

async function criarConsulta(req, res) {
    try {
        const id = await service.criarConsulta(
            req.tenantId,
            req.body,
            req.user?.uid
        );

        console.log("📅 NOVA SESSÃO CRIADA → CONTANDO +1");

        await incrementarUso(req.tenantId, "sessoesMesAtual", 1);

        res.json({ id });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function listarConsultas(req, res) {
    const consultas = await service.listarConsultas(req.tenantId);
    res.json(consultas);
}

async function editarConsulta(req, res) {
    try {
        await service.editarConsulta(
            req.tenantId,
            req.params.id,
            req.body
        );
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

/* rota onde ganhar status realizada ganha +1 no contador
async function editarConsulta(req, res) {
    try {
        // 🔍 buscar estado antes da alteração
        const consultaAntes = await service.buscarPorId(
            req.tenantId,
            req.params.id
        );

        // ✏️ realizar edição
        await service.editarConsulta(
            req.tenantId,
            req.params.id,
            req.body
        );

        // 📊 contar apenas quando vira "realizada"
        if (
            consultaAntes?.status !== "realizada" &&
            req.body.status === "realizada"
        ) {
            console.log("📅 SESSÃO FINALIZADA → CONTANDO +1");

            const { incrementarUso } = require("../repositories/uso.repository");

            await incrementarUso(req.tenantId, "sessoesMesAtual", 1);
        }

        res.json({ success: true });

    } catch (error) {
        console.error("ERRO EDITAR CONSULTA:", error);
        res.status(400).json({ error: error.message });
    }
}*/

async function deletarConsulta(req, res) {
    try {
        await service.deletarConsulta(
            req.tenantId,
            req.params.id
        );
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function listarRealizadas(req, res) {
    try {
        const consultas = await service.listarRealizadas(req.tenantId);
        res.json(consultas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    criarConsulta,
    listarConsultas,
    editarConsulta,
    deletarConsulta,
    listarRealizadas
};