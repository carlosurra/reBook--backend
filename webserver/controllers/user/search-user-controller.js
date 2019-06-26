"use strict";

const Joi = require("joi");
const mysqlPool = require("../../../ddbb/mysql-pool");

async function getUsers(req, res){
  const{ uuid } = req.claims;
  const connection = await mysqlPool.getConnection();
  const getUsersQuery = `SELECT * FROM users ORDER BY name;`;

  try {
    const [ users ] = await connection.query(getUsersQuery);
    connection.release();
    return res.status(200).send(users);
  } catch (e) {
    if (connection){
      connection.release();
    } return res.status(500).send(e.message);
  }
}

module.exports = getUsers;

