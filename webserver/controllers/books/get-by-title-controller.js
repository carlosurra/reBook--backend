'use strict';

const mysqlPool = require('../../../ddbb/mysql-pool');

async function getByTitle(req, res) {
    const connection = await mysqlPool.getConnection();
    const { title: title } = req.query;
    const sqlQuery = `SELECT title, owner_uuid, author_name, author_surname, created_at FROM books
    WHERE title = '${title}`;

    try{
        const [bookList] = await connection.query(sqlQuery);
        connection.release();
        return res.status(200).send(bookList);
    }catch (e) {
        return res.status(500).send(e.message);
    }
}

module.exports = getByTitle;