'use strict';

const mysqlPool = require('../../../ddbb/mysql-pool');

async function getLibrary(req, res) {
    const { uuid } = req.claims;
    const connection = await mysqlPool.getConnection();
    const sqlQuery = `SELECT 
    title, 
    owner_uuid, 
    author_name, 
    author_surname, 
    created_at 
    FROM books
    WHERE uuid != '${uuid}'`;

    try {
        const [ library ] = await connection.query(sqlQuery);
        connection.release();
        return res.status(200).send(library);
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

module.exports = getLibrary;