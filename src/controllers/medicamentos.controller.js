const medicamentosService = require("../services/medicamentos.service")

class MedicamentosController {
  async buscar(req, res) {
    try {
      const { busca } = req.query
      const medicamentos = await medicamentosService.buscar(busca)
      return res.json(medicamentos)
    } catch (error) {
      console.error("Erro buscar medicamentos:", error)
      return res.status(500).json({ error: "Erro ao buscar medicamentos" })
    }
  }
}

module.exports = new MedicamentosController()