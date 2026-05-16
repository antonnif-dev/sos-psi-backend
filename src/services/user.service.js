const repository = require("../repositories/user.repository");

async function listarUsuarios(tenantId) {

    return await repository.listarUsuarios(tenantId);
}

module.exports = {
    listarUsuarios
};