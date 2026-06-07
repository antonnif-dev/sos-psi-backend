const { db } = require("../config/firebase");
const { v4: uuid } = require("uuid");
const { collection, query, where, getDocs } = require('firebase/firestore');
const { Timestamp } = require("firebase-admin/firestore");

async function criarConsulta(tenantId, data) {
  const id = uuid();
  await db
    .collection("tenants")
    .doc(tenantId)
    .collection("agenda")
    .doc(id)
    .set({
      id,
      ...data,
      data: Timestamp.fromDate(new Date(data.data)),
      createdAt: Timestamp.now()
    });
  return id;
}

async function listarConsultas(tenantId) {
  if (!tenantId) return [];

  const snapshot = await db
    .collection("tenants")
    .doc(tenantId)
    .collection("agenda")
    .get();

  return snapshot.docs.map(doc => {

    const data = doc.data();
    console.log("📄 RAW FIRESTORE DOC", {
      id: doc.id,
      tipo: data.tipo,
      dataOriginal: data.data,
      tipoData: typeof data.data,
      possuiToDate: !!data.data?.toDate
    });
    function converter(valor) {

      if (!valor) return null;

      // Timestamp Firestore
      if (valor.toDate) {
        return valor.toDate().toISOString();
      }

      // number (timestamp JS)
      if (typeof valor === "number") {
        const teste = new Date(valor);

        if (isNaN(teste.getTime())) {

          console.error("❌ STRING DE DATA INVÁLIDA", valor);

          return null;

        }
        return new Date(valor).toISOString();
      }

      // string
      if (typeof valor === "string") {
        return new Date(valor).toISOString();
      }

      return valor;

    }

    return {
      id: doc.id,
      ...data,
      data: converter(data.data),
      createdAt: converter(data.createdAt),
      updatedAt: converter(data.updatedAt)
    };

  });

}

async function listarConsultasPorPsicologo(
  tenantId,
  psicologoId
) {

  try {

    console.log("📅 [REPOSITORY] Buscando consultas do psicólogo");
    console.log("🏢 Tenant:", tenantId);
    console.log("🧑 Psicólogo:", psicologoId);

    const snapshot = await db
      .collection("tenants")
      .doc(tenantId)
      .collection("agenda")
      .where("psicologoId", "==", psicologoId)
      .get();

    console.log("📄 Documentos encontrados:", snapshot.size);

    const consultas = snapshot.docs.map(doc => {

      const data = doc.data();

      function converter(valor) {

        if (!valor) return null;

        if (valor.toDate) {
          return valor.toDate().toISOString();
        }

        if (typeof valor === "number") {
          return new Date(valor).toISOString();
        }

        if (typeof valor === "string") {
          return new Date(valor).toISOString();
        }

        return valor;

      }

      return {
        id: doc.id,
        ...data,
        data: converter(data.data),
        createdAt: converter(data.createdAt),
        updatedAt: converter(data.updatedAt)
      };

    });

    console.log("✅ Consultas convertidas:", consultas.length);

    return consultas;

  } catch (error) {

    console.error("❌ Erro ao listar consultas do psicólogo:", error);

    return [];

  }

}

async function editarConsulta(tenantId, id, data) {
  const { Timestamp } = require("firebase-admin/firestore");
  await db
    .collection("tenants")
    .doc(tenantId)
    .collection("agenda")
    .doc(id)
    .update({
      ...data,
      updatedAt: Timestamp.now()
    });
}

async function deletarConsulta(tenantId, id) {
  await db
    .collection("tenants")
    .doc(tenantId)
    .collection("agenda")
    .doc(id)
    .delete();
}

async function listarRealizadas(tenantId) {
  const snapshot = await db
    .collection("tenants")
    .doc(tenantId)
    .collection("agenda")
    .where("status", "==", "realizada")
    .get();

  return snapshot.docs.map(doc => {
    const data = doc.data();

    function converter(valor) {
      if (!valor) return null;
      if (valor.toDate) {
        return valor.toDate().toISOString();
      }
      if (typeof valor === "number") {
        return new Date(valor).toISOString();
      }
      if (typeof valor === "string") {
        return new Date(valor).toISOString();
      }
      return valor;
    }

    return {
      id: doc.id,
      ...data,
      data: converter(data.data),
      createdAt: converter(data.createdAt),
      updatedAt: converter(data.updatedAt)
    };
  });
}

async function buscarSessoesFuturas(tenantId, pacienteId) {
  try {
    if (!tenantId || !pacienteId) return [];
    const agora = new Date();

    const snapshot = await db
      .collection("tenants")
      .doc(tenantId)
      .collection("agenda")
      .where("pacienteId", "==", pacienteId)
      .where("data", ">", agora)
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

  } catch (error) {
    console.error("Erro ao buscar sessões futuras:", error);
    return [];
  }
}

async function buscarPorId(tenantId, id) {
  const doc = await db
    .collection("tenants")
    .doc(tenantId)
    .collection("agenda")
    .doc(id)
    .get();

  return doc.exists ? doc.data() : null;
}

