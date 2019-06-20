'use strict';

const mysqlPool = require('../../../ddbb/mysql-pool');

async function getLibrary(req, res) {
    const { uuid } = req.claims;
    const connection = await mysqlPool.getConnection();
    const sqlQuery = `SELECT 
    name,
    title, 
    users_uuid, 
    author, 
    description,
    cover
    FROM books inner JOIN users ON (books.users_uuid = users.uuid)
    WHERE users_uuid = '${uuid}'`;

    try {
        const [ library ] = await connection.query(sqlQuery);
        connection.release();
        return res.status(200).send(library);
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

module.exports = getLibrary;