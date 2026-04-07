require("dotenv").config();

const emailService = require("../src/services/email.service");

async function testar() {

  await emailService.enviarEmail({
    para: "antonnidev@gmail.com",
    assunto: "Teste SaaS Psicólogos",
    html: "<h1>Email funcionando 🚀</h1>"
  });

}

testar();