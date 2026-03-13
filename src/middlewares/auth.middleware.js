const { auth } = require("../config/firebase");

async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    const decoded = await auth.verifyIdToken(token);

    req.user = decoded;

    next();

  } catch (error) {
    res.status(401).json({ error: "Token inválido" });
  }
}

module.exports = authMiddleware;