const PDFDocument = require("pdfkit")

async function gerarPdfPrescricao(prescricao){
    return new Promise((resolve)=>{
        const doc = new PDFDocument()

        let buffers = []

        doc.on("data", buffers.push.bind(buffers))
        doc.on("end", ()=>{

            const pdfData = Buffer.concat(buffers)

            resolve(pdfData.toString("base64"))

        })
        doc.fontSize(20).text("PRESCRIÇÃO", { align: "center" })
        doc.moveDown()
        doc.fontSize(12).text(`Paciente: ${prescricao.pacienteNome}`)
        doc.text(`Data: ${new Date().toLocaleDateString()}`)
        doc.moveDown()
        doc.text("Medicamentos:")
        prescricao.medicamentos.forEach(m=>{
            doc.text(`- ${m.nome} / ${m.dosagem}`)
        })
        doc.end()
    })
}

module.exports = { gerarPdfPrescricao }