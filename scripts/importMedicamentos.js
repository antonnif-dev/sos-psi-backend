process.env.FIRESTORE_PREFER_REST = "true"

const fs = require("fs")
const csv = require("csv-parser")
const iconv = require("iconv-lite")
const { db } = require("../src/config/firebase")

const START_LINE = 42859
const BATCH_SIZE = 500

async function importar() {

  let linha = 0
  let contadorBatch = 0
  let batch = db.batch()

  const filePath = "data/dataset_anvisa.csv"

  if (!fs.existsSync(filePath)) {
    return
  }

  const stream = fs
    .createReadStream(filePath)
    .pipe(iconv.decodeStream("latin1"))
    .pipe(csv({ separator: ";" }))

  for await (const data of stream) {

    linha++

    if (linha < START_LINE) {
      continue
    }

    try {

      if (!data.NOME_PRODUTO || !data.PRINCIPIO_ATIVO) {
        continue
      }

      const doc = {
        nome: data.NOME_PRODUTO.trim(),
        nomeLower: data.NOME_PRODUTO.toLowerCase().trim(),
        principioAtivo: data.PRINCIPIO_ATIVO,
        categoria: data.CLASSE_TERAPEUTICA || "",
        empresa: data.EMPRESA_DETENTORA_REGISTRO || ""
      }

      const ref = db.collection("medicamentos").doc()

      batch.set(ref, doc)

      contadorBatch++

      if (contadorBatch === BATCH_SIZE) {

        await batch.commit()

        batch = db.batch()
        contadorBatch = 0

      }

    } catch (err) {}

  }

  if (contadorBatch > 0) {
    await batch.commit()
  }

}

importar()

/* Código que funciona 1 por 1

process.env.FIRESTORE_PREFER_REST = "true"
const fs = require("fs")
const csv = require("csv-parser")
const iconv = require("iconv-lite")
const { db } = require("../src/config/firebase")

const START_LINE = 20004

async function importar() {

  console.log("Script iniciado")

  let linha = 0
  let total = 0

  const filePath = "data/dataset_anvisa.csv"

  if (!fs.existsSync(filePath)) {
    console.log("Arquivo CSV não encontrado:", filePath)
    return
  }

  console.log("Arquivo encontrado, iniciando leitura")

  const stream = fs
    .createReadStream(filePath)
    .pipe(iconv.decodeStream("latin1"))
    .pipe(csv({ separator: ";" }))

  stream.on("headers", (headers) => {
    console.log("Cabeçalhos detectados:")
    console.log(headers)
  })

  stream.on("error", (err) => {
    console.error("Erro no stream:", err)
  })

  for await (const data of stream) {

    linha++

    if (linha % 1000 === 0) {
      console.log("Linhas processadas:", linha)
    }

    if (linha === START_LINE) {
      console.log("Chegamos na linha desejada:", linha)
      console.log("Conteúdo da linha:", data)

      console.log("Aguardando 5 segundos antes de começar a inserir...")
      await new Promise(r => setTimeout(r, 5000))
    }

    if (linha < START_LINE) {
      continue
    }

    console.log("Processando linha:", linha)

    try {

      console.log("Campos recebidos:")
      console.log("NOME_PRODUTO:", data.NOME_PRODUTO)
      console.log("PRINCIPIO_ATIVO:", data.PRINCIPIO_ATIVO)

      if (!data.NOME_PRODUTO || !data.PRINCIPIO_ATIVO) {
        console.log("Linha ignorada por falta de campos")
        continue
      }

      console.log("Preparando objeto para Firestore")

      const doc = {
        nome: data.NOME_PRODUTO.trim(),
        nomeLower: data.NOME_PRODUTO.toLowerCase().trim(),
        principioAtivo: data.PRINCIPIO_ATIVO,
        categoria: data.CLASSE_TERAPEUTICA || "",
        empresa: data.EMPRESA_DETENTORA_REGISTRO || ""
      }

      console.log("Objeto preparado:")
      console.log(doc)

      console.log("Iniciando envio para Firestore...")

      const startTime = Date.now()

      const writePromise = db.collection("medicamentos").add(doc)

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout Firestore (10s)")), 10000)
      )

      const result = await Promise.race([writePromise, timeoutPromise])

      const duration = Date.now() - startTime

      console.log("Firestore respondeu em:", duration, "ms")
      console.log("Documento ID:", result.id)

      total++

      console.log("Inserido com sucesso. Total inserido:", total)

      if (total % 100 === 0) {
        console.log("Checkpoint de inserção:", total)
      }

    } catch (err) {

      console.error("Erro ao inserir:")
      console.error(err)

    }

  }

  console.log("Loop finalizado")
  console.log("Total inserido:", total)

}

importar()
*/