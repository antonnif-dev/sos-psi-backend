const medicamentosRepository = require("../repositories/medicamentos.repository")

class MedicamentosService {
  async buscar(search) {
    if (!search || typeof search !== "string" || search.length < 2) {
      return []
    }
    return await medicamentosRepository.buscarPorNome(search)
  }
}

module.exports = new MedicamentosService()