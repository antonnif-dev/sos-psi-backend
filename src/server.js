const app = require("./app");

const PORT = process.env.PORT || 5000;

const { iniciarScheduler } = require("./utils/scheduler");
iniciarScheduler();

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});