const db = require('../../../config/db');

module.exports = {
    async insert(data, ad_id) {
        let query = `INSERT INTO car_photos (
            file_name,
            path,
            ad_id
        ) VALUES (
            $1,
            $2,
            $3
        )`;

        let values = [
            data.filename,
            data.path,
            ad_id,
        ];

        await db.query(query, values);
        return;
    },

    async getPhotosByAdId(ad_id) {
        let result = await db.query(`SELECT * FROM car_photos WHERE ad_id = ${ad_id}`)

        return result.rows;
    },
};