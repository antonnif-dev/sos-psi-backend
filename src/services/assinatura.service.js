const axios = require("axios")

async function enviarParaZapSign(pdfBase64, nome, email){

  const res = await axios.post(
    "https://api.zapsign.com.br/api/v1/docs/",
    {
      name: nome,
      base64_pdf: pdfBase64,
      signers: [
        {
          name: nome,
          email: email,
          auth_mode: "assinaturaTela-tokenEmail"
        }
      ]
    },
    {
      headers:{
        Authorization: `Bearer ${process.env.ZAPSIGN_TOKEN}`
      }
    }
  )

  return res.data
}

module.exports = { enviarParaZapSign }