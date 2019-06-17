'use strict';

const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const mysqlPool = require('../../../ddbb/mysql-pool');

async function validateData(payload) {
  const schema = {
    email: Joi
    .string()
    .email({ minDomainAtoms: 2 })
    .required(),
    password: Joi
    .string()
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
  };

  return Joi.validate(payload, schema);
}

async function login(req, res, next) {
  console.log("Hello")
  /**
   * Validar datos de entrada con Joi
   */
  const accountData = { ...req.body };
  try {
    await validateData(accountData);
  } catch (e) {
    return res.status(400).send(e);
  }

  /**
   * Check si existe el usuario en la bbdd
   */
  try {
    const connection = await mysqlPool.getConnection();
    const sqlQuery = `SELECT
    FROM users
    WHERE email = '${accountData.email}'`;

    const [result] = await connection.query(sqlQuery);
    if (result.length === 1) {
      const userData = result[0];
      if (!userData.activated_at) {
        return res.status(403).send();
      }

      /**
       * Paso3: La clave es valida?
       */
      const checkPassword = await bcrypt.compare(accountData.password, userData.password);
      if (checkPassword === false) { 
         return res.status(401).send();
      }

      /**
       * Paso 4: Generar token JWT con uuid + role (admin) asociado al token
       * La duración del token es de 1 minuto (podria ir en variable de entorno)
       */
      const payloadJwt = {
        uuid: userData.uuid,
      };

      const jwtTokenExpiration = parseInt(process.env.AUTH_ACCESS_TOKEN_TTL, 10);
      const token = jwt.sign(payloadJwt, process.env.AUTH_JWT_PASS, { expiresIn: jwtTokenExpiration });
      const response = {
        accessToken: token,
        expiresIn: jwtTokenExpiration,
      };

      return res.status(200).json(response);
    }

    return res.status(404).send("Wrong credentials");
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = login;
