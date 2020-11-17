const db = require('../../../config/db');

module.exports = {
    async findOne(searchField) {
        const keys = Object.keys(searchField);
        let query = ``;

        keys.map(key => {
            let operator = ``;
            if (key != 'user_id') {
                operator = 'ILIKE';
            } else {
                operator = '=';
            };

            query += `SELECT * FROM users_address WHERE ${key} ${operator} '${searchField[key]}'`;
        });

        const result = await db.query(query);
        
        return result.rows[0];
    },
    
    async insert(data) {
        let query = `INSERT INTO users_address (
            cep,
            road,
            neighborhood,
            city,
            complement,
            reference,
            user_id,
            phone
        ) VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8
        )`

        let values = [data.cep, data.road, data.neighborhood, data.city, data.complement, data.reference, data.user_id, data.phone];

        await db.query(query, values);

        return;
    },

    async update(fields, id) {
        const keys = Object.keys(fields);

        let query = `UPDATE users_address SET `
        keys.map((key, index) => {
            query += `${key} = '${fields[key]}'`;
            index != keys.length - 1 ? query += ', ' : query += ' ';
        });
        query += `WHERE user_id = '${id}'`

        await db.query(query);

        return;
    },
};