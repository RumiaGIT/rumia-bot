const {Pool} = require("pg");
const pool = new Pool({
    user: 'rumia',
    host: 'localhost',
    database: 'rumiabot',
    password: 'rumia',
    port: 5432
});

module.exports.query = async(q) => {
    const result = await pool.query(q);
    return result.rows;
}

module.exports.first = async(q) => {
    const result = await pool.query(q);
    return result.rows[0];
}