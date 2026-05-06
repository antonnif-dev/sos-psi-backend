const labelsConfig = require("./labels");

function getLabels(segmento) {
    return labelsConfig[segmento] || labelsConfig.saude;
}

module.exports = {

    PACIENTE_CRIADO: {
        title: (d) => {
            const labels = getLabels(d.segmento);
            return `Novo ${labels.paciente}`;
        },
        message: (d) => {
            const labels = getLabels(d.segmento);
            return `${d.nome} foi cadastrado como ${labels.paciente}`;
        },
        link: () => "/pacientes",
        channels: ["app"]
    },

    PACIENTE_SEM_SESSAO: {
        title: (d) => {
            const labels = getLabels(d.segmento);
            return `${labels.paciente} sem ${labels.sessao}`;
        },
        message: (d) => {
            const labels = getLabels(d.segmento);
            return `${d.nome} está sem ${labels.sessao} há ${d.dias} dias`;
        },
        link: (d) => `/pacientes/${d.id}`,
        channels: ["app"]
    },

    PACIENTE_SEM_SESSAO_MARCADA: {
        title: (d) => {
            const labels = getLabels(d.segmento);
            return `${labels.paciente} sem agendamento`;
        },
        message: (d) => {
            const labels = getLabels(d.segmento);
            return `${d.nome} ainda não possui ${labels.sessao} marcada`;
        },
        link: (d) => `/pacientes/${d.id}`,
        channels: ["app"]
    },

    CONSULTA_CRIADA: {
        title: (d) => {
            const labels = getLabels(d.segmento);
            return `${labels.consulta} agendada`;
        },
        message: (d) => {
            const labels = getLabels(d.segmento);
            return `${labels.consulta} agendada para ${d.nome} em ${d.data}`;
        },
        link: () => "/agenda",
        channels: ["app"]
    },

    SESSAO_PROXIMA: {
        title: (d) => {
            const labels = getLabels(d.segmento);
            return `${labels.sessao} em breve`;
        },
        message: (d) => {
            const labels = getLabels(d.segmento);
            return `${labels.sessao} com ${d.nome} começa em 1 hora`;
        },
        link: () => "/agenda",
        channels: ["app"]
    },

    CONSULTA_FINALIZADA: {
        title: (d) => {
            const labels = getLabels(d.segmento);
            return `${labels.sessao} finalizada`;
        },
        message: (d) => {
            const labels = getLabels(d.segmento);
            return `${labels.sessao} das ${d.hora} foi finalizada`;
        },
        link: () => "/agenda",
        channels: ["app"]
    },

    CONSULTA_CANCELADA: {
        title: (d) => {
            const labels = getLabels(d.segmento);
            return `${labels.consulta} cancelada`;
        },
        message: (d) => {
            const labels = getLabels(d.segmento);
            return `${labels.consulta} das ${d.hora} foi cancelada`;
        },
        link: () => "/agenda",
        channels: ["app"]
    },

    SESSOES_DO_DIA: {
        title: (d) => {
            const labels = getLabels(d.segmento);
            return `${labels.sessao}s de hoje`;
        },
        message: (d) => {
            const labels = getLabels(d.segmento);
            return `Você possui ${d.total} ${labels.sessao}s hoje`;
        },
        link: () => "/agenda",
        channels: ["app"]
    },

    DIA_SEM_AGENDA: {
        title: (d) => {
            const labels = getLabels(d.segmento);
            return "Dia livre";
        },
        message: (d) => {
            const labels = getLabels(d.segmento);
            return `Hoje você não possui ${labels.sessao}s agendadas`;
        },
        link: () => "/agenda",
        channels: ["app"]
    }

};