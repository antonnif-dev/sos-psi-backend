const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./routes/auth.routes");
const pacientesRoutes = require("./routes/pacientes.routes");
const agendaRoutes = require("./routes/agenda.routes");
const prontuarioRoutes = require("./routes/prontuario.routes");
const financeiroRoutes = require("./routes/financeiro.routes");
const documentosRoutes = require("./routes/documentos.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const medicamentosRoutes = require("./routes/medicamentos.routes");
const prescricoesRoutes = require("./routes/prescricoes.routes");
const notificacoesRoutes = require("./routes/notificacoes.routes");

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://sos-psi-frontend.vercel.app"
  ],
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("API SaaS Psicólogos funcionando");
});

//pacientes
app.use("/pacientes", pacientesRoutes);

//auth
app.use("/auth", authRoutes);

//agenda
app.use("/agenda", agendaRoutes);

//prontuario
app.use("/prontuario", prontuarioRoutes);

//financeiro
app.use("/financeiro", financeiroRoutes);

//documentos
app.use("/documentos", documentosRoutes);

//dashboard
app.use("/dashboard", dashboardRoutes);

//medicamentos
app.use("/medicamentos", medicamentosRoutes);

//prescrições
app.use("/prescricoes", prescricoesRoutes);

//notificações
app.use("/notificacoes", notificacoesRoutes);

module.exports = app;