'use strict';

const mySqlPool = require('../../../ddbb/mysql-pool');
async function deleteBook(req, res) {
  const { id: id } = req.params;

  const connection = await mySqlPool.getConnection();
  const deleteBookQuery = `DELETE FROM books WHERE id = '${id}'`;

  try {
    await connection.query(deleteBookQuery);
    connection.release();
    return res.status(200).send();
  } catch (e) {
    if (connection) {
      connection.release();
    }
    return res.status(500).send(e.message);
  }
}

module.exports = deleteBook;