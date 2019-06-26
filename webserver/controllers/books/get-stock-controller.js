"use strict";

const Joi = require("joi");
const mysqlPool = require("../../../ddbb/mysql-pool");

async function getStock(req, res){
  const{ uuid } = req.claims;
  const connection = await mysqlPool.getConnection();
  const getStockQuery = `SELECT * FROM books ORDER BY title;`;

  try {
    const [ users ] = await connection.query(getStockQuery);
    connection.release();
    return res.status(200).send(users);
  } catch (e) {
    if (connection){
      connection.release();
    } return res.status(500).send(e.message);
  }
}

module.exports = getStock;
