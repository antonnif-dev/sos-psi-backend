require("dotenv").config();

const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function enviarEmail({ para, assunto, html }) {
  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: para,
      subject: assunto,
      html: html,
    });

    console.log("EMAIL ENVIADO:", response);

  } catch (error) {
    console.error("ERRO AO ENVIAR EMAIL:", error);
  }
}

module.exports = {
  enviarEmail,
};