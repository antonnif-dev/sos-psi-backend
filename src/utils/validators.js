function validarPaciente(data) {

 if (!data.nome) {
  throw new Error("Nome obrigatório");
 }

}

module.exports = {
 validarPaciente
};