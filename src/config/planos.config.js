const PLANOS = {
    basico: {
        limites: {
            pacientes: 10,
            usuariosEquipe: 1,
            sessoesMesAtual: 40,
            uploadMbPorMes: 100, //100mb para basico
        },
        funcionalidades: {
            notificacoes: true,
            notificacoesEmail: false,
            hierarquiaEquipe: false,
        },
    },

    pro: {
        limites: {
            pacientes: Infinity,
            usuariosEquipe: Infinity,
            sessoesMesAtual: Infinity,
            uploadMbPorMes: 1024, // 1GB para pro
        },
        funcionalidades: {
            notificacoes: true,
            notificacoesEmail: true,
            hierarquiaEquipe: true,
        },
    },
};

module.exports = { PLANOS };