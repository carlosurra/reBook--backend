'use strict';
const mysqlPool = require('../../../ddbb/mysql-pool');

async function getLibraryByUuid(req, res) {
  const connection = await mysqlPool.getConnection();
  const { uuid: uuid } = req.query;
  const sqlQuery = `SELECT 
  id, 
  users_uuid, 
  title, 
  author, 
  description, 
  cover 
  FROM books
  WHERE uuid = '${uuid}'`;

  try {
    const [library] = await connection.query(sqlQuery);
    connection.release();
    return res.status(200).send(library);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = getLibraryByUuid;