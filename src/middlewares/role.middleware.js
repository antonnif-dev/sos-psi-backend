function roleMiddleware(rolesPermitidas) {
  return (req, res, next) => {
    
    if (!req.role) {
      return res.status(403).json({ error: "Role não definida" });
    }

    if (!rolesPermitidas.includes(req.role)) {
      return res.status(403).json({ error: "Sem permissão" });
    }

    next();
  };
}

module.exports = roleMiddleware;