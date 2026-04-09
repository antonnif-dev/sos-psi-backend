const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

const TZ = "America/Sao_Paulo"

function hoje() {
    return dayjs().utc().toISOString()
}

function formatDateTimeBR(date) {
    return dayjs(date)
        .tz(TZ)
        .format("DD/MM/YYYY HH:mm")
}

function formatTimeBR(date) {
    return dayjs(date)
        .tz(TZ)
        .format("HH:mm")
}

function formatDateBR(date) {
    return dayjs(date)
        .tz(TZ)
        .format("DD/MM/YYYY")
}

module.exports = {
    hoje,
    formatDateTimeBR,
    formatTimeBR,
    formatDateBR
}