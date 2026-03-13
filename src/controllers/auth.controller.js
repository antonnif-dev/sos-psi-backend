const service = require("../services/auth.service");

async function registerAdmin(req, res) {

 try {

  const result = await service.registerAdmin(req.body);

  res.json(result);

 } catch (error) {

  res.status(400).json({ error: error.message });

 }

}

module.exports = {
 registerAdmin
};