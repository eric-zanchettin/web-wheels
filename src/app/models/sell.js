const db = require('../../../config/db');

module.exports = {
    async getFabricators() {
        const result = await db.query('SELECT * FROM fabricators');

        return result.rows;
    },

    async getModels() {
        const result = await db.query('SELECT * FROM models');

        return result.rows;
    },
};