async function consultaPertenceAoPsicologo(
  tenantId,
  consultaId,
  psicologoId
) {

  try {

    console.log("🔒 Verificando ownership da consulta");

    console.log("🏢 Tenant:", tenantId);

    console.log("📄 Consulta:", consultaId);

    console.log("🧑 Psicólogo:", psicologoId);

    const doc = await db
      .collection("tenants")
      .doc(tenantId)
      .collection("agenda")
      .doc(consultaId)
      .get();

    if (!doc.exists) {

      console.log("❌ Consulta não encontrada");

      return false;

    }

    const consulta = doc.data();

    console.log("📋 Consulta encontrada:", {
      psicologoId: consulta.psicologoId,
      status: consulta.status
    });

    const pertence =
      consulta.psicologoId === psicologoId;

    console.log("✅ Ownership:", pertence);

    return pertence;

  } catch (error) {

    console.error(
      "❌ Erro ao validar ownership:",
      error
    );

    return false;

  }

}

async function listarPorPaciente(tenantId, pacienteId) {
  if (!tenantId || !pacienteId) return [];

  const snapshot = await db
    .collection("tenants")
    .doc(tenantId)
    .collection("agenda")
    .where("pacienteId", "==", pacienteId)
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

async function listarConsultasPorPeriodo(
  tenantId,
  startDate,
  endDate
) {

  try {

    console.log("📅 [REPOSITORY] Buscando consultas por período");

    console.log("🏢 Tenant:", tenantId);

    console.log("📆 Início:", startDate);

    console.log("📆 Fim:", endDate);

    const inicio = new Date(startDate);

    inicio.setHours(0, 0, 0, 0);

    const fim = new Date(endDate);

    fim.setHours(23, 59, 59, 999);
    console.log("🧪 TIPOS DA QUERY");
    console.log("inicio instanceof Date:", inicio instanceof Date);
    console.log("fim instanceof Date:", fim instanceof Date);
    console.log("inicio:", inicio);
    console.log("fim:", fim);
    console.log("inicio ISO:", inicio.toISOString());
    console.log("fim ISO:", fim.toISOString());
    const snapshot = await db
      .collection("tenants")
      .doc(tenantId)
      .collection("agenda")
      .where("data", ">=", inicio)
      .where("data", "<=", fim)
      .get();
    console.log("📄 Snapshot vazio?", snapshot.empty);
    console.log("📄 Quantidade:", snapshot.size);

    console.log("📄 Documentos encontrados:", snapshot.size);

    const consultas = snapshot.docs.map(doc => {

      const data = doc.data();

      function converter(valor) {

        if (!valor) return null;

        if (valor.toDate) {
          return valor.toDate().toISOString();
        }

        if (typeof valor === "number") {
          return new Date(valor).toISOString();
        }

        if (typeof valor === "string") {
          return new Date(valor).toISOString();
        }

        return valor;

      }

      return {
        id: doc.id,
        ...data,
        data: converter(data.data),
        createdAt: converter(data.createdAt),
        updatedAt: converter(data.updatedAt)
      };

    });

    console.log("📅 EVENTOS DA COLEÇÃO AGENDA:");

    consultas.forEach(c => {
      console.log({
        id: c.id,
        tipo: c.tipo,
        data: c.data
      });
    });

    console.log("✅ Consultas convertidas:", consultas.length);

    return consultas;

  } catch (error) {

    console.error(
      "❌ Erro ao buscar consultas por período:",
      error
    );

    return [];

  }

}

async function listarConsultasPorPsicologoEPeriodo(
  tenantId,
  psicologoId,
  startDate,
  endDate
) {

  try {

    console.log("📅 [REPOSITORY] Buscando consultas do psicólogo por período");

    console.log("🏢 Tenant:", tenantId);

    console.log("🧑 Psicólogo:", psicologoId);

    console.log("📆 Início:", startDate);

    console.log("📆 Fim:", endDate);

    const inicio = new Date(startDate);

    const fim = new Date(endDate);

    const snapshot = await db
      .collection("tenants")
      .doc(tenantId)
      .collection("agenda")
      .where("psicologoId", "==", psicologoId)
      .where("data", ">=", inicio)
      .where("data", "<=", fim)
      .get();

    console.log("📄 Documentos encontrados:", snapshot.size);

    const consultas = snapshot.docs.map(doc => {

      const data = doc.data();

      function converter(valor) {

        if (!valor) return null;

        if (valor.toDate) {
          return valor.toDate().toISOString();
        }

        if (typeof valor === "number") {
          return new Date(valor).toISOString();
        }

        if (typeof valor === "string") {
          return new Date(valor).toISOString();
        }

        return valor;

      }

      return {
        id: doc.id,
        ...data,
        data: converter(data.data),
        createdAt: converter(data.createdAt),
        updatedAt: converter(data.updatedAt)
      };

    });

    console.log("✅ Consultas convertidas:", consultas.length);

    return consultas;

  } catch (error) {

    console.error(
      "❌ Erro ao buscar consultas do psicólogo por período:",
      error
    );

    return [];

  }

}

module.exports = {
  criarConsulta,
  listarConsultas,
  listarConsultasPorPsicologo,
  editarConsulta,
  deletarConsulta,
  listarRealizadas,
  buscarSessoesFuturas,
  buscarPorId,
  consultaPertenceAoPsicologo,
  listarPorPaciente,
  listarConsultasPorPeriodo,
  listarConsultasPorPsicologoEPeriodo,
};