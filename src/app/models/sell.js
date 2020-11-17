const { query } = require('../../../config/db');
const db = require('../../../config/db');
const { update } = require('./users');

module.exports = {
    async getFabricators() {
        const result = await db.query('SELECT * FROM fabricators');

        return result.rows;
    },

    async getModels() {
        const result = await db.query('SELECT * FROM models');

        return result.rows;
    },

    async insert(data, user_id) {
        let query = `INSERT INTO car_ads (
            car_model,
            car_year,
            gas_type,
            car_type,
            cambium,
            color,
            km,
            plate_num,
            ipva,
            owner,
            description,
            itens_array,
            price,
            user_id
        ) VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10,
            $11,
            $12,
            $13,
            $14
        )
        RETURNING id`

        let values = [
            data.car_model,
            data.car_year,
            data.gas_type,
            data.car_type,
            data.cambium,
            data.color,
            data.km,
            data.plate_num,
            data.ipva,
            data.owner,
            data.description,
            data.itens_array,
            data.price,
            user_id,
        ]

        let results = await db.query(query, values);
        return results.rows[0].id;
    },

    async getAdById(ad_id) {
        let results = await db.query(`
            SELECT
            CA.*,
            U.name,
            UA.city
            FROM car_ads CA
            LEFT JOIN users U ON U.id = CA.user_id
            LEFT JOIN users_address UA ON UA.user_id = U.id
            WHERE CA.id = ${ad_id}
        `);
        return results.rows[0];
    },

    async update(data, adId) {
        const keys = Object.keys(data);

        let query = `UPDATE car_ads SET`

        let comma = ',';
        keys.map((key, index) => {
            if (index == keys.length - 1) comma = '';

            if (key != 'car_model') {
                query += ` ${key} = '${data[key]}'${comma}`
            };
        });

        query += ` WHERE id = ${adId}`

        await db.query(query);

        return;
    },

    async delete(id) {
        await db.query(`DELETE FROM car_ads
        WHERE id = $1`, [id]);

        return;
    },
};