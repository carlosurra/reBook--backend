'use strict';

const mysqlPool = require('../../../ddbb/mysql-pool');

async function getUserProfile(req, res, next) {
  const { uuid } = req.claims;

  const connection = await mysqlPool.getConnection();
  const sqlQuery = `SELECT users.uuid, avatar, name FROM users WHERE uuid = '${uuid}';`;

  try {
    const [userProfile] = await connection.query(sqlQuery);
    connection.release();

  return res.status(200).send(userProfile);
} catch (e) {
  return res.status(500).send(e.message);
}
}

module.exports = getUserProfile;
