const axios = require("axios")

async function criarDocumento(pdf){
 const res = await axios.post(
  "https://api.clicksign.com/api/v1/documents",
  {
   document:{
    path:"/prescricao.pdf",
    content_base64: pdf.toString("base64")
   }
  },
  {
   headers:{
    Authorization:`Bearer ${process.env.CLICKSIGN_TOKEN}`
   }
  }
 )

 return res.data
}

module.exports = { criarDocumento }