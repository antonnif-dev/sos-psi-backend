const labelsConfig = require("./labels");

function getLabels(segmento) {
    return labelsConfig[segmento] || labelsConfig.saude
}

module.exports = {

    PACIENTE_CRIADO: {
        title: () => "Novo paciente",
        message: (d) => `${d.nome} foi cadastrado no sistema`,
        link: () => "/pacientes",
        channels: ["app"]
    },
    //exemplo com labels
    /*
    PACIENTE_CRIADO: {
        title: ({ segmento }) => {
            const labels = getLabels(segmento)
            return `Novo ${labels.paciente}`
        },
        message: ({ data, segmento }) => {
            const labels = getLabels(segmento)
            return `${data.nome} foi cadastrado como ${labels.paciente}`
        },
        link: () => "/pacientes",
        channels: ["app"]
    },
    */

    PACIENTE_SEM_SESSAO: {
        title: () => "Paciente sem sessão",
        message: (d) =>
            `${d.nome} está sem sessão há ${d.dias} dias`,
        link: (d) => `/pacientes/${d.id}`,
        channels: ["app"]
    },

    PACIENTE_SEM_SESSAO_MARCADA: {
        title: () => "Paciente sem agendamento",
        message: (d) =>
            `${d.nome} ainda não possui sessão marcada`,
        link: (d) => `/pacientes/${d.id}`,
        channels: ["app"]
    },

    CONSULTA_CRIADA: {
        title: () => "Consulta agendada",
        message: (d) =>
            `Consulta agendada para ${d.nome} em ${d.data}`,
        link: () => "/agenda",
        channels: ["app"]
    },

    CONSULTA_FINALIZADA: {
        title: () => "Sessão finalizada",
        message: (d) =>
            `Sessão das ${d.hora} foi finalizada`,
        link: () => "/agenda",
        channels: ["app"]
    },

    CONSULTA_CANCELADA: {
        title: () => "Consulta cancelada",
        message: (d) =>
            `Consulta das ${d.hora} foi cancelada`,
        link: () => "/agenda",
        channels: ["app"]
    },

    SESSOES_DO_DIA: {
        title: () => "Sessões de hoje",
        message: (d) =>
            `Você possui ${d.total} sessões hoje`,
        link: () => "/agenda",
        channels: ["app"]
    },

    DIA_SEM_AGENDA: {
        title: () => "Dia livre",
        message: () =>
            "Hoje você não possui sessões agendadas",
        link: () => "/agenda",
        channels: ["app"]
    }

}