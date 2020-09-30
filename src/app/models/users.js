const db = require('../../../config/db');
const { hash } = require('bcryptjs');

module.exports = {
    async findOne(email) {
        const query = `
            SELECT * FROM users
            WHERE email ILIKE '${email}'
        `

        let results = await db.query(query);

        return results.rows[0];
    },
    
    async insert(data) {
        const query = `
            INSERT INTO users (
                name,
                birth_date,
                email,
                cpf_cnpj,
                password
            ) VALUES (
                $1,
                $2,
                $3,
                $4,
                $5
            )
            RETURNING id
        `

        const passwordHash = await hash(data.password, 8);

        const values = [data.name, data.birth_date, data.email, data.cpf_cnpj, passwordHash];
        
        try {
            const results = await db.query(query, values);
            return results.rows[0];  
        } catch (err) {
            console.log(err);
            return;
        };
    },

    async update(fields, id) {
        const keys = Object.keys(fields);

        let query = `UPDATE users
            SET `

        keys.map((key, index) => {
            query += `${key} = '${fields[key]}'`
            index != (keys.length - 1) ? query += ',' : query += '';
        });

        query += `WHERE id = ${id}`

        await db.query(query);
        
        return;
    },
};