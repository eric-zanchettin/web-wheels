const db = require('../../../config/db');

module.exports = {
    async findSearched(filter, limit, offset) {
        let query =
        `SELECT
        CA.*,
        UA.city
        FROM car_ads CA
        LEFT JOIN users_address UA ON UA.user_id = CA.user_id
        WHERE 1=1`

        if (filter) {
            const keys = Object.keys(filter);
            for (key of keys) {
                if (key.includes('from_') || key.includes('until_')) {
                    const identify = key.split('_');

                    if (identify[0] == 'from' && filter[key] != '') {
                        query +=
                        `
                        AND ${identify[1].replace('caryear', 'car_year')} >= ${filter[key]}`
                    } else if (identify[0] == 'until' && filter[key] != '') {
                        query +=
                        `
                        AND ${identify[1].replace('caryear', 'car_year')} <= ${filter[key]}`
                    };

                } else {
                    let operator = `= '`;
                    let end = `'`
                    
                    if (!Number(filter[key])) {
                        operator = `ILIKE '%`;
                        end = `%'`
                    };
    
                    if (key != 'sort') query += ` AND ${key} ${operator}${filter[key]}${end}`;
                };
            };
        };

        let sort = 'ORDER BY '
        if (filter.sort == 'access') {
            sort += 'access DESC'
        } else if (filter.sort == 'max-price') {
            sort += 'price DESC'
        } else if (filter.sort == 'min-price') {
            sort += 'price ASC'
        };

        if (sort == 'ORDER BY ') sort += 'id ASC'

        query +=
        `
        ${sort}
        LIMIT $1
        OFFSET $2`

        let values = [
            limit,
            offset
        ];

        const results = await db.query(query, values);

        return results.rows;
    },
};