const db = require('../../../config/db');

module.exports = {
    async findAll() {
        const result = await db.query(`
            SELECT
            CONCAT(F.name, ' ', M.name) AS carname
            FROM fabricators F
            LEFT JOIN models M ON M.fabric_id = F.id
            GROUP BY F.name, M.name
            HAVING COUNT(M.name) > 0
            ORDER BY carname ASC`
        );

        return result.rows;
    },
};