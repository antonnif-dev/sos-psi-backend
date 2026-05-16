const repo = require("../repositories/agenda.repository");
const agendaEvents = require("../events/agenda.events");
const usuariosRepo = require("../repositories/user.repository");

async function criarConsulta(tenantId, data, psicologoId) {
    const pacientesRepo = require("../repositories/pacientes.repository");
    if (!data.pacienteId) {
        throw new Error("Paciente obrigatório");
    }

    if (!data.data) {
        throw new Error("Data obrigatória");
    }

    const consultas = await repo.listarConsultas(tenantId);

    const novaData = new Date(data.data).getTime();

    const conflito = consultas.find(c => {

        const existente =
            new Date(c.data).getTime();

        return (
            existente === novaData
            &&
            c.psicologoId === psicologoId
        );

    });

    if (conflito) {
        throw new Error("Já existe consulta neste horário");
    }

    const paciente = await pacientesRepo.buscarPorId(
        tenantId,
        data.pacienteId
    );

    data.pacienteNome = paciente.nome;
    data.status = "agendada";
    data.psicologoId = psicologoId;

    const psicologo =
        await usuariosRepo.buscarPorUid(
            tenantId,
            psicologoId
        );

    console.log("🎨 Psicólogo encontrado:", psicologo);

    data.psicologoNome =
        psicologo?.nome || "Profissional";

    data.corAgenda =
        psicologo?.corAgenda || "#6366f1";

    const id = await repo.criarConsulta(tenantId, data)

    await agendaEvents.consultaCriada(
        tenantId,
        { id, ...data }
    )

    return id
}

async function listarConsultas(tenantId, user, filtros = {}) {
    console.log("📅 =============================");
    console.log("📅 LISTAGEM DE CONSULTAS");
    console.log("📅 =============================");
    console.log("🏢 Tenant:", tenantId);
    console.log("🔍 Filtros recebidos:", filtros);
    console.log("👤 Usuário autenticado:", {
        uid: user?.uid,
        role: user?.role,
        email: user?.email
    });

    if (!tenantId) {

        console.log("⚠️ Tenant inválido");

        return [];

    }

    let consultas = [];

    // ADMIN E SECRETARIA VEEM TUDO

    if (
        user.role === "admin"
        ||
        user.role === "secretaria"
    ) {

        console.log("👑 Acesso global liberado");

        if (
            filtros.startDate
            &&
            filtros.endDate
        ) {

            console.log("📆 Admin buscando por período");

            if (
                filtros.startDate
                &&
                filtros.endDate
            ) {

                console.log("📆 Admin buscando TODA agenda por período");

                consultas =
                    await repo.listarConsultasPorPeriodo(
                        tenantId,
                        filtros.startDate,
                        filtros.endDate
                    );

            } else {

                console.log("⚠️ Sem período → fallback");

                consultas =
                    await repo.listarConsultas(
                        tenantId
                    );

            }

        } else {

            console.log("⚠️ Sem período → fallback");

            consultas =
                await repo.listarConsultas(
                    tenantId
                );

        }

    }

    // PSICÓLOGO VÊ SOMENTE PRÓPRIAS CONSULTAS

    else if (user.role === "psicologo") {

        console.log("🧑 Psicólogo detectado");

        console.log(
            "🔒 Filtrando consultas do psicólogo:",
            user.uid
        );

        if (
            filtros.startDate
            &&
            filtros.endDate
        ) {

            console.log("📆 Psicólogo buscando por período");

            consultas =
                await repo.listarConsultasPorPsicologoEPeriodo(
                    tenantId,
                    user.uid,
                    filtros.startDate,
                    filtros.endDate
                );

        } else {

            console.log("⚠️ Psicólogo sem período → fallback");

            consultas =
                await repo.listarConsultasPorPsicologo(
                    tenantId,
                    user.uid
                );

        }

    }

    else {

        console.log("⛔ Role sem acesso:", user.role);

        return [];

    }

    console.log("📄 Total consultas encontradas:", consultas.length);

    const agora = new Date();

    for (const consulta of consultas) {

        if (consulta.status === "agendada") {

            const dataConsulta = new Date(
                new Date(consulta.data).getTime()
            );

            const fimConsulta = new Date(
                dataConsulta.getTime() + 50 * 60000
            );

            if (agora >= fimConsulta) {

                console.log("✅ Auto finalizando consulta:", consulta.id);

                await repo.editarConsulta(
                    tenantId,
                    consulta.id,
                    { status: "realizada" }
                );

                await agendaEvents.consultaFinalizada(
                    tenantId,
                    consulta
                );

                consulta.status = "realizada";

            }

        }

    }

    console.log("✅ Retornando consultas");

    return consultas;

}

async function editarConsulta(
    tenantId,
    id,
    data,
    user
) {

    console.log("✏️ Validando edição da consulta");

    if (!id) {

        console.log("❌ ID inválido");

        throw new Error("Consulta inválida");

    }

    console.log("👤 Usuário:", user);

    // ADMIN E SECRETARIA PODEM EDITAR TUDO

    if (
        user.role === "admin"
        ||
        user.role === "secretaria"
    ) {

        console.log("👑 Edição global liberada");

        await repo.editarConsulta(
            tenantId,
            id,
            data
        );

        return;

    }

    // PSICÓLOGO → SOMENTE PRÓPRIAS CONSULTAS

    if (user.role === "psicologo") {

        console.log("🧑 Validando ownership");

        const pertence =
            await repo.consultaPertenceAoPsicologo(
                tenantId,
                id,
                user.uid
            );

        if (!pertence) {

            console.log(
                "⛔ Tentativa de editar consulta de outro profissional"
            );

            throw new Error(
                "Sem permissão para editar esta consulta"
            );

        }

        console.log("✅ Ownership validado");

        await repo.editarConsulta(
            tenantId,
            id,
            data
        );

        return;

    }

    console.log("⛔ Role sem permissão");

    throw new Error("Sem permissão");

}

async function deletarConsulta(
    tenantId,
    id,
    user
) {

    console.log("🗑️ Validando exclusão");

    if (!id) {

        throw new Error("Consulta inválida");

    }

    console.log("👤 Usuário:", user);

    // ADMIN PODE TUDO

    if (user.role === "admin") {

        console.log("👑 Exclusão global liberada");

        const consultas =
            await repo.listarConsultas(tenantId);

        const consulta =
            consultas.find(c => c.id === id);

        await repo.deletarConsulta(
            tenantId,
            id
        );

        if (consulta) {

            await agendaEvents.consultaCancelada(
                tenantId,
                consulta
            );

        }

        return;

    }

    // PSICÓLOGO → APENAS PRÓPRIAS

    if (user.role === "psicologo") {

        console.log("🧑 Validando ownership");

        const pertence =
            await repo.consultaPertenceAoPsicologo(
                tenantId,
                id,
                user.uid
            );

        if (!pertence) {

            console.log(
                "⛔ Tentativa de deletar consulta de outro profissional"
            );

            throw new Error(
                "Sem permissão para deletar esta consulta"
            );

        }

        console.log("✅ Ownership validado");

        const consultas =
            await repo.listarConsultasPorPsicologo(
                tenantId,
                user.uid
            );

        const consulta =
            consultas.find(c => c.id === id);

        await repo.deletarConsulta(
            tenantId,
            id
        );

        if (consulta) {

            await agendaEvents.consultaCancelada(
                tenantId,
                consulta
            );

        }

        return;

    }

    throw new Error("Sem permissão");

}

async function listarRealizadas(tenantId) {
    return await repo.listarRealizadas(tenantId);
}

async function buscarPorId(tenantId, id) {
    return await repo.buscarPorId(tenantId, id);
}

module.exports = {
    criarConsulta,
    listarConsultas,
    editarConsulta,
    deletarConsulta,
    listarRealizadas,
    buscarPorId
};