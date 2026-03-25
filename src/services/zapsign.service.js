const axios = require("axios")

async function criarDocumento(pdfBase64, nome, email) {

  try {

    console.log("TOKEN ZAPSIGN:", process.env.ZAPSIGN_TOKEN)

    const response = await axios.post(
      "https://api.zapsign.com.br/api/v1/docs/",
      {
        name: "Prescrição Médica",
        base64_pdf: pdfBase64,
        sandbox: true,
        signers: [
          {
            name: nome,
            email: email
          }
        ]
      },
      {
        params: {
          api_token: process.env.ZAPSIGN_TOKEN
        }
      }
    )

    return {
      token: response.data.token,
      sign_url: response.data.signers[0].sign_url
    }

  } catch (error) {

    console.log("ERRO ZAPSIGN:", error.response?.data)

    throw new Error("Erro ao enviar para assinatura")
  }
}

module.exports = {
  criarDocumento
}