const puppeteer = require("puppeteer")

async function gerarPDF(html){
 const browser = await puppeteer.launch()
 const page = await browser.newPage()
 
 await page.setContent(html)

 const pdf = await page.pdf({
   format:"A4"
 })

 await browser.close()
 return pdf
}

module.exports = { gerarPDF }