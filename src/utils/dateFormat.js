const dayjs = require("dayjs")
const utc = require("dayjs/plugin/utc")
const timezone = require("dayjs/plugin/timezone")

dayjs.extend(utc)
dayjs.extend(timezone)

function formatBrazil(date){

  return dayjs(date)
    .tz("America/Sao_Paulo")
    .format("DD/MM/YYYY HH:mm")

}

module.exports = { formatBrazil